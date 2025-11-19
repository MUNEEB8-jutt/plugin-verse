import { cn } from '@/lib/utils/helpers'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  // Minecraft-style blocky button with thick borders and shadows
  const baseStyles = `
    px-6 py-3 
    font-bold 
    border-4 border-black
    transition-all duration-100
    disabled:opacity-50 disabled:cursor-not-allowed
    relative
    text-shadow-[2px_2px_0_rgba(0,0,0,0.5)]
  `
  
  const variants = {
    primary: `
      bg-gradient-to-b from-[#4ade80] to-[#22c55e]
      text-black
      shadow-[3px_3px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.3)]
      hover:shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.4)]
      hover:-translate-x-[1px] hover:-translate-y-[1px]
      active:shadow-[1px_1px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.2)]
      active:translate-x-[1px] active:translate-y-[1px]
    `,
    secondary: `
      bg-gradient-to-b from-[#60a5fa] to-[#3b82f6]
      text-white
      shadow-[3px_3px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.3)]
      hover:shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.4)]
      hover:-translate-x-[1px] hover:-translate-y-[1px]
      active:shadow-[1px_1px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.2)]
      active:translate-x-[1px] active:translate-y-[1px]
    `,
    danger: `
      bg-gradient-to-b from-[#ef4444] to-[#dc2626]
      text-white
      shadow-[3px_3px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.3)]
      hover:shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(255,255,255,0.4)]
      hover:-translate-x-[1px] hover:-translate-y-[1px]
      active:shadow-[1px_1px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.2)]
      active:translate-x-[1px] active:translate-y-[1px]
    `,
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.75rem' }}
      {...props}
    >
      {children}
    </button>
  )
}
