'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, Globe, User } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', route: '/' },
  { icon: Search, label: 'Explore', route: '/dashboard/internships' },
  { icon: Globe, label: 'Global Map', route: '/dashboard/map' },
  { icon: User, label: 'Profile', route: '/dashboard' },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-4 mb-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.route
            
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-500 bg-blue-500/10'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
