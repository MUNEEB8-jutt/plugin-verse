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
        'relative overflow-hidden p-3 md:p-4 lg:p-6',
        // Mobile: Clean modern theme
        'bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-2xl shadow-lg shadow-black/40',
        // Desktop: Minecraft theme
        'lg:bg-[#57534e] lg:border-4 lg:border-black lg:rounded-none',
        'lg:shadow-[8px_8px_0_#000,inset_0_0_20px_rgba(0,0,0,0.3)]',
        hover && 'hover:-translate-y-2 lg:hover:shadow-[8px_16px_0_#000,inset_0_0_20px_rgba(74,222,128,0.2)] cursor-pointer transition-all duration-200',
        className
      )}
    >
      {/* Texture overlay - only on desktop */}
      <div
        className="hidden lg:block absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/textures/stone.png)',
          backgroundSize: '64px 64px',
          imageRendering: 'pixelated'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
