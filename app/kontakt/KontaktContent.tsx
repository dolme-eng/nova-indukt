'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronRight, ArrowLeft
} from 'lucide-react'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'

export function KontaktContent() {
  const t = useDeTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const contactInfo = [
    {
      icon: MapPin,
      titleKey: 'address',
      content: 'Nova Indukt GmbH\nIndustriestraße 123\n12345 Berlin, Deutschland'
    },
    {
      icon: Phone,
      titleKey: 'phone',
      content: '+49 (0) 30 12345678'
    },
    {
      icon: Mail,
      titleKey: 'email',
      content: 'support@nova-indukt.de'
    },
    {
      icon: Clock,
      titleKey: 'hours',
      content: 'Mo-Fr: 9:00 - 18:00 Uhr\nSa: 10:00 - 14:00 Uhr'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{t('title')}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-8">{t('title')}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 order-2 lg:order-1"
            >
              {isSubmitted ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{t('messageSent')}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">{t('messageSentDescription')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('form.name')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('form.email')}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('form.subject')}</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('form.message')}</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-semibold rounded-lg sm:rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">{t('form.sending')}</span>
                    ) : (
                      <><Send className="w-4 h-4" /> {t('form.send')}</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3 sm:space-y-4 order-1 lg:order-2"
            >
              {contactInfo.map((item, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#4ECCA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECCA3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">{t(item.titleKey)}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm whitespace-pre-line leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
