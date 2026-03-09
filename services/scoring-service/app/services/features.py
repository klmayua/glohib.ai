from typing import Dict
import redis.asyncio as redis
import json
from app.models.features import build_feature_row
from app.models.score import Student, Internship
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

class FeatureExtractor:
    def __init__(self):
        self.r = redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)

    async def extract(self, student: Student, internship: Internship) -> Dict[str, float]:
        key = f"feat:{student.id}:{internship.id}"
        cached = await self.r.get(key)
        if cached:
            return json.loads(cached)
        features = build_feature_row(student, internship)
        await self.r.set(key, json.dumps(features), ex=300)
        return features
