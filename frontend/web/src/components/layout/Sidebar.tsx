'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { memo } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Sparkles,
  User,
  Heart,
  Calendar,
  Target,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react'
import { useLogout } from '@/hooks/use-auth'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Internships', href: '/dashboard/internships', icon: Briefcase },
  { name: 'Applications', href: '/dashboard/applications', icon: FileText },
  { name: 'Recommendations', href: '/dashboard/recommendations', icon: Sparkles },
  { name: 'Saved Roles', href: '/dashboard/saved', icon: Heart },
  { name: 'Interviews', href: '/dashboard/interviews', icon: Calendar },
  { name: 'Skills Gap', href: '/dashboard/skills-gap', icon: Target },
  { name: 'Career Path', href: '/dashboard/career-path', icon: TrendingUp },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 border-r border-white/[0.08] z-50 bg-[#020617]">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="ml-3 text-base font-medium text-white">
            Glohib.ai
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-4 py-3 mx-3 rounded-lg
                  text-sm font-medium
                  border border-transparent
                  transition-colors duration-150
                  focus:outline-none focus-visible:outline-none focus:ring-0
                  ${isActive
                    ? 'bg-white/5 text-white border-white/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-sky-400/60 rounded-r" />
                )}

                <item.icon className="w-5 h-5 opacity-70 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/[0.08] space-y-1">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
              pathname === '/dashboard/settings'
                ? 'bg-white/5 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 opacity-70" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 disabled:opacity-50"
          >
            <LogOut className="w-5 h-5 opacity-70" />
            <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default memo(Sidebar)
