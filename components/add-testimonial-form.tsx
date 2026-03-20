'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, CheckCircle } from 'lucide-react'
import { useTestimonials } from '@/lib/store/testimonials'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'

interface AddTestimonialFormProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTestimonialForm({ isOpen, onClose }: AddTestimonialFormProps) {
  const t = useDeTranslations('testimonials')
  const { addTestimonial } = useTestimonials()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    productName: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Scrollen des Bodys sperren, solange das Modal geöffnet ist
  useEffect(() => {
    if (!isOpen) return
    
    const originalStyle = window.getComputedStyle(document.body).overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.touchAction = 'none'
    
    return () => {
      document.body.style.overflow = originalStyle
      document.body.style.paddingRight = originalPaddingRight
      document.body.style.touchAction = ''
    }
  }, [isOpen])

  // Verhindert das Weiterreichen von Scroll-Events zur Seite
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const target = e.currentTarget as HTMLElement
    const isScrollingUp = e.deltaY < 0
    const isScrollingDown = e.deltaY > 0
    const isAtTop = target.scrollTop === 0
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight
    
    // Si on est en haut et qu'on scroll vers le haut, ou en bas et qu'on scroll vers le bas
    // on empêche la propagation pour éviter que la page scroll
    if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
      e.preventDefault()
    }
    e.stopPropagation()
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
  }, [])

  // Scrollen auf dem Backdrop blockieren
  const handleBackdropWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
  }, [])

  const handleBackdropTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t('form.nameRequired')
    }
    if (!formData.email.trim()) {
      newErrors.email = t('form.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('form.emailInvalid')
    }
    if (!formData.comment.trim()) {
      newErrors.comment = t('form.commentRequired')
    } else if (formData.comment.length < 10) {
      newErrors.comment = t('form.commentMinLength')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    addTestimonial({
      name: formData.name,
      email: formData.email,
      rating: formData.rating,
      comment: formData.comment,
      productName: formData.productName || undefined,
      isVerified: false
    })
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    setTimeout(() => {
      setFormData({ name: '', email: '', rating: 5, comment: '', productName: '' })
      setIsSuccess(false)
      onClose()
    }, 2000)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({})
      onClose()
    }
  }

  const renderStarInput = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= formData.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating}/5 {t('form.stars')}
        </span>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            onWheel={handleBackdropWheel}
            onTouchMove={handleBackdropTouchMove}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal - structure simple avec scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-10 z-50 overflow-hidden"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full h-full max-w-lg mx-auto flex flex-col">
              {/* Header - fixe */}
              <div className="flex-shrink-0 flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t('form.title')}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t('form.subtitle')}</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content - scrollable */}
              <div 
                className="flex-1 overflow-y-auto overscroll-contain p-6"
                onWheel={handleWheel}
                onTouchMove={handleTouchMove}
                style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
              >
                {isSuccess ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('form.successTitle')}</h3>
                    <p className="text-gray-600">{t('form.successMessage')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('form.ratingLabel')} *
                      </label>
                      {renderStarInput()}
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('form.nameLabel')} *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('form.namePlaceholder')}
                        className={`w-full px-3 py-2 rounded-xl border focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 outline-none transition-all ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('form.emailLabel')} *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('form.emailPlaceholder')}
                        className={`w-full px-3 py-2 rounded-xl border focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 outline-none transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('form.productLabel')}
                      </label>
                      <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        placeholder={t('form.productPlaceholder')}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 outline-none transition-all"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('form.commentLabel')} *
                      </label>
                      <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder={t('form.commentPlaceholder')}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-xl border focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 outline-none transition-all resize-none ${
                          errors.comment ? 'border-red-500' : 'border-gray-200'
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.comment && (
                        <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500 text-right">
                        {formData.comment.length} {t('form.characters')}
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#4ECCA3] text-white rounded-xl font-semibold hover:bg-[#3BA88A] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('form.submitting')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t('form.submit')}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center pb-4">
                      {t('form.privacyNotice')}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
