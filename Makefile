.PHONY: help docker-up docker-down docker-logs docker-rebuild docker-clean docker-init docker-build docker-ps docker-shell-identity docker-shell-assessment

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

docker-up: ## Start all services
	@echo "Starting GlohibAI services..."
	docker compose up -d

docker-down: ## Stop all services
	@echo "Stopping GlohibAI services..."
	docker compose down

docker-logs: ## Tail logs for all services
	docker compose logs -f

docker-rebuild: ## Rebuild and restart all services
	@echo "Rebuilding GlohibAI services..."
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

# ============================================================================
# ADDITIONAL UTILITIES
# ============================================================================

docker-build: ## Build all services (without starting)
	@echo "Building GlohibAI services..."
	docker compose build

docker-ps: ## Show running containers
	docker compose ps

docker-shell-identity: ## Open shell in identity-service
	docker compose exec identity-service sh

docker-shell-assessment: ## Open shell in assessment-service
	docker compose exec assessment-service sh

docker-shell-recommendation: ## Open shell in recommendation-service
	docker compose exec recommendation-service sh

docker-shell-scoring: ## Open shell in scoring-service
	docker compose exec scoring-service sh

docker-shell-video: ## Open shell in video-service
	docker compose exec video-service sh

docker-logs-identity: ## Tail logs for identity-service
	docker compose logs -f identity-service

docker-logs-assessment: ## Tail logs for assessment-service
	docker compose logs -f assessment-service

docker-logs-recommendation: ## Tail logs for recommendation-service
	docker compose logs -f recommendation-service

docker-logs-scoring: ## Tail logs for scoring-service
	docker compose logs -f scoring-service

docker-logs-video: ## Tail logs for video-service
	docker compose logs -f video-service

docker-restart-identity: ## Restart identity-service
	docker compose restart identity-service

docker-restart-assessment: ## Restart assessment-service
	docker compose restart assessment-service

docker-restart-recommendation: ## Restart recommendation-service
	docker compose restart recommendation-service

docker-restart-scoring: ## Restart scoring-service
	docker compose restart scoring-service

docker-restart-video: ## Restart video-service
	docker compose restart video-service

test-identity-health: ## Test identity-service health endpoint
	@echo "Testing identity-service health..."
	curl -s http://localhost:8080/health || echo "Service not available"

test-assessment-health: ## Test assessment-service health endpoint
	@echo "Testing assessment-service health..."
	curl -s http://localhost:8084/health || echo "Service not available"

test-recommendation-health: ## Test recommendation-service health endpoint
	@echo "Testing recommendation-service health..."
	curl -s http://localhost:8007/health || echo "Service not available"

test-scoring-health: ## Test scoring-service health endpoint
	@echo "Testing scoring-service health..."
	curl -s http://localhost:8008/health || echo "Service not available"

test-video-health: ## Test video-service health endpoint
	@echo "Testing video-service health..."
	curl -s http://localhost:4000/health || echo "Service not available"

test-all-health: ## Test all service health endpoints
	@echo "Testing all services..."
	@echo "PostgreSQL: $$(docker compose exec -T postgres pg_isready -U glohib 2>&1 > /dev/null && echo '✓ OK' || echo '✗ DOWN')"
	@echo "Redis:      $$(docker compose exec -T redis redis-cli ping 2>&1 > /dev/null && echo '✓ OK' || echo '✗ DOWN')"
	@echo "MinIO:      $$(docker compose exec -T minio mc ready local 2>&1 > /dev/null && echo '✓ OK' || echo '✗ DOWN')"
	@echo "Identity:   $$(curl -s http://localhost:8080/health > /dev/null && echo '✓ OK' || echo '✗ DOWN')"
	@echo "Assessment: $$(curl -s http://localhost:8084/health > /dev/null && echo '✓ OK' || echo '✗ DOWN')"
	@echo "Recommend:  $$(curl -s http://localhost:8007/health > /dev/null && echo '✓ OK' || echo '✗ DOWN')"
	@echo "Scoring:    $$(curl -s http://localhost:8008/health > /dev/null && echo '✓ OK' || echo '✗ DOWN')"
	@echo "Video:      $$(curl -s http://localhost:4000/health > /dev/null && echo '✓ OK' || echo '✗ DOWN')"

# ============================================================================
# MVP PRESENTATION COMMANDS
# ============================================================================

mvp-up: ## Start services with MVP configuration
	@echo "Starting MVP services..."
	docker compose --env-file .env.mvp up -d

mvp-down: ## Stop MVP services
	docker compose --env-file .env.mvp down

mvp-seed: ## Seed demo data for presentation
	@echo "Seeding demo data..."
	docker compose --env-file .env.mvp exec -T postgres psql -U glohib -d glohib_db -c "INSERT INTO students (id, name, email) SELECT gen_random_uuid(), 'Demo Student ' || i, 'demo' || i || '@glohib.ai' FROM generate_series(1,5) i ON CONFLICT DO NOTHING;"

mvp-validate: ## Run MVP validation checks
	.\scripts\mvp-validate.bat

mvp-reset: ## Reset MVP environment completely
	@echo "Resetting MVP environment..."
	docker compose --env-file .env.mvp down -v
	docker compose --env-file .env.mvp up -d

