# GlohibAI - Comprehensive Test Script (Windows PowerShell)
# Run this script to verify all services are healthy

$ErrorActionPreference = "Stop"

# Colors
function Write-Pass { param($msg) Write-Host "  ✓ PASS: $msg" -ForegroundColor Green }
function Write-Fail { param($msg) Write-Host "  ✗ FAIL: $msg" -ForegroundColor Red }
function Write-Test { param($msg) Write-Host "  Testing: $msg..." -NoNewline }
function Write-Header { param($msg) Write-Host "`n========================================" -ForegroundColor Blue; Write-Host "$msg" -ForegroundColor Blue; Write-Host "========================================`n" -ForegroundColor Blue }

# Counters
$Passed = 0
$Failed = 0
$Skipped = 0

# Configuration
$IdentityUrl = "http://localhost:8080"
$StudentUrl = "http://localhost:8082"
$InternshipUrl = "http://localhost:8083"
$AssessmentUrl = "http://localhost:8084"
$RecommendationUrl = "http://localhost:8007"
$ScoringUrl = "http://localhost:8008"
$VideoUrl = "http://localhost:4000"

Write-Header "GlohibAI Service Health Check (Windows)"

# ============================================================================
# 1. Infrastructure Services
# ============================================================================
Write-Header "1. Infrastructure Services"

Write-Test "PostgreSQL"
try {
    $result = docker compose exec -T postgres pg_isready -U glohib 2>&1
    if ($LASTEXITCODE -eq 0) { Write-Pass "PostgreSQL" } else { Write-Fail "PostgreSQL not responding" }
} catch { Write-Fail "PostgreSQL check failed: $_" }

Write-Test "Redis"
try {
    $result = docker compose exec -T redis redis-cli ping 2>&1
    if ($result -eq "PONG") { Write-Pass "Redis" } else { Write-Fail "Redis not responding" }
} catch { Write-Fail "Redis check failed: $_" }

Write-Test "MinIO"
try {
    docker compose exec -T minio mc ready local 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Pass "MinIO" } else { Write-Fail "MinIO not responding" }
} catch { Write-Fail "MinIO check failed: $_" }

# ============================================================================
# 2. Application Services - Health Endpoints
# ============================================================================
Write-Header "2. Application Services - Health Endpoints"

$Services = @{
    "Identity Service" = $IdentityUrl
    "Student Service" = $StudentUrl
    "Internship Service" = $InternshipUrl
    "Assessment Service" = $AssessmentUrl
    "Recommendation Service" = $RecommendationUrl
    "Scoring Service" = $ScoringUrl
    "Video Service" = $VideoUrl
}

foreach ($service in $Services.Keys) {
    $url = "$($Services[$service])/health"
    Write-Test "$service ($url)"
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing 2>&1
        if ($response.StatusCode -eq 200) {
            Write-Pass "$service"
        } else {
            Write-Fail "$service returned $($response.StatusCode)"
        }
    } catch {
        Write-Fail "$service not responding - $_"
    }
}

# ============================================================================
# 3. API Endpoint Tests
# ============================================================================
Write-Header "3. API Endpoint Tests"

Write-Test "Identity: POST /api/v1/auth/register"
try {
    $testEmail = "test_$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
    $body = @{ email = $testEmail; password = "password123"; role = "student" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$IdentityUrl/api/v1/auth/register" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -in @(200, 201, 409)) {
        Write-Pass "Registration endpoint"
    } else {
        Write-Fail "Unexpected status: $($response.StatusCode)"
    }
} catch {
    if ($_.Exception.Response.StatusCode -in @(200, 201, 409)) {
        Write-Pass "Registration endpoint"
    } else {
        Write-Fail "Registration failed - $($_.Exception.Message)"
    }
}

Write-Test "Student: GET /api/v1/students"
try {
    $response = Invoke-WebRequest -Uri "$StudentUrl/api/v1/students?limit=10&offset=0" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) { Write-Pass "Student list" } else { Write-Fail "Student list returned $($response.StatusCode)" }
} catch { Write-Fail "Student list not accessible" }

Write-Test "Internship: GET /api/v1/internships"
try {
    $response = Invoke-WebRequest -Uri "$InternshipUrl/api/v1/internships?limit=10&offset=0" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) { Write-Pass "Internship list" } else { Write-Fail "Internship list returned $($response.StatusCode)" }
} catch { Write-Fail "Internship list not accessible" }

# ============================================================================
# 4. Container Status
# ============================================================================
Write-Header "4. Container Status"
docker compose ps

# ============================================================================
# Summary
# ============================================================================
Write-Header "Test Summary"
Write-Host "Tests completed at: $(Get-Date)"
Write-Host "Check output above for any failures."
