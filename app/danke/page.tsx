'use client'

import Link from 'next/link'
import { CheckCircle, ShoppingBag, Mail } from 'lucide-react'
import { useAuth } from '@/lib/store/auth'

export default function ThankYouPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#4ECCA3]/10">
          <CheckCircle className="h-8 w-8 text-[#4ECCA3]" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Vielen Dank!</h1>

        <p className="mb-6 text-gray-600">
          Ihre Bestellung wurde erfolgreich aufgegeben. Sie erhalten in Kürze eine Bestätigung per
          E-Mail.
        </p>

        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
          <div className="mb-2 flex items-center gap-3 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>Bestätigung gesendet an Ihre E-Mail-Adresse</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <ShoppingBag className="h-4 w-4" />
            <span>Lieferzeit: 2-3 Werktage</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/produkte"
            className="block w-full rounded-xl bg-[#4ECCA3] py-3 font-semibold text-white transition-colors hover:bg-[#3db892]"
          >
            Weiter einkaufen
          </Link>

          {isAuthenticated ? (
            <Link
              href="/mein-konto"
              className="block w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Zu meinem Konto
            </Link>
          ) : (
            <Link
              href="/bestellung-verfolgen"
              className="block w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Bestellung verfolgen
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
