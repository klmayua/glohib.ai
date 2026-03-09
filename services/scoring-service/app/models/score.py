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
