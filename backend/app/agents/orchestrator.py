import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.models import (
    Report,
    AIResult,
    AgentRun,
    Score,
    Recommendation,
)
from app.tools.tools import (
    analyze_image,
    get_sensor_data,
    get_historical_observations,
    get_community_reports,
    get_map_context,
    calculate_priority,
    create_recommendation,
    request_additional_evidence,
    request_human_review,
)
from app.services.ai_service import analyze_image as vision_model


class Orchestrator:
    def __init__(self, db: Session):
        self.db = db

    def _assess_evidence_sufficiency(self, evidence):
        visual = evidence.get("visual", {})
        observation_type = evidence.get("observation_type", "general")

        visual_indicators = visual.get("visual_indicators", [])
        visual_confidence = float(visual.get("confidence", 0) or 0)
        visual_needs_review = bool(visual.get("needs_review", True))

        has_visual = bool(visual_indicators)
        has_sensor = bool(evidence.get("sensor"))
        has_history = evidence.get("historical_count", 0) > 0
        has_community = evidence.get("community_count", 0) > 0

        available_signals = sum([
            has_visual,
            has_sensor,
            has_history,
            has_community,
        ])

        if visual_needs_review or visual_confidence < 0.45:
            return {
                "sufficient": False,
                "reason": "Visual evidence is insufficient or uncertain.",
                "available_signals": available_signals,
                "observation_type": observation_type,
            }

        if observation_type == "marine_debris":
            return {
                "sufficient": True,
                "reason": "Clear visual evidence is sufficient for marine debris observation.",
                "available_signals": available_signals,
                "observation_type": observation_type,
            }

        if observation_type == "water_appearance":
            return {
                "sufficient": True,
                "reason": (
                    "Clear visual evidence is sufficient for water appearance "
                    "assessment; it does not establish laboratory water quality."
                ),
                "available_signals": available_signals,
                "observation_type": observation_type,
            }

        if observation_type == "general":
            if has_visual and visual_confidence >= 0.75:
                return {
                    "sufficient": True,
                    "reason": "Confident visual evidence is available for the general observation.",
                    "available_signals": available_signals,
                    "observation_type": observation_type,
                }

        if available_signals >= 2:
            return {
                "sufficient": True,
                "reason": "Multiple evidence signals are available.",
                "available_signals": available_signals,
                "observation_type": observation_type,
            }

        return {
            "sufficient": False,
            "reason": "Additional evidence is needed before stronger prioritization.",
            "available_signals": available_signals,
            "observation_type": observation_type,
        }

    def run(self, report: Report):

        def trace(agent, tool, status, output):
            self.db.add(
                AgentRun(
                    report_id=report.id,
                    agent_name=agent,
                    tool_name=tool,
                    status=status,
                    output_json=json.dumps(output, default=str),
                )
            )
            self.db.commit()

        evidence = {
            "report_id": report.id,
            "observation_type": report.observation_type or "general",
            "description": report.description or "",
            "location": get_map_context(
                self.db,
                report.latitude,
                report.longitude,
            ),
        }

        # ---------------------------------------------------------
        # 1. Discover available evidence
        # ---------------------------------------------------------

        sensors = get_sensor_data(self.db, report.site_id)
        hist = get_historical_observations(self.db, report.site_id)
        community = get_community_reports(self.db, report.site_id)

        evidence["sensor"] = [
            {
                "type": s.sensor_type,
                "value": s.value,
                "unit": s.unit,
                "source": s.source,
            }
            for s in sensors
        ]

        turbidity_readings = [
            s for s in sensors
            if s.sensor_type == "turbidity"
        ]

        evidence["sensor_anomaly"] = any(
            s.value > 18 for s in turbidity_readings
        )

        evidence["historical_count"] = len(hist)
        evidence["community_count"] = len(community)

        # ---------------------------------------------------------
        # 2. Dynamic routing decision
        # ---------------------------------------------------------

        selected_agents = []
        routing_reasons = {}

        if report.image:
            selected_agents.append("Vision Agent")
            routing_reasons["Vision Agent"] = "Image evidence is available."

        if sensors:
            selected_agents.append("IoT/Data Agent")
            routing_reasons["IoT/Data Agent"] = (
                f"{len(sensors)} sensor readings are available."
            )

        if hist:
            selected_agents.append("Historical/Trend Agent")
            routing_reasons["Historical/Trend Agent"] = (
                f"{len(hist)} historical observations are available."
            )

        if report.image or community:
            selected_agents.append("Environmental Agent")
            routing_reasons["Environmental Agent"] = (
                "Environmental context can be interpreted from "
                "visual and/or community evidence."
            )

        # Risk and recommendation are downstream agents.
        selected_agents.append("Risk/Priority Agent")
        routing_reasons["Risk/Priority Agent"] = (
            "Runs after available evidence has been assembled."
        )

        selected_agents.append("Recommendation Agent")
        routing_reasons["Recommendation Agent"] = (
            "Runs after the priority assessment."
        )

        trace(
            "Orchestrator Agent",
            "routing",
            "completed",
            {
                "selected": selected_agents,
                "reasons": routing_reasons,
                "evidence_available": {
                    "image": bool(report.image),
                    "sensors": len(sensors),
                    "historical": len(hist),
                    "community_reports": len(community),
                },
            },
        )

        # ---------------------------------------------------------
        # 3. Vision Agent — only when image exists
        # ---------------------------------------------------------

        if report.image:
            report.image.analysis_status = "processing"
            self.db.commit()

            result = analyze_image(
                Path(report.image.file_path),
                vision_model,
            )

            ai = AIResult(
                report_id=report.id,
                agent_name="Vision Agent",
                indicators_json=json.dumps(
                    result.get("visual_indicators", [])
                ),
                confidence=float(
                    result.get("confidence", 0)
                ),
                summary=result.get("summary", ""),
                limitations=result.get("limitations", ""),
                needs_review=bool(
                    result.get("needs_review", True)
                ),
            )

            self.db.add(ai)
            self.db.commit()

            evidence["visual"] = result

            report.image.analysis_status = (
                "completed"
                if result.get("confidence", 0) > 0
                else "needs_review"
            )

            self.db.commit()

            trace(
                "Vision Agent",
                "analyze_image",
                "completed",
                result,
            )

        else:
            evidence["visual"] = {
                "visual_indicators": [],
                "confidence": 0,
                "needs_review": True,
                "summary": "No image supplied.",
                "limitations": "Image evidence is unavailable.",
            }

        # ---------------------------------------------------------
        # 4. IoT/Data Agent — only when readings exist
        # ---------------------------------------------------------

        if sensors:
            trace(
                "IoT/Data Agent",
                "get_sensor_data",
                "completed",
                {
                    "count": len(sensors),
                    "source": sorted(
                        set(s.source for s in sensors)
                    ),
                    "anomaly": evidence["sensor_anomaly"],
                },
            )

        # ---------------------------------------------------------
        # 5. Historical/Trend Agent — only when history exists
        # ---------------------------------------------------------

        if hist:
            trace(
                "Historical/Trend Agent",
                "get_historical_observations",
                "completed",
                {
                    "count": len(hist),
                },
            )

        # ---------------------------------------------------------
        # 6. Environmental Agent — conditional
        # ---------------------------------------------------------

        if report.image or community:
            trace(
                "Environmental Agent",
                "context_interpretation",
                "completed",
                {
                    "community_count": len(community),
                    "interpretation": (
                        "Visual and community evidence are contextual "
                        "signals and are not treated as laboratory diagnosis."
                    ),
                },
            )

        # ---------------------------------------------------------
        # 7. Evidence Sufficiency Gate
        # ---------------------------------------------------------

        evidence_gate = self._assess_evidence_sufficiency(evidence)

        trace(
            "Orchestrator Agent",
            "evidence_gate",
            "completed",
            evidence_gate,
        )

        # ---------------------------------------------------------
        # 7. Evidence Request Decision
        # ---------------------------------------------------------

        evidence_request = request_additional_evidence(evidence, evidence_gate)

        trace(
            "Orchestrator Agent",
            "request_additional_evidence",
            "completed",
            evidence_request,
        )

        evidence["sufficiency"] = evidence_gate
        evidence["additional_evidence_request"] = evidence_request

        if not evidence_gate["sufficient"]:
            request_human_review(self.db, report.id)
            report.status = "needs_review"

            trace(
                "Verification Agent / Human",
                "evidence_gate",
                "completed",
                {
                    "status": report.status,
                    "reason": evidence_gate["reason"],
                    "additional_evidence": evidence_request["requested"],
                },
            )

            self.db.commit()

            return {
                "priority": {
                    "score": 0,
                    "level": "Needs Review",
                    "reasons": [
                        evidence_gate["reason"],
                    ],
                },
                "recommendation": {
                    "type": "Needs Review",
                    "message": (
                        "Additional evidence or human/field verification "
                        "is required before stronger prioritization."
                    ),
                },
                "evidence": evidence,
                "routing": {
                    "selected_agents": selected_agents,
                    "reasons": routing_reasons,
                },
            }

        # ---------------------------------------------------------
        # 8. Risk / Priority Agent
        # ---------------------------------------------------------

        priority = calculate_priority(evidence)

        score = Score(
            report_id=report.id,
            site_id=report.site_id,
            score=priority["score"],
            level=priority["level"],
            reasons_json=json.dumps(
                priority["reasons"]
            ),
        )

        self.db.add(score)
        self.db.commit()

        trace(
            "Risk/Priority Agent",
            "calculate_priority",
            "completed",
            priority,
        )

        # ---------------------------------------------------------
        # 8. Recommendation Agent
        # ---------------------------------------------------------

        rec = create_recommendation(
            evidence,
            priority,
        )

        self.db.add(
            Recommendation(
                report_id=report.id,
                action=rec["action"],
                rationale=rec["rationale"],
            )
        )

        self.db.commit()

        trace(
            "Recommendation Agent",
            "create_recommendation",
            "completed",
            rec,
        )

        # ---------------------------------------------------------
        # 9. Human Verification Gate
        # ---------------------------------------------------------

        if (
            priority["level"] == "Needs Review"
            or evidence["visual"].get("needs_review")
        ):
            request_human_review(
                self.db,
                report.id,
            )

            report.status = "needs_review"

            trace(
                "Verification Agent / Human",
                "request_human_review",
                "completed",
                {
                    "status": report.status,
                    "reason": "Evidence requires human review.",
                },
            )

        else:
            report.status = "analyzed"

            trace(
                "Verification Agent / Human",
                "verification_gate",
                "completed",
                {
                    "status": report.status,
                    "reason": "Evidence passed the automated review gate.",
                },
            )

        self.db.commit()

        return {
            "priority": priority,
            "recommendation": rec,
            "evidence": evidence,
            "routing": {
                "selected_agents": selected_agents,
                "reasons": routing_reasons,
            },
        }
