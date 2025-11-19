export default function AccountLoading() {
  return (
    <div className="min-h-screen">
      <div className="loading-bar" />
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-[#4b5563] w-48 mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="h-32 bg-[#4b5563]" />
            <div className="h-32 bg-[#4b5563]" />
            <div className="h-32 bg-[#4b5563]" />
          </div>
        </div>
      </div>
    </div>
  )
}
