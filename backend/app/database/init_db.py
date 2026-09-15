from app.database.db import Base, engine, SessionLocal
from app.models.models import Site, Report, Observation, SensorReading, Verification
from datetime import datetime, timezone, timedelta
import random

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Site).count() == 0:
            sites = [
                Site(name="Red Sea Reef — Jeddah", latitude=21.5433, longitude=39.1728),
                Site(name="Sharm Obhur Coastal Zone", latitude=21.7026, longitude=39.1228),
                Site(name="South Obhur Observation Area", latitude=21.6574, longitude=39.1102),
            ]
            db.add_all(sites); db.commit()
            for site in sites:
                for days_ago in (30, 21, 12, 5):
                    db.add(Observation(site_id=site.id, source="historical_example", type="community_observation", evidence_json='{"note":"Example historical record; retained for demo continuity."}', created_at=datetime.now(timezone.utc)-timedelta(days=days_ago)))
                for sensor_type, value, unit in [("temperature",29.1,"°C"),("salinity",38.0,"PSU"),("turbidity",8.5,"NTU")]:
                    db.add(SensorReading(site_id=site.id, source="simulated", sensor_type=sensor_type, value=value+random.uniform(-0.8,0.8), unit=unit, latitude=site.latitude, longitude=site.longitude))
            db.commit()
        if db.query(Report).count() == 0:
            # Clearly labeled demo/sample records; they are created through the DB seed, not frontend constants.
            demo = [
                (1,"Demo observation: visible marine debris reported near reef edge.","marine_debris"),
                (2,"Demo observation: unusual water appearance reported after coastal activity.","water_appearance"),
            ]
            for sid, desc, typ in demo:
                site=db.get(Site,sid)
                r=Report(site_id=sid,description=desc,latitude=site.latitude,longitude=site.longitude,observation_type=typ,status="needs_review")
                db.add(r); db.flush()
                db.add(Verification(report_id=r.id,status="needs_review",notes="Demo/sample record — verify with field evidence."))
            db.commit()
    finally:
        db.close()
