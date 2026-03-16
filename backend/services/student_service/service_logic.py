import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from uuid import UUID
from backend.shared.models.models import StudentProfile

def get_student_profile_by_user_id(db: Session, user_id: UUID) -> StudentProfile:
    return db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

def create_student_profile(db: Session, user_id: UUID, first_name: str, last_name: str, university: str = None, degree: str = None, skills: list = None) -> StudentProfile:
    profile = StudentProfile(
        user_id=user_id,
        first_name=first_name,
        last_name=last_name,
        university=university,
        degree=degree,
        skills=skills or []
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

def update_student_profile(db: Session, profile: StudentProfile, **kwargs) -> StudentProfile:
    for key, value in kwargs.items():
        if value is not None and hasattr(profile, key):
            setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile
