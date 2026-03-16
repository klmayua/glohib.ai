import os
from fastapi import FastAPI, Response
from app.api.routes import router
from app.db import engine
from app.services.vectorizer import get_vectorizer
from app.rate_limit import rate_limit_middleware
from app.metrics import metrics_middleware, metrics_endpoint
from sqlalchemy import text

app = FastAPI(title="Glohib.ai Recommendation Service", version="1.0.0")

# Set service name for metrics
os.environ['SERVICE_NAME'] = 'recommendation-service'

# Add middleware
app.middleware("http")(rate_limit_middleware)
app.middleware("http")(metrics_middleware)

app.include_router(router)

@app.on_event("startup")
def on_start():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()
    get_vectorizer()

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "recommendation-service",
        "version": "1.0.0"
    }

@app.get("/metrics")
def metrics():
    """Prometheus metrics endpoint"""
    return metrics_endpoint(None)
