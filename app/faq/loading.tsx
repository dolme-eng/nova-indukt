import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="container mx-auto px-4 mt-8 max-w-3xl">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
