import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Zahlungsinformationen | NOVA INDUKT',
  description: 'Zahlungsinformationen und Bankverbindung für Ihre Bestellung bei NOVA INDUKT',
  alternates: {
    canonical: '/informationen-zur-zahlung',
  },
}

export default function ZahlungsinformationenPage() {
  redirect('/informations-de-paiement')
}
