/**
 * Blog seed — inserts the 3 founding articles into the database.
 * Run: npx ts-node prisma/seed-blog.ts
 * Or add to the main seed: import './seed-blog'
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const blogSeedData = [
  {
    slug: 'pfanne-kaufratgeber',
    titleDe: 'Der ultimative Induktions-Pfannen-Kaufratgeber',
    excerptDe: 'Worauf Sie beim Kauf von Pfannen für Ihr Induktionskochfeld unbedingt achten sollten.',
    contentDe: `## Warum Induktionspfannen besondere Anforderungen haben

Nicht jede Pfanne ist für Induktionsherde geeignet. Das Kochfeld erzeugt ein elektromagnetisches Wechselfeld, das nur in ferromagnetischen Materialien Wärme erzeugt. Das bedeutet: Nur Pfannen mit einem magnetischen Boden funktionieren auf Induktion.

**Der einfachste Test:** Bleibt ein Magnet am Pfannenboden haften, ist sie induktionsgeeignet.

## Welche Materialien eignen sich?

Die besten Materialien für Induktionspfannen sind:

**Edelstahl (18/10):** Robust, langlebig und pflegeleicht. Ideal für das scharfe Anbraten von Fleisch und Gemüse. Edelstahlpfannen brauchen etwas Eingewöhnungszeit, entwickeln aber bei richtiger Handhabung hervorragende Brateeigenschaften.

**Gusseisen:** Die Königsklasse unter den Induktionspfannen. Speichert Hitze exzellent und ist praktisch unverwüstlich. Einziger Nachteil: Das hohe Gewicht.

**Aluminium mit Induktionsboden:** Leicht und schnell erhitzend, aber durch den aufgenieten oder eingebetteten Stahlboden induktionsgeeignet. Oft mit Antihaftbeschichtung kombiniert.

## Worauf Sie beim Kauf achten sollten

### Bodenstärke und -qualität
Ein dicker, mehrlagiger Boden (Sandwichboden) sorgt für gleichmäßige Wärmeverteilung. Mindestens 3 mm sollte der Boden stark sein — besser sind 5–6 mm für wirklich gleichmäßiges Garen.

### Griffmaterial und Ergonomie
Ofenfeste Griffe aus Edelstahl oder hitzeresistentem Kunststoff sind ideal. Achten Sie auf eine ergonomische Form und rutschfeste Oberflächen.

### Kompatibilität mit Induktionskochfeld
Prüfen Sie den Durchmesser: Der Pfannenboden sollte mindestens 60 % des Kochzonen-Durchmessers abdecken, damit die Induktionsheizung effizient arbeitet.

## Unsere Empfehlung

Für den täglichen Einsatz empfehlen wir eine hochwertige Edelstahlpfanne mit Sandwichboden aus der NOVA INDUKT Serie. Sie vereint Langlebigkeit, einfache Pflege und professionelle Bratergebnisse — und ist für alle Herdarten geeignet.`,
    image: '/images/blog/pfanne-induktion-kaufratgeber-2026.jpg',
    category: 'Ratgeber',
    author: 'Nova Team',
    readTime: '8 min',
    isPublished: true,
    publishedAt: new Date('2024-03-15'),
  },
  {
    slug: 'induktion-vs-gas',
    titleDe: 'Induktion vs. Gas: Was ist wirklich besser?',
    excerptDe: 'Ein detaillierter Vergleich der beiden beliebtesten Kochtechnologien in der modernen Küche.',
    contentDe: `## Die ewige Küchendebatte

Kaum eine Frage beschäftigt Hobbyköche und Profis gleichermaßen so sehr: Induktion oder Gas? Beide Systeme haben überzeugte Anhänger — und beide haben tatsächlich klare Stärken und Schwächen.

## Effizienz und Energieverbrauch

**Induktion gewinnt deutlich:** Bis zu 90 % der erzeugten Energie kommen direkt im Kochtopf an. Bei Gasherden sind es nur 40–55 %, da ein Großteil der Wärme seitlich am Topf vorbei entweicht.

In der Praxis bedeutet das: Wasser kocht schneller, der Stromverbrauch ist geringer, und die Küche erhitzt sich weniger.

## Präzision und Temperaturkontrolle

**Induktion überlegt:** Die Temperatur lässt sich in Echtzeit präzise anpassen. Das Abschalten ist sofort — kein Nachgaren auf heißen Platten. Ideal für empfindliche Saucen oder Schokolade im Wasserbad.

**Gas überzeugt** beim visuellen Feedback: Die Flamme zeigt sofort, wie viel Hitze entsteht. Geübte Köche schätzen das intuitive Arbeiten.

## Kochtechniken

**Gas ist überlegen beim:**
- Wokkochen mit echtem "Wok Hei" (Flambieren der Zutaten in der Flamme)
- Direktem Garen über der Flamme (Paprika rösten, Fleisch flambieren)
- Arbeiten mit rundem Kochgeschirr

**Induktion ist überlegen beim:**
- Gleichmäßigem Niedrigtemperaturgaren
- Sicherer Umgebung (kein offenes Feuer)
- Schnellem Aufheizen für Alltagskochen

## Kosten im Überblick

| | Induktion | Gas |
|---|---|---|
| Anschaffung Herd | 400–2.500 € | 300–1.800 € |
| Installation | Einfach (Steckdose) | Gasnetz nötig |
| Betriebskosten | Strom: mittel | Gas: aktuell hoch |
| Kochgeschirr | Muss induktionsgeeignet sein | Universell |

## Unser Fazit

Für den modernen Haushalts-Koch ist **Induktion die bessere Wahl**: effizienter, sicherer, präziser und leichter zu reinigen. Nur für Profis mit spezifischen Anforderungen (Wok, Flambieren) hat Gas noch klare Vorteile.`,
    image: '/images/blog/induktion-vs-gas-vergleich-2026.jpg',
    category: 'Technik',
    author: 'Dr. Koch',
    readTime: '12 min',
    isPublished: true,
    publishedAt: new Date('2024-03-10'),
  },
  {
    slug: 'kochfeld-pflege',
    titleDe: 'So bleibt Ihr Induktionskochfeld jahrelang wie neu',
    excerptDe: 'Pflegetipps und Tricks für die tägliche Reinigung und den Werterhalt Ihrer Geräte.',
    contentDe: `## Warum die richtige Pflege so wichtig ist

Ein Induktionskochfeld ist eine Investition — und mit der richtigen Pflege hält es Jahrzehnte. Die glatte Glaskeramikoberfläche sieht zwar robust aus, reagiert aber empfindlich auf falsche Reinigungsmittel und Kratzer.

## Die tägliche Reinigung

**Warten Sie, bis das Kochfeld abgekühlt ist.** Zwar erhitzt sich die Glasfläche bei Induktion kaum (die Wärme entsteht nur im Topf), aber eingekochte Reste lassen sich nach dem Abkühlen besser entfernen.

**Das richtige Tuch:** Verwenden Sie immer ein weiches Mikrofasertuch oder einen speziellen Glaskeramik-Schwamm. Niemals Stahlwolle oder scheuernde Schwämme — diese hinterlassen feine Kratzer, die das Glaskeramik dauerhaft trüben.

**Der richtige Reiniger:** Klares Wasser genügt für frische Flecken. Für hartnäckige Reste: ein Tropfen Spülmittel auf dem feuchten Tuch. Spezielle Glaskeramik-Reiniger (z.B. Ceranfeld-Reiniger) lösen eingebrannte Rückstände ohne Kratzer.

## Hartnäckige Einbrennungen entfernen

Ist etwas eingebrannt, hilft folgendes Vorgehen:

1. Kochfeld vollständig abkühlen lassen
2. Spezialreiniger auftragen und 5 Minuten einwirken lassen
3. Mit einem Ceranfeld-Schaber (45° Winkel halten!) behutsam abschaben
4. Mit feuchtem Tuch nachwischen
5. Mit trockenem Tuch polieren

**Wichtig:** Nur Kunststoff- oder Edelstahlschaber verwenden — niemals scharfe Metallklingen.

## Was Sie unbedingt vermeiden sollten

- **Kochgeschirr mit rauem Boden:** Töpfe mit Graten oder Unebenheiten hinterlassen Kratzer. Prüfen Sie neue Töpfe am besten auf einem weißen Papier.
- **Alufolie und Plastik auf dem heißen Kochfeld:** Schmilzt ein und lässt sich kaum entfernen.
- **Überlaufendes Salz- oder Zuckerwasser:** Sofort entfernen — beides greift Glaskeramik bei Hitze an.
- **Scheuernde Reinigungsmittel:** Auch "sanfte" Scheuermittel hinterlassen mikroskopische Kratzer.

## Langzeitpflege und Versiegelung

Alle 2–3 Monate empfiehlt sich eine Behandlung mit einem Glaskeramik-Pflegemittel. Es legt einen dünnen Schutzfilm über die Oberfläche, der:
- Fingerabdrücke abstoßend wirkt
- Einbrennen von Flüssigkeiten verhindert
- Den Glanz langfristig erhält

Mit dieser einfachen Routine bleibt Ihr NOVA INDUKT Kochfeld jahrelang in bestem Zustand.`,
    image: '/images/blog/edelstahlpfannen-reinigen-pflegen.jpg',
    category: 'Pflege',
    author: 'Nova Team',
    readTime: '5 min',
    isPublished: true,
    publishedAt: new Date('2024-03-05'),
  },
]

async function main() {
  console.log('📝 Seeding blog posts...')

  let count = 0
  for (const post of blogSeedData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        titleDe: post.titleDe,
        excerptDe: post.excerptDe,
        contentDe: post.contentDe,
        image: post.image,
        category: post.category,
        author: post.author,
        readTime: post.readTime,
        isPublished: post.isPublished,
        publishedAt: post.publishedAt,
      },
      create: post,
    })
    count++
    console.log(`  ✓ [${count}/${blogSeedData.length}] ${post.titleDe.substring(0, 60)}`)
  }

  console.log(`\n✅ Blog seed complete: ${count} articles upserted.`)
}

main()
  .catch((e) => {
    console.error('❌ Blog seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
