import numpy as np
from typing import List
from sqlalchemy import text
from app.db import engine
from app.models.vector import Vector512

class MatchingService:
    @staticmethod
    def cosine_similarity(a: Vector512, b: Vector512) -> float:
        a_np = np.array(a.embedding)
        b_np = np.array(b.embedding)
        return float(np.dot(a_np, b_np))

    def find_top_internships(self,
                             student_vector: Vector512,
                             limit: int = 50) -> List[str]:
        vec_str = "[" + ",".join(map(str, student_vector.embedding)) + "]"
        sql = text("""
            SELECT internship_id,
                   1 - (embedding <=> :vec) AS cosine_sim
            FROM internship_vectors
            ORDER BY embedding <=> :vec
            LIMIT :lim
        """)
        with engine.connect() as conn:
            rows = conn.execute(sql, {"vec": vec_str, "lim": limit}).fetchall()
        return [row["internship_id"] for row in rows]

    def find_top_students(self,
                          internship_vector: Vector512,
                          limit: int = 50) -> List[str]:
        vec_str = "[" + ",".join(map(str, internship_vector.embedding)) + "]"
        sql = text("""
            SELECT student_id,
                   1 - (embedding <=> :vec) AS cosine_sim
            FROM student_vectors
            ORDER BY embedding <=> :vec
            LIMIT :lim
        """)
        with engine.connect() as conn:
            rows = conn.execute(sql, {"vec": vec_str, "lim": limit}).fetchall()
        return [row["student_id"] for row in rows]

_instance = MatchingService()

def get_matcher() -> MatchingService:
    return _instance
