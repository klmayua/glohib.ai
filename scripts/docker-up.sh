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
