from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class InternshipBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    remote: bool = False
    skills_required: Optional[List[str]] = []

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(InternshipBase):
    pass

class InternshipResponse(InternshipBase):
    id: UUID
    employer_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
