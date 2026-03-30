'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronRight, ArrowLeft
} from 'lucide-react'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'

export function KontaktContent() {
  // const t = useDeTranslations('contact')
  
  // Safe hardcoded translations for Kontakt
  const t = (key: string) => {
    const dict: Record<string, string> = {
      'nav.home': 'Startseite',
      'title': 'Kontaktieren Sie uns',
      'subtitle': 'Haben Sie Fragen zu unseren Produkten oder wünschen eine Beratung? Unser Team ist für Sie da.',
      'address': 'Besuchen Sie uns',
      'phone': 'Rufen Sie uns an',
      'email': 'Schreiben Sie uns',
      'hours': 'Öffnungszeiten',
      'form.name': 'Ihr Name',
      'form.email': 'Ihre E-Mail-Adresse',
      'form.subject': 'Betreff',
      'form.message': 'Ihre Nachricht',
      'form.send': 'Nachricht absenden',
      'form.sending': 'Wird gesendet...',
      'messageSent': 'Vielen Dank für Ihre Nachricht!',
      'messageSentDescription': 'Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.'
    }
    return dict[key] || key
  }

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
      title: t('address'),
      content: 'Nova Indukt GmbH\nIndustriestraße 123\n12345 Berlin, Deutschland'
    },
    {
      icon: Phone,
      title: t('phone'),
      content: '+49 (0) 30 12345678'
    },
    {
      icon: Mail,
      title: t('email'),
      content: 'support@nova-indukt.de'
    },
    {
      icon: Clock,
      title: t('hours'),
      content: 'Mo-Fr: 09:00 - 18:00 Uhr\nSa: 10:00 - 14:00 Uhr'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 selection:bg-[#4ECCA3]/30">
      
      {/* Abstract Background hero */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#4ECCA3]/10 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#17423C]/5 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      {/* Breadcrumbs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-[72px] lg:top-[88px] z-30 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 py-4 text-xs sm:text-sm font-medium tracking-wide">
            <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors lg:hidden bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2.5">
              <Link href="/" className="text-gray-400 hover:text-[#4ECCA3] transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-[#0C211E] font-bold tracking-tight">{t('title')}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-7xl relative z-10">
        
        <div className="max-w-3xl mb-16 lg:mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0C211E] mb-6 font-heading tracking-tight"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-gray-200 transition-colors group"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-[#4ECCA3]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-[#4ECCA3]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0C211E] text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm sm:text-base whitespace-pre-line leading-relaxed font-medium">
                      {item.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-[#4ECCA3]" />
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0C211E] mb-4 font-heading">{t('messageSent')}</h2>
                    <p className="text-gray-500 text-lg font-medium max-w-sm mx-auto">{t('messageSentDescription')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-8 py-4 bg-gray-50 border border-gray-200 text-[#0C211E] font-bold rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Weitere Nachricht
                      </button>
                      <Link
                        href="/produkte"
                        className="px-8 py-4 bg-[#0C211E] text-white font-bold rounded-xl hover:bg-[#17423C] shadow-lg shadow-[#0C211E]/20 transition-all flex items-center justify-center gap-2"
                      >
                        Produkte entdecken <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('form.name')} *</label>
                        <input
                          type="text" required value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('form.email')} *</label>
                        <input
                          type="email" required value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t('form.subject')} *</label>
                      <input
                        type="text" required value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t('form.message')} *</label>
                      <textarea
                        required value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={6}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E] resize-none"
                      />
                    </div>
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 text-lg shadow-xl shadow-[#0C211E]/20"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t('form.sending')}</span>
                          </div>
                        ) : (
                          <>
                            <Send className="w-5 h-5" /> 
                            <span>{t('form.send')}</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}
