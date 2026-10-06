import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
export const dynamic = 'force-dynamic'
import { Mail, UserPlus, UserX } from 'lucide-react'
import { CsvExportButton } from '../_components/csv-export-button'
import { AdminPagination } from '../_components/admin-pagination'
import NewsletterTable from './_components/newsletter-table'
import { DEFAULT_PAGE_SIZE, parsePageParam } from '@/lib/utils/pagination'

const PAGE_SIZE = DEFAULT_PAGE_SIZE
const MAX_CSV_ROWS = 10_000

type SearchParams = Promise<{
  q?: string
  status?: string
  page?: string
}>

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolved = await searchParams
  const page = parsePageParam(resolved.page)
  const q = resolved.q?.trim()

  const where: Prisma.NewsletterSubscriberWhereInput = {}
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { firstName: { contains: q, mode: 'insensitive' } },
      { source: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (resolved.status === 'active') where.isActive = true
  if (resolved.status === 'inactive') where.isActive = false

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Counters computed in SQL: the previous version fetched every subscriber and
  // filtered the array in JS three times.
  const [subscribers, totalCount, activeCount, inactiveCount, newCount, csvRows] =
    await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.newsletterSubscriber.count({ where }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.newsletterSubscriber.count({ where: { isActive: false } }),
      prisma.newsletterSubscriber.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: MAX_CSV_ROWS,
        select: {
          email: true,
          firstName: true,
          source: true,
          isActive: true,
          createdAt: true,
        },
      }),
    ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const currentParams = { q: resolved.q, status: resolved.status }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>
          <p className="text-sm text-slate-500">
            Verwalten Sie Ihre Abonnenten und Marketingkampagnen ({totalCount} Abonnenten)
          </p>
        </div>
        <div className="flex gap-2">
          <CsvExportButton
            data={csvRows.map((s) => ({
              email: s.email,
              firstName: s.firstName ?? '',
              source: s.source ?? 'Direkt',
              isActive: s.isActive ? 'Ja' : 'Nein',
              createdAt: new Date(s.createdAt).toISOString(),
            }))}
            columns={[
              { header: 'E-Mail', accessor: (r) => String(r.email) },
              { header: 'Vorname', accessor: (r) => String(r.firstName) },
              { header: 'Quelle', accessor: (r) => String(r.source) },
              { header: 'Aktiv', accessor: (r) => String(r.isActive) },
              { header: 'Registriert', accessor: (r) => String(r.createdAt) },
            ]}
            filename={`newsletter-abonnenten-${new Date().toISOString().slice(0, 10)}.csv`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Aktive Abonnenten
            </p>
            <h3 className="text-2xl font-black text-slate-900">{activeCount}</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Neu (30 Tage)
            </p>
            <h3 className="text-2xl font-black text-slate-900">{newCount}</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-slate-50 p-3 text-slate-600">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Abgemeldet</p>
            <h3 className="text-2xl font-black text-slate-900">{inactiveCount}</h3>
          </div>
        </div>
      </div>

      <NewsletterTable
        subscribers={subscribers}
        currentParams={currentParams}
        hasFilters={Boolean(q) || Boolean(resolved.status)}
      />

      <AdminPagination
        basePath="/admin/newsletter"
        currentParams={currentParams}
        page={safePage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemLabel="Abonnenten"
      />
    </div>
  )
}
