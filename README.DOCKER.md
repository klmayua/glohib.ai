# GlohibAI - Docker Development Guide

## Quick Start

```bash
# Copy environment template
cp .env.docker .env

# Start all services
docker compose up --build

# Start specific service only
docker compose up identity-service

# View logs
docker compose logs -f identity-service

# Stop all services
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    glohib-net (bridge)                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   postgres   │  │    redis     │  │     minio    │      │
│  │   (5432)     │  │    (6379)    │  │  (9000/9001) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│  ┌──────┴─────────────────┴─────────────────┴───────┐      │
│  │              Application Services                 │      │
│  │                                                   │      │
│  │  ┌─────────────────┐  ┌─────────────────────┐   │      │
│  │  │ identity-svc    │  │ assessment-svc      │   │      │
│  │  │ Go + Gin        │  │ Go + Gin            │   │      │
│  │  │ :8080, :50051   │  │ :8084, :50054       │   │      │
│  │  └─────────────────┘  └─────────────────────┘   │      │
│  │                                                   │      │
│  │  ┌─────────────────┐  ┌─────────────────────┐   │      │
│  │  │ recommendation  │  │   scoring-svc       │   │      │
│  │  │ Python+FastAPI  │  │   Python+FastAPI    │   │      │
│  │  │ :8007           │  │   :8008             │   │      │
│  │  └─────────────────┘  └─────────────────────┘   │      │
│  │                                                   │      │
│  │  ┌─────────────────┐                             │      │
│  │  │  video-svc      │                             │      │
│  │  │  Node+Express   │                             │      │
│  │  │  :4000          │                             │      │
│  │  └─────────────────┘                             │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Host Port Mapping
                        ▼
            ┌───────────────────────────┐
            │  localhost:8080 (identity)│
            │  localhost:8084 (assess)  │
            │  localhost:8007 (recommend)│
            │  localhost:8008 (score)   │
            │  localhost:4000 (video)   │
            │  localhost:5432 (postgres)│
            │  localhost:6379 (redis)   │
            │  localhost:9000 (minio)   │
            └───────────────────────────┘
```

## Services Status

| Service | Language | Status | Port(s) | Health Check |
|---------|----------|--------|---------|--------------|
| postgres | pgvector:pg16 | ✅ Ready | 5432 | pg_isready |
| redis | redis:7-alpine | ✅ Ready | 6379 | redis-cli ping |
| minio | minio:latest | ✅ Ready | 9000/9001 | mc ready |
| identity-service | Go 1.22 | ✅ Ready | 8080, 50051 | /health |
| assessment-service | Go 1.22 | ✅ Ready | 8084, 50054 | /health |
| recommendation-service | Python 3.11 | ✅ Ready | 8007 | /health |
| scoring-service | Python 3.11 | ✅ Ready | 8008 | /health |
| video-service | Node.js 20 | ✅ Ready | 4000 | /health |
| student-service | Go 1.22 | ⚠️ Incomplete | 8082 | - |
| internship-service | Go 1.22 | ⚠️ Incomplete | 8083 | - |

## Environment Variables

See `.env.docker` for all available configuration options:

```bash
# Infrastructure
POSTGRES_USER=glohib
POSTGRES_PASSWORD=changeme
POSTGRES_DB=glohib_db

# Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=super-secret-change-me
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## API Endpoints

### Identity Service (`http://localhost:8080`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/auth/me` | GET | Current user (protected) |
| `/api/v1/oauth/google` | POST | Google OAuth |
| `/api/v1/apikeys` | POST | Create API key |

### Assessment Service (`http://localhost:8084`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/assessments` | POST | Create assessment |
| `/api/v1/assessments/:id` | GET | Get assessment |

### Recommendation Service (`http://localhost:8007`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/vectorize/student` | POST | Vectorize student |
| `/api/v1/vectorize/internship` | POST | Vectorize internship |
| `/api/v1/recommend/:student_id` | GET | Get recommendations |

### Scoring Service (`http://localhost:8008`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/score/application` | POST | Score application |
| `/api/v1/score/:id/explain` | GET | Get SHAP explanation |

### Video Service (`http://localhost:4000`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/video/:id` | GET | Get video metadata |
| `/api/v1/video/:id/transcode` | POST | Trigger transcoding |

## Troubleshooting

### Service won't start

```bash
# Check logs
docker compose logs <service-name>

# Rebuild without cache
docker compose build --no-cache <service-name>
```

### Database connection issues

```bash
# Verify postgres is healthy
docker compose ps postgres

# Test connection
docker compose exec postgres pg_isready -U glohib
```

### Port conflicts

Edit `.env` to change conflicting ports:

```bash
IDENTITY_HTTP_PORT=8090  # Instead of 8080
```

## Development Workflow

```bash
# Watch logs for all services
docker compose logs -f

# Run tests inside container
docker compose exec identity-service go test ./...

# Shell into a service
docker compose exec identity-service sh

# Restart a single service
docker compose restart identity-service
```

## Production Notes

⚠️ **Before deploying to production:**

1. Change all default passwords in `.env`
2. Set strong `JWT_SECRET` (32+ random characters)
3. Configure TLS/SSL for all endpoints
4. Use managed PostgreSQL (RDS, Cloud SQL)
5. Use managed Redis (ElastiCache, Memorystore)
6. Configure proper backup strategies
7. Set up monitoring and alerting
