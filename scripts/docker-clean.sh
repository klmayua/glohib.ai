#!/bin/bash
set -euo pipefail
echo "🧹 Cleaning Docker resources..."
docker compose down -v --remove-orphans
docker system prune -f
echo "✅ Cleaned."
