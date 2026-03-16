import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        primary: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        destructive: 'bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        success: 'bg-gradient-to-br from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        outline: 'border-2 border-slate-700 bg-transparent text-white hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 shadow-sm hover:shadow',
        secondary: 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm hover:shadow',
        ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
        link: 'text-blue-400 underline-offset-4 hover:underline hover:text-blue-300',
        soft: 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50',
      },
      size: {
        sm: 'h-9 rounded-md px-3 text-xs gap-1.5',
        default: 'h-10 rounded-md px-4 py-2 text-sm gap-2',
        md: 'h-11 rounded-md px-5 text-base gap-2',
        lg: 'h-12 rounded-lg px-6 text-base gap-2',
        xl: 'h-14 rounded-xl px-8 text-lg gap-2.5 font-bold',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, loadingText, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {loadingText || children}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
