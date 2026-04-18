import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f6f7f6] pb-24 lg:pb-14">
      <div className="bg-white/90 border-b border-gray-200/80 h-16" />
      
      <div className="container mx-auto px-4 py-8 max-w-[1920px]">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-8">
          {/* Gallery Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row-reverse sm:gap-6">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex sm:flex-col gap-2.5 w-20">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
              <Skeleton className="h-10 w-1/3" />
              <div className="flex gap-4">
                <Skeleton className="h-14 w-32 rounded-2xl" />
                <Skeleton className="h-14 flex-1 rounded-2xl" />
                <Skeleton className="h-14 w-14 rounded-2xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-11 rounded-xl" />
                <Skeleton className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
