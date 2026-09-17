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

def test_priority_uses_multiple_evidence_sources():
    evidence = {
        "visual": {
            "visual_indicators": [
                {
                    "type": "marine_debris",
                    "status": "detected",
                    "confidence": 0.9,
                }
            ],
            "confidence": 0.9,
            "needs_review": False,
        },
        "sensor": [
            {
                "type": "turbidity",
                "value": 25,
                "unit": "NTU",
                "source": "simulated",
            }
        ],
        "sensor_anomaly": True,
        "community_count": 4,
        "historical_count": 4,
    }

    priority = calculate_priority(evidence)

    assert priority["score"] > 0
    assert priority["level"] in {"Low", "Medium", "High"}
    assert any("Visual evidence" in reason for reason in priority["reasons"])
    assert any("Sensor anomaly" in reason for reason in priority["reasons"])
    assert any("Repeated community" in reason for reason in priority["reasons"])
    assert any("Historical observations" in reason for reason in priority["reasons"])

def test_additional_evidence_requested_when_visual_is_insufficient():
    from app.tools.tools import request_additional_evidence

    evidence = {
        "visual": {
            "visual_indicators": [],
            "confidence": 0.2,
            "needs_review": True,
        }
    }

    evidence_gate = {
        "sufficient": False,
        "reason": "Visual evidence is insufficient or uncertain.",
    }

    result = request_additional_evidence(evidence, evidence_gate)

    assert result["status"] == "additional_evidence_requested"
    assert "additional_image_or_visual_review" in result["requested"]
