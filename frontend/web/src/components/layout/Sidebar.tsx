'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { memo } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Sparkles,
  User,
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Internships', href: '/dashboard/internships', icon: Briefcase },
  { name: 'Applications', href: '/dashboard/applications', icon: FileText },
  { name: 'Recommendations', href: '/dashboard/recommendations', icon: Sparkles },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

function Sidebar() {
  const pathname = usePathname()

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
            const isActive = pathname === item.href
            
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
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors duration-150"
          >
            <span>Settings</span>
          </Link>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default memo(Sidebar)
