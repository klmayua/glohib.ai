# 02 - Dependency Inventory

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Dependency Manifests Summary

| Manifest | Location | Package Count | Status |
|----------|----------|---------------|--------|
| requirements.txt | /requirements.txt | 25+ | Root Python |
| package.json | /package.json | 3 | Root Node.js |
| package.json | /frontend/web/package.json | 20+ | Frontend |
| requirements.txt | /services/scoring-service/requirements.txt | 15+ | Scoring Service |
| requirements.txt | /services/recommendation-service/requirements.txt | 15+ | Recommendation Service |

---

## Root Python Dependencies

### Core ML & AI

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| torch | >=2.1.0 | Deep learning framework | Low |
| torchvision | >=0.16.0 | Computer vision | Low |
| transformers | >=4.36.0 | Hugging Face models | Low |
| sentence-transformers | >=2.2.2 | Text embeddings | Low |
| langchain | >=0.1.0 | LLM orchestration | Medium |

### NLP Processing

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| nltk | >=3.8.1 | Natural language toolkit | Low |
| spacy | >=3.7.2 | Industrial NLP | Low |

### ML Operations

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| xgboost | >=2.0.3 | Gradient boosting | Low |
| scikit-learn | >=1.3.2 | ML algorithms | Low |
| shap | >=0.43.0 | Model explainability | Low |

### Database

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| pgvector | >=0.2.4 | Vector similarity | Low |
| psycopg2-binary | >=2.9.9 | PostgreSQL driver | Low |

### AI Orchestration

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| ray[serve] | >=2.8.1 | Distributed serving | Medium |

### Video Processing

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| whisper-openai | >=1.20231117 | Speech transcription | Low |
| mediapipe | >=0.10.9 | Multimedia ML | Low |

### API & Web

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| fastapi | >=0.106.0 | Web framework | Low |
| uvicorn[standard] | >=0.25.0 | ASGI server | Low |
| python-multipart | >=0.0.6 | Form data parsing | Low |

### Testing

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| pytest | >=7.4.3 | Testing framework | Low |
| pytest-asyncio | >=0.23.2 | Async test support | Low |

### Utilities

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| python-dotenv | >=1.0.0 | Environment variables | Low |
| pydantic | >=2.5.2 | Data validation | Low |
| pydantic-settings | >=2.1.0 | Settings management | Low |

---

## Frontend Dependencies (Next.js)

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.2.3 | React framework |
| react | 18.3.1 | UI library |
| react-dom | 18.3.1 | React DOM |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| zustand | 4.5.2 | State management |
| @tanstack/react-query | 5.35.1 | Data fetching |

### HTTP & API

| Package | Version | Purpose |
|---------|---------|---------|
| axios | 1.6.8 | HTTP client |
| socket.io-client | 4.7.5 | WebSocket client |

### Form Handling

| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | 7.51.3 | Form management |
| zod | 3.23.8 | Schema validation |
| @hookform/resolvers | 3.3.4 | Form resolvers |

### UI & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | 3.4.3 | Utility CSS |
| framer-motion | 11.1.7 | Animations |
| lucide-react | 0.378.0 | Icons |
| clsx | 2.1.1 | Class utilities |
| tailwind-merge | 2.3.0 | Tailwind class merging |
| class-variance-authority | 0.7.0 | Variant classes |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5.4.5 | Type safety |
| eslint | 8.57.0 | Linting |
| eslint-config-next | 14.2.3 | Next.js ESLint |
| @types/node | 20.12.12 | Node types |
| @types/react | 18.3.2 | React types |
| @types/react-dom | 18.3.0 | ReactDOM types |
| autoprefixer | 10.4.19 | PostCSS plugin |
| postcss | 8.4.38 | CSS processing |

---

## Root Package.json (Workspace)

| Package | Version | Purpose |
|---------|---------|---------|
| concurrently | 8.2.2 | Parallel commands |
| typescript | 5.3.3 | Type safety |

---

## Go Dependencies

**Note:** Go services use Go modules. Key dependencies identified:

| Package | Purpose | Services |
|---------|---------|----------|
| gin-gonic/gin | Web framework | Identity, Student, Internship, Assessment |
| google.golang.org/grpc | gRPC | Identity, Assessment |
| google.golang.org/protobuf | Protocol buffers | Identity, Assessment |
| gorm.io/gorm | ORM | All Go services |
| gorm.io/driver/postgres | PostgreSQL driver | All Go services |
| github.com/go-redis/redis/v8 | Redis client | All Go services |
| github.com/golang-jwt/jwt/v5 | JWT handling | Identity |
| golang.org/x/oauth2 | OAuth2 | Identity |
| github.com/stretchr/testify | Testing | All Go services |

---

## Dependency Health Assessment

### Version Currency

| Ecosystem | Status | Notes |
|-----------|--------|-------|
| Python | ✅ Current | Latest stable versions |
| Node.js | ✅ Current | Latest stable versions |
| Go | ✅ Current | Go 1.22 with current modules |

### Security Concerns

| Package | Concern | Recommendation |
|---------|---------|----------------|
| langchain | Rapid changes, API instability | Pin to specific version |
| ray[serve] | Complex dependency tree | Monitor for vulnerabilities |
| whisper-openai | Third-party package | Verify source integrity |

### Missing Dependencies

| Category | Missing Package | Impact |
|----------|-----------------|--------|
| Security | python-jose[cryptography] | JWT RS256 support |
| Security | slowapi | Rate limiting |
| Testing | httpx | Async HTTP testing |
| Testing | go-testcoverage | Go coverage reports |
| Monitoring | prometheus-client | Metrics export |
| Monitoring | opentelemetry | Distributed tracing |

---

## Dependency Statistics

| Metric | Value |
|--------|-------|
| Total Python packages | 25+ |
| Total Node.js packages | 20+ |
| Total Go packages | 15+ |
| Total Docker images | 10+ |
| Security scanning configured | ❌ No |
| Dependency update automation | ❌ No |

---

## Recommendations

### Immediate Actions

1. **Pin dependency versions** - Replace `>=` with exact versions for reproducibility
2. **Add security scanning** - Configure Dependabot or Snyk
3. **Add missing security packages** - Rate limiting, enhanced JWT

### Short Term

1. **Consolidate duplicate requirements** - Merge service requirements.txt files
2. **Add dependency documentation** - Document why each major dependency is used
3. **Configure automated updates** - Set up Dependabot/Renovate

---

## Dependency Score: 70/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Version Currency | 85/100 | Current versions |
| Security | 50/100 | No scanning configured |
| Documentation | 60/100 | Basic manifests only |
| Consistency | 75/100 | Some duplication |
| Completeness | 80/100 | Core deps present |

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
