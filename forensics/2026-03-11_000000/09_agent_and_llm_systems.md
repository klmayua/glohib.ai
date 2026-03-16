# 09 - Agent and LLM Systems

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## AI/ML Systems Overview

GlohibAI implements several AI/ML capabilities across recommendation, scoring, and video processing services.

---

## Recommendation Service (ML)

**Location:** `services/recommendation-service/`
**Framework:** FastAPI + Sentence Transformers
**Status:** ✅ Complete

### ML Pipeline

```
Student Profile → Embedding Model → Vector Store
                                          ↓
Internship Profile → Embedding Model → Vector Store
                                          ↓
                              Cosine Similarity Match
```

### Models Used

| Model | Purpose | Source |
|-------|---------|--------|
| sentence-transformers/all-MiniLM-L6-v2 | Text embeddings | HuggingFace |
| pgvector | Vector similarity | PostgreSQL extension |

### Features

- Student profile embedding generation
- Internship description embedding
- Cosine similarity matching
- Behavioral tracking for recommendations
- Vector-based similarity search

### API Endpoints

```
GET  /api/v1/recommendations - Get personalized recommendations
POST /api/v1/recommendations/internships - Match student to internships
GET  /api/v1/recommendations/similar/:id - Find similar items
POST /api/v1/recommendations/track - Track user behavior
```

### Code Quality: 80/100

✅ Model loading on startup
✅ Efficient vector queries
✅ Behavioral tracking
⚠️ Limited error handling
⚠️ No model versioning

---

## Scoring Service (ML)

**Location:** `services/scoring-service/`
**Framework:** FastAPI + XGBoost + SHAP
**Status:** ✅ Complete

### ML Pipeline

```
Application Data → Feature Extraction → XGBoost Model → Score
                                               ↓
                                        SHAP Explainer → Explanation
```

### Models Used

| Model | Purpose | Source |
|-------|---------|--------|
| XGBoost Classifier | Pass/fail prediction | Trained internally |
| XGBoost Regressor | Score prediction (0-100) | Trained internally |
| SHAP | Model explainability | Open source |

### Features

- Application scoring (0-100)
- Pass/fail classification
- SHAP-based explanations
- Model registry with versioning
- Feature extraction pipeline
- Batch scoring support

### Model Registry

```python
ModelRegistry
├── load_model(version)
├── save_model(version)
├── list_versions()
└── get_current_version()
```

### API Endpoints

```
POST /api/v1/score/application - Score single application
POST /api/v1/score/batch - Batch scoring
GET  /api/v1/score/explain/:id - Get SHAP explanation
POST /api/v1/score/train - Train new model
GET  /api/v1/score/versions - List model versions
```

### Code Quality: 90/100

✅ Comprehensive logging (structlog)
✅ Prometheus metrics exposed
✅ Proper error handling
✅ Model versioning
✅ SHAP explainability

---

## Video Service (AI)

**Location:** `services/video-service/`
**Framework:** Express + Whisper
**Status:** ✅ Complete

### AI Pipeline

```
Video Upload → FFmpeg Transcoding → Whisper Transcription → Text Output
```

### Models Used

| Model | Purpose | Source |
|-------|---------|--------|
| Whisper (OpenAI) | Speech-to-text | OpenAI API |
| FFmpeg | Video transcoding | Local |

### Features

- TUS resumable uploads
- FFmpeg video transcoding
- Whisper transcription via OpenAI API
- Video storage in MinIO
- Streaming support

### API Endpoints

```
POST /api/v1/video/upload - Initiate upload
PATCH /api/v1/video/upload/:id - Upload chunk (TUS)
POST /api/v1/video/:id/transcribe - Transcribe video
GET /api/v1/video/:id/stream - Stream video
```

### Code Quality: 80/100

✅ TUS implementation solid
✅ Proper error handling
⚠️ External API dependency (OpenAI)
⚠️ No fallback for API failures

---

## AI/ML Infrastructure

### Vector Database

| Component | Status | Notes |
|-----------|--------|-------|
| pgvector | ✅ Configured | PostgreSQL extension |
| Qdrant | ⚠️ Configured, unused | Standalone vector DB |

### Model Storage

| Component | Status | Notes |
|-----------|--------|-------|
| Local Storage | ✅ Used | ./model-store |
| MinIO | ⚠️ Available | Could store models |
| Model Registry | ✅ Implemented | Version tracking |

### Compute Resources

| Service | CPU | Memory | GPU |
|---------|-----|--------|-----|
| Recommendation | 2 cores | 4GB | ❌ |
| Scoring | 2 cores | 4GB | ❌ |
| Video | 2 cores | 2GB | ❌ |

---

## AI Security Assessment

### Security Concerns

| Concern | Risk Level | Status |
|---------|------------|--------|
| Prompt Injection | High | ⚠️ No protection |
| Model Poisoning | High | ❌ No validation |
| Model Inversion | Medium | ❌ No defense |
| Adversarial Examples | Medium | ❌ No defense |
| Data Leakage | Medium | ⚠️ Partial protection |

### Missing Security Controls

1. **Input Validation**
   - No training data validation
   - No adversarial example detection

2. **Rate Limiting**
   - Only scoring service has rate limiting
   - Recommendation service unprotected

3. **Model Integrity**
   - No model signing
   - No hash verification

4. **Output Filtering**
   - No output sanitization
   - No content filtering

---

## AI Ethics & Governance

### Fairness

| Aspect | Status | Notes |
|--------|--------|-------|
| Bias Detection | ❌ Missing | No fairness metrics |
| Demographic Parity | ❌ Not measured | No sensitive attribute tracking |
| Equal Opportunity | ❌ Not measured | No TPR analysis |

### Transparency

| Aspect | Status | Notes |
|--------|--------|-------|
| Model Cards | ❌ Missing | No documentation |
| Explainability | ✅ Partial | SHAP in scoring service |
| Data Provenance | ⚠️ Partial | Some tracking |

### Accountability

| Aspect | Status | Notes |
|--------|--------|-------|
| Audit Logging | ⚠️ Partial | Basic logging only |
| Human Review | ❌ Missing | No appeal process |
| Impact Assessment | ❌ Missing | No AI impact analysis |

---

## LLM Integration

### Current Usage

| Service | LLM | Purpose |
|---------|-----|---------|
| Video | OpenAI Whisper | Transcription |
| Recommendation | HuggingFace | Embeddings |

### Potential Future Uses

1. **Resume Analysis**
   - Extract skills from resumes
   - Match to job requirements

2. **Interview Analysis**
   - Sentiment analysis
   - Keyword extraction

3. **Content Generation**
   - Internship descriptions
   - Feedback generation

4. **Chatbot**
   - Student support
   - FAQ answering

---

## AI/ML Score: 70/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Implementation | 85/100 | Working ML pipelines |
| Security | 45/100 | Missing protections |
| Ethics | 40/100 | Limited governance |
| Documentation | 70/100 | Some documentation |
| Monitoring | 60/100 | Basic metrics only |

---

## Recommendations

### Immediate (Week 1)

1. **Add Input Validation**
   - Validate training data
   - Detect adversarial examples

2. **Implement Rate Limiting**
   - Protect all ML endpoints
   - Prevent abuse

### Short Term (Month 1)

1. **Add Fairness Metrics**
   - Demographic parity
   - Equal opportunity analysis

2. **Model Security**
   - Model signing
   - Hash verification

### Long Term (Quarter 1)

1. **AI Governance**
   - Model cards
   - Impact assessments
   - Human review process

2. **Expand LLM Usage**
   - Resume analysis
   - Interview insights
   - Student support chatbot

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
