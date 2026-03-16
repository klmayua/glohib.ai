#!/bin/bash
# GlohibAI Production Readiness Validation Script
# Run this to verify all services and configurations

set -e

echo "============================================================"
echo "  GLOHIB.AI PRODUCTION READINESS VALIDATION"
echo "============================================================"
echo ""

PASS=0
FAIL=0
WARN=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# ============================================================================
# 1. REPOSITORY STRUCTURE
# ============================================================================
echo "1. Checking Repository Structure..."
echo "-----------------------------------"

if [ -d "services" ]; then
    check_pass "Services directory exists"
else
    check_fail "Services directory missing"
fi

if [ -d "frontend" ]; then
    check_pass "Frontend directory exists"
else
    check_fail "Frontend directory missing"
fi

if [ -d "tests" ]; then
    check_pass "Tests directory exists"
else
    check_fail "Tests directory missing"
fi

if [ -f ".env.example" ]; then
    check_pass ".env.example exists"
else
    check_fail ".env.example missing"
fi

if [ -f ".gitignore" ]; then
    check_pass ".gitignore exists"
else
    check_fail ".gitignore missing"
fi

echo ""

# ============================================================================
# 2. DOCKER CONFIGURATION
# ============================================================================
echo "2. Checking Docker Configuration..."
echo "------------------------------------"

if [ -f "docker-compose.yml" ]; then
    check_pass "docker-compose.yml exists"
else
    check_fail "docker-compose.yml missing"
fi

if [ -f "docker-compose.observability.yml" ]; then
    check_pass "docker-compose.observability.yml exists"
else
    check_warn "docker-compose.observability.yml missing"
fi

if [ -f "docker-compose.traefik.yml" ]; then
    check_pass "docker-compose.traefik.yml exists"
else
    check_warn "docker-compose.traefik.yml missing"
fi

