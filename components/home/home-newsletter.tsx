'use client'

import { useState, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

export const HomeNewsletter = memo(function HomeNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      })

      if (response.ok) {
        setStatus('success')
        setEmail('')
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 aspect-square bg-nova-50 rounded-bl-[100px] -z-10" />
      <div className="absolute left-0 bottom-0 w-1/4 aspect-square bg-gray-50 rounded-tr-[100px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-14 lg:p-20 shadow-2xl relative overflow-hidden text-center max-w-5xl mx-auto border border-gray-800"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-nova-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
              <Sparkles className="w-8 h-8 text-nova-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
              Werde Induktions-Experte
            </h2>
            <p className="text-gray-300 mb-10 text-lg sm:text-xl font-light">
              Erhalten Sie 10% Rabatt auf Ihre erste Bestellung plus exklusive Angebote und Rezepte.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-nova-500/20 border border-nova-500/30 text-nova-300 font-medium py-4 px-6 rounded-2xl inline-flex items-center gap-3 text-lg"
              >
                <CheckCircle className="w-6 h-6" />
                Vielen Dank! Ihre Newsletter-Anmeldung ist bestätigt.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ihre E-Mail-Adresse"
                    required
                    disabled={status === 'loading'}
                    className="w-full px-6 py-4 sm:py-5 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:border-nova-400 focus:bg-white/10 transition-all font-medium backdrop-blur-sm disabled:opacity-60"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 sm:py-5 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors whitespace-nowrap shadow-lg shadow-[#0C211E]/20 text-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Anmelden <ArrowRight className="w-5 h-5" /></>
                  )}
                </motion.button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-red-400 text-sm mt-4">
                Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
              </p>
            )}

            <p className="text-xs text-gray-500 mt-6">
              Durch die Anmeldung akzeptieren Sie unsere Datenschutzbestimmungen. Abmeldung jederzeit möglich.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
})
