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
