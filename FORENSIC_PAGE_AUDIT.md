# FORENSIC PAGE AUDIT
**Date:** March 18, 2026
**Method:** Reading actual source code files
**Purpose:** Document EXACTLY what each page displays

---

## METHODOLOGY
1. Read each page's source code
2. Extract all visible text/content
3. Document all sections, cards, buttons, links
4. Compare across pages for duplicates/issues

---

## PAGE 1: /dashboard (page.tsx)

**File:** `/frontend/web/src/app/dashboard/page.tsx`
**Lines:** 468

### Content Found:

**Navigation:**
- Logo: "Glohib.ai"
- Bell notification icon
- User profile link → /dashboard/profile
- Logout button

**Welcome Section:**
- Heading: "Welcome back, {user-email}! 👋"
- Subtitle: "Here's what's happening with your internship search"

**Stats Grid (4 cards):**
1. "Applications" - "12" - "+3 this week"
2. "Interviews" - "3" - "2 upcoming"
3. "Match Score" - "85%" - "+5% improvement"
4. "Profile Views" - "48" - "+12 this week"

**Quick Actions Section:**
- Heading: "Quick Actions"
- Card 1: "Browse Internships" → /dashboard/internships
- Card 2: "Complete Profile" → /dashboard/profile
- Card 3: "Take Assessments" → /dashboard/assessments
- Card 4: "View Recommendations" → /dashboard/recommendations

**Recent Activity Section:**
- Heading: "Recent Activity"
- Link: "View all" → /dashboard/activity
- Activity 1: "Application submitted" - "Software Engineer Intern at TechCorp" - "2 hours ago"
- Activity 2: "Interview scheduled" - "Data Science Intern at DataFlow" - "Yesterday"
- Activity 3: "Profile viewed" - "Your profile was viewed by InnovateTech" - "2 days ago"

**Sidebar - Profile Completion:**
- Heading: "Profile Completion"
- Progress: "75% Complete" - "+25% to go"
- Items: "Basic Info", "Education", "Experience", "Skills", "Assessments"

**Sidebar - Upcoming Deadlines:**
- Heading: "Upcoming Deadlines"
- Link: "View all" → /dashboard/internships

**Sidebar - Skills Overview:**
- Heading: "Skills Overview"
- Link: "Manage skills" → /dashboard/profile

---

## PAGE 2: /internships (internships/page.tsx)

**File:** `/frontend/web/src/app/dashboard/internships/page.tsx`
**Lines:** 286

### Content Found:

**Search Section:**
- Heading: "Search internships"
- Input placeholder: "Describe your dream internship..."
- Button: "Search"

**Filters:**
- "Remote", "Hybrid", "On-site", "Paid", "Full-time"
- Button: "Clear all"

**Results Count:**
- "Showing X of Y opportunities"

**Internship Cards (6 mock):**
1. "Product Management Intern" - "Acme Corp" - "Remote" - "$5,000" - "92% match"
2. "Data Analyst Intern" - "Tech Inc" - "New York, NY" - "$4,500" - "88% match"
3. "UX Design Intern" - "Design Co" - "San Francisco, CA" - "$4,800" - "85% match"
4. "Software Engineering Intern" - "StartupXYZ" - "Remote" - "$5,500" - "90% match"
5. "Marketing Intern" - "Brand Labs" - "Los Angeles, CA" - "$4,000" - "78% match"
6. "Research Intern" - "Global Health Org" - "Geneva, Switzerland" - "$4,200" - "82% match"

**Each Card Has:**
- "View" button
- "Apply" button (shows alert: "Application feature coming soon!")

**Load More:**
- Button: "Load More Opportunities"

---

## PAGE 3: /applications (applications/page.tsx)

**File:** `/frontend/web/src/app/dashboard/applications/page.tsx`
**Lines:** 89

### Content Found:

**Header:**
- Heading: "My Applications"
- Subtitle: "Track and manage your internship applications"
- Button: "Find More Internships" → /dashboard/internships

**Empty State:**
- Icon: FileText
- Heading: "No applications yet"
- Text: "Start applying to internships to track your progress here."
- Button: "Browse Internships" → /dashboard/internships

