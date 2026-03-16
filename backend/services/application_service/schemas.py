from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from enum import Enum

class ApplicationStatusEnum(str, Enum):
    SUBMITTED = "submitted"
    REVIEWED = "reviewed"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    ACCEPTED = "accepted"

class ApplicationBase(BaseModel):
    internship_id: UUID

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatusEnum] = None

class ApplicationResponse(ApplicationBase):
    id: UUID
    student_id: UUID
    status: ApplicationStatusEnum
    created_at: datetime
    
    class Config:
        from_attributes = True
