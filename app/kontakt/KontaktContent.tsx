'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import { COMPANY } from '@/lib/constants/company'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100),
  email: z.string().min(1, 'E-Mail ist erforderlich').email('Ungültige E-Mail-Adresse'),
  subject: z.string().min(1, 'Betreff ist erforderlich').max(200),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen lang sein').max(5000),
})

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>

export function KontaktContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string) => {
    const result = contactSchema.safeParse({ ...formData, [name]: value })
    if (!result.success) {
      const fieldError = result.error.issues.find((i) => i.path[0] === name)
      return fieldError?.message || ''
    }
    return ''
  }

  const handleBlur = (name: string, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: ContactFormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      setTouched({ name: true, email: true, subject: true, message: true })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten')
      }

      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Besuchen Sie uns',
      content: `${COMPANY.name}\n${COMPANY.street}\n${COMPANY.zip} ${COMPANY.city}, ${COMPANY.country}`,
    },
    {
      icon: Phone,
      title: 'WhatsApp-Kundenservice',
      isWhatsApp: true,
      content: 'Antwort in der Regel in wenigen Minuten',
    },
    {
      icon: Mail,
      title: 'Schreiben Sie uns',
      content: COMPANY.email.support,
    },
    {
      icon: Clock,
      title: 'Öffnungszeiten',
      content: COMPANY.hours.combined,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 selection:bg-[#4ECCA3]/30">
      {/* Abstract Background hero */}
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-[600px] w-full overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[#4ECCA3]/10 mix-blend-multiply blur-[120px]" />
        <div className="absolute left-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#17423C]/5 mix-blend-multiply blur-[100px]" />
      </div>

      {/* Breadcrumbs */}
      <nav className="sticky top-[72px] z-30 border-b border-gray-100 bg-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-md lg:top-[88px]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 py-4 text-xs font-medium tracking-wide sm:text-sm">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-gray-500 transition-colors hover:text-gray-900 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Startseite</span>
            </Link>
            <div className="hidden items-center gap-2.5 lg:flex">
              <Link href="/" className="text-gray-400 transition-colors hover:text-[#4ECCA3]">
                Startseite
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <span className="font-bold tracking-tight text-[#0C211E]">Kontaktieren Sie uns</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mb-16 max-w-3xl lg:mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 font-heading text-4xl font-bold tracking-tight text-[#0C211E] sm:text-5xl lg:text-6xl"
          >
            Kontaktieren Sie uns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-lg font-medium leading-relaxed text-gray-500 sm:text-xl"
          >
            Haben Sie Fragen zu unseren Produkten oder wünschen eine Beratung? Unser Team ist für
            Sie da.
          </motion.p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Contact Info Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="group rounded-[2rem] border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-gray-200"
              >
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4ECCA3]/10 transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="h-8 w-8 text-[#4ECCA3]" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-[#0C211E]">{item.title}</h3>
                    {item.isWhatsApp ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-gray-500">{item.content}</p>
                        <a
                          href={COMPANY.whatsapp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center gap-3 rounded-xl bg-[#25D366] px-6 py-3 font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-[#20ba5a]"
                        >
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          Chat starten
                        </a>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-gray-500 sm:text-base">
                        {item.content}
                      </p>
                    )}
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
              className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-12"
            >
              <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-emerald-400 to-[#4ECCA3]" />

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                  >
                    <div className="mx-auto mb-6 flex h-24 w-24 -rotate-6 transform items-center justify-center rounded-[2rem] bg-green-50">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="mb-4 font-heading text-3xl font-bold text-[#0C211E]">
                      Vielen Dank für Ihre Nachricht!
                    </h2>
                    <p className="mx-auto max-w-sm text-lg font-medium text-gray-500">
                      Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen
                      melden.
                    </p>
                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-8 py-4 font-bold text-[#0C211E] transition-colors hover:bg-gray-100"
                      >
                        Weitere Nachricht
                      </button>
                      <Link
                        href="/produkte"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#0C211E] px-8 py-4 font-bold text-white shadow-lg shadow-[#0C211E]/20 transition-all hover:bg-[#17423C]"
                      >
                        Produkte entdecken <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-name"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          Ihr Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name', formData.name)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'contact-name-error' : undefined}
                          className={`w-full rounded-xl border bg-gray-50 px-5 py-4 font-medium text-[#0C211E] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 ${
                            errors.name && touched.name
                              ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                              : 'border-transparent focus:border-[#4ECCA3]'
                          }`}
                        />
                        {errors.name && touched.name && (
                          <p id="contact-name-error" className="ml-1 text-xs text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-email"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          Ihre E-Mail-Adresse *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          onBlur={() => handleBlur('email', formData.email)}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                          className={`w-full rounded-xl border bg-gray-50 px-5 py-4 font-medium text-[#0C211E] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 ${
                            errors.email && touched.email
                              ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                              : 'border-transparent focus:border-[#4ECCA3]'
                          }`}
                        />
                        {errors.email && touched.email && (
                          <p id="contact-email-error" className="ml-1 text-xs text-red-500">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-subject"
                        className="ml-1 text-sm font-bold text-gray-700"
                      >
                        Betreff *
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        onBlur={() => handleBlur('subject', formData.subject)}
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                        className={`w-full rounded-xl border bg-gray-50 px-5 py-4 font-medium text-[#0C211E] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 ${
                          errors.subject && touched.subject
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                            : 'border-transparent focus:border-[#4ECCA3]'
                        }`}
                      />
                      {errors.subject && touched.subject && (
                        <p id="contact-subject-error" className="ml-1 text-xs text-red-500">
                          {errors.subject}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-message"
                        className="ml-1 text-sm font-bold text-gray-700"
                      >
                        Ihre Nachricht *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        onBlur={() => handleBlur('message', formData.message)}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                        rows={6}
                        className={`w-full resize-none rounded-xl border bg-gray-50 px-5 py-4 font-medium text-[#0C211E] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 ${
                          errors.message && touched.message
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                            : 'border-transparent focus:border-[#4ECCA3]'
                        }`}
                      />
                      {errors.message && touched.message && (
                        <p id="contact-message-error" className="ml-1 text-xs text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    {error && (
                      <div
                        role="alert"
                        className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-red-600"
                      >
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    )}
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0C211E] py-4 text-lg font-bold text-white shadow-xl shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-3">
                            <div
                              aria-hidden="true"
                              className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                            />
                            <span>Wird gesendet...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Nachricht absenden</span>
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
