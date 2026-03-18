'use client'

import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { Bell, Menu } from 'lucide-react'
import { pageTitles } from '@/lib/designTokens'
import { Button } from '@/components/ui/Button'
import { useDashboardStore } from '@/store/zustandStore'

interface HeaderProps {
  onMenuClick: () => void
}

function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const title = pageTitles[pathname as keyof typeof pageTitles] || 'Overview'
  const { user } = useDashboardStore()

  // Get user info from store with proper fallbacks
  const userEmail = user?.email || 'user@glohib.ai'
  const userName = user?.name || user?.email?.split('@')[0] || 'Student User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#020617]/95 backdrop-blur-xl sticky top-0 z-30">
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative min-w-[44px] min-h-[44px]"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
        </Button>

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
