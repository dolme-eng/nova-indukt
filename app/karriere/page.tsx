import { Metadata } from 'next'
import { COMPANY } from '@/lib/constants/company'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Karriere bei NOVA INDUKT',
  description:
    'Werden Sie Teil des NOVA INDUKT Teams. Entdecken Sie aktuelle Stellenangebote in der Premium-Küchenzubehör Branche.',
  alternates: {
    canonical: '/karriere',
  },
}

export default function KarrierePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 font-heading text-4xl font-bold text-[#0C211E] sm:text-5xl">
            Karriere bei NOVA INDUKT
          </h1>
          <p className="mb-12 text-lg text-gray-600">
            Werden Sie Teil unseres Teams und gestalten Sie die Zukunft der Premium-Küchenzubehör
            Branche mit.
          </p>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12">
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#4ECCA3]/10">
                <svg
                  className="h-10 w-10 text-[#4ECCA3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-[#0C211E]">
                Aktuell keine offenen Stellen
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-gray-600">
                Im Moment haben wir keine offenen Positionen. Schauen Sie später wieder vorbei oder
                senden Sie uns gerne eine Initiativbewerbung.
              </p>
              <a
                href={`mailto:${COMPANY.email.kontakt}?subject=Initiativbewerbung`}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0C211E] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#17423C]"
              >
                Initiativbewerbung senden
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>

            <div className="mt-12 border-t border-gray-100 pt-12">
              <h3 className="mb-6 text-xl font-bold text-[#0C211E]">Warum NOVA INDUKT?</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    title: 'Innovative Produkte',
                    desc: 'Arbeiten Sie mit modernstem Küchenzubehör',
                  },
                  {
                    title: 'Wachstumschancen',
                    desc: 'Entwickeln Sie sich mit unserem expandierenden Unternehmen',
                  },
                  {
                    title: 'Tolles Team',
                    desc: 'Werden Sie Teil einer leidenschaftlichen Community',
                  },
                  { title: 'Attraktive Benefits', desc: 'Mitarbeiterrabatte und weitere Vorteile' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#4ECCA3]/10">
                      <svg
                        className="h-5 w-5 text-[#4ECCA3]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
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
    </div>
  )
}
