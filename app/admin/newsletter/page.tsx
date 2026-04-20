import React from "react"
import { prisma } from "@/lib/prisma"
import { 
  Mail, 
  UserCheck, 
  UserX, 
  Calendar, 
  Search, 
  Download, 
  Filter, 
  Trash2, 
  Send,
  UserPlus
} from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

async function getSubscribers() {
  return await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" }
  })
}

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>
          <p className="text-slate-500 text-sm">Verwalten Sie Ihre Abonnenten und Marketingkampagnen ({subscribers.length} Abonnenten)</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm">
            <Download size={18} />
            CSV exportieren
          </button>
          <button className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-sm text-sm">
            <Send size={18} />
            Neue Kampagne
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktive Abonnenten</p>
            <h3 className="text-2xl font-black text-slate-900">{subscribers.filter(s => s.isActive).length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Neu (30 Tage)</p>
            <h3 className="text-2xl font-black text-slate-900">
              {subscribers.filter(s => {
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                return s.createdAt > thirtyDaysAgo
              }).length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Abgemeldet</p>
            <h3 className="text-2xl font-black text-slate-900">{subscribers.filter(s => !s.isActive).length}</h3>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Abonnenten suchen..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Nach Quelle filtern
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
                <th className="px-6 py-4">Abonnent</th>
                <th className="px-6 py-4">Quelle</th>
                <th className="px-6 py-4">Registriert am</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <Mail size={16} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 truncate">{subscriber.email}</span>
                        <span className="text-xs text-slate-500 truncate">{subscriber.firstName || "Unbekannt"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {subscriber.source || "Direkt"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      {format(new Date(subscriber.createdAt), "dd MMM yyyy", { locale: de })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {subscriber.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                        <UserCheck size={12} />
                        Aktiv
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-widest">
                        <UserX size={12} />
                        Abgemeldet
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Löschen">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Derzeit sind keine Newsletter-Abonnenten vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
