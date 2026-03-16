import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, Float, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import enum

from backend.shared.database.connection import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    EMPLOYER = "employer"
    ADMIN = "admin"

class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    REVIEWED = "reviewed"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    ACCEPTED = "accepted"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.STUDENT)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    university = Column(String(255))
    degree = Column(String(255))
    skills = Column(JSONB, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student")
    assessments = relationship("Assessment", back_populates="student")

class EmployerProfile(Base):
    __tablename__ = "employer_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_name = Column(String(255), nullable=False)
    industry = Column(String(100))
    website = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="employer_profile")
    internships = relationship("Internship", back_populates="employer")

class Internship(Base):
    __tablename__ = "internships"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("employer_profiles.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    remote = Column(Boolean, default=False)
    skills_required = Column(JSONB, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employer = relationship("EmployerProfile", back_populates="internships")
    applications = relationship("Application", back_populates="internship")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_profiles.id"), nullable=False)
    internship_id = Column(UUID(as_uuid=True), ForeignKey("internships.id"), nullable=False)
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.SUBMITTED)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("StudentProfile", back_populates="applications")
    internship = relationship("Internship", back_populates="applications")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_profiles.id"), nullable=False)
    score = Column(Integer)
    results = Column(JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("StudentProfile", back_populates="assessments")

class Score(Base):
    __tablename__ = "scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student_profiles.id"), nullable=False)
    internship_id = Column(UUID(as_uuid=True), ForeignKey("internships.id"), nullable=False)
    match_score = Column(Float)
