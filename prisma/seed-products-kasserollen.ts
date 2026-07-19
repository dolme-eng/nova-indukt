/**
 * NOVA INDUKT — Seed Catégorie : Kasserollen / Stielkasserollen (10 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-kasserollen.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function imgs(folder: string, files: string[]) {
  const base = `/images/products/${folder}`
  return files.map((file, i) => ({
    url: `${base}/${file}`,
    alt: folder,
    sortOrder: i,
    isMain: i === 0,
  }))
}

const products = [
  {
    slug: 'fissler-opc-stielkasserolle-16cm-metalldeckel',
    supplierSku: 'FIS-OPC-SK16-D',
    sortOrder: 1,
    nameDe: 'Fissler Original Profi Collection Stielkasserolle 16 cm mit Metalldeckel',
    shortDescription: 'Professionelle Stielkasserolle aus Edelstahl 18/10 mit CookStar® Allherdboden und Metalldeckel — 1,4 L',
    descriptionDe: `Die Fissler Original Profi Collection Stielkasserolle (16 cm) mit Metalldeckel ist die idealere Wahl für anspruchsvolle Hobbyköche und Profis. Hergestellt aus extrem dickwandigem, mattiertem Edelstahl 18/10, überzeugt diese Kasserolle durch ihre erstklassige Verarbeitung und hervorragende Kocheigenschaften auf Induktionskochfeldern.

**Merkmale:**
- CookStar® Allherdboden (7,2 mm) für perfekte Planstabilität und maximale Energieeffizienz auf Induktion
- Hochwertiger, schwerer Edelstahl 18/10 (mattiert) — kratz- und wasserfleckenresistent
- Kaltmetallgriffe: bleiben auf dem Herd spürbar kühler
- Kondensat-Plus-Funktion im Metalldeckel für saftigeres Kochgut
- Messskala an der Kasserolleninnenseite & extra breiter Schüttrand
- Backofengeeignet bis 230 °C (auch mit Deckel)
- Hergestellt in Deutschland (Made in Germany)

Die absolute Referenz unter den Stielkasserollen — langlebig, robust und thermisch perfekt abgestimmt.`,
    price: 139.00,
    oldPrice: 169.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10 (unbeschichtet)',
    dimensions: 'Ø 16 cm, Höhe 8,5 cm, 1,4 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.28,
    badges: ['Made in Germany', 'CookStar®', '15 Jahre Garantie', 'Metalldeckel'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Fissler Original Profi Collection Stielkasserolle 16 cm Metalldeckel | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Stielkasserolle 16 cm mit Metalldeckel (1,4 L). Edelstahl 18/10, CookStar-Boden, induktionsgeeignet. Made in Germany bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Fissler Original Profi Collection — Stielkasserolle 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-opc-stielkasserolle-18cm',
    supplierSku: 'FIS-OPC-SK18',
    sortOrder: 2,
    nameDe: 'Fissler Original Profi Collection Stielkasserolle 18 cm',
    shortDescription: 'Professionelle Stielkasserolle aus Edelstahl 18/10 mit CookStar® Allherdboden — 2,0 L',
    descriptionDe: `Die Fissler Original Profi Collection Stielkasserolle (18 cm) gehört zur Spitzenklasse des deutschen Kochgeschirrs. Ausgestattet mit dem bewährten CookStar® Allherdboden aus massivem, doppellagigem Edelstahl garantiert sie eine gleichmäßige und energieeffiziente Wärmeverteilung auf jedem Induktionsherd.

**Merkmale:**
- CookStar® Allherdboden (7,2 mm) für optimale Induktionsleistung und perfekte Planstabilität
- Extrem dickwandiger Edelstahl 18/10 (mattiert) — langlebig und robust
- Kaltmetallgriffe: bleiben auf dem Herd spürbar kühler
- Integrierte Messskala an der Innenseite für genaues Dosieren
- Extra breiter, tropffreier Schüttrand
- Backofengeeignet bis 230 °C
- Hergestellt in Deutschland (Made in Germany)

Die perfekte Kasserolle für anspruchsvolles Kochen — von Soßen über Risotto bis hin zu Milchspeisen.`,
    price: 119.00,
    oldPrice: 149.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 18 cm, Höhe 9 cm, 2,0 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.45,
    badges: ['Made in Germany', 'CookStar®', '15 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler Original Profi Collection Stielkasserolle 18 cm | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Stielkasserolle 18 cm (2,0 L). Edelstahl 18/10, CookStar-Boden, induktionsgeeignet. Hergestellt in Deutschland bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Fissler Original Profi Collection — Stielkasserolle 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-adamant-stielkasserolle-18cm',
    supplierSku: 'FIS-ADAM-SK18',
    sortOrder: 3,
    nameDe: 'Fissler Adamant Stielkasserolle 18 cm mit Glasdeckel',
    shortDescription: 'Leichte Aluminium-Kasserolle mit 3-fach Adamant-Keramikbeschichtung und Glasdeckel — 2,0 L',
    descriptionDe: `Die Fissler Adamant Stielkasserolle (18 cm) bietet eine hervorragende Kombination aus leichtem Aluminium und der extrem widerstandsfähigen Adamant-Keramikbeschichtung. Die dreifache Beschichtung ist metallbeständig und besonders kratzfest — ideal für das tägliche Kochen auf Induktionsherden.

**Merkmale:**
- 3-fach Adamant-Keramikbeschichtung: extrem kratzfest, metallbeständig und pflegeleicht
- Leichtes Aluminium für schnelle Reaktionszeit auf Wärme
- TransTherm® Allherdboden: optimiert für hervorragende Induktionsleistung
- Glasdeckel für bequemes Sichtkochen
- Breiter Schüttrand für kleckerfreies Ausgießen
- Hergestellt in Deutschland (Made in Germany)

Die ideale Kasserolle für alle, die eine leichte, pflegeleichte und langlebige Lösung suchen.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'Fissler',
    material: 'Aluminium mit Adamant-Keramikbeschichtung',
    dimensions: 'Ø 18 cm, Höhe 9 cm, 2,0 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.1,
    badges: ['Made in Germany', 'Keramikbeschichtung', 'Glasdeckel'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Adamant Stielkasserolle 18 cm mit Glasdeckel | NOVA INDUKT',
    metaDescription: 'Fissler Adamant Stielkasserolle 18 cm (2,0 L) mit Glasdeckel. Adamant-Keramikbeschichtung, TransTherm-Boden, induktionsgeeignet bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Fissler Adamant — Stielkasserolle 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'wmf-function4-stielkasserolle-16cm',
    supplierSku: 'WMF-FUNC4-SK16',
    sortOrder: 4,
    nameDe: 'WMF Function 4 Stielkasserolle 16 cm mit Deckel',
    shortDescription: 'Cromargan® Edelstahl-Kasserolle mit innovativem 4-Positionen-Glasdeckel — 1,5 L',
    descriptionDe: `Die WMF Function 4 Stielkasserolle (16 cm) vereint exzellente Kocheigenschaften mit dem genialen Multifunktionsdeckel. Der Deckel besitzt einen roten Silikonring mit 4 verschiedenen Abgießfunktionen, sodass Flüssigkeiten kontrolliert abgegossen werden können, ohne den Deckel abzunehmen.

**Merkmale:**
- Cromargan® Edelstahl Rostfrei 18/10 — unempfindlich, hygienisch und geschmacksneutral
- TransTherm®-Allherdboden: dicker Aluminiumkern, gekapselt in Edelstahl, für beste Induktionseigenschaften
- Function 4 Deckel: 4 Positionen zum Ausgießen (geschlossen, weit offen, feine Sieblöcher, grobe Sieblöcher)
- Hohlgriff: erwärmt sich während des Kochens kaum
- Integrierte Füllskala
- Hergestellt in Deutschland

Die ideale Verbindung aus deutscher Ingenieurskunst und modernem Design für die Induktionsküche.`,
    price: 89.99,
    oldPrice: 129.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 16 cm, Höhe 8 cm, 1,5 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.0,
    badges: ['Made in Germany', 'Function 4 Deckel', 'Cromargan®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Stielkasserolle 16 cm | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Stielkasserolle 16 cm (1,5 L). Cromargan-Edelstahl 18/10, TransTherm-Boden, Multifunktionsdeckel. Induktionsgeeignet bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'WMF Function 4 — Stielkasserolle 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'wmf-comfort-line-stielkasserolle-16cm',
    supplierSku: 'WMF-COMFORT-SK16',
    sortOrder: 5,
    nameDe: 'WMF Comfort Line Stielkasserolle 16 cm',
    shortDescription: 'Kompakte Cromargan® Stielkasserolle mit TransTherm® Allherdboden — 1,4 L',
    descriptionDe: `Die WMF Comfort Line Stielkasserolle (16 cm) ist die kompakte Lösung für schnelles Kochen auf Induktionsherden. Aus Cromargan® Edelstahl 18/10 gefertigt und mit dem bewährten TransTherm® Allherdboden ausgestattet, bietet sie zuverlässige Kocheigenschaften zu einem hervorragenden Preis-Leistungs-Verhältnis.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — hochwertig, langlebig und pflegeleicht
- TransTherm® Allherdboden: optimale Hitzeverteilung auf Induktion und anderen Herdarten
- Robuster, ergonomisch geformter Edelstahl-Stielgriff
- Breiter Schüttrand für tropffreies Ausgießen
- Spülmaschinengeeignet
- Hergestellt in Deutschland

Die bewährte Qualitätskasserolle für den täglichen Gebrauch — solide, zuverlässig und preiswert.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 16 cm, Höhe 8 cm, 1,4 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.75,
    badges: ['Made in Germany', 'TransTherm®', 'Cromargan®'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Comfort Line Stielkasserolle 16 cm | NOVA INDUKT',
    metaDescription: 'WMF Comfort Line Stielkasserolle 16 cm (1,4 L). Cromargan-Edelstahl 18/10, TransTherm-Boden, induktionsgeeignet. Hergestellt in Deutschland bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'WMF Comfort Line — Stielkasserolle 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'wmf-diadem-plus-stielkasserolle-16cm',
    supplierSku: 'WMF-DIAD-SK16',
    sortOrder: 6,
    nameDe: 'WMF Diadem Plus Stielkasserolle 16 cm mit Deckel',
    shortDescription: 'Elegante Cromargan® Kasserolle mit Keramik-Innenbeschichtung und Glasdeckel — 1,5 L',
    descriptionDe: `Die WMF Diadem Plus Stielkasserolle (16 cm) besticht durch ihre elegante Linienführung und die hochwertige Keramik-Innenbeschichtung. Die beschichtete Innenwand ist besonders pflegeleicht und verhindert das Anbacken — ideal für empfindliche Speisen wie Eier, Milch oder Soßen auf Induktionsherden.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — elegant, robust und langlebig
- TransTherm® Allherdboden: für gleichmäßige und energieeffiziente Wärmeverteilung auf Induktion
- Keramik-Innenbeschichtung: pflegeleicht, geschmacksneutral und antiklebend
- Glasdeckel für Sichtkochen
- Ergonomisch geformter Edelstahl-Stielgriff
- Spülmaschinengeeignet
- Hergestellt in Deutschland

Die elegante Kasserolle für anspruchsvolles Kochen mit komfortabler Keramikbeschichtung.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 16 cm, Höhe 8 cm, 1,5 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.95,
    badges: ['Made in Germany', 'TransTherm®', 'Keramik-Innenbeschichtung'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Stielkasserolle 16 cm | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Stielkasserolle 16 cm (1,5 L) mit Keramik-Innenbeschichtung. Cromargan-Edelstahl, TransTherm-Boden, induktionsgeeignet bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'WMF Diadem Plus — Stielkasserolle 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'demeyere-essential-5-stielkasserolle-18cm',
    supplierSku: 'DEM-ESS5-SK18',
    sortOrder: 7,
    nameDe: 'Demeyere Essential 5 Stielkasserolle 18 cm mit Deckel',
    shortDescription: 'Premium-Stielkasserolle aus Edelstahl 18/10 mit 5-Schicht-Material für optimale Wärmeverteilung — 2,2 L',
    descriptionDe: `Die Demeyere Essential 5 Stielkasserolle (18 cm) bietet die bewährte 5-Schicht-Technologie des belgischen Premiumherstellers für eine gleichmäßige und effiziente Wärmeverteilung auf Induktionsherden. Die Kombination aus Edelstahl und Aluminium sorgt für optimale Hitzespeicherung und -verteilung.

**Merkmale:**
- 5-Schicht-Material (5-Ply): Edelstahl-Aluminium-Edelstahl für gleichmäßige Wärmeverteilung bis zum Rand
- Hochwertiger Edelstahl 18/10 — langlebig und pflegeleicht
- InductoSeal®-Technologie für optimale Induktionsleistung
- Massiver, geschweißter Edelstahlgriff ohne Nieten (hygienisch)
- Glasdeckel für bequemes Sichtkochen
- Hergestellt in Belgien mit 30 Jahren Garantie

Die erstklassige Kasserolle für anspruchsvolle Köche, die Wert auf gleichmäßiges Garen und Langlebigkeit legen.`,
    price: 129.00,
    oldPrice: 159.00,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 — 5-Schicht-Material',
    dimensions: 'Ø 18 cm, Höhe 9 cm, 2,2 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.53,
    badges: ['30 Jahre Garantie', '5-Schicht', 'Made in Belgium'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Demeyere Essential 5 Stielkasserolle 18 cm | NOVA INDUKT',
    metaDescription: 'Demeyere Essential 5 Stielkasserolle 18 cm (2,2 L). 5-Schicht-Edelstahl, InductoSeal, induktionsgeeignet. 30 Jahre Garantie bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Demeyere Essential 5 — Stielkasserolle 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'demeyere-atlantis-7-stielkasserolle-20cm',
    supplierSku: 'DEM-ATL7-SK20',
    sortOrder: 8,
    nameDe: 'Demeyere Atlantis 7 Stielkasserolle 20 cm',
    shortDescription: 'Premium-Stielkasserolle mit InductoSeal® Kupferboden und Silvinox® Finish — 3,0 L',
    descriptionDe: `Die Demeyere Atlantis 7 Stielkasserolle (20 cm) gehört zur unangefochtenen Spitzenklasse. Dank der TriplInduc®-Technologie ist diese Kasserolle auf Induktionsherden bis zu 30% effizienter als Standardgeschirr. Der patentierte InductoSeal®-Boden enthält eine integrierte Kupferscheibe für sofortige Wärmeleitung und optimale Temperaturkontrolle.

**Merkmale:**
- InductoSeal®-Boden mit echtem Kupferkern für unschlagbare Temperaturkontrolle
- TriplInduc®-Boden: optimiert für überragenden Wirkungsgrad auf Induktion
- Silvinox® Oberflächenbehandlung: Edelstahl bleibt silberglänzend, leicht zu reinigen und fingerabdruckresistent
- 7-Schicht-Material (7-Ply) bis zum Rand für gleichmäßige Hitzeverteilung
- Massive, geschweißte Edelstahlgriffe ohne Nieten (hygienisch)
- Hergestellt in Belgien mit 30 Jahren Garantie

Die absolute "Rolls-Royce" unter den Induktionskasserollen für anspruchsvolle Gourmetküchen.`,
    price: 249.00,
    oldPrice: 299.00,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 mit Kupfer-InductoSeal-Boden',
    dimensions: 'Ø 20 cm, Höhe 10 cm, 3,0 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['30 Jahre Garantie', 'InductoSeal®', 'Silvinox®', 'Made in Belgium'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Demeyere Atlantis 7 Stielkasserolle 20 cm — Kupferkern | NOVA INDUKT',
    metaDescription: 'Demeyere Atlantis 7 Stielkasserolle 20 cm mit InductoSeal-Kupferboden und TriplInduc. Höchste Induktionseffizienz. 30 Jahre Garantie bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Demeyere Atlantis 7 — Stielkasserolle 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'zwilling-plus-stielkasserolle-18cm',
    supplierSku: 'ZWI-PLUS-SK18',
    sortOrder: 9,
    nameDe: 'Zwilling Plus Stielkasserolle 18 cm mit Deckel',
    shortDescription: '3-Ply Edelstahl-Kasserolle mit Sigma Classic Sandwichboden und Glasdeckel — 2,0 L',
    descriptionDe: `Die Zwilling Plus Stielkasserolle (18 cm) bietet zuverlässige Qualität im eleganten Design. Ausgestattet mit dem Sigma Classic Sandwichboden mit starkem Aluminiumkern bietet sie eine gleichmäßige Wärmeverteilung und schnelle Reaktionszeit auf Induktionsplatten.

**Merkmale:**
- 3-Ply-Konstruktion: Edelstahl-Aluminium-Edelstahl für optimale Hitzeverteilung
- Sigma Classic Sandwichboden: starker Aluminiumkern für optimale Hitzespeicherung
- Hochwertiger Edelstahl 18/10, elegant satiniert
- Glasdeckel für Sichtkochen
- Ergonomisch geformter Edelstahl-Stielgriff
- Integrierte Füllskala im Kasserolleninneren
- Spülmaschinengeeignet und backofenfest

Qualität und Langlebigkeit im klassischen Design zum hervorragenden Preis-Leistungs-Verhältnis.`,
    price: 59.99,
    oldPrice: 79.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 18 cm, Höhe 9 cm, 2,0 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.2,
    badges: ['Sigma Classic Boden', 'Glasdeckel', '3-Ply'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Plus Stielkasserolle 18 cm | NOVA INDUKT',
    metaDescription: 'Zwilling Plus Stielkasserolle 18 cm (2,0 L) mit Sigma Classic Sandwichboden. 3-Ply Edelstahl 18/10, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Zwilling Plus — Stielkasserolle 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'silit-silargan-modesto-stielkasserolle-16cm',
    supplierSku: 'SIL-MOD-SK16',
    sortOrder: 10,
    nameDe: 'Silit Silargan Modesto Stielkasserolle 16 cm',
    shortDescription: 'Funktionskeramik Silargan® — extrem robust, schneidfest und nickelfrei, 1,4 L',
    descriptionDe: `Die Silit Silargan Modesto Stielkasserolle (16 cm) besticht durch die innovative Funktionskeramik Silargan®. Die extrem harte, porenfreie und kratzfeste Oberfläche ist nickelfrei und geschmacksneutral — perfekt für Allergiker sowie das aromaschonende Zubereiten von Soßen, Suppen und Milchspeisen auf Induktionsherden.

**Merkmale:**
- Silargan® Funktionskeramik: unverwüstlich, kratzfest, nickelfrei und antibakteriell
- Durchgehender Stahlkern für hervorragende Wärmeleitung bis in die Wände
- Silitherm®-Allherdboden: perfekt plan und optimal für Induktion
- Breiter Schüttrand für kleckerfreies Ausgießen
- Robuster Edelstahl-Stielgriff
- Hergestellt in Deutschland (Made in Germany)

Die perfekte Wahl für empfindliche Speisen und anspruchsvolle Allergiker, die keine Kompromisse eingehen wollen.`,
    price: 54.99,
    oldPrice: 69.99,
    brand: 'Silit',
    material: 'Silargan® Funktionskeramik',
    dimensions: 'Ø 16 cm, Höhe 8 cm, 1,4 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.9,
    badges: ['Made in Germany', 'Silargan®', 'Nickelfrei'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Silit Silargan Modesto Stielkasserolle 16 cm | NOVA INDUKT',
    metaDescription: 'Silit Silargan Modesto Stielkasserolle 16 cm (1,4 L) aus Silargan-Funktionskeramik. Nickelfrei, kratzfest, induktionsgeeignet. Hergestellt in Deutschland.',
    categorySlug: 'induktionstoepfe',
    folder: 'Silit Silargan Modesto — Stielkasserolle 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie : Kasserollen / Stielkasserollen (10 Produits)')
  console.log('─'.repeat(70))

  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]))

  let created = 0
  let updated = 0
  let errors = 0

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug)
    if (!categoryId) {
      console.error(`  ❌ Catégorie introuvable : ${p.categorySlug}`)
      errors++
      continue
    }

    const imageData = imgs(p.folder, p.imageFiles)

    try {
      const existing = await prisma.product.findUnique({ where: { slug: p.slug } })

      if (existing) {
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
            weightKg: p.weightKg ?? null,
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
        await prisma.productImage.deleteMany({ where: { productId: existing.id } })
        await prisma.productImage.createMany({
          data: imageData.map((img) => ({ ...img, productId: existing.id })),
        })
        updated++
        console.log(`  ↻  [${updated + created}/${products.length}] MIS À JOUR : ${p.nameDe.substring(0, 60)}`)
      } else {
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
            weightKg: p.weightKg ?? null,
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
            images: { create: imageData },
          },
        })
        created++
        console.log(`  ✓  [${updated + created}/${products.length}] CRÉÉ : ${p.nameDe.substring(0, 60)}`)
      }
    } catch (err: unknown) {
      errors++
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗  ERREUR : ${p.nameDe.substring(0, 40)} — ${msg}`)
    }
  }

  console.log('\n' + '═'.repeat(70))
  console.log('📊 RÉSUMÉ BATCH KASSEROLLEN')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Catégorie Kasserollen terminée avec succès ! 10/10 produits en base.')
  } else {
    console.log(`\n⚠️  ${errors} erreur(s) — vérifiez les logs.`)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
