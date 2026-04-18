import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4">
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Skeleton */}
            <aside className="hidden lg:block w-80 space-y-6">
              <div className="bg-white rounded-xl p-6 space-y-8 border border-gray-100">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </aside>

            {/* Grid Skeleton */}
            <main className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 space-y-4">
                    <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-full" />
                    <div className="pt-4 border-t border-gray-50 space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
