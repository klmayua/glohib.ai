# 00 - Project Identity

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI
**Scan Version:** 2.0

---

## Project Overview

| Attribute | Value |
|-----------|-------|
| **Project Name** | GlohibAI |
| **Description** | AI-Powered Global Health Internship Platform |
| **Root Path** | C:\Users\UCHE\my-qwen-project\PROJECTS\GlohibAI |
| **Primary Language** | Go, Python, TypeScript, Node.js |
| **Architecture Style** | Microservices |
| **Deployment Strategy** | Docker Compose (Development) |

---

## Core Purpose

GlohibAI is an AI-powered platform connecting students with global health internship opportunities. The platform provides:

- Student profile management with skills tracking
- Internship posting and discovery
- AI-powered recommendations based on student profiles
- Automated scoring and assessment capabilities
- Video interview processing with transcription
- 7-stage assessment workflow engine

---

## Technology Stack Summary

### Backend Services

| Service | Language | Framework | Port(s) | Status |
|---------|----------|-----------|---------|--------|
| Identity | Go 1.22 | Gin + gRPC | 8080, 50051 | ✅ Complete |
| Student | Go 1.22 | Gin | 8082 | ✅ Complete |
| Internship | Go 1.22 | Gin | 8083 | ✅ Complete |
| Assessment | Go 1.22 | Gin + gRPC | 8084, 50054 | ✅ Complete |
| Recommendation | Python 3.11 | FastAPI | 8007 | ✅ Complete |
| Scoring | Python 3.11 | FastAPI | 8008 | ✅ Complete |
| Video | Node.js 20 | Express | 4000 | ✅ Complete |

### Infrastructure

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Database | PostgreSQL + pgvector | 16 | Primary data store with vector search |
| Cache | Redis | 7-alpine | Session management, caching |
| Object Storage | MinIO | latest | Video/assets storage |
| Message Queue | RabbitMQ | 3.11 | Async messaging (configured, unused) |
| Vector DB | Qdrant | 1.7.0 | Vector embeddings (configured) |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14 | React framework |
| TypeScript | 5.4 | Type safety |
| Tailwind CSS | 4.2 | Styling |
| Zustand | 4.5 | State management |
| React Query | 5.35 | Data fetching |
| Playwright | 1.58 | E2E testing |

---

## Key Features

### Implemented Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - OAuth2 (Google) integration
   - API key management
   - Role-based access control

2. **Student Management**
   - Profile CRUD operations
   - Skills tracking
   - Education history
   - Experience management

3. **Internship Management**
   - Posting creation and management
   - Advanced search with filters
   - Vector-based similarity search
   - Application tracking

4. **Assessment Engine**
   - 7-stage workflow
   - Timer-based assessments
   - Auto-grading capabilities
   - gRPC integration

5. **AI/ML Capabilities**
   - Sentence transformer embeddings
   - Cosine similarity matching
   - XGBoost scoring models
   - SHAP explainability
   - Behavioral tracking

6. **Video Processing**
   - TUS resumable uploads
   - FFmpeg transcoding
   - Whisper transcription
   - WebRTC support (configured)

### Partial/Incomplete Features

1. **Frontend Coverage**
   - ✅ Authentication pages
   - ✅ Dashboard
   - ✅ Internship browsing
   - ⚠️ Assessment UI (incomplete)
   - ⚠️ Video recording (incomplete)
   - ❌ Employer dashboard (missing)

2. **Event Bus**
   - RabbitMQ configured but not actively used
   - Services use direct database calls

3. **Observability**
   - Basic health checks implemented
   - ❌ No Prometheus/Grafana
   - ❌ No distributed tracing
   - ❌ No centralized logging

---

## Project Maturity Assessment

| Dimension | Score | Status |
|-----------|-------|--------|
| Backend Services | 90/100 | Production Ready |
| Frontend | 70/100 | MVP Ready |
| Infrastructure | 85/100 | Docker Ready |
| Testing | 30/100 | Critical Gap |
| Security | 45/100 | Needs Hardening |
| DevOps/CI-CD | 25/100 | Missing |
| Documentation | 85/100 | Comprehensive |

**Overall Maturity:** 61/100 - **MVP Stage**

---

## Key Documents

| Document | Purpose | Status |
|----------|---------|--------|
| README.DOCKER.md | Docker deployment guide | ✅ Complete |
| PROJECT_STATUS.md | Current development status | ✅ Complete |
| SETUP_GUIDE.md | Setup instructions | ✅ Complete |
| IMPLEMENTATION_SUMMARY.md | Implementation notes | ✅ Complete |
| AUDIT_REPORT.md | Previous audit findings | ✅ Present |

---

## Contact & Ownership

| Role | Status |
|------|--------|
| **Project Owner** | GlohibAI Team |
| **Primary Development** | AI-Assisted (Kimi, Qwen) |
| **Current Phase** | MVP Development |
| **Next Milestone** | Integration Testing |

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
