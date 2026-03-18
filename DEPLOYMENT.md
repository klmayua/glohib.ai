# =============================================================================
# GLOHIB.AI - HYBRID DEPLOYMENT GUIDE
# Docker Infrastructure + Direct Application Deployment
# =============================================================================

## OVERVIEW

This deployment uses a **hybrid approach**:
- **Docker**: PostgreSQL, Redis, MinIO (infrastructure)
- **Direct**: Next.js application (PM2 process manager)

**Benefits:**
- ✅ Easier debugging (direct access to app logs)
- ✅ Better performance (no container overhead for app)
- ✅ Simpler deployments (git pull + restart)
- ✅ Isolated infrastructure (easy backups)
- ✅ Lower RAM usage

---

## PREREQUISITES

### On VPS (62.171.160.194)
- Ubuntu 22.04+ or Debian 11+
- Docker 24+
- Docker Compose 2.20+
- Node.js 22+
- PM2 (installed globally)
- Nginx (optional, for reverse proxy)

### Check Prerequisites
```bash
# Check versions
docker --version
docker-compose --version
node --version
npm --version
pm2 --version
nginx -v  # optional
```

---

## DEPLOYMENT STEPS

### Option A: Full Deployment (First Time)

```bash
# 1. Navigate to project
cd /root/projects/GlohibAI

# 2. Make scripts executable
chmod +x scripts/deploy.sh scripts/quick-deploy.sh

# 3. Run deployment script
sudo ./scripts/deploy.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Create directories
3. ✅ Deploy infrastructure (Docker)
4. ✅ Copy application code
5. ✅ Install dependencies
6. ✅ Setup database
7. ✅ Build application
8. ✅ Start with PM2

### Option B: Manual Deployment

#### Step 1: Deploy Infrastructure
```bash
cd /root/projects/GlohibAI
docker-compose -f docker-compose.infrastructure.yml up -d

# Verify
docker-compose -f docker-compose.infrastructure.yml ps
```

#### Step 2: Setup Application Directory
```bash
# Create directory
sudo mkdir -p /opt/glohib-ai
sudo chown $USER:$USER /opt/glohib-ai

# Copy files
cp -r * /opt/glohib-ai/
cp -r .* /opt/glohib-ai/ 2>/dev/null || true

# Change to app directory
cd /opt/glohib-ai
```

#### Step 3: Install Dependencies
```bash
npm install --production
```

#### Step 4: Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema
npm run db:push -- --accept-data-loss

# Seed database
npm run db:seed
```

#### Step 5: Build Application
```bash
npm run build
```

#### Step 6: Start with PM2
```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup (run the command it outputs)
pm2 startup
```

---

## VERIFICATION

### Check Services
```bash
# Infrastructure (Docker)
docker ps

# Application (PM2)
pm2 status

# Application logs
pm2 logs glohib-ai --lines 50
```

### Test Endpoints
```bash
# Frontend
curl http://localhost:3000

# API health
curl http://localhost:3000/api/auth/me

# Database connection
docker exec -it glohib-postgres psql -U glohib -d glohib_db -c "SELECT 1;"
```

### Access URLs
| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | student1@glohib.ai / password123 |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |
| PostgreSQL | localhost:5432 | glohib / GlohibAI_DB_Secure_2026! |
| Redis | localhost:6379 | Password: GlohibRedis2026! |

---

## NGINX SETUP (Optional)

### 1. Copy Nginx Configuration
```bash
sudo cp docker/nginx.conf /etc/nginx/sites-available/glohib-ai
sudo ln -s /etc/nginx/sites-available/glohib-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Setup SSL (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d glohib.ai -d www.glohib.ai

# Auto-renewal is setup automatically
```

---

## MANAGEMENT

### Application Commands
```bash
# View logs
pm2 logs glohib-ai

# Restart application
pm2 restart glohib-ai

# Stop application
pm2 stop glohib-ai

# View status
pm2 status

# View memory usage
pm2 monit
```

### Infrastructure Commands
```bash
# View logs
docker-compose -f docker-compose.infrastructure.yml logs -f

# Restart all
docker-compose -f docker-compose.infrastructure.yml restart

# Restart specific service
docker-compose -f docker-compose.infrastructure.yml restart postgres

# View status
docker-compose -f docker-compose.infrastructure.yml ps
```

### Database Commands
```bash
# Access PostgreSQL shell
docker exec -it glohib-postgres psql -U glohib -d glohib_db

# Backup database
docker exec glohib-postgres pg_dump -U glohib glohib_db > backup.sql

# Restore database
docker exec -i glohib-postgres psql -U glohib -d glohib_db < backup.sql

# Redis CLI
docker exec -it glohib-redis redis-cli -a GlohibRedis2026!
```

---

## QUICK UPDATES

For code updates (already deployed once):

```bash
cd /root/projects/GlohibAI
sudo ./scripts/quick-deploy.sh
```

Or manually:
```bash
cd /opt/glohib-ai

# Pull latest code
git pull  # or copy files

# Install dependencies
npm install --production

# Generate Prisma
npm run db:generate

# Rebuild
npm run build

# Restart
pm2 restart glohib-ai
```

---

## BACKUP STRATEGY

### Database Backup (Daily)
```bash
# Create backup script
cat > /opt/glohib-ai/scripts/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/glohib-ai"
mkdir -p $BACKUP_DIR

# Database backup
docker exec glohib-postgres pg_dump -U glohib glohib_db > $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 backups
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/glohib-ai/scripts/backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /opt/glohib-ai/scripts/backup.sh" | sudo crontab -
```

### PM2 Configuration Backup
```bash
pm2 dump
```

---

## TROUBLESHOOTING

### Application Won't Start
```bash
# Check logs
pm2 logs glohib-ai --err

# Check if port is in use
lsof -i :3000

# Check environment
cat /opt/glohib-ai/.env.production
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs glohib-postgres

# Test connection
docker exec glohib-postgres pg_isready -U glohib
```

### High Memory Usage
```bash
# Check memory
pm2 monit

# Restart with memory limit
pm2 restart glohib-ai --max-memory-restart 1G
```

---

## PRODUCTION CHECKLIST

- [ ] Change all default passwords in .env.production
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Setup SSL certificate (Let's Encrypt)
- [ ] Configure firewall (ufw)
- [ ] Setup log rotation
- [ ] Configure monitoring (optional: Datadog, Sentry)
- [ ] Setup backup strategy
- [ ] Test disaster recovery
- [ ] Configure email sending (SendGrid)
- [ ] Add OAuth credentials (optional)

---

## SECURITY RECOMMENDATIONS

### 1. Firewall Setup
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Change Default Passwords
Edit `.env.production`:
- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`
- `MINIO_ROOT_PASSWORD`
- `NEXTAUTH_SECRET`

### 3. Enable HTTPS
```bash
sudo certbot --nginx -d your-domain.com
```

---

**Deployment Guide Version:** 1.0  
**Last Updated:** 2026-03-17
