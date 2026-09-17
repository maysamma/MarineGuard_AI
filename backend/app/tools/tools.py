import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.models import Site, SensorReading, Observation, Report, Score, Verification

def analyze_image(image_path, ai_service):
    return ai_service(image_path)

def get_sensor_data(db: Session, site_id: int, time_range_hours=168):
    since=datetime.now(timezone.utc)-timedelta(hours=time_range_hours)
    return db.query(SensorReading).filter(SensorReading.site_id==site_id, SensorReading.timestamp>=since).order_by(SensorReading.timestamp.desc()).all()

def get_historical_observations(db: Session, site_id: int):
    return db.query(Observation).filter(Observation.site_id==site_id).order_by(Observation.created_at.desc()).limit(12).all()

def get_community_reports(db: Session, site_id: int, time_range_days=90):
    since=datetime.now(timezone.utc)-timedelta(days=time_range_days)
    return db.query(Report).filter(Report.site_id==site_id, Report.created_at>=since).order_by(Report.created_at.desc()).all()

def get_map_context(db: Session, lat: float, lon: float):
    # Lightweight geographic context for MVP; no unsupported protected-area claims.
    return {"latitude":lat,"longitude":lon,"context":"Community marine observation point"}

def calculate_priority(evidence):
    visual = evidence.get("visual", {})
    indicators = visual.get("visual_indicators", [])

    positive_status_terms = (
        "detected",
        "possible",
        "present",
        "widespread",
        "significant",
        "accumulation",
        "debris",
        "anomaly",
        "turbid",
        "hazy",
        "unusual",
        "poor",
        "degraded",
        "abnormal",
    )

    negative_status_terms = (
        "absent",
        "not_detected",
        "none",
        "normal",
        "typical",
        "clear",
        "healthy",
    )

    visual_points = 0.0

    for indicator in indicators:
        status = str(indicator.get("status", "")).lower()
        indicator_type = str(indicator.get("type", "")).lower()

        raw_confidence = indicator.get("confidence", 0)

        confidence_map = {
            "high": 0.9,
            "medium": 0.6,
            "low": 0.3,
        }

        try:
            confidence_text = str(raw_confidence).lower()

            if confidence_text in confidence_map:
                confidence = confidence_map[confidence_text]
            else:
                confidence = float(raw_confidence)
        except (TypeError, ValueError):
            confidence = 0.0

        if confidence <= 0:
            continue

        status_is_negative = any(
            term in status for term in negative_status_terms
        )

        status_is_positive = any(
            term in status for term in positive_status_terms
        )

        type_is_concerning = indicator_type in {
            "marine_debris",
            "water_appearance",
            "coral",
            "coral_condition",
            "vegetation",
            "biodiversity",
            "unusual_object",
        }

        severity_multiplier = 1.0

        if "present_high_concentration" in status:
            severity_multiplier = 2.5
        elif any(term in status for term in ("widespread", "significant", "accumulation")):
            severity_multiplier = 1.5
        elif "possible" in status:
            severity_multiplier = 0.6

        if not status_is_negative and (status_is_positive or type_is_concerning):
            visual_points += confidence * 12 * severity_multiplier

    visual_weight = min(35, visual_points)

    sensor_weight = (
        25
        if evidence.get("sensor_anomaly")
        else (10 if evidence.get("sensor") else 0)
    )

    freq = evidence.get("community_count", 0)
    community_weight = min(20, max(0, freq - 1) * 5)

    historical_weight = min(
        15,
        evidence.get("historical_count", 0) * 2,
    )

    try:
        visual_confidence = float(
            visual.get("confidence", 0)
        )
    except (TypeError, ValueError):
        visual_confidence = 0.0

    uncertainty = max(
        0,
        20 * (1 - visual_confidence),
    )

    score = max(
        0,
        min(
            100,
            round(
                visual_weight
                + sensor_weight
                + community_weight
                + historical_weight
                - uncertainty
            ),
        ),
    )

    if visual.get("needs_review") or visual_confidence < 0.45:
        level = "Needs Review"
    elif score >= 70:
        level = "High"
    elif score >= 40:
        level = "Medium"
    else:
        level = "Low"

    reasons = []

    if visual.get("needs_review") or visual_confidence < 0.45:
        reasons.append("Visual evidence is insufficient or uncertain")

    if visual_weight > 0:
        reasons.append(
            f"Visual evidence contributed {round(visual_weight)} points"
        )

    if evidence.get("sensor_anomaly"):
        reasons.append(
            "Sensor anomaly detected in simulated readings"
        )
    elif evidence.get("sensor"):
        sources = sorted(
            set(
                str(s.get("source", "unknown"))
                for s in evidence["sensor"]
            )
        )
        reasons.append(
            f"Sensor evidence available (source: {', '.join(sources)})"
        )

    if freq > 1:
        reasons.append(
            f"Repeated community observations: {freq}"
        )

    if evidence.get("historical_count"):
        reasons.append(
            f"Historical observations available: {evidence['historical_count']}"
        )

    if uncertainty > 8:
        reasons.append(
            "Uncertainty adjustment reduced the score"
        )

    if not reasons:
        reasons.append(
            "Insufficient evidence for a strong priority signal"
        )

    return {
        "score": score,
        "level": level,
        "reasons": reasons,
    }


def create_recommendation(evidence, priority):
    if priority["level"]=="Needs Review":
        return {"action":"Needs Review","rationale":"Available evidence is insufficient or uncertain. Human/field review is recommended before stronger conclusions."}
    if priority["level"]=="High":
        return {"action":"Field Verification Recommended","rationale":"Multiple evidence signals support elevated operational priority; verify conditions with appropriate field or approved environmental data."}
    if priority["level"]=="Medium":
        return {"action":"Collect Additional Observations","rationale":"Continue monitoring and add observations or sensor evidence to improve confidence."}
    return {"action":"Continue Monitoring","rationale":"Current evidence does not indicate a strong priority signal; continue community monitoring."}

def request_additional_evidence(evidence, evidence_gate):
    if evidence_gate.get("sufficient"):
        return {
            "status": "evidence_sufficient",
            "requested": [],
            "reason": evidence_gate.get(
                "reason",
                "Available evidence is sufficient for the current workflow.",
            ),
        }

    requested = []

    visual = evidence.get("visual", {})
    visual_indicators = visual.get("visual_indicators", [])
    visual_confidence = float(visual.get("confidence", 0) or 0)
    needs_visual_review = visual.get("needs_review") or not visual_indicators

    if needs_visual_review or visual_confidence < 0.45:
        requested.append("additional_image_or_visual_review")

    return {
        "status": "additional_evidence_requested",
        "requested": requested,
        "reason": evidence_gate.get(
            "reason",
            "Additional evidence is needed before stronger prioritization.",
        ),
    }

def request_human_review(db: Session, report_id: int):
    v=db.query(Verification).filter_by(report_id=report_id).first()
    if not v:
        v=Verification(report_id=report_id,status="needs_review")
        db.add(v)
    else:
        v.status="needs_review"
    db.commit(); return v

