'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  productName: string
  createdAt: string
  isVerified: boolean
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fb-1',
    name: 'Maria S.',
    rating: 5,
    comment:
      'Die Induktionspfanne ist absolut erstklassig! Das Essen wird gleichmäßig erhitzt und die Reinigung ist ein Kinderspiel.',
    productName: 'Premium Induktionspfanne',
    createdAt: '2024-12-10T10:00:00Z',
    isVerified: true,
  },
  {
    id: 'fb-2',
    name: 'Hans W.',
    rating: 5,
    comment:
      'Das Topfset für meine neue Küche gekauft. Die Qualität ist hervorragend und sie sehen auch noch toll aus.',
    productName: 'Premium Topfset',
    createdAt: '2024-11-20T14:00:00Z',
    isVerified: true,
  },
  {
    id: 'fb-3',
    name: 'Klaus M.',
    rating: 4,
    comment:
      'Gute Produkte zu einem fairen Preis. Der Kundenservice war sehr hilfsbereit bei meinen Fragen.',
    productName: '',
    createdAt: '2024-10-15T09:00:00Z',
    isVerified: true,
  },
  {
    id: 'fb-4',
    name: 'Anna B.',
    rating: 5,
    comment:
      'Mein Dutch Oven ist jetzt mein Lieblingsteil in der Küche. Perfekt für Schmorgerichte und Brotbacken.',
    productName: 'Dutch Oven',
    createdAt: '2024-09-05T16:00:00Z',
    isVerified: true,
  },
  {
    id: 'fb-5',
    name: 'Thomas K.',
    rating: 5,
    comment:
      'Die Messer sind scharf und gut ausbalanciert. Endlich kann ich wie ein Profi schneiden!',
    productName: 'Chef Messerset',
    createdAt: '2024-08-18T11:00:00Z',
    isVerified: true,
  },
]

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
    />
  ))
}

interface TestimonialsSectionProps {
  initialTestimonials?: Testimonial[]
}

export function TestimonialsSection({ initialTestimonials }: TestimonialsSectionProps) {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials ?? [])
  const [loading, setLoading] = useState(!initialTestimonials)

  useEffect(() => {
    if (initialTestimonials && initialTestimonials.length > 0) return
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => setTestimonials(data.testimonials ?? []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false))
  }, [initialTestimonials])

  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-[#4ECCA3]/5 to-[#4ECCA3]/10 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        </div>
      </section>
    )
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : []

  // Hide section if no real testimonials
  if (!loading && displayTestimonials.length === 0) {
    return null
  }

  return (
    <section className="bg-gradient-to-br from-[#4ECCA3]/5 to-[#4ECCA3]/10 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#4ECCA3]/10 px-4 py-2"
            >
              <Quote className="h-4 w-4 text-[#4ECCA3]" />
              <span className="text-sm font-medium text-[#4ECCA3]">Kundenstimmen</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl"
            >
              Das sagen unsere Kunden
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-6 max-w-2xl text-lg text-gray-600"
            >
              Überzeugen Sie sich von der Qualität unserer Produkte durch die Erfahrungen unserer
              zufriedenen Kunden.
            </motion.p>

            {/* Rating Summary */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 shadow-sm"
            >
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{displayTestimonials.length} Bewertungen</span>
            </motion.div>
          </div>

          {/* Animated Testimonials Marquee */}
          <div className="relative -mx-4 mt-16 overflow-hidden px-4 py-4 sm:mx-0 sm:px-0">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-[#F4FBF9] to-transparent sm:w-32" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-[#F4FBF9] to-transparent sm:w-32" />

            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
              className="flex w-max gap-6"
            >
              {[
                ...displayTestimonials,
                ...displayTestimonials,
                ...displayTestimonials,
                ...displayTestimonials,
              ].map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="flex w-[280px] flex-shrink-0 flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4ECCA3]/10 sm:w-[380px] sm:p-8"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <img
                      src={`https://i.pravatar.cc/96?u=${testimonial.id}`}
                      alt={testimonial.name}
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold tracking-tight text-gray-900">
                        {testimonial.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    {testimonial.isVerified && (
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-50"
                        title="Verifizierter Kauf"
                      >
                        <svg
                          className="h-4 w-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <blockquote className="relative z-10 flex-1 text-[15px] italic leading-relaxed text-gray-600 sm:text-base">
                    <span className="absolute -left-2 -top-4 -z-10 font-serif text-4xl text-[#4ECCA3] opacity-20">
                      &ldquo;
                    </span>
                    {testimonial.comment}
                  </blockquote>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100/60 pt-5">
                    {testimonial.productName ? (
                      <p className="max-w-[200px] truncate pr-4 text-xs font-bold text-[#4ECCA3]">
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

          {/* Redirect to contact for reviews */}
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/kontakt')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4ECCA3] px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-[#3BA88A] hover:shadow-xl"
            >
              <MessageSquare className="h-5 w-5" />
              Bewertung schreiben
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
