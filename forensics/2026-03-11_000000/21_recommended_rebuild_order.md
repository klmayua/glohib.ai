# 21 - Recommended Rebuild Order

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Executive Summary

**Recommended Approach:** Incremental Hardening (Not Full Rebuild)

GlohibAI does not require a full rebuild. The core architecture is sound, but critical gaps must be addressed before production deployment.

---

## Current State Assessment

### What's Working Well

✅ **Backend Services** - All 7 services implemented and functional
✅ **Docker Containerization** - All services containerized with health checks
✅ **Database Schema** - Well-designed with migrations
✅ **Core Features** - Auth, profiles, internships working
✅ **AI/ML Integration** - Recommendation and scoring working
✅ **Documentation** - Comprehensive README files

### What Needs Attention

🔴 **Security** - Critical vulnerabilities present
🔴 **Testing** - No unit/integration tests
🔴 **CI/CD** - No automated pipeline
🔴 **Monitoring** - No observability stack
🔴 **Backups** - No backup strategy

---

## Recommended Build Order

### Phase 1: Critical Security Fixes (Week 1)

**Priority:** P0 - Block Production Until Complete

| Order | Task | Owner | Effort | Exit Criteria |
|-------|------|-------|--------|---------------|
| 1.1 | Rotate all secrets | DevOps | 2h | All default passwords changed |
| 1.2 | Add rate limiting to auth | Backend | 4h | 5 req/min on login/register |
| 1.3 | Fix container security | DevOps | 4h | All containers run as non-root |
| 1.4 | Add security headers | Frontend | 2h | CSP, X-Frame-Options configured |
| 1.5 | Enable TLS/SSL | DevOps | 4h | HTTPS working with valid cert |

**Phase 1 Exit Criteria:**
- [ ] All P0 security issues resolved
- [ ] Security scan passes
- [ ] Penetration test scheduled

---

### Phase 2: Backup & Recovery (Week 2)

**Priority:** P0 - Block Production Until Complete

| Order | Task | Owner | Effort | Exit Criteria |
|-------|------|-------|--------|---------------|
| 2.1 | PostgreSQL backup script | DevOps | 4h | Daily automated backups |
| 2.2 | Redis persistence config | DevOps | 2h | RDB snapshots every 15min |
| 2.3 | MinIO replication | DevOps | 4h | Bucket replication configured |
| 2.4 | Backup verification | DevOps | 4h | Restore test successful |
| 2.5 | Runbook documentation | DevOps | 4h | Backup/restore runbooks |

**Phase 2 Exit Criteria:**
- [ ] RPO < 1 hour demonstrated
- [ ] RTO < 4 hours demonstrated
- [ ] Backup restore tested

---

### Phase 3: Testing Infrastructure (Week 3-4)

**Priority:** P1 - Required for Production

| Order | Task | Owner | Effort | Exit Criteria |
|-------|------|-------|--------|---------------|
| 3.1 | Unit tests - Identity | Backend | 8h | 80% coverage |
| 3.2 | Unit tests - Student | Backend | 6h | 80% coverage |
| 3.3 | Unit tests - Internship | Backend | 6h | 80% coverage |
| 3.4 | Unit tests - Assessment | Backend | 8h | 80% coverage |
| 3.5 | Unit tests - Recommendation | Backend | 8h | 80% coverage |
| 3.6 | Unit tests - Scoring | Backend | 8h | 80% coverage |
| 3.7 | Unit tests - Video | Backend | 6h | 80% coverage |
| 3.8 | Integration tests | QA | 16h | API contracts tested |
| 3.9 | CI/CD pipeline | DevOps | 16h | Automated builds/tests |

**Phase 3 Exit Criteria:**
- [ ] >80% code coverage
- [ ] All tests passing
- [ ] CI/CD pipeline operational

---

### Phase 4: Observability (Week 5-6)

**Priority:** P1 - Required for Production

| Order | Task | Owner | Effort | Exit Criteria |
|-------|------|-------|--------|---------------|
| 4.1 | Deploy Prometheus | DevOps | 4h | Metrics collection working |
| 4.2 | Deploy Grafana | DevOps | 4h | Dashboards created |
| 4.3 | Configure alerting | DevOps | 8h | Alerts firing correctly |
| 4.4 | Add service metrics | Backend | 16h | All services emitting metrics |
| 4.5 | Deploy Loki | DevOps | 4h | Log aggregation working |
| 4.6 | Define SLOs/SLIs | DevOps | 4h | SLO dashboard created |

**Phase 4 Exit Criteria:**
- [ ] Full observability stack operational
- [ ] Alerting configured and tested
- [ ] SLO dashboards created

---

### Phase 5: Complete Frontend Features (Week 7-8)

**Priority:** P1 - Required for MVP

