from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models.vector import StudentFeatures, InternshipFeatures, Vector512
from app.models.recommendation import RecommendationResponse, BehavioralEvent
from app.services.vectorizer import get_vectorizer
from app.services.matching import get_matcher
from app.services.ranking import get_ranker
from app.services.behavioral import get_behavioral
from app.db import engine
from sqlalchemy import text

router = APIRouter()

@router.post("/api/v1/vectorize/student", response_model=Vector512)
def vectorize_student(payload: StudentFeatures):
    return get_vectorizer().vectorize_student(payload)

@router.post("/api/v1/vectorize/internship", response_model=Vector512)
def vectorize_internship(payload: InternshipFeatures):
    return get_vectorizer().vectorize_internship(payload)

@router.post("/api/v1/match")
def match_internships(student_vector: Vector512, limit: int = 50):
    ids = get_matcher().find_top_internships(student_vector, limit)
    return {"internship_ids": ids}

@router.get("/api/v1/recommend/{student_id}", response_model=RecommendationResponse)
def recommend(student_id: str, limit: int = 20):
    sql = text("SELECT embedding FROM internship_vectors WHERE student_id=:sid")
    with engine.connect() as conn:
        row = conn.execute(sql, {"sid": student_id}).fetchone()
    if not row:
        raise HTTPException(404, "Student not vectorized")
    vec = Vector512(embedding=row["embedding"])
    vec.student_id = student_id
    top_ids = get_matcher().find_top_internships(vec, 100)
    recency_map = {iid: 0.0 for iid in top_ids}
    items = get_ranker().rank(vec, top_ids, recency_map)[:limit]
    return RecommendationResponse(
        student_id=student_id,
        recommendations=items,
        generated_at=datetime.utcnow()
    )

@router.post("/api/v1/track/click")
def track_click(body: BehavioralEvent):
    get_behavioral().track(body)
    return {"status": "ok"}

@router.post("/api/v1/track/view")
def track_view(body: BehavioralEvent):
    get_behavioral().track(body)
    return {"status": "ok"}

@router.post("/api/v1/track/save")
def track_save(body: BehavioralEvent):
    get_behavioral().track(body)
    return {"status": "ok"}

@router.get("/api/v1/behavioral/{student_id}")
def behavioral_profile(student_id: str):
    ids = get_behavioral().behavioral_vector(student_id)
    return {"student_id": student_id, "seen_internship_ids": ids}
