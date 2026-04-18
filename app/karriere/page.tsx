import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karriere bei NOVA INDUKT',
  description: 'Werden Sie Teil des NOVA INDUKT Teams. Entdecken Sie aktuelle Stellenangebote in der Premium-Küchenzubehör Branche.',
}

export default function KarrierePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0C211E] mb-6 font-heading">
            Karriere bei NOVA INDUKT
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Werden Sie Teil unseres Teams und gestalten Sie die Zukunft der Premium-Küchenzubehör Branche mit.
          </p>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#4ECCA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#0C211E] mb-4">
                Aktuell keine offenen Stellen
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Im Moment haben wir keine offenen Positionen. Schauen Sie später wieder vorbei oder senden Sie uns gerne eine Initiativbewerbung.
              </p>
              <a 
                href="mailto:kontakt@nova-indukt.de?subject=Initiativbewerbung" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0C211E] text-white font-semibold rounded-2xl hover:bg-[#17423C] transition-colors"
              >
                Initiativbewerbung senden
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div className="border-t border-gray-100 pt-12 mt-12">
              <h3 className="text-xl font-bold text-[#0C211E] mb-6">Warum NOVA INDUKT?</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: 'Innovative Produkte', desc: 'Arbeiten Sie mit cutting-edge Küchenzubehör' },
                  { title: 'Wachstumschancen', desc: 'Entwickeln Sie sich mit unserem expandierenden Unternehmen' },
                  { title: 'Tolles Team', desc: 'Werden Sie Teil einer leidenschaftlichen Community' },
                  { title: 'Attraktive Benefits', desc: 'Mitarbeiterrabatte und weitere Vorteile' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#4ECCA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#4ECCA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0C211E]">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
