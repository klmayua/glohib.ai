import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl
        border border-white/10
        bg-white/5 backdrop-blur-sm
        p-5
        transition-colors duration-150
        ${hover ? 'cursor-pointer hover:bg-white/10 hover:border-sky-400/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
