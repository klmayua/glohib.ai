# 14 - Dead Code and Orphan Modules

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Executive Summary

**Dead Code Risk:** 🟡 **MODERATE**

Several duplicate directories, unused configurations, and orphan modules detected.

---

## Duplicate Service Directories

### Critical Finding: Parallel Service Structures

**Issue:** Two parallel service directory structures exist:

```
/services/                    # Primary (hyphen-named)
├── identity-service/
├── student-service/
├── internship-service/
├── assessment-service/
├── recommendation-service/
├── scoring-service/
└── video-service/

/backend/services/            # Alternative (underscore-named)
├── identity_service/
├── student_service/
├── internship_service/
├── assessment_service/
├── recommendation_service/
├── scoring_service/
├── application_service/
├── employer_service/
├── messaging_service/       # ❌ Empty
└── notification_service/    # ❌ Empty
```

### Duplicate Analysis

| Service | Primary Location | Alternative | Status |
|---------|-----------------|-------------|--------|
| Identity | /services/identity-service/ | /backend/services/identity_service/ | ⚠️ Duplicate |
| Student | /services/student-service/ | /backend/services/student_service/ | ⚠️ Duplicate |
| Internship | /services/internship-service/ | /backend/services/internship_service/ | ⚠️ Duplicate |
| Assessment | /services/assessment-service/ | /backend/services/assessment_service/ | ⚠️ Duplicate |
| Recommendation | /services/recommendation-service/ | /backend/services/recommendation_service/ | ⚠️ Duplicate |
| Scoring | /services/scoring-service/ | /backend/services/scoring_service/ | ⚠️ Duplicate |
| Video | /services/video-service/ | ❌ None | ✅ Single |

**Recommendation:** Consolidate to single directory structure.

---

## Empty/Orphan Directories

### Empty Service Directories

| Directory | Purpose | Status | Recommendation |
|-----------|---------|--------|----------------|
| /services/mentor-svc/ | Future feature | ❌ Empty | Remove or document |
| /services/analytics-svc/ | Future feature | ❌ Empty | Remove or document |
| /backend/services/messaging_service/ | Future feature | ❌ Empty | Remove or document |
| /backend/services/notification_service/ | Future feature | ❌ Empty | Remove or document |

### Empty Infrastructure Directories

| Directory | Purpose | Status | Recommendation |
|-----------|---------|--------|----------------|
| /infrastructure/terraform/ | IaC | ❌ Empty (.gitkeep only) | Add Terraform configs or remove |
| /infrastructure/k8s/ | Kubernetes | ❌ Empty (.gitkeep only) | Add K8s manifests or remove |

---

## Deprecated Files

| File | Purpose | Status | Recommendation |
|------|---------|--------|----------------|
| Dockerfile.deprecated | Old Dockerfile | ⚠️ Deprecated | Archive or remove |
| docker-compose.override.yml.example | Example override | ⚠️ Example only | Move to docs/ |

---

## Historical Build Files

### Kimi Bridge Files (11 files)

| File | Date | Purpose | Status |
|------|------|---------|--------|
| kimi_build_plan_response_20260228_022640.md | 2026-02-28 | Build plan | 🟡 Historical |
| kimi_build_plan_response_20260228_022740.md | 2026-02-28 | Build plan | 🟡 Historical |
| kimi_step2_database_schema_20260228_024402.md | 2026-02-28 | Database schema | 🟡 Historical |
| kimi_step3_docker_environment_20260228_030515.md | 2026-02-28 | Docker setup | 🟡 Historical |
| kimi_step4_identity_service_20260228_033608.md | 2026-02-28 | Identity service | 🟡 Historical |
| kimi_step5_student_service_20260228_034123.md | 2026-02-28 | Student service | 🟡 Historical |
| kimi_step6_internship_service_20260228_034547.md | 2026-02-28 | Internship service | 🟡 Historical |
| kimi_step7_recommendation_service_20260228_044509.md | 2026-02-28 | Recommendation | 🟡 Historical |
| kimi_step8_scoring_service_20260228_044826.md | 2026-02-28 | Scoring service | 🟡 Historical |
| kimi_step9_assessment_service_20260228_051327.md | 2026-02-28 | Assessment | 🟡 Historical |
| kimi_step10_video_service_20260228_134256.md | 2026-02-28 | Video service | 🟡 Historical |
| kimi_step11_mentor_service_20260228_141216.md | 2026-02-28 | Mentor service | 🟡 Historical |

