from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class EmployerProfileBase(BaseModel):
    organization_name: str
    industry: Optional[str] = None
    website: Optional[str] = None

class EmployerProfileCreate(EmployerProfileBase):
    pass

class EmployerProfileUpdate(EmployerProfileBase):
    pass

class EmployerProfileResponse(EmployerProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
