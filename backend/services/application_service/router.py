from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from backend.shared.database.connection import get_db
from backend.services.application_service import schemas, service_logic
from backend.shared.models.models import ApplicationStatus

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("", response_model=schemas.ApplicationResponse)
def create_application(application: schemas.ApplicationCreate, student_id: str, db: Session = Depends(get_db)):
    return service_logic.create_application(db, UUID(student_id), application.internship_id)

@router.get("/student", response_model=list[schemas.ApplicationResponse])
def get_student_applications(student_id: str, db: Session = Depends(get_db)):
    return service_logic.get_applications_by_student(db, UUID(student_id))

@router.get("/employer", response_model=list[schemas.ApplicationResponse])
def get_employer_applications(employer_id: str, db: Session = Depends(get_db)):
    return service_logic.get_applications_by_employer(db, UUID(employer_id))

@router.patch("/{application_id}", response_model=schemas.ApplicationResponse)
def update_application_status(
    application_id: str,
    status: schemas.ApplicationStatusEnum,
    db: Session = Depends(get_db)
):
    application = service_logic.update_application_status(db, UUID(application_id), ApplicationStatus[status.value.upper()])
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
