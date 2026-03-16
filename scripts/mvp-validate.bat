@echo off
REM MVP Validation Script for GlohibAI
REM Checks all critical services are running and healthy

setlocal enabledelayedexpansion

echo [MVP] Starting validation...

REM Check if Docker Compose services are running
docker compose ps | findstr "Up" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Services not running
    exit /b 1
)
echo [OK] Docker services running

REM Wait for services to stabilize
timeout /t 10 /nobreak >nul

REM Check Identity Service (Go)
curl -sf http://localhost:8080/health >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Identity service unhealthy
    exit /b 1
)
echo [OK] Identity service healthy

REM Check Scoring Service (Python)
curl -sf http://localhost:8008/health >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Scoring service unhealthy
    exit /b 1
)
echo [OK] Scoring service healthy

REM Check Recommendation Service
curl -sf http://localhost:8007/health >nul 2>&1
if errorlevel 1 (
    echo [WARN] Recommendation service not ready
) else (
    echo [OK] Recommendation service healthy
)

REM Check Video Service
curl -sf http://localhost:4000/health >nul 2>&1
if errorlevel 1 (
    echo [WARN] Video service not ready
) else (
    echo [OK] Video service healthy
)

REM Check Frontend
curl -sf http://localhost:3000/health >nul 2>&1
if errorlevel 1 (
    echo [WARN] Frontend not ready
) else (
    echo [OK] Frontend healthy
)

echo.
echo [OK] MVP services validated for presentation
exit /b 0
