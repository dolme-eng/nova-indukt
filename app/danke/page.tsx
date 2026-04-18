import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vielen Dank für Ihre Bestellung | NOVA INDUKT',
  description: 'Ihre Bestellung wurde erfolgreich aufgegeben. Sie erhalten eine Bestätigung per E-Mail.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-[#4ECCA3]" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Vielen Dank!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Ihre Bestellung wurde erfolgreich aufgegeben. Sie erhalten in Kürze eine Bestätigung per E-Mail.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <Mail className="w-4 h-4" />
            <span>Bestätigung gesendet an Ihre E-Mail-Adresse</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <ShoppingBag className="w-4 h-4" />
            <span>Lieferzeit: 2-3 Werktage</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/produkte"
            className="block w-full bg-[#4ECCA3] text-white font-semibold py-3 rounded-xl hover:bg-[#3db892] transition-colors"
          >
            Weiter einkaufen
          </Link>
          
          <Link
            href="/mein-konto"
            className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Zu meinem Konto
          </Link>
        </div>
      </div>
    </div>
  )
}
