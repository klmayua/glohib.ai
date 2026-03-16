from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.recommendation_service.router import router as recommendation_router

app = FastAPI(title="Recommendation Service", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(recommendation_router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
