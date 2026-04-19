import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum | NOVA INDUKT',
  description: 'Impressum und gesetzliche Anbieterkennzeichnung von NOVA INDUKT GmbH',
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          {/* Angaben gemäß § 5 TMG */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">NOVA INDUKT GmbH</p>
              <p>Industriestraße 42</p>
              <p>80339 München</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Vertreten durch */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vertreten durch</h2>
            <p className="text-gray-700">Geschäftsführer: Max Mustermann</p>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontakt</h2>
            <div className="space-y-2 text-gray-700">
              <p>Telefon: +49 89 12345678</p>
              <p>E-Mail: info@nova-indukt.de</p>
            </div>
          </section>

          {/* Registereintrag */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Registereintrag</h2>
            <div className="space-y-2 text-gray-700">
              <p>Registergericht: Amtsgericht München</p>
              <p>Registernummer: HRB 284756</p>
              <p>USt-IdNr.: DE312456789</p>
            </div>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <div className="space-y-2 text-gray-700">
              <p>Max Mustermann</p>
              <p>NOVA INDUKT GmbH</p>
              <p>Industriestraße 42</p>
              <p>80339 München</p>
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
