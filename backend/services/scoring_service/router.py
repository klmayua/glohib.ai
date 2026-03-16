from fastapi import APIRouter
from backend.services.scoring_service import schemas, service_logic

router = APIRouter(prefix="/scoring", tags=["scoring"])

@router.post("/calculate", response_model=schemas.ScoringOutput)
def calculate_score(input_data: schemas.ScoringInput):
    competency_score = service_logic.calculate_competency_score(input_data.student_skills, input_data.assessment_results)
    skill_match = service_logic.calculate_skill_match(input_data.student_skills, input_data.required_skills)
    recommendations = service_logic.generate_recommendations(input_data.student_skills, input_data.required_skills)
    
    return schemas.ScoringOutput(
        competency_score=competency_score,
        skill_match_percentage=skill_match,
        recommendations=recommendations
    )
