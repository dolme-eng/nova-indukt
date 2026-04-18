'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success('E-Mail zum Zurücksetzen des Passworts wurde gesendet')
      } else {
        toast.error(data.error || 'Ein Fehler ist aufgetreten')
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
              ) : (
                <Mail className="w-8 h-8 text-[#4ECCA3]" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSuccess ? 'E-Mail gesendet' : 'Passwort vergessen?'}
            </h1>
            <p className="text-white/60">
              {isSuccess 
                ? 'Überprüfen Sie Ihren Posteingang für weitere Anweisungen.'
                : 'Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen.'
              }
            </p>
          </div>

          {isSuccess ? (
            // Success State
            <div className="space-y-6">
              <div className="bg-[#4ECCA3]/10 border border-[#4ECCA3]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#4ECCA3] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/80">
                    Wenn ein Konto mit der E-Mail <strong className="text-white">{email}</strong> existiert, 
                    wurde eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts gesendet. 
                    Der Link ist 1 Stunde gültig.
                  </p>
                </div>
              </div>

              <Link 
                href="/anmelden"
                className="flex items-center justify-center gap-2 text-[#4ECCA3] hover:text-[#3DB892] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück zur Anmeldung
              </Link>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">
                  E-Mail-Adresse
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                  required
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#4ECCA3] focus:ring-[#4ECCA3]/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4ECCA3] hover:bg-[#3DB892] text-[#0C211E] font-semibold py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  'Zurücksetzen anfordern'
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
