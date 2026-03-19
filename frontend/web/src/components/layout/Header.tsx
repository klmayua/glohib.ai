'use client'

import { usePathname } from 'next/navigation'
import { memo, useState, useRef, useEffect } from 'react'
import { Bell, Menu, X } from 'lucide-react'
import { pageTitles } from '@/lib/designTokens'
import { Button } from '@/components/ui/Button'
import { useDashboardStore } from '@/store/zustandStore'

interface HeaderProps {
  onMenuClick: () => void
}

function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  // Match exact path first, then try parent paths for nested routes like /internships/[id]
  const title = pageTitles[pathname] ||
    Object.entries(pageTitles)
      .filter(([key]) => key !== '/dashboard' && pathname.startsWith(key))
      .sort(([a], [b]) => b.length - a.length)[0]?.[1] ||
    'Overview'
  const { user, notifications } = useDashboardStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  // Get user info from store with proper fallbacks
  const userEmail = user?.email || 'user@glohib.ai'
  const userName = user?.name || user?.email?.split('@')[0] || 'Student User'
  const userInitial = userName.charAt(0).toUpperCase()

  const unreadCount = notifications.filter((n: any) => !n.read).length

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showNotifications])

  // Mock notifications for display
  const displayNotifications = notifications.length > 0 ? notifications : [
    { id: '1', title: 'New recommendation', message: 'A new internship matches your profile', time: '2h ago', read: false },
    { id: '2', title: 'Application update', message: 'TechCorp viewed your application', time: '1d ago', read: false },
    { id: '3', title: 'Interview reminder', message: 'Upcoming interview tomorrow at 2PM', time: '1d ago', read: true },
  ]

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#020617] sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden min-w-[44px] min-h-[44px]"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <h1 className="text-base sm:text-xl font-medium text-white truncate max-w-[150px] sm:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="sm"
            className="relative min-w-[44px] min-h-[44px]"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
            )}
            {/* Always show dot for mock data */}
            {unreadCount === 0 && notifications.length === 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
            )}
          </Button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-[#0f172a] border border-white/[0.08] shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
                <h3 className="text-sm font-medium text-white">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {displayNotifications.map((notif: any) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-white/[0.05] hover:bg-white/5 transition-colors cursor-pointer ${
                      !notif.read ? 'bg-sky-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                      )}
                      <div className={!notif.read ? '' : 'ml-5'}>
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/[0.08] text-center">
                <button className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-white/[0.08]">
          <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-lg bg-white/[0.08] flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
            {userInitial}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white truncate max-w-[100px] lg:max-w-none">{userName}</p>
            <p className="text-xs text-slate-400 truncate max-w-[100px] lg:max-w-none">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
