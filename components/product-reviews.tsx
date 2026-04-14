'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, ThumbsUp, User, CheckCircle, Flag, X,
  Filter, Loader2
} from 'lucide-react'
import { useSession } from 'next-auth/react'

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
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    average: initialRating,
    count: initialCount,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
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

  const fetchReviews = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        productId,
        page: pageNum.toString(),
        limit: '10',
        status: 'approved',
      })
      if (filterRating) params.append('rating', filterRating.toString())
      
      const response = await fetch(`/api/reviews?${params}`)
      if (!response.ok) throw new Error('Failed to fetch reviews')
      
      const data = await response.json()
      
      setReviews(prev => reset ? data.reviews : [...prev, ...data.reviews])
      setStats(data.stats)
      setHasMore(data.reviews.length === 10)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }, [productId, filterRating])

  useEffect(() => {
    fetchReviews(1, true)
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
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
        ))
      }
    } catch (error) {
      console.error('Error marking helpful:', error)
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
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'helpful': return b.helpful - a.helpful
      case 'highest': return b.rating - a.rating
      case 'lowest': return a.rating - b.rating
      default: return 0
    }
  })

  const clearFilters = () => {
    setFilterRating(null)
    setPage(1)
    fetchReviews(1, true)
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Kundenbewertungen</h2>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Average Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{stats.average.toFixed(1)}</div>
            <div className="flex items-center gap-1 justify-center my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(stats.average)
                      ? 'text-amber-400 fill-amber-400'
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
                  className={`w-full flex items-center gap-3 text-sm ${
                    filterRating === rating ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="w-3">{rating}</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
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
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900 mb-2">Eigene Bewertung schreiben</h3>
          <p className="text-gray-600 text-sm mb-4">Teilen Sie Ihre Erfahrungen mit diesem Produkt mit anderen Kunden.</p>
          {session?.user ? (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors"
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Bewertung schreiben</h3>
              <button onClick={() => setShowReviewForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-900 font-medium">Vielen Dank für Ihre Bewertung!</p>
                <p className="text-gray-500 text-sm mt-2">Sie wird nach Prüfung veröffentlicht.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{submitError}</div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bewertung</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer">
                        <input type="radio" name="rating" value={star} required className="sr-only" />
                        <Star className="w-8 h-8 text-gray-300 hover:text-amber-400 peer-checked:text-amber-400 peer-checked:fill-amber-400" />
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                  <input 
                    name="title" 
                    required 
                    minLength={3}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4ECCA3]"
                    placeholder="Zusammenfassung Ihrer Erfahrung"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ihre Bewertung</label>
                  <textarea 
                    name="content" 
                    required 
                    minLength={10}
                    maxLength={2000}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4ECCA3] resize-none"
                    placeholder="Was hat Ihnen gefallen oder nicht gefallen?"
                  />
                </div>
                
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="wouldRecommend" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Ich würde dieses Produkt empfehlen</span>
                </label>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Bewertung absenden
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Sortieren nach:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4ECCA3]"
        >
          <option value="newest">Neueste zuerst</option>
          <option value="helpful">Hilfreichste</option>
          <option value="highest">Beste Bewertung</option>
          <option value="lowest">Niedrigste Bewertung</option>
        </select>

        {filterRating !== null && (
          <button
            onClick={clearFilters}
            className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full flex items-center gap-1"
          >
            {filterRating} Sterne
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading && reviews.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
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
                className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4ECCA3] to-[#3BA88A] rounded-full flex items-center justify-center text-white font-semibold">
                      {review.user.displayName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.user.displayName}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
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
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Content */}
                <div className="ml-13">
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className={`text-gray-600 ${expandedReview === review.id ? '' : 'line-clamp-3'}`}>
                    {review.content}
                  </p>
                  {review.content.length > 200 && (
                    <button
                      onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                      className="text-[#4ECCA3] text-sm font-medium mt-2 hover:underline"
                    >
                      {expandedReview === review.id ? 'Weniger anzeigen' : 'Weiterlesen'}
                    </button>
                  )}
                </div>

                {/* Review Actions */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => markHelpful(review.id)}
                    className={`flex items-center gap-1.5 text-sm ${
                      helpfulReviews.includes(review.id)
                        ? 'text-[#4ECCA3]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${helpfulReviews.includes(review.id) ? 'fill-current' : ''}`} />
                    Hilfreich ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <Flag className="w-4 h-4" />
                    Melden
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Keine Bewertungen gefunden.</p>
            {filterRating !== null && (
              <button
                onClick={clearFilters}
                className="text-[#4ECCA3] font-medium mt-2 hover:underline"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="text-center mt-8">
          <button 
            onClick={handleLoadMore}
            className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Mehr laden
          </button>
        </div>
      )}
    </div>
  )
}
