import os
from datetime import datetime
from typing import List
from app.models.recommendation import RecommendationItem
from app.models.vector import Vector512
from app.services.matching import get_matcher
from app.services.behavioral import get_behavioral

W_SIM = float(os.getenv("RANK_WEIGHT_SIM", 0.5))
W_BEH = float(os.getenv("RANK_WEIGHT_BEH", 0.3))
W_REC = float(os.getenv("RANK_WEIGHT_REC", 0.2))

class RankingService:
    def __init__(self):
        self.matcher = get_matcher()
        self.behavioral = get_behavioral()

    def rank(self,
             student_vector: Vector512,
             internship_ids: List[str],
             recency_map: dict) -> List[RecommendationItem]:
        behavioral_scores = self.behavioral.score(student_vector.student_id, internship_ids)
        items = []
        for iid in internship_ids:
            sim = self.matcher.cosine_similarity(student_vector, self._get_internship_vector(iid))
            beh = behavioral_scores.get(iid, 0.0)
            rec = recency_map.get(iid, 0.0)
            score = W_SIM*sim + W_BEH*beh + W_REC*rec
            items.append(RecommendationItem(
                internship_id=iid,
                score=score,
                similarity=sim,
                behavioral=beh,
                recency_boost=rec,
                explanation=f"sim={sim:.2f} beh={beh:.2f} rec={rec:.2f}"
            ))
        items.sort(key=lambda x: x.score, reverse=True)
        return items

    def _get_internship_vector(self, iid: str):
        from app.db import engine
        from sqlalchemy import text
        sql = text("SELECT embedding FROM internship_vectors WHERE internship_id=:iid")
        with engine.connect() as conn:
            row = conn.execute(sql, {"iid": iid}).fetchone()
        return Vector512(embedding=row["embedding"])

_instance = RankingService()

def get_ranker() -> RankingService:
    return _instance
