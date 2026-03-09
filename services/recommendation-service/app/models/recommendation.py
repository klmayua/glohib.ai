from typing import List
from pydantic import BaseModel, Field
from datetime import datetime

class RecommendationItem(BaseModel):
    internship_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    similarity: float
    behavioral: float
    recency_boost: float
    explanation: str = ""

class RecommendationResponse(BaseModel):
    student_id: str
    recommendations: List[RecommendationItem]
    generated_at: datetime

class BehavioralEvent(BaseModel):
    student_id: str
    internship_id: str
    event_type: str  # click | view | save | apply
    timestamp: datetime = Field(default_factory=datetime.utcnow)
