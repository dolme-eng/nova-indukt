import type { Metadata } from 'next'
import { Wrench } from 'lucide-react'
import { COMPANY } from '@/lib/constants/company'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Wartungsarbeiten',
  description: 'NOVA INDUKT ist gerade in Wartung. Wir kommen schnellstmöglich zurück.',
  robots: { index: false, follow: false },
}

export default function WartungPage() {
  return (
    <div className="min-h-screen bg-[#0C211E] flex items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-8">
        <div className="w-20 h-20 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center mx-auto border border-[#4ECCA3]/20">
          <Wrench className="w-9 h-9 text-[#4ECCA3] animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">
            Wartungsarbeiten
          </h1>
          <p className="text-[#9FE1CD] text-lg">
            Wir verbessern gerade etwas für Sie. Die Seite ist in Kürze wieder verfügbar.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-sm text-gray-300">
            Bei dringenden Fragen erreichen Sie uns unter:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`mailto:${COMPANY.email.support}`}
              className="px-6 py-3 bg-[#4ECCA3] text-[#0C211E] rounded-xl font-bold text-sm hover:bg-[#3BA88A] transition-colors"
            >
              {COMPANY.email.support}
            </a>
            <a
              href={`tel:${COMPANY.phone.number.replace(/\s/g, '')}`}
              className="px-6 py-3 bg-white/10 text-white border border-white/10 rounded-xl font-bold text-sm hover:bg-white/15 transition-colors"
            >
              {COMPANY.phone.number}
            </a>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          {COMPANY.name} &mdash; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
