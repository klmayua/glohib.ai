# 04 - Service Architecture

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Architecture Overview

**Style:** Microservices
**Communication:** Synchronous REST/HTTP (primary), gRPC (secondary)
**Data Storage:** Shared PostgreSQL instance

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Web (Next.js) │  │   Mobile (TBD)  │  │   External APIs │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   API Gateway (Missing) │
                    └────────────┬────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────┐
│                    SERVICE LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Identity    │  │   Student    │  │ Internship   │          │
│  │  (Go/Gin)    │  │   (Go/Gin)   │  │  (Go/Gin)    │          │
│  │  :8080       │  │   :8082      │  │   :8083      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│  ┌──────┴─────────────────┴─────────────────┴───────┐          │
│  │              Assessment Service                  │          │
│  │              (Go/Gin + gRPC)                     │          │
│  │              :8084, :50054                       │          │
│  └──────────────────────────────────────────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Video       │  │Recommendation│  │   Scoring    │          │
│  │ (Node/Exp)   │  │ (Py/FastAPI) │  │ (Py/FastAPI) │          │
│  │   :4000      │  │   :8007      │  │   :8008      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────────┼────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────┐
│                    DATA LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Redis     │  │    MinIO     │          │
│  │  + pgvector  │  │   (Cache)    │  │  (Storage)   │          │
│  │   :5432      │  │   :6379      │  │  :9000/9001  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Service Inventory

### Core Services

| Service | Language | Framework | Ports | Status |
|---------|----------|-----------|-------|--------|
| Identity | Go 1.22 | Gin + gRPC | 8080, 50051 | ✅ Complete |
| Student | Go 1.22 | Gin | 8082 | ✅ Complete |
| Internship | Go 1.22 | Gin | 8083 | ✅ Complete |
| Assessment | Go 1.22 | Gin + gRPC | 8084, 50054 | ✅ Complete |
| Recommendation | Python 3.11 | FastAPI | 8007 | ✅ Complete |
| Scoring | Python 3.11 | FastAPI | 8008 | ✅ Complete |
| Video | Node.js 20 | Express | 4000 | ✅ Complete |

### Infrastructure Services

| Service | Technology | Purpose | Status |
|---------|------------|---------|--------|
| PostgreSQL + pgvector | Database | Primary data store | ✅ Ready |
| Redis | Cache | Sessions, caching | ✅ Ready |
| MinIO | Object Storage | Video/assets | ✅ Ready |
| RabbitMQ | Message Queue | Async messaging | ⚠️ Configured, unused |
| Qdrant | Vector DB | Embeddings | ⚠️ Configured, unused |

---

## Service Dependencies

### Identity Service Dependencies

```
Identity Service
├── PostgreSQL (users, sessions, API keys)
├── Redis (token blacklist, rate limiting)
├── Google OAuth (external)
└── Student Service (user profile creation)
```

### Student Service Dependencies

```
Student Service
├── PostgreSQL (student profiles, skills, education)
├── Redis (caching)
└── Identity Service (user validation)
```

### Internship Service Dependencies

```
Internship Service
├── PostgreSQL (internships, applications)
├── Redis (caching, behavioral tracking)
├── pgvector (vector search)
├── Identity Service (user validation)
└── Recommendation Service (similarity matching)
```

### Assessment Service Dependencies

```
Assessment Service
├── PostgreSQL (assessments, results)
├── Redis (timer state)
├── gRPC (Identity validation)
└── Scoring Service (auto-grading)
```

### Recommendation Service Dependencies

```
Recommendation Service
├── PostgreSQL (embeddings, tracking)
├── pgvector (similarity search)
├── Redis (behavioral cache)
├── Sentence Transformers (ML)
└── Internship Service (data source)
```

### Scoring Service Dependencies

```
Scoring Service
├── PostgreSQL (score history)
├── Redis (score cache)
├── XGBoost (ML models)
├── SHAP (explainability)
└── Assessment Service (input data)
```

### Video Service Dependencies

```
Video Service
├── PostgreSQL (video metadata)
├── MinIO (video storage)
├── Redis (upload state)
├── FFmpeg (transcoding)
├── Whisper (transcription)
└── OpenAI API (external)
```

