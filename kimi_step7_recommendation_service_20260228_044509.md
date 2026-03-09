# GLOHIB.AI - STEP 7: RECOMMENDATION SERVICE (PYTHON)
**Generated:** 2026-02-28 04:45:09

---

```yaml
# ================================================================================
# ATOMIC YAML SPECIFICATION – STEP 7
# Glohib.ai Recommendation Service (Python micro-service)
# ================================================================================

step_metadata:
  id: glb-ai-step-007
  name: recommendation-service
  phase: build
  priority: P0
  estimate: 2d

context: |
  FastAPI micro-service responsible for generating 512-dim embeddings,
  cosine similarity matching, behavioral signal collection, ranking,
  cold-start handling and A/B hooks.

tasks:

  # ------------------------------------------------------------------ #
  # 1. Project skeleton & requirements
  # ------------------------------------------------------------------ #
  - id: t7.01
    action: shell_command
    command: mkdir -p recommendation-service/{app/{models,services,api},tests}

  - id: t7.02
    action: create_file
    file: recommendation-service/requirements.txt
    content: |
      fastapi==0.111.0
      uvicorn[standard]==0.29.0
      pydantic==2.7.1
      sentence-transformers==2.7.0
      torch==2.3.0
      transformers==4.40.1
      pgvector==0.2.4
      psycopg2-binary==2.9.9
      redis[hiredis]==5.0.4
      numpy==1.26.4
      scikit-learn==1.4.2
      python-dotenv==1.0.1
      httpx==0.27.0
      pytest==8.2.0

  # ------------------------------------------------------------------ #
  # 2. Core configuration
  # ------------------------------------------------------------------ #
  - id: t7.03
    action: create_file
    file: recommendation-service/.env.example
    content: |
      VECTOR_DIM=512
      POSTGRES_DSN=postgresql+psycopg2://glohib:secret@postgres:5432/glohib
      REDIS_URL=redis://redis:6379/1
      MODEL_NAME=all-MiniLM-L6-v2
      RANK_WEIGHT_SIM=0.5
      RANK_WEIGHT_BEH=0.3
      RANK_WEIGHT_REC=0.2

  # ------------------------------------------------------------------ #
  # 3. Pydantic models
  # ------------------------------------------------------------------ #
  - id: t7.04
    action: create_file
    file: recommendation-service/app/models/vector.py
    content: |
      from typing import List
      from pydantic import BaseModel, conlist

      class Vector512(BaseModel):
          embedding: conlist(float, min_length=512, max_length=512)

      class StudentFeatures(BaseModel):
          student_id: str
          skills: List[str]
          interests: List[str]
          major: str
          graduation_year: int
          location: str
          languages: List[str]
          experience_months: int
          preferred_industries: List[str]

      class InternshipFeatures(BaseModel):
          internship_id: str
          title: str
          description: str
          required_skills: List[str]
          location: str
          industry: str
          paid: bool
          remote: bool
          duration_weeks: int

  - id: t7.05
    action: create_file
    file: recommendation-service/app/models/recommendation.py
    content: |
      from typing import List
      from pydantic import BaseModel, Field
      from datetime import datetime

      class RecommendationItem(BaseModel):
          internship_id: str
          score: float = Field(..., ge=0.0, le=1.0)
          similarity: float
          behavioral: float
          recency_boost: float
          explanation: str = ""

      class RecommendationResponse(BaseModel):
          student_id: str
          recommendations: List[RecommendationItem]
          generated_at: datetime

      class BehavioralEvent(BaseModel):
          student_id: str
          internship_id: str
          event_type: str  # click | view | save | apply
          timestamp: datetime = Field(default_factory=datetime.utcnow)

  # ------------------------------------------------------------------ #
  # 4. Vectorizer service
  # ------------------------------------------------------------------ #
  - id: t7.06
    action: create_file
    file: recommendation-service/app/services/vectorizer.py
    content: |
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

  # ------------------------------------------------------------------ #
  # 5. Matching service (cosine similarity + pgvector)
  # ------------------------------------------------------------------ #
  - id: t7.07
    action: create_file
    file: recommendation-service/app/services/matching.py
    content: |
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

  # ------------------------------------------------------------------ #
  # 6. Behavioral service (Redis backed)
  # ------------------------------------------------------------------ #
  - id: t7.08
    action: create_file
    file: recommendation-service/app/services/behavioral.py
    content: |
      import json
      import redis
      from typing import Dict, List
      from datetime import datetime, timedelta
      from app.models.recommendation import BehavioralEvent

      r = redis.from_url(os.getenv("REDIS_URL", "redis://redis:6379/1"))

      class BehavioralService:
          def track(self, event: BehavioralEvent):
              key = f"beh:{event.student_id}:{event.event_type}"
              r.zadd(key, {event.internship_id: event.timestamp.timestamp()})
              r.expire(key, 60*60*24*90)  # 90 days

          def score(self, student_id: str, internship_ids: List[str]) -> Dict[str, float]:
              pipe = r.pipeline()
              for itype in ["click", "view", "save", "apply"]:
                  key = f"beh:{student_id}:{itype}"
                  pipe.zscore(key, internship_ids[0])  # dummy
              raw = pipe.execute()
              weights = {"click": 0.3, "view": 0.1, "save": 0.4, "apply": 0.6}
              scores = {}
              for iid in internship_ids:
                  total = 0.0
                  for idx, etype in enumerate(weights):
                      key = f"beh:{student_id}:{etype}"
                      val = r.zscore(key, iid) or 0.0
                      age_days = (datetime.utcnow().timestamp() - val) / 86400 if val else 90
                      decay = max(0, 1 - age_days / 90)
                      total += weights[etype] * decay
                  scores[iid] = min(1.0, total)
              return scores

          def behavioral_vector(self, student_id: str) -> List[str]:
              all_seen = set()
              for etype in ["click", "view", "save", "apply"]:
                  key = f"beh:{student_id}:{etype}"
                  all_seen.update(r.zrange(key, 0, -1))
              return [iid.decode() for iid in all_seen]

      _instance = BehavioralService()
      def get_behavioral() -> BehavioralService:
          return _instance

  # ------------------------------------------------------------------ #
  # 7. Ranking service
  # ------------------------------------------------------------------ #
  - id: t7.09
    action: create_file
    file: recommendation-service/app/services/ranking.py
    content: |
      import os
      from datetime import datetime
      from typing import List
      from app.models.recommendation import RecommendationItem
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
                   student_vector,
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
              # cached lookup or DB call
              from app.db import engine
              from sqlalchemy import text
              sql = text("SELECT embedding FROM internship_vectors WHERE internship_id=:iid")
              with engine.connect() as conn:
                  row = conn.execute(sql, {"iid": iid}).fetchone()
              from app.models.vector import Vector512
              return Vector512(embedding=row["embedding"])

      _instance = RankingService()
      def get_ranker() -> RankingService:
          return _instance

  # ------------------------------------------------------------------ #
  # 8. DB helpers
  # ------------------------------------------------------------------ #
  - id: t7.10
    action: create_file
      file: recommendation-service/app/db.py
      content: |
        import os
        from sqlalchemy import create_engine
        POSTGRES_DSN = os.getenv("POSTGRES_DSN")
        engine = create_engine(POSTGRES_DSN, pool_pre_ping=True)

  # ------------------------------------------------------------------ #
  # 9. FastAPI endpoints
  # ------------------------------------------------------------------ #
  - id: t7.11
    action: create_file
    file: recommendation-service/app/api/routes.py
    content: |
      from fastapi import APIRouter, Depends, HTTPException
      from datetime import datetime
      from app.models.vector import StudentFeatures, InternshipFeatures, Vector512
      from app.models.recommendation import (
          RecommendationResponse,
          BehavioralEvent,
          RecommendationItem
      )
      from app.services.vectorizer import get_vectorizer
      from app.services.matching import get_matcher
      from app.services.ranking import get_ranker
      from app.services.behavioral import get_behavioral

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
          # cold-start fallback: retrieve cached student vector or generate dummy
          from app.db import engine
          from sqlalchemy import text
          sql = text("SELECT embedding FROM student_vectors WHERE student_id=:sid")
          with engine.connect() as conn:
              row = conn.execute(sql, {"sid": student_id}).fetchone()
          if not row:
              raise HTTPException(404, "Student not vectorized")
          from app.models.vector import Vector512
          vec = Vector512(embedding=row["embedding"])
          vec.student_id = student_id  # attach for behavioral service
          top_ids = get_matcher().find_top_internships(vec, 100)
          recency_map = {iid: 0.0 for iid in top_ids}  # TODO: use posting date
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

  # ------------------------------------------------------------------ #
  # 10. FastAPI main entry
  # ------------------------------------------------------------------ #
  - id: t7.12
    action: create_file
    file: recommendation-service/app/main.py
    content: |
      import os
      from fastapi import FastAPI
      from app.api.routes import router
      from app.db import engine
      from app.services.vectorizer import get_vectorizer  # preload model

      app = FastAPI(title="Glohib.ai Recommendation Service", version="1.0.0")
      app.include_router(router)

      @app.on_event("startup")
      def on_start():
          # ensure pgvector extension
          with engine.connect() as conn:
              conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")
              conn.commit()
          # warm model
          get_vectorizer()

      @app.get("/health")
      def health():
          return {"status": "alive"}

  # ------------------------------------------------------------------ #
  # 11. Dockerfile
  # ------------------------------------------------------------------ #
  - id: t7.13
    action: create_file
    file: recommendation-service/Dockerfile
    content: |
      FROM python:3.11-slim
      WORKDIR /app
      RUN apt-get update && apt-get install -y --no-install-recommends \
          gcc g++ libpq-dev && rm -rf /var/lib/apt/lists/*
      COPY requirements.txt .
      RUN pip install --no-cache-dir -r requirements.txt
      COPY . .
      CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8007"]

  # ------------------------------------------------------------------ #
  # 12. Unit test skeleton
  # ------------------------------------------------------------------ #
  - id: t7.14
    action: create_file
    file: recommendation-service/tests/test_vectorizer.py
    content: |
      from app.services.vectorizer import VectorizerService
      from app.models.vector import StudentFeatures

      def test_vectorize_student():
          svc = VectorizerService()
          vec = svc.vectorize_student(StudentFeatures(
              student_id="s1",
              skills=["python", "fastapi"],
              interests=["ml", "data"],
              major="CS",
              graduation_year=2025,
              location="NYC",
              languages=["english"],
              experience_months=6,
              preferred_industries=["tech"]
          ))
          assert len(vec.embedding) == 512

deliverables:
  - recommendation-service/requirements.txt
  - recommendation-service/app/main.py
  - recommendation-service/app/services/vectorizer.py
  - recommendation-service/app/services/matching.py
  - recommendation-service/app/services/ranking.py
  - recommendation-service/app/services/behavioral.py
  - recommendation-service/app/models/vector.py
  - recommendation-service/app/models/recommendation.py
  - recommendation-service/app/api/routes.py
  - recommendation-service/Dockerfile
  - recommendation-service/tests/

verification_checklist:
  - docker build -t glb-recommendation recommendation-service
  - docker run --rm -p 8007:8007 --env-file .env glb-recommendation
  - curl http://localhost:8007/health → 200 {"status":"alive"}
  - curl -X POST http://localhost:8007/api/v1/vectorize/student -d '{"student_id":"s1","skills":["py"],"interests":["ml"],"major":"CS","graduation_year":2025,"location":"NYC","languages":["en"],"experience_months":0,"preferred_industries":["tech"]}' → 512-dim vector
  - curl http://localhost:8007/api/v1/recommend/s1 → non-empty ranked list

execution_commands:
  - cd recommendation-service && docker build -t glb-recommendation .
  - docker run -d --name glb-reco --network glohib -p 8007:8007 --env-file .env glb-recommendation

next_step: glb-ai-step-008  # Notification service
```

---

**Token Usage:** {'prompt_tokens': 659, 'completion_tokens': 4400, 'total_tokens': 5059}
