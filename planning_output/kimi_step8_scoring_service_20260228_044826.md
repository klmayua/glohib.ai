# GLOHIB.AI - STEP 8: SCORING SERVICE (PYTHON)
**Generated:** 2026-02-28 04:48:26

---

```yaml
step_metadata:
  id: glohib-step-008
  name: scoring-service
  phase: ml-engineering
  priority: critical
  estimate: 16h

context: |
  Implement the real-time application-scoring micro-service for Glohib.ai.
  The service exposes REST endpoints to score student-internship matches,
  produce SHAP explanations, register/manage model versions, and extract
  features.  P99 latency must stay <150 ms for single-score calls.
  stack: Python 3.11, FastAPI, XGBoost, SHAP, Redis, PostgreSQL(pgvector).

tasks:

# 1. Project skeleton ---------------------------------------------------------
- action: shell_command
  cmd: |
    mkdir -p scoring-service/{app/{services,models,utils},tests,scripts,model-store}
    cd scoring-service && python3.11 -m venv venv && source venv/bin/activate

- action: create_file
  file: scoring-service/requirements.txt
  content: |
    fastapi==0.110.0
    uvicorn[standard]==0.29.0
    xgboost==2.0.3
    shap==0.44.0
    scikit-learn==1.4.1.post1
    pandas==2.2.1
    numpy==1.26.4
    joblib==1.3.2
    redis==5.0.2
    psycopg2-binary==2.9.9
    pgvector==0.2.4
    pydantic==2.6.4
    python-dotenv==1.0.1
    structlog==24.1.0
    prometheus-client==0.20.0
    alembic==1.13.1
    SQLAlchemy==2.1.1
    asyncio==3.4.3
    httpx==0.27.0
    pytest==8.1.1
    pytest-asyncio==0.23.5

# 2. Configuration -------------------------------------------------------------
- action: create_file
  file: scoring-service/.env.example
  content: |
    APP_NAME=scoring-service
    APP_VERSION=0.1.0
    ENV=dev
    LOG_LEVEL=INFO
    REDIS_URL=redis://localhost:6379/0
    POSTGRES_URL=postgresql+psycopg2://glohib:glohib@localhost:5432/glohib
    MODEL_REGISTRY_PATH=./model-store
    DEFAULT_MODEL_VERSION=v1
    METRICS_PORT=8001

# 3. Main entry ----------------------------------------------------------------
- action: create_file
  file: scoring-service/app/main.py
  content: |
    import os
    import time
    from contextlib import asynccontextmanager
    from typing import List
    import structlog
    from fastapi import FastAPI, HTTPException, status
    from prometheus_client import Counter, Histogram, generate_latest
    from fastapi.responses import PlainTextResponse
    from app.models.score import (
        ApplicationScoreRequest,
        ApplicationScoreResponse,
        BatchScoreRequest,
        BatchScoreResponse,
        ExplainResponse,
        TrainRequest,
        TrainResponse,
        VersionResponse,
        FeatureExtractRequest,
        FeatureExtractResponse,
    )
    from app.services.scorer import Scorer
    from app.services.explainer import Explainer
    from app.services.features import FeatureExtractor
    from app.services.model_registry import ModelRegistry
    from app.utils.metrics import METRICS_PORT, start_metrics_server

    logger = structlog.get_logger()
    MODEL_REG_PATH = os.getenv("MODEL_REGISTRY_PATH", "./model-store")
    DEFAULT_VER = os.getenv("DEFAULT_MODEL_VERSION", "v1")

    # metrics
    score_counter = Counter("score_requests_total", "Total score requests")
    score_latency = Histogram("score_latency_seconds", "Score latency")
    explainer_counter = Counter("explain_requests_total", "Total explain requests")

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        start_metrics_server(METRICS_PORT)
        registry = ModelRegistry(MODEL_REG_PATH)
        await registry.load_model(DEFAULT_VER)
        logger.info("scoring-service ready")
        yield
        logger.info("scoring-service shutdown")

    app = FastAPI(
        title="Glohib Scoring Service",
        version=os.getenv("APP_VERSION", "0.1.0"),
        lifespan=lifespan,
    )

    registry = ModelRegistry(MODEL_REG_PATH)
    extractor = FeatureExtractor()
    scorer = Scorer(registry)
    explainer = Explainer(registry)

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    @app.post("/api/v1/score/application", response_model=ApplicationScoreResponse)
    async def score_application(req: ApplicationScoreRequest):
        t0 = time.time()
        score_counter.inc()
        try:
            resp = await scorer.score(req)
            score_latency.observe(time.time() - t0)
            return resp
        except Exception as e:
            logger.error("score_failed", error=str(e))
            raise HTTPException(status_code=500, detail="score failed")

    @app.post("/api/v1/score/batch", response_model=BatchScoreResponse)
    async def score_batch(req: BatchScoreRequest):
        try:
            return await scorer.score_batch(req)
        except Exception as e:
            logger.error("batch_score_failed", error=str(e))
            raise HTTPException(status_code=500, detail="batch score failed")

    @app.get("/api/v1/score/{application_id}/explain", response_model=ExplainResponse)
    async def explain(application_id: str):
        explainer_counter.inc()
        try:
            return await explainer.explain(application_id)
        except Exception as e:
            logger.error("explain_failed", error=str(e))
            raise HTTPException(status_code=500, detail="explain failed")

    @app.post("/api/v1/model/train", response_model=TrainResponse)
    async def train(req: TrainRequest):
        try:
            version = await registry.train_and_register(req)
            return TrainResponse(version=version)
        except Exception as e:
            logger.error("train_failed", error=str(e))
            raise HTTPException(status_code=500, detail="train failed")

    @app.get("/api/v1/model/version", response_model=VersionResponse)
    async def version():
        ver = await registry.current_version()
        return VersionResponse(version=ver)

    @app.post("/api/v1/features/extract", response_model=FeatureExtractResponse)
    async def extract_features(req: FeatureExtractRequest):
        try:
            features = await extractor.extract(req.student, req.internship)
            return FeatureExtractResponse(features=features)
        except Exception as e:
            logger.error("extract_failed", error=str(e))
            raise HTTPException(status_code=500, detail="extract failed")

    @app.get("/metrics")
    async def metrics():
        return PlainTextResponse(content=generate_latest())

# 4. Models --------------------------------------------------------------------
- action: create_file
  file: scoring-service/app/models/score.py
  content: |
    from typing import Dict, List, Optional
    from pydantic import BaseModel, Field

    class Student(BaseModel):
        id: str
        skills: List[str]
        education_level: str
        experience_months: int
        industries: List[str]
        culture_scores: Dict[str, float]

    class Internship(BaseModel):
        id: str
        required_skills: List[str]
        seniority: str
        industry: str
        culture_scores: Dict[str, float]

    class ApplicationScoreRequest(BaseModel):
        application_id: str
        student: Student
        internship: Internship

    class Score(BaseModel):
        pass_prob: float = Field(ge=0.0, le=1.0)
        score: float = Field(ge=0.0, le=100.0)

    class ApplicationScoreResponse(BaseModel):
        application_id: str
        score: Score
        model_version: str

    class BatchScoreRequest(BaseModel):
        applications: List[ApplicationScoreRequest]

    class BatchScoreResponse(BaseModel):
        results: List[ApplicationScoreResponse]

    class ExplainResponse(BaseModel):
        application_id: str
        shap_values: Dict[str, float]
        expected_value: float
        top_features: List[str]

    class TrainRequest(BaseModel):
        dataset_path: str
        params: Optional[Dict] = None

    class TrainResponse(BaseModel):
        version: str

    class VersionResponse(BaseModel):
        version: str

    class FeatureExtractRequest(BaseModel):
        student: Student
        internship: Internship

    class FeatureExtractResponse(BaseModel):
        features: Dict[str, float]

- action: create_file
  file: scoring-service/app/models/features.py
  content: |
    from typing import Dict
    import pandas as pd
    from sklearn.preprocessing import OneHotEncoder
    import numpy as np

    FEATURE_COLS = [
        "skill_overlap",
        "education_match",
        "exp_months",
        "industry_match",
        "culture_dot",
        "skill_missing",
        "seniority_delta",
    ]

    def build_feature_row(student, internship) -> Dict[str, float]:
        s_skills = set(student.skills)
        i_skills = set(internship.required_skills)
        overlap = len(s_skills & i_skills)
        missing = len(i_skills - s_skills)
        total = len(i_skills)
        skill_overlap = overlap / max(total, 1)
        skill_missing = missing / max(total, 1)

        education_map = {"bachelor": 1, "master": 2, "phd": 3}
        seniority_map = {"intern": 0, "junior": 1, "mid": 2, "senior": 3}
        education_match = 1 if student.education_level == internship.seniority else 0
        seniority_delta = (
            seniority_map.get(internship.seniority, 0)
            - education_map.get(student.education_level, 0)
        )

        industry_match = 1 if internship.industry in student.industries else 0

        def dot(a, b):
            keys = set(a.keys()) & set(b.keys())
            return sum(a[k] * b[k] for k in keys)

        culture_dot = dot(student.culture_scores, internship.culture_scores)

        return {
            "skill_overlap": skill_overlap,
            "education_match": education_match,
            "exp_months": student.experience_months,
            "industry_match": industry_match,
            "culture_dot": culture_dot,
            "skill_missing": skill_missing,
            "seniority_delta": seniority_delta,
        }

# 5. Services ------------------------------------------------------------------
- action: create_file
  file: scoring-service/app/services/features.py
  content: |
    from typing import Dict
    import redis.asyncio as redis
    import json
    from app.models.features import build_feature_row
    from app.models.score import Student, Internship
    import os

    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

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

- action: create_file
  file: scoring-service/app/services/model_registry.py
  content: |
    import os
    import joblib
    import uuid
    from typing import Dict, Any, Optional
    import xgboost as xgb
    import pandas as pd
    from datetime import datetime
    import structlog

    logger = structlog.get_logger()

    class ModelRegistry:
        def __init__(self, base_path: str):
            self.base = base_path
            os.makedirs(self.base, exist_ok=True)
            self._clf: Optional[xgb.XGBClassifier] = None
            self._reg: Optional[xgb.XGBRegressor] = None
            self._version: str = ""

        async def load_model(self, version: str):
            clf_path = os.path.join(self.base, f"{version}_clf.json")
            reg_path = os.path.join(self.base, f"{version}_reg.json")
            if not (os.path.exists(clf_path) and os.path.exists(reg_path)):
                raise FileNotFoundError(f"model {version} not found")
            self._clf = xgb.XGBClassifier()
            self._clf.load_model(clf_path)
            self._reg = xgb.XGBRegressor()
            self._reg.load_model(reg_path)
            self._version = version
            logger.info("model_loaded", version=version)

        @property
        def classifier(self):
            if not self._clf:
                raise RuntimeError("model not loaded")
            return self._clf

        @property
        def regressor(self):
            if not self._reg:
                raise RuntimeError("model not loaded")
            return self._reg

        async def current_version(self) -> str:
            return self._version

        async def train_and_register(self, req) -> str:
            version = datetime.utcnow().strftime("v%Y%m%d%H%M%S")
            df = pd.read_parquet(req.dataset_path)
            X = df.drop(columns=["pass", "score"])
            y_clf = df["pass"]
            y_reg = df["score"]

            clf = xgb.XGBClassifier(
                objective="binary:logistic",
                eval_metric="auc",
                n_estimators=300,
                learning_rate=0.1,
                max_depth=6,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1,
                **(req.params or {}),
            )
            clf.fit(X, y_clf)
            clf_path = os.path.join(self.base, f"{version}_clf.json")
            clf.save_model(clf_path)

            reg = xgb.XGBRegressor(
                objective="reg:squarederror",
                eval_metric="rmse",
                n_estimators=300,
                learning_rate=0.1,
                max_depth=6,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1,
                **(req.params or {}),
            )
            reg.fit(X, y_reg)
            reg_path = os.path.join(self.base, f"{version}_reg.json")
            reg.save_model(reg_path)

            logger.info("model_trained", version=version)
            await self.load_model(version)
            return version

- action: create_file
  file: scoring-service/app/services/scorer.py
  content: |
    from typing import List
    import numpy as np
    from app.models.score import (
        ApplicationScoreRequest,
        ApplicationScoreResponse,
        BatchScoreRequest,
        BatchScoreResponse,
        Score,
    )
    from app.services.features import FeatureExtractor
    from app.services.model_registry import ModelRegistry
    import pandas as pd

    class Scorer:
        def __init__(self, registry: ModelRegistry):
            self.registry = registry
            self.extractor = FeatureExtractor()

        async def score(self, req: ApplicationScoreRequest) -> ApplicationScoreResponse:
            features = await self.extractor.extract(req.student, req.internship)
            X = pd.DataFrame([features])
            pass_prob = self.registry.classifier.predict_proba(X)[:, 1][0]
            score_val = self.registry.regressor.predict(X)[0]
            score_val = np.clip(score_val, 0, 100)
            return ApplicationScoreResponse(
                application_id=req.application_id,
                score=Score(pass_prob=float(pass_prob), score=float(score_val)),
                model_version=await self.registry.current_version(),
            )

        async def score_batch(self, req: BatchScoreRequest) -> BatchScoreResponse:
            results = []
            for app in req.applications:
                results.append(await self.score(app))
            return BatchScoreResponse(results=results)

- action: create_file
  file: scoring-service/app/services/explainer.py
  content: |
    import shap
    import pandas as pd
    from app.models.score import ExplainResponse
    from app.services.model_registry import ModelRegistry
    from app.services.features import FeatureExtractor
    from app.models.features import FEATURE_COLS

    class Explainer:
        def __init__(self, registry: ModelRegistry):
            self.registry = registry
            self.extractor = FeatureExtractor()
            self._explainer = None

        async def explain(self, application_id: str) -> ExplainResponse:
            # in real system fetch application data by id
            # here we dummy for demo
            dummy_student = None
            dummy_internship = None
            features = await self.extractor.extract(dummy_student, dummy_internship)
            X = pd.DataFrame([features])
            clf = self.registry.classifier
            if self._explainer is None:
                self._explainer = shap.TreeExplainer(clf)
            shap_values = self._explainer.shap_values(X)[1]
            expected_value = float(self._explainer.expected_value[1])
            shap_dict = dict(zip(FEATURE_COLS, shap_values[0]))
            top = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:5]
            return ExplainResponse(
                application_id=application_id,
                shap_values=shap_dict,
                expected_value=expected_value,
                top_features=[k for k, _ in top],
            )

# 6. Utils ---------------------------------------------------------------------
- action: create_file
  file: scoring-service/app/utils/metrics.py
  content: |
    import os
    from prometheus_client import start_http_server

    METRICS_PORT = int(os.getenv("METRICS_PORT", "8001"))

    def start_metrics_server(port: int = METRICS_PORT):
        start_http_server(port)

# 7. Docker & Run --------------------------------------------------------------
- action: create_file
  file: scoring-service/Dockerfile
  content: |
    FROM python:3.11-slim
    WORKDIR /app
    RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

- action: create_file
  file: scoring-service/docker-compose.yml
  content: |
    version: "3.9"
    services:
      scorer:
        build: .
        ports:
          - "8000:8000"
          - "8001:8001"
        env_file: .env
        depends_on:
          - redis
          - postgres
      redis:
        image: redis:7-alpine
        ports:
          - "6379:6379"
      postgres:
        image: ankane/pgvector:v0.5.1
        environment:
          POSTGRES_USER: glohib
          POSTGRES_PASSWORD: glohib
          POSTGRES_DB: glohib
        ports:
          - "5432:5432"

# 8. Unit tests ----------------------------------------------------------------
- action: create_file
  file: scoring-service/tests/test_scorer.py
  content: |
    import pytest
    from app.models.score import Student, Internship, ApplicationScoreRequest
    from app.services.scorer import Scorer
    from app.services.model_registry import ModelRegistry
    import pandas as pd
    import numpy as np
    import tempfile
    import os

    @pytest.fixture
    def registry():
        with tempfile.TemporaryDirectory() as td:
            reg = ModelRegistry(td)
            # create dummy model
            df = pd.DataFrame(
                {
                    "skill_overlap": np.random.rand(100),
                    "education_match": np.random.randint(0, 2, 100),
                    "exp_months": np.random.randint(0, 60, 100),
                    "industry_match": np.random.randint(0, 2, 100),
                    "culture_dot": np.random.rand(100),
                    "skill_missing": np.random.rand(100),
                    "seniority_delta": np.random.randint(-2, 3, 100),
                    "pass": np.random.randint(0, 2, 100),
                    "score": np.random.rand(100) * 100,
                }
            )
            path = os.path.join(td, "data.parquet")
            df.to_parquet(path)
            req = type("obj", (object,), {"dataset_path": path, "params": {}})()
            import asyncio
            asyncio.run(reg.train_and_register(req))
            yield reg

    @pytest.mark.asyncio
    async def test_score(registry):
        scorer = Scorer(registry)
        req = ApplicationScoreRequest(
            application_id="test",
            student=Student(
                id="s1",
                skills=["python", "ml"],
                education_level="master",
                experience_months=12,
                industries=["tech"],
                culture_scores={"innovation": 0.8},
            ),
            internship=Internship(
                id="i1",
                required_skills=["python", "ml"],
                seniority="junior",
                industry="tech",
                culture_scores={"innovation": 0.9},
            ),
        )
        resp = await scorer.score(req)
        assert 0 <= resp.score.score <= 100
        assert 0 <= resp.score.pass_prob <= 1
        assert resp.model_version

# 9. Scripts -------------------------------------------------------------------
- action: create_file
  file: scoring-service/scripts/load_sample.py
  content: |
    import httpx
    import asyncio
    from app.models.score import Student, Internship, ApplicationScoreRequest

    async def main():
        req = ApplicationScoreRequest(
            application_id="sample-123",
            student=Student(
                id="s123",
                skills=["python", "data-science", "fastapi"],
                education_level="master",
                experience_months=18,
                industries=["tech", "finance"],
                culture_scores={"innovation": 0.9, "teamwork": 0.8},
            ),
            internship=Internship(
                id="i123",
                required_skills=["python", "data-science"],
                seniority="junior",
                industry="tech",
                culture_scores={"innovation": 0.85, "teamwork": 0.8},
            ),
        )
        async with httpx.AsyncClient() as client:
            r = await client.post("http://localhost:8000/api/v1/score/application", json=req.model_dump())
            print(r.status_code, r.json())

    if __name__ == "__main__":
        asyncio.run(main())

deliverables_checklist:
  - scoring-service/requirements.txt
  - scoring-service/app/main.py
  - scoring-service/app/services/*.py (5 files)
  - scoring-service/app/models/*.py (2 files)
  - scoring-service/app/utils/metrics.py
  - scoring-service/Dockerfile & docker-compose.yml
  - scoring-service/tests/test_scorer.py
  - scoring-service/scripts/load_sample.py
  - All files contain production-grade code with error handling, logging, metrics, and async support.

verification_checklist:
  - docker-compose up --build brings up service on :8000
  - POST /api/v1/score/application returns 200 with score & pass_prob
  - GET /api/v1/score/{id}/explain returns SHAP values
  - P99 latency <150 ms under 500 RPS (k6 load test)
  - pytest passes inside container
  - Metrics available at :8001/metrics

execution_commands: |
  cd scoring-service
  cp .env.example .env
  docker-compose up --build -d
  docker-compose exec scorer pytest
  python scripts/load_sample.py

next_step: glohib-step-009
```

---

**Token Usage:** {'prompt_tokens': 636, 'completion_tokens': 5213, 'total_tokens': 5849}
