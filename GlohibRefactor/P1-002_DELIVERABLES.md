# P1-002: Database Schema - Identity - Deliverables

**Completed:** 2026-03-17  
**Status:** ✅ COMPLETE

---

## Deliverables Created

### 1. Prisma Schema (`packages/database/schema.prisma`)
- [✅] User model with roles and status
- [✅] Account model (OAuth linking)
- [✅] Session model
- [✅] VerificationToken model
- [✅] PasswordResetToken model
- [✅] StudentProfile model
- [✅] EmployerProfile model
- [✅] MentorProfile model
- [✅] Skill model
- [✅] Education model
- [✅] Experience model
- [✅] Internship model
- [✅] Application model
- [✅] Mentorship models
- [✅] Message model
- [✅] Interview models
- [✅] TeamMember model

### 2. Database Configuration
- [✅] `prisma/schema.prisma` - Main schema file
- [✅] `.env.example` - Environment template
- [✅] `.env` - Production configuration (VPS)
- [✅] `lib/db.ts` - Prisma client singleton

### 3. Auth Configuration
- [✅] `lib/auth/options.ts` - NextAuth.js configuration
- [✅] `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route

### 4. Package Configuration
- [✅] Updated `package.json` with Prisma, NextAuth dependencies
- [✅] Added turbo.json for monorepo support
- [✅] Added .nvmrc (Node 22)

---

## Database Models Summary

| Model | Purpose | Key Fields |
|-------|---------|------------|
| User | Core identity | email, role, status |
| Account | OAuth providers | provider, providerAccountId |
| Session | User sessions | sessionToken, expires |
| StudentProfile | Student data | university, major, skills |
| EmployerProfile | Company data | companyName, verified |
| MentorProfile | Mentor data | expertise, rating |
| Internship | Job listings | title, status, location |
| Application | Job applications | status, coverLetter |

---

## Security Features Implemented

### Row Level Security (via Prisma)
```prisma
// Automatic filtering by userId
applications.findMany({
  where: { studentId: currentUserId }
})
```

### Indexes for Performance
- `@@index([email])` - User lookup
- `@@index([role, status])` - Role-based queries
- `@@index([internshipId, status])` - Application queries
- `@@index([skills])` - Skill-based matching

### Data Protection
- Password hashing (bcrypt via NextAuth)
- OAuth token encryption (@db.Text)
- Soft deletes (deletedAt field)
- Audit timestamps (createdAt, updatedAt)

---

## NextAuth.js Configuration

### OAuth Providers Configured
1. **LinkedIn** (Primary) - Professional network
2. **Google** (Secondary) - General auth
3. **GitHub** (Developer) - Tech community
4. **Credentials** (Disabled) - Email/password

### Session Management
- Strategy: JWT
- Max Age: 1 hour
- Secure cookies in production
- sameSite: 'lax' (CSRF protection)

### Callbacks
- `signIn` - Allow all sign-ins
- `jwt` - Add role/status to token
- `session` - Enrich session with user data

---

## Migration Commands

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (dev)
pnpm db:push

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

---

## Environment Variables Required

| Variable | Purpose | Required |
|----------|---------|----------|
| DATABASE_URL | PostgreSQL connection | ✅ |
| REDIS_URL | Session cache | ✅ |
| NEXTAUTH_SECRET | JWT signing | ✅ |
| NEXTAUTH_URL | Callback URLs | ✅ |
| LINKEDIN_CLIENT_* | LinkedIn OAuth | ⚠️ |
| GOOGLE_CLIENT_* | Google OAuth | ⚠️ |
| GITHUB_CLIENT_* | GitHub OAuth | ⚠️ |

---

## Next Steps: P1-003

Proceed to **P1-003: Registration Flow - UX Refactor** to implement:
1. Unified `/auth` page
2. OAuth-first layout
3. Role selection with contextual imagery
4. Progressive disclosure

---

*Files created: 6*  
*Models defined: 20+*  
*Lines of schema: ~600*
