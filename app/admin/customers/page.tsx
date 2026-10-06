import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { AdminPagination } from '../_components/admin-pagination'
import { CsvExportButton } from '../_components/csv-export-button'
import CustomersTable from './_components/customers-table'
import { DEFAULT_PAGE_SIZE, parsePageParam } from '@/lib/utils/pagination'

export const dynamic = 'force-dynamic'

const SORTABLE_ROLES = ['USER', 'ADMIN'] as const

type SearchParams = Promise<{
  q?: string
  role?: string
  sort?: string
  page?: string
}>

async function getCustomers(params: {
  q?: string
  role?: string
  sort?: string
  page: number
}) {
  const where: Prisma.UserWhereInput = {}

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: 'insensitive' } },
      { email: { contains: params.q, mode: 'insensitive' } },
    ]
  }

  if (params.role && (SORTABLE_ROLES as readonly string[]).includes(params.role)) {
    where.role = params.role as (typeof SORTABLE_ROLES)[number]
  }

  // Spend ordering needs a SQL aggregate; Prisma cannot orderBy a relation sum,
  // so those two cases are sorted in memory on the fetched page and documented
  // as page-local. Registration order (the default) is fully server-side.
  let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: 'desc' }
  let pageLocalSort: 'spent-desc' | 'spent-asc' | 'orders-desc' | 'orders-asc' | null = null

  switch (params.sort) {
    case 'name-asc':
      orderBy = { name: 'asc' }
      break
    case 'name-desc':
      orderBy = { name: 'desc' }
      break
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'spent-desc':
    case 'spent-asc':
    case 'orders-desc':
    case 'orders-asc':
      pageLocalSort = params.sort
      break
  }

  const skip = (params.page - 1) * DEFAULT_PAGE_SIZE

  const [customers, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: DEFAULT_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { orders: true } },
        // Only the totals the table shows — the previous query shipped every
        // order row of every user into the RSC payload.
        orders: {
          select: { total: true },
          // Refunds/cancellations must not count as spend.
          where: { status: { not: 'CANCELLED' } },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE))
  const page = Math.min(params.page, totalPages)

  if (pageLocalSort) {
    customers.sort((a, b) => {
      const aSpent = a.orders.reduce((s, o) => s + Number(o.total), 0)
      const bSpent = b.orders.reduce((s, o) => s + Number(o.total), 0)
      switch (pageLocalSort) {
        case 'spent-desc':
          return bSpent - aSpent
        case 'spent-asc':
          return aSpent - bSpent
        case 'orders-desc':
          return b._count.orders - a._count.orders
        case 'orders-asc':
          return a._count.orders - b._count.orders
      }
    })
  }

  return { customers, totalCount, totalPages, page }
}

export default async function AdminCustomersPage({ searchParams }: { searchParams: SearchParams }) {
  const resolved = await searchParams
  const result = await getCustomers({
    q: resolved.q,
    role: resolved.role,
    sort: resolved.sort,
    page: parsePageParam(resolved.page),
  })
  const { customers, totalCount, totalPages, page } = result

  const currentParams = {
    q: resolved.q,
    role: resolved.role,
    sort: resolved.sort,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kunden</h1>
          <p className="text-sm text-slate-500">
            Verwalten Sie Ihren Kundenstamm und analysieren Sie deren Aktivitäten (
            {totalCount} Benutzer)
          </p>
        </div>
        <div className="flex gap-2">
          <CsvExportButton
            data={customers.map((c) => ({
              name: c.name ?? '',
              email: c.email,
              role: c.role,
              createdAt: new Date(c.createdAt).toISOString(),
              orderCount: c._count.orders,
              totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
            }))}
            columns={[
              { header: 'Name', accessor: (r) => String(r.name) },
              { header: 'E-Mail', accessor: (r) => String(r.email) },
              { header: 'Rolle', accessor: (r) => String(r.role) },
              { header: 'Registriert', accessor: (r) => String(r.createdAt) },
              { header: 'Bestellungen', accessor: (r) => Number(r.orderCount) },
              { header: 'Ausgaben (EUR)', accessor: (r) => Number(r.totalSpent).toFixed(2) },
            ]}
            filename={`kunden-export-${new Date().toISOString().slice(0, 10)}.csv`}
          />
        </div>
      </div>

      <CustomersTable
        customers={customers}
        currentParams={currentParams}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
      />

      <AdminPagination
        basePath="/admin/customers"
        currentParams={currentParams}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        itemLabel="Benutzer"
      />
    </div>
  )
}
