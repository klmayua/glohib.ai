#!/bin/bash
set -euo pipefail
echo "🛑 Stopping Glohib.ai development environment..."
docker compose down
echo "✅ Stopped."
