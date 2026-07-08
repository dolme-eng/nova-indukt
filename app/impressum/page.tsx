import type { Metadata } from 'next'
import { getStaticPageContent } from '@/lib/content/static'
import { COMPANY } from '@/lib/constants/company'

export const metadata: Metadata = {
  title: 'Impressum | NOVA INDUKT',
  description: 'Impressum und gesetzliche Anbieterkennzeichnung von NOVA INDUKT GmbH',
}

export default async function ImpressumPage() {
  const db = await getStaticPageContent('impressum')
  if (db) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{db.title}</h1>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{db.content}</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          {/* Angaben gemäß § 5 TMG */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{COMPANY.name}</p>
              <p>{COMPANY.street}</p>
              <p>{COMPANY.zip} {COMPANY.city}</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Vertreten durch */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vertreten durch</h2>
            <p className="text-gray-700">Geschäftsführer: {COMPANY.geschaeftsfuehrer}</p>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontakt</h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                WhatsApp-Kundenservice: 
                <a 
                  href={COMPANY.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-bold"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Service kontaktieren
                </a>
              </p>
              <p>E-Mail: {COMPANY.email.info}</p>
            </div>
          </section>

          {/* Registereintrag */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Registereintrag</h2>
            <div className="space-y-2 text-gray-700">
              <p>Registergericht: {COMPANY.registergericht}</p>
              <p>Registernummer: {COMPANY.registernummer}</p>
              <p>USt-IdNr.: {COMPANY.ustIdNr}</p>
            </div>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <div className="space-y-2 text-gray-700">
              <p>{COMPANY.geschaeftsfuehrer}</p>
              <p>{COMPANY.name}</p>
              <p>{COMPANY.street}</p>
              <p>{COMPANY.zip} {COMPANY.city}</p>
            </div>
          </section>

          {/* EU-Streitschlichtung */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">EU-Streitschlichtung</h2>
            <p className="text-gray-700 mb-4">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            </p>
            <a 
              href="https://ec.europa.eu/consumers/odr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4ECCA3] hover:underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            <p className="text-gray-700 mt-4">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          {/* Verbraucherstreitbeilegung */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p className="text-gray-700">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Haftung für Inhalte</h2>
            <p className="text-gray-700">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Haftung für Links</h2>
            <p className="text-gray-700">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
              Seiten verantwortlich.
            </p>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Urheberrecht</h2>
            <p className="text-gray-700">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
