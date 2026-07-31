'use client'

import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { useRecaptcha } from '@/hooks/use-recaptcha'

export const HomeNewsletter = memo(function HomeNewsletter() {
  const { execute } = useRecaptcha()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    try {
      const recaptchaToken = await execute('newsletter_subscribe')

      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(recaptchaToken ? { 'x-recaptcha-token': recaptchaToken } : {}),
        },
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
    <section className="relative overflow-hidden bg-white py-12 sm:py-20">
      <div className="absolute right-0 top-0 -z-10 aspect-square w-1/3 rounded-bl-[100px] bg-nova-50" />
      <div className="absolute bottom-0 left-0 -z-10 aspect-square w-1/4 rounded-tr-[100px] bg-gray-50" />

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-gray-800 bg-gray-900 p-8 text-center shadow-2xl sm:p-14 lg:p-20"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nova-500/20 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
              <Sparkles className="h-8 w-8 text-nova-400" />
            </div>
            <h2 className="mb-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Werde Induktions-Experte
            </h2>
            <p className="mb-10 text-lg font-light text-gray-300 sm:text-xl">
              Erhalten Sie 10% Rabatt auf Ihre erste Bestellung plus exklusive Angebote und Rezepte.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 rounded-2xl border border-nova-500/30 bg-nova-500/20 px-6 py-4 text-lg font-medium text-nova-300"
              >
                <CheckCircle className="h-6 w-6" />
                Vielen Dank! Ihre Newsletter-Anmeldung ist bestätigt.
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-xl flex-col gap-4 sm:flex-row"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ihre E-Mail-Adresse"
                    required
                    disabled={status === 'loading'}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 px-6 py-4 font-medium text-white backdrop-blur-sm transition-all placeholder:text-gray-400 focus:border-nova-400 focus:bg-white/10 focus:outline-none disabled:opacity-60 sm:py-5"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[#0C211E] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C] disabled:opacity-60 sm:py-5"
                >
                  {status === 'loading' ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Anmelden <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-4 text-sm text-red-400">
                Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
              </p>
            )}

            <p className="mt-6 text-xs text-gray-500">
              Durch die Anmeldung akzeptieren Sie unsere Datenschutzbestimmungen. Abmeldung
              jederzeit möglich.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
})
