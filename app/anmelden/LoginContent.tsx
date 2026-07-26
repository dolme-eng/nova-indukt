'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, Chrome } from 'lucide-react'
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
  const [success, setSuccess] = useState(false)

  // Check URL params for verification status
  useEffect(() => {
    const verified = searchParams.get('verified')
    const errorParam = searchParams.get('error')

    if (verified === 'true') {
      setSuccess(true)
      setError('')
      setTimeout(() => setSuccess(false), 5000)
    } else if (errorParam === 'invalid-token' || errorParam === 'invalid-or-expired-token') {
      setError(
        'Der Verifizierungslink ist ungültig oder abgelaufen. Bitte registrieren Sie sich erneut.'
      )
    } else if (errorParam === 'verification-failed') {
      setError('E-Mail-Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result) {
      setSuccess(true)
      setTimeout(() => {
        const rawRedirect = searchParams.get('redirect') || '/mein-konto'
        const redirectUrl =
          rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/mein-konto'
        router.push(redirectUrl)
      }, 1000)
    } else {
      setError('E-Mail oder Passwort ist falsch.')
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    // Simulate Google Sign In
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful Google authentication flow
    setSuccess(true)
    setTimeout(() => {
      router.push('/mein-konto')
    }, 1000)

    setLoading(false)
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

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Chrome className="h-5 w-5 text-blue-500" />
            Mit Google anmelden
          </button>

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
              Erfolgreich angemeldet!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
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
                <label className="block text-sm font-medium text-gray-700">Passwort</label>
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
              disabled={loading || success}
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
