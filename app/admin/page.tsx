import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/require-admin'
import { getStats } from '@/lib/admin/stats'
import { DashboardContent } from './_components/dashboard-content'

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-48 animate-pulse rounded bg-nova-100" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-nova-50" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-3xl bg-nova-50" />
        ))}
      </div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const authz = await requireAdmin()
  if (!authz.ok) redirect('/anmelden')

  const stats = await getStats()

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent stats={stats} />
    </Suspense>
  )
}
