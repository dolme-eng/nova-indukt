import React from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  CreditCard,
  Truck,
  ArrowUpDown,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCcw,
  Box
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { OrderStatus, PaymentStatus } from "@prisma/client"

async function getOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true
    }
  })
}

const statusMap: Record<OrderStatus, { label: string, color: string, icon: React.ReactNode }> = {
  PENDING: { label: "En attente", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={12} /> },
  PROCESSING: { label: "Préparation", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <RefreshCcw size={12} /> },
  SHIPPED: { label: "Expédiée", color: "bg-purple-100 text-purple-700 border-purple-200", icon: <Truck size={12} /> },
  DELIVERED: { label: "Livrée", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={12} /> },
  CANCELLED: { label: "Annulée", color: "bg-slate-100 text-slate-700 border-slate-200", icon: <XCircle size={12} /> },
  REFUNDED: { label: "Remboursée", color: "bg-red-100 text-red-700 border-red-200", icon: <AlertCircle size={12} /> }
}

const paymentMap: Record<PaymentStatus, { label: string, color: string }> = {
  PENDING: { label: "Non payé", color: "bg-slate-100 text-slate-600" },
  AUTHORIZED: { label: "Autorisé", color: "bg-blue-50 text-blue-600" },
  PAID: { label: "Payé", color: "bg-emerald-50 text-emerald-600" },
  FAILED: { label: "Échec", color: "bg-red-50 text-red-600" },
  REFUNDED: { label: "Remboursé", color: "bg-red-50 text-red-600" },
  PARTIALLY_REFUNDED: { label: "Partiellement", color: "bg-orange-50 text-orange-600" }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
          <p className="text-slate-500 text-sm">Gérez et suivez les ventes ({orders.length} commandes)</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm">
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher (Client, n° de commande, email...)" 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Statut
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={18} />
            Date
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
                <th className="px-6 py-4">Commande</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Paiement</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded text-slate-500">
                        <Box size={16} />
                      </div>
                      <span className="font-bold text-slate-900">{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{order.customerName}</span>
                      <span className="text-xs text-slate-500">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", { locale: fr })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${paymentMap[order.paymentStatus].color}`}>
                        {paymentMap[order.paymentStatus].label}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CreditCard size={10} />
                        {order.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${statusMap[order.status].color}`}>
                      {statusMap[order.status].icon}
                      {statusMap[order.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{Number(order.total).toFixed(2)} €</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                        title="Détails"
                      >
                        <Eye size={18} />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Box size={48} className="text-slate-200" />
                      <p>Aucune commande enregistrée pour le moment.</p>
                    </div>
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
