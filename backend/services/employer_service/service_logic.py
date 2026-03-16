import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from uuid import UUID
from backend.shared.models.models import EmployerProfile

def get_employer_profile_by_user_id(db: Session, user_id: UUID) -> EmployerProfile:
    return db.query(EmployerProfile).filter(EmployerProfile.user_id == user_id).first()

def create_employer_profile(db: Session, user_id: UUID, organization_name: str, industry: str = None, website: str = None) -> EmployerProfile:
    profile = EmployerProfile(user_id=user_id, organization_name=organization_name, industry=industry, website=website)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
