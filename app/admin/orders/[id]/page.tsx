import Link from "next/link"
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Banknote,
  User,
  MapPin,
  Mail,
  Phone,
  Printer,
  ShieldCheck,
  Plus
} from "lucide-react"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ShippingActions } from "./ShippingActions"

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                take: 1
              }
            }
          }
        }
      },
      user: true
    }
  })
  return order
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
  REFUNDED: "bg-red-100 text-red-700 border-red-200"
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) notFound()

  const shippingAddress = (order.shippingAddress as Record<string, string>) || {}
  const billingAddress = (order.billingAddress as Record<string, string>) || shippingAddress

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/orders"
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Bestellung {order.orderNumber}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
              Aufgegeben am {format(new Date(order.createdAt), "dd. MMMM yyyy 'um' HH:mm", { locale: de })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Printer size={18} />
            Rechnung drucken
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            Status aktualisieren
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <ShippingActions orderId={order.id} currentStatus={order.status as any} trackingNumber={order.trackingNumber} />

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Package size={16} />
                Artikel ({order.items.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">Versand aus Zentrallager</span>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex gap-6 hover:bg-slate-50/50 transition-colors">
                  <div className="h-20 w-20 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200">
                    {item.product.images[0] ? (
                      <Image src={item.product.images[0].url} alt={item.productName} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full"><Package className="text-slate-300" size={24} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 truncate hover:text-primary transition-colors cursor-pointer">{item.productName}</h3>
                      </div>
                      <p className="font-bold text-slate-900">{(Number(item.unitPrice) * item.quantity).toFixed(2)} €</p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-slate-600 flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        Menge: <span className="font-bold">{item.quantity}</span>
                      </span>
                      <span className="text-slate-400">×</span>
                      <span className="text-slate-600 font-medium">{Number(item.unitPrice).toFixed(2)} € / Einheit</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="space-y-3 max-w-sm ml-auto">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Zwischensumme</span>
                  <span>{Number(order.subtotal).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Versandkosten</span>
                  <span>{Number(order.shippingCost).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>MwSt. (Inklusive)</span>
                  <span>{Number(order.vatAmount).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Gesamt</span>
                  <span>{Number(order.total).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Truck size={16} />
              Versandinformationen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transportdienst</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">DHL Express Standard</p>
                    <p className="text-xs text-slate-500">Lieferung in 3-5 Werktagen</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sendungsverfolgung</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                {order.trackingNumber ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.trackingNumber}</p>
                      <button className="text-xs text-primary font-bold hover:underline">Auf DHL verfolgen</button>
                    </div>
                  </div>
                ) : (
                  <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Plus size={14} />
                    Sendungsnummer hinzufügen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Customer & Payment Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={16} />
              Kunde
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-200">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                  <Link href={`/admin/customers/${order.userId}`} className="text-xs text-primary font-bold hover:underline uppercase tracking-tighter">Kundenprofil ansehen</Link>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{order.customerPhone || "Nicht angegeben"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MapPin size={16} />
              Adressen
            </h2>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Lieferadresse</span>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {shippingAddress.firstName} {shippingAddress.lastName}<br />
                  {shippingAddress.street}<br />
                  {shippingAddress.zip} {shippingAddress.city}<br />
                  {shippingAddress.country}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Rechnungsadresse</span>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {billingAddress.firstName} {billingAddress.lastName}<br />
                  {billingAddress.street}<br />
                  {billingAddress.zip} {billingAddress.city}<br />
                  {billingAddress.country}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Banknote size={16} />
              Zahlung
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Methode</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Banknote size={14} className="text-slate-400" />
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentIntentId && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Transaktions-ID</span>
                  <code className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded truncate block font-mono">
                    {order.paymentIntentId}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
