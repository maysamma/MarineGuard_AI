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
    visual=evidence.get("visual",{}); indicators=visual.get("visual_indicators",[])
    visual_weight=min(35, sum(float(i.get("confidence",0))*12 for i in indicators if i.get("status") in ("detected","possible")))
    sensor_weight=25 if evidence.get("sensor_anomaly") else (10 if evidence.get("sensor") else 0)
    freq=evidence.get("community_count",0); community_weight=min(20, max(0,freq-1)*5)
    historical_weight=min(15, evidence.get("historical_count",0)*2)
    uncertainty=max(0, 20*(1-float(visual.get("confidence",0))))
    score=max(0,min(100,round(visual_weight+sensor_weight+community_weight+historical_weight-uncertainty)))
    if visual.get("needs_review") or visual.get("confidence",0)<0.45:
        level="Needs Review"
    elif score>=70: level="High"
    elif score>=40: level="Medium"
    else: level="Low"
    reasons=[]
    if indicators: reasons.append("Visible indicators contributed to the evidence package")
    if evidence.get("sensor_anomaly"): reasons.append("Sensor anomaly detected in simulated readings")
    elif evidence.get("sensor"): reasons.append("Sensor evidence available (simulated)")
    if freq>1: reasons.append(f"Repeated community observations: {freq}")
    if evidence.get("historical_count"): reasons.append(f"Historical observations available: {evidence['historical_count']}")
    if uncertainty>8: reasons.append("Uncertainty adjustment reduced the score")
    if not reasons: reasons.append("Insufficient evidence for a strong priority signal")
    return {"score":score,"level":level,"reasons":reasons}

def create_recommendation(evidence, priority):
    if priority["level"]=="Needs Review":
        return {"action":"Needs Review","rationale":"Available evidence is insufficient or uncertain. Human/field review is recommended before stronger conclusions."}
    if priority["level"]=="High":
        return {"action":"Field Verification Recommended","rationale":"Multiple evidence signals support elevated operational priority; verify conditions with appropriate field or approved environmental data."}
    if priority["level"]=="Medium":
        return {"action":"Collect Additional Observations","rationale":"Continue monitoring and add observations or sensor evidence to improve confidence."}
    return {"action":"Continue Monitoring","rationale":"Current evidence does not indicate a strong priority signal; continue community monitoring."}

def request_human_review(db: Session, report_id: int):
    v=db.query(Verification).filter_by(report_id=report_id).first()
    if not v:
        v=Verification(report_id=report_id,status="needs_review")
        db.add(v)
    else:
        v.status="needs_review"
    db.commit(); return v