---

## Communication Patterns

### Synchronous REST (Primary)

```
Client → Service (HTTP/REST) → Database
         ↓
         → Another Service (HTTP/REST)
```

**Issues:**
- Tight coupling between services
- Cascading failure risk
- No circuit breaker pattern

### gRPC (Limited)

```
Assessment Service ↔ Identity Service (gRPC)
```

**Usage:** Identity validation during assessments

### Event-Driven (Not Implemented)

```
Service → RabbitMQ → Interested Services
```

**Status:** RabbitMQ configured but not actively used

---

## Architecture Patterns

### Implemented Patterns

| Pattern | Status | Services |
|---------|--------|----------|
| Database per Service | ❌ Not implemented | Shared PostgreSQL |
| API Gateway | ❌ Missing | Direct exposure |
| Service Discovery | ❌ Missing | Docker networking |
| Circuit Breaker | ❌ Missing | None |
| CQRS | ❌ Missing | Standard CRUD |
| Event Sourcing | ❌ Missing | None |
| Saga | ❌ Missing | None |

### Partially Implemented

| Pattern | Status | Notes |
|---------|--------|-------|
| Caching | ⚠️ Partial | Redis caching present |
| Rate Limiting | ⚠️ Partial | Scoring service only |
| Health Checks | ✅ Complete | All services |
| Graceful Shutdown | ⚠️ Partial | Some services |

---

## Architecture Anti-Patterns

### Critical Issues

1. **Shared Database**
   - All services share single PostgreSQL instance
   - No database-per-service isolation
   - Coupled scaling and failure domains

2. **No API Gateway**
   - Frontend directly calls backend services
   - No centralized authentication
   - CORS complexity
   - No rate limiting at edge

3. **Tight Coupling**
   - Services call each other synchronously
   - No circuit breakers
   - Cascading failure risk

4. **No Event Bus**
   - RabbitMQ configured but unused
   - No async communication
   - No eventual consistency patterns

### Moderate Issues

1. **Duplicate Service Directories**
   - `/services/` and `/backend/services/`
   - Confusion on source of truth

2. **Inconsistent Patterns**
   - Mix of REST and gRPC
   - Inconsistent error handling
   - Varying logging approaches

---

## Service Coupling Matrix

| From/To | Identity | Student | Internship | Assessment | Recommendation | Scoring | Video |
|---------|----------|---------|------------|------------|----------------|---------|-------|
| Identity | - | Low | Low | Medium | Low | Low | Low |
| Student | Medium | - | Low | Low | Low | Low | Low |
| Internship | Medium | Low | - | Low | Medium | Low | Low |
| Assessment | Medium | Low | Low | - | Low | Medium | Low |
| Recommendation | Low | Medium | High | Low | - | Low | Low |
| Scoring | Low | Low | Low | Medium | Low | - | Low |
| Video | Low | Low | Low | Low | Low | Low | - |

**Legend:** Low = Occasional calls, Medium = Regular calls, High = Heavy coupling

---

## Architecture Score: 65/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Service Boundaries | 80/100 | Clear domain separation |
| Communication | 50/100 | Synchronous only |
| Data Management | 45/100 | Shared database |
| Resilience | 40/100 | No circuit breakers |
| Scalability | 60/100 | Horizontal scaling ready |
| Maintainability | 70/100 | Good documentation |

---

## Recommendations

### Immediate (Week 1)

1. **Add API Gateway**
   - Deploy Kong or Traefik
   - Centralize authentication
   - Add rate limiting

2. **Implement Circuit Breakers**
   - gobreaker for Go services
   - pybreaker for Python services

### Short Term (Month 1)

1. **Activate Event Bus**
   - Use RabbitMQ for async operations
   - Convert video processing to events
   - Add event sourcing for audit trail

2. **Database Separation Plan**
   - Plan migration to DB-per-service
   - Add read replicas
   - Implement CQRS for queries

### Long Term (Quarter 1)

1. **Service Mesh**
   - Istio or Linkerd
   - mTLS between services
   - Advanced traffic management

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
