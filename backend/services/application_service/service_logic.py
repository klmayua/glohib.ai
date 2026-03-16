import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from backend.shared.models.models import Application, ApplicationStatus

def create_application(db: Session, student_id: UUID, internship_id: UUID) -> Application:
    application = Application(
        student_id=student_id,
        internship_id=internship_id,
        status=ApplicationStatus.SUBMITTED
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

def get_applications_by_student(db: Session, student_id: UUID) -> List[Application]:
    return db.query(Application).filter(Application.student_id == student_id).all()

def get_applications_by_employer(db: Session, employer_id: UUID) -> List[Application]:
    from backend.shared.models.models import Internship
    return db.query(Application).join(Internship).filter(Internship.employer_id == employer_id).all()

def update_application_status(db: Session, application_id: UUID, status: ApplicationStatus) -> Optional[Application]:
    application = db.query(Application).filter(Application.id == application_id).first()
    if application:
        application.status = status
        db.commit()
        db.refresh(application)
    return application
