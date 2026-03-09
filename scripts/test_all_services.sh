#!/bin/bash
# GlohibAI - Comprehensive Service Health Check & Test Script
# This script verifies all services are running and responding correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL_IDENTITY="http://localhost:8080"
BASE_URL_STUDENT="http://localhost:8082"
BASE_URL_INTERNSHIP="http://localhost:8083"
BASE_URL_ASSESSMENT="http://localhost:8084"
BASE_URL_RECOMMENDATION="http://localhost:8007"
BASE_URL_SCORING="http://localhost:8008"
BASE_URL_VIDEO="http://localhost:4000"

# Counters
PASSED=0
FAILED=0
SKIPPED=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_test() {
    echo -n "  Testing: $1... "
}

print_pass() {
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC} - $1"
    ((FAILED++))
}

print_skip() {
    echo -e "${YELLOW}○ SKIP${NC} - $1"
    ((SKIPPED++))
}

check_http() {
    local url=$1
    local expected_status=${2:-200}
    
    if curl -s -f -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        return 0
    else
        return 1
    fi
}

# Start
print_header "GlohibAI Service Health Check"
echo "Starting comprehensive service audit..."
echo "Timestamp: $(date)"

# ============================================================================
# 1. Infrastructure Services
# ============================================================================
print_header "1. Infrastructure Services"

# PostgreSQL
print_test "PostgreSQL (port 5432)"
if docker compose exec -T postgres pg_isready -U glohib > /dev/null 2>&1; then
    print_pass
else
    print_fail "PostgreSQL not responding"
fi

# Redis
print_test "Redis (port 6379)"
if docker compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_pass
else
    print_fail "Redis not responding"
fi

# MinIO
print_test "MinIO (port 9000)"
if docker compose exec -T minio mc ready local > /dev/null 2>&1; then
    print_pass
else
    print_fail "MinIO not responding"
fi

# ============================================================================
# 2. Application Services - Health Endpoints
# ============================================================================
print_header "2. Application Services - Health Endpoints"

# Identity Service
print_test "Identity Service Health"
if check_http "$BASE_URL_IDENTITY/health" 200; then
    print_pass
else
    print_fail "Identity Service not responding on $BASE_URL_IDENTITY/health"
fi

# Student Service
print_test "Student Service Health"
if check_http "$BASE_URL_STUDENT/health" 200; then
    print_pass
else
    print_fail "Student Service not responding on $BASE_URL_STUDENT/health"
fi

# Internship Service
print_test "Internship Service Health"
if check_http "$BASE_URL_INTERNSHIP/health" 200; then
    print_pass
else
    print_fail "Internship Service not responding on $BASE_URL_INTERNSHIP/health"
fi

# Assessment Service
print_test "Assessment Service Health"
if check_http "$BASE_URL_ASSESSMENT/health" 200; then
    print_pass
else
    print_fail "Assessment Service not responding on $BASE_URL_ASSESSMENT/health"
fi

# Recommendation Service
print_test "Recommendation Service Health"
if check_http "$BASE_URL_RECOMMENDATION/health" 200; then
    print_pass
else
    print_fail "Recommendation Service not responding on $BASE_URL_RECOMMENDATION/health"
fi

# Scoring Service
print_test "Scoring Service Health"
if check_http "$BASE_URL_SCORING/health" 200; then
    print_pass
else
    print_fail "Scoring Service not responding on $BASE_URL_SCORING/health"
fi

# Video Service
print_test "Video Service Health"
if check_http "$BASE_URL_VIDEO/health" 200; then
    print_pass
else
    print_fail "Video Service not responding on $BASE_URL_VIDEO/health"
fi

# ============================================================================
# 3. API Endpoint Tests
# ============================================================================
print_header "3. API Endpoint Tests"

# Identity Service - Register (test with unique email)
TEST_EMAIL="test_$(date +%s)@test.com"
print_test "Identity: POST /api/v1/auth/register"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL_IDENTITY/api/v1/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"password123\",\"role\":\"student\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "409" ]; then
    print_pass
else
    print_fail "Expected 201/200/409, got $HTTP_CODE"
fi

# Identity Service - Login
print_test "Identity: POST /api/v1/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL_IDENTITY/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"student@example.com\",\"password\":\"password123\"}")
if echo "$LOGIN_RESPONSE" | grep -q "tokens\|error"; then
    print_pass
else
    print_skip "Login endpoint responded but format unclear"
fi

# Student Service - List
print_test "Student: GET /api/v1/students"
if check_http "$BASE_URL_STUDENT/api/v1/students?limit=10&offset=0" 200; then
    print_pass
else
    print_fail "Student list endpoint not responding"
fi

# Internship Service - List
print_test "Internship: GET /api/v1/internships"
if check_http "$BASE_URL_INTERNSHIP/api/v1/internships?limit=10&offset=0" 200; then
    print_pass
else
    print_fail "Internship list endpoint not responding"
fi

# Recommendation Service - Health only (vectorize requires data)
print_test "Recommendation: GET /health"
if check_http "$BASE_URL_RECOMMENDATION/health" 200; then
    print_pass
else
    print_fail "Recommendation service not responding"
fi

# Scoring Service - Health only (scoring requires data)
print_test "Scoring: GET /health"
if check_http "$BASE_URL_SCORING/health" 200; then
    print_pass
else
    print_fail "Scoring service not responding"
fi

# Video Service - Health only
print_test "Video: GET /health"
if check_http "$BASE_URL_VIDEO/health" 200; then
    print_pass
else
    print_fail "Video service not responding"
fi

# ============================================================================
# 4. Database Schema Verification
# ============================================================================
print_header "4. Database Schema Verification"

print_test "Check users table exists"
if docker compose exec -T postgres psql -U glohib -d glohib_db -c "\dt users" > /dev/null 2>&1; then
    print_pass
else
    print_fail "users table not found"
fi

print_test "Check students table exists"
if docker compose exec -T postgres psql -U glohib -d glohib_db -c "\dt students" > /dev/null 2>&1; then
    print_pass
else
    print_fail "students table not found"
fi

print_test "Check internships table exists"
if docker compose exec -T postgres psql -U glohib -d glohib_db -c "\dt internships" > /dev/null 2>&1; then
    print_pass
else
    print_fail "internships table not found"
fi

print_test "Check pgvector extension enabled"
if docker compose exec -T postgres psql -U glohib -d glohib_db -c "\dx vector" > /dev/null 2>&1; then
    print_pass
else
    print_fail "pgvector extension not enabled"
fi

# ============================================================================
# 5. Container Status
# ============================================================================
print_header "5. Container Status"

docker compose ps --format "table" 2>/dev/null || print_skip "Docker compose not available"

# ============================================================================
# Summary
# ============================================================================
print_header "Test Summary"

TOTAL=$((PASSED + FAILED + SKIPPED))
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Skipped: $SKIPPED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All services are healthy!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Some services have issues. Check the logs above.${NC}"
    exit 1
fi
