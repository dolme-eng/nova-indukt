'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, User, XCircle } from 'lucide-react'
import { useAuth } from '@/lib/store/auth'

export function RegisterContent() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein.')
      return
    }

    if (formData.password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    if (!formData.acceptTerms) {
      setError('Bitte akzeptieren Sie die Datenschutzbestimmungen.')
      return
    }

    setLoading(true)

    try {
      const result = await register(formData.name, formData.email, formData.password)

      if (result.success) {
        setSuccess(true)
        redirectTimerRef.current = setTimeout(() => {
          router.push('/mein-konto')
        }, 3000)
      } else {
        setError(result.error || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.')
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            NOVA INDUKT
          </Link>
          <p className="mt-2 text-gray-600">
            Erstelle ein Konto für ein besseres Einkaufserlebnis.
          </p>
        </div>

        {/* Register Form */}
        <motion.div
          data-testid="register-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Registrieren</h1>

          {/* Google Sign Up Button - Coming soon */}
          <div className="relative mb-4">
            <button
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 py-3 font-medium text-gray-400"
            >
              <span className="text-sm">Bald verfügbar</span>
            </button>
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-400">
              Google Registrierung
            </span>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Oder mit E-Mail</span>
            </div>
          </div>

          {error && (
            <div
              data-testid="error-message"
              className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
            >
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Konto erfolgreich erstellt!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  data-testid="register-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
                  placeholder="Max Mustermann"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  data-testid="register-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
                  placeholder="ihre@email.de"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  data-testid="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-12 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Passwort bestätigen
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  data-testid="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* GDPR Checkbox - Required */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4ECCA3] focus:ring-[#4ECCA3]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Ich akzeptiere die Datenschutzbestimmungen und AGB.
              </label>
            </div>

            {/* Newsletter Checkbox - Optional */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.acceptNewsletter}
                onChange={(e) => setFormData({ ...formData, acceptNewsletter: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4ECCA3] focus:ring-[#4ECCA3]"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-600">
                Ich möchte den Newsletter abonnieren.
              </label>
            </div>

            {/* Submit Button */}
            <button
              data-testid="register-submit"
              type="submit"
              disabled={loading || success}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C211E] py-3 font-medium text-white transition-colors hover:bg-[#17423C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Registrieren <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="text-center text-sm text-gray-600">
              Bereits ein Konto?{' '}
              <Link href="/anmelden" className="font-medium text-[#4ECCA3] hover:underline">
                Anmelden
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
