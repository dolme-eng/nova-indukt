import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 pb-20">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-12">
          <div className="space-y-6">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
