# 11 - Configurations and Environment

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Environment Files

| File | Purpose | Status |
|------|---------|--------|
| .env | Active environment | ✅ Present |
| .env.docker | Docker template | ✅ Present |
| .env.example | Example template | ✅ Present |
| .env.mvp | MVP configuration | ✅ Present |
| frontend/web/.env.local.example | Frontend example | ✅ Present |

---

## Environment Variables Inventory

### Infrastructure Variables

| Variable | Default | Service | Sensitive |
|----------|---------|---------|-----------|
| POSTGRES_USER | glohib | All | ❌ |
| POSTGRES_PASSWORD | (generated) | All | ✅ |
| POSTGRES_DB | glohib_db | All | ❌ |
| POSTGRES_HOST | postgres | All | ❌ |
| POSTGRES_PORT | 5432 | All | ❌ |
| REDIS_URL | redis://redis:6379 | All | ❌ |
| REDIS_HOST | redis | All | ❌ |
| REDIS_PORT | 6379 | All | ❌ |
| MINIO_ENDPOINT | minio:9000 | All | ❌ |
| MINIO_ROOT_USER | (generated) | All | ✅ |
| MINIO_ROOT_PASSWORD | (generated) | All | ✅ |
| MINIO_BUCKET | glohib | All | ❌ |

### Service Port Variables

| Variable | Default | Service |
|----------|---------|---------|
| IDENTITY_HTTP_PORT | 8080 | Identity |
| IDENTITY_GRPC_PORT | 50051 | Identity |
| STUDENT_HTTP_PORT | 8082 | Student |
| INTERNSHIP_HTTP_PORT | 8083 | Internship |
| ASSESSMENT_HTTP_PORT | 8084 | Assessment |
| ASSESSMENT_GRPC_PORT | 50054 | Assessment |
| RECOMMENDATION_PORT | 8007 | Recommendation |
| SCORING_PORT | 8008 | Scoring |
| VIDEO_PORT | 4000 | Video |

### Secret Variables

| Variable | Default | Service | Risk |
|----------|---------|---------|------|
| JWT_SECRET | (generated) | Identity | 🔴 Critical |
| OPENAI_API_KEY | (empty) | Video/Rec | 🔴 Critical |
| GOOGLE_CLIENT_ID | (empty) | Identity | 🟡 Medium |
| GOOGLE_CLIENT_SECRET | (empty) | Identity | 🟡 Medium |

### Video Service Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| TUS_UPLOAD_DIR | /tmp/uploads | Upload staging |
| MINIO_ACCESS_KEY | (generated) | MinIO auth |
| MINIO_SECRET_KEY | (generated) | MinIO auth |
| MINIO_USE_SSL | false | TLS toggle |

### Recommendation Service Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| VECTOR_DIM | 512 | Embedding size |
| MODEL_NAME | all-MiniLM-L6-v2 | Model selection |
| RANK_WEIGHT_SIM | 0.5 | Similarity weight |
| RANK_WEIGHT_BEH | 0.3 | Behavior weight |
| RANK_WEIGHT_REC | 0.2 | Recency weight |

---

## Configuration Files

### Service Configuration (YAML)

| Service | Config File | Status |
|---------|-------------|--------|
| Identity | services/identity-service/config.yaml | ✅ Present |
| Student | services/student-service/config.yaml | ✅ Present |
| Internship | services/internship-service/config.yaml | ✅ Present |
| Assessment | services/assessment-service/config.yaml | ✅ Present |

### Example: Identity Service Config

```yaml
server:
  http_port: 8080
  grpc_port: 50051

database:
  host: postgres
  port: 5432
  name: glohib_db
  user: glohib
  ssl_mode: disable

redis:
  host: redis
  port: 6379

jwt:
  secret_env: JWT_SECRET
  expiry_hours: 24
  refresh_expiry_days: 7

oauth:
  google:
    client_id_env: GOOGLE_CLIENT_ID
    client_secret_env: GOOGLE_CLIENT_SECRET
    redirect_uri: /api/v1/auth/google/callback
```

---

## TypeScript Configuration

### Root tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Frontend tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}]
  }
}
```

---

## Next.js Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
```

---

## Tailwind Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

---

## Docker Configuration

### docker-compose.yml

**Services:** 10
**Networks:** 1 (glohib-net)
**Volumes:** 3 (postgres_data, redis_data, minio_data)

### Resource Limits

| Service | CPU Limit | Memory Limit |
|---------|-----------|--------------|
| identity-service | 0.5 | 512M |
| student-service | 0.5 | 512M |
| internship-service | 0.5 | 512M |
| assessment-service | 0.5 | 512M |
| recommendation-service | Not set | Not set |
| scoring-service | Not set | Not set |
| video-service | Not set | Not set |

---

## Database Configuration

### Alembic Configuration (alembic.ini)

```ini
[alembic]
script_location = database/migrations
sqlalchemy.url = postgresql://glohib:password@localhost:5432/glohib_db

[post_write_hooks]
hooks = black
black.type = console_scripts
black.entrypoint = black
black.options = -q
```

---

## Configuration Score: 75/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Environment Management | 80/100 | Good separation |
| Secret Management | 60/100 | Env vars only |
| Service Configuration | 80/100 | YAML configs present |
| Type Safety | 85/100 | TypeScript strict mode |
| Docker Configuration | 75/100 | Good but incomplete |

---

## Recommendations

### Immediate

1. **Rotate Default Secrets**
   - Change JWT_SECRET
   - Change MinIO credentials
   - Change PostgreSQL password

2. **Add Missing Resource Limits**
   - recommendation-service
   - scoring-service
   - video-service

### Short Term

1. **Implement Secret Management**
   - HashiCorp Vault
   - AWS Secrets Manager
   - Kubernetes Secrets

2. **Add Configuration Validation**
   - Schema validation on startup
   - Required variable checks

### Long Term

1. **Configuration as Code**
   - Terraform for infrastructure
   - Helm charts for Kubernetes

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
