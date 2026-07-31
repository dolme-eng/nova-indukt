import React from 'react'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { Mail, UserPlus, UserX } from 'lucide-react'
import { CsvExportButton } from '../_components/csv-export-button'
import NewsletterTable from './_components/newsletter-table'

async function getSubscribers() {
  return await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>
          <p className="text-sm text-slate-500">
            Verwalten Sie Ihre Abonnenten und Marketingkampagnen ({subscribers.length} Abonnenten)
          </p>
        </div>
        <div className="flex gap-2">
          <CsvExportButton
            data={subscribers}
            columns={[
              { header: 'E-Mail', accessor: (r) => String(r.email) },
              { header: 'Vorname', accessor: (r) => String(r.firstName || '') },
              { header: 'Nachname', accessor: (r) => String(r.lastName || '') },
              { header: 'Quelle', accessor: (r) => String(r.source || 'Direkt') },
              { header: 'Aktiv', accessor: (r) => String(r.isActive ? 'Ja' : 'Nein') },
              { header: 'Registriert', accessor: (r) => String(r.createdAt) },
            ]}
            filename={`newsletter-abonnenten-${new Date().toISOString().slice(0, 10)}.csv`}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Aktive Abonnenten
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              {subscribers.filter((s) => s.isActive).length}
            </h3>
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
            <h3 className="text-2xl font-black text-slate-900">
              {
                subscribers.filter((s) => {
                  const thirtyDaysAgo = new Date()
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                  return s.createdAt > thirtyDaysAgo
                }).length
              }
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-slate-50 p-3 text-slate-600">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Abgemeldet</p>
            <h3 className="text-2xl font-black text-slate-900">
              {subscribers.filter((s) => !s.isActive).length}
            </h3>
          </div>
        </div>
      </div>

      {/* List */}
      <NewsletterTable
        initialSubscribers={
          subscribers as unknown as React.ComponentProps<
            typeof NewsletterTable
          >['initialSubscribers']
        }
      />
    </div>
  )
}
