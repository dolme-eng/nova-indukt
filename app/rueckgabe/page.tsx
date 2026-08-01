import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, CheckCircle, Clock, Mail } from 'lucide-react'
import { getStaticPageContent } from '@/lib/content/static'
import { COMPANY } from '@/lib/constants/company'

export const metadata: Metadata = {
  title: 'Rückgabe & Widerruf',
  description:
    'Informationen zur Rückgabe und zum Widerrufsrecht bei NOVA INDUKT. 30 Tage Rückgaberecht für alle Produkte.',
  keywords: ['Rückgabe', 'Widerruf', 'Rückgaberecht', 'NOVA INDUKT', 'Retoure'],
  alternates: {
    canonical: '/rueckgabe',
  },
}

export const revalidate = 3600

export default async function RueckgabePage() {
  const db = await getStaticPageContent('rueckgabe')
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
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Rückgabe & Widerruf</h1>

        <div className="space-y-8">
          {/* 30 Tage Rückgabe */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#0C211E]">30 Tage Rückgaberecht</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ECCA3]" />
                <p>
                  Sie haben das Recht, binnen <strong>30 Tagen</strong> ohne Angabe von Gründen
                  diesen Vertrag zu widerrufen.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ECCA3]" />
                <p>
                  Die Widerrufsfrist beträgt 30 Tage ab dem Tag, an dem Sie oder ein von Ihnen
                  benannter Dritter die Waren in Besitz genommen haben.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ECCA3]" />
                <p>
                  Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen
                  Erklärung über Ihren Entschluss informieren.
                </p>
              </div>
            </div>
          </div>

          {/* So geht's */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#0C211E]">So funktioniert die Rückgabe</h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'Kontaktieren Sie uns',
                  desc: 'Senden Sie uns eine E-Mail an widerruf@nova-indukt.de oder kontaktieren Sie unseren Kundenservice.',
                },
                {
                  step: '2',
                  title: 'Ware zurücksenden',
                  desc: 'Senden Sie die Ware an die unten angegebene Adresse zurück. Bitte vermerken Sie Ihre Bestellnummer.',
                },
                {
                  step: '3',
                  title: 'Rückerstattung',
                  desc: 'Nach Eingang und Prüfung der Ware erstatten wir Ihnen den Kaufpreis auf dem ursprünglichen Zahlungsweg.',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0C211E]">
                    <span className="text-sm font-bold text-white">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adresse */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#0C211E]">Rücksendeadresse</h2>
            <div className="rounded-xl bg-gray-50 p-6 text-sm">
              <p className="font-bold text-gray-900">{COMPANY.name}</p>
              <p className="text-gray-700">– Retouren –</p>
              <p className="text-gray-700">{COMPANY.logistics.street}</p>
              <p className="text-gray-700">
                {COMPANY.logistics.zip} {COMPANY.logistics.city}
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>• Bitte beilegen Sie eine Kopie der Rechnung oder Lieferschein</p>
              <p>• Verwenden Sie wenn möglich die Originalverpackung</p>
              <p>• Senden Sie die Ware ausreichend frankiert</p>
            </div>
          </div>

          {/* Kontakt */}
          <div className="rounded-2xl border-l-4 border-[#4ECCA3] bg-[#4ECCA3]/10 p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Fragen zur Rückgabe?</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                E-Mail:{' '}
                <a
                  href={`mailto:${COMPANY.email.widerruf}`}
                  className="font-semibold text-[#4ECCA3] hover:underline"
                >
                  {COMPANY.email.widerruf}
                </a>
              </p>
              <p>
                Kontaktformular:{' '}
                <Link href="/kontakt" className="font-semibold text-[#4ECCA3] hover:underline">
                  Zum Kontaktformular
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
