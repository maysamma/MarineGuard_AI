import json
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.models import Report, AIResult, AgentRun, SensorReading, Score, Recommendation
from app.tools.tools import analyze_image, get_sensor_data, get_historical_observations, get_community_reports, get_map_context, calculate_priority, create_recommendation, request_human_review
from app.services.ai_service import analyze_image as vision_model

class Orchestrator:
    def __init__(self, db: Session): self.db=db
    def run(self, report: Report):
        def trace(agent, tool, status, output):
            self.db.add(AgentRun(report_id=report.id,agent_name=agent,tool_name=tool,status=status,output_json=json.dumps(output,default=str)))
            self.db.commit()
        evidence={"location":get_map_context(self.db,report.latitude,report.longitude)}
        trace("Orchestrator Agent","routing", "completed", {"selected":["Vision Agent" if report.image else None,"Environmental Agent","IoT/Data Agent","Historical/Trend Agent","Risk/Priority Agent","Recommendation Agent"]})
        if report.image:
            report.image.analysis_status="processing"; self.db.commit()
            result=analyze_image(Path(report.image.file_path), vision_model)
            ai=AIResult(report_id=report.id,agent_name="Vision Agent",indicators_json=json.dumps(result.get("visual_indicators",[])),confidence=float(result.get("confidence",0)),summary=result.get("summary",""),limitations=result.get("limitations",""),needs_review=bool(result.get("needs_review",True)))
            self.db.add(ai); self.db.commit(); evidence["visual"]=result
            report.image.analysis_status="completed" if result.get("confidence",0)>0 else "needs_review"; self.db.commit()
            trace("Vision Agent","analyze_image","completed",result)
        else:
            evidence["visual"]={"visual_indicators":[],"confidence":0,"needs_review":True,"summary":"No image supplied.","limitations":"Image evidence is unavailable."}
            trace("Vision Agent","analyze_image","skipped",evidence["visual"])
        # Conditional tool routing: sensor only when readings exist for the site; historical always checks context.
        sensors=get_sensor_data(self.db,report.site_id)
        evidence["sensor"]=[{"type":s.sensor_type,"value":s.value,"unit":s.unit,"source":s.source} for s in sensors]
        turb=[s for s in sensors if s.sensor_type=="turbidity"]
        evidence["sensor_anomaly"]=any(s.value>18 for s in turb)
        if sensors:
            trace("IoT/Data Agent","get_sensor_data","completed",{"count":len(sensors),"source":"simulated","anomaly":evidence["sensor_anomaly"]})
        else:
            trace("IoT/Data Agent","get_sensor_data","skipped",{"reason":"No sensor readings available for this site."})
        hist=get_historical_observations(self.db,report.site_id); evidence["historical_count"]=len(hist)
        if hist:
            trace("Historical/Trend Agent","get_historical_observations","completed",{"count":len(hist)})
        else:
            trace("Historical/Trend Agent","get_historical_observations","skipped",{"reason":"No historical observations available."})
        community=get_community_reports(self.db,report.site_id); evidence["community_count"]=len(community)
        if evidence["visual"].get("visual_indicators"):
            trace("Environmental Agent","context_interpretation","completed",{"community_count":len(community),"interpretation":"Visual indicators are not treated as laboratory diagnosis."})
        else:
            trace("Environmental Agent","context_interpretation","skipped",{"reason":"No reliable visual indicator was available."})
        priority=calculate_priority(evidence)
        score=Score(report_id=report.id,site_id=report.site_id,score=priority["score"],level=priority["level"],reasons_json=json.dumps(priority["reasons"]))
        self.db.add(score); self.db.commit(); trace("Risk/Priority Agent","calculate_priority","completed",priority)
        rec=create_recommendation(evidence,priority)
        self.db.add(Recommendation(report_id=report.id,action=rec["action"],rationale=rec["rationale"])); self.db.commit(); trace("Recommendation Agent","create_recommendation","completed",rec)
        if priority["level"]=="Needs Review" or evidence["visual"].get("needs_review"):
            request_human_review(self.db,report.id); report.status="needs_review"
        else: report.status="analyzed"
        self.db.commit()
        trace("Verification Agent / Human","request_human_review" if report.status=="needs_review" else "verification_gate","completed",{"status":report.status})
        return {"priority":priority,"recommendation":rec,"evidence":evidence}

