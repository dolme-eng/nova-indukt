import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 pb-20">
      <div className="mx-auto w-full max-w-md px-4 text-center">
        <Skeleton className="mx-auto mb-6 h-20 w-20 rounded-full" />
        <Skeleton className="mx-auto mb-4 h-8 w-64" />
        <Skeleton className="mx-auto h-6 w-48" />
      </div>
    </div>
  )
}
