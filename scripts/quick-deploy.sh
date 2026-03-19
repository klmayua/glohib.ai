#!/bin/bash
# =============================================================================
# GLOHIB.AI - QUICK DEPLOY SCRIPT
# Fast deployment for updates (assumes infrastructure is already running)
# =============================================================================

set -e

APP_NAME="glohib-ai"
APP_DIR="/opt/glohib-ai"
SRC_DIR="/root/projects/GlohibAI"
WEB_DIR="$APP_DIR/frontend/web"

echo "Quick Deploy - Glohib.ai"
echo "------------------------"

# Sync source files
echo "[1/4] Syncing source files..."
rsync -a --delete "$SRC_DIR/frontend/web/src/" "$WEB_DIR/src/"
cp "$SRC_DIR/frontend/web/Dockerfile" "$WEB_DIR/Dockerfile"
cp "$SRC_DIR/frontend/web/.dockerignore" "$WEB_DIR/.dockerignore"
cp "$SRC_DIR/docker-compose.yml" "$APP_DIR/docker-compose.yml" 2>/dev/null || true

# Build
echo "[2/4] Building application..."
cd "$WEB_DIR"
npm run build

# Copy static assets into standalone (required for standalone mode)
echo "[3/4] Preparing standalone output..."
cp -r "$WEB_DIR/.next/static" "$WEB_DIR/.next/standalone/.next/static"
if [ -d "$WEB_DIR/public" ]; then
  cp -r "$WEB_DIR/public" "$WEB_DIR/.next/standalone/public"
fi

# Restart PM2
echo "[4/4] Restarting application..."
pm2 restart "$APP_NAME"

sleep 2
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS" = "200" ]; then
  echo ""
  echo "Deployment complete! Health check: 200 OK"
  echo "  View logs: pm2 logs $APP_NAME --lines 50"
else
  echo ""
  echo "WARNING: Health check returned $STATUS"
  echo "  Check logs: pm2 logs $APP_NAME --lines 50"
fi
