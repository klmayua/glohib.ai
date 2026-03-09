from fastapi import FastAPI
from app.api.routes import router
from app.db import engine
from app.services.vectorizer import get_vectorizer
from sqlalchemy import text

app = FastAPI(title="Glohib.ai Recommendation Service", version="1.0.0")
app.include_router(router)

@app.on_event("startup")
def on_start():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()
    get_vectorizer()

@app.get("/health")
def health():
    return {"status": "alive"}
