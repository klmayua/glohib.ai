from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from backend.shared.database.connection import get_db
from backend.services.internship_service import schemas, service_logic

router = APIRouter(prefix="/internships", tags=["internships"])

@router.post("", response_model=schemas.InternshipResponse)
def create_internship(internship: schemas.InternshipCreate, employer_id: str, db: Session = Depends(get_db)):
    return service_logic.create_internship(
        db, UUID(employer_id), internship.title, internship.description,
        internship.location, internship.remote, internship.skills_required
    )

@router.get("", response_model=list[schemas.InternshipResponse])
def get_internships(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service_logic.get_internships(db, skip, limit)

@router.get("/{internship_id}", response_model=schemas.InternshipResponse)
def get_internship(internship_id: str, db: Session = Depends(get_db)):
    internship = service_logic.get_internship(db, UUID(internship_id))
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship
