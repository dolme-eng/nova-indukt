'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, CheckCircle, Flag, X, Filter, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { logError } from '@/lib/logger'
import { useRecaptcha } from '@/hooks/use-recaptcha'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  helpful: number
  verified: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    displayName: string
  }
}

interface ReviewStats {
  average: number
  count: number
  distribution: Record<number, number>
}

interface ProductReviewsProps {
  productId: string
  initialRating: number
  initialCount: number
}

export function ProductReviews({ productId, initialRating, initialCount }: ProductReviewsProps) {
  const { data: session } = useSession()
  const { execute } = useRecaptcha()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    average: initialRating,
    count: initialCount,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'highest' | 'lowest'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const fetchReviews = useCallback(
    async (pageNum = 1, reset = false, signal?: AbortSignal) => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          productId,
          page: pageNum.toString(),
          limit: '10',
          published: 'true',
        })
        if (filterRating) params.append('rating', filterRating.toString())

        const response = await fetch(`/api/reviews?${params}`, { signal })
        if (!response.ok) throw new Error('Failed to fetch reviews')

        const data = await response.json()

        setReviews((prev) => (reset ? data.reviews : [...prev, ...data.reviews]))
        setStats(data.stats)
        setHasMore(data.reviews.length === 10)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        logError('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [productId, filterRating]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchReviews(1, true, controller.signal)
    return () => controller.abort()
  }, [fetchReviews])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchReviews(nextPage)
  }

  const markHelpful = async (reviewId: string) => {
    if (helpfulReviews.includes(reviewId)) return

    try {
      const response = await fetch(`/api/reviews?id=${reviewId}&action=helpful`, {
        method: 'PUT',
      })
      if (response.ok) {
        setHelpfulReviews([...helpfulReviews, reviewId])
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
        )
      }
    } catch (error) {
      logError('Error marking helpful:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session?.user) return

    setIsSubmitting(true)
    setSubmitError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      productId,
      rating: parseInt(formData.get('rating') as string),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      wouldRecommend: formData.get('wouldRecommend') === 'on',
    }

    try {
      const recaptchaToken = await execute('review')

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(recaptchaToken ? { 'x-recaptcha-token': recaptchaToken } : {}),
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review')
      }

      setSubmitSuccess(true)
      setShowReviewForm(false)
      // Refresh reviews
      fetchReviews(1, true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'helpful':
        return b.helpful - a.helpful
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setFilterRating(null)
    setPage(1)
    fetchReviews(1, true)
  }

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showReviewForm) return
    const modal = modalRef.current
    if (!modal) return

    const previouslyFocused = document.activeElement as HTMLElement

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const getFocusable = () =>
      Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector))

    const firstFocusable = () => getFocusable()[0]
    const lastFocusable = () => getFocusable().at(-1)

    setTimeout(() => firstFocusable()?.focus(), 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setShowReviewForm(false)
        return
      }

      if (e.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable()) {
          e.preventDefault()
          lastFocusable()?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable()) {
          e.preventDefault()
          firstFocusable()?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [showReviewForm])

  return (
    <div
      data-testid="reviews-section"
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Kundenbewertungen</h2>

      {/* Rating Overview */}
      <div className="mb-8 grid gap-8 md:grid-cols-2">
        {/* Average Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{stats.average.toFixed(1)}</div>
            <div className="my-2 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(stats.average)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Basierend auf {stats.count} Bewertungen</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0
              const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0

              return (
                <button
                  key={rating}
                  onClick={() => {
                    setFilterRating(filterRating === rating ? null : rating)
                    setPage(1)
                    fetchReviews(1, true)
                  }}
                  className={`flex w-full items-center gap-3 text-sm ${
                    filterRating === rating ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="w-3">{rating}</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-gray-500">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Write Review CTA */}
        <div className="flex flex-col justify-center rounded-xl bg-gray-50 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">Eigene Bewertung schreiben</h3>
          <p className="mb-4 text-sm text-gray-600">
            Teilen Sie Ihre Erfahrungen mit diesem Produkt mit anderen Kunden.
          </p>
          {session?.user ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="rounded-xl bg-[#4ECCA3] px-6 py-3 font-medium text-white transition-colors hover:bg-[#3BA88A]"
            >
              Bewertung schreiben
            </button>
          ) : (
            <p className="text-sm text-gray-500">Bitte anmelden um eine Bewertung zu schreiben.</p>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Bewertung schreiben"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Bewertung schreiben</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Bewertungsformular schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <p className="font-medium text-gray-900">Vielen Dank für Ihre Bewertung!</p>
                <p className="mt-2 text-sm text-gray-500">Sie wird nach Prüfung veröffentlicht.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {submitError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{submitError}</div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Bewertung</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label
                        key={star}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setSelectedRating(star)}
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={star}
                          required
                          className="sr-only"
                          checked={selectedRating === star}
                          onChange={() => setSelectedRating(star)}
                        />
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoverRating || selectedRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 hover:text-amber-300'
                          }`}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
                  <input
                    name="title"
                    required
                    minLength={3}
                    maxLength={100}
                    aria-label="Bewertungstitel"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#4ECCA3] focus:outline-none"
                    placeholder="Zusammenfassung Ihrer Erfahrung"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ihre Bewertung
                  </label>
                  <textarea
                    name="content"
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={4}
                    aria-label="Ihre Bewertung"
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:border-[#4ECCA3] focus:outline-none"
                    placeholder="Was hat Ihnen gefallen oder nicht gefallen?"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="wouldRecommend"
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Ich würde dieses Produkt empfehlen</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4ECCA3] py-3 font-medium text-white transition-colors hover:bg-[#3BA88A] disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Bewertung absenden
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Sortieren nach:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label="Bewertungen sortieren"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#4ECCA3] focus:outline-none"
        >
          <option value="newest">Neueste zuerst</option>
          <option value="helpful">Hilfreichste</option>
          <option value="highest">Beste Bewertung</option>
          <option value="lowest">Niedrigste Bewertung</option>
        </select>

        {filterRating !== null && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700"
          >
            {filterRating} Sterne
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading && reviews.length === 0 ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
              >
                {/* Review Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
                      <Image
                        src={`https://i.pravatar.cc/80?u=${review.id}`}
                        alt={review.user.displayName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.user.displayName}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Verifizierter Kauf
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{new Date(review.createdAt).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Content */}
                <div className="ml-[3.25rem]">
                  <h4 className="mb-2 font-semibold text-gray-900">{review.title}</h4>
                  <p
                    className={`text-gray-600 ${expandedReview === review.id ? '' : 'line-clamp-3'}`}
                  >
                    {review.content}
                  </p>
                  {review.content.length > 200 && (
                    <button
                      onClick={() =>
                        setExpandedReview(expandedReview === review.id ? null : review.id)
                      }
                      className="mt-2 text-sm font-medium text-[#4ECCA3] hover:underline"
                    >
                      {expandedReview === review.id ? 'Weniger anzeigen' : 'Weiterlesen'}
                    </button>
                  )}
                </div>

                {/* Review Actions */}
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => markHelpful(review.id)}
                    className={`flex items-center gap-1.5 text-sm ${
                      helpfulReviews.includes(review.id)
                        ? 'text-[#4ECCA3]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${helpfulReviews.includes(review.id) ? 'fill-current' : ''}`}
                    />
                    Hilfreich ({review.helpful})
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await fetch(`/api/reviews?id=${review.id}&action=report`, { method: 'PUT' })
                      } catch {}
                    }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
                    aria-label={`Bewertung von ${review.user.displayName} melden`}
                  >
                    <Flag className="h-4 w-4" />
                    Melden
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && filteredReviews.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">Keine Bewertungen gefunden.</p>
            {filterRating !== null && (
              <button
                onClick={clearFilters}
                className="mt-2 font-medium text-[#4ECCA3] hover:underline"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Mehr laden
          </button>
        </div>
      )}
    </div>
  )
}
