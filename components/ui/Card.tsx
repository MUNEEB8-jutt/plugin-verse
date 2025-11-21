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
        'relative overflow-hidden p-2 md:p-4 lg:p-6',
        'bg-[#57534e] border-4 border-black',
        'shadow-[3px_3px_0_#000,inset_0_0_20px_rgba(0,0,0,0.3)] md:shadow-[4px_4px_0_#000,inset_0_0_20px_rgba(0,0,0,0.3)] lg:shadow-[8px_8px_0_#000,inset_0_0_20px_rgba(0,0,0,0.3)]',
        hover && 'hover:-translate-y-2 hover:shadow-[8px_16px_0_#000,inset_0_0_20px_rgba(74,222,128,0.2)] cursor-pointer transition-all duration-200',
        className
      )}
    >
      {/* Texture overlay - will show when texture image is added */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
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
