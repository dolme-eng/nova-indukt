import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Hero Skeleton */}
      <div className="relative h-[70vh] min-h-[550px] bg-gray-200 animate-pulse" />
      
      {/* Trust Bar Skeleton */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section Skeleton */}
      <div className="container mx-auto px-4 mt-16">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
