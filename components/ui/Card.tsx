import { cn } from '@/lib/utils/helpers'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'glass rounded-lg p-6',
        hover && 'hover:scale-105 hover:shadow-2xl cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
