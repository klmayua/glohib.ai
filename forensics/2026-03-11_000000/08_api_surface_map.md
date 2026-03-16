# 08 - API Surface Map

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## API Overview

**Total Services:** 7
**Total Endpoints:** ~50+
**API Style:** REST (primary), gRPC (secondary)
**Documentation:** Inline/OpenAPI (partial)

---

## Identity Service API

**Base URL:** `http://localhost:8080`
**Auth:** JWT Bearer Token

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/register | ❌ | Register new user |
| POST | /api/v1/auth/login | ❌ | Login with credentials |
| POST | /api/v1/auth/refresh | ✅ | Refresh access token |
| POST | /api/v1/auth/logout | ✅ | Logout (blacklist token) |
| POST | /api/v1/auth/google | ❌ | Google OAuth login |

### User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/users/me | ✅ | Get current user |
| PUT | /api/v1/users/me | ✅ | Update current user |
| GET | /api/v1/users/:id | ✅ | Get user by ID |

### API Key Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/api-keys | ✅ | Create API key |
| GET | /api/v1/api-keys | ✅ | List API keys |
| DELETE | /api/v1/api-keys/:id | ✅ | Revoke API key |

### Request/Response Examples

```typescript
// POST /api/v1/auth/register
Request: {
  email: string,
  password: string,
  role: 'student' | 'employer' | 'admin'
}
Response: {
  access_token: string,
  refresh_token: string,
  user: User
}

// POST /api/v1/auth/login
Request: {
  email: string,
  password: string
}
Response: {
  access_token: string,
  refresh_token: string,
  user: User
}
```

---

## Student Service API

**Base URL:** `http://localhost:8082`
**Auth:** JWT Bearer Token

### Profile Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/student/profile | ✅ | Get student profile |
| POST | /api/v1/student/profile | ✅ | Create profile |
| PUT | /api/v1/student/profile | ✅ | Update profile |

### Skills Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/student/skills | ✅ | List skills |
| POST | /api/v1/student/skills | ✅ | Add skill |
| DELETE | /api/v1/student/skills/:id | ✅ | Remove skill |

### Education Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/student/education | ✅ | List education |
| POST | /api/v1/student/education | ✅ | Add education |
| PUT | /api/v1/student/education/:id | ✅ | Update education |
| DELETE | /api/v1/student/education/:id | ✅ | Delete education |

### Experience Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/student/experience | ✅ | List experience |
| POST | /api/v1/student/experience | ✅ | Add experience |
| PUT | /api/v1/student/experience/:id | ✅ | Update experience |
| DELETE | /api/v1/student/experience/:id | ✅ | Delete experience |

---

## Internship Service API

**Base URL:** `http://localhost:8083`
**Auth:** JWT Bearer Token

### Internship Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/internships | ❌ | List all internships |
| POST | /api/v1/internships | ✅ | Create internship |
| GET | /api/v1/internships/:id | ❌ | Get internship details |
| PUT | /api/v1/internships/:id | ✅ | Update internship |
| DELETE | /api/v1/internships/:id | ✅ | Delete internship |

### Search Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/internships/search | ❌ | Search with filters |
| POST | /api/v1/internships/:id/similar | ❌ | Get similar internships |

### Application Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/internships/:id/apply | ✅ | Apply to internship |
| GET | /api/v1/applications | ✅ | List my applications |
| GET | /api/v1/applications/:id | ✅ | Get application details |
| PUT | /api/v1/applications/:id/status | ✅ | Update application status |

---

## Assessment Service API

**Base URL:** `http://localhost:8084`
**Auth:** JWT Bearer Token

### Assessment Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/assessments | ✅ | List assessments |
| POST | /api/v1/assessments | ✅ | Create assessment |
| GET | /api/v1/assessments/:id | ✅ | Get assessment details |
| POST | /api/v1/assessments/:id/start | ✅ | Start assessment |
| POST | /api/v1/assessments/:id/submit | ✅ | Submit assessment |
| GET | /api/v1/assessments/:id/results | ✅ | Get results |

### gRPC Endpoints

| Service | Method | Description |
|---------|--------|-------------|
| IdentityValidator | ValidateToken | Validate JWT token |
| IdentityValidator | GetUserRole | Get user role |

---

## Recommendation Service API

**Base URL:** `http://localhost:8007`
**Auth:** JWT Bearer Token

### Recommendation Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/recommendations | ✅ | Get recommendations |
| POST | /api/v1/recommendations/internships | ✅ | Get internship recs |
| GET | /api/v1/recommendations/similar/:id | ✅ | Get similar items |
| POST | /api/v1/recommendations/track | ✅ | Track user behavior |

---

## Scoring Service API

**Base URL:** `http://localhost:8008`
**Auth:** JWT Bearer Token

### Scoring Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/score/application | ✅ | Score application |
| POST | /api/v1/score/batch | ✅ | Batch scoring |
| GET | /api/v1/score/explain/:id | ✅ | Get SHAP explanation |
| POST | /api/v1/score/train | ✅ | Train model |
| GET | /api/v1/score/versions | ✅ | List model versions |

### Metrics Endpoint

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /metrics | ❌ | Prometheus metrics |

---

## Video Service API

**Base URL:** `http://localhost:4000`
**Auth:** JWT Bearer Token

### Video Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/video/upload | ✅ | Initiate upload |
| PATCH | /api/v1/video/upload/:id | ✅ | Upload chunk (TUS) |
| GET | /api/v1/video/:id | ✅ | Get video info |
| DELETE | /api/v1/video/:id | ✅ | Delete video |
| POST | /api/v1/video/:id/transcribe | ✅ | Transcribe video |
| GET | /api/v1/video/:id/stream | ✅ | Stream video |

---

## API Security

### Authentication Methods

| Method | Services | Status |
|--------|----------|--------|
| JWT Bearer | All | ✅ Implemented |
| API Key | Identity | ✅ Implemented |
| OAuth2 (Google) | Identity | ✅ Implemented |

### Rate Limiting

| Service | Limit | Status |
|---------|-------|--------|
| Scoring | 10/min | ✅ Implemented |
| Identity | None | ❌ Missing |
| Student | None | ❌ Missing |
| Internship | None | ❌ Missing |
| Video | None | ❌ Missing |

---

## API Documentation Status

| Service | OpenAPI/Swagger | Status |
|---------|-----------------|--------|
| Identity | ⚠️ Partial | Inline docs |
| Student | ⚠️ Partial | Inline docs |
| Internship | ⚠️ Partial | Inline docs |
| Assessment | ⚠️ Partial | Inline docs |
| Recommendation | ⚠️ Partial | Inline docs |
| Scoring | ✅ Complete | OpenAPI |
| Video | ⚠️ Partial | Inline docs |

---

## API Score: 75/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Coverage | 85/100 | Most features exposed |
| Documentation | 60/100 | Partial OpenAPI |
| Security | 70/100 | JWT implemented, rate limiting missing |
| Consistency | 80/100 | REST conventions followed |
| Versioning | 90/100 | /api/v1/ prefix used |

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
