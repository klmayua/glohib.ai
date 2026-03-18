# Glohib.ai Dependency Matrix

**Generated:** 2026-03-17  
**Project Root:** `/root/projects/GlohibAI`

---

## FRONTEND DEPENDENCIES

### Core Framework
| Package | Version | Purpose | Critical |
|---------|---------|---------|----------|
| next | 14.x | React framework | 🔴 Yes |
| react | 18.x | UI library | 🔴 Yes |
| react-dom | 18.x | React DOM | 🔴 Yes |
| typescript | 5.x | Type safety | 🔴 Yes |

### State Management
| Package | Version | Purpose | Critical |
|---------|---------|---------|----------|
| @tanstack/react-query | 5.x | Server state | 🔴 Yes |
| zustand | 4.x | Client state | 🟡 Yes |

### API & Data
| Package | Version | Purpose | Critical |
|---------|---------|---------|----------|
| axios | 1.x | HTTP client | 🔴 Yes |

### UI & Styling
| Package | Version | Purpose | Critical |
|---------|---------|---------|----------|
| tailwindcss | 3.x | CSS framework | 🔴 Yes |
| framer-motion | 11.x | Animations | 🟡 Yes |
| lucide-react | latest | Icons | 🟡 Yes |

---

## BACKEND DEPENDENCIES

### Identity Service (Go)
| Package | Purpose | Critical |
|---------|---------|----------|
| gin-gonic/gin | Web framework | 🔴 |
| gorm/gorm | ORM | 🔴 |
| golang-jwt/jwt | JWT handling | 🔴 |
| redis/go-redis | Cache/session | 🟡 |
| bcrypt | Password hashing | 🔴 |

### Student Service (Go)
| Package | Purpose | Critical |
|---------|---------|----------|
| gin-gonic/gin | Web framework | 🔴 |
| gorm/gorm | ORM | 🔴 |

### Internship Service (Go)
| Package | Purpose | Critical |
|---------|---------|----------|
| gin-gonic/gin | Web framework | 🔴 |
| gorm/gorm | ORM | 🔴 |

### Assessment Service (Go)
| Package | Purpose | Critical |
|---------|---------|----------|
| gin-gonic/gin | Web framework | 🔴 |
| gorm/gorm | ORM | 🔴 |

### Recommendation Service (Python)
| Package | Purpose | Critical |
|---------|---------|----------|
| fastapi | Web framework | 🔴 |
| uvicorn | ASGI server | 🔴 |
| sqlalchemy | ORM | 🔴 |
| redis | Cache | 🟡 |

### Scoring Service (Python)
| Package | Purpose | Critical |
|---------|---------|----------|
| fastapi | Web framework | 🔴 |
| uvicorn | ASGI server | 🔴 |

### Video Service (Node.js)
| Package | Purpose | Critical |
|---------|---------|----------|
| express | Web framework | 🔴 |
| socket.io | WebSocket | 🟡 |
| fluent-ffmpeg | Video processing | 🔴 |

---

## INFRASTRUCTURE DEPENDENCIES

### Database
| Service | Version | Purpose | Critical |
|---------|---------|---------|----------|
| PostgreSQL | 16 | Primary database | 🔴 |
| pgvector | latest | Vector embeddings | 🟡 |

### Cache
| Service | Version | Purpose | Critical |
|---------|---------|---------|----------|
| Redis | 7 | Caching, sessions | 🔴 |

### Storage
| Service | Version | Purpose | Critical |
|---------|---------|---------|----------|
| MinIO | latest | Object storage | 🔴 |

### Container Runtime
| Service | Version | Purpose | Critical |
|---------|---------|---------|----------|
| Docker | 29.x | Containerization | 🔴 |
| Docker Compose | 5.x | Orchestration | 🔴 |

---

## DEPENDENCY HEALTH CHECK

### Outdated Packages (Needs Update)
| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| next | 14.x | 15.x | 🟡 Medium |
| tailwindcss | 3.x | 4.x | 🟡 Medium |
| framer-motion | 11.x | 12.x | 🟢 Low |

### Security Advisories
| Package | CVE | Severity | Action |
|---------|-----|----------|--------|
| *(None found)* | - | - | ✅ All clear |

---

## RECOMMENDED ADDITIONS (PWC 2030 Standard)

### Missing Critical Dependencies
| Package | Purpose | Priority |
|---------|---------|----------|
| @auth/prisma-adapter | NextAuth adapter | 🔴 P0 |
| @prisma/client | Database ORM | 🔴 P0 |
| prisma | Database toolkit | 🔴 P0 |
| zod | Schema validation | 🔴 P0 |
| react-hook-form | Form handling | 🟡 P1 |
| @radix-ui/* | UI primitives | 🟡 P1 |

### Development Dependencies
| Package | Purpose | Priority |
|---------|---------|----------|
| eslint | Linting | 🔴 P0 |
| prettier | Formatting | 🟡 P1 |
| husky | Git hooks | 🟡 P1 |
| commitlint | Commit linting | 🟡 P1 |
| vitest | Testing | 🟡 P1 |
| playwright | E2E testing | 🟡 P1 |

---

## MONOREPO STRUCTURE (Recommended)

```
glohib-ai/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # API gateway (optional)
│   └── admin/            # Admin dashboard
├── packages/
│   ├── database/         # Prisma schema & client
│   ├── auth/             # Auth configuration
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configs
│   └── utils/            # Shared utilities
├── services/             # Existing Go/Python services
└── infrastructure/       # Terraform, Docker configs
```

---

*Last updated: 2026-03-17*
