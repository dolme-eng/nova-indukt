"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  User, 
  Package, 
  Calendar,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Check,
  X
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface Review {
  id: string
  rating: number
  title: string | null
  content: string
  isPublished: boolean
  isVerified: boolean
  createdAt: Date
  product: {
    nameDe: string
    images: { url: string }[]
  }
  user: {
    name: string | null
    email: string
    image: string | null
  } | null
}

export default function ReviewsList({ initialReviews }: { initialReviews: any[] }) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>(initialReviews.map(r => ({
    ...r,
    isPublished: r.isPublished ?? false,
    isVerified: r.isVerified ?? false
  })))
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const togglePublish = async (id: string, currentlyPublished: boolean) => {
    setIsLoading(id)
    const newPublishedState = !currentlyPublished
    try {
      const response = await fetch("/api/admin/marketing/reviews", {
        method: "PATCH",
        body: JSON.stringify({ id, isPublished: newPublishedState, action: "toggle-publish" }),
        headers: { "Content-Type": "application/json" }
      })

      if (!response.ok) throw new Error()
      
      setReviews(reviews.map(r => r.id === id ? { ...r, isPublished: newPublishedState } : r))
      toast.success(newPublishedState ? "Bewertung veröffentlicht" : "Bewertung ausgeblendet")
    } catch (error) {
      toast.error("Fehler bei der Aktualisierung")
    } finally {
      setIsLoading(null)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm("Diese Bewertung dauerhaft löschen?")) return
    
    setIsLoading(id)
    try {
      const response = await fetch(`/api/admin/marketing/reviews?id=${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error()
      
      setReviews(reviews.filter(r => r.id !== id))
      toast.success("Bewertung gelöscht")
    } catch (error) {
      toast.error("Fehler beim Löschen")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Bewertungen durchsuchen..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Bewertung
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Check size={18} />
            Status
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
            !review.isPublished ? "border-slate-200 opacity-75 grayscale-[0.5]" : "border-slate-200"
          }`}>
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Author & Product Info */}
                <div className="lg:w-1/4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200 overflow-hidden flex-shrink-0">
                      {review.user?.image ? (
                        <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{review.user?.name || "Anonymer Kunde"}</p>
                      <p className="text-xs text-slate-500 truncate">{review.user?.email || "Keine E-Mail"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="h-10 w-10 bg-white rounded border border-slate-200 relative overflow-hidden flex-shrink-0">
                      {review.product.images[0] && (
                        <Image src={review.product.images[0].url} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{review.product.nameDe}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Produkt</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {format(new Date(review.createdAt), "dd MMM yyyy", { locale: de })}
                      </span>
                    </div>
                    {review.isVerified && (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Verifizierter Kauf</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {!review.isPublished && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1">
                          <X size={12} /> Entwurf
                        </span>
                      )}
                      {review.isPublished && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1">
                          <Check size={12} /> Online
                        </span>
                      )}
                    </div>
                  </div>
                  {review.title && <h3 className="text-lg font-black text-slate-900">{review.title}</h3>}
                  <p className="text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-4 py-1">
                    "{review.content}"
                  </p>
                </div>

                {/* Actions */}
                <div className="lg:w-48 flex flex-row lg:flex-col gap-2 justify-end lg:justify-start">
                  <button 
                    onClick={() => togglePublish(review.id, review.isPublished)}
                    disabled={isLoading === review.id}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      review.isPublished 
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                        : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                    }`}
                  >
                    {review.isPublished ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                    {review.isPublished ? "Ausblenden" : "Veröffentlichen"}
                  </button>
                  <button 
                    onClick={() => deleteReview(review.id)}
                    disabled={isLoading === review.id}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    <Trash2 size={14} />
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <Star size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="font-medium text-lg">Keine Kundenbewertungen zum Moderieren.</p>
            <p className="text-sm">Neue Bewertungen erscheinen hier zur Validierung.</p>
          </div>
        )}
      </div>
    </div>
  )
}