| Order | Task | Owner | Effort | Exit Criteria |
|-------|------|-------|--------|---------------|
| 5.1 | Assessment UI | Frontend | 16h | Full assessment flow working |
| 5.2 | Video Interview UI | Frontend | 12h | Recording/upload working |
| 5.3 | Mobile Navigation | Frontend | 4h | Hamburger menu working |
| 5.4 | Employer Dashboard | Frontend | 24h | Employer features complete |
| 5.5 | Settings Page | Frontend | 8h | User settings editable |
| 5.6 | 404 Page | Frontend | 2h | Custom 404 page |

**Phase 5 Exit Criteria:**
- [ ] All MVP features complete
- [ ] Mobile UX acceptable
- [ ] E2E tests passing

---

### Phase 6: Production Hardening (Week 9-10)

**Priority:** P2 - Recommended for Production

| Order | Task | Owner | Effort | Exit Criteria |
|-------|------|-------|--------|---------------|
| 6.1 | API Gateway (Kong) | DevOps | 8h | Gateway routing working |
| 6.2 | Load Balancer | DevOps | 4h | Traffic distribution working |
| 6.3 | Multi-replica deployment | DevOps | 8h | 3 replicas per service |
| 6.4 | Database read replicas | DevOps | 8h | Read scaling working |
| 6.5 | Kubernetes manifests | DevOps | 16h | K8s deployment working |
| 6.6 | Admin Panel | Frontend | 16h | Admin features complete |

**Phase 6 Exit Criteria:**
- [ ] High availability configured
- [ ] Kubernetes deployment working
- [ ] Load testing passed

---

### Phase 7: Documentation & Training (Week 11-12)

**Priority:** P2 - Required for Operations

| Order | Task | Owner | Effort | Exit Criteria |
|-------|------|-------|--------|---------------|
| 7.1 | API documentation | Backend | 8h | OpenAPI spec complete |
| 7.2 | Architecture diagrams | Architecture | 8h | Diagrams updated |
| 7.3 | Runbooks | DevOps | 16h | All runbooks documented |
| 7.4 | On-call procedures | DevOps | 4h | On-call rotation defined |
| 7.5 | Incident response plan | DevOps | 8h | IR plan documented |
| 7.6 | User documentation | Product | 16h | User guides complete |

**Phase 7 Exit Criteria:**
- [ ] All documentation complete
- [ ] Team trained on procedures
- [ ] On-call rotation staffed

---

## Effort Summary

| Phase | Duration | Total Effort | Resources Required |
|-------|----------|--------------|-------------------|
| Phase 1: Security | 1 week | 16 hours | 2 engineers |
| Phase 2: Backup | 1 week | 18 hours | 1 DevOps |
| Phase 3: Testing | 2 weeks | 76 hours | 3 engineers |
| Phase 4: Observability | 2 weeks | 40 hours | 2 DevOps |
| Phase 5: Frontend | 2 weeks | 66 hours | 2 frontend engineers |
| Phase 6: Hardening | 2 weeks | 60 hours | 2 DevOps |
| Phase 7: Documentation | 2 weeks | 60 hours | Team-wide |

**Total Effort:** 336 hours (~8.5 person-weeks)
**Total Timeline:** 12 weeks with parallel teams
**Minimum Team:** 3 engineers + 2 DevOps + 1 QA

---

## Dependencies

```
Phase 1 (Security) ─────────────────────────────┐
                                                 ├───┐
Phase 2 (Backup) ───────────────────────────────┘   │
                                                     ├─── Phase 6 (Hardening)
Phase 3 (Testing) ─────────────────────────────┐    │
                                               │    │
Phase 4 (Observability) ───────────────────────┘    │
                                                     │
Phase 5 (Frontend) ─────────────────────────────┐   │
                                               │   │
Phase 7 (Documentation) ───────────────────────┴───┘
```

---

## Go/No-Go Checkpoints

### After Phase 1
**Decision:** Continue or Pause
**Criteria:** Security vulnerabilities resolved

### After Phase 3
**Decision:** Continue or Pause
**Criteria:** Test coverage acceptable

### After Phase 4
**Decision:** Proceed to Staging
**Criteria:** Monitoring operational

### After Phase 6
**Decision:** Proceed to Production
**Criteria:** All phases complete

---

## Recommendations

### Do NOT Rebuild From Scratch

**Rationale:**
- Core architecture is sound
- Services are well-implemented
- Rebuild would waste 6+ months of work

### DO Incremental Hardening

**Rationale:**
- Addresses critical gaps
- Preserves working functionality
- Enables production deployment in 12 weeks

### Alternative: Parallel Track

If timeline is too long, consider:

**Track A (Production Readiness):**
- Phase 1: Security (Week 1)
- Phase 2: Backup (Week 2)
- Phase 3: Testing (Week 3-4)
- Phase 4: Observability (Week 5-6)

**Track B (Feature Completion):**
- Phase 5: Frontend (Week 7-8)

**Track C (Scale Preparation):**
- Phase 6: Hardening (Week 9-10)
- Phase 7: Documentation (Week 11-12)

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
