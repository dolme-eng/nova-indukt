import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
export const dynamic = 'force-dynamic'
import { MessageSquare } from 'lucide-react'
import ContactTable from './_components/contact-table'
import { AdminPagination } from '../_components/admin-pagination'
import { DEFAULT_PAGE_SIZE, parsePageParam } from '@/lib/utils/pagination'

const PAGE_SIZE = DEFAULT_PAGE_SIZE
const STATUSES = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM'] as const

type SearchParams = Promise<{ q?: string; status?: string; page?: string }>

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolved = await searchParams
  const page = parsePageParam(resolved.page)
  const q = resolved.q?.trim()

  const where: Prisma.ContactMessageWhereInput = {}
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { subject: { contains: q, mode: 'insensitive' } },
      { message: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (resolved.status && (STATUSES as readonly string[]).includes(resolved.status)) {
    where.status = resolved.status as (typeof STATUSES)[number]
  }

  // Per-status counters over the whole table (not the page) via groupBy.
  const [messages, totalCount, byStatus] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ])

  const statusCounts: Record<string, number> = { all: totalCount }
  for (const row of byStatus) {
    statusCounts[row.status] = row._count._all
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const currentParams = { q: resolved.q, status: resolved.status }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kontaktnachrichten</h1>
          <p className="text-sm text-slate-500">
            Verwalten Sie eingehende Nachrichten über das Kontaktformular ({totalCount}{' '}
            Nachrichten)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Alle Nachrichten
            </p>
            <h3 className="text-2xl font-black text-slate-900">{statusCounts.all ?? 0}</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Neu</p>
            <h3 className="text-2xl font-black text-slate-900">{statusCounts.NEW ?? 0}</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Erledigt</p>
            <h3 className="text-2xl font-black text-slate-900">{statusCounts.RESOLVED ?? 0}</h3>
          </div>
        </div>
      </div>

      <ContactTable
        messages={messages}
        currentParams={currentParams}
        statusCounts={statusCounts}
      />

      <AdminPagination
        basePath="/admin/contact"
        currentParams={currentParams}
        page={safePage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemLabel="Nachrichten"
      />
    </div>
  )
}
