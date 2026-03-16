'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useCurrentUser, useLogout } from '@/hooks/use-auth'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Briefcase,
  Calendar,
  Target,
  ArrowRight,
  User,
  FileText,
  Award,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const _hasHydrated = useAuthStore((state) => state._hasHydrated)
  const { mutate: logout } = useLogout()
  const { data, isLoading, error } = useCurrentUser()

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated && !isLoading) {
      router.push('/login')
    }
  }, [_hasHydrated, isAuthenticated, isLoading, router])

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Glohib<span className="text-cyan-400">.ai</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
              </button>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {data?.data?.email?.split('@')[0] || 'Student'}! 👋
            </h1>
            <p className="text-slate-400">
              Here's what's happening with your internship search
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              title="Applications"
              value="12"
              change="+3 this week"
              icon={Briefcase}
              color="cyan"
            />
            <StatCard
              title="Interviews"
              value="3"
              change="2 upcoming"
              icon={Calendar}
              color="blue"
            />
            <StatCard
              title="Match Score"
              value="85%"
              change="+5% improvement"
              icon={Target}
              color="indigo"
            />
            <StatCard
              title="Profile Views"
              value="48"
              change="+12 this week"
              icon={TrendingUp}
              color="violet"
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <QuickAction
                    href="/dashboard/internships"
                    icon={Search}
                    title="Browse Internships"
                    description="Find your perfect match"
                    color="cyan"
                  />
                  <QuickAction
                    href="/dashboard/profile"
                    icon={User}
                    title="Complete Profile"
                    description="Increase visibility"
                    color="blue"
                  />
                  <QuickAction
                    href="/dashboard/assessments"
                    icon={FileText}
                    title="Take Assessments"
                    description="Showcase your skills"
                    color="indigo"
                  />
                  <QuickAction
                    href="/dashboard/recommendations"
                    icon={Award}
                    title="View Recommendations"
                    description="AI-curated matches"
                    color="violet"
                  />
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                  <Link href="/dashboard/activity" className="text-cyan-400 text-sm hover:text-cyan-300">
                    View all
                  </Link>
                </div>

                <div className="space-y-4">
                  <ActivityItem
                    icon={CheckCircle2}
                    title="Application submitted"
                    description="Software Engineer Intern at TechCorp"
                    time="2 hours ago"
                    color="green"
                  />
                  <ActivityItem
                    icon={Calendar}
                    title="Interview scheduled"
                    description="Data Science Intern at DataFlow"
                    time="Yesterday"
                    color="blue"
                  />
                  <ActivityItem
                    icon={Target}
                    title="Profile viewed"
                    description="Your profile was viewed by InnovateTech"
                    time="2 days ago"
                    color="cyan"
                  />
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
                  <CheckItem text="Basic information" completed />
                  <CheckItem text="Education details" completed />
                  <CheckItem text="Skills & expertise" completed />
                  <CheckItem text="Work experience" />
                  <CheckItem text="Portfolio projects" />
                </div>

                <Link
                  href="/dashboard/profile"
                  className="mt-4 block text-center py-2.5 rounded-xl glass-button-secondary text-sm"
                >
                  Complete Profile
                </Link>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4">Upcoming</h2>
                <div className="space-y-3">
                  <EventCard
                    title="Technical Interview"
                    company="TechCorp"
                    date="Today, 2:00 PM"
                    type="interview"
                  />
                  <EventCard
                    title="Application Deadline"
                    company="InnovateTech"
                    date="Tomorrow, 11:59 PM"
                    type="deadline"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  change: string
  icon: React.ElementType
  color: string
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
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{change}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  color,
}: {
  href: string
  icon: React.ElementType
  title: string
  description: string
  color: string
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'group-hover:bg-cyan-500/20 group-hover:text-cyan-400',
    blue: 'group-hover:bg-blue-500/20 group-hover:text-blue-400',
    indigo: 'group-hover:bg-indigo-500/20 group-hover:text-indigo-400',
    violet: 'group-hover:bg-violet-500/20 group-hover:text-violet-400',
  }

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 ${colorClasses[color]}`}>
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
    </Link>
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
      <span className="text-xs text-slate-500">{time}</span>
    </div>
  )
}

function CheckItem({ text, completed }: { text: string; completed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        completed ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-500'
      }`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      <span className={`text-sm ${completed ? 'text-slate-300' : 'text-slate-500'}`}>{text}</span>
    </div>
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
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm">{title}</h4>
        <p className="text-xs text-slate-400">{company}</p>
      </div>
      <span className="text-xs text-slate-500">{date}</span>
    </div>
  )
}

function MobileNav() {
  const navItems = [
    { href: '/dashboard', icon: Sparkles, label: 'Home' },
    { href: '/dashboard/internships', icon: Briefcase, label: 'Jobs' },
    { href: '/dashboard/assessments', icon: FileText, label: 'Tests' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center py-3 px-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
