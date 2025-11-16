import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">404</div>
        <h2 className="text-2xl font-bold text-accent-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
