export function PluginCardSkeleton() {
  return (
    <div className="relative overflow-hidden p-6 bg-[#57534e] border-4 border-black shadow-[8px_8px_0_#000] animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 mb-4 bg-[#292524] border-2 border-black" />
      
      {/* Title skeleton */}
      <div className="h-6 bg-[#292524] mb-2 w-3/4" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-[#292524] w-full" />
        <div className="h-4 bg-[#292524] w-5/6" />
      </div>
      
      {/* Price and button skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-8 bg-[#292524] w-24" />
        <div className="h-10 bg-[#292524] w-28" />
      </div>
    </div>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PluginCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
