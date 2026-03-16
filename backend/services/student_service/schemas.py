from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class StudentProfileBase(BaseModel):
    first_name: str
    last_name: str
    university: Optional[str] = None
    degree: Optional[str] = None
    skills: Optional[List[str]] = []

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfileResponse(StudentProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
