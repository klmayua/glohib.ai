from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from backend.shared.database.connection import get_db
from backend.services.employer_service import schemas, service_logic

router = APIRouter(prefix="/employers", tags=["employers"])

@router.post("/profile", response_model=schemas.EmployerProfileResponse)
def create_profile(profile: schemas.EmployerProfileCreate, user_id: str, db: Session = Depends(get_db)):
    existing = service_logic.get_employer_profile_by_user_id(db, UUID(user_id))
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    return service_logic.create_employer_profile(db, UUID(user_id), profile.organization_name, profile.industry, profile.website)

@router.get("/profile", response_model=schemas.EmployerProfileResponse)
def get_profile(user_id: str, db: Session = Depends(get_db)):
    profile = service_logic.get_employer_profile_by_user_id(db, UUID(user_id))
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
