# 15 - Build and Runtime Paths

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Build Paths Overview

### Build Systems

| Component | Build System | Status |
|-----------|-------------|--------|
| Go Services | go build | ✅ Configured |
| Python Services | pip install | ✅ Configured |
| Node.js Services | npm build | ✅ Configured |
| Frontend | Next.js build | ✅ Configured |
| Docker Images | docker build | ✅ Configured |

---

## Go Services Build

### Build Command

```bash
cd services/identity-service
go mod download
go build -o identity-service .
```

### Docker Build

```dockerfile
FROM golang:1.22-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o identity-service .

FROM alpine:3.19
COPY --from=builder /app/identity-service .
CMD ["./identity-service"]
```

### Build Output

| Service | Binary Name | Port |
|---------|-------------|------|
| identity-service | identity-service | 8080, 50051 |
| student-service | student-service | 8082 |
| internship-service | internship-service | 8083 |
| assessment-service | assessment-service | 8084, 50054 |

---

## Python Services Build

### Build Command

```bash
cd services/scoring-service
pip install -r requirements.txt
```

### Docker Build

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8008"]
```

### Build Output

| Service | Module | Port |
|---------|--------|------|
| recommendation-service | app.main:app | 8007 |
| scoring-service | app.main:app | 8008 |

---

## Node.js Services Build

### Build Command

```bash
cd services/video-service
npm install
npm run build
```

### Docker Build

```dockerfile
FROM node:20-alpine AS builder
RUN apk add --no-cache ffmpeg python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

FROM node:20-alpine
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

### Build Output

| Service | Output Directory | Port |
|---------|-----------------|------|
| video-service | dist/ | 4000 |

---

## Frontend Build

### Build Command

```bash
cd frontend/web
npm install
npm run build
```

### Build Output

| Output | Location |
|--------|----------|
| Static Files | .next/static/ |
| Server Files | .next/server/ |
| Build Manifest | .next/build-manifest.json |

### Production Start

```bash
npm run start
# Runs on port 3000
```

---

## Docker Build Paths

### Docker Compose Build

```bash
# Build all services
docker compose build

# Build specific service
docker compose build identity-service

# Build without cache
docker compose build --no-cache
```

### Dockerfile Locations

| Dockerfile | Service | Build Context |
|------------|---------|---------------|
| docker/Dockerfile.identity | identity-service | services/identity-service/ |
| docker/Dockerfile.student | student-service | services/student-service/ |
| docker/Dockerfile.internship | internship-service | services/internship-service/ |
| docker/Dockerfile.assessment | assessment-service | services/assessment-service/ |
| docker/Dockerfile.recommendation | recommendation-service | services/recommendation-service/ |
| docker/Dockerfile.scoring | scoring-service | services/scoring-service/ |
| docker/Dockerfile.video | video-service | services/video-service/ |

---

## Runtime Paths

### Service Runtime Configuration

| Service | Working Directory | Config Path | Data Path |
|---------|------------------|-------------|-----------|
| identity-service | /app | /app/config.yaml | - |
| student-service | /app | /app/config.yaml | - |
| internship-service | /app | /app/config.yaml | - |
| assessment-service | /app | /app/config.yaml | - |
| recommendation-service | /app | - | ./model-store/ |
| scoring-service | /app | - | ./model-store/ |
| video-service | /app | - | /tmp/uploads |

### Database Runtime

| Component | Data Path | Backup Path |
|-----------|-----------|-------------|
| PostgreSQL | /var/lib/postgresql/data | Not configured |
| Redis | /data | Not configured |
| MinIO | /data | Not configured |

### Log Runtime

| Service | Log Path | Rotation |
|---------|----------|----------|
| All services | stdout/stderr | 10m, 3 files |

---

## Makefile Commands

### Available Commands

```makefile
docker-up              # Start all services
docker-down            # Stop all services
docker-logs            # Tail logs
docker-rebuild         # Rebuild without cache
docker-clean           # Remove containers/volumes
docker-init            # Initialize MinIO
docker-shell-postgres  # PostgreSQL shell
docker-shell-redis     # Redis CLI
docker-shell-minio     # MinIO shell
test-all-health        # Health check all services
```

### Usage

```bash
make docker-up
make docker-down
make docker-logs
make docker-clean
```

---

## Scripts

### Available Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| scripts/test_all_services.ps1 | Health check all services | ✅ Present |
| scripts/deploy.ps1 | Deployment script | ⚠️ Needs creation |
| scripts/backup.sh | Database backup | ❌ Missing |
| scripts/restore.sh | Database restore | ❌ Missing |

---

## CI/CD Build Paths

**Status:** ❌ **NOT CONFIGURED**

| Platform | Status |
|----------|--------|
| GitHub Actions | ❌ Not configured |
| GitLab CI | ❌ Not configured |
| Jenkins | ❌ Not configured |

### Recommended CI/CD Path

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker images
        run: docker compose build
      
      - name: Run tests
        run: docker compose run --rm scoring-service pytest
      
      - name: Push to registry
        run: |
          docker push registry/glohib-identity-service:latest
```

---

## Build Score: 70/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Go Build | 85/100 | Well configured |
| Python Build | 75/100 | Good but needs multi-stage |
| Node.js Build | 85/100 | Multi-stage builds |
| Frontend Build | 80/100 | Next.js standard |
| Docker Build | 70/100 | Good but inconsistent |
| CI/CD Build | 0/100 | Not configured |

---

## Recommendations

### Immediate (Week 1)

1. **Standardize Dockerfiles**
   - All services should use multi-stage builds
   - All services should run as non-root

2. **Add Build Scripts**
   ```bash
   # scripts/build_all.sh
   #!/bin/bash
   docker compose build
   ```

### Short Term (Month 1)

1. **Configure CI/CD**
   - GitHub Actions workflow
   - Automated testing
   - Automated deployment

2. **Add Backup Scripts**
   ```bash
   # scripts/backup.sh
   pg_dump -U glohib glohib_db | gzip > backup.sql.gz
   ```

### Long Term (Quarter 1)

1. **Implement GitOps**
   - ArgoCD for deployments
   - Helm charts
   - Automated rollbacks

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
