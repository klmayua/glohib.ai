import os
import numpy as np
from sentence_transformers import SentenceTransformer
from app.models.vector import StudentFeatures, InternshipFeatures, Vector512

MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")

class VectorizerService:
    def __init__(self):
        self.model = SentenceTransformer(MODEL_NAME)

    def vectorize_student(self, payload: StudentFeatures) -> Vector512:
        parts = [
            " ".join(payload.skills),
            " ".join(payload.interests),
            payload.major,
            str(payload.graduation_year),
            payload.location,
            " ".join(payload.languages),
            f"experience_months:{payload.experience_months}",
            " ".join(payload.preferred_industries),
        ]
        text = " | ".join(parts)
        vec = self.model.encode(text, normalize_embeddings=True)
        return Vector512(embedding=vec.tolist())

    def vectorize_internship(self, payload: InternshipFeatures) -> Vector512:
        parts = [
            payload.title,
            payload.description,
            " ".join(payload.required_skills),
            payload.location,
            payload.industry,
            f"paid:{payload.paid}",
            f"remote:{payload.remote}",
            f"duration_weeks:{payload.duration_weeks}",
        ]
        text = " | ".join(parts)
        vec = self.model.encode(text, normalize_embeddings=True)
        return Vector512(embedding=vec.tolist())

    def batch_vectorize(self, texts: list[str]) -> np.ndarray:
        return self.model.encode(texts, normalize_embeddings=True, batch_size=32)

_instance = VectorizerService()

def get_vectorizer() -> VectorizerService:
    return _instance
