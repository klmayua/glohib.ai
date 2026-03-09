#!/bin/bash
set -euo pipefail
echo "🔨 Rebuilding Glohib.ai services..."
docker compose down
docker compose build --no-cache
docker compose up -d
echo "✅ Rebuild complete."
