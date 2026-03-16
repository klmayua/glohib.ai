from pydantic import BaseModel
from typing import List
from uuid import UUID

class RecommendationItem(BaseModel):
    internship_id: UUID
    title: str
    match_score: float
    skill_overlap: float

class StudentRecommendationRequest(BaseModel):
    student_id: UUID
    skills: List[str]
    assessment_score: float = 0.0
