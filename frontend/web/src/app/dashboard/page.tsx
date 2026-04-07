'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import Link from 'next/link'
import {
  Briefcase,
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
  Calendar,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

interface DashboardData {
  user: any
  stats: {
    applications: number
    savedRoles: number
    profileStrength: number
    totalOpportunities: number
    unreadNotifications: number
  }
  recommendedInternships: any[]
  recentActivities: any[]
  notifications: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [data, setData] = React.useState<DashboardData | null>(null)
  const [isFetching, setIsFetching] = React.useState(true)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login')
      return
    }
    if (isAuthenticated) {
      fetchDashboard()
    }
  }, [isAuthenticated, isLoading, router])

  const fetchDashboard = async () => {
    try {
      setIsFetching(true)
      const res = await fetch('/api/dashboard/stats', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setIsFetching(false)
    }
  }

  if (isLoading || isFetching || !data) {
    return <DashboardSkeleton />
  }

  const userName = data.user?.name || data.user?.email?.split('@')[0] || 'User'

  return (
    <div className="space-y-6">
      {/* Section 1: Dashboard Header */}
      <DashboardHeader userName={userName} totalOpportunities={data.stats.totalOpportunities} />

      {/* Section 2: Stats Grid */}
      <DashboardStats stats={data.stats} />

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 3: Recommendations Preview */}
          <DashboardRecommendations recommendations={data.recommendedInternships} />

          {/* Section 4: Activity Feed */}
          <DashboardActivity activities={data.recentActivities} />
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Section 5: Action Center */}
          <DashboardActions />

          {/* Profile Completion */}
          <ProfileCompletionCard completeness={data.stats.profileStrength} />

          {/* Upcoming Events */}
          <UpcomingEventsCard applications={data.recentActivities} />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 1: Dashboard Header
// ============================================================================

function DashboardHeader({ userName, totalOpportunities }: { userName: string; totalOpportunities: number }) {
  return (
    <div className="glass-card rounded-2xl p-6">
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
          <span className="text-sm text-cyan-300">{totalOpportunities} opportunities available</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 2: Dashboard Stats
// ============================================================================

function DashboardStats({ stats }: { stats: any }) {
  const statItems = [
    {
      id: 'applications',
      title: 'Applications',
      value: String(stats.applications),
      change: stats.applications > 0 ? 'Active' : 'Start applying',
      trend: 'up' as const,
      icon: Briefcase,
      color: 'cyan',
    },
    {
      id: 'saved_roles',
      title: 'Saved Roles',
      value: String(stats.savedRoles),
      change: stats.savedRoles > 0 ? `${stats.savedRoles} saved` : 'None yet',
      trend: stats.savedRoles > 0 ? 'up' as const : 'neutral' as const,
      icon: Award,
      color: 'blue',
    },
    {
      id: 'profile_strength',
      title: 'Profile Strength',
      value: `${stats.profileStrength}%`,
      change: stats.profileStrength >= 75 ? 'Looking great!' : 'Keep building',
      trend: stats.profileStrength >= 50 ? 'up' as const : 'neutral' as const,
      icon: UserCircle,
      color: 'indigo',
    },
    {
      id: 'match_score',
      title: 'Opportunities',
      value: String(stats.totalOpportunities),
      change: 'Total available',
      trend: 'up' as const,
      icon: Search,
      color: 'violet',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <StatCard key={stat.id} {...stat} delay={index * 0.05} />
      ))}
    </div>
  )
}

