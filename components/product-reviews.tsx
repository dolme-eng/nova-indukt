'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, ThumbsUp, User, CheckCircle, Flag,
  ChevronDown, Filter
} from 'lucide-react'

interface Review {
  id: string
  author: string
  avatar?: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  verified: boolean
  images?: string[]
}

interface ProductReviewsProps {
  productId: string
  averageRating: number
  totalReviews: number
}

// Mock reviews data
const generateMockReviews = (productId: string): Review[] => [
  {
    id: '1',
    author: 'Maria S.',
    rating: 5,
    date: '2026-02-15',
    title: 'Hervorragende Qualität!',
    content: 'Diese Pfanne hat meine Erwartungen übertroffen. Die Wärmeverteilung ist perfekt und nichts klebt an. Nach 3 Monaten täglicher Nutzung sieht sie immer noch wie neu aus.',
    helpful: 24,
    verified: true
  },
  {
    id: '2',
    author: 'Thomas M.',
    rating: 5,
    date: '2026-01-28',
    title: 'Beste Investition für meine Küche',
    content: 'Ich habe lange nach einer hochwertigen Induktionspfanne gesucht und diese hier ist einfach top. Das Design ist elegant und die Verarbeitung erstklassig.',
    helpful: 18,
    verified: true
  },
  {
    id: '3',
    author: 'Anna K.',
    rating: 4,
    date: '2026-01-10',
    title: 'Sehr gut, aber schwer',
    content: 'Die Qualität ist ausgezeichnet, aber die Pfanne ist etwas schwerer als erwartet. Für mich persönlich kein Problem, aber bei längerem Kochen merkt man es.',
    helpful: 12,
    verified: true
  },
  {
    id: '4',
    author: 'Michael B.',
    rating: 5,
    date: '2025-12-20',
    title: 'Perfekt für Induktion',
    content: 'Endlich eine Pfanne, die wirklich für Induktion optimiert ist. Erhitzt schnell und gleichmäßig. Kann ich nur empfehlen!',
    helpful: 8,
    verified: false
  }
]

export function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const t = useTranslations('reviews')
  const [reviews] = useState<Review[]>(generateMockReviews(productId))
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'highest' | 'lowest'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])
  const [expandedReview, setExpandedReview] = useState<string | null>(null)

  const ratingDistribution = {
    5: Math.round(totalReviews * 0.65),
    4: Math.round(totalReviews * 0.20),
    3: Math.round(totalReviews * 0.10),
    2: Math.round(totalReviews * 0.03),
    1: Math.round(totalReviews * 0.02)
  }

  const filteredReviews = reviews
    .filter(r => filterRating === null || r.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'helpful': return b.helpful - a.helpful
        case 'highest': return b.rating - a.rating
        case 'lowest': return a.rating - b.rating
        default: return 0
      }
    })

  const markHelpful = (reviewId: string) => {
    if (!helpfulReviews.includes(reviewId)) {
      setHelpfulReviews([...helpfulReviews, reviewId])
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('title')}</h2>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Average Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 justify-center my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">{t('basedOn', { count: totalReviews })}</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`w-full flex items-center gap-3 text-sm ${
                  filterRating === rating ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="w-3">{rating}</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-gray-500">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Write Review CTA */}
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900 mb-2">{t('writeReview.title')}</h3>
          <p className="text-gray-600 text-sm mb-4">{t('writeReview.description')}</p>
          <button className="px-6 py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors">
            {t('writeReview.button')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{t('sortBy')}</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4ECCA3]"
        >
          <option value="newest">{t('sort.newest')}</option>
          <option value="oldest">{t('sort.oldest')}</option>
          <option value="helpful">{t('sort.helpful')}</option>
          <option value="highest">{t('sort.highest')}</option>
          <option value="lowest">{t('sort.lowest')}</option>
        </select>

        {filterRating !== null && (
          <button
            onClick={() => setFilterRating(null)}
            className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full flex items-center gap-1"
          >
            {filterRating} {t('stars')}
            <span className="text-amber-500">×</span>
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
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
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.author}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          {t('verifiedPurchase')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{new Date(review.date).toLocaleDateString('de-DE')}</span>
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
                    {expandedReview === review.id ? t('showLess') : t('readMore')}
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
                  {t('helpful')} ({review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)})
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                  <Flag className="w-4 h-4" />
                  {t('report')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('noResults')}</p>
            <button
              onClick={() => setFilterRating(null)}
              className="text-[#4ECCA3] font-medium mt-2 hover:underline"
            >
              {t('resetFilter')}
            </button>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredReviews.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            {t('loadMore')}
          </button>
        </div>
      )}
    </div>
  )
}
