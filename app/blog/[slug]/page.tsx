import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/navigation'
import { blogPosts } from '@/lib/data/products'
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'

// Sanitize HTML content to prevent XSS attacks
function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\*/g, '') // Remove asterisks used for bold markdown
    .replace(/&lt;strong&gt;/g, '<strong>') // Restore allowed tags
    .replace(/&lt;\/strong&gt;/g, '</strong>')
}

// Generate static params for all blog posts
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const post = blogPosts.find(p => p.slug === resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Artikel nicht gefunden | NOVA INDUKT',
    }
  }

  const title = post.title.de
  const description = post.excerpt.de

  return {
    title: `${title} | Blog | NOVA INDUKT`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: post.image }],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

// Blog content with rich text for each post
const blogContent: Record<string, Record<'de', string[]>> = {
  'pfanne-kaufratgeber': {
    de: [
      'Die Wahl der richtigen Pfanne für Ihr Induktionskochfeld ist entscheidend für ein optimales Kocherlebnis. In diesem Ratgeber zeigen wir Ihnen, worauf Sie beim Kauf unbedingt achten sollten.',
      '## Materialien: Was ist das Beste für Induktion?',
      'Nicht jedes Material eignet sich gleich gut für Induktionsherde. Die besten Optionen sind:',
      '- **Edelstahl mit Magnetboden**: Die klassische Wahl - langlebig, unempfindlich und perfekt für Induktion geeignet.',
      '- **Gusseisen**: Hervorragende Wärmespeicherung, ideal für Braten und Schmoren. Achten Sie auf eine glatte Unterseite.',
      '- **Mehrschicht-Material**: Kombinationen aus Aluminiumkern mit Edelstahl bieten optimale Wärmeverteilung.',
      '- **Emaille**: Leicht zu reinigen und pflegeleicht, aber weniger robust als reines Metall.',
      '## Bodenaufbau: Das Herzstück',
      'Der Boden ist bei Induktionspfannen besonders wichtig. Ein mehrschichtiger Aufbau sorgt für:',
      '- Gleichmäßige Wärmeverteilung über die gesamte Fläche',
      '- Keine heißen Stellen, die das Essen verbrennen',
      '- Energieeffizienz durch optimale Magnetfeld-Übertragung',
      '- Längere Haltbarkeit und Formbeständigkeit',
      '## Größe und Form: Praktische Tipps',
      'Die ideale Pfanne hängt von Ihren Kochgewohnheiten ab:',
      '- **20-24 cm**: Perfekt für Eier, Pfannkuchen und kleine Portionen',
      '- **28 cm**: Die Universalgröße für die meisten Gerichte',
      '- **30+ cm**: Ideal für Familien und größere Mengen',
      '## Pflege und Langlebigkeit',
      'Mit der richtigen Pflege halten Ihre Pfannen Jahrzehnte:',
      '- Nie mit scharfen Metallgegenständen kratzen',
      '- Nach dem Waschen gründlich trocknen',
      '- Bei Gusseisen regelmäßig einölen',
      '- Extreme Temperaturschocks vermeiden',
      '## Fazit',
      'Die Investition in eine hochwertige Induktionspfanne lohnt sich. Achten Sie auf einen massiven, flachen Boden mit guter Magnetisierung und wählen Sie die Größe passend zu Ihren Bedürfnissen.'
    ]
  },
  'induktion-vs-gas': {
    de: [
      'Die Wahl zwischen Induktion und Gas ist eine der wichtigsten Entscheidungen bei der Küchenplanung. Wir haben beide Technologien unter die Lupe genommen.',
      '## Energieeffizienz im Vergleich',
      'Induktion liegt hier klar vorn:',
      '- **Induktion**: ca. 90% Effizienz - fast die gesamte Energie geht direkt in den Topf',
      '- **Gas**: nur ca. 40-50% Effizienz - viel Wärme geht an die Umgebung verloren',
      'Das bedeutet: Bei gleicher Kochleistung verbraucht Induktion deutlich weniger Energie.',
      '## Kochgeschwindigkeit',
      'Ein praktischer Test zeigt die Unterschiede:',
      '- 2 Liter Wasser kochen auf Induktion: ca. 4-5 Minuten',
      '- 2 Liter Wasser kochen auf Gas: ca. 8-10 Minuten',
      'Die höhere Leistungsdichte der Induktion macht den Unterschied.',
      '## Sicherheit',
      'Hier hat Induktion eindeutige Vorteile:',
      '- Keine offene Flamme - kein Brandrisiko',
      '- Das Kochfeld selbst wird nur indirekt warm',
      '- Automatische Abschaltung bei leerem Topf',
      '- Keine Gefahr durch Gaslecks',
      '## Kosten im Vergleich',
      'Die laufenden Kosten unterscheiden sich erheblich:',
      '| Kostenfaktor | Induktion | Gas |',
      '|-------------|-----------|-----|',
      '| Anschaffung | Höher | Niedriger |',
      '| Strom/Gas pro Jahr | 150-200 € | 200-300 € |',
      '| Wartung | Minimal | Regelmäßig nötig |',
      '| Lebensdauer | 15-20 Jahre | 10-15 Jahre |',
      '## Umweltauswirkungen',
      'Induktion gewinnt auch ökologisch:',
      '- Keine direkten CO₂-Emissionen am Kochort',
      '- Höhere Effizienz = weniger Energieverbrauch',
      '- Keine Abhängigkeit von fossilen Brennstoffen',
      '- Möglichkeit zur Nutzung von Ökostrom',
      '## Fazit',
      'Für die moderne, effiziente Küche ist Induktion die kluge Wahl. Sie ist schneller, sicherer, effizienter und umweltfreundlicher als Gas. Die höheren Anschaffungskosten amortisieren sich durch die Energieeinsparung.'
    ]
  },
  'kochfeld-pflege': {
    de: [
      'Ein sauberes Induktionskochfeld ist nicht nur optisch ansprechender, sondern auch effizienter und sicherer. Wir zeigen Ihnen, wie Sie Ihr Kochfeld wie neu halten.',
      '## Die tägliche Reinigung',
      'Nach jedem Kochen sollten Sie:',
      '- Das Kochfeld abkühlen lassen (nie auf heißer Fläche wischen!)',
      '- Mit einem feuchten Mikrofasertuch abwischen',
      '- Flecken sofort entfernen, bevor sie einbrennen',
      '- Die Oberfläche mit einem trockenen Tuch polieren',
      '## Gründliche Reinigung wöchentlich',
      'Einmal pro Woche lohnt sich die intensive Pflege:',
      '### 1. Spezialreiniger verwenden',
      'Induktionsreiniger entfernen Fettablagerungen und Streifen. Auftragen, einwirken lassen, abwischen.',
      '### 2. Kalkflecken entfernen',
      'Mit etwas Essigwasser lassen sich Kalkrückstände vom Wasser effektiv lösen.',
      '### 3. Die Sensoren reinigen',
      'Vorsichtig mit einem weichen Pinsel die Touch-Bereiche säubern.',
      '## Was Sie niemals tun sollten',
      'Diese Fehler können Ihr Kochfeld beschädigen:',
      '❌ **Scharfe Reiniger oder Scheuermittel** - Kratzen die Oberfläche',
      '❌ **Glaskeramikreiniger auf Kunststoff** - Verfärbt die Umrandung',
      '❌ **Wasser direkt auf die Elektronik** - Kurzschlussgefahr',
      '❌ **Metallschwämme oder Stahlwolle** - Zerkratzen alles',
      '❌ **Druck beim Wischen** - Die Oberfläche ist empfindlich',
      '## Hartnäckige Flecken?',
      'So bekommen Sie auch eingebranntes los:',
      '1. **Kochfeld-Schaber**: Spezielle Glaskeramik-Schaber entfernen angebranntes Fett',
      '2. **Einweichen**: Ein feuchtes Tuch 10 Minuten auflegen lockert Verschmutzungen',
      '3. **Spezialpaste**: Reinigungspasten wirken wie eine Politur',
      '## Langzeitschutz',
      'Mit diesen Tipps bleibt Ihr Kochfeld jahrelang schön:',
      '- Immer passende Töpfe verwenden (flacher Boden)',
      '- Keine verschütteten Zuckermassen abkühlen lassen',
      '- Regelmäßig die Lüftungsschlitze säubern',
      '- Schutzauflagen für empfindliche Bereiche nutzen',
      '## Fazit',
      'Die richtige Pflege ist einfach: Regelmäßiges Wischen mit dem richtigen Tuch, sofortige Fleckenentfernung und vereinzelte gründliche Reinigung. So bleibt Ihr Induktionskochfeld jahrelang wie neu!'
    ]
  }
}

