# Phase 2 Build Master Plan - GlohibAI

**Phase:** Phase 2 – System Stabilization and Real Backend Build  
**Start Date:** March 10, 2026  
**Target Completion:** March 31, 2026  
**Project Path:** `C:\Users\UCHE\my-qwen-project\projects\glohibai`

---

## Executive Summary

Phase 2 focuses on converting the current architecture-heavy repository into a **fully operational backend-driven platform** with real data flows, APIs, services, and AI logic. 

**Critical Rule:** No frontend feature development allowed until corresponding backend API exists and is verified.

---

## Current State Assessment (As of March 10, 2026)

### ✅ Existing Infrastructure

| Component | Status | Notes |
|-----------|--------|-------|
| Docker Compose | ✅ Complete | 8 services configured |
| PostgreSQL + pgvector | ✅ Complete | Schema with 7 migrations |
| Redis | ✅ Complete | Caching layer ready |
| MinIO | ✅ Complete | Object storage |
| Identity Service (Go) | ✅ Complete | JWT auth, OAuth |
| Student Service (Go) | ✅ Complete | Full CRUD |
| Internship Service (Go) | ✅ Complete | CRUD, search, applications |
| Assessment Service (Go) | ✅ Complete | 7-stage workflow |
| Recommendation Service (Python) | ✅ Complete | Vector matching |
| Scoring Service (Python) | ✅ Complete | XGBoost + SHAP |
| Video Service (Node.js) | ✅ Complete | TUS, transcoding |
| Frontend (Next.js) | ⚠️ MVP | Authentication, dashboard |

### ⚠️ Gaps Identified for Phase 2

| Gap | Priority | Impact |
|-----|----------|--------|
| No Application Service | 🔴 Critical | Cannot track applications separately |
| No Employer Service | 🔴 Critical | Employer profiles missing |
| No Messaging Service | 🟡 High | No communication channel |
| No Notification Service | 🟡 High | No event notifications |
| No API Gateway | 🟡 Medium | Services exposed directly |
| Missing Alembic migrations | 🟡 Medium | No schema versioning |
| No OpenAPI documentation | 🟡 Medium | APIs undocumented |
| No integration tests | 🔴 Critical | No verification |
| Mock data in frontend | 🟡 High | Must be removed |
| No structured logging | 🟡 Medium | Debugging difficult |

---

## Enforcement Rules (Phase 2)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  PHASE 2 ENFORCEMENT RULES - NON-NEGOTIABLE                │
├─────────────────────────────────────────────────────────────────┤
│  1. NO frontend feature development unless backend API exists   │
│  2. Every feature MUST have:                                    │
│     - Database schema                                           │
│     - Service logic                                             │
│     - API endpoint                                              │
│     - Integration test                                          │
│  3. Mock data is FORBIDDEN after Phase 2 begins                │
│  4. Every service MUST run via Docker                          │
│  5. All APIs MUST be documented via OpenAPI                    │
│  6. All services MUST log structured events                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Target System Architecture

### Microservices Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                              │
│                    (Kong / Traefik)                             │
│                    Port: 8000                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼───────┐ ┌─────▼──────────┐
│   Identity     │ │  Student   │ │   Employer     │
│   Service      │ │  Service   │ │   Service      │
│   :8080        │ │  :8082     │ │   :8085        │
└────────────────┘ └────────────┘ └────────────────┘

┌────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Internship    │ │ Application  │ │   Assessment     │
│  Service       │ │  Service     │ │   Service        │
│  :8083         │ │  :8086       │ │   :8084          │
└────────────────┘ └──────────────┘ └──────────────────┘

┌────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   Scoring      │ │Recommendation│ │   Messaging      │
│   Service      │ │  Service     │ │   Service        │
│   :8008        │ │  :8007       │ │   :8090          │
└────────────────┘ └──────────────┘ └──────────────────┘

┌────────────────┐ ┌──────────────┐
│ Notification   │ │    Video     │
│ Service        │ │    Service   │
│ :8091          │ │    :4000     │
└────────────────┘ └──────────────┘

         │
         ▼
┌─────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE LAYER                        │
│  ┌──────────┐  ┌───────┐  ┌────────┐  ┌──────────────┐ │
│  │PostgreSQL│  │ Redis │  │RabbitMQ│  │    Qdrant    │ │
│  │  :5432   │  │ :6379 │  │ :5672  │  │    :6333     │ │
│  └──────────┘  └───────┘  └────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Build Sequence (15 Steps)

### Step 1: Repository Cleanup
**Objective:** Remove prototype artifacts and enforce deterministic structure  
**Duration:** 1 day  
**Priority:** 🔴 Critical

