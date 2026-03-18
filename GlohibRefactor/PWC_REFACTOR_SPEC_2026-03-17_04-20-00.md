# =============================================================================
# GLOHIB.AI - ATOMIC LEVEL 2030 STANDARD PWC CLASS REFACTORING
# Production-Ready Implementation Specification for Qwen Execution
# =============================================================================
# Timestamp: 2026-03-17T04:20:00Z
# Version: 1.0.0-PWC-PROD
# Classification: CONFIDENTIAL - PRODUCTION REFACTOR
# Author: Claude (Anthropic)
# Executor: Qwen (Alibaba Cloud)
# =============================================================================

metadata:
  project_name: "Glohib.ai Enterprise Refactor"
  codename: "PHOENIX-2030"
  status: "PRODUCTION_SPEC"
  priority: "P0-CRITICAL"
  estimated_duration: "6-8 weeks"
  team_size: "3-4 engineers"

  standards_compliance:
    - "WCAG 2.2 AAA"
    - "GDPR 2024"
    - "SOC 2 Type II"
    - "ISO 27001:2022"
    - "OWASP ASVS 4.0"
    - "PWC Digital Trust Framework"

  tech_stack_2030:
    frontend:
      framework: "Next.js 15+ (App Router)"
      language: "TypeScript 5.4+"
      styling: "Tailwind CSS 4.0 + CSS Layers"
      state: "Zustand + TanStack Query v5"
      forms: "React Hook Form + Zod"
      ui_library: "Radix UI primitives + Custom Design System"
      animations: "Framer Motion + CSS View Transitions"

    backend:
      runtime: "Node.js 22 LTS"
      framework: "Next.js API Routes + tRPC"
      database: "PostgreSQL 16 + Prisma ORM"
      cache: "Redis 7 + Upstash"
      search: "Meilisearch 1.6"
      queue: "BullMQ + Redis"

    infrastructure:
      hosting: "Vercel Edge + AWS"
      cdn: "Cloudflare"
      storage: "Cloudflare R2"
      monitoring: "Datadog + Sentry"
      ci_cd: "GitHub Actions + Terraform"

# =============================================================================
# PHASE 0: FOUNDATION & AUDIT (Week 1)
# =============================================================================

phase_0_foundation:
  name: "Foundation & Technical Audit"
  duration: "5 days"
  owner: "Tech Lead"

  tasks:
    - id: "P0-001"
      name: "Codebase Archaeology"
      description: "Complete audit of existing Glohib.ai implementation"
      atomic_steps:
        - "Document all existing pages and routes"
        - "Map current component hierarchy"
        - "Identify hardcoded data vs dynamic content"
        - "Catalog all third-party dependencies"
        - "Security vulnerability assessment"
        - "Performance baseline measurement"
      deliverables:
        - "AUDIT_REPORT.md"
        - "DEPENDENCY_MATRIX.csv"
        - "SECURITY_GAP_ANALYSIS.md"

    - id: "P0-002"
      name: "Repository Setup"
      description: "Initialize production-grade repository structure"
      atomic_steps:
        - "Create monorepo with Turborepo"
        - "Setup pnpm workspaces"
        - "Configure ESLint 9 (flat config)"
        - "Configure Prettier 3"
        - "Setup Husky + lint-staged"
        - "Create .nvmrc with Node 22"
        - "Setup commitlint (Conventional Commits)"
      deliverables:
        - "Repository initialized"
        - "CI pipeline skeleton"

    - id: "P0-003"
      name: "Design System Foundation"
      description: "Establish atomic design system tokens"
      atomic_steps:
        - "Define color tokens (OKLCH color space)"
        - "Define typography scale (fluid type)"
        - "Define spacing system (4px base)"
        - "Define shadow/elevation tokens"
        - "Define animation timing tokens"
        - "Create CSS custom properties"
      deliverables:
        - "packages/design-system/tokens.css"
        - "Storybook configuration"

# =============================================================================
# PHASE 1: AUTHENTICATION & IDENTITY (Week 1-2)
# =============================================================================

