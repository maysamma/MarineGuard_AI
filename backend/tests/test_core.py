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

def test_marine_debris_routes_to_sensor_and_historical_agents():
    from unittest.mock import Mock, patch
    from app.agents.orchestrator import Orchestrator
    from app.models.models import Report

    report = Report(
        id=999,
        site_id=1,
        description="Visible plastic debris on the shoreline.",
        latitude=21.5433,
        longitude=39.1728,
        observation_type="marine_debris",
        status="submitted",
    )

    db = Mock()

    with patch("app.agents.orchestrator.get_sensor_data", return_value=[]) as mock_sensors, \
         patch("app.agents.orchestrator.get_historical_observations", return_value=[]) as mock_history:

        orchestrator = Orchestrator(db)
        orchestrator.run(report)

        mock_sensors.assert_called_once_with(db, 1)
        mock_history.assert_called_once_with(db, 1)


def test_high_concentration_debris_gets_more_visual_points():
    from app.tools.tools import calculate_priority

    base_evidence = {
        "visual": {
            "visual_indicators": [
                {
                    "type": "marine_debris",
                    "status": "present",
                    "confidence": 0.9,
                }
            ],
            "confidence": 0.9,
            "needs_review": False,
        }
    }

    high_concentration_evidence = {
        "visual": {
            "visual_indicators": [
                {
                    "type": "marine_debris",
                    "status": "present_high_concentration",
                    "confidence": 0.9,
                }
            ],
            "confidence": 0.9,
            "needs_review": False,
        }
    }

    base_result = calculate_priority(base_evidence)
    high_result = calculate_priority(high_concentration_evidence)

    assert high_result["score"] > base_result["score"]


def test_normal_water_appearance_does_not_add_visual_points():
    from app.tools.tools import calculate_priority

    evidence = {
        "visual": {
            "visual_indicators": [
                {
                    "type": "water_appearance",
                    "status": "normal_appearance",
                    "confidence": 0.9,
                }
            ],
            "confidence": 0.9,
            "needs_review": False,
        }
    }

    result = calculate_priority(evidence)

    assert result["score"] == 0
    assert result["level"] == "Low"

def test_image_needs_review_when_vision_requests_review():
    from types import SimpleNamespace
    from unittest.mock import Mock, patch
    from app.agents.orchestrator import Orchestrator

    image = SimpleNamespace(
        file_path="fake-image.jpg",
        analysis_status="pending",
    )

    report = SimpleNamespace(
        id=999,
        site_id=1,
        image=image,
        observation_type="marine_debris",
        description="Test report",
        latitude=21.5,
        longitude=39.2,
        status="submitted",
    )

    vision_result = {
        "visual_indicators": [
            {
                "type": "marine_debris",
                "status": "present",
                "confidence": 0.9,
            }
        ],
        "confidence": 0.9,
        "needs_review": True,
        "summary": "Test result",
        "limitations": "Human review required",
    }

    db = Mock()

    with patch(
        "app.agents.orchestrator.get_sensor_data",
        return_value=[],
    ), patch(
        "app.agents.orchestrator.get_historical_observations",
        return_value=[],
    ), patch(
        "app.agents.orchestrator.get_community_reports",
        return_value=[],
    ), patch(
        "app.agents.orchestrator.analyze_image",
        return_value=vision_result,
    ):
        orchestrator = Orchestrator(db)
        orchestrator.run(report)

    assert image.analysis_status == "needs_review"
