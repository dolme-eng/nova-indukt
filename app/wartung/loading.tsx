import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <div className="mx-auto w-full max-w-md px-4 text-center">
        <Skeleton className="mx-auto mb-4 h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
      </div>
    </div>
  )
}
