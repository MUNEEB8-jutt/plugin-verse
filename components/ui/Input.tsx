import { cn } from '@/lib/utils/helpers'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label 
          className="block text-sm font-bold mb-2"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', color: '#fafaf9' }}
        >
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3',
          'bg-[#292524] border-3 border-black',
          'shadow-[inset_3px_3px_0_rgba(0,0,0,0.5)]',
          'focus:outline-none focus:border-[#4ade80]',
          'focus:shadow-[inset_3px_3px_0_rgba(0,0,0,0.5),0_0_0_3px_rgba(74,222,128,0.3)]',
          'text-[#fafaf9] placeholder-[#a8a29e]',
          'transition-all duration-200',
          error ? 'border-red-500' : '',
          className
        )}
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.75rem' }}
        {...props}
      />
      {error && (
        <p 
          className="mt-2 text-sm text-red-400"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
