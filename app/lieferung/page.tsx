import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, CheckCircle, Clock, Euro } from 'lucide-react'
import { getStaticPageContent } from '@/lib/content/static'
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants/shop'
import { formatPriceDe } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Lieferung & Versand',
  description:
    'Informationen zur Lieferung und zum Versand von NOVA INDUKT Produkten. Schneller Versand innerhalb Deutschlands.',
  keywords: ['Lieferung', 'Versand', 'Lieferzeit', 'NOVA INDUKT', 'Versandkosten'],
  alternates: {
    canonical: '/lieferung',
  },
}

export const revalidate = 3600

export default async function LieferungPage() {
  const db = await getStaticPageContent('lieferung')
  if (db) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">{db.title}</h1>
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {db.content}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Lieferung & Versand</h1>

        <div className="space-y-8">
          {/* Shipping overview */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#0C211E]">Versandkosten</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#4ECCA3]/10">
                  <Truck className="h-6 w-6 text-[#4ECCA3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Deutschland</h3>
                  <p className="text-sm text-gray-600">
                    {formatPriceDe(SHIPPING_COST)} Versandpauschale
                  </p>
                  <p className="text-sm font-semibold text-[#4ECCA3]">
                    Versandfrei ab {formatPriceDe(FREE_SHIPPING_THRESHOLD)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#4ECCA3]/10">
                  <Truck className="h-6 w-6 text-[#4ECCA3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">EU-Länder</h3>
                  <p className="text-sm text-gray-600">14,90 € Versandpauschale</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery times */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#0C211E]">Lieferzeiten</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#4ECCA3]/10">
                  <Clock className="h-6 w-6 text-[#4ECCA3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Deutschland</h3>
                  <p className="text-sm text-gray-600">2–3 Werktage nach Zahlungseingang</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#4ECCA3]/10">
                  <Clock className="h-6 w-6 text-[#4ECCA3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">EU-Länder</h3>
                  <p className="text-sm text-gray-600">5–10 Werktage nach Zahlungseingang</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#0C211E]">Zahlung & Versand</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ECCA3]" />
                <p>Die Lieferung erfolgt erst nach Eingang der Zahlung auf unserem Bankkonto.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ECCA3]" />
                <p>Sie erhalten eine E-Mail mit den Zahlungsinformationen nach der Bestellung.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ECCA3]" />
                <p>Das Lieferrisiko trägt NOVA INDUKT GmbH.</p>
              </div>
            </div>
          </div>

          {/* Shipping partners */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#0C211E]">Versandpartner</h2>
            <p className="mb-4 text-sm text-gray-600">
              Wir versenden Ihre Bestellung zuverlässig mit folgenden Partnern:
            </p>
            <div className="flex flex-wrap gap-3">
              {['DHL', 'DPD', 'UPS', 'GLS', 'Hermes'].map((partner) => (
                <span
                  key={partner}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border-l-4 border-[#4ECCA3] bg-[#4ECCA3]/10 p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Fragen zum Versand?</h2>
            <p className="text-gray-700">
              Kontaktieren Sie uns über unser{' '}
              <Link href="/kontakt" className="font-semibold text-[#4ECCA3] hover:underline">
                Kontaktformular
              </Link>{' '}
              oder per WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
