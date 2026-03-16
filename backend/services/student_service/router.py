from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.shared.database.connection import get_db
from backend.services.student_service import schemas, service_logic

router = APIRouter(prefix="/students", tags=["students"])

@router.post("/profile", response_model=schemas.StudentProfileResponse)
def create_profile(
    profile: schemas.StudentProfileCreate,
    user_id: str,
    db: Session = Depends(get_db)
):
    from uuid import UUID
    uid = UUID(user_id)
    existing = service_logic.get_student_profile_by_user_id(db, uid)
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    return service_logic.create_student_profile(
        db, uid, profile.first_name, profile.last_name,
        profile.university, profile.degree, profile.skills
    )

@router.get("/profile", response_model=schemas.StudentProfileResponse)
def get_profile(user_id: str, db: Session = Depends(get_db)):
    from uuid import UUID
    profile = service_logic.get_student_profile_by_user_id(db, UUID(user_id))
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=schemas.StudentProfileResponse)
def update_profile(
    profile: schemas.StudentProfileUpdate,
    user_id: str,
    db: Session = Depends(get_db)
):
    from uuid import UUID
    existing = service_logic.get_student_profile_by_user_id(db, UUID(user_id))
    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found")
    return service_logic.update_student_profile(
        db, existing,
        first_name=profile.first_name,
        last_name=profile.last_name,
        university=profile.university,
        degree=profile.degree,
        skills=profile.skills
    )
