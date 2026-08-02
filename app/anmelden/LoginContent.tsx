'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '@/lib/store/auth'

export function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifiedSuccess, setVerifiedSuccess] = useState(false)
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Check URL params for verification status
  useEffect(() => {
    const verified = searchParams.get('verified')
    const errorParam = searchParams.get('error')

    if (verified === 'true') {
      setVerifiedSuccess(true)
      setError('')
      const timer = setTimeout(() => setVerifiedSuccess(false), 5000)
      return () => {
        if (timer) clearTimeout(timer)
      }
    } else if (errorParam === 'invalid-token' || errorParam === 'invalid-or-expired-token') {
      setError(
        'Der Verifizierungslink ist ungültig oder abgelaufen. Bitte registrieren Sie sich erneut.'
      )
    } else if (errorParam === 'verification-failed') {
      setError('E-Mail-Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    }
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result) {
        redirectTimerRef.current = setTimeout(() => {
          const rawRedirect = searchParams.get('redirect') || '/mein-konto'
          const redirectUrl =
            rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
              ? rawRedirect
              : '/mein-konto'
          router.push(redirectUrl)
        }, 1000)
      } else {
        setError('E-Mail oder Passwort ist falsch.')
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
          <p className="mt-2 text-gray-600">Melde Dich an, um Deine Bestellungen zu verwalten.</p>
        </div>

        {/* Login Form */}
        <motion.div
          data-testid="login-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Anmelden</h1>

          {verifiedSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.
            </div>
          )}

          {/* Google Sign In Button - Coming soon */}
          <div className="relative mb-4">
            <button
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 py-3 font-medium text-gray-400"
            >
              <span className="text-sm">Bald verfügbar</span>
            </button>
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-400">
              Google Anmeldung
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-email"
                  data-testid="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
                  placeholder="ihre@email.de"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Passwort</label>
                <Link
                  href="/passwort-vergessen"
                  className="text-sm text-[#4ECCA3] hover:text-[#3BA88A] hover:underline"
                >
                  Passwort vergessen?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-password"
                  data-testid="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-12 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              data-testid="login-submit"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C211E] py-3 font-medium text-white transition-colors hover:bg-[#17423C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Anmelden <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
            <p className="text-center text-sm text-gray-600">
              Noch kein Konto?{' '}
              <Link href="/registrieren" className="font-medium text-[#4ECCA3] hover:underline">
                Jetzt registrieren
              </Link>
            </p>

            <p className="text-center text-xs text-gray-400">Sichere SSL-Verbindung</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
