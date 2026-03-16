import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  circle?: boolean
}

export function Skeleton({ 
  className, 
  width, 
  height,
  circle = false 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded-lg',
        circle && 'rounded-full',
        className
      )}
      style={{ width, height }}
    />
  )
}

// Product Card Skeleton
export function ProductCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  const isGrid = viewMode === 'grid'
  
  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-gray-100 ${
      isGrid ? '' : 'flex flex-col sm:flex-row'
    }`}>
      {/* Image Skeleton */}
      <div className={`relative bg-gray-100 ${
        isGrid ? 'aspect-square' : 'aspect-square sm:aspect-[4/3] sm:w-48 sm:flex-shrink-0'
      }`}>
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>
      
      {/* Content Skeleton */}
      <div className={`p-4 ${isGrid ? '' : 'flex-1'}`}>
        <Skeleton width="60%" height={16} className="mb-2" />
        <Skeleton width="80%" height={20} className="mb-3" />
        {!isGrid && (
          <>
            <Skeleton width="100%" height={14} className="mb-1" />
            <Skeleton width="90%" height={14} className="mb-3" />
          </>
        )}
        <div className="flex items-center justify-between mt-auto">
          <Skeleton width={80} height={24} />
          <Skeleton width={120} height={36} className="rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Product Grid Skeleton
export function ProductGridSkeleton({ 
  count = 8, 
  viewMode = 'grid' 
}: { 
  count?: number
  viewMode?: 'grid' | 'list'
}) {
  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      : "space-y-4"
    }>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  )
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Skeleton */}
          <Skeleton className="aspect-square rounded-2xl" />
          
          {/* Info Skeleton */}
          <div className="space-y-4">
            <Skeleton width="40%" height={16} />
            <Skeleton width="80%" height={32} />
            <Skeleton width="60%" height={20} />
            <div className="flex gap-2 py-4">
              <Skeleton width={100} height={40} className="rounded-xl" />
              <Skeleton width={100} height={40} className="rounded-xl" />
            </div>
            <Skeleton width="30%" height={36} className="rounded-xl" />
            <Skeleton width="100%" height={60} className="rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