function StatCard({
  title, value, change, trend, icon: Icon, color, delay,
}: {
  title: string; value: string; change: string; trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType; color: string; delay: number;
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    indigo: 'from-indigo-500/20 to-indigo-600/20 text-indigo-400',
    violet: 'from-violet-500/20 to-violet-600/20 text-violet-400',
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
            <span className={`text-xs ${trend === 'up' ? 'text-green-400' : 'text-slate-500'}`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 3: Recommendations Preview
// ============================================================================

function DashboardRecommendations({ recommendations }: { recommendations: any[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
        </div>
        <p className="text-slate-400 text-sm">Complete your profile to get personalized recommendations.</p>
        <Link href="/dashboard/profile" className="text-cyan-400 text-sm hover:text-cyan-300 mt-2 inline-block">
          Complete Profile →
        </Link>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
        </div>
        <Link href="/dashboard/recommendations" className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec) => (
          <Link key={rec.id} href={`/dashboard/internships/${rec.id}`} className="block group">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/[0.08] hover:border-cyan-500/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                  {rec.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-400 mt-0.5">
                  <span className="truncate">{rec.employer?.user?.name || rec.employer?.companyName}</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{rec.location}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                  <Briefcase className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-sm font-medium text-green-400">{rec.match || 0}%</span>
                </div>
                {rec.stipend && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />${rec.stipend.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 4: Activity Feed
// ============================================================================

function DashboardActivity({ activities }: { activities: any[] }) {
  if (activities.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <p className="text-slate-400 text-sm">No recent activity. Start applying to internships!</p>
      </div>
    )
  }

  const statusIcons: Record<string, { icon: React.ElementType; color: string }> = {
    SUBMITTED: { icon: FileText, color: 'blue' },
    UNDER_REVIEW: { icon: Search, color: 'cyan' },
    INTERVIEWING: { icon: Calendar, color: 'violet' },
    OFFERED: { icon: Award, color: 'green' },
    ACCEPTED: { icon: CheckCircle2, color: 'green' },
    REJECTED: { icon: Briefcase, color: 'red' },
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <Link href="/dashboard/applications" className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map((activity) => {
          const statusConfig = statusIcons[activity.status] || { icon: FileText, color: 'cyan' }
          const Icon = statusConfig.icon
          return (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${statusConfig.color}-500/10`}>
                <Icon className={`w-5 h-5 text-${statusConfig.color}-400`} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{activity.status.replace(/_/g, ' ')}</h4>
                <p className="text-sm text-slate-400">{activity.internship?.title}</p>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {new Date(activity.updatedAt).toLocaleDateString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 5: Action Center
// ============================================================================

function DashboardActions() {
  const actions = [
    { href: '/dashboard/internships', icon: Search, title: 'Browse Internships', description: 'Find your perfect match', color: 'cyan' },
    { href: '/dashboard/profile', icon: UserCircle, title: 'Complete Profile', description: 'Increase visibility', color: 'blue' },
    { href: '/dashboard/recommendations', icon: Award, title: 'View Recommendations', description: 'AI-curated matches', color: 'indigo' },
    { href: '/dashboard/applications', icon: FileText, title: 'My Applications', description: 'Track progress', color: 'violet' },
  ]

  const colorClasses: Record<string, string> = {
    cyan: 'group-hover:bg-cyan-500/20 group-hover:text-cyan-400',
    blue: 'group-hover:bg-blue-500/20 group-hover:text-blue-400',
    indigo: 'group-hover:bg-indigo-500/20 group-hover:text-indigo-400',
    violet: 'group-hover:bg-violet-500/20 group-hover:text-violet-400',
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/[0.08] hover:border-cyan-500/30">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 ${colorClasses[action.color]}`}>
              <action.icon className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{action.title}</h3>
              <p className="text-sm text-slate-400">{action.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Supporting Cards
// ============================================================================

function ProfileCompletionCard({ completeness }: { completeness: number }) {
  const items = [
    { text: 'Basic information', completed: completeness >= 20 },
    { text: 'Education details', completed: completeness >= 40 },
    { text: 'Skills & expertise', completed: completeness >= 60 },
    { text: 'Work experience', completed: completeness >= 80 },
    { text: 'Portfolio & bio', completed: completeness >= 95 },
  ]

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Profile Completion</h2>
      <div className="relative pt-2">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">{completeness}% Complete</span>
          <span className="text-cyan-400">{100 - completeness}% to go</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${completeness}%` }} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item.text} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.completed ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-500'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className={`text-sm ${item.completed ? 'text-slate-300' : 'text-slate-500'}`}>{item.text}</span>
          </div>
        ))}
      </div>
      <Link href="/dashboard/profile" className="mt-4 block text-center py-2.5 rounded-xl glass-button-secondary text-sm">
        Complete Profile
      </Link>
    </div>
  )
}

function UpcomingEventsCard({ applications }: { applications: any[] }) {
  const upcoming = applications.filter(a =>
    a.status === 'INTERVIEWING' || a.status === 'UNDER_REVIEW'
  ).slice(0, 3)

  if (upcoming.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Upcoming</h2>
        <p className="text-slate-400 text-sm">No upcoming events. Apply to internships to get started!</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Upcoming</h2>
      <div className="space-y-3">
        {upcoming.map((app) => (
          <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/20 text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm truncate">{app.status.replace(/_/g, ' ')}</h4>
              <p className="text-xs text-slate-400 truncate">{app.internship?.title}</p>
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(app.updatedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
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
