# 01 - Repository Structure

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Root Directory Structure

```
GlohibAI/
├── backend/                    # Go backend services (alternative location)
├── database/                   # Database migrations and schemas
├── docker/                     # Docker configurations
├── docs/                       # Documentation
├── extracted_intelligence/     # Extracted data from documents
├── forensics/                  # Forensic audit reports
├── frontend/                   # Next.js frontend application
│   └── web/
├── infrastructure/             # Infrastructure as Code (empty)
├── kimi_bridge/                # Kimi AI integration files
├── logs/                       # Application logs
├── planning_output/            # Planning documents
├── scripts/                    # Utility scripts
├── services/                   # Primary service implementations
├── source_docs/                # Source documentation
├── system_context/             # System context files
├── tests/                      # Test files
├── .env                        # Environment variables
├── .env.docker                 # Docker environment template
├── .env.example                # Environment example
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Main Docker Compose configuration
├── docker-compose.fastapi.yml  # FastAPI services Compose
├── Makefile                    # Make commands
├── package.json                # Root package.json
├── requirements.txt            # Python dependencies
├── tsconfig.json               # TypeScript configuration
└── README.DOCKER.md            # Docker README
```

---

## Service Directories Analysis

### Primary Services Location: `/services/`

| Directory | Language | Status | Notes |
|-----------|----------|--------|-------|
| identity-service | Go | ✅ Complete | JWT auth, OAuth |
| identity-svc | Go | ⚠️ Duplicate | Alternative naming |
| student-service | Go | ✅ Complete | Profile management |
| student-svc | Go | ⚠️ Duplicate | Alternative naming |
| internship-service | Go | ✅ Complete | Internship CRUD |
| internship-svc | Go | ⚠️ Duplicate | Alternative naming |
| assessment-service | Go | ✅ Complete | 7-stage workflow |
| assessment-svc | Go | ⚠️ Duplicate | Alternative naming |
| recommendation-service | Python | ✅ Complete | ML recommendations |
| recommendation-svc | Python | ⚠️ Duplicate | Alternative naming |
| scoring-service | Python | ✅ Complete | XGBoost scoring |
| scoring-svc | Python | ⚠️ Duplicate | Alternative naming |
| video-service | Node.js | ✅ Complete | Video processing |
| video-svc | Node.js | ⚠️ Duplicate | Alternative naming |
| mentor-svc | Unknown | ❌ Empty | Future feature |
| analytics-svc | Unknown | ❌ Empty | Future feature |

### Backend Services Location: `/backend/services/`

| Directory | Language | Status | Notes |
|-----------|----------|--------|-------|
| identity_service | Go | ✅ Complete | Underscore naming |
| student_service | Go | ✅ Complete | Underscore naming |
| internship_service | Go | ✅ Complete | Underscore naming |
| assessment_service | Go | ✅ Complete | Underscore naming |
| recommendation_service | Python | ✅ Complete | Underscore naming |
| scoring_service | Python | ✅ Complete | Underscore naming |
| application_service | Python | ⚠️ Partial | Application handling |
| employer_service | Python | ⚠️ Partial | Employer features |
| messaging_service | Python | ❌ Empty | Not implemented |
| notification_service | Python | ❌ Empty | Not implemented |

---

## Critical Finding: Duplicate Service Directories

**Issue:** The repository contains TWO parallel service directory structures:

1. `/services/` - Hyphen-named directories (primary)
2. `/backend/services/` - Underscore-named directories (alternative)

**Risk:** This creates confusion about the source of truth and may lead to:
- Inconsistent deployments
- Code duplication
- Maintenance overhead

**Recommendation:** Consolidate to a single service directory structure.

---

## Database Structure

```
database/
├── migrations/
│   ├── versions/           # Alembic migration files
│   │   ├── 001_initial_schema.py
│   │   ├── 002_add_vector_extensions.py
│   │   └── ... (8 migration files)
│   ├── env.py              # Alembic environment config
│   └── script.py.mako      # Migration template
├── schemas/                 # Database schema definitions
└── seeds/                   # Seed data scripts
```

---

## Frontend Structure

```
frontend/web/
├── src/
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   ├── lib/                # Utility libraries
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   └── styles/             # CSS/Tailwind styles
├── public/                 # Static assets
├── tests/                  # Test files
│   ├── e2e/                # E2E tests
│   └── unit/               # Unit tests
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

---

## Docker Configuration

```
docker/
├── Dockerfile.identity      # Identity service build
├── Dockerfile.student       # Student service build
├── Dockerfile.internship    # Internship service build
├── Dockerfile.assessment    # Assessment service build
├── Dockerfile.recommendation # Recommendation service build
├── Dockerfile.scoring       # Scoring service build
├── Dockerfile.video         # Video service build
├── Dockerfile.application   # Application service build
├── Dockerfile.employer      # Employer service build
└── init_postgres.sql        # Database initialization
```

---

## Infrastructure as Code

```
infrastructure/
├── terraform/              # EMPTY (.gitkeep only)
└── k8s/                    # EMPTY (.gitkeep only)
```

**Status:** Infrastructure directories exist but contain no actual IaC definitions.

---

## Git Repository Status

| Property | Value |
|----------|-------|
| **Current Branch** | master |
| **Total Commits** | 1 (Initial commit) |
| **Remote Configured** | No |
| **Tags** | None |
| **Branches** | 1 (master only) |

**Assessment:** Minimal git history. Repository appears to be a backup/restore point rather than active development history.

---

## File Statistics

| Category | Count | Notes |
|----------|-------|-------|
| Python (.py) | ~80 | Backend services, scripts |
| TypeScript (.ts/.tsx) | ~3,800+ | Frontend (includes node_modules) |
| Go (.go) | ~50 | Backend microservices |
| Dockerfiles | 16+ | Service containerization |
| YAML configs | 15+ | Docker Compose, configs |
| Markdown docs | 20+ | Documentation |
| JSON configs | 10+ | Package, tsconfig |

---

## Repository Health Indicators

### Positive Indicators

✅ Comprehensive Docker configuration
✅ Health checks on all services
✅ Multi-stage Docker builds (some)
✅ Environment variable separation
✅ Service isolation (microservices)
✅ Database migrations versioned
✅ TypeScript strict mode enabled
✅ Comprehensive documentation

### Areas for Improvement

❌ Duplicate service directories
❌ No Git history (1 commit only)
❌ No remote repository configured
❌ No CI/CD pipeline configuration
❌ Empty IaC directories
❌ Large node_modules in repository
❌ No version tags

---

## Repository Structure Score: 65/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Organization | 70/100 | Clear separation but duplicates |
| Documentation | 85/100 | Comprehensive README files |
| Git Practices | 25/100 | Minimal history, no remote |
| Code Organization | 60/100 | Duplicate directories |
| Configuration | 75/100 | Good Docker setup |

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
