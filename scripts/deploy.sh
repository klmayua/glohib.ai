#!/bin/bash
# =============================================================================
# GLOHIB.AI - DEPLOYMENT SCRIPT
# Hybrid Deployment: Docker Infrastructure + Direct Application
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="glohib-ai"
APP_DIR="/opt/glohib-ai"
LOG_DIR="/var/log/glohib-ai"
USER="root"
PORT=3000

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Glohib.ai Deployment Script${NC}"
echo -e "${BLUE}  Hybrid Deployment (Docker + Direct)${NC}"
echo -e "${BLUE}========================================${NC}"

# =============================================================================
# PRE-DEPLOYMENT CHECKS
# =============================================================================
echo -e "\n${YELLOW}[1/8] Running pre-deployment checks...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Error: Please run as root (sudo)${NC}"
  exit 1
fi

# Check Node.js version
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js not installed${NC}"
  echo "Installing Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
  echo -e "${YELLOW}Warning: Node.js version should be 22+ (current: $(node -v))${NC}"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Error: Docker not installed${NC}"
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi

# Check Docker Compose (v2 uses 'docker compose', v1 uses 'docker-compose')
if command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
  COMPOSE_CMD="docker compose"
else
  echo -e "${RED}Error: Docker Compose not installed${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Using: $COMPOSE_CMD${NC}"

# Check PM2
if ! command -v pm2 &> /dev/null; then
  echo -e "${YELLOW}Installing PM2...${NC}"
  npm install -g pm2
fi

echo -e "${GREEN}✓ Pre-deployment checks passed${NC}"

# =============================================================================
# CREATE DIRECTORIES
# =============================================================================
echo -e "\n${YELLOW}[2/8] Creating directories...${NC}"

mkdir -p "$APP_DIR"
mkdir -p "$LOG_DIR"
mkdir -p /opt/glohib-ai/logs

echo -e "${GREEN}✓ Directories created${NC}"

# =============================================================================
# DEPLOY INFRASTRUCTURE (Docker)
# =============================================================================
echo -e "\n${YELLOW}[3/8] Deploying infrastructure (PostgreSQL, Redis, MinIO)...${NC}"

# First copy files to app directory
echo "Copying application files..."
if [ -d "/root/projects/GlohibAI" ]; then
  cp -r /root/projects/GlohibAI/* "$APP_DIR/"
  cp -r /root/projects/GlohibAI/.* "$APP_DIR/" 2>/dev/null || true
fi

cd "$APP_DIR"

# Create .env if not exists
if [ ! -f ".env.production" ]; then
  echo -e "${YELLOW}Creating .env.production...${NC}"
  cat > .env.production << 'EOF'
# =============================================================================
# GLOHIB.AI - PRODUCTION ENVIRONMENT
# =============================================================================

# Database
DATABASE_URL="postgresql://glohib:GlohibAI_DB_Secure_2026!@localhost:5432/glohib_db?schema=public"

# Redis
REDIS_URL="redis://:GlohibRedis2026!@localhost:6379"

# NextAuth
NEXTAUTH_SECRET="PWC2030-GlohibAI-Secret-Key-Minimum-32-Characters-2026!"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# MinIO
MINIO_ENDPOINT="localhost:9000"
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin"
MINIO_BUCKET="glohib"

# Email (SendGrid - optional)
SENDGRID_API_KEY=""
EMAIL_FROM="noreply@glohib.ai"

# OAuth (optional - can add later)
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EOF
fi

# Start infrastructure
$COMPOSE_CMD -f docker-compose.infrastructure.yml up -d

# Wait for services to be healthy
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Check container status
$COMPOSE_CMD -f docker-compose.infrastructure.yml ps

echo -e "${GREEN}✓ Infrastructure deployed${NC}"

# =============================================================================
# DEPLOY APPLICATION CODE
# =============================================================================
echo -e "\n${YELLOW}[4/8] Application code already deployed${NC}"

cd "$APP_DIR"

echo -e "${GREEN}✓ Application code deployed${NC}"

# =============================================================================
# INSTALL DEPENDENCIES
# =============================================================================
echo -e "\n${YELLOW}[5/8] Installing dependencies...${NC}"

# Clean install
rm -rf node_modules package-lock.json
npm install --production

echo -e "${GREEN}✓ Dependencies installed${NC}"

# =============================================================================
# DATABASE SETUP
# =============================================================================
echo -e "\n${YELLOW}[6/8] Setting up database...${NC}"

# Generate Prisma client
npm run db:generate

# Push schema to database
echo "Pushing database schema..."
npm run db:push -- --accept-data-loss

# Seed database
echo "Seeding database with test data..."
npm run db:seed

echo -e "${GREEN}✓ Database setup complete${NC}"

# =============================================================================
# BUILD APPLICATION
# =============================================================================
echo -e "\n${YELLOW}[7/8] Building application...${NC}"

npm run build

echo -e "${GREEN}✓ Application built${NC}"

# =============================================================================
# START APPLICATION (PM2)
# =============================================================================
echo -e "\n${YELLOW}[8/8] Starting application with PM2...${NC}"

# Stop existing processes
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup | tail -1 | bash 2>/dev/null || true

echo -e "${GREEN}✓ Application started${NC}"

# =============================================================================
# POST-DEPLOYMENT VERIFICATION
# =============================================================================
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "\n${GREEN}Services Status:${NC}"
echo "─────────────────────────────────────"

# Check infrastructure
echo -n "PostgreSQL: "
if docker ps | grep -q glohib-postgres; then
  echo -e "${GREEN}Running${NC}"
else
  echo -e "${RED}Not Running${NC}"
fi

echo -n "Redis: "
if docker ps | grep -q glohib-redis; then
  echo -e "${GREEN}Running${NC}"
else
  echo -e "${RED}Not Running${NC}"
fi

echo -n "MinIO: "
if docker ps | grep -q glohib-minio; then
  echo -e "${GREEN}Running${NC}"
else
  echo -e "${RED}Not Running${NC}"
fi

# Check application
echo -n "Next.js App: "
if pm2 list | grep -q "online"; then
  echo -e "${GREEN}Running${NC}"
else
  echo -e "${RED}Not Running${NC}"
fi

echo -e "\n${BLUE}Access URLs:${NC}"
echo "─────────────────────────────────────"
echo "Frontend:       http://localhost:$PORT"
echo "MinIO Console:  http://localhost:9001"
echo "PostgreSQL:     localhost:5432"
echo "Redis:          localhost:6379"

echo -e "\n${BLUE}Useful Commands:${NC}"
echo "─────────────────────────────────────"
echo "View logs:         pm2 logs $APP_NAME"
echo "Restart app:       pm2 restart $APP_NAME"
echo "Stop app:          pm2 stop $APP_NAME"
echo "Status:            pm2 status"
echo "Docker logs:       $COMPOSE_CMD -f docker-compose.infrastructure.yml logs -f"
echo "Database shell:    docker exec -it glohib-postgres psql -U glohib -d glohib_db"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Test Credentials (password: password123):${NC}"
echo -e "${GREEN}    student1@glohib.ai${NC}"
echo -e "${GREEN}    recruiter@who.int${NC}"
echo -e "${GREEN}========================================${NC}"