**Application List (when populated):**
- Each shows: Company, Title, Location, Status badge
- Links to: /dashboard/applications/[id]

---

## PAGE 4: /profile (profile/page.tsx)

**File:** `/frontend/web/src/app/dashboard/profile/page.tsx`
**Lines:** 144

### Content Found:

**Header:**
- Heading: "My Profile"
- Subtitle: "Manage your personal information and preferences"

**Profile Overview Card:**
- Avatar (initial)
- Name: "Student User" or from user.name
- Email: "student@example.com" or from user.email
- Phone: "+1 (555) 123-4567" (hardcoded)
- Location: "San Francisco, CA" (hardcoded)
- University: "University of California" (hardcoded)
- Buttons: "Edit Profile", "Upload Resume"

**Skills Card:**
- Heading: "Skills"
- Button: "Add Skill"
- Badges: "Product Management", "Data Analysis", "Python", "SQL", "Machine Learning", "Communication"

**Experience Card:**
- Heading: "Experience"
- Button: "Add Experience"
- Entry: "Product Intern" - "Tech Company" - "Jun 2024 - Aug 2024"

**Saved Internships Card:**
- Heading: "Saved Internships"
- Button: "View All"
- Text: "You haven't saved any internships yet."

**Preferences Card:**
- Heading: "Preferences"
- "Email Notifications" - "Enabled"
- "Profile Visibility" - "Public"

---

## PAGE 5: /recommendations (recommendations/page.tsx)

**File:** `/frontend/web/src/app/dashboard/recommendations/page.tsx`
**Lines:** 115

### Content Found:

**Header:**
- Heading: "Recommended For You"
- Subtitle: "AI-powered internship matches based on your profile"

**AI Insight Card:**
- Heading: "AI Match Insights"
- Text: "These internships are matched based on your skills, experience, and preferences. Complete your profile to get more accurate recommendations."

**Empty State:**
- Heading: "No recommendations yet"
- Text: "Complete your profile to receive personalized internship recommendations."
- Button: "Complete Profile" → /dashboard/profile

**Recommendations List (when populated):**
- Each shows: Title, Company, Location, Stipend, Match %
- Buttons: "View", "Apply"

---

## PAGE 6: /saved (saved/page.tsx)

**File:** `/frontend/web/src/app/dashboard/saved/page.tsx`
**Lines:** 91

### Content Found:

**Header:**
- Heading: "Saved Roles"
- Subtitle: "Internships you've saved for later"

**Empty State:**
- Icon: Heart
- Heading: "No saved roles yet"
- Text: "Save interesting internships to review them later."
- Button: "Browse Internships" → /dashboard/internships

**Saved List (2 mock internships):**
1. "Product Management Intern" - "Tech Corp" - "Remote" - "$5,000"
2. "Data Science Intern" - "Health Inc" - "New York, NY" - "$6,000"

**Each Card Has:**
- "View" button
- "Apply" button

---

## PAGE 7: /interviews (interviews/page.tsx)

**File:** `/frontend/web/src/app/dashboard/interviews/page.tsx`
**Lines:** 142

### Content Found:

**Header:**
- Heading: "My Interviews"
- Subtitle: "Track and prepare for your upcoming interviews"

**Stats Cards (3):**
1. "Upcoming" - count of upcoming interviews
2. "Completed" - count of completed interviews
3. "Total" - total count

**Empty State:**
- Heading: "No interviews scheduled"
- Text: "Keep applying to increase your chances of landing interviews."
- Button: "Browse Internships" → /dashboard/internships

**Interview List (2 mock):**
1. "Software Engineering Intern" - "Tech Corp" - "2026-03-20" - "Video Call" - "Upcoming"
2. "Data Analyst Intern" - "Health Inc" - "2026-03-15" - "Phone Screen" - "Completed"

**Interview Prep Tips Card:**
- Heading: "Interview Preparation Tips"
- Before: "Research company", "Review job description", "Prepare questions", "Test tech setup"
- During: "Be confident", "Use STAR method", "Ask clarifying questions", "Show enthusiasm"

---

## PAGE 8: /profile/edit (profile/edit/page.tsx)

