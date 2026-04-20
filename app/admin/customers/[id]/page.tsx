import React from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Box,
  CheckCircle2,
  Settings
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { notFound } from "next/navigation"

async function getCustomer(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true }
      },
      addresses: true,
      _count: {
        select: { orders: true, reviews: true, wishlist: true }
      }
    }
  })
  return customer
}

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const customer = await getCustomer(params.id)

  if (!customer) notFound()

  const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0)
  const averageOrderValue = customer._count.orders > 0 ? totalSpent / customer._count.orders : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/customers"
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-200">
              {customer.image ? (
                <img src={customer.image} alt={customer.name || ""} className="w-full h-full rounded-full object-cover" />
              ) : (
                (customer.name?.charAt(0) || customer.email.charAt(0)).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{customer.name || "Utilisateur"}</h1>
                {customer.role === "ADMIN" ? (
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full border border-purple-200 uppercase tracking-widest">Admin</span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200 uppercase tracking-widest">Client</span>
                )}
              </div>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-1 font-medium">
                Membre depuis le {format(new Date(customer.createdAt), "dd MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Mail size={18} />
            Contacter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            <Settings size={18} />
            Gérer le compte
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatItem 
          label="Total Dépensé" 
          value={`${totalSpent.toFixed(2)} €`} 
          icon={<CreditCard className="text-emerald-600" size={20} />} 
          color="bg-emerald-50 border-emerald-100"
        />
        <StatItem 
          label="Commandes" 
          value={customer._count.orders.toString()} 
          icon={<ShoppingBag className="text-blue-600" size={20} />} 
          color="bg-blue-50 border-blue-100"
        />
        <StatItem 
          label="Panier Moyen" 
          value={`${averageOrderValue.toFixed(2)} €`} 
          icon={<TrendingUp className="text-orange-600" size={20} />} 
          color="bg-orange-50 border-orange-100"
        />
        <StatItem 
          label="Avis publiés" 
          value={customer._count.reviews.toString()} 
          icon={<CheckCircle2 className="text-purple-600" size={20} />} 
          color="bg-purple-50 border-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column - Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Clock size={16} />
                Historique des Commandes
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {customer.orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-primary transition-colors">
                        <Box size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{order.orderNumber}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                          <Calendar size={12} />
                          {format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{Number(order.total).toFixed(2)} €</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{order.items.length} article(s)</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${
                        order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {order.status}
                      </span>
                      <Link href={`/admin/orders/${order.id}`} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all">
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {customer.orders.length === 0 && (
                <div className="p-12 text-center text-slate-500 italic">
                  Aucune commande pour ce client.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Contact & Addresses */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail size={16} />
              Contact
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Mail size={18} className="text-slate-400" />
                <span className="font-medium truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Phone size={18} className="text-slate-400" />
                <span className="font-medium">Non renseigné</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MapPin size={16} />
              Adresses ({customer.addresses.length})
            </h2>
            <div className="space-y-6">
              {customer.addresses.map((address) => (
                <div key={address.id} className="space-y-2 relative pb-4 last:pb-0 last:border-0 border-b border-slate-100">
                  {address.isDefault && (
                    <span className="absolute top-0 right-0 text-[8px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-widest border border-primary/20">
                      Par défaut
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{address.type}</span>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    {address.firstName} {address.lastName}<br />
                    {address.street}<br />
                    {address.zipCode} {address.city}<br />
                    {address.country}
                  </p>
                </div>
              ))}
              {customer.addresses.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-4">Aucune adresse enregistrée.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className={`p-6 rounded-xl border ${color} shadow-sm group hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <h3 className="text-xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  )
}
