from app.tools.tools import calculate_priority, create_recommendation

def test_priority_explainable():
    e={"visual":{"visual_indicators":[{"status":"detected","confidence":0.9}],"confidence":0.9,"needs_review":False},"sensor":[],"sensor_anomaly":True,"community_count":4,"historical_count":4}
    p=calculate_priority(e)
    assert 0 <= p["score"] <= 100
    assert p["reasons"]

def test_needs_review():
    p=calculate_priority({"visual":{"visual_indicators":[],"confidence":0.2,"needs_review":True},"sensor":[],"sensor_anomaly":False,"community_count":0,"historical_count":0})
    assert p["level"] == "Needs Review"
    assert create_recommendation({},p)["action"] == "Needs Review"

def test_recommendation_high():
    p={"level":"High"}
    assert "Field Verification" in create_recommendation({},p)["action"]
