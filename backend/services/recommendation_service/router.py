from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from backend.shared.database.connection import get_db
from backend.services.recommendation_service import schemas, service_logic

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.post("/student", response_model=list[schemas.RecommendationItem])
def get_student_recommendations(request: schemas.StudentRecommendationRequest, db: Session = Depends(get_db)):
    return service_logic.get_recommendations(db, request.student_id, request.skills, request.assessment_score)
