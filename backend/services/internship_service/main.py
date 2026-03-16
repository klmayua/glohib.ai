from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.internship_service.router import router as internship_router

app = FastAPI(title="Internship Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(internship_router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
