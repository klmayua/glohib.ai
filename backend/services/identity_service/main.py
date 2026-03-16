from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.services.identity_service.router import router as identity_router

app = FastAPI(title="Identity Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(identity_router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
