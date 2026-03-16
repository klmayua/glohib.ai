from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID

class ScoringInput(BaseModel):
    student_skills: List[str]
    assessment_results: Dict[str, Any]
    required_skills: List[str]

class ScoringOutput(BaseModel):
    competency_score: float
    skill_match_percentage: float
    recommendations: List[str]
