import { cn } from '@/lib/utils/helpers'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  // Mobile: Clean modern style, Desktop: Minecraft blocky style
  const baseStyles = `
    px-4 py-2.5 md:px-6 md:py-3
    font-semibold lg:font-bold
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    relative
    min-h-[44px]
    flex items-center justify-center
    rounded-xl lg:rounded-none
    border lg:border-4 border-blue-500/40 lg:border-black
    shadow-md shadow-blue-500/20 lg:shadow-[3px_3px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.3)]
  `
  
  const variants = {
    primary: `
      bg-gradient-to-br from-green-500 to-green-600 lg:bg-gradient-to-b lg:from-[#4ade80] lg:to-[#22c55e]
      text-white lg:text-black
      hover:from-green-400 hover:to-green-500 hover:shadow-lg hover:shadow-green-500/30
      lg:hover:shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.4)]
      lg:hover:-translate-x-[1px] lg:hover:-translate-y-[1px]
      active:scale-95 lg:active:scale-100
      lg:active:shadow-[1px_1px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.2)]
      lg:active:translate-x-[1px] lg:active:translate-y-[1px]
    `,
    secondary: `
      bg-gradient-to-br from-blue-500 to-blue-600 lg:bg-gradient-to-b lg:from-[#60a5fa] lg:to-[#3b82f6]
      text-white
      hover:from-blue-400 hover:to-blue-500 hover:shadow-lg hover:shadow-blue-500/30
      lg:hover:shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.4)]
      lg:hover:-translate-x-[1px] lg:hover:-translate-y-[1px]
      active:scale-95 lg:active:scale-100
      lg:active:shadow-[1px_1px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.2)]
      lg:active:translate-x-[1px] lg:active:translate-y-[1px]
    `,
    danger: `
      bg-gradient-to-br from-red-500 to-red-600 lg:bg-gradient-to-b lg:from-[#ef4444] lg:to-[#dc2626]
      text-white
      hover:from-red-400 hover:to-red-500 hover:shadow-lg hover:shadow-red-500/30
      lg:hover:shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.4)]
      lg:hover:-translate-x-[1px] lg:hover:-translate-y-[1px]
      active:scale-95 lg:active:scale-100
      lg:active:shadow-[1px_1px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.2)]
      lg:active:translate-x-[1px] lg:active:translate-y-[1px]
    `,
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      style={{ 
        fontFamily: "window.innerWidth > 1024 ? \"'Press Start 2P', monospace\" : \"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\"",
        fontSize: '0.75rem'
      }}
      {...props}
    >
      {children}
    </button>
  )
}
