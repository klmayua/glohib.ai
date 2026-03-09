# GLOHIB.AI - STEP 3: DOCKER & LOCAL DEV ENVIRONMENT
**Generated:** 2026-02-28 03:05:15

---

```yaml
step_metadata:
  id: glohib-ai-step-3
  name: Docker & Local Development Environment
  phase: setup
  priority: 1
  estimate: 2h
  depends_on: []

context:
  project_name: glohib-ai
  architecture: microservices
  services:
    - postgresql
    - redis
    - minio
    - go-services
    - python-ai-services
    - node-video-service

tasks:

# 1. Root Dockerfile
- id: create-root-dockerfile
  name: Create multi-stage root Dockerfile
  action: create_file
  file_path: Dockerfile
  content: |
    # syntax=docker/dockerfile:1
    # Glohib.ai - Multi-stage Root Dockerfile
    # Supports Go, Python, and Node.js services in one buildable image

    ##############################################################################
    # Base stage with common tools
    ##############################################################################
    FROM debian:bookworm-slim AS base
    RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates curl gnupg lsb-release \
        && rm -rf /var/lib/apt/lists/*

    ##############################################################################
    # Go builder stage
    ##############################################################################
    FROM golang:1.22-bookworm AS go-builder
    WORKDIR /build
    COPY services/go ./services/go
    RUN go mod download -C services/go/api-gateway
    RUN go mod download -C services/go/auth-service
    RUN go mod download -C services/go/user-service
    RUN CGO_ENABLED=0 GOOS=linux \
        go build -ldflags="-s -w" -o bin/api-gateway ./services/go/api-gateway/cmd
    RUN CGO_ENABLED=0 GOOS=linux \
        go build -ldflags="-s -w" -o bin/auth-service ./services/go/auth-service/cmd
    RUN CGO_ENABLED=0 GOOS=linux \
        go build -ldflags="-s -w" -o bin/user-service ./services/go/user-service/cmd

    ##############################################################################
    # Python AI stage
    ##############################################################################
    FROM python:3.11-slim AS python-builder
    RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential git \
        && rm -rf /var/lib/apt/lists/*
    WORKDIR /app
    COPY services/python/requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY services/python ./services/python

    ##############################################################################
    # Node video stage
    ##############################################################################
    FROM node:20-bookworm-slim AS node-builder
    WORKDIR /app
    COPY services/node/video-service/package*.json ./services/node/video-service/
    RUN cd services/node/video-service && npm ci --omit=dev
    COPY services/node ./services/node
    RUN cd services/node/video-service && npm run build

    ##############################################################################
    # Final minimal runtime image
    ##############################################################################
    FROM debian:bookworm-slim AS runtime
    RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates curl ffmpeg \
        && rm -rf /var/lib/apt/lists/*

    # Copy Go binaries
    COPY --from=go-builder /build/bin/* /usr/local/bin/

    # Copy Python
    COPY --from=python-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
    COPY --from=python-builder /app/services/python /app/services/python
    ENV PYTHONPATH=/app/services/python

    # Copy Node
    COPY --from=node-builder /app/services/node /app/services/node

    # Health check script
    COPY docker/health_check.sh /usr/local/bin/
    RUN chmod +x /usr/local/bin/health_check.sh

    WORKDIR /app
    CMD ["echo", "Glohib.ai runtime ready. Override CMD per service."]

# 2. Docker Compose Configuration
- id: create-docker-compose
  name: Create docker-compose.yml
  action: create_file
  file_path: docker-compose.yml
  content: |
    version: "3.9"

    x-common-variables: &common-variables
      POSTGRES_USER: ${POSTGRES_USER:-glohib}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
      POSTGRES_DB: ${POSTGRES_DB:-glohib_db}
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      REDIS_URL: redis://redis:6379
      MINIO_ENDPOINT: minio:9000
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
      MINIO_BUCKET: ${MINIO_BUCKET:-glohib}

    services:
      postgres:
        image: pgvector/pgvector:pg16
        container_name: glohib-postgres
        restart: unless-stopped
        environment:
          <<: *common-variables
        volumes:
          - postgres_data:/var/lib/postgresql/data
          - ./docker/init_postgres.sql:/docker-entrypoint-initdb.d/init_postgres.sql:ro
        ports:
          - "${POSTGRES_PORT:-5432}:5432"
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-glohib}"]
          interval: 10s
          timeout: 5s
          retries: 5
        networks:
          - glohib-net

      redis:
        image: redis:7-alpine
        container_name: glohib-redis
        restart: unless-stopped
        command: redis-server --save 60 1 --loglevel warning
        volumes:
          - redis_data:/data
        ports:
          - "${REDIS_PORT:-6379}:6379"
        healthcheck:
          test: ["CMD", "redis-cli", "ping"]
          interval: 10s
          timeout: 3s
          retries: 5
        networks:
          - glohib-net

      minio:
        image: minio/minio:latest
        container_name: glohib-minio
        restart: unless-stopped
        environment:
          MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
          MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
        volumes:
          - minio_data:/data
        ports:
          - "${MINIO_PORT:-9000}:9000"
          - "${MINIO_CONSOLE_PORT:-9001}:9001"
        command: server /data --console-address ":9001"
        healthcheck:
          test: ["CMD", "mc", "ready", "local"]
          interval: 10s
          timeout: 5s
          retries: 5
        networks:
          - glohib-net

      # Placeholder API Gateway (Go)
      api-gateway:
        build:
          context: .
          target: go-builder
        container_name: glohib-api-gateway
        restart: unless-stopped
        environment:
          <<: *common-variables
          SERVICE_NAME: api-gateway
        command: ["/usr/local/bin/api-gateway"]
        depends_on:
          postgres:
            condition: service_healthy
          redis:
            condition: service_healthy
        ports:
          - "${API_GATEWAY_PORT:-8080}:8080"
        healthcheck:
          test: ["CMD", "/usr/local/bin/health_check.sh", "http://localhost:8080/health"]
          interval: 15s
          timeout: 5s
          retries: 5
        networks:
          - glohib-net

      # Placeholder Auth Service (Go)
      auth-service:
        build:
          context: .
          target: go-builder
        container_name: glohib-auth-service
        restart: unless-stopped
        environment:
          <<: *common-variables
          SERVICE_NAME: auth-service
          JWT_SECRET: ${JWT_SECRET:-super-secret-change-me}
        command: ["/usr/local/bin/auth-service"]
        depends_on:
          postgres:
            condition: service_healthy
          redis:
            condition: service_healthy
        ports:
          - "${AUTH_SERVICE_PORT:-8081}:8081"
        healthcheck:
          test: ["CMD", "/usr/local/bin/health_check.sh", "http://localhost:8081/health"]
          interval: 15s
          timeout: 5s
          retries: 5
        networks:
          - glohib-net

      # Placeholder User Service (Go)
      user-service:
        build:
          context: .
          target: go-builder
        container_name: glohib-user-service
        restart: unless-stopped
        environment:
          <<: *common-variables
          SERVICE_NAME: user-service
        command: ["/usr/local/bin/user-service"]
        depends_on:
          postgres:
            condition: service_healthy
          redis:
            condition: service_healthy
        ports:
          - "${USER_SERVICE_PORT:-8082}:8082"
        healthcheck:
          test: ["CMD", "/usr/local/bin/health_check.sh", "http://localhost:8082/health"]
          interval: 15s
          timeout: 5s
          retries: 5
        networks:
          - glohib-net

      # Placeholder AI Service (Python)
      ai-service:
        build:
          context: .
          target: python-builder
        container_name: glohib-ai-service
        restart: unless-stopped
        environment:
          <<: *common-variables
          SERVICE_NAME: ai-service
          OPENAI_API_KEY: ${OPENAI_API_KEY:-}
          HUGGINGFACE_TOKEN: ${HUGGINGFACE_TOKEN:-}
        command: ["python", "-m", "uvicorn", "services.python.ai_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
        depends_on:
          postgres:
            condition: service_healthy
          redis:
            condition: service_healthy
          minio:
            condition: service_healthy
        ports:
          - "${AI_SERVICE_PORT:-8000}:8000"
        healthcheck:
          test: ["CMD", "/usr/local/bin/health_check.sh", "http://localhost:8000/health"]
          interval: 15s
          timeout: 5s
          retries: 5
        networks:
          - glohib-net

      # Placeholder Video Service (Node)
      video-service:
        build:
          context: .
          target: node-builder
        container_name: glohib-video-service
        restart: unless-stopped
        environment:
          <<: *common-variables
          SERVICE_NAME: video-service
        command: ["node", "services/node/video-service/dist/index.js"]
        depends_on:
          postgres:
            condition: service_healthy
          redis:
            condition: service_healthy
          minio:
            condition: service_healthy
        ports:
          - "${VIDEO_SERVICE_PORT:-3000}:3000"
        healthcheck:
          test: ["CMD", "/usr/local/bin/health_check.sh", "http://localhost:3000/health"]
          interval: 15s
          timeout: 5s
          retries: 5
        networks:
          - glohib-net

    volumes:
      postgres_data:
      redis_data:
      minio_data:

    networks:
      glohib-net:
        driver: bridge

# 3. docker-compose.override.yml.example
- id: create-docker-compose-override-example
  name: Create docker-compose.override.yml.example
  action: create_file
  file_path: docker-compose.override.yml.example
  content: |
    # Local overrides for development
    # Copy to docker-compose.override.yml and customize
    version: "3.9"
    services:
      postgres:
        ports:
          - "5433:5432"  # Use different port to avoid conflicts

      redis:
        ports:
          - "6380:6379"

      minio:
        ports:
          - "9002:9000"
          - "9003:9001"

      api-gateway:
        volumes:
          - ./services/go/api-gateway:/app/services/go/api-gateway:ro
        environment:
          LOG_LEVEL: debug
        ports:
          - "8080:8080"

      auth-service:
        volumes:
          - ./services/go/auth-service:/app/services/go/auth-service:ro
        environment:
          LOG_LEVEL: debug
        ports:
          - "8081:8081"

      user-service:
        volumes:
          - ./services/go/user-service:/app/services/go/user-service:ro
        environment:
          LOG_LEVEL: debug
        ports:
          - "8082:8082"

      ai-service:
        volumes:
          - ./services/python:/app/services/python:ro
        environment:
          LOG_LEVEL: debug
          PYTHONPATH: /app/services/python
        ports:
          - "8000:8000"

      video-service:
        volumes:
          - ./services/node/video-service:/app/services/node/video-service:ro
        environment:
          NODE_ENV: development
        ports:
          - "3000:3000"

# 4. .env.docker template
- id: create-env-docker-template
  name: Create .env.docker template
  action: create_file
  file_path: .env.docker
  content: |
    # Glohib.ai - Docker Environment Variables
    # Copy to .env and customize

    # PostgreSQL
    POSTGRES_USER=glohib
    POSTGRES_PASSWORD=changeme
    POSTGRES_DB=glohib_db
    POSTGRES_PORT=5432

    # Redis
    REDIS_PORT=6379

    # MinIO
    MINIO_ROOT_USER=minioadmin
    MINIO_ROOT_PASSWORD=minioadmin
    MINIO_BUCKET=glohib
    MINIO_PORT=9000
    MINIO_CONSOLE_PORT=9001

    # Service Ports
    API_GATEWAY_PORT=8080
    AUTH_SERVICE_PORT=8081
    USER_SERVICE_PORT=8082
    AI_SERVICE_PORT=8000
    VIDEO_SERVICE_PORT=3000

    # Secrets (change in production!)
    JWT_SECRET=super-secret-change-me
    OPENAI_API_KEY=
    HUGGINGFACE_TOKEN=

# 5. Docker initialization scripts
- id: create-init-postgres-sql
  name: Create PostgreSQL initialization script
  action: create_file
  file_path: docker/init_postgres.sql
  content: |
    -- Glohib.ai - PostgreSQL initialization
    CREATE EXTENSION IF NOT EXISTS vector;

    -- Create schemas
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE SCHEMA IF NOT EXISTS users;
    CREATE SCHEMA IF NOT EXISTS ai;
    CREATE SCHEMA IF NOT EXISTS video;

    -- Create roles
    CREATE ROLE glohib_app WITH LOGIN PASSWORD 'changeme';
    GRANT ALL PRIVILEGES ON DATABASE glohib_db TO glohib_app;
    GRANT ALL ON SCHEMA auth TO glohib_app;
    GRANT ALL ON SCHEMA users TO glohib_app;
    GRANT ALL ON SCHEMA ai TO glohib_app;
    GRANT ALL ON SCHEMA video TO glohib_app;

- id: create-init-minio-sh
  name: Create MinIO initialization script
  action: create_file
  file_path: docker/init_minio.sh
  content: |
    #!/bin/sh
    # Glohib.ai - MinIO initialization
    set -e

    mc alias set local http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

    # Create buckets
    for BUCKET in glohib glohib-uploads glohib-processed; do
      mc mb --ignore-existing local/${BUCKET}
      mc anonymous set download local/${BUCKET}
    done

    echo "MinIO buckets created."

- id: create-health-check-sh
  name: Create health check script
  action: create_file
  file_path: docker/health_check.sh
  content: |
    #!/bin/sh
    # Simple HTTP health check
    URL=$1
    if [ -z "$URL" ]; then
      echo "Usage: health_check.sh <url>"
      exit 1
    fi
    curl -f -s -o /dev/null "$URL" || exit 1

# 6. Makefile for Docker operations
- id: create-makefile
  name: Create Makefile for Docker operations
  action: create_file
  file_path: Makefile
  content: |
    .PHONY: help docker-up docker-down docker-logs docker-rebuild docker-clean docker-init

    help: ## Show this help
    	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

    docker-up: ## Start all services
    	@echo "Starting Glohib.ai services..."
    	docker compose up -d

    docker-down: ## Stop all services
    	@echo "Stopping Glohib.ai services..."
    	docker compose down

    docker-logs: ## Tail logs for all services
    	docker compose logs -f

    docker-rebuild: ## Rebuild and restart all services
    	@echo "Rebuilding Glohib.ai services..."
    	docker compose down
    	docker compose build --no-cache
    	docker compose up -d

    docker-clean: ## Remove all containers, volumes, networks
    	@echo "Cleaning up Docker resources..."
    	docker compose down -v --remove-orphans
    	docker system prune -f

    docker-init: ## Initialize MinIO buckets and other setup
    	@echo "Initializing MinIO..."
    	docker compose exec minio sh /docker/init_minio.sh

    docker-shell-postgres: ## Open psql shell
    	docker compose exec postgres psql -U glohib -d glohib_db

    docker-shell-redis: ## Open redis-cli
    	docker compose exec redis redis-cli

    docker-shell-minio: ## Open MinIO mc shell
    	docker compose exec minio sh

# 7. Shell scripts for convenience
- id: create-docker-up-sh
  name: Create docker-up.sh script
  action: create_file
  file_path: scripts/docker-up.sh
  content: |
    #!/bin/bash
    set -euo pipefail
    echo "🚀 Starting Glohib.ai development environment..."
    docker compose up -d
    echo "⏳ Waiting for services to be healthy..."
    sleep 10
    docker compose exec minio sh /docker/init_minio.sh || true
    echo "✅ Glohib.ai is ready!"
    echo "🌐 API Gateway: http://localhost:8080"
    echo "🗃️  MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"

- id: create-docker-down-sh
  name: Create docker-down.sh script
  action: create_file
  file_path: scripts/docker-down.sh
  content: |
    #!/bin/bash
    set -euo pipefail
    echo "🛑 Stopping Glohib.ai development environment..."
    docker compose down
    echo "✅ Stopped."

- id: create-docker-logs-sh
  name: Create docker-logs.sh script
  action: create_file
  file_path: scripts/docker-logs.sh
  content: |
    #!/bin/bash
    set -euo pipefail
    docker compose logs -f "$@"

- id: create-docker-rebuild-sh
  name: Create docker-rebuild.sh script
  action: create_file
  file_path: scripts/docker-rebuild.sh
  content: |
    #!/bin/bash
    set -euo pipefail
    echo "🔨 Rebuilding Glohib.ai services..."
    docker compose down
    docker compose build --no-cache
    docker compose up -d
    echo "✅ Rebuild complete."

- id: create-docker-clean-sh
  name: Create docker-clean.sh script
  action: create_file
  file_path: scripts/docker-clean.sh
  content: |
    #!/bin/bash
    set -euo pipefail
    echo "🧹 Cleaning Docker resources..."
    docker compose down -v --remove-orphans
    docker system prune -f
    echo "✅ Cleaned."

# 8. Make scripts executable
- id: chmod-scripts
  name: Make scripts executable
  action: shell_command
  command: |
    chmod +x scripts/*.sh
    chmod +x docker/*.sh

deliverables:
  - Dockerfile (multi-stage build)
  - docker-compose.yml (complete services)
  - docker-compose.override.yml.example (local customization)
  - .env.docker (environment template)
  - docker/init_postgres.sql
  - docker/init_minio.sh
  - docker/health_check.sh
  - Makefile (convenience commands)
  - scripts/docker-up.sh
  - scripts/docker-down.sh
  - scripts/docker-logs.sh
  - scripts/docker-rebuild.sh
  - scripts/docker-clean.sh

verification_checklist:
  - All Docker images build successfully
  - PostgreSQL starts with pgvector extension
  - Redis accepts connections
  - MinIO creates buckets on init
  - All services pass health checks
  - Services can communicate over glohib-net
  - Volumes persist data across restarts
  - Scripts run without errors

execution_commands:
  - cp .env.docker .env
  - docker compose build
  - ./scripts/docker-up.sh
  - docker compose ps
  - curl http://localhost:8080/health

next_step: glohib-ai-step-4
```

---

**Token Usage:** {'prompt_tokens': 440, 'completion_tokens': 4629, 'total_tokens': 5069}
