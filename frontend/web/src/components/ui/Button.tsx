import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  disabled = false
}: ButtonProps) {
  const baseStyles = `
    rounded-lg font-medium
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-sky-500/50
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-400/30',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    ghost: 'text-sky-400 hover:text-sky-300 hover:underline bg-transparent',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/30'
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
