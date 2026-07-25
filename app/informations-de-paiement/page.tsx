import type { Metadata } from 'next'
import { getBankDetails } from '@/lib/data/bank-details'
import { COMPANY } from '@/lib/constants/company'

export const metadata: Metadata = {
  title: 'Zahlungsinformationen',
  description: 'Zahlungsinformationen und Bankverbindung für Ihre Bestellung bei NOVA INDUKT',
  alternates: {
    canonical: '/informationen-zur-zahlung',
  },
}

export default async function PaymentInfoPage() {
  const bank = await getBankDetails()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Zahlungsinformationen</h1>

        <div className="space-y-8">
          {/* Main payment info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#8B0000] mb-4">Zahlung per Banküberweisung</h2>
            <p className="text-gray-600 mb-6">
              Begleichen Sie Ihre Bestellung per Banküberweisung. Um die Bearbeitung Ihrer Bestellung zu beschleunigen,
              <strong> akzeptieren wir ausschließlich Sofortüberweisungen</strong>.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Zahlungsdaten</h3>
            <p className="text-gray-600 mb-6">
              Bitte überweisen Sie den Betrag auf unser Bankkonto.
            </p>

            {/* Bank details card */}
            <div className="bg-[#4ECCA3]/5 border-l-4 border-[#4ECCA3] rounded-xl p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">Bankverbindung</h4>
              <div className="space-y-3 text-sm">
                {bank.bankName && (
                  <p><span className="font-semibold">Bank:</span> {bank.bankName}</p>
                )}
                <p><span className="font-semibold">IBAN:</span> <span className="font-mono">{bank.iban}</span></p>
                <p><span className="font-semibold">BIC:</span> <span className="font-mono">{bank.bic}</span></p>
                <p><span className="font-semibold">Kontoinhaber:</span> {bank.holder}</p>
                <p><span className="font-semibold">Verwendungszweck:</span> Ihr Name + Bestellnummer</p>
                <p><span className="font-semibold">Überweisungsart:</span> <span className="text-[#8B0000] font-bold">SOFORTÜBERWEISUNG</span></p>
              </div>
            </div>

            {/* Important notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Wichtig &mdash; Überprüfung des Kontoinhabers</h4>
              <p className="text-sm text-gray-700 mb-3">
                Aufgrund der Regelungen für Sofortüberweisungen kann Ihre Bank bei der Transaktionsbestätigung folgende Meldung anzeigen:
              </p>
              <blockquote className="bg-white rounded-lg p-4 text-sm italic text-gray-600 border border-gray-200 mb-3">
                &laquo; Der mit dieser IBAN verknüpfte Name des Kontoinhabers konnte nicht überprüft werden.
                Wenn Sie die Überweisung bestätigen, könnte sie auf das Konto eines anderen Begünstigten eingehen. &raquo;
              </blockquote>
              <p className="text-sm text-gray-700">
                Das bedeutet nicht zwingend, dass ein Fehler vorliegt. Sofortüberweisungen erfolgen sehr schnell
                und nicht alle Banken prüfen automatisch den Namen des Kontoinhabers.
                <strong> Für eine optimale Bearbeitung</strong> geben Sie bitte den Namen des Kontoinhabers und die
                Zahlungsreferenz genau wie oben angegeben an.
              </p>
            </div>

            {/* How to confirm */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">So bestätigen Sie Ihre Zahlung</h3>
            <p className="text-gray-600 mb-4">
              Nach der Überweisung senden Sie uns bitte einen Zahlungsnachweis (Screenshot oder Foto)
              über eine der folgenden Möglichkeiten:
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-600 mb-6 space-y-2">
              <li>E-Mail: <a href={`mailto:${COMPANY.email.support}`} className="text-[#4ECCA3] hover:underline">{COMPANY.email.support}</a></li>
              <li>Telefon: <a href={`tel:${COMPANY.phone.number.replace(/\s/g, '')}`} className="text-[#4ECCA3] hover:underline">{COMPANY.phone.number}</a></li>
            </ul>
            <p className="text-gray-600">
              Wir bearbeiten Ihre Bestellung nach Eingang und Prüfung des Zahlungsnachweises.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-[#4ECCA3]/10 rounded-2xl p-8 border-l-4 border-[#4ECCA3]">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontakt & Support</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>{COMPANY.name}</strong></p>
              <p>E-Mail: <a href={`mailto:${COMPANY.email.support}`} className="text-[#4ECCA3] hover:underline">{COMPANY.email.support}</a></p>
              <p>Telefon: <a href={`tel:${COMPANY.phone.number.replace(/\s/g, '')}`} className="text-[#4ECCA3] hover:underline">{COMPANY.phone.number}</a></p>
            </div>
          </div>

          {/* Legal notices */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hinweise</h2>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Wir empfehlen die Sofortüberweisung zur Beschleunigung der Bearbeitung Ihrer Bestellung.</li>
              <li>Falls Ihre Bank einen Hinweis zur Überprüfung des Kontoinhabers anzeigt, können Sie Ihren Bankberater zur Bestätigung kontaktieren.</li>
              <li>Bei einer fehlerhaften Überweisung oder Überweisung mit falschen Angaben kontaktieren Sie bitte umgehend unseren Kundendienst.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
