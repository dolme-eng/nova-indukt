import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

export function Card({ 
  children, 
  className, 
  padding = 'md',
  shadow = 'sm',
  hover = false,
  onClick 
}: CardProps) {
  const baseStyles = 'bg-white rounded-2xl border border-gray-100 overflow-hidden'
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }
  
  const hoverStyles = hover 
    ? 'hover:shadow-lg hover:border-[#4ECCA3]/20 transition-all duration-300 cursor-pointer' 
    : ''

  return (
    <div
      onClick={onClick}
      className={cn(
        baseStyles,
        paddings[padding],
        shadows[shadow],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  )
}

// Card Header
interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Card Footer
interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  )
}
