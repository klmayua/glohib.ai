'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useCurrentUser } from '@/hooks/use-auth'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Calendar,
  Target,
  ArrowRight,
  FileText,
  Award,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  UserCircle,
  ChevronRight,
  Zap,
  Star,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const { data, error, isLoading: isUserLoading } = useCurrentUser()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isUserLoading) {
    return <DashboardSkeleton />
  }

  if (error || !isAuthenticated) {
    return null
  }

  const userName = data?.data?.email?.split('@')[0] || 'Student'

  return (
    <div className="space-y-6">
      {/* Section 1: Dashboard Header */}
      <DashboardHeader userName={userName} />

      {/* Section 2: Stats Grid */}
      <DashboardStats />

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 3: Recommendations Preview */}
          <DashboardRecommendations />

          {/* Section 4: Activity Feed */}
          <DashboardActivity />
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Section 5: Action Center */}
          <DashboardActions />

          {/* Profile Completion */}
          <ProfileCompletionCard />

          {/* Upcoming Events */}
          <UpcomingEventsCard />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 1: Dashboard Header
// ============================================================================

function DashboardHeader({ userName }: { userName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-slate-400 text-sm">
            Here's your command center for internship success
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300">AI Match Score: 85%</span>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// SECTION 2: Dashboard Stats (4 Cards)
// ============================================================================

function DashboardStats() {
  // Mock data - replace with API call to /api/user/stats
  const stats: Array<{
    id: string
    title: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    icon: React.ElementType
    color: string
  }> = [
    {
      id: 'applications',
      title: 'Applications',
      value: '12',
      change: '+3 this week',
      trend: 'up',
      icon: Briefcase,
      color: 'cyan',
    },
    {
      id: 'saved_roles',
      title: 'Saved Roles',
      value: '8',
      change: '+2 new',
      trend: 'up',
      icon: Star,
      color: 'blue',
    },
    {
      id: 'profile_strength',
      title: 'Profile Strength',
      value: '75%',
      change: '+10% this week',
      trend: 'up',
      icon: UserCircle,
      color: 'indigo',
    },
    {
      id: 'match_score',
      title: 'Match Score',
      value: '85%',
      change: '+5% improvement',
      trend: 'up',
      icon: Target,
      color: 'violet',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          {...stat}
          delay={index * 0.05}
        />
      ))}
    </motion.div>
  )
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  delay,
}: {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
  color: string
  delay: number
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    indigo: 'from-indigo-500/20 to-indigo-600/20 text-indigo-400',
    violet: 'from-violet-500/20 to-violet-600/20 text-violet-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' && <TrendingUpIcon className="w-3 h-3 text-green-400" />}
            <span className={`text-xs ${trend === 'up' ? 'text-green-400' : 'text-slate-500'}`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// SECTION 3: Recommendations Preview
// ============================================================================

function DashboardRecommendations() {
  // Mock data - replace with API call to /api/recommendations/top?limit=3
  const recommendations = [
    {
      id: '1',
      title: 'Software Engineer Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      stipend: 8000,
      matchScore: 95,
      department: 'Engineering',
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'DataFlow Inc',
      location: 'Remote',
      stipend: 7500,
      matchScore: 92,
      department: 'Data',
    },
    {
      id: '3',
      title: 'Product Management Intern',
      company: 'InnovateTech',
      location: 'New York, NY',
      stipend: 6500,
      matchScore: 88,
      department: 'Product',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
        </div>
        <Link
          href="/dashboard/recommendations"
          className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Link
            key={rec.id}
            href={`/dashboard/internships/${rec.id}`}
            className="block group"
          >
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/[0.08] hover:border-cyan-500/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                  {rec.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-400 mt-0.5">
                  <span className="truncate">{rec.company}</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{rec.location}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                  <Target className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-sm font-medium text-green-400">{rec.matchScore}%</span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${rec.stipend.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

// ============================================================================
// SECTION 4: Activity Feed
// ============================================================================

function DashboardActivity() {
  // Mock data - replace with API call to /api/activity/recent
  const activities = [
    {
      id: '1',
      type: 'application',
      icon: CheckCircle2,
      title: 'Application submitted',
      description: 'Software Engineer Intern at TechCorp',
      time: '2 hours ago',
      color: 'green',
    },
    {
      id: '2',
      type: 'interview',
      icon: Calendar,
      title: 'Interview scheduled',
      description: 'Data Science Intern at DataFlow',
      time: 'Yesterday',
      color: 'blue',
    },
    {
      id: '3',
      type: 'profile_view',
      icon: Target,
      title: 'Profile viewed',
      description: 'Your profile was viewed by InnovateTech',
      time: '2 days ago',
      color: 'cyan',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <Link
          href="/dashboard/applications"
          className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} {...activity} />
        ))}
      </div>
    </motion.div>
  )
}

function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  color,
}: {
  icon: React.ElementType
  title: string
  description: string
  time: string
  color: string
}) {
  const colorClasses: Record<string, string> = {
    green: 'text-green-400 bg-green-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
  }

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap">{time}</span>
    </div>
  )
}

