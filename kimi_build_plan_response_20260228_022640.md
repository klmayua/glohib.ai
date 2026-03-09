# GLOHIB.AI - KIMI K2 BUILD PLAN RESPONSE

**Generated:** 2026-02-28 02:26:40

---

```yaml
# ================================================================================
# GLOHIB.AI – COMPLETE SYSTEM BUILD PLAN
# Chief Architect: Kimi K2
# ================================================================================

# ================================================================================
# 1. FULL PRODUCT ARCHITECTURE
# ================================================================================
product_architecture:
  system_diagram: |
    ┌──────────────────────────────┐
    │        Client Layer          │
    │  Web (Next.js)  Mobile (RN)  │
    └────────────┬─────────────────┘
                 │ (GraphQL/REST)
    ┌────────────▼─────────────────┐
    │     API Gateway (Kong)       │
    │  AuthN/Z • Rate-limit • CDN  │
    └────────────┬─────────────────┘
                 │ (Kafka events)
    ┌────────────▼─────────────────┐
    │   Micro-services Mesh        │
    │  Svc-Discovery (Consul)      │
    └────────────┬─────────────────┘
                 │ (gRPC)
    ┌────────────▼─────────────────┐
    │        AI Mesh               │
    │  Model-Svc • Prompt-Svc      │
    └────────────┬─────────────────┘
                 │ (DB drivers)
    ┌────────────▼─────────────────┐
    │      Data Layer              │
    │  Postgres • Redis • S3       │
    └──────────────────────────────┘

  boundaries:
    frontend:
      - Web SPA (Next.js + TypeScript)
      - Mobile (React-Native + Expo)
      - Shared design-system (Storybook)
    backend:
      - API-Gateway (Kong + Lua plugins)
      - BFF (Backend-for-Frontend) pattern
      - Stateless services (Go/Kotlin)
    ai_services:
      - Model-inference containers (Triton)
      - Prompt-template service (Python)
      - Feature-store (Redis + Parquet)

  technology_stack:
    languages:
      - Go: latency-sensitive services
      - Kotlin: domain services
      - Python: AI/ML services
      - TypeScript: frontend
    datastores:
      - Postgres 15: ACID data
      - Redis Cluster: cache + vectors
      - OpenSearch: full-text search
      - MinIO (S3): object storage
    streaming:
      - Kafka: event bus
      - gRPC: service mesh
    observability:
      - Prometheus + Loki
      - Grafana dashboards
      - Jaeger tracing
      - Datadog RUM (frontend)

  justification:
    latency: "Go gRPC P99 < 40 ms"
    scale: "Kafka 1 M msg/s per partition"
    cost: "Open-source first, pay-as-you-go for video"
    bias: "Explainable AI via SHAP + audit logs"

# ================================================================================
# 2. SYSTEM DESIGN – 7 WORKFLOW STAGES
# ================================================================================
workflow_design:
  stage_1_internship_feed:
    trigger: user login
    steps:
      - Fetch profile vector (Redis)
      - Query recommendation engine (gRPC)
      - Rank with behavioral signals (Kafka)
      - Return paginated list (GraphQL)
    data_flow: |
      FE → API-GW → Recommendation-Svc → Rank-Svc → Postgres → FE
    api:
      - POST /v1/recommendations
      - SSE /v1/feed/stream

  stage_2_application_scoring:
    trigger: apply button
    steps:
      - Ingest CV PDF (S3 presigned)
      - Parse (Apache Tika)
      - Feature extraction (Python)
      - Model inference (Triton ONNX)
      - Store score (Postgres)
    data_flow: |
      FE → CV-Svc → Parser-Svc → Feature-Svc → Model-Svc → DB
    api:
      - POST /v1/applications
      - GET /v1/applications/{id}/score

  stage_3_psychomotor_tests:
    trigger: score > threshold
    steps:
      - Fetch adaptive template (Prompt-Svc)
      - Generate questions (LLM)
      - Deliver via WebRTC (low-latency)
      - Capture timing (Redis stream)
    data_flow: |
      FE → Test-Svc → Prompt-Svc → LLM → Redis → FE
    api:
      - GET /v1/tests/{id}
      - WS /v1/tests/{id}/submit

  stage_4_situational_analysis:
    trigger: psychomotor pass
    steps:
      - Present scenario (Markdown)
      - Candidate types answer
      - NLP grading (transformer)
      - Store embeddings (OpenSearch)
    data_flow: |
      FE → Analysis-Svc → NLP-Svc → OpenSearch → DB
    api:
      - POST /v1/analysis
      - GET /v1/analysis/{id}/feedback

  stage_5_routing:
    trigger: analysis score
    logic: |
      if score >= 0.75 → mentorship queue
      else → cv-help queue
    services:
      - Rule-engine (Kogito)
      - Notification-Svc (Twilio)
    api:
      - POST /v1/router
      - GET /v1/queues/status

  stage_6_video_interview:
    trigger: mentor approval
    steps:
      - Schedule (Cal.com API)
      - Generate timed questions (LLM)
      - Record (Mux)
      - AI grade (speech-to-text + content)
    data_flow: |
      FE → Video-Svc → Mux → AI-Svc → DB
    api:
      - POST /v1/interviews
      - GET /v1/interviews/{id}/report

  stage_7_employer_handoff:
    trigger: interview complete
    steps:
      - Compile candidate dossier
      - Create read-only dashboard link
      - Send webhook to employer ATS
    api:
      - GET /v1/dossiers/{id}
      - POST /v1/webhooks/employers

# ================================================================================
# 3. INFRASTRUCTURE DESIGN
# ================================================================================
infrastructure:
  cloud_provider: "AWS (primary) + GCP (DR)"
  regions:
    primary:
      - af-south-1 (Cape Town) – Africa
      - ap-south-1 (Mumbai) – Asia
      - us-east-1 (N. Virginia) – Americas
    dr:
      - eu-central-1 (Frankfurt)
  compute:
    eks:
      node_groups:
        - general: t4g.large spot
        - ai: g5.xlarge on-demand
        - video: inf2.xlarge (Inferentia)
    lambda:
      - edge auth
      - thumbnail generation
  networking:
    vpc:
      cidr: 10.0.0.0/8
      private_subnets: /20 each AZ
      nat_gateway: 1 per AZ (cost optimized)
    cdn:
      provider: CloudFront
      behaviors:
        - /api/* → origin-req-timeout 5s
        - /video/* → cache 1h
    load_balancing:
      - ALB (L7) → API-GW
      - NLB (L4) → gRPC
      - Global Accelerator → nearest region
  storage:
    s3:
      buckets:
        - cv-uploads (lifecycle 90d → Glacier)
        - video-recordings (encrypted SSE-KMS)
    efs:
      for: shared model weights
  cost_estimate_monthly:
    compute: "$18k"
    storage: "$4k"
    streaming: "$7k"
    cdn: "$3k"
    total: "$32k (supports 1M MAU)"

# ================================================================================
# 4. AI ORCHESTRATION MODEL
# ================================================================================
ai_orchestration:
  model_selection:
    primary: "Anthropic Claude-3.5-Sonnet (via Bedrock)"
    fallback: "Meta Llama-3-70b (self-hosted)"
    reasoning: "IP waiver for health data, lower bias"
  prompt_management:
    repo: "Github → ArgoCD → K8s configmap"
    versioning: "Semantic + SHA"
    runtime: "Jinja2 templates"
    example:
      psychomotor: |
        Generate 5 timed multiple-choice questions
        Domain: {{ domain }}
        Difficulty: {{ adaptive_level }}
        Language: {{ user_lang }}
        Max words: 20 per option
  scoring_engine:
    architecture: "Ensemble (MLP + XGBoost + LR)"
    features: 127
    latency: 180 ms P99
    drift_detection: "Kolmogorov-Smirnov daily"
  nlp_evaluation:
    pipeline:
      - ASR: Whisper-large-v3
      - Embedding: all-MiniLM-L6-v2
      - Grading: DeBERTa-finetuned
    metrics:
      - BLEU ≥ 0.7
      - Factual-hallucination < 5%
  bias_monitoring:
    dashboard: Grafana
    slice_on: [gender, nationality, university-tier]
    alert_threshold: "demographic-parity diff > 0.1"

# ================================================================================
# 5. MVP → SCALE ROADMAP
# ================================================================================
roadmap:
  mvp_features:
    - User registration (students only)
    - CV upload + basic scoring
    - 50 seeded internships
    - Simple recommendation list
    - Mentor chat (async)
    - Employer dashboard (read-only)
  phase_1_strategic_launch_0_6_months:
    goals: "10k users, 500 internships, $50k MRR"
    teams: "2 squads (6 devs + 2 ML + 1 QA)"
    deliverables:
      - Refactor monolith → 5 microservices
      - Claude integration
      - Mux video POC
      - OAuth (Google, LinkedIn)
      - Payment (Stripe)
  phase_2_scale_6_18_months:
    goals: "1M users, 25k internships, $1M MRR"
    teams: "5 squads, 40 people"
    deliverables:
      - Multi-region
      - Mobile apps
      - Gamified tests
      - Institution portal
      - Advanced analytics
  phase_3_global_distribution:
    goals: "10M users, 200k internships, $23.76M ARR"
    teams: "10 squads, 120 people"
    deliverables:
      - Offline-first mobile
      - Edge AI inference
      - Blockchain credential verify
      - Government integrations
  milestones:
    - M0: MVP live (month 3)
    - M1: 1k paying users (month 6)
    - M2: 100k users (month 12)
    - M3: 1M users (month 18)
    - M4: Break-even (month 24)

# ================================================================================
# 6. DATA ARCHITECTURE
# ================================================================================
data_architecture:
  stakeholders:
    students:
      - id (UUID PK)
      - email (encrypted)
      - profile_vector (768-float array)
      - cv_pdf_url (S3)
      - created_at, updated_at
    employers:
      - id (UUID PK)
      - domain (enum)
      - tier (enum)
      - api_key_hash
    mentors:
      - id (UUID PK)
      - specializations (text[])
      - rating (0-5)
      - timezone
    institutions:
      - id (UUID PK)
      - type (uni, gov, assoc)
      - accreditation_id
  internship_metadata:
    - id (UUID PK)
    - title
    - description_vec (vector 768)
    - location (postGIS)
    - deadline
    - salary_usd (int4range)
    - required_skills (text[])
    - employer_id (FK)
  assessment_data:
    - attempt_id (UUID PK)
    - stage (1-7)
    - scores (JSONB)
    - video_url (S3 presigned)
    - ai_explain (JSONB)
    - created_at
  analytics_layer:
    - Kafka → ClickHouse
    - dbt models
    - Superset dashboards
  retention_policy:
    - CV PDF: 2 years
    - Video: 1 year
    - Scores: 7 years
    - PII: soft-delete + hard-delete after 30d

# ================================================================================
# 7. MICROSERVICES BREAKDOWN
# ================================================================================
microservices:
  user-svc:
    api:
      - POST /v1/users
      - GET /v1/users/{id}
    db: users (postgres)
    events: user.created
  cv-svc:
    api:
      - POST /v1/cvs
      - GET /v1/cvs/{id}/download
    s3: cv-uploads
  recommendation-svc:
    api:
      - POST /v1/recommendations
    cache: Redis vector
    algo: ANN (HNSW)
  scoring-svc:
    api:
      - POST /v1/scores
      - GET /v1/scores/{id}
    model: ONNX
  test-svc:
    api:
      - GET /v1/tests/{id}
      - WS /v1/tests/{id}/submit
    cache: Redis
  video-svc:
    api:
      - POST /v1/videos
      - GET /v1/videos/{id}/status
    provider: Mux
  mentor-svc:
    api:
      - POST /v1/mentorships
      - GET /v1/mentors/available
  employer-svc:
    api:
      - GET /v1/dossiers/{id}
      - POST /v1/webhooks
  communication:
    type: "event-driven (Kafka)"
    topics:
      - user.created
      - application.scored
      - video.graded
  service_discovery: "Consul DNS"

# ================================================================================
# 8. MENTOR MATCHING ENGINE LOGIC
# ================================================================================
mentor_matching:
  weighted_scoring_formula: |
    total = 0.4*skill_overlap + 0.3*timezone_overlap + 0.2*language_match + 0.1*rating
  skill_overlap:
    input: student_goal_tags ∩ mentor_specializations
    algo: Jaccard index
  timezone_overlap:
    input: working_hours overlap (UTC)
    score: overlap / 8h
  language_match:
    exact: 1.0
    fluent: 0.8
    basic: 0.5
  availability_management:
    store: Postgres (tstzrange)
    api: Cal.com webhooks
  candidate_rank:
    return top-5 mentors, refresh daily

# ================================================================================
# 9. EVALUATION PIPELINE LOGIC
# ================================================================================
evaluation_pipeline:
  adaptive_rules:
    - if score < 0.5 → terminate
    - if 0.5 ≤ score < 0.65 → lower difficulty + retry
    - if score ≥ 0.65 → next stage
  psychomotor_delivery:
    tech: WebRTC (peer.js)
    timers: Server-side (Redis TTL)
    snapshots: every 500 ms
  situational_analysis:
    generator:
      prompt: |
        Create a 3-sentence global-health scenario for {{role}}
        requiring ethical decision making.
    grading:
      - relevance (vs ideal answer embedding)
      - completeness (checklist hit@5)
      - clarity (Flesch score)
  video_interview:
    timing:
      - prep: 30s
      - answer: 120s
      - next: auto
    ai_grading:
      - speech_clarity: WER < 0.2
      - content: cosine ≥ 0.75
      - presence: eye-contact %

# ================================================================================
# 10. RECOMMENDATION ENGINE DESIGN
# ================================================================================
recommendation_engine:
  profile_vector_generation:
    sources:
      - cv skills (TF-IDF)
      - behavioral signals (clickstream)
      - explicit preferences (form)
    dimension: 768
    model: SentenceTransformer (all-MiniLM-L6-v2)
  internship_metadata_processing:
    pipeline:
      - text cleaning
      - skill extraction (spaCy NER)
      - embedding (same model)
  ranking_algorithm:
    score = 0.5*cosine(u_vec, i_vec) + 0.3*deadline_urgency + 0.2*employer_tier
  cold_start:
    fallback: popularity + location
    exploration: ε-greedy ε=0.15
  personalization:
    real-time: Redis cache
    batch: nightly Spark job
    feedback loop: click + apply + bookmark

# ================================================================================
# 11. VIDEO ASSESSMENT ARCHITECTURE
# ================================================================================
video_assessment:
  pipeline:
    1. upload: presigned POST Mux
    2. transcode: Mux mp4 720p
    3. webhook: "video.ready" → Kafka
    4. ai_jobs:
        - speech-to-text (Whisper API)
        - embedding (text)
        - grading (DeBERTa)
    5. store: results to Postgres + S3
  compression:
    codec: H.264
    bitrate: 1.2 Mbps
    size: ~15 MB per 2-min video
  progress_tracking:
    client: WebSocket
    server: Redis hash
  failover:
    primary: Mux
    fallback: Cloudflare Stream
  timed_questions:
    delivery: Server-sent time-sync
    tolerance: ±2s NTP
  ai_grading_integration:
    speech:
      endpoint: internal/whisper
      latency: 2s per min
    content:
      model: DeBERTa-v3-base finetuned
      auc: 0.87

# ================================================================================
# 12. GOVERNANCE & AUDIT LAYER
# ================================================================================
governance:
  ai_scoring_audit_dashboard:
    url: https://audit.glohib.ai
    auth: SAML SSO (Okta)
    features:
      - score explainer (SHAP)
      - demographic slice compare
      - model drift chart
      - export (CSV, PDF)
  candidate_scoring_transparency:
    api: GET /v1/scores/{id}/explain
    payload: |
      {
        "final_score": 0.82,
        "components": {
          "cv_match": 0.85,
          "test": 0.80,
          "video": 0.81
        },
        "bias_report": { ... }
      }
  audit_log_infrastructure:
    store: OpenSearch (immutable)
    retention: 7 years
    fields: user_id, action, before, after, model_version
  compliance:
    gdpr:
      - DPO appointed
      - Data-processing-agreements
      - Right-to-be-forgotten workflow
    hippaa:
      - Encryption in transit (TLS1.3)
      - Encryption at rest (AES-256)
      - BAAs with vendors
  security_architecture:
    sdlc: "shift-left (SAST/DAST)"
    secrets: "AWS Secrets Manager + KMS"
    waf: "CloudFront + OWASP rules"
    ddos: "AWS Shield Advanced"
  bias_monitoring:
    metric: demographic parity
    threshold: 0.1
    action: "retrain + human review"

# ================================================================================
# COST SUMMARY (MONTHLY AT SCALE)
# ================================================================================
cost_summary:
  infrastructure: "$32k"
  ai_endpoints: "$14k"
  video_platform: "$8k"
  observability: "$3k"
  total: "$57k → 2.9% of $1.98M MRR"

# ================================================================================
# EPILOGUE
# ================================================================================
# This document is the authoritative build plan for Glohib.ai.
# All teams derive sprints & OKRs from the sections above.
# Revisions require RFC approval by CTO & CPO.
```

---

**Token Usage:** {'prompt_tokens': 1530, 'completion_tokens': 4290, 'total_tokens': 5820}
