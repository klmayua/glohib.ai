#!/bin/bash
# =============================================================================
# GLOHIB.AI - QUICK DEPLOY SCRIPT
# Fast deployment for updates (assumes infrastructure is already running)
# =============================================================================

set -e

APP_NAME="glohib-ai"
APP_DIR="/opt/glohib-ai"

echo "🚀 Quick Deploy - Glohib.ai"
echo "────────────────────────────"

cd "$APP_DIR"

# Pull latest code
echo "📦 Copying latest code..."
cp -r /root/projects/GlohibAI/* "$APP_DIR/"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Generate Prisma
echo "🔧 Generating Prisma client..."
npm run db:generate

# Build
echo "🏗️  Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart "$APP_NAME"

echo ""
echo "✅ Deployment complete!"
echo "   pm2 logs $APP_NAME --lines 50"