#### Tasks:
- [ ] Scan for mock data in frontend
- [ ] Delete UI mock responses
- [ ] Remove unused architecture docs
- [ ] Enforce directory structure

#### Target Directory Structure:
```
backend/
  api_gateway/
  services/
    identity_service/
    student_service/
    employer_service/          # NEW
    internship_service/
    application_service/       # NEW
    assessment_service/
    scoring_service/
    recommendation_service/
    messaging_service/         # NEW
    notification_service/      # NEW
  shared/
    database/
    models/
    schemas/
    utils/
infrastructure/
  docker/
  compose/
database/
  migrations/
  seeds/
tests/
  integration/
  services/
docs/
  api/
  architecture/
```

#### Success Criteria:
- ✅ Repository passes structure validation
- ✅ No frontend code references mock data
- ✅ All obsolete files removed

---

### Step 2: Database Foundation
**Objective:** Build canonical database schema with Alembic migrations  
**Duration:** 2 days  
**Priority:** 🔴 Critical

#### Required Tables:

**users**
```sql
id              uuid PRIMARY KEY
email           citext UNIQUE NOT NULL
password_hash   text NOT NULL
role            enum('student', 'employer', 'admin')
created_at      timestamptz DEFAULT now()
```

**student_profiles**
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES users(id)
first_name      text
last_name       text
university      text
degree          text
skills          jsonb
created_at      timestamptz
```

**employer_profiles**
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES users(id)
organization_name text
industry        text
website         text
created_at      timestamptz
```

**internships**
```sql
id              uuid PRIMARY KEY
employer_id     uuid REFERENCES employer_profiles(id)
title           text
description     text
location        text
remote          boolean
skills_required jsonb
created_at      timestamptz
```

**applications**
```sql
id              uuid PRIMARY KEY
student_id      uuid REFERENCES student_profiles(id)
internship_id   uuid REFERENCES internships(id)
status          enum('submitted', 'reviewed', 'shortlisted', 'rejected', 'accepted')
created_at      timestamptz
```

**assessments**
```sql
id              uuid PRIMARY KEY
student_id      uuid REFERENCES student_profiles(id)
score           integer
results         jsonb
created_at      timestamptz
```

**scores**
```sql
id              uuid PRIMARY KEY
student_id      uuid REFERENCES student_profiles(id)
internship_id   uuid REFERENCES internships(id)
match_score     float
```

#### Implementation:
- [ ] Create Alembic configuration
- [ ] Write migration 001: users table
- [ ] Write migration 002: student_profiles table
- [ ] Write migration 003: employer_profiles table
- [ ] Write migration 004: internships table
- [ ] Write migration 005: applications table
- [ ] Write migration 006: assessments table
- [ ] Write migration 007: scores table
- [ ] Write migration 008: indexes and constraints
- [ ] Create seed data script

#### Success Criteria:
- ✅ Alembic migrations run successfully
- ✅ Schema deployed via Docker
- ✅ All foreign keys and indexes created
- ✅ Seed data loads without errors

---

### Step 3: Identity Service
**Objective:** Implement authentication and user management  
**Duration:** 2 days  
**Priority:** 🔴 Critical

