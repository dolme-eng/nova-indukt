'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, User } from 'lucide-react'
import { useTestimonials } from '@/lib/store/testimonials'
import { formatDate } from '@/lib/utils'
import { AddTestimonialForm } from './add-testimonial-form'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'

export function TestimonialsSection() {
  const t = useDeTranslations('testimonials')
  const { testimonials, averageRating, isHydrated } = useTestimonials()
  const [showForm, setShowForm] = useState(false)

  if (!isHydrated) {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#4ECCA3]/5 to-[#4ECCA3]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          </div>
        </div>
      </section>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ))
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#4ECCA3]/5 to-[#4ECCA3]/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ECCA3]/10 rounded-full mb-4"
            >
              <Quote className="w-4 h-4 text-[#4ECCA3]" />
              <span className="text-sm font-medium text-[#4ECCA3]">{t('subtitle')}</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              {t('title')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
            >
              {t('description')}
            </motion.p>

            {/* Rating Summary */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{testimonials.length} {t('reviews')}</span>
            </motion.div>
          </div>

          {/* Testimonials Grid - 3 to 4 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col"
              >
                {/* Header with avatar and info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4ECCA3] to-[#3BA88A] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{testimonial.name}</p>
                    {testimonial.productName && (
                      <p className="text-xs text-[#4ECCA3] truncate">{testimonial.productName}</p>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Comment */}
                <blockquote className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4">
                  "{testimonial.comment}"
                </blockquote>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {formatDate(testimonial.createdAt)}
                  </p>
                  {testimonial.isVerified && (
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('verified')}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Review Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ECCA3] text-white rounded-xl font-semibold hover:bg-[#3BA88A] transition-colors shadow-lg hover:shadow-xl"
            >
              <Star className="w-5 h-5" />
              {t('addReview')}
            </button>
          </div>
        </div>
      </div>

      {/* Add Testimonial Modal */}
      <AddTestimonialForm isOpen={showForm} onClose={() => setShowForm(false)} />
    </section>
  )
}