phase_1_auth_identity:
  name: "Authentication & Identity Refactor"
  duration: "10 days"
  owner: "Backend Engineer + Frontend Engineer"

  epic_description: |
    Complete overhaul of authentication flow implementing 2030 standards.
    OAuth-first approach with LinkedIn primary, progressive profiling,
    and role-specific onboarding journeys.

  user_stories:
    - "As a student, I want to sign up with LinkedIn so that my profile is pre-populated"
    - "As an employer, I want company verification so that students trust our listings"
    - "As a mentor, I want to showcase my expertise so that students can find me"

  tasks:
    - id: "P1-001"
      name: "Auth Architecture Design"
      description: "Design secure, scalable auth system"
      atomic_steps:
        - "Implement NextAuth.js v5 (Auth.js)"
        - "Configure OAuth providers: LinkedIn (primary), Google (secondary)"
        - "Remove GitHub from primary auth (keep for developers)"
        - "Setup JWT strategy with refresh tokens"
        - "Implement PKCE for OAuth flows"
        - "Configure session management (Redis)"
        - "Setup CSRF protection"
      deliverables:
        - "apps/web/lib/auth/config.ts"
        - "apps/web/lib/auth/providers.ts"

    - id: "P1-002"
      name: "Database Schema - Identity"
      description: "Prisma schema for user identity"
      atomic_steps:
        - "Create User model with role enum"
        - "Create Account model (OAuth linking)"
        - "Create Session model"
        - "Create VerificationToken model"
        - "Create PasswordResetToken model"
        - "Add indexes for email, providerAccountId"
        - "Setup Row Level Security policies"

    - id: "P1-003"
      name: "Registration Flow - UX Refactor"
      description: "Complete redesign of registration UX"
      atomic_steps:
        - "Create /auth page (unified entry)"
        - "Design OAuth-first layout (LinkedIn prominent)"
        - "Implement role selection with contextual imagery"
        - "Create role-specific copy"
        - "Add email option (secondary)"
        - "Implement progressive disclosure"
        - "Add social proof elements"

    - id: "P1-004"
      name: "Email Verification System"
      description: "Secure email verification with magic links"
      atomic_steps:
        - "Create verification token service"
        - "Implement SendGrid integration"
        - "Design email templates (React Email)"
        - "Create verification API endpoint"
        - "Add rate limiting (5 attempts/hour)"
        - "Implement token expiration (24h)"
        - "Add resend functionality with backoff"

    - id: "P1-005"
      name: "Login Flow Optimization"
      description: "Streamlined login with smart defaults"
      atomic_steps:
        - "Detect previous auth method (localStorage)"
        - "Show 'Continue with LinkedIn' if used before"
        - "Implement 'Remember me' functionality"
        - "Add password visibility toggle"
        - "Implement rate limiting on login"
        - "Add CAPTCHA after 3 failed attempts"
        - "Create password reset flow"

# =============================================================================
# PHASE 2: ONBOARDING & PROFILE (Week 2-3)
# =============================================================================

phase_2_onboarding:
  name: "Progressive Onboarding & Profile"
  duration: "10 days"
  owner: "Frontend Engineer + Product Designer"

  tasks:
    - id: "P2-001"
      name: "Student Onboarding Flow"
      description: "5-step student onboarding wizard"
      atomic_steps:
        - "Step 1: Basic Info (auto-filled from OAuth)"
        - "Step 2: Education (university, major, graduation year)"
        - "Step 3: Skills (tag input with suggestions)"
        - "Step 4: Interests (industry, role types)"
        - "Step 5: Preferences (location, remote/hybrid)"
        - "Implement step validation with Zod"
        - "Add progress indicator"
        - "Enable save-and-resume"

    - id: "P2-002"
      name: "Employer Onboarding Flow"
      description: "Company verification and setup"
      atomic_steps:
        - "Step 1: Company Info (name, website, size)"
        - "Step 2: Verification (email domain check + document upload)"
        - "Step 3: Hiring Needs (roles, departments)"
        - "Step 4: Company Profile (logo, description, culture)"
        - "Step 5: Team Members (invite colleagues)"

    - id: "P2-003"
      name: "Mentor Onboarding Flow"
      description: "Mentor profile and availability setup"
      atomic_steps:
        - "Step 1: Professional Info (current role, company)"
        - "Step 2: Expertise Areas (skills, industries)"
        - "Step 3: Mentoring Preferences (commitment, format)"
        - "Step 4: Availability (calendar integration)"
        - "Step 5: Bio & Photo (complete profile)"

    - id: "P2-004"
      name: "Profile Management"
      description: "Editable profile pages for all roles"
      atomic_steps:
        - "Create /profile page with tabs"
        - "Implement avatar upload (Cloudflare R2)"
        - "Add resume/CV upload for students"
        - "Create company profile page (employers)"
        - "Add public profile view"
        - "Implement profile completeness score"
        - "Add SEO-friendly public URLs"