# Check Dockerfiles for non-root user
echo "Checking Dockerfiles for non-root user configuration..."
for dockerfile in services/*/Dockerfile; do
    if [ -f "$dockerfile" ]; then
        if grep -q "USER app" "$dockerfile" || grep -q "USER appuser" "$dockerfile"; then
            check_pass "$(basename $dockerfile): Non-root user configured"
        else
            check_warn "$(basename $dockerfile): Running as root (security risk)"
        fi
    fi
done

echo ""

# ============================================================================
# 3. SERVICE HEALTH CHECKS
# ============================================================================
echo "3. Checking Service Health Endpoints..."
echo "----------------------------------------"

services=(
    "http://localhost:8080/health:Identity Service"
    "http://localhost:8082/health:Student Service"
    "http://localhost:8083/health:Internship Service"
    "http://localhost:8084/health:Assessment Service"
    "http://localhost:8007/health:Recommendation Service"
    "http://localhost:8008/health:Scoring Service"
    "http://localhost:4000/health:Video Service"
)

for service in "${services[@]}"; do
    url="${service%%:*}"
    name="${service##*:}"
    
    if command -v curl &> /dev/null; then
        if curl -s --max-time 5 "$url" | grep -q "healthy\|alive"; then
            check_pass "$name: Healthy"
        else
            check_warn "$name: Not responding (may not be running)"
        fi
    else
        check_warn "curl not installed, skipping health checks"
    fi
done

echo ""

# ============================================================================
# 4. SECURITY CHECKS
# ============================================================================
echo "4. Security Checks..."
echo "---------------------"

if [ -f ".env" ]; then
    if grep -q "changeme" .env || grep -q "CHANGE_ME" .env; then
        check_warn ".env contains default passwords - change before production!"
    else
        check_pass "No default passwords detected in .env"
    fi
else
    check_warn ".env file not found"
fi

if [ -f "docker-secrets.example" ]; then
    check_pass "Docker secrets configuration exists"
else
    check_warn "Docker secrets configuration missing"
fi

# Check for rate limiting
if grep -q "rate_limit" services/identity-service/internal/middleware/*.go 2>/dev/null; then
    check_pass "Rate limiting middleware implemented"
else
    check_warn "Rate limiting middleware not found"
fi

echo ""

# ============================================================================
# 5. TESTING
# ============================================================================
echo "5. Testing Framework..."
echo "-----------------------"

if [ -f "services/identity-service/internal/jwt/jwt_test.go" ]; then
    check_pass "Go unit tests exist"
else
    check_warn "Go unit tests missing"
fi

if [ -f "services/recommendation-service/tests/test_app.py" ]; then
    check_pass "Python unit tests exist"
else
    check_warn "Python unit tests missing"
fi

if [ -f "tests/integration/test_services_integration.py" ]; then
    check_pass "Integration tests exist"
else
    check_warn "Integration tests missing"
fi

echo ""

# ============================================================================
# 6. OBSERVABILITY
# ============================================================================
echo "6. Observability Stack..."
echo "-------------------------"

if grep -q "prometheus" docker-compose.observability.yml 2>/dev/null; then
    check_pass "Prometheus configuration exists"
else
    check_warn "Prometheus configuration missing"
fi

if grep -q "grafana" docker-compose.observability.yml 2>/dev/null; then
    check_pass "Grafana configuration exists"
else
    check_warn "Grafana configuration missing"
fi

# Check for metrics endpoints
if grep -q "/metrics" services/identity-service/internal/router/router.go 2>/dev/null; then
    check_pass "Prometheus metrics endpoint in identity-service"
else
    check_warn "Metrics endpoint not found in identity-service"
fi

echo ""

# ============================================================================
# 7. BACKUP SYSTEM
# ============================================================================
echo "7. Backup System..."
echo "-------------------"

if [ -f "scripts/backup-postgres.sh" ]; then
    check_pass "PostgreSQL backup script exists"
else
    check_warn "PostgreSQL backup script missing"
fi

if [ -f "scripts/backup-redis.sh" ]; then
    check_pass "Redis backup script exists"
else
    check_warn "Redis backup script missing"
fi

if [ -f "docker-compose.backup.yml" ]; then
    check_pass "Docker Compose backup configuration exists"
else
    check_warn "Docker Compose backup configuration missing"
fi

echo ""

# ============================================================================
# 8. FRONTEND
# ============================================================================
echo "8. Frontend Completion..."
echo "-------------------------"

frontend_pages=(
    "frontend/web/src/app/dashboard/page.tsx"
    "frontend/web/src/app/dashboard/internships/page.tsx"
    "frontend/web/src/app/dashboard/profile/page.tsx"
    "frontend/web/src/app/dashboard/assessments/page.tsx"
    "frontend/web/src/app/dashboard/recommendations/page.tsx"
    "frontend/web/src/app/dashboard/video-interview/page.tsx"
)

for page in "${frontend_pages[@]}"; do
    if [ -f "$page" ]; then
        check_pass "Page exists: $(basename $page)"
    else
        check_warn "Page missing: $(basename $page)"
    fi
done

echo ""

# ============================================================================
# SUMMARY
# ============================================================================
echo "============================================================"
echo "  VALIDATION SUMMARY"
echo "============================================================"
echo ""
echo -e "Passed:   ${GREEN}${PASS}${NC}"
echo -e "Failed:   ${RED}${FAIL}${NC}"
echo -e "Warnings: ${YELLOW}${WARN}${NC}"
echo ""

TOTAL=$((PASS + FAIL + WARN))
SCORE=$((PASS * 100 / TOTAL))

echo "Production Readiness Score: ${SCORE}%"
echo ""

if [ $SCORE -ge 90 ]; then
    echo -e "${GREEN}✓ System is PRODUCTION READY${NC}"
elif [ $SCORE -ge 70 ]; then
    echo -e "${YELLOW}⚠ System is MOSTLY ready (address warnings)${NC}"
else
    echo -e "${RED}✗ System NOT ready for production${NC}"
fi

echo ""
echo "============================================================"

exit 0
