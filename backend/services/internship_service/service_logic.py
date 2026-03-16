import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from backend.shared.models.models import Internship, EmployerProfile

def create_internship(db: Session, employer_id: UUID, title: str, description: str = None, location: str = None, remote: bool = False, skills_required: list = None) -> Internship:
    internship = Internship(
        employer_id=employer_id,
        title=title,
        description=description,
        location=location,
        remote=remote,
        skills_required=skills_required or []
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship

def get_internship(db: Session, internship_id: UUID) -> Optional[Internship]:
    return db.query(Internship).filter(Internship.id == internship_id).first()

def get_internships(db: Session, skip: int = 0, limit: int = 100) -> List[Internship]:
    return db.query(Internship).offset(skip).limit(limit).all()

def get_internships_by_employer(db: Session, employer_id: UUID) -> List[Internship]:
    return db.query(Internship).filter(Internship.employer_id == employer_id).all()