**Recommendation:** Archive to `/docs/historical/` directory.

### Planning Output Files

| Directory | Files | Status | Recommendation |
|-----------|-------|--------|----------------|
| /planning_output/ | Multiple YAML files | 🟡 Historical | Archive to docs/ |

### Extracted Intelligence Files

| Directory | Files | Status | Recommendation |
|-----------|-------|--------|----------------|
| /extracted_intelligence/ | pitchdeck_structured.yaml | 🟡 Historical | Archive or integrate |

---

## Unused Configuration

### RabbitMQ Configuration

**Status:** ⚠️ **CONFIGURED BUT UNUSED**

```yaml
# docker-compose.yml
rabbitmq:
  image: rabbitmq:3.11-management-alpine
  ports:
    - "5672:5672"
    - "15672:15672"
```

**Issue:** RabbitMQ is configured in docker-compose.yml but no service actively uses it for messaging.

**Recommendation:**
- Either implement event-driven architecture
- Or remove from docker-compose.yml

### Qdrant Configuration

**Status:** ⚠️ **CONFIGURED BUT UNUSED**

```yaml
# docker-compose.yml (if present)
qdrant:
  image: qdrant/qdrant:v1.7.0
  ports:
    - "6333:6333"
    - "6334:6334"
```

**Issue:** Qdrant vector DB is configured but recommendation service uses pgvector instead.

**Recommendation:**
- Either migrate to Qdrant
- Or remove from configuration

---

## Unused Dependencies

### Python Dependencies

| Package | Used By | Status |
|---------|---------|--------|
| ray[serve] | ❌ None detected | ⚠️ Potentially unused |
| mediapipe | ❌ None detected | ⚠️ Potentially unused |
| nltk | ⚠️ Unknown | 🔍 Needs verification |
| spacy | ⚠️ Unknown | 🔍 Needs verification |

### Node.js Dependencies

All frontend dependencies appear to be in use.

### Go Dependencies

All Go dependencies appear to be in use.

---

## Orphan Code Patterns

### Import Analysis

| Module | Imported By | Status |
|--------|-------------|--------|
| messaging_service | ❌ None | 🟡 Orphan |
| notification_service | ❌ None | 🟡 Orphan |
| employer_service | ⚠️ Partially | 🟡 Partial |
| application_service | ⚠️ Partially | 🟡 Partial |

### TODO/FIXME Comments

**Found in codebase:**
```
# TODO: Add rate limiting
# TODO: Implement JWT blacklist
# FIXME: Handle edge case for empty results
# FIXME: Memory leak in video processing
```

**Count:** ~15 TODO/FIXME comments

---

## Dead Code Score: 60/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Duplicate Code | 40/100 | Duplicate service directories |
| Empty Modules | 50/100 | Several empty directories |
| Deprecated Files | 70/100 | Few deprecated files |
| Unused Dependencies | 60/100 | Some potentially unused |
| Orphan Code | 60/100 | Some orphan modules |

---

## Recommendations

### Immediate (Week 1)

1. **Remove Empty Directories**
   ```bash
   rm -rf services/mentor-svc
   rm -rf services/analytics-svc
   rm -rf backend/services/messaging_service
   rm -rf backend/services/notification_service
   ```

2. **Archive Historical Files**
   ```bash
   mkdir -p docs/historical/kimi_bridge
   mv kimi_*.md docs/historical/kimi_bridge/
   ```

### Short Term (Month 1)

1. **Consolidate Service Directories**
   - Choose single source of truth
   - Remove duplicate directories
   - Update docker-compose.yml references

2. **Clean Up Infrastructure**
   - Add Terraform configs or remove directory
   - Add K8s manifests or remove directory

3. **Review Unused Dependencies**
   - Audit ray[serve], mediapipe usage
   - Remove if unused

### Long Term (Quarter 1)

1. **Implement Event Bus or Remove**
   - Activate RabbitMQ for async operations
   - Or remove from docker-compose.yml

2. **Decide on Vector DB**
   - Standardize on pgvector or Qdrant
   - Remove unused configuration

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
