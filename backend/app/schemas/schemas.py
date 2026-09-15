from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any

class ReportCreate(BaseModel):
    description: str = ""
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    observation_type: str = "general"
    depth_m: float | None = Field(default=None, ge=0)
    site_name: str | None = None

class SensorSimulate(BaseModel):
    site_id: int
    anomaly: bool = False

class VerificationUpdate(BaseModel):
    status: str
    reviewer: str = "Reviewer"
    notes: str = ""

class RecommendationCreate(BaseModel):
    report_id: int

class VisualIndicator(BaseModel):
    type: str
    status: str
    confidence: float
    explanation: str = ""

class AnalysisOut(BaseModel):
    visual_indicators: list[VisualIndicator]
    confidence: float
    summary: str
    limitations: str
    needs_review: bool