#### Endpoints:
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
```

#### Features:
- [ ] Password hashing (bcrypt)
- [ ] JWT issuance (HS256)
- [ ] JWT refresh tokens
- [ ] Role validation middleware
- [ ] Rate limiting on login

#### Implementation:
- [ ] Update existing identity-service with new schema
- [ ] Add role-based access control
- [ ] Implement password reset flow
- [ ] Add structured logging

#### Success Criteria:
- ✅ User registration works
- ✅ Login returns valid JWT
- ✅ Protected endpoints require token
- ✅ Token refresh works
- ✅ All events logged

---

### Step 4: Student Service
**Objective:** Manage student profiles  
**Duration:** 2 days  
**Priority:** 🔴 Critical

#### Endpoints:
```
POST   /api/v1/students/profile
GET    /api/v1/students/profile
PUT    /api/v1/students/profile
POST   /api/v1/students/skills
DELETE /api/v1/students/skills/:skill_id
POST   /api/v1/students/education
POST   /api/v1/students/experience
```

#### Features:
- [ ] Profile completeness scoring
- [ ] Skill normalization
- [ ] University validation

#### Implementation:
- [ ] Migrate existing student-service to new schema
- [ ] Add profile completeness algorithm
- [ ] Integrate with recommendation service

#### Success Criteria:
- ✅ Profile creation stored in database
- ✅ Profile retrieval verified
- ✅ Profile updates work
- ✅ Skills/education/experience CRUD works

---

### Step 5: Employer Service
**Objective:** Manage employer accounts  
**Duration:** 2 days  
**Priority:** 🔴 Critical

#### Endpoints:
```
POST   /api/v1/employers/profile
GET    /api/v1/employers/profile
PUT    /api/v1/employers/profile
GET    /api/v1/employers/verified
```

#### Features:
- [ ] Organization validation
- [ ] Domain verification
- [ ] API key generation

#### Implementation:
- [ ] Create employer-service from scratch
- [ ] Implement domain verification
- [ ] Add API key management

#### Success Criteria:
- ✅ Employer profile creation works
- ✅ Domain verification works
- ✅ API keys generated and validated

---

### Step 6: Internship Service
**Objective:** Create and retrieve internship opportunities  
**Duration:** 2 days  
**Priority:** 🔴 Critical

#### Endpoints:
```
POST   /api/v1/internships
GET    /api/v1/internships
GET    /api/v1/internships/:id
PUT    /api/v1/internships/:id
DELETE /api/v1/internships/:id
POST   /api/v1/internships/search
POST   /api/v1/internships/vector-search
```

#### Requirements:
- [ ] Employer authentication required
- [ ] Skill-based filtering
- [ ] Vector similarity search

#### Implementation:
- [ ] Update existing internship-service
- [ ] Add employer validation
- [ ] Integrate pgvector

#### Success Criteria:
- ✅ Internship CRUD works
- ✅ Search with filters works
- ✅ Vector search returns relevant results
- ✅ Employer authentication enforced

---

### Step 7: Application Service
**Objective:** Enable students to apply to internships  
**Duration:** 2 days  
**Priority:** 🔴 Critical

#### Endpoints:
```
POST   /api/v1/applications
GET    /api/v1/applications/student
GET    /api/v1/applications/employer
GET    /api/v1/applications/:id
PATCH  /api/v1/applications/:id/status
DELETE /api/v1/applications/:id
```

#### Features:
- [ ] Application status workflow
- [ ] Duplicate prevention
- [ ] Employer notifications

#### Implementation:
- [ ] Create application-service from scratch
- [ ] Implement state machine
- [ ] Add notification triggers

#### Success Criteria:
- ✅ Application submission works
- ✅ Status updates work
- ✅ Duplicate applications prevented
- ✅ Employer can view applications

---

### Step 8: Assessment Service
**Objective:** Record student assessments  
**Duration:** 2 days  
**Priority:** 🟡 High

#### Endpoints:
```
POST   /api/v1/assessments/start
POST   /api/v1/assessments/:id/submit
GET    /api/v1/assessments/:id/results
GET    /api/v1/assessments/history
```

#### Features:
- [ ] Timer management
- [ ] Auto-grading
- [ ] Results storage

#### Implementation:
- [ ] Update existing assessment-service
- [ ] Add result persistence
- [ ] Integrate with scoring service

#### Success Criteria:
- ✅ Assessment start works
- ✅ Submission processed
- ✅ Results stored and retrievable

---

### Step 9: Scoring Service
**Objective:** Compute candidate skill scores  
**Duration:** 2 days  
**Priority:** 🟡 High

#### Logic:
**Inputs:**
- Student skills
- Assessment results
- Education background
- Experience level

**Output:**
- Numeric competency score (0-100)
- Skill breakdown
- Confidence interval

#### Endpoints:
```
POST   /api/v1/scores/calculate
GET    /api/v1/scores/:student_id
POST   /api/v1/scores/batch
GET    /api/v1/scores/:id/explain
```

#### Implementation:
- [ ] Update existing scoring-service
- [ ] Add feature extraction
- [ ] Implement scoring algorithm
- [ ] Add SHAP explanations

#### Success Criteria:
- ✅ Scores calculated correctly
- ✅ Scores stored in database
- ✅ Explanations generated

---

### Step 10: Recommendation Service
**Objective:** Match students to internships  
**Duration:** 2 days  
**Priority:** 🟡 High

#### Algorithm:
**Factors:**
- Skills overlap (40%)
- Assessment score (25%)
- Internship requirements (20%)
- Student preferences (15%)

#### Endpoints:
```
GET    /api/v1/recommendations/student/:id
POST   /api/v1/recommendations/refresh
GET    /api/v1/recommendations/explain/:id
```

#### Implementation:
- [ ] Update existing recommendation-service
- [ ] Implement multi-factor ranking
- [ ] Add behavioral tracking
- [ ] Cache recommendations in Redis

#### Success Criteria:
- ✅ Recommendations generated
- ✅ Ranking is relevant
- ✅ Click tracking works
- ✅ Recommendations improve over time

---

### Step 11: Messaging Service
**Objective:** Enable communication  
**Duration:** 2 days  
**Priority:** 🟡 Medium

#### Endpoints:
```
POST   /api/v1/messages
GET    /api/v1/messages/thread/:conversation_id
GET    /api/v1/messages/inbox
DELETE /api/v1/messages/:id
```

#### Features:
- [ ] Thread management
- [ ] Read receipts
- [ ] File attachments

#### Implementation:
- [ ] Create messaging-service from scratch
- [ ] Use PostgreSQL for persistence
- [ ] Add WebSocket support for real-time

#### Success Criteria:
- ✅ Messages sent and stored
- ✅ Thread retrieval works
- ✅ Read receipts tracked

---

### Step 12: Notification Service
**Objective:** Send system notifications  
**Duration:** 2 days  
**Priority:** 🟡 Medium

#### Events:
- application_submitted
- application_reviewed
- shortlist_updated
- interview_requested
- message_received
- assessment_due

#### Channels:
- Email (SMTP)
- In-app (WebSocket)
- Push (FCM - future)

#### Endpoints:
```
POST   /api/v1/notifications/send
GET    /api/v1/notifications/inbox
PATCH  /api/v1/notifications/:id/read
POST   /api/v1/notifications/preferences
```

#### Implementation:
- [ ] Create notification-service from scratch
- [ ] Use RabbitMQ for event consumption
- [ ] Implement email templates
- [ ] Add notification preferences

#### Success Criteria:
- ✅ Notifications sent on events
- ✅ Email delivery works
- ✅ In-app notifications appear
- ✅ Preferences respected

---

### Step 13: API Gateway
**Objective:** Centralize API routing  
**Duration:** 2 days  
**Priority:** 🟡 Medium

#### Responsibilities:
- Route requests to services
- Enforce authentication
- Rate limiting
- Request/response logging
- CORS handling

#### Implementation Options:
- **Option A:** Kong (recommended)
- **Option B:** Traefik
- **Option C:** Custom Express gateway

#### Configuration:
```yaml
routes:
  - path: /api/v1/auth/*
    service: identity-service
    auth: false
  - path: /api/v1/students/*
    service: student-service
    auth: true
  - path: /api/v1/employers/*
    service: employer-service
    auth: true
```

#### Success Criteria:
- ✅ All services accessible via gateway
- ✅ Authentication enforced
- ✅ Rate limiting active
- ✅ Centralized logging

---

### Step 14: Frontend Integration
**Rule:** Frontend development resumes only after services are verified  
**Duration:** 3 days  
**Priority:** 🔴 Critical

#### Requirements:
- [ ] Connect login page to `/api/v1/auth/login`
- [ ] Connect register page to `/api/v1/auth/register`
- [ ] Connect internships page to `/api/v1/internships`
- [ ] Connect application flow to `/api/v1/applications`
- [ ] Connect profile to `/api/v1/students/profile`
- [ ] Remove ALL mock data

#### Implementation:
- [ ] Update API client with real endpoints
- [ ] Remove mock data files
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test full user journey

#### Success Criteria:
- ✅ Login works with real backend
- ✅ Internships load from database
- ✅ Applications submit successfully
- ✅ Profile updates persist
- ✅ Zero mock data references

---

### Step 15: Integration Tests
**Framework:** Pytest  
**Duration:** 3 days  
**Priority:** 🔴 Critical

#### Required Tests:
```python
# test_user_journey.py
def test_user_signup_login():
    """Complete registration and login flow"""
    
def test_profile_creation():
    """Create and update student profile"""
    
def test_internship_posting():
    """Employer posts internship"""
    
def test_internship_application():
    """Student applies to internship"""
    
def test_recommendation_generation():
    """Generate and verify recommendations"""
    
def test_application_workflow():
    """Full application: submit -> review -> shortlist"""
```

#### Test Coverage Requirements:
- [ ] All critical paths covered
- [ ] Error cases tested
- [ ] Integration points verified
- [ ] Performance baselines established

#### Success Criteria:
- ✅ All tests pass in CI
- ✅ Coverage > 80%
- ✅ Tests run in < 10 minutes

---

## Docker Configuration

### Required Containers

```yaml
version: "3.9"

services:
  # Infrastructure
  postgres:    # PostgreSQL 16 + pgvector
  redis:       # Redis 7
  rabbitmq:    # RabbitMQ 3.11
  qdrant:      # Qdrant vector DB
  
  # Services
  api-gateway:
  identity-service:
  student-service:
  employer-service:
  internship-service:
  application-service:
  assessment-service:
  scoring-service:
  recommendation-service:
  messaging-service:
  notification-service:
```

### Health Checks

All services must implement:
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "identity-service",
  "version": "2.0.0",
  "timestamp": "2026-03-10T12:00:00Z",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "queue": "ok"
  }
}
```

---

## OpenAPI Documentation

### Required for All Services

Each service must expose:
```
GET /openapi.json
GET /docs          # Swagger UI
```

### Documentation Standards:
- All endpoints documented
- Request/response schemas
- Error codes
- Authentication requirements
- Rate limits

---

## Logging Standards

### Structured Logging Format

```json
{
  "timestamp": "2026-03-10T12:00:00Z",
  "level": "INFO",
  "service": "identity-service",
  "trace_id": "abc123",
  "span_id": "def456",
  "event": "user.login",
  "user_id": "uuid-here",
  "success": true,
  "duration_ms": 45,
  "metadata": {
    "ip": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
  }
}
```

### Log Levels:
- ERROR: System errors, failures
- WARN: Recoverable issues
- INFO: Business events (login, registration)
- DEBUG: Detailed debugging

---

## Completion Definition

### Phase 2 Complete When:

- [ ] All 10 services operational
- [ ] docker-compose launches entire system
- [ ] Real database used (no mock data)
- [ ] Recommendation engine functional
- [ ] Internship application flow operational
- [ ] Integration tests passing (>80% coverage)
- [ ] OpenAPI docs available for all services
- [ ] Structured logging implemented
- [ ] All enforcement rules satisfied

---

## Risk Management

### Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep | Medium | High | Strict enforcement rules |
| Integration issues | High | Medium | Daily integration tests |
| Performance problems | Medium | Medium | Load testing early |
| Team availability | Low | High | Document everything |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Services operational | 10/10 | Health checks |
| API endpoints | 50+ | OpenAPI spec |
| Test coverage | >80% | pytest-cov |
| Response time (p95) | <200ms | Load tests |
| Zero mock data | 100% | Code scan |
| Documentation | Complete | OpenAPI + README |

---

## Daily Checkpoints

### Standup Questions:
1. What did you complete yesterday?
2. What will you work on today?
3. Any blockers?

### End-of-Day Validation:
```bash
# Run all health checks
make test-all-health

# Run integration tests
make test-integration

# Check for mock data
grep -r "mock" frontend/ --exclude-dir=node_modules
```

---

## Appendix A: Service Dependencies

```
identity-service: postgres, redis
student-service: postgres, redis, identity-service
employer-service: postgres, redis, identity-service
internship-service: postgres, redis, employer-service
application-service: postgres, redis, student-service, internship-service
assessment-service: postgres, redis, student-service
scoring-service: postgres, redis, assessment-service
recommendation-service: postgres, redis, qdrant, student-service, internship-service
messaging-service: postgres, redis, student-service, employer-service
notification-service: postgres, rabbitmq, redis
api-gateway: identity-service (for auth)
```

---

## Appendix B: Environment Variables

### Required Variables

```bash
# Database
POSTGRES_USER=glohib
POSTGRES_PASSWORD=<CHANGE_ME>
POSTGRES_DB=glohib_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_URL=redis://redis:6379

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# Qdrant
QDRANT_URL=http://qdrant:6333

# JWT
JWT_SECRET=<GENERATE_32_CHARS>
JWT_EXPIRY=3600

# Services
IDENTITY_URL=http://identity-service:8080
STUDENT_URL=http://student-service:8082
EMPLOYER_URL=http://employer-service:8085
INTERNSHIP_URL=http://internship-service:8083
APPLICATION_URL=http://application-service:8086
ASSESSMENT_URL=http://assessment-service:8084
SCORING_URL=http://scoring-service:8008
RECOMMENDATION_URL=http://recommendation-service:8007
MESSAGING_URL=http://messaging-service:8090
NOTIFICATION_URL=http://notification-service:8091

# API Gateway
GATEWAY_URL=http://api-gateway:8000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<CHANGE_ME>
SMTP_PASSWORD=<CHANGE_ME>
```

---

## Appendix C: Migration Checklist

### Pre-Migration
- [ ] Backup existing data
- [ ] Test migrations locally
- [ ] Document rollback procedure

### Migration Execution
- [ ] Stop all services
- [ ] Run Alembic migrations
- [ ] Verify schema
- [ ] Load seed data
- [ ] Start services

### Post-Migration
- [ ] Run health checks
- [ ] Run integration tests
- [ ] Verify data integrity
- [ ] Monitor logs

---

**Document Version:** 1.0  
**Last Updated:** March 10, 2026  
**Approved By:** Project Lead