**File:** `/frontend/web/src/app/dashboard/profile/edit/page.tsx`
**Lines:** 320

### Content Found:

**Header:**
- Button: "Back to Profile" → /dashboard/profile
- Heading: "Edit Profile"
- Subtitle: "Update your personal information and professional details"

**Basic Information Card:**
- Fields: Name, Email, Phone, Location, Bio, LinkedIn URL, Portfolio URL

**Skills Card:**
- Heading: "Skills"
- Input: "Add a skill..."
- Button: "Add"
- Shows added skills with remove (×) button

**Education Card:**
- Heading: "Education"
- Button: "Add Education"
- Shows added education entries

**Experience Card:**
- Heading: "Experience"
- Button: "Add Experience"
- Shows added experience entries

**Save Actions:**
- Text: "Make sure all information is accurate before saving."
- Button: "Cancel" → /dashboard/profile
- Button: "Save Changes"

---

## PAGE 9: /career-path (career-path/page.tsx)

**File:** `/frontend/web/src/app/dashboard/career-path/page.tsx`
**Lines:** 280

### Content Found:

**Header:**
- Heading: "Career Path Explorer"
- Subtitle: "Discover your ideal career path in global health"

**Career Path Selector (4 options):**
1. "Epidemiologist" - "Research & Analysis"
2. "Public Health Analyst" - "Policy & Analysis"
3. "Clinical Research Coordinator" - "Clinical Research"
4. "Global Health Program Manager" - "Program Management"

**Selected Path Details:**
- Title, Description, Category badge
- Stats: Avg Salary, Job Growth, Key Skills count

**Career Progression Card:**
- Shows 4 levels: entry → mid → senior → leadership
- Each with role name and timeline

**Required Skills Card:**
- Lists skills for selected career
- Tip: "Build these skills through relevant internships"

**Recommended Internships Card:**
- Shows 2 recommended internships
- Button: "View" → /dashboard/internships
- Button: "Browse All Internships"

---

## PAGE 10: /skills-gap (skills-gap/page.tsx)

**File:** `/frontend/web/src/app/dashboard/skills-gap/page.tsx`
**Lines:** 350

### Content Found:

**Header:**
- Heading: "Skills Gap Analysis"
- Subtitle: "Identify skills to develop for your target career"

**Target Career Selector:**
- 4 careers (same as career-path)

**Overall Skills Gap Card:**
- Badge: "Significant Gaps" / "Moderate Gaps" / "Minor Gaps"
- Progress bar showing completion %
- Text: "You have X skills to develop"

**Skills to Develop Card:**
- Lists each missing skill with:
  - Skill name
  - Priority badge (high/medium/low)
  - Current level → Required level
  - Progress bar
  - Recommended resources

**Action Plan Card:**
- Short-term (1-3 months)
- Medium-term (3-6 months)

**Action Buttons:**
- "Find Relevant Internships" → /dashboard/recommendations
- "Explore Career Paths" → /dashboard/career-path

---

## SUMMARY

| Page | Primary Content | Status |
|------|----------------|--------|
| /dashboard | Welcome, 4 stats, Quick Actions, Recent Activity, Profile Progress | ✅ Original restored |
| /internships | Search, Filters, 6 mock internships | ✅ Uses mock data |
| /applications | Application list from API | ✅ API connected |
| /profile | User info, Skills, Experience, Saved, Preferences | ✅ Mixed (some hardcoded) |
| /recommendations | AI-matched internships | ✅ API connected |
| /saved | 2 mock saved internships | ✅ Uses mock data |
| /interviews | 2 mock interviews, Prep tips | ✅ Uses mock data |
| /profile/edit | Full edit form | ✅ Created |
| /career-path | 4 career paths with details | ✅ Created |
| /skills-gap | Skills gap analysis | ✅ Created |

---

## ISSUES FOUND

1. **Dashboard** - Has hardcoded stats values (12, 3, 85%, 48)
2. **Profile** - Has hardcoded values (phone, location, university)
3. **Internships** - Uses mock data, not API
4. **Saved** - Uses mock data, not API
5. **Interviews** - Uses mock data, not API

---

**Audit Complete.**
