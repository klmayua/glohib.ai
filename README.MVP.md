# GlohibAI MVP - Board Presentation

## Quick Start for Demo

### 1. Start services
```bash
make mvp-up
```

### 2. Seed demo data
```bash
make mvp-seed
```

### 3. Validate readiness
```bash
make mvp-validate
```

### 4. Access frontend
http://localhost:3000

## Demo Credentials

- **Email**: demo1@glohib.ai
- **Password**: DemoPass123!

## Service Endpoints

| Service | Port | Health Endpoint |
|---------|------|-----------------|
| Identity | 8080 | http://localhost:8080/health |
| Student | 8082 | http://localhost:8082/health |
| Internship | 8083 | http://localhost:8083/health |
| Assessment | 8084 | http://localhost:8084/health |
| Recommendation | 8007 | http://localhost:8007/health |
| Scoring | 8008 | http://localhost:8008/health |
| Video | 4000 | http://localhost:4000/health |

## Troubleshooting

### Services not starting
```bash
docker compose --env-file .env.mvp logs
```

### Reset completely
```bash
make mvp-reset
```

### Check service status
```bash
docker compose --env-file .env.mvp ps
```

### View specific service logs
```bash
docker compose --env-file .env.mvp logs -f identity-service
```

## MVP Features

- [x] Secure credentials (no hardcoded secrets)
- [x] Non-root container users
- [x] Rate limiting on API endpoints
- [x] Resource limits per service
- [x] Log rotation configured
- [x] Health checks for all services
- [x] Demo data seeding

## Known Limitations (Post-MVP)

- [ ] CI/CD pipeline not implemented
- [ ] Backup strategy not configured
- [ ] Full test coverage not achieved
- [ ] Production monitoring not deployed

## Presentation Commands Summary

```bash
# Full MVP startup sequence
make mvp-up && make mvp-seed && make mvp-validate

# Stop everything
make mvp-down

# Clean reset
make mvp-reset
```
