import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Zahlungsinformationen',
  description: 'Zahlungsinformationen und Bankverbindung für Ihre Bestellung bei NOVA INDUKT',
  robots: { index: false },
}

export default function ZahlungsinformationenRedirect() {
  redirect('/informationen-zur-zahlung')
}
