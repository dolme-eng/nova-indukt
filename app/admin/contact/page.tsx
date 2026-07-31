import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { MessageSquare } from 'lucide-react'
import ContactTable from './_components/contact-table'

async function getMessages() {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminContactPage() {
  const messages = await getMessages()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kontaktnachrichten</h1>
          <p className="text-sm text-slate-500">
            Verwalten Sie eingehende Nachrichten über das Kontaktformular ({messages.length}{' '}
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
            <h3 className="text-2xl font-black text-slate-900">{messages.length}</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Neu</p>
            <h3 className="text-2xl font-black text-slate-900">
              {messages.filter((m) => m.status === 'NEW').length}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Erledigt</p>
            <h3 className="text-2xl font-black text-slate-900">
              {messages.filter((m) => m.status === 'RESOLVED').length}
            </h3>
          </div>
        </div>
      </div>

      <ContactTable
        initialMessages={
          messages as unknown as React.ComponentProps<typeof ContactTable>['initialMessages']
        }
      />
    </div>
  )
}