function renderContent(content: string[]): JSX.Element {
  return (
    <>
      {content.map((paragraph, index) => {
        // Headers
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{paragraph.replace('## ', '')}</h2>
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>
        }
        
        // Lists
        if (paragraph.startsWith('- ')) {
          return (
            <ul key={index} className="list-disc list-inside ml-4 space-y-2 text-gray-700 mb-4">
              <li dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(paragraph.replace('- ', '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'))
              }} />
            </ul>
          )
        }
        if (paragraph.startsWith('❌')) {
          return (
            <div key={index} className="flex items-start gap-3 text-gray-700 mb-2">
              <span className="text-red-500 text-xl">❌</span>
              <span dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(paragraph.replace('❌ ', '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'))
              }} />
            </div>
          )
        }
        if (paragraph.match(/^\d+\. /)) {
          const num = paragraph.match(/^\d+/)?.[0]
          const text = paragraph.replace(/^\d+\. /, '')
          return (
            <div key={index} className="flex items-start gap-3 text-gray-700 mb-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#4ECCA3] text-white rounded-full flex items-center justify-center text-sm font-bold">{num}</span>
              <span dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'))
              }} />
            </div>
          )
        }
        
        // Table
        if (paragraph.startsWith('|')) {
          const rows = paragraph.split('\n').filter(row => row.trim().startsWith('|'))
          return (
            <div key={index} className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse">
                <tbody>
                  {rows.map((row, rowIndex) => {
                    const cells = row.split('|').filter(cell => cell.trim())
                    if (rowIndex === 0) {
                      return (
                        <tr key={rowIndex} className="bg-[#4ECCA3] text-white">
                          {cells.map((cell, cellIndex) => (
                            <th key={cellIndex} className="px-4 py-3 text-left font-semibold">{cell.trim()}</th>
                          ))}
                        </tr>
                      )
                    }
                    if (rowIndex === 1 && cells[0].includes('-')) return null // Skip separator row
                    return (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        {cells.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-gray-700">{cell.trim()}</td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        }
        
        // Regular paragraph
        return (
          <p 
            key={index} 
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeHtml(paragraph.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'))
            }}
          />
        )
      })}
    </>
  )
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  const post = blogPosts.find(p => p.slug === resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  const title = post.title.de
  const excerpt = post.excerpt.de
  const content = blogContent[post.slug]?.de || []

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2)

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#4ECCA3] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Blog
            </Link>
            
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 bg-[#4ECCA3] text-white text-sm font-bold rounded-full mb-3 inline-block">
                  {post.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
              <span className="text-sm text-gray-500">Teilen:</span>
              <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            {content.length > 0 ? (
              <div className="prose prose-lg max-w-none">
                {renderContent(content)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Vollständiger Artikel in Kürze verfügbar...</p>
              </div>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Verwandte Artikel
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title.de}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-[#4ECCA3] font-medium">{relatedPost.category}</span>
                      <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#4ECCA3] transition-colors">
                        {relatedPost.title.de}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
