'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Lock, ArrowLeft, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    if (!token) {
      setIsValidToken(false)
      toast.error('Ungültiger oder fehlender Token')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error('Ungültiger Token')
      return
    }

    if (password.length < 6) {
      toast.error('Passwort muss mindestens 6 Zeichen lang sein')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Passwort erfolgreich zurückgesetzt')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/anmelden')
        }, 3000)
      } else {
        toast.error(data.error || 'Ein Fehler ist aufgetreten')
        if (response.status === 400) {
          setIsValidToken(false)
        }
      }
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C211E] via-[#0C211E] to-[#154F44] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-[#4ECCA3]/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-[#4ECCA3]" />
              ) : !isValidToken ? (
                <AlertCircle className="w-8 h-8 text-red-400" />
              ) : (
                <Lock className="w-8 h-8 text-[#4ECCA3]" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSuccess 
                ? 'Passwort zurückgesetzt' 
                : !isValidToken 
                  ? 'Ungültiger Link'
                  : 'Neues Passwort erstellen'
              }
            </h1>
            <p className="text-white/60">
              {isSuccess 
                ? 'Sie werden in Kürze zur Anmeldung weitergeleitet...'
                : !isValidToken
                  ? 'Der Link ist abgelaufen oder ungültig. Bitte fordern Sie einen neuen an.'
                  : 'Geben Sie Ihr neues Passwort ein.'
              }
            </p>
          </div>

          {isSuccess ? (
            // Success State
            <div className="space-y-6">
              <div className="bg-[#4ECCA3]/10 border border-[#4ECCA3]/20 rounded-lg p-4">
                <p className="text-sm text-white/80 text-center">
                  Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
                </p>
              </div>

              <Link 
                href="/anmelden"
                className="flex items-center justify-center gap-2 text-[#4ECCA3] hover:text-[#3DB892] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Jetzt anmelden
              </Link>
            </div>
          ) : !isValidToken ? (
            // Invalid Token State
            <div className="space-y-6">
              <Link 
                href="/passwort-vergessen"
                className="flex items-center justify-center gap-2 text-[#4ECCA3] hover:text-[#3DB892] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Neuen Link anfordern
              </Link>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80">
                    Neues Passwort
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mindestens 6 Zeichen"
                      required
                      disabled={isLoading}
                      minLength={6}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#4ECCA3] focus:ring-[#4ECCA3]/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/80">
                    Passwort bestätigen
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Passwort wiederholen"
                    required
                    disabled={isLoading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#4ECCA3] focus:ring-[#4ECCA3]/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4ECCA3] hover:bg-[#3DB892] text-[#0C211E] font-semibold py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  'Passwort zurücksetzen'
                )}
              </Button>

              <div className="text-center">
                <Link 
                  href="/anmelden"
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#4ECCA3] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Zurück zur Anmeldung
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#0C211E] via-[#0C211E] to-[#154F44] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-[#4ECCA3]/20 p-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#4ECCA3] animate-spin" />
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
