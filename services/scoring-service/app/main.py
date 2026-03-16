import os
import time
from contextlib import asynccontextmanager
from typing import List
import structlog
from fastapi import FastAPI, HTTPException, status
from prometheus_client import Counter, Histogram, generate_latest
from fastapi.responses import PlainTextResponse
from app.rate_limit import rate_limit_middleware
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

score_counter = Counter("score_requests_total", "Total score requests")
score_latency = Histogram("score_latency_seconds", "Score latency")
explainer_counter = Counter("explain_requests_total", "Total explain requests")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start metrics server if port available
    try:
        start_metrics_server(METRICS_PORT)
    except OSError as e:
        logger.warning("metrics_server_failed", error=str(e))

    registry = ModelRegistry(MODEL_REG_PATH)
    # Try to load model, but don't fail if not found
    try:
        await registry.load_model(DEFAULT_VER)
        logger.info("scoring-service ready", model_version=DEFAULT_VER)
    except FileNotFoundError:
        logger.warning("no_model_found", version=DEFAULT_VER, message="Run /api/v1/model/train to create a model")
    yield
    logger.info("scoring-service shutdown")

app = FastAPI(
    title="Glohib Scoring Service",
    version=os.getenv("APP_VERSION", "0.1.0"),
    lifespan=lifespan,
)

app.middleware("http")(rate_limit_middleware)

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
