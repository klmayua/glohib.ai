import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl
        bg-white/[0.04]
        backdrop-blur-xl
        border border-white/[0.08]
        p-5
        transition-colors duration-200
        ${hover ? 'cursor-pointer hover:-translate-y-1 hover:bg-white/[0.06] hover:border-sky-400/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] active:scale-[0.97]' : ''}
        focus:outline-none focus:ring-0 focus-visible:outline-none
        ${className}
      `}
    >
      {children}
    </div>
  )
}
