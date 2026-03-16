import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from backend.shared.models.models import Internship, StudentProfile

def calculate_skill_overlap(student_skills: List[str], required_skills: List[str]) -> float:
    if not required_skills:
        return 100.0
    student_set = set(s.lower() for s in student_skills)
    required_set = set(s.lower() for s in required_skills)
    matches = student_set.intersection(required_set)
    return (len(matches) / len(required_set)) * 100

def calculate_match_score(skill_overlap: float, assessment_score: float) -> float:
    skill_weight = 0.7
    assessment_weight = 0.3
    return (skill_overlap * skill_weight) + (assessment_score * assessment_weight)

def get_recommendations(db: Session, student_id: UUID, student_skills: List[str], assessment_score: float = 0.0) -> List[dict]:
    internships = db.query(Internship).all()
    recommendations = []
    
    for internship in internships:
        skill_overlap = calculate_skill_overlap(student_skills, internship.skills_required or [])
        match_score = calculate_match_score(skill_overlap, assessment_score)
        
        recommendations.append({
            "internship_id": internship.id,
            "title": internship.title,
            "match_score": match_score,
            "skill_overlap": skill_overlap
        })
    
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    return recommendations[:10]
