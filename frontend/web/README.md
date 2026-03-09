# Glohib.ai Frontend

Next.js 14 frontend for the Glohib.ai internship matching platform.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- Backend services running (see root README)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── dashboard/         # Protected dashboard pages
│       ├── page.tsx       # Dashboard home
│       ├── internships/   # Internship feed
│       └── profile/       # User profile
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities and API clients
    ├── api.ts             # API client
    ├── auth-store.ts      # Auth state (Zustand)
    ├── providers.tsx      # React Query provider
    └── utils.ts           # Utility functions
```

## Features

### Authentication
- Email/password registration and login
- JWT token management
- Protected routes
- Automatic token refresh

### Dashboard
- Overview of applications and matches
- Quick actions navigation
- Recent activity feed

### Internship Feed
- Browse all internships
- AI-powered recommendations
- Search and filter (remote, paid)
- One-click apply

### Profile
- Edit personal information
- Manage skills
- Social links (LinkedIn, GitHub)

## API Integration

The frontend connects to these backend services:

| Service | Port | Purpose |
|---------|------|---------|
| Identity | 8080 | Authentication, users |
| Internship | 8083 | Internship CRUD, applications |
| Recommendation | 8007 | AI recommendations |
| Video | 4000 | Video uploads, interviews |

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Type check with TypeScript
```

## Environment Variables

```env
API_IDENTITY=http://localhost:8080
API_INTERNSHIP=http://localhost:8083
API_RECOMMENDATION=http://localhost:8007
API_VIDEO=http://localhost:4000
```

## Next Steps

- [ ] Complete profile update API integration
- [ ] Add internship detail page
- [ ] Implement assessment UI
- [ ] Add video interview recording
- [ ] Employer dashboard
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Mobile responsive improvements
