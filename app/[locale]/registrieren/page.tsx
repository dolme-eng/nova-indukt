'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, User, XCircle } from 'lucide-react'
import { useAuth } from '@/lib/store/auth'

interface RegisterContentProps {
  // No props needed - only German locale
}

function RegisterContent() {
  const router = useRouter()
  const t = useTranslations('auth.register')
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }

    if (formData.password.length < 6) {
      setError(t('error'))
      return
    }

    if (!formData.acceptTerms) {
      setError(t('error'))
      return
    }

    setLoading(true)

    const result = await register(formData.name, formData.email, formData.password)
    
    if (result) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/mein-konto')
      }, 1000)
    } else {
      setError(t('error'))
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            NOVA INDUKT
          </Link>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <XCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              {t('success')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('name')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 transition-all"
                  placeholder="Max Mustermann"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 transition-all"
                  placeholder="ihre@email.de"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 transition-all"
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
                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                className="mt-1 w-4 h-4 text-[#4ECCA3] border-gray-300 rounded focus:ring-[#4ECCA3]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                {t('gdpr')}
              </label>
            </div>

            {/* Newsletter Checkbox - Optional */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.acceptNewsletter}
                onChange={(e) => setFormData({...formData, acceptNewsletter: e.target.checked})}
                className="mt-1 w-4 h-4 text-[#4ECCA3] border-gray-300 rounded focus:ring-[#4ECCA3]"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-600">
                {t('newsletter')}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('submit')} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              {t('hasAccount')}{' '}
              <Link 
                href="/anmelden"
                className="text-[#4ECCA3] font-medium hover:underline"
              >
                {t('login')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return <RegisterContent />
}
