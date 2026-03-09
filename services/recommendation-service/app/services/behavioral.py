import os
import redis
from typing import Dict, List
from datetime import datetime
from app.models.recommendation import BehavioralEvent

r = redis.from_url(os.getenv("REDIS_URL", "redis://redis:6379/1"))

class BehavioralService:
    def track(self, event: BehavioralEvent):
        key = f"beh:{event.student_id}:{event.event_type}"
        r.zadd(key, {event.internship_id: event.timestamp.timestamp()})
        r.expire(key, 60*60*24*90)  # 90 days

    def score(self, student_id: str, internship_ids: List[str]) -> Dict[str, float]:
        weights = {"click": 0.3, "view": 0.1, "save": 0.4, "apply": 0.6}
        scores = {}
        for iid in internship_ids:
            total = 0.0
            for etype in weights:
                key = f"beh:{student_id}:{etype}"
                val = r.zscore(key, iid)
                if val:
                    age_days = (datetime.utcnow().timestamp() - val) / 86400
                    decay = max(0, 1 - age_days / 90)
                    total += weights[etype] * decay
            scores[iid] = min(1.0, total)
        return scores

    def behavioral_vector(self, student_id: str) -> List[str]:
        all_seen = set()
        for etype in ["click", "view", "save", "apply"]:
            key = f"beh:{student_id}:{etype}"
            result = r.zrange(key, 0, -1)
            all_seen.update(result)
        return [iid.decode() if isinstance(iid, bytes) else iid for iid in all_seen]

_instance = BehavioralService()

def get_behavioral() -> BehavioralService:
    return _instance
