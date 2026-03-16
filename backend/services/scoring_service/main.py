from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.scoring_service.router import router as scoring_router

app = FastAPI(title="Scoring Service", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(scoring_router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
