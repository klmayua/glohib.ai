# GLOHIB.AI - KIMI K2 BUILD PLAN RESPONSE

**Generated:** 2026-02-28 02:27:40

---

```yaml
# ================================================================================
# GLOHIB.AI – COMPLETE SYSTEM BUILD PLAN
# Kimi K2, Chief Architect
# ================================================================================

# ================================================================================
# 1. FULL PRODUCT ARCHITECTURE
# ================================================================================

architecture_overview:
  diagram: |
    ┌-------------------------┐
    │  Client Layer (Web/Mobile)
    └-----------┬-------------┘
                │REST/gRPC
    ┌-----------┴-------------┐
    │  API Gateway (Kong)     │
    └-----------┬-------------┘
                │internal mTLS
    ┌-----------┴-------------┐
    │  BFF (GraphQL)          │
    └-----------┬-------------┘
                │Kafka/NATS
    ┌-----------┴-------------┐
    │  Micro-services Mesh    │
    │ (Kubernetes/Istio)      │
    └-----------┬-------------┘
                │gRPC
    ┌-----------┴-------------┐
    │  AI/ML Platform         │
    │ (Ray/Kubeflow)          │
    └-----------┬-------------┘
                │S3/GCS
    ┌-----------┴-------------┐
    │  Data Lake / DWH        │
    └-------------------------┘

  technology_stack:
    frontend:
      - technology: Next.js 14 (React Server Components)
        justification: "SSR for SEO, edge runtime for Africa/Asia latency"
      - technology: TailwindCSS + shadcn/ui
        justification: "Fast iteration, accessibility out-of-box"
      - technology: React-Query + TRPC
        justification: "End-to-end type-safety, caching"
    backend:
      - technology: Go 1.22 (core services)
        justification: "Low-latency, compile-time safety, tiny containers"
      - technology: Node.js 20 (real-time & BFF)
        justification: "GraphQL subscriptions, same language as frontend"
      - technology: Python 3.11 (AI services)
        justification: "Ecosystem maturity for ML/NLP"
    data:
      - technology: PostgreSQL 16 (OLTP)
        justification: "ACID, JSONB for vectors, pgvector extension"
      - technology: ClickHouse (analytics)
        justification: "Columnar, sub-second aggregates on TB scale"
      - technology: Redis 7 (cache + queues)
        justification: "In-memory speed, Streams for event sourcing"
      - technology: MinIO (S3-compatible object store)
        justification: "On-prem option for African universities with data residency"
    infrastructure:
      - technology: Kubernetes 1.29 (GKE/EKS)
        justification: "Multi-region, autoscaling, managed Istio"
      - technology: Terraform + Atlantis
        justification: "GitOps, repeatable multi-region infra"
      - technology: Cloudflare R2 + Workers
        justification: "50% cheaper egress, 300+ PoPs in Africa/Asia"
    observability:
      - technology: Grafana Cloud (Managed Prometheus/Loki/Tempo)
        justification: "Unified UX, 15-month retention, GDPR ready"
      - technology: OpenTelemetry
        justification: "Vendor-neutral traces/metrics/logs"

  boundaries:
    frontend: "Next.js edge functions → BFF GraphQL"
    backend: "BFF → domain micro-services (gRPC)"
    ai_services: "Micro-services → Ray serve (HTTP)"
    data: "Services → DAO layer → PostgreSQL/ClickHouse"

# ================================================================================
# 2. SYSTEM DESIGN – 7 WORKFLOW STAGES
# ================================================================================

workflow_stages:

  - stage: 1
    name: "Internship Feed"
    components:
      - "Recommendation-API"
      - "Discovery-UI"
      - "Profile-Vectorizer"
    data_flow: |
      Student → GraphQL query → Recommendation-API
      → Redis cache (cold-start) / ClickHouse (behavioral)
      → Ranked list (internshipIds + scores)
      → Discovery-UI
    api_design:
      endpoint: "POST /v1/feed/personalized"
      request: |
        {
          "studentId": "uuid",
          "limit": 25,
          "offset": 0,
          "filters": { "region": ["AFRO", "SEARO"], "paid": true }
        }
      response: |
        {
          "items": [{ "id", "score", "why" }],
          "nextOffset": 25,
          "abTest": "A"
        }

  - stage: 2
    name: "Application Scoring"
    components:
      - "Scoring-Engine (Python)"
      - "Feature-Store"
      - "Model-Registry"
    data_flow: |
      Application submitted → Kafka topic
      → Scoring-Engine consumes → loads ML model
      → extracts features from Feature-Store
      → outputs probability + explanation
      → writes to PostgreSQL + Kafka (next stage)
    model_details:
      type: "XGBoost multi-class"
      features: 143
      latency_slo: "<150 ms p99"
      explainability: "SHAP values stored"

  - stage: 3
    name: "Psychomotor Tests"
    components:
      - "Test-Generator (LLM)"
      - "Timer-Service"
      - "Submission-Handler"
    data_flow: |
      Candidate clicks start → Timer-Service issues JWT with exp
      → Test-Generator pulls prompt template
      → LLM fills placeholders (dynamic)
      → Candidate submits → Submission-Handler
      → Auto-grade (pass/fail) → Kafka
    prompt_template: |
      "Generate a 5-question MCQ test on {skill} difficulty {level};
       ensure at least 1 image-based question; return JSON schema."

  - stage: 4
    name: "Situational Analysis"
    components:
      - "NLP-Evaluator"
      - "Rubrics-DB"
      - "Anti-cheat (similarity)"
    data_flow: |
      Open-text answer → NLP-Evaluator
      → spell/grammar → embeddings → rubric match
      → cosine vs answer key → score 0-100
      → similarity check vs web & past answers
      → pass/fail + feedback

  - stage: 5
    name: "Mentorship or CV Routing"
    logic: |
      if score ≥ 70 → Mentor-Matching-Engine
      else → CV-Helper-API (GPT-4 fine-tuned)
    mentor_matching:
      algorithm: "stable marriage with weights"
      weights: { "domain": 0.4, "timezone": 0.3, "language": 0.2, "rating": 0.1 }

  - stage: 6
    name: "Video Interview"
    components:
      - "Video-Upload (TUS)"
      - "Question-Publisher"
      - "AI-Grading"
    data_flow: |
      Employer questions → Question-Publisher
      → Candidate records (WebRTC) → TUS resumable upload
      → Video processed (audio strip + transcription)
      → AI-Grading (content, sentiment, speech clarity)
      → score + highlights → PostgreSQL

  - stage: 7
    name: "Employer Handoff"
    components:
      - "Employer-Dashboard (RO)"
      - "Analytics-API"
      - "Export-Service"
    data_flow: |
      Employer queries candidate → Analytics-API
      → aggregates all stages → read-only dashboard
      → Export-Service (PDF/CSV) on demand
      → webhooks to ATS (Greenhouse, Workday)

# ================================================================================
# 3. INFRASTRUCTURE DESIGN
# ================================================================================

cloud_provider: "Google Cloud (primary) + AWS (disaster recovery)"
justification: "Best sub-sea cable reach Africa (Equiano), committed discounts"

regions:
  primary:
    - name: "europe-west1"
      usage: "API, databases"
    - name: "europe-west3"
      usage: "AI training (GPU)"
  africa:
    - name: "africa-south1"
      usage: "CDN + edge functions"
  asia:
    - name: "asia-southeast1"
      usage: "CDN + edge functions"

scalability_architecture:
  compute:
    - "GKE Autopilot (min 1 → max 5k nodes)"
    - "Knative for scale-to-zero AI containers"
  data:
    - "Cloud Spanner (global, 99.999% SLA) for user identities"
    - "PostgreSQL with Citus (shard by student_id)"
  networking:
    - "Cloudflare CDN (300+ PoPs) – 50% egress savings"
    - "Global load balancer with geo-routing"
    - "Cloud NAT for outbound IPv4"

cdn_strategy:
  static_assets: "Cloudflare R2 + Workers"
  video_upload: "Direct-to-R2 presigned URL (TUS)"
  cache_ttl: "HTML 30s, API 5m, Assets 1y"

load_balancing:
  l7: "Cloudflare LB → GCP Global LB"
  l4: "Maglev-based internal GCP LB"
  failover: "90s TTL DNS to AWS"

cost_estimate_monthly:
  workload: "10M active users, 100M page views"
  compute: "$42k"
  data: "$18k"
  network: "$7k"
  ai: "$31k"
  observability: "$4k"
  total: "$102k/month"

# ================================================================================
# 4. AI ORCHESTRATION MODEL
# ================================================================================

llm_integration:
  architecture: "Ray Serve (v2) autoscaling cluster"
  model_endpoints:
    - name: "test-generator"
      model: "GPT-4-turbo"
      replicas: 20
      gpu: "none (CPU sufficient)"
    - name: "cv-helper"
      model: "GPT-4 fine-tuned"
      replicas: 10
      gpu: "none"
    - name: "nlp-evaluator"
      model: "Llama-3-8B (self-hosted)"
      replicas: 50
      gpu: "1xL4 per replica"
  fallback: "If OpenAI latency >1s → switch to Llama-3-70B hosted"

prompt_management:
  storage: "PostgreSQL (versioned table)"
  schema: |
    id | name | version | template | variables | created_at
  runtime: "Loaded into Redis on startup"
  hot_reload: "POST /admin/prompts/reload"

ai_scoring_engine:
  diagram: |
    Kafka event → Feature-Store → Model-Service
    → Prediction → Explanation (SHAP)
    → Kafka result topic → PostgreSQL

nlp_evaluation_pipeline:
  steps:
    - "Transcription (Whisper-large-v3)"
    - "Embedding (all-mpnet-base-v2)"
    - "Rubric cosine similarity"
    - "Grammar check (LanguageTool)"
    - "Pii redaction (Presidio)"
  latency: "<800 ms per 250 words"

model_selection_rationale:
  openai: "Best in class, faster to market, 6-month runway"
  open_source: "Cost control, data privacy, fine-tune on health data"
  hybrid: "OpenAI for gen, open-source for eval/scoring"

# ================================================================================
# 5. MVP → SCALE ROADMAP
# ================================================================================

mvp_definition:
  features:
    - "Student registration + profile"
    - "Basic internship feed (no AI ranking)"
    - "Application upload + scoring (rule-based)"
    - "Employer dashboard (read-only)"
  exclusions:
    - "Video interviews, psychomotor tests, mentorship"
  timeline: "8 weeks from kick-off"

phases:
  - phase: 1
    name: "Strategic Launch (0-6 months)"
    milestones:
      - "M0: Kick-off"
      - "M1: MVP live (8 wks)"
      - "M2: AI scoring → ML model (12 wks)"
      - "M3: Mentorship routing (16 wks)"
      - "M4: Video interviews (20 wks)"
      - "M5: Multi-region (24 wks)"
    metrics:
      - "10k students, 500 employers, 40% placement rate"

  - phase: 2
    name: "Scale (6-18 months)"
    milestones:
      - "M6: Mobile apps (iOS/Android)"
      - "M7: Gamified assessments"
      - "M8: Institution dashboards"
      - "M9: 1M students, 5k employers"
    infrastructure: "Citus sharding, CDN expansion"

  - phase: 3
    name: "Global Distribution (18-36 months)"
    milestones:
      - "M10: Offline-first PWA"
      - "M11: 10M students, 50k employers"
      - "M12: Break-even ($1.98M/month)"
    tech: "Edge inference, federated learning"

# ================================================================================
# 6. DATA ARCHITECTURE
# ================================================================================

database_schema:
  stakeholders:
    - table: students
      columns:
        - id: uuid pk
        - email: citext unique
        - password_hash: text
        - profile_vector: vector(512)
        - created_at: timestamptz
    - table: employers
      columns:
        - id: uuid pk
        - name: text
        - tier: enum (WHO, UNICEF, ...)
        - api_key: uuid
    - table: mentors
      columns:
        - id: uuid pk
        - student_id: fkey
        - expertise_tags: text[]
        - timezone: text
        - rating: decimal(2,1)
    - table: institutions
      columns:
        - id: uuid pk
        - type: enum (uni, assoc, gov)
        - verified_domains: text[]

  internships:
    table: internships
    columns:
      - id: uuid pk
      - employer_id: fkey
      - metadata: jsonb (skills, region, paid, duration)
      - vector: vector(512)
      - active: boolean
      - expires_at: timestamptz

  assessments:
    table: assessments
    partition: "BY RANGE (created_at) monthly"
    columns:
      - id: uuid pk
      - student_id: fkey
      - stage: int (2-6)
      - answers: jsonb
      - scores: jsonb
      - pass: boolean
      - ai_explain: jsonb
      - created_at: timestamptz

  video:
    table: video_submissions
    columns:
      - id: uuid pk
      - assessment_id: fkey
      - object_path: text (s3)
      - transcription: text
      - ai_grade: jsonb
      - duration_sec: int

profile_vectors:
  generation: "SentenceTransformer (all-mpnet-base-v2) → 512 dim"
  storage: "PostgreSQL pgvector extension"
  update_trigger: "After profile edit → background job"

internship_metadata:
  schema: |
    {
      "skills": ["epi", "R", "STATA"],
      "languages": ["EN", "FR"],
      "regions": ["AFRO"],
      "paid": true,
      "duration_weeks": 12,
      "deadline": "2025-08-01"
    }

analytics_layer:
    - "ClickHouse cluster (3 shards, 2 replicas)"
    - "Materialized views: pageviews, conversions, funnel"
    - "Retention: 24 months, compressed after 30 days"

data_retention:
    assessments: "7 years (regulatory)"
    videos: "2 years or on delete request"
    analytics: "24 months"
    backups: "30 days (encrypted, object store)"

# ================================================================================
# 7. MICROSERVICES BREAKDOWN
# ================================================================================

services:
  - name: "identity-svc"
    language: "Go"
    api: "gRPC"
    db: "Spanner"
    responsibilities: "AuthN, OAuth, roles, API keys"

  - name: "student-svc"
    language: "Go"
    api: "gRPC"
    db: "PostgreSQL"
    responsibilities: "CRUD profile, vector generation job"

  - name: "internship-svc"
    language: "Go"
    api: "gRPC"
    db: "PostgreSQL"
    responsibilities: "CRUD internships, search, expiry"

  - name: "recommendation-svc"
    language: "Python"
    api: "HTTP (Ray)"
    db: "Redis/ClickHouse"
    responsibilities: "Feed generation, ranking, AB test"

  - name: "scoring-svc"
    language: "Python"
    api: "gRPC"
    db: "Feature-Store (Redis)"
    responsibilities: "ML inference, explanations"

  - name: "assessment-svc"
    language: "Go"
    api: "gRPC"
    db: "PostgreSQL"
    responsibilities: "Stage orchestration, timer, state machine"

  - name: "video-svc"
    language: "Node.js"
    api: "HTTP (TUS)"
    db: "PostgreSQL"
    responsibilities: "Upload, transcoding, WebRTC signaling"

  - name: "mentor-svc"
    language: "Go"
    api: "gRPC"
    db: "PostgreSQL"
    responsibilities: "Matching, calendar, chat"

  - name: "analytics-svc"
    language: "Go"
    api: "HTTP"
    db: "ClickHouse"
    responsibilities: "Events ingestion, aggregates"

  - name: "billing-svc"
    language: "Go"
    api: "gRPC"
    db: "PostgreSQL"
    responsibilities: "Stripe integration, usage, invoicing"

inter_service_communication:
    synchronous: "gRPC with protobuf"
    asynchronous: "Kafka (Confluent Cloud)"
    service_mesh: "Istio mTLS, rate-limit, retry"

event_driven:
    topics:
      - "student.sign-up"
      - "application.submitted"
      - "assessment.completed"
      - "mentor.matched"
      - "billing.charge"

service_discovery: "Kubernetes DNS + Consul (for external)"


# ================================================================================
# 8. MENTOR MATCHING ENGINE LOGIC
# ================================================================================

algorithm: "Weighted bipartite matching (Google OR-Tools)"
steps:
  1. "Build graph: student ↔ mentor edges"
  2. "Edge weight = ∑(w_i * normalized_score_i)"
  3. "Run max-flow min-cost"
  4. "Persist matches, send notifications"

specialization_tags:
  taxonomy: "O*NET + custom health tax"
  storage: "PostgreSQL array column"
  similarity: "Jaccard index for fallback"

availability_management:
  schema: "mentor_calendar (mentor_id, slot_start, slot_end, booked)"
  granularity: "30 min"
  timezone: "ICU library, stored as IANA string"

compatibility_scoring_formula: |
  score = 0.4*domain_match +
          0.3*(1−abs(tz_diff)/12) +
          0.2*lang_match +
          0.1*rating/5

# ================================================================================
# 9. EVALUATION PIPELINE LOGIC
# ================================================================================

adaptive_workflow:
  state_machine: |
    Initial ──► Stage2 ──► Stage3 ──► Stage4 ──► Stage5 ──► Stage6 ──► Done
               fail►CV           fail►CV      fail►CV      fail►CV

pass_fail_logic:
  stage2: "ML probability ≥ 0.65"
  stage3: "≥60% correct & no timeout"
  stage4: "NLP score ≥ 70"
  stage5: "Mentor accepts or CV improved"
  stage6: "AI video score ≥ 75"

psychomotor_delivery:
  strategy: "Canvas + WebGL for image drag-drop"
  timer: "JWT exp + server timestamp sync"
  lockdown: "No copy/paste, blur detection (visibilityChange)"

situational_analysis_generation:
  prompt: |
    "Given internship {title} at {org}, generate a 150-word scenario
     requiring ethical decision making; return JSON {scenario, rubric[]}"

video_interview_pipeline:
  steps:
    - "Employer records questions (WebRTC)"
    - "Signed URLs delivered to candidate"
    - "2-attempt limit, 2-min max per answer"
    - "Upload → transcription → grading"
    - "Results immutably stored (append-only)"

# ================================================================================
# 10. RECOMMENDATION ENGINE DESIGN
# ================================================================================

profile_vector_generation:
  steps:
    - "Concatenate: skills, languages, experience, education"
    - "SentenceTransformer → 512 dim"
    - "Store in pgvector"

internship_metadata_processing:
  embedding: "Same model as profile for compatibility"
  enrichment: "NER for skills, map to ESCO taxonomy"

behavioral_signals:
  collected: |
    clicks, dwell time, saves, applies, scroll depth
  store: "ClickHouse (user_id, item_id, action, ts)"

ranking_algorithm:
  formula: |
    score = 0.5 * cosine(profile, internship)
            + 0.3 * behavioral_score
            + 0.2 * recency_boost
  rerank: "XGBoost trained on accepts"

cold_start_solution:
  - "Onboarding quiz (10 questions)"
  - "Use program/university averages"
  - "Content-based fallback (skills overlap)"

personalization_logic:
  - "AB testing via GrowthBook"
  - "Multi-armed bandit for explore/exploit"
  - "Diversity constraint (≥20% new organizations)"

# ================================================================================
# 11. VIDEO ASSESSMENT ARCHITECTURE
# ================================================================================

video_processing_pipeline:
  upload: "TUS resumable → R2 bucket"
  notification: "Kafka → video-svc"
  steps:
    - "Validate (format, size ≤300 MB)"
    - "Transcode to 720p mp4 (FFmpeg + HW accel)"
    - "Extract audio → 16kHz wav"
    - "Whisper → transcription"
    - "Delete raw after 24h"

compression_strategy:
  codec: "H.264 (hardware)"
  bitrate: "1.2 Mbps 720p"
  audio: "128k AAC"

progress_tracking:
  mechanism: "Server-sent events to UI"
  storage: "Redis key TTL 1h"

failover_mechanisms:
  - "Multi-part upload to R2 + S3 (dual write)"
  - "If transcoding fails → retry on GPU node"
  - "Circuit breaker on Whisper → stub transcript"

ai_gradading_integration:
  speech: "WPM, filler word ratio"
  content: "BERTScore vs model answer"
  presence: "Eye contact % (MediaPipe face mesh)"

timed_question_delivery:
  timer_sync: "NTP + server timestamp in JWT"
  grace: "±2s tolerance"
  auto_submit: "on duration end"

# ================================================================================
# 12. GOVERNANCE & AUDIT LAYER
# ================================================================================

ai_scoring_audit_dashboard:
  tech: "Metabase + ClickHouse"
  views:
    - "Score distribution by gender, region"
    - "Model drift (KS statistic)"
    - "Appeals & overrides"
  access: "Compliance team (RBAC)"

candidate_scoring_transparency:
  provided: "SHAP explanation JSON"
  endpoint: "GET /v1/assessments/{id}/explain"
  ui: "Visual bar chart in student portal"

audit_log_infrastructure:
  storage: "Loki (S3 backend, 7 years)"
  schema: |
    {trace_id, user_id, action, old_state, new_state, diff, ts}
  integrity: "Signed with AWS KMS (AES-256)"

compliance_considerations:
  gdpr: "Right to erasure, data portability"
  hipaa: "Encryption in transit & at rest"
  equal_opportunity: "Bias testing quarterly"
  soc2: "Type II scheduled 12 months"

security_architecture:
  zero_trust: "mTLS everywhere"
  secrets: "Google Secret Manager + rotation"
  sast: "Semgrep on every PR"
  dast: "Zap baseline weekly"
  dependencies: "Dependabot auto-merge patches"

bias_monitoring:
  metrics:
    - "False-negative rate by country"
    - "Mean score by gender"
    - "Language detection vs score"
  alerts: "PagerDuty if Δ >5%"
  remediation: "Retrain, re-weight, or augment data"
```

---

**Token Usage:** {'prompt_tokens': 1530, 'completion_tokens': 5358, 'total_tokens': 6888, 'cached_tokens': 1530, 'prompt_tokens_details': {'cached_tokens': 1530}}
