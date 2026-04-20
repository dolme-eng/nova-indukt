import React from "react"
import Link from "next/link"
import { 
  Search, 
  User, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  ChevronRight, 
  MoreVertical,
  ShieldCheck,
  UserCheck,
  Filter,
  ArrowUpDown,
  Download,
  MailCheck,
  MailX
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { de } from "date-fns/locale"

async function getCustomers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          createdAt: true
        }
      },
      _count: {
        select: { orders: true }
      }
    }
  })
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kunden</h1>
          <p className="text-slate-500 text-sm">Verwalten Sie Ihren Kundenstamm und analysieren Sie deren Aktivitäten ({customers.length} Benutzer)</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm">
            <Download size={18} />
            CSV Exportieren
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Suchen nach Name, E-Mail..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Rolle
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <ArrowUpDown size={18} />
            Ausgaben
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
                <th className="px-6 py-4">Kunde</th>
                <th className="px-6 py-4">E-Mail Status</th>
                <th className="px-6 py-4">Rolle</th>
                <th className="px-6 py-4">Registriert am</th>
                <th className="px-6 py-4 text-center">Bestellungen</th>
                <th className="px-6 py-4">Gesamtausgaben</th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0)
                
                return (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100">
                          {customer.image ? (
                            <img src={customer.image} alt={customer.name || ""} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            (customer.name?.charAt(0) || customer.email.charAt(0)).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate">{customer.name || "Namenloser Benutzer"}</span>
                          <span className="text-xs text-slate-500 truncate flex items-center gap-1">
                            <Mail size={12} />
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">
                          <MailCheck size={12} />
                          Verifiziert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-tighter">
                          <MailX size={12} />
                          Nicht verifiziert
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {customer.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 uppercase tracking-tighter">
                          <ShieldCheck size={12} />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-tighter">
                          <UserCheck size={12} />
                          Kunde
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {format(new Date(customer.createdAt), "dd MMM yyyy", { locale: de })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-slate-900">{customer._count.orders}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Käufe</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-emerald-600">{totalSpent.toFixed(2)} €</span>
                        {customer._count.orders > 0 && (
                          <span className="text-[10px] text-slate-400 font-bold">Durchschn. {(totalSpent / customer._count.orders).toFixed(2)} €</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/customers/${customer.id}`}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                          title="Kundenakte"
                        >
                          <ChevronRight size={18} />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Derzeit sind keine Kunden registriert.
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
