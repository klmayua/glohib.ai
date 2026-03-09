# GlohibAI - Complete Setup & Run Guide

## Quick Start (5 minutes)

### Prerequisites
- Docker Desktop for Windows
- Node.js 20+ (for frontend)
- Go 1.22+ (optional, for local development)
- Python 3.11+ (optional, for AI services)
- PowerShell or Git Bash

### Step 1: Clone & Setup

```powershell
# Navigate to project
cd C:\Users\UCHE\my-qwen-project\PROJECTS\GlohibAI

# Copy environment files
cp .env.docker .env

# Create frontend env
cd frontend\web
cp .env.local.example .env.local
cd ..\..
```

### Step 2: Start Backend Services

```powershell
# Start all services
docker compose up -d

# Wait 30 seconds for services to initialize
Start-Sleep -Seconds 30

# Check service health
docker compose ps
```

### Step 3: Verify Services

```powershell
# Run comprehensive test script
.\scripts\test_all_services.ps1

# Or test manually
curl http://localhost:8080/health
curl http://localhost:8082/health
curl http://localhost:8083/health
curl http://localhost:8084/health
curl http://localhost:8007/health
curl http://localhost:8008/health
curl http://localhost:4000/health
```

### Step 4: Seed Database (Optional)

```powershell
# Load sample data
docker compose exec postgres psql -U glohib -d glohib_db -f /docker-entrypoint-initdb.d/008_seed_data.sql
```

### Step 5: Start Frontend

```powershell
cd frontend\web

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   glohib-net                            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ postgres │  │  redis   │  │  minio   │             │
│  │  :5432   │  │  :6379   │  │ :9000/1  │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │             │                    │
│  ┌────┴─────────────┴─────────────┴────────┐          │
│  │          Application Services            │          │
│  │                                          │          │
│  │  ┌────────────┐  ┌──────────────┐      │          │
│  │  │ identity   │  │  assessment  │      │          │
│  │  │  :8080     │  │  :8084       │      │          │
│  │  └────────────┘  └──────────────┘      │          │
│  │                                          │          │
│  │  ┌────────────┐  ┌──────────────┐      │          │
│  │  │ student    │  │  internship  │      │          │
│  │  │  :8082     │  │  :8083       │      │          │
│  │  └────────────┘  └──────────────┘      │          │
│  │                                          │          │
│  │  ┌────────────┐  ┌──────────────┐      │          │
│  │  │recommend   │  │   scoring    │      │          │
│  │  │  :8007     │  │   :8008      │      │          │
│  │  └────────────┘  └──────────────┘      │          │
│  │                                          │          │
│  │  ┌────────────┐                         │          │
│  │  │  video     │                         │          │
│  │  │  :4000     │                         │          │
│  │  └────────────┘                         │          │
│  └──────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Next.js Frontend     │
            │  localhost:3000       │
            └───────────────────────┘
```

---

## Service Details

### Backend Services

| Service | Port | Tech | Health Endpoint |
|---------|------|------|-----------------|
| Identity | 8080 | Go + Gin | GET /health |
| Student | 8082 | Go + Gin | GET /health |
| Internship | 8083 | Go + Gin | GET /health |
| Assessment | 8084 | Go + Gin | GET /health |
| Recommendation | 8007 | Python + FastAPI | GET /health |
| Scoring | 8008 | Python + FastAPI | GET /health |
| Video | 4000 | Node.js + Express | GET /health |

### Infrastructure

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Primary database with pgvector |
| Redis | 6379 | Caching, sessions, behavioral tracking |
| MinIO | 9000/9001 | Object storage (S3-compatible) |

---

## API Endpoints

### Identity Service (`http://localhost:8080`)

```bash
# Register new user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","role":"student"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get current user (requires auth)
curl http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Student Service (`http://localhost:8082`)

```bash
# Create student profile
curl -X POST http://localhost:8082/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{"user_id":"UUID","email":"user@example.com","first_name":"John","last_name":"Doe"}'

# Get student by ID
curl http://localhost:8082/api/v1/students/STUDENT_ID

# Add skill
curl -X POST http://localhost:8082/api/v1/students/STUDENT_ID/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript","proficiency":4}'
```

### Internship Service (`http://localhost:8083`)

```bash
# List internships
curl http://localhost:8083/api/v1/internships?limit=20&offset=0

# Search internships
curl -X POST http://localhost:8083/api/v1/internships/search \
  -H "Content-Type: application/json" \
  -d '{"query":"software","remote":true,"paid":true}'

# Apply to internship
curl -X POST http://localhost:8083/api/v1/internships/INTERNSHIP_ID/applications \
  -H "Content-Type: application/json" \
  -d '{"student_id":"STUDENT_ID"}'
```

### Recommendation Service (`http://localhost:8007`)

```bash
# Vectorize student profile
curl -X POST http://localhost:8007/api/v1/vectorize/student \
  -H "Content-Type: application/json" \
  -d '{"student_id":"ID","skills":["JavaScript"],"interests":["AI"],"major":"CS","graduation_year":2025,"location":"Lagos","languages":["English"],"experience_months":12,"preferred_industries":["Tech"]}'

# Get recommendations
curl http://localhost:8007/api/v1/recommend/STUDENT_ID?limit=20
```

---

## Troubleshooting

### Services won't start

```powershell
# Check logs
docker compose logs identity-service
docker compose logs postgres

# Rebuild without cache
docker compose build --no-cache
docker compose up -d
```

### Port conflicts

Edit `.env` to change ports:
```
IDENTITY_HTTP_PORT=8090
STUDENT_HTTP_PORT=8092
```

### Database issues

```powershell
# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d postgres
Start-Sleep -Seconds 10
docker compose up -d
```

### Frontend won't build

```powershell
cd frontend\web
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

## Development Commands

### Docker

```powershell
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Restart specific service
docker compose restart identity-service

# Shell into service
docker compose exec identity-service sh

# Rebuild specific service
docker compose build identity-service
docker compose up -d identity-service
```

### Frontend

```powershell
cd frontend\web

# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint

# Type check
npm run typecheck
```

---

## Testing

### Run All Tests

```powershell
# Windows
.\scripts\test_all_services.ps1

# Linux/Mac
bash scripts/test_all_services.sh
```

### Manual Testing

```powershell
# Test all health endpoints
$services = @(
    "http://localhost:8080/health",
    "http://localhost:8082/health",
    "http://localhost:8083/health",
    "http://localhost:8084/health",
    "http://localhost:8007/health",
    "http://localhost:8008/health",
    "http://localhost:4000/health"
)

foreach ($url in $services) {
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing
        Write-Host "✓ $url - $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ $url - Failed" -ForegroundColor Red
    }
}
```

---

## Production Deployment

### Environment Variables (Change These!)

```bash
# .env.production
JWT_SECRET=generate-a-strong-random-string-min-32-chars
POSTGRES_PASSWORD=strong-password-here
MINIO_ROOT_PASSWORD=strong-minio-password
OPENAI_API_KEY=your-openai-api-key
```

### Build for Production

```powershell
# Backend
docker compose build

# Frontend
cd frontend\web
npm run build
docker build -t glohib-frontend .
```

---

## Next Steps

1. ✅ **Services Running** - All 7 backend services operational
2. ✅ **Frontend Ready** - Next.js app at localhost:3000
3. ⏸️ **Complete Profile** - Add your skills and experience
4. ⏸️ **Browse Internships** - View AI-powered recommendations
5. ⏸️ **Apply** - Submit applications to internships

---

**Support:** Check `PROJECT_STATUS.md` for current implementation status.