// ============================================================================
// SECTION 5: Action Center
// ============================================================================

function DashboardActions() {
  const actions = [
    {
      href: '/dashboard/internships',
      icon: Search,
      title: 'Browse Internships',
      description: 'Find your perfect match',
      color: 'cyan',
    },
    {
      href: '/dashboard/profile',
      icon: UserCircle,
      title: 'Complete Profile',
      description: 'Increase visibility',
      color: 'blue',
    },
    {
      href: '/dashboard/recommendations',
      icon: Award,
      title: 'View Recommendations',
      description: 'AI-curated matches',
      color: 'indigo',
    },
    {
      href: '/dashboard/career-path',
      icon: FileText,
      title: 'Career Path',
      description: 'Plan your journey',
      color: 'violet',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <QuickAction key={action.href} {...action} delay={index * 0.05} />
        ))}
      </div>
    </motion.div>
  )
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  href: string
  icon: React.ElementType
  title: string
  description: string
  color: string
  delay: number
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'group-hover:bg-cyan-500/20 group-hover:text-cyan-400',
    blue: 'group-hover:bg-blue-500/20 group-hover:text-blue-400',
    indigo: 'group-hover:bg-indigo-500/20 group-hover:text-indigo-400',
    violet: 'group-hover:bg-violet-500/20 group-hover:text-violet-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/[0.08] hover:border-cyan-500/30"
      >
        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  )
}

// ============================================================================
// Supporting Cards
// ============================================================================

function ProfileCompletionCard() {
  const completionItems = [
    { text: 'Basic information', completed: true },
    { text: 'Education details', completed: true },
    { text: 'Skills & expertise', completed: true },
    { text: 'Work experience', completed: false },
    { text: 'Portfolio projects', completed: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Profile Completion</h2>
      <div className="relative pt-2">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">75% Complete</span>
          <span className="text-cyan-400">+25% to go</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {completionItems.map((item) => (
          <CheckItem key={item.text} {...item} />
        ))}
      </div>

      <Link
        href="/dashboard/profile"
        className="mt-4 block text-center py-2.5 rounded-xl glass-button-secondary text-sm"
      >
        Complete Profile
      </Link>
    </motion.div>
  )
}

function CheckItem({ text, completed }: { text: string; completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        completed ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-500'
      }`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      <span className={`text-sm ${completed ? 'text-slate-300' : 'text-slate-500'}`}>
        {text}
      </span>
    </div>
  )
}

function UpcomingEventsCard() {
  const events = [
    {
      title: 'Technical Interview',
      company: 'TechCorp',
      date: 'Today, 2:00 PM',
      type: 'interview',
    },
    {
      title: 'Application Deadline',
      company: 'InnovateTech',
      date: 'Tomorrow, 11:59 PM',
      type: 'deadline',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-2xl p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Upcoming</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <EventCard key={event.title} {...event} />
        ))}
      </div>
    </motion.div>
  )
}

function EventCard({
  title,
  company,
  date,
  type,
}: {
  title: string
  company: string
  date: string
  type: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        type === 'interview' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
      }`}>
        {type === 'interview' ? <Calendar className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate">{title}</h4>
        <p className="text-xs text-slate-400 truncate">{company}</p>
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap">{date}</span>
    </div>
  )
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Skeleton className="h-24 rounded-2xl" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
