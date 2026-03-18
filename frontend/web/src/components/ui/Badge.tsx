import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 text-slate-300 border-white/10',
    success: 'bg-green-500/20 text-green-400 border-green-400/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-400/30',
    danger: 'bg-red-500/20 text-red-400 border-red-400/30',
    info: 'bg-sky-500/20 text-sky-400 border-sky-400/30'
  }

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
      border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}
