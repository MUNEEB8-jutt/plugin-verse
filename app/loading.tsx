import { PageLoadingSkeleton } from '@/components/LoadingSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Loading bar at top */}
      <div className="loading-bar" />
      
      <PageLoadingSkeleton />
    </div>
  )
}
