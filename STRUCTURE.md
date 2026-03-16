# GlohibAI Repository Structure

**Standard Layout** - Production Ready Configuration

---

## Directory Structure

```
GlohibAI/
├── services/                   # Canonical service implementations
│   ├── identity-service/       # Go - Authentication & Authorization
│   ├── student-service/        # Go - Student profiles
│   ├── internship-service/     # Go - Internship management
│   ├── assessment-service/     # Go - Assessment engine
│   ├── recommendation-service/ # Python - ML recommendations
│   ├── scoring-service/        # Python - ML scoring
│   └── video-service/          # Node.js - Video processing
│
├── frontend/                   # Frontend applications
│   └── web/                    # Next.js web application
│
├── infra/                      # Infrastructure as Code
│   ├── k8s/                    # Kubernetes manifests
│   └── terraform/              # Terraform configurations
│
├── docker/                     # Docker configurations
│   ├── Dockerfile.*            # Service Dockerfiles
│   └── init_postgres.sql       # Database initialization
│
├── scripts/                    # Utility scripts
│   ├── backup.sh               # Database backup
│   ├── deploy.sh               # Deployment scripts
│   └── health_check.sh         # Health verification
│
├── tests/                      # Test suites
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # E2E tests (in frontend/web/tests)
│
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   ├── runbooks/               # Operational runbooks
│   └── architecture/           # Architecture diagrams
│
├── database/                   # Database configurations
│   ├── migrations/             # Alembic migrations
│   ├── schemas/                # Schema definitions
│   └── seeds/                  # Seed data
│
├── .github/                    # GitHub configurations
│   └── workflows/              # CI/CD pipelines
│
├── docker-compose.yml          # Main Docker Compose
├── docker-compose.prod.yml     # Production overrides
├── Makefile                    # Common commands
└── README.md                   # Project overview
```

---

## Service Directory Convention

Each service in `/services/` follows this structure:

```
services/<service-name>/
├── Dockerfile              # Container build instructions
├── config.yaml             # Service configuration
├── docker-compose.yaml     # Service-specific compose (optional)
├── main.go                 # Go entry point (for Go services)
├── go.mod                  # Go module definition (for Go services)
├── requirements.txt        # Python dependencies (for Python services)
├── package.json            # Node.js dependencies (for Node.js services)
└── README.md               # Service documentation
```

---

## Canonical Services

| Service | Directory | Language | Status |
|---------|-----------|----------|--------|
| Identity | `/services/identity-service/` | Go | ✅ Canonical |
| Student | `/services/student-service/` | Go | ✅ Canonical |
| Internship | `/services/internship-service/` | Go | ✅ Canonical |
| Assessment | `/services/assessment-service/` | Go | ✅ Canonical |
| Recommendation | `/services/recommendation-service/` | Python | ✅ Canonical |
| Scoring | `/services/scoring-service/` | Python | ✅ Canonical |
| Video | `/services/video-service/` | Node.js | ✅ Canonical |

---

## Deprecated Directories

The following directories are deprecated and should be removed:

| Directory | Reason | Action |
|-----------|--------|--------|
| `/backend/services/` | Duplicate of `/services/` | Remove |
| `/services/*-svc/` | Duplicate naming | Remove |
| `/services/mentor-svc/` | Empty, future feature | Remove |
| `/services/analytics-svc/` | Empty, future feature | Remove |

---

## File Naming Conventions

- **Services:** Use hyphen-case (e.g., `identity-service`)
- **Dockerfiles:** `Dockerfile.<service>` in `/docker/`
- **Configs:** `docker-compose.<env>.yml`
- **Scripts:** `<action>.sh` or `<action>.ps1`
- **Documentation:** `UPPER_CASE.md` for top-level, `lower-case.md` in subdirs

---

*Document Created: 2026-03-11*
*Version: 1.0*
