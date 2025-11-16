import { cn } from '@/lib/utils/helpers'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-text-primary">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 bg-bg-secondary border rounded',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary',
          'text-text-primary placeholder-text-secondary',
          error ? 'border-red-500' : 'border-border',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
