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

          {/* Animated Testimonials Marquee */}
          <div className="relative overflow-hidden mt-16 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#F4FBF9] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#F4FBF9] to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
              className="flex gap-6 w-max"
            >
              {/* Duplicate array for seamless infinite scroll */}
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="w-[280px] sm:w-[380px] flex-shrink-0 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:shadow-[#4ECCA3]/10 hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8 flex flex-col border border-gray-100"
                >
                  {/* Header with avatar and info flexed differently */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4ECCA3] to-[#3BA88A] rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                      <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-base truncate tracking-tight">{testimonial.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    {testimonial.isVerified && (
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0" title={t('verified')}>
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-[15px] sm:text-base text-gray-600 leading-relaxed flex-1 italic relative z-10">
                    <span className="text-4xl text-[#4ECCA3] opacity-20 absolute -top-4 -left-2 -z-10 font-serif">"</span>
                    {testimonial.comment}
                  </blockquote>

                  {/* Footer */}
                  <div className="mt-6 pt-5 border-t border-gray-100/60 flex items-center justify-between">
                    {testimonial.productName ? (
                      <p className="text-xs font-bold text-[#4ECCA3] truncate pr-4 max-w-[200px]">
                        {testimonial.productName}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs font-semibold text-gray-400">
                      {formatDate(testimonial.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
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
