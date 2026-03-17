import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/navigation'
import { blogPosts } from '@/lib/data/products'
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

// Generate static params for all blog posts
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  
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
    ],
    en: [
      'Choosing the right pan for your induction cooktop is crucial for an optimal cooking experience. In this guide, we show you what to look for when buying.',
      '## Materials: What\'s Best for Induction?',
      'Not every material is equally suitable for induction hobs. The best options are:',
      '- **Stainless steel with magnetic base**: The classic choice - durable, robust and perfect for induction.',
      '- **Cast iron**: Excellent heat retention, ideal for frying and braising. Ensure a smooth bottom surface.',
      '- **Multi-layer materials**: Combinations of aluminum core with stainless steel offer optimal heat distribution.',
      '- **Enamel**: Easy to clean and maintain, but less robust than pure metal.',
      '## Bottom Construction: The Heart of the Matter',
      'The base is particularly important for induction pans. A multi-layer construction ensures:',
      '- Even heat distribution across the entire surface',
      '- No hot spots that burn food',
      '- Energy efficiency through optimal magnetic field transfer',
      '- Longer durability and shape retention',
      '## Size and Shape: Practical Tips',
      'The ideal pan depends on your cooking habits:',
      '- **20-24 cm**: Perfect for eggs, pancakes and small portions',
      '- **28 cm**: The universal size for most dishes',
      '- **30+ cm**: Ideal for families and larger quantities',
      '## Care and Longevity',
      'With proper care, your pans will last for decades:',
      '- Never scratch with sharp metal objects',
      '- Dry thoroughly after washing',
      '- Oil cast iron regularly',
      '- Avoid extreme temperature shocks',
      '## Conclusion',
      'Investing in a high-quality induction pan is worth it. Look for a solid, flat base with good magnetization and choose the size according to your needs.'
    ],
    fr: [
      'Le choix de la bonne poêle pour votre plaque à induction est crucial pour une expérience de cuisson optimale. Dans ce guide, nous vous montrons ce qu\'il faut regarder lors de l\'achat.',
      '## Matériaux : Le meilleur pour l\'induction ?',
      'Tous les matériaux ne conviennent pas également aux plaques à induction. Les meilleures options sont :',
      '- **Inox avec fond magnétique** : Le choix classique - durable, robuste et parfait pour l\'induction.',
      '- **Fonte** : Excellent maintien de la chaleur, idéal pour la friture et le braisage. Assurez-vous d\'une surface lisse en dessous.',
      '- **Matériaux multicouches** : Les combinaisons de noyau en aluminium avec inox offrent une distribution optimale de la chaleur.',
      '- **Émail** : Facile à nettoyer et entretenir, mais moins robuste que le métal pur.',
      '## Structure du fond : Le cœur du sujet',
      'Le fond est particulièrement important pour les poêles à induction. Une construction multicouche assure :',
      '- Une distribution uniforme de la chaleur sur toute la surface',
      '- Pas de points chauds qui brûlent les aliments',
      '- L\'efficacité énergétique grâce à un transfert optimal du champ magnétique',
      '- Une durabilité accrue et une conservation de la forme',
      '## Taille et forme : Conseils pratiques',
      'La poêle idéale dépend de vos habitudes de cuisine :',
      '- **20-24 cm** : Parfait pour les œufs, crêpes et petites portions',
      '- **28 cm** : La taille universelle pour la plupart des plats',
      '- **30+ cm** : Idéal pour les familles et plus grandes quantités',
      '## Entretien et longévité',
      'Avec les bons soins, vos poêles dureront des décennies :',
      '- Ne jamais rayer avec des objets métalliques pointus',
      '- Bien sécher après le lavage',
      '- Huiler régulièrement la fonte',
      '- Éviter les chocs thermiques extrêmes',
      '## Conclusion',
      'Investir dans une poêle à induction de haute qualité en vaut la peine. Recherchez une base solide et plate avec une bonne magnétisation et choisissez la taille selon vos besoins.'
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
    ],
    en: [
      'The choice between induction and gas is one of the most important decisions in kitchen planning. We\'ve taken a close look at both technologies.',
      '## Energy Efficiency Comparison',
      'Induction is clearly ahead here:',
      '- **Induction**: approx. 90% efficiency - almost all energy goes directly into the pot',
      '- **Gas**: only approx. 40-50% efficiency - much heat is lost to the environment',
      'This means: With the same cooking performance, induction consumes significantly less energy.',
      '## Cooking Speed',
      'A practical test shows the differences:',
      '- Boiling 2 liters of water on induction: approx. 4-5 minutes',
      '- Boiling 2 liters of water on gas: approx. 8-10 minutes',
      'The higher power density of induction makes the difference.',
      '## Safety',
      'Induction has clear advantages here:',
      '- No open flame - no fire risk',
      '- The cooktop itself only gets warm indirectly',
      '- Automatic shut-off when the pot is empty',
      '- No danger from gas leaks',
      '## Cost Comparison',
      'Running costs differ considerably:',
      '| Cost Factor | Induction | Gas |',
      '|-------------|-----------|-----|',
      '| Purchase | Higher | Lower |',
      '| Electricity/Gas per year | 150-200 € | 200-300 € |',
      '| Maintenance | Minimal | Regular required |',
      '| Lifespan | 15-20 years | 10-15 years |',
      '## Environmental Impact',
      'Induction also wins ecologically:',
      '- No direct CO₂ emissions at the cooking location',
      '- Higher efficiency = less energy consumption',
      '- No dependence on fossil fuels',
      '- Option to use green electricity',
      '## Conclusion',
      'For the modern, efficient kitchen, induction is the smart choice. It is faster, safer, more efficient and environmentally friendly than gas. The higher purchase costs pay for themselves through energy savings.'
    ],
    fr: [
      'Le choix entre induction et gaz est l\'une des décisions les plus importantes dans la planification de la cuisine. Nous avons examiné de près les deux technologies.',
      '## Comparaison de l\'efficacité énergétique',
      'L\'induction est clairement en tête :',
      '- **Induction** : env. 90% d\'efficacité - presque toute l\'énergie va directement dans la casserole',
      '- **Gaz** : seulement env. 40-50% d\'efficacité - beaucoup de chaleur est perdue dans l\'environnement',
      'Cela signifie : Avec les mêmes performances de cuisson, l\'induction consomme nettement moins d\'énergie.',
      '## Vitesse de cuisson',
      'Un test pratique montre les différences :',
      '- Faire bouillir 2 litres d\'eau à induction : env. 4-5 minutes',
      '- Faire bouillir 2 litres d\'eau au gaz : env. 8-10 minutes',
      'La densité de puissance plus élevée de l\'induction fait la différence.',
      '## Sécurité',
      'L\'induction a des avantages clairs ici :',
      '- Pas de flamme nue - pas de risque d\'incendie',
      '- La plaque elle-même ne chauffe que de manière indirecte',
      '- Arrêt automatique quand la casserole est vide',
      '- Pas de danger de fuite de gaz',
      '## Comparaison des coûts',
      'Les coûts d\'exploitation diffèrent considérablement :',
      '| Facteur de coût | Induction | Gaz |',
      '|-----------------|-----------|-----|',
      '| Achat | Plus élevé | Plus bas |',
      '| Électricité/Gaz par an | 150-200 € | 200-300 € |',
      '| Entretien | Minimal | Régulier requis |',
      '| Durée de vie | 15-20 ans | 10-15 ans |',
      '## Impact environnemental',
      'L\'induction gagne aussi sur le plan écologique :',
      '- Pas d\'émissions directes de CO₂ au lieu de cuisson',
      '- Efficacité plus élevée = moins de consommation d\'énergie',
      '- Pas de dépendance aux combustibles fossiles',
      '- Possibilité d\'utiliser de l\'électricité verte',
      '## Conclusion',
      'Pour la cuisine moderne et efficace, l\'induction est le choix intelligent. Elle est plus rapide, plus sûre, plus efficace et plus respectueuse de l\'environnement que le gaz. Les coûts d\'achat plus élevés s\'amortissent grâce aux économies d\'énergie.'
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
    ],
    en: [
      'A clean induction cooktop is not only more visually appealing, but also more efficient and safer. We show you how to keep your cooktop like new.',
      '## Daily Cleaning',
      'After every cooking session, you should:',
      '- Let the cooktop cool down (never wipe on a hot surface!)',
      '- Wipe with a damp microfiber cloth',
      '- Remove stains immediately before they burn in',
      '- Polish the surface with a dry cloth',
      '## Thorough Weekly Cleaning',
      'Once a week, intensive care is worthwhile:',
      '### 1. Use Special Cleaner',
      'Induction cleaners remove grease deposits and streaks. Apply, let it work, wipe off.',
      '### 2. Remove Limescale Stains',
      'Vinegar water effectively removes limescale residues from water.',
      '### 3. Clean the Sensors',
      'Gently clean the touch areas with a soft brush.',
      '## What You Should Never Do',
      'These mistakes can damage your cooktop:',
      '❌ **Sharp cleaners or abrasive agents** - Scratch the surface',
      '❌ **Glass ceramic cleaner on plastic** - Discolors the frame',
      '❌ **Water directly on the electronics** - Risk of short circuit',
      '❌ **Metal sponges or steel wool** - Scratch everything',
      '❌ **Pressure when wiping** - The surface is sensitive',
      '## Stubborn Stains?',
      'Here\'s how to remove even burnt-on residue:',
      '1. **Cooktop Scraper**: Special glass ceramic scrapers remove burnt-on grease',
      '2. **Soaking**: Place a damp cloth for 10 minutes to loosen dirt',
      '3. **Special Paste**: Cleaning pastes work like a polish',
      '## Long-term Protection',
      'With these tips, your cooktop will stay beautiful for years:',
      '- Always use suitable pots (flat bottom)',
      '- Don\'t let spilled sugar masses cool down',
      '- Regularly clean the ventilation slots',
      '- Use protective covers for sensitive areas',
      '## Conclusion',
      'Proper care is simple: Regular wiping with the right cloth, immediate stain removal, and occasional thorough cleaning. This way, your induction cooktop will stay like new for years!'
    ],
    fr: [
      'Une plaque à induction propre est non seulement plus esthétique, mais aussi plus efficace et plus sûre. Nous vous montrons comment garder votre plaque comme neuve.',
      '## Nettoyage quotidien',
      'Après chaque session de cuisson, vous devriez :',
      '- Laisser la plaque refroidir (ne jamais essuyer sur une surface chaude !)',
      '- Essuyer avec un chiffon microfibre humide',
      '- Retirer les taches immédiatement avant qu\'elles ne brûlent',
      '- Polir la surface avec un chiffon sec',
      '## Nettoyage hebdomadaire en profondeur',
      'Une fois par semaine, les soins intensifs valent la peine :',
      '### 1. Utiliser un nettoyant spécial',
      'Les nettoyants pour induction éliminent les dépôts de graisse et les traînées. Appliquer, laisser agir, essuyer.',
      '### 2. Enlever les taches de calcaire',
      'L\'eau vinaigrée élimine efficacement les résidus de calcaire de l\'eau.',
      '### 3. Nettoyer les capteurs',
      'Nettoyer délicatement les zones tactiles avec une brosse douce.',
      '## Ce que vous ne devriez jamais faire',
      'Ces erreurs peuvent endommager votre plaque :',
      '❌ **Nettoyants agressifs ou abrasifs** - Rayent la surface',
      '❌ **Nettoyant vitrocéramique sur plastique** - Décolore le cadre',
      '❌ **Eau directement sur l\'électronique** - Risque de court-circuit',
      '❌ **Éponges métalliques ou laine d\'acier** - Tout rayent',
      '❌ **Pression en essuyant** - La surface est sensible',
      '## Taches tenaces ?',
      'Voici comment enlever même les résidus brûlés :',
      '1. **Racloir pour plaque** : Les racloirs spéciaux vitrocéramique enlèvent la graisse brûlée',
      '2. **Trempage** : Poser un chiffon humide pendant 10 minutes pour desserrer la saleté',
      '3. **Pâte spéciale** : Les pâtes nettoyantes fonctionnent comme un polish',
      '## Protection à long terme',
      'Avec ces conseils, votre plaque restera belle pendant des années :',
      '- Toujours utiliser des casseroles adaptées (fond plat)',
      '- Ne pas laisser refroidir les masses de sucre renversées',
      '- Nettoyer régulièrement les fentes de ventilation',
      '- Utiliser des couvercles de protection pour les zones sensibles',
      '## Conclusion',
      'Les bons soins sont simples : essuyage régulier avec le bon chiffon, retrait immédiat des taches, et nettoyage en profondeur occasionnel. Ainsi, votre plaque à induction restera comme neuve pendant des années !'
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
                __html: paragraph.replace('- ', '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') 
              }} />
            </ul>
          )
        }
        if (paragraph.startsWith('❌')) {
          return (
            <div key={index} className="flex items-start gap-3 text-gray-700 mb-2">
              <span className="text-red-500 text-xl">❌</span>
              <span dangerouslySetInnerHTML={{ 
                __html: paragraph.replace('❌ ', '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') 
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
                __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') 
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
              __html: paragraph.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') 
            }}
          />
        )
      })}
    </>
  )
}

export default function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Enable static rendering
  setRequestLocale('de')
  
  const post = blogPosts.find(p => p.slug === params.slug)
  
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
