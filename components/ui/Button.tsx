import { cn } from '@/lib/utils/helpers'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  className, 
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-xl
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    active:scale-[0.98]
  `

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[52px]',
  }

  const variants = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-emerald-600
      hover:from-emerald-400 hover:to-emerald-500
      text-white
      shadow-lg shadow-emerald-500/25
      hover:shadow-xl hover:shadow-emerald-500/30
      focus:ring-emerald-500
    `,
    secondary: `
      bg-gradient-to-r from-blue-500 to-blue-600
      hover:from-blue-400 hover:to-blue-500
      text-white
      shadow-lg shadow-blue-500/25
      hover:shadow-xl hover:shadow-blue-500/30
      focus:ring-blue-500
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-400 hover:to-red-500
      text-white
      shadow-lg shadow-red-500/25
      hover:shadow-xl hover:shadow-red-500/30
      focus:ring-red-500
    `,
    ghost: `
      bg-transparent
      hover:bg-slate-800
      text-slate-300
      hover:text-white
      border border-slate-700
      hover:border-slate-600
      focus:ring-slate-500
    `,
  }

  return (
    <button
      className={cn(baseStyles, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
