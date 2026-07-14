/**
 * NOVA INDUKT — Seed Batch 1 : 10 Induktionspfannen
 * Exécuter avec : npx tsx prisma/seed-products-batch1.ts
 *
 * Catégories couvertes :
 *   - Sous-cat A : Poêles antiadhésives (Prods 1–4)
 *   - Sous-cat B : Poêles en fonte / Gusseisen (Prods 5–7)
 *   - Sous-cat C : Woks spécial induction (Prods 8–10)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Génère les images à partir du dossier public local */
function imgs(folder: string, files: string[]): { url: string; alt: string; sortOrder: number; isMain: boolean }[] {
  const base = `/images/products/${folder}`
  return files.map((file, i) => ({
    url: `${base}/${file}`,
    alt: folder,
    sortOrder: i,
    isMain: i === 0,
  }))
}

// ─── Données produits ─────────────────────────────────────────────────────────

const products = [
  // ══════════════════════════════════════════════════════════════
  // SOUS-CATÉGORIE A : ANTIHAFT (Antiadhésives)
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'tefal-eternal-mesh-e49706-28cm',
    supplierSku: 'TEF-E49706-28',
    nameDe: 'Tefal Eternal Mesh Triply Bratpfanne 28 cm',
    shortDescription: 'Antihaftpfanne mit innovativer Wabenstruktur — Testsieger FAZ 05/2026',
    descriptionDe: `Die Tefal Eternal Mesh E49706 vereint die Stärken einer Edelstahl-Triply-Konstruktion mit einem leistungsstarken PTFE-Antihaftbelag auf Basis einer einzigartigen Wabenstruktur (Mesh-Technologie). Diese Netzstruktur schützt die Antihaftbeschichtung mechanisch, erlaubt die Verwendung von Metallutensilien und sorgt gleichzeitig für intensiveres Anbraten durch direkten Metall-Lebensmittel-Kontakt.

**Merkmale:**
- Dreischichtiger Edelstahlkörper (Triply) für optimale Wärmeverteilung ohne Hotspots
- Ferromagnetischer Edelstahlboden — 100 % induktionskompatibel
- Hitzebeständig bis 250 °C (Backofeneinsatz möglich)
- Geeignet für Metallutensilien dank Wabenstruktur
- Hergestellt in Frankreich
- Ausgezeichnet als Testsieger im FAZ Kaufkompass 05/2026 (beste Antihaftpfanne)
- Ohne PFOA, Blei und Cadmium

Die Beschichtung entwickelt mit der Zeit eine natürliche Patina, was ein Zeichen aktiver Nutzung und höchster Qualität ist.`,
    price: 79.99,
    oldPrice: 89.24,
    brand: 'Tefal',
    material: 'Edelstahl Triply (dreischichtig)',
    dimensions: 'Ø 28 cm, Höhe ca. 5 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Testsieger FAZ', 'Made in France', 'Metallutensilien geeignet'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Tefal Eternal Mesh E49706 28 cm — Triply Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Tefal Eternal Mesh Bratpfanne 28 cm mit PTFE-Wabenstruktur, induktionsgeeignet, Testsieger FAZ 05/2026. Jetzt bei NOVA INDUKT kaufen.',
    categorySlug: 'induktionspfannen',
    folder: 'Tefal Eternal Mesh E49706 — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.jpeg'],
  },

  {
    slug: 'tefal-excellence-g2690632-28cm',
    supplierSku: 'TEF-G26906-28',
    nameDe: 'Tefal Excellence Bratpfanne 28 cm',
    shortDescription: 'Leichtgewicht-Antihaftpfanne mit Thermo-Spot-Indikator — 3 L Fassungsvermögen',
    descriptionDe: `Die Tefal Excellence G2690632 ist die ideale Alltagspfanne für die Induktionsküche. Ihr Aluminiumkörper macht sie besonders leicht und schnell erhitzbar, während der integrierte ferromagnetische Edelstahlboden eine perfekte Induktionskompatibilität sicherstellt.

**Merkmale:**
- Praktischer Thermo-Spot: roter Ring signalisiert die ideale Anbratetemperatur
- Verstärkte PTFE-Antihaftbeschichtung (6x langlebiger als Standard-Titanium)
- Großes Fassungsvermögen von 3 L — ideal für 4–5 Personen
- Kein Boden-Verformungsrisiko bis 210 °C
- Sehr leicht — ideal für alltägliches Kochen
- Hergestellt in Frankreich
- Ohne PFOA, Blei und Cadmium

Die Excellence-Serie verbindet Alltagstauglichkeit mit Tefals jahrzehntelanger Antihaft-Expertise.`,
    price: 49.99,
    oldPrice: 55.00,
    brand: 'Tefal',
    material: 'Aluminium mit Edelstahl-Induktionsboden',
    dimensions: 'Ø 28 cm, Höhe 5,6 cm, Volumen 3 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Thermo-Spot', 'Made in France', '3 Liter'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Tefal Excellence G2690632 28 cm — Induktionspfanne mit Thermo-Spot | NOVA INDUKT',
    metaDescription: 'Tefal Excellence Antihaftpfanne 28 cm mit Thermo-Spot, 3 L Volumen, induktionsgeeignet. Leicht und alltagstauglich — jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Tefal Excellence G2690632 — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'amt-gastroguss-i428-28cm',
    supplierSku: 'AMT-I428-28',
    nameDe: 'AMT Gastroguss Induktionspfanne 28 cm',
    shortDescription: 'Profi-Aluguss mit Lotan®-Beschichtung — Hergestellt in Deutschland',
    descriptionDe: `Die AMT Gastroguss i-428 ist eine echte Profiküchenpfanne aus massivem Aluminiumguss mit einem schweren integrierten Stahlkern für maximale Induktionsleistung. Der Lotan®-Keramik-Antihaftbelag bietet hervorragende Langlebigkeit und Hitzebeständigkeit.

**Merkmale:**
- Massiver Aluminiumgusskörper mit Stahlkern-Induktionsboden
- Lotan®-Keramik-Antihaftbeschichtung — extrem robust
- Hoher Rand (ca. 5–7 cm) für mehr Fassungsvermögen
- Ergonomischer Bakelit-Griff mit Hilfsgriff bei großen Modellen
- Hervorragende Wärmespeicherung und gleichmäßige Hitzeverteilung
- Wiederbe­schichtungsservice durch den Hersteller
- Hergestellt in Deutschland
- Ohne PFOA

Schwer, aber unschlagbar in der thermischen Stabilität — die Wahl der Profis.`,
    price: 89.99,
    oldPrice: 119.00,
    brand: 'AMT Gastroguss',
    material: 'Aluminiumguss mit Stahlkern',
    dimensions: 'Ø 28 cm, Höhe ca. 5 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Profi-Qualität', 'Lotan® Beschichtung'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'AMT Gastroguss i-428 28 cm — Profi Induktionspfanne | NOVA INDUKT',
    metaDescription: 'AMT Gastroguss Induktionspfanne 28 cm mit Lotan®-Beschichtung. Massiver Aluminiumguss, hergestellt in Deutschland — jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'AMT Gastroguss i-428 — 28 cm  i-724 — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'woll-titanium-nowo-1528il-28cm',
    supplierSku: 'WOL-1528IL-28',
    nameDe: 'Woll Titanium Nowo Induktionspfanne 28 cm',
    shortDescription: 'Titan-Induktionspfanne mit abnehmbarem Griff — backofengeeignet bis 260 °C',
    descriptionDe: `Die Woll Titanium Nowo 1528IL ist speziell für leistungsstarke Induktionskochfelder entwickelt worden. Ihr robuster Aluminiumgusskörper mit Titan-Antihaftbeschichtung und der abnehmbare Griff machen sie zur universellen Allrounderin für Herd und Backofen.

**Merkmale:**
- Spezieller Titan-Induktionsboden für optimale Energieübertragung
- Abnehmbarer Griff — backofengeeignet bis 260 °C
- Robuste Titan-Antihaftbeschichtung
- Massiver Aluminiumguss für gleichmäßige Wärmeverteilung
- Empfohlen von Pfannenhelden als beste Antihaft-Induktionspfanne
- Hergestellt in Deutschland
- Ohne PFOA

Die abnehmbare Griff-Funktion (Nowo-System) ermöglicht platzsparendes Verstauen und direkten Backofeneinsatz.`,
    price: 88.00,
    oldPrice: 95.00,
    brand: 'Woll',
    material: 'Aluminiumguss mit Titan-Induktionsboden',
    dimensions: 'Ø 28 cm, Höhe ca. 5 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Abnehmbarer Griff', 'Backofen bis 260°C'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Woll Titanium Nowo 1528IL 28 cm — Induktionspfanne mit abnehmbarem Griff | NOVA INDUKT',
    metaDescription: 'Woll Titanium Nowo Induktionspfanne 28 cm — Titan-Beschichtung, abnehmbarer Griff, backofengeeignet bis 260°C. Hergestellt in Deutschland.',
    categorySlug: 'induktionspfannen',
    folder: 'Woll Titanium Nowo 1528IL — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // SOUS-CATÉGORIE B : GUSSEISEN (Fonte)
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'lodge-logic-l8sk3-gusseisen-26cm',
    supplierSku: 'LOD-L8SK3-26',
    nameDe: 'Lodge Logic Gusseisen Bratpfanne 26 cm',
    shortDescription: 'Klassische Gusseisenpfanne mit Lifetime-Garantie — voreingebrannt & sofort einsatzbereit',
    descriptionDe: `Die Lodge L8SK3 ist eine der bekanntesten Gusseisenpfannen der Welt. Aus einem einzigen Stück Gusseisen gefertigt, entwickelt sie mit jeder Benutzung eine bessere natürliche Antihaftschicht (Patina) — ohne chemische Beschichtungen.

**Merkmale:**
- Massiver Gusseisenkörper — ein einziges Stück Metall, keine Schwachstellen
- Ferromagnetisches Gusseisen — perfekt für Induktion
- Voreingebrannt (pre-seasoned) mit pflanzlichem Öl — sofort einsatzbereit
- Geeignet für alle Herdarten inkl. Grill und offenem Feuer
- Vollständig ofenfest ohne Temperaturbegrenzung
- Zwei Ausgießer und Gegengriff integriert
- Hergestellt in den USA
- Lifetime Guarantee (Garantie auf Lebenszeit)

Eine Pfanne, die Generationen übersteht — je mehr sie benutzt wird, desto besser wird sie.`,
    price: 32.90,
    oldPrice: 44.90,
    brand: 'Lodge',
    material: 'Gusseisen (unbehandelt, voreingebrannt)',
    dimensions: 'Ø 26 cm (außen), Höhe ca. 5 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Lifetime Garantie', 'Made in USA', 'Keine Beschichtung'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Lodge Logic L8SK3 Gusseisenpfanne 26 cm — Induktionsgeeignet | NOVA INDUKT',
    metaDescription: 'Lodge Logic Gusseisenpfanne 26 cm — pre-seasoned, induktionsgeeignet, Lifetime-Garantie. Hergestellt in den USA. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Lodge Logic Gusseisenpfanne L8SK3 — 26 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'staub-gusseisen-bratpfanne-26cm',
    supplierSku: 'STB-40511-26',
    nameDe: 'Staub France Gusseisen Bratpfanne 26 cm',
    shortDescription: 'Französische Gusseisenpfanne der Extraklasse — mattschwarze Emaille, Ofenfest',
    descriptionDe: `Die Staub Bratpfanne aus emailliertem Gusseisen verbindet außergewöhnliche Kochleistung mit französischer Eleganz. Die matte schwarze Emaille-Innenbeschichtung fördert die natürliche Patinaentwicklung und sorgt mit der Zeit für immer bessere Antihaft-Eigenschaften.

**Merkmale:**
- Emailliertes Gusseisen — kein Einbrennen erforderlich
- Matte schwarze Innenemaille — entwickelt mit der Zeit natürliche Antihaftpatina
- Integrierte Ausgießer beidseitig
- Gusseisen-Griff — vollständig ofenfest bei sehr hohen Temperaturen
- Induktionsgeeigneter Gusseisenboden
- Erhältlich in mehreren Farben (Schwarz, Cherry, Graphit)
- 5 Jahre Garantie durch Staub
- Hergestellt in Frankreich

Die Staub-Pfanne ist eine Investition fürs Leben — sie wird mit jeder Benutzung besser und schöner.`,
    price: 154.90,
    oldPrice: 179.00,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 26 cm, Höhe ca. 5 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['5 Jahre Garantie', 'Made in France', 'Premium Emaille'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Staub Gusseisen Bratpfanne 26 cm — Emailliert, Induktion | NOVA INDUKT',
    metaDescription: 'Staub France Gusseisenpfanne 26 cm mit mattschwarzer Emaille. Ofenfest, induktionsgeeignet, 5 Jahre Garantie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Staub Bratpfanne Gusseisen — 26 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'petromax-feuerpfanne-fp30-30cm',
    supplierSku: 'PET-FP30-30',
    nameDe: 'Petromax Feuerpfanne fp30 mit Stiel 30 cm',
    shortDescription: 'Vielseitige Gusseisenpfanne für Herd, Backofen & Outdoor — voreingebrannt',
    descriptionDe: `Die Petromax Feuerpfanne fp30 ist die ultimative Allround-Gusseisenpfanne für drinnen und draußen. Ob Induktionskochfeld, Backofen, Grill oder Lagerfeuer — diese robuste Pfanne aus massivem Gusseisen meistert jeden Einsatz.

**Merkmale:**
- Massives Gusseisen — voreingebrannt mit pflanzlichem Öl (PFAS-frei)
- Ferromagnetischer Gusseisenboden — perfekte Induktionskompatibilität
- Langer Gusseisen-Stiel mit Aufhängeloch
- Hoher Rand (7 cm) für mehr Fassungsvermögen (2,5 L)
- Glatter Außenboden schützt das Induktionskochfeld
- Ideal für Camping und Outdoor-Abenteuer
- Hergestellt in Deutschland / Europa
- Ohne PFAS und chemische Beschichtung

Die fp30 ist mehr als eine Pfanne — sie ist ein Kochpartner für das ganze Leben.`,
    price: 44.99,
    oldPrice: 59.95,
    brand: 'Petromax',
    material: 'Gusseisen (voreingebrannt, PFAS-frei)',
    dimensions: 'Ø 30 cm (außen), Ø 25 cm (Boden), Höhe 7 cm, 2,5 L',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Outdoor geeignet', 'PFAS-frei'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Petromax Feuerpfanne fp30 30 cm — Gusseisen Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Petromax Feuerpfanne fp30 30 cm — voreingebrannt, induktionsgeeignet, outdoor-tauglich. Hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Petromax Feuerpfanne fp30 — 30 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // SOUS-CATÉGORIE C : WOKS SPÉCIAL INDUCTION
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'tefal-jamie-oliver-wok-28cm',
    supplierSku: 'TEF-E30319-WOK28',
    nameDe: 'Tefal Jamie Oliver Wokpfanne 28 cm',
    shortDescription: 'Testsieger-Wok mit Thermo-Spot — leicht, spülmaschinenfest, induktionsoptimiert',
    descriptionDe: `Der Tefal Jamie Oliver Wok wurde in Zusammenarbeit mit dem Starkoch Jamie Oliver für optimale Ergebnisse auf Induktionskochfeldern entwickelt. Der dicke Kapselboden aus Edelstahl sorgt für gleichmäßige Wärmeverteilung ohne Verformungsrisiko.

**Merkmale:**
- Dicker Edelstahl-Kapselboden (Kapselboden) — induktionsoptimiert, kein Verziehen
- Praktischer Thermo-Spot-Temperaturindikator
- Titanverstärkte PTFE-Antihaftbeschichtung
- Leicht (ca. 1,1 kg) — einfaches Schwenken möglich
- Backofen bis 210 °C (Metallgriff mit Silikonbeschichtung)
- Spülmaschinengeeignet
- Beidseitige Schüttränder
- Testsieger Pfannenhelden, Note 1,2 Haus & Garten Test

Der ideale Wok für schnelle asiatische Gerichte auf dem Induktionsherd.`,
    price: 42.90,
    oldPrice: 54.95,
    brand: 'Tefal',
    material: 'Edelstahl mit Kapselboden',
    dimensions: 'Ø 28 cm, Höhe ca. 8–9 cm, ca. 3–3,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Testsieger', 'Thermo-Spot', 'Jamie Oliver'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Tefal Jamie Oliver Wokpfanne 28 cm — Induktion, Testsieger | NOVA INDUKT',
    metaDescription: 'Tefal Jamie Oliver Wok 28 cm mit Thermo-Spot und Kapselboden. Testsieger Pfannenhelden. Leicht, spülmaschinengeeignet — bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Tefal Jamie Oliver Wokpfanne — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'fissler-adamant-wok-32cm',
    supplierSku: 'FIS-ADAM-WOK32',
    nameDe: 'Fissler Adamant Aluminium-Wok 32 cm',
    shortDescription: 'Platz 1 Testberichte.de — 6 L Großraumwok mit Maßskala, hergestellt in Deutschland',
    descriptionDe: `Der Fissler Adamant Wok ist das Flaggschiff der deutschen Kochkultur für induktive Großraumküchen. Mit 32 cm Durchmesser und 6 Litern Fassungsvermögen ist er ideal für Familien oder wenn für viele Gäste gekocht wird.

**Merkmale:**
- Platz 1 im Wok-Test von Testberichte.de (05/2026)
- Adamant-Keramik-Antihaftbeschichtung — äußerst langlebig
- Integrierte Maßskala für präzises Kochen
- Sehr hoher Rand (ca. 10 cm) — ideal für Wok-typisches Schwenken
- Großer flacher Induktionsboden (Ø 19 cm) für optimale Energieübertragung
- Spülmaschinengeeignet
- Backofen bis max. Griff-Toleranz geeignet
- Hergestellt in Deutschland

Qualität made in Germany für professionelle Wok-Ergebnisse zu Hause.`,
    price: 139.00,
    oldPrice: 169.00,
    brand: 'Fissler',
    material: 'Aluminium mit Adamant-Keramikbeschichtung',
    dimensions: 'Ø 32 cm, Höhe ca. 10 cm, 6 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Testsieger', 'Made in Germany', '6 Liter Volumen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Fissler Adamant Wok 32 cm — Testsieger Induktionswok | NOVA INDUKT',
    metaDescription: 'Fissler Adamant Wok 32 cm — Platz 1 Testberichte.de, 6 L, Adamant-Beschichtung, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Fissler Adamant Wok — 32 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'woll-concept-wok-1030nc-30cm',
    supplierSku: 'WOL-1030NC-WOK30',
    nameDe: 'Woll Concept Wok 30 cm mit Glasdeckel',
    shortDescription: 'Edelstahl-Wok mit Multifunktions-Glasdeckel — Platz 2 Testberichte.de',
    descriptionDe: `Der Woll Concept Wok 1030NC aus hochwertigem 18/10-Edelstahl überzeugt durch seinen sehr hohen Rand und den mitgelieferten Multifunktions-Glasdeckel. Die feuerfesten Griffe und der robuste Edelstahlkörper machen ihn zum Dauerbegleiter in der Induktionsküche.

**Merkmale:**
- Platz 2 im Wok-Test von Testberichte.de (05/2026)
- Hochwertiger 18/10-Edelstahl mit Antihaftbeschichtung
- Sehr hoher Rand (10 cm) — ideal für Wok-Gerichte
- Multifunktions-Glasdeckel inklusive
- Feuerfeste Griffe (backofengeeignet bis 200 °C)
- Spülmaschinengeeignet
- Keine Hotspots dank gleichmäßiger Wärmeverteilung
- Hergestellt in Deutschland

Der Woll Wok ist die stabile, langlebige Wahl für tägliches intensives Kochen.`,
    price: 82.90,
    oldPrice: 95.00,
    brand: 'Woll',
    material: 'Edelstahl 18/10 mit Antihaftbeschichtung',
    dimensions: 'Ø 30 cm, Höhe 10 cm, ca. 4 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Mit Glasdeckel', 'Platz 2 Test'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Woll Concept Wok 1030NC 30 cm — Induktionswok mit Glasdeckel | NOVA INDUKT',
    metaDescription: 'Woll Concept Wok 30 cm — Edelstahl 18/10, Glasdeckel inklusive, Platz 2 Testberichte.de. Hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Woll Concept Wok 1030NC — 30 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch 1 : Induktionspfannen (10 Produkte)')
  console.log('─'.repeat(60))

  // Récupérer les catégories existantes
  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]))

  console.log(`📁 Catégories disponibles : ${categories.map((c) => c.slug).join(', ')}\n`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug)
    if (!categoryId) {
      console.error(`  ❌ Catégorie introuvable : ${p.categorySlug} pour ${p.nameDe}`)
      errors++
      continue
    }

    const imageData = imgs(p.folder, p.imageFiles)

    try {
      const existing = await prisma.product.findUnique({ where: { slug: p.slug } })

      if (existing) {
        // Mise à jour
        await prisma.product.update({
          where: { slug: p.slug },
          data: {
            nameDe: p.nameDe,
            shortDescription: p.shortDescription,
            descriptionDe: p.descriptionDe,
            price: p.price,
            oldPrice: p.oldPrice ?? null,
            brand: p.brand,
            material: p.material,
            dimensions: p.dimensions,
            dishwasherSafe: p.dishwasherSafe,
            inductionSafe: p.inductionSafe,
            badges: p.badges,
            rating: p.rating,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            categoryId,
            isActive: true,
          },
        })

        // Mettre à jour les images
        await prisma.productImage.deleteMany({ where: { productId: existing.id } })
        await prisma.productImage.createMany({
          data: imageData.map((img) => ({ ...img, productId: existing.id })),
        })

        updated++
        console.log(`  ↻  [${updated + created}/${products.length}] MIS À JOUR : ${p.nameDe.substring(0, 55)}`)
      } else {
        // Création
        await prisma.product.create({
          data: {
            slug: p.slug,
            supplierSku: p.supplierSku,
            nameDe: p.nameDe,
            shortDescription: p.shortDescription,
            descriptionDe: p.descriptionDe,
            price: p.price,
            oldPrice: p.oldPrice ?? null,
            brand: p.brand,
            material: p.material,
            dimensions: p.dimensions,
            dishwasherSafe: p.dishwasherSafe,
            inductionSafe: p.inductionSafe,
            vatRatePercent: p.vatRatePercent,
            priceIncludesVat: p.priceIncludesVat,
            badges: p.badges,
            rating: p.rating,
            reviewCount: p.reviewCount,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            categoryId,
            isActive: true,
            images: {
              create: imageData,
            },
          },
        })

        created++
        console.log(`  ✓  [${updated + created}/${products.length}] CRÉÉ : ${p.nameDe.substring(0, 55)}`)
      }
    } catch (err: unknown) {
      errors++
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗  ERREUR : ${p.nameDe.substring(0, 40)} — ${msg}`)
    }
  }

  console.log('\n' + '═'.repeat(60))
  console.log('📊 RÉSUMÉ')
  console.log('═'.repeat(60))
  console.log(`  ✅ Créés    : ${created}`)
  console.log(`  ↻  Mis à jour : ${updated}`)
  console.log(`  ❌ Erreurs  : ${errors}`)
  console.log('═'.repeat(60))

  if (errors === 0) {
    console.log('\n🎉 Batch 1 terminé avec succès !')
  } else {
    console.log(`\n⚠️  ${errors} erreur(s) — vérifiez les logs ci-dessus.`)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