# =============================================================================
# PHASE 3: CORE PLATFORM FEATURES (Week 3-5)
# =============================================================================

phase_3_core_features:
  name: "Core Platform Implementation"
  duration: "15 days"
  owner: "Full-Stack Engineers (2)"

  tasks:
    - id: "P3-001"
      name: "Internship Management System"
      description: "Full CRUD for internship listings"

    - id: "P3-002"
      name: "AI-Powered Matching Engine"
      description: "Smart matching between students and internships"

    - id: "P3-003"
      name: "Application System"
      description: "End-to-end application workflow"

    - id: "P3-004"
      name: "Search & Discovery"
      description: "Powerful search with filters"

    - id: "P3-005"
      name: "Dashboard Implementation"
      description: "Role-specific dashboards"

# =============================================================================
# PHASE 4: MESSAGING & NOTIFICATIONS (Week 5-6)
# =============================================================================

phase_4_messaging:
  name: "Messaging & Notification System"
  duration: "10 days"
  owner: "Backend Engineer + Frontend Engineer"

  tasks:
    - id: "P4-001"
      name: "Real-time Messaging"
      description: "In-platform messaging system"

    - id: "P4-002"
      name: "Notification System"
      description: "Multi-channel notification delivery"

# =============================================================================
# PHASE 5: MENTORSHIP FEATURES (Week 6-7)
# =============================================================================

phase_5_mentorship:
  name: "Mentorship Platform"
  duration: "10 days"
  owner: "Full-Stack Engineer"

  tasks:
    - id: "P5-001"
      name: "Mentor Discovery"
      description: "Find and connect with mentors"

    - id: "P5-002"
      name: "Mentorship Management"
      description: "Manage ongoing mentorships"

# =============================================================================
# PHASE 6: ADMIN & ANALYTICS (Week 7-8)
# =============================================================================

phase_6_admin:
  name: "Admin Panel & Analytics"
  duration: "10 days"
  owner: "Full-Stack Engineer"

  tasks:
    - id: "P6-001"
      name: "Admin Dashboard"
      description: "Platform administration"

    - id: "P6-002"
      name: "Analytics & Reporting"
      description: "Platform-wide analytics"

# =============================================================================
# PHASE 7: PERFORMANCE & SECURITY (Week 8)
# =============================================================================

phase_7_performance:
  name: "Performance Optimization & Security Hardening"
  duration: "10 days"
  owner: "DevOps + Security Engineer"

  tasks:
    - id: "P7-001"
      name: "Performance Optimization"
      description: "2030-standard performance"

    - id: "P7-002"
      name: "Security Hardening"
      description: "Enterprise-grade security"

    - id: "P7-003"
      name: "Accessibility (a11y)"
      description: "WCAG 2.2 AAA compliance"

# =============================================================================
# PHASE 8: DEPLOYMENT & LAUNCH (Week 8)
# =============================================================================

phase_8_deployment:
  name: "Production Deployment"
  duration: "5 days"
  owner: "DevOps Engineer"

  tasks:
    - id: "P8-001"
      name: "Infrastructure Setup"
      description: "Production infrastructure"

    - id: "P8-002"
      name: "CI/CD Pipeline"
      description: "Automated deployment"

    - id: "P8-003"
      name: "Launch Preparation"
      description: "Go-live checklist"

# =============================================================================
# END OF SPECIFICATION
# =============================================================================
