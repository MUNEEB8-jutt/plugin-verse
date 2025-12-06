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
        'relative overflow-hidden p-4 md:p-5 lg:p-6',
        'bg-gradient-to-br from-slate-800/90 to-slate-900/90',
        'backdrop-blur-sm',
        'border border-slate-700/50',
        'rounded-2xl',
        'shadow-lg shadow-black/20',
        hover && 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 cursor-pointer transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  )
}
