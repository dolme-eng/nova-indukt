'use client'

import { useState, useMemo } from 'react'
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  User,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
  Check,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

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

export default function ReviewsList({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(
    initialReviews.map((r) => ({
      ...r,
      isPublished: r.isPublished ?? false,
      isVerified: r.isVerified ?? false,
    }))
  )
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        !searchQuery ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.product.nameDe.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRating = ratingFilter === null || review.rating === ratingFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && review.isPublished) ||
        (statusFilter === 'draft' && !review.isPublished)
      return matchesSearch && matchesRating && matchesStatus
    })
  }, [reviews, searchQuery, ratingFilter, statusFilter])

  const togglePublish = async (id: string, currentlyPublished: boolean) => {
    setIsLoading(id)
    const newPublishedState = !currentlyPublished
    try {
      const response = await fetch('/api/admin/marketing/reviews', {
        method: 'PATCH',
        body: JSON.stringify({ id, isPublished: newPublishedState, action: 'toggle-publish' }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error()

      setReviews(reviews.map((r) => (r.id === id ? { ...r, isPublished: newPublishedState } : r)))
      toast.success(newPublishedState ? 'Bewertung veröffentlicht' : 'Bewertung ausgeblendet')
    } catch (error) {
      toast.error('Fehler bei der Aktualisierung')
    } finally {
      setIsLoading(null)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Diese Bewertung dauerhaft löschen?')) return

    setIsLoading(id)
    try {
      const response = await fetch(`/api/admin/marketing/reviews?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error()

      setReviews(reviews.filter((r) => r.id !== id))
      toast.success('Bewertung gelöscht')
    } catch (error) {
      toast.error('Fehler beim Löschen')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Bewertungen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setRatingFilter(
                ratingFilter === null ? 5 : ratingFilter <= 1 ? null : ratingFilter - 1
              )
            }
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              ratingFilter !== null
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter size={18} />
            Bewertung{ratingFilter !== null ? `: ${ratingFilter}` : ''}
          </button>
          <button
            onClick={() =>
              setStatusFilter(
                statusFilter === 'all'
                  ? 'published'
                  : statusFilter === 'published'
                    ? 'draft'
                    : 'all'
              )
            }
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter !== 'all'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Check size={18} />
            Status
            {statusFilter !== 'all'
              ? `: ${statusFilter === 'published' ? 'Online' : 'Entwurf'}`
              : ''}
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${
              !review.isPublished
                ? 'border-slate-200 opacity-75 grayscale-[0.5]'
                : 'border-slate-200'
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col gap-8 lg:flex-row">
                {/* Author & Product Info */}
                <div className="space-y-4 lg:w-1/4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-600">
                      {review.user?.image ? (
                        <img
                          src={review.user.image}
                          alt={review.user?.name || 'Kunde'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">
                        {review.user?.name || 'Anonymer Kunde'}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {review.user?.email || 'Keine E-Mail'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-slate-200 bg-white">
                      {review.product.images[0] && (
                        <Image
                          src={review.product.images[0].url}
                          alt={review.product.nameDe}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {review.product.nameDe}
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Produkt
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {format(new Date(review.createdAt), 'dd MMM yyyy', { locale: de })}
                      </span>
                    </div>
                    {review.isVerified && (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Verifizierter Kauf
                        </span>
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
                          className={
                            i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {!review.isPublished && (
                        <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          <X size={12} /> Entwurf
                        </span>
                      )}
                      {review.isPublished && (
                        <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                          <Check size={12} /> Online
                        </span>
                      )}
                    </div>
                  </div>
                  {review.title && (
                    <h3 className="text-lg font-black text-slate-900">{review.title}</h3>
                  )}
                  <p className="border-l-4 border-slate-100 py-1 pl-4 italic leading-relaxed text-slate-600">
                    "{review.content}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row justify-end gap-2 lg:w-48 lg:flex-col lg:justify-start">
                  <button
                    onClick={() => togglePublish(review.id, review.isPublished)}
                    disabled={isLoading === review.id}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all lg:flex-none ${
                      review.isPublished
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90'
                    }`}
                  >
                    {review.isPublished ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                    {review.isPublished ? 'Ausblenden' : 'Veröffentlichen'}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    disabled={isLoading === review.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600 lg:flex-none"
                  >
                    <Trash2 size={14} />
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <Star size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-lg font-medium">
              {searchQuery || ratingFilter !== null || statusFilter !== 'all'
                ? 'Keine Bewertungen gefunden.'
                : 'Keine Kundenbewertungen zum Moderieren.'}
            </p>
            <p className="text-sm">
              {searchQuery || ratingFilter !== null || statusFilter !== 'all'
                ? 'Versuchen Sie andere Filtereinstellungen.'
                : 'Neue Bewertungen erscheinen hier zur Validierung.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
