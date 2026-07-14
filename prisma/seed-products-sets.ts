/**
 * NOVA INDUKT — Seed Catégorie 3 : Premium Sets (10 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-sets.ts
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
    slug: 'fissler-original-profi-collection-topfset-5tlg',
    supplierSku: 'FIS-OPC-SET5',
    sortOrder: 1,
    nameDe: 'Fissler Original Profi Collection Topf-Set 5-teilig',
    shortDescription: 'Absolutes Profi-Edelstahlset mit CookStar® Allherdboden — Made in Germany',
    descriptionDe: `Das Fissler Original Profi Collection Topf-Set 5-teilig ist das ultimative Kochgeschirr für höchste Ansprüche in der Küche. Ursprünglich von Profis für Profis entwickelt, begeistert dieses Set durch seine extrem robuste Qualität aus mattiertem Edelstahl 18/10 und seine unübertroffene Hitzeverteilung auf Induktionsfeldern.

**Set-Inhalt:**
- 1x Kochtopf Ø 16 cm mit Deckel
- 1x Kochtopf Ø 20 cm mit Deckel
- 1x Kochtopf Ø 24 cm mit Deckel
- 1x Servierpfanne Ø 24 cm mit Deckel
- 1x Stielkasserolle Ø 16 cm (ohne Deckel)

**Merkmale:**
- CookStar® Allherdboden (7,2 mm) für perfekte Wärmeverteilung und maximale Induktionseffizienz
- Kaltmetallgriffe: bleiben beim Kochen auf dem Herd spürbar kühl
- Kondensat-Plus-Funktion: Deckelwölbung lässt Dampf zurück in den Topf tropfen für saftigeres Kochen
- Messskala & extra breiter Schüttrand
- Backofengeeignet bis 230 °C
- Hergestellt in Deutschland (Made in Germany)

Das langlebigste Set auf dem Markt, das über Generationen hinweg Freude bereitet.`,
    price: 459.00,
    oldPrice: 799.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10 / Glas',
    dimensions: '5-teiliges Set, Gewicht ca. 11 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'CookStar®', 'Profi-Referenz', 'Kaltmetallgriffe'],
    rating: 4.9,
    reviewCount: 0,
    metaTitle: 'Fissler Original Profi Collection Topf-Set 5-tlg | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Topf-Set 5-teilig für Induktion. Inox 18/10, CookStar-Boden, Kaltmetallgriffe. Premium-Qualität Made in Germany.',
    categorySlug: 'induktions-sets',
    folder: 'Fissler Original Profi Collection — Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'fissler-intensa-topfset-5tlg',
    supplierSku: 'FIS-INTENSA-SET5-P',
    sortOrder: 2,
    nameDe: 'Fissler Intensa Kochtopf-Set 5-teilig',
    shortDescription: 'Stiftung Warentest Testsieger — wärmeisolierte Griffe & integrierte Deckelablage',
    descriptionDe: `Das Fissler Intensa Topfset holte den verdienten 1. Platz bei Stiftung Warentest (01/2017) mit der Note 1,9 (sehr gut). Neben der herausragenden Induktionsleistung besticht das Set durch clevere Detaillösungen für mehr Komfort beim Kochen.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm (ca. 3,2 L) mit Metalldeckel
- 1x Kochtopf Ø 16 cm (ca. 1,9 L) mit Metalldeckel
- 1x Kochtopf Ø 20 cm (ca. 2,3 L) mit Metalldeckel
- 1x Kochtopf Ø 24 cm (ca. 5,1 L) mit Metalldeckel
- 1x Stielkasserolle Ø 16 cm (ca. 1,4 L) ohne Deckel

**Merkmale:**
- Integrierte Deckelablage: Der Deckel kann einfach am Topfgriff eingehängt werden (kein Ablegen auf der Arbeitsplatte nötig)
- Wärmeisolierte Kunststoffgriffe: bleiben dauerhaft kühl
- Integrierte Abgießfunktion im Deckel für einfaches Abschütten ohne Sieb
- Konische Form: Töpfe gleicher Größe sind platzsparend ineinander stapelbar
- CookStar® Allherdboden für maximale Energieeffizienz auf Induktion
- Hergestellt in Deutschland (Made in Germany)

Der innovative Testsieger für maximale Bequemlichkeit und Effizienz beim Kochen.`,
    price: 299.00,
    oldPrice: 619.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10 / Kunststoff',
    dimensions: '5-teiliges Set, Gewicht ca. 8,5 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Testsieger Stiftung Warentest', 'Made in Germany', 'Ineinander stapelbar'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Fissler Intensa Kochtopf-Set 5-teilig | NOVA INDUKT',
    metaDescription: 'Fissler Intensa Topfset 5-teilig für Induktion. Note 1,9 Stiftung Warentest. Wärmeisolierte Griffe, Deckelablage. Made in Germany bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Fissler Intensa — Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'wmf-function-4-topfset-5tlg',
    supplierSku: 'WMF-FUNC4-SET5-P',
    sortOrder: 3,
    nameDe: 'WMF Function 4 Topf-Vorteils-Set 5-teilig',
    shortDescription: 'Cromargan® Edelstahl mit innovativem 4-Positionen-Glasdeckel',
    descriptionDe: `Das WMF Function 4 Topfset kombiniert höchste Qualität mit herausragender Funktionalität. Die hitzebeständigen Silikonringe an den Glasdeckeln bieten 4 einstellbare Ausgießpositionen — ideal zum Abgießen von Nudeln, Reis oder zum Ausdampfen, ohne den Deckel abnehmen zu müssen.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm (ca. 2,5 L) mit Deckel
- 1x Fleischtopf Ø 16 cm (ca. 1,9 L) mit Deckel
- 1x Fleischtopf Ø 20 cm (ca. 3,4 L) with Deckel
- 1x Fleischtopf Ø 24 cm (ca. 5,7 L) with Deckel
- 1x Stielkasserolle Ø 16 cm (ca. 1,4 L) ohne Deckel

**Merkmale:**
- Cromargan® Edelstahl Rostfrei 18/10, hochglanzpoliert
- Deckel mit 4 Funktionen zum kontrollierten Abgießen und Silikonring
- TransTherm®-Allherdboden: schnelle Hitzeaufnahme und hervorragende Wärmespeicherung auf Induktion
- Hohlgriffe für minimierte Wärmeübertragung
- Praktische Füllskala
- Hergestellt in Deutschland (Made in Germany)

Die perfekte Kombination aus durchdachtem Design und klassischer deutscher Markenqualität.`,
    price: 309.00,
    oldPrice: 579.00,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10 / Silikon / Glas',
    dimensions: '5-teiliges Set, Gewicht ca. 8,4 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Function 4 Deckel', 'Cromargan®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Topf-Vorteils-Set 5-tlg | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Topfset 5-teilig. Cromargan-Edelstahl 18/10, innovative 4-Positionen-Couvercles, TransTherm-Boden. Induktionsgeeignet bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'WMF Function 4 — Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'wmf-gourmet-plus-topfset-5tlg',
    supplierSku: 'WMF-GOURMET-SET5',
    sortOrder: 4,
    nameDe: 'WMF Gourmet Plus Kochtopf-Set 5-teilig',
    shortDescription: 'Premium-Set aus mattiertem Cromargan® Edelstahl mit schweren Metalldeckeln',
    descriptionDe: `Das WMF Gourmet Plus Kochtopf-Set besticht durch sein zeitloses, matt-satinierte Design und seine kompromisslose Profilinie. Hergestellt aus robustem Cromargan® Edelstahl 18/10 ist es unempfindlich gegen Fingerabdrücke und extrem verschleißfest.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm mit Metalldeckel
- 1x Fleischtopf Ø 16 cm mit Metalldeckel
- 1x Fleischtopf Ø 20 cm mit Metalldeckel
- 1x Fleischtopf Ø 24 cm mit Metalldeckel
- 1x Stielkasserolle Ø 16 cm (ohne Deckel)

**Merkmale:**
- Cromargan® Edelstahl Rostfrei 18/10 in edler matter Ausführung
- Schwere Metalldeckel mit Entlüftungsöffnung (verhindert Klappern und unkontrollierten Dampfaustritt)
- TransTherm®-Allherdboden für exzellente Wärmeverteilung und -speicherung auf Induktionskochfeldern
- Hohlgriffe, die beim Kochen auf dem Herd nicht heiß werden
- Integrierte Innenskalierung & extrabreiter Schüttrand
- Hergestellt in Deutschland (Made in Germany)

Die Wahl für Ästheten, die ein elegantes, mattiertes Set in Profiqualität suchen.`,
    price: 299.00,
    oldPrice: 579.00,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10 (mattiert)',
    dimensions: '5-teiliges Set, Gewicht ca. 8,8 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Edles Matt-Finish', 'Schwere Metalldeckel'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Gourmet Plus Kochtopf-Set 5-teilig | NOVA INDUKT',
    metaDescription: 'WMF Gourmet Plus Topfset 5-teilig. Cromargan 18/10 mattiert, schwere Metalldeckel, TransTherm-Boden. Induktionsoptimiert. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'WMF Gourmet Plus — Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'demeyere-atlantis-7-basis-set-5tlg',
    supplierSku: 'DEM-ATL-SET5',
    sortOrder: 5,
    nameDe: 'Demeyere Atlantis 7 Basis-Set 5-teilig',
    shortDescription: 'Die absolute Spitzenklasse — 7-Schicht-Material, Silvinox® & Kupferboden',
    descriptionDe: `Das Demeyere Atlantis 7 Basis-Set 5-teilig ist das luxuriöseste Kochgeschirr-Set auf dem Markt. Dank der exklusiven TriplInduc®-Technologie ist dieses Set auf Induktionsherden bis zu 30% effizienter als Standard-Kochgeschirr. Der Boden enthält eine massive Kupferscheibe für unmittelbare Hitzekontrolle.

**Set-Inhalt:**
- 1x Kochtopf Ø 18 cm (2,2 L) mit Deckel
- 1x Kochtopf Ø 24 cm (5,2 L) mit Deckel
- 1x Sauteuse Ø 20 cm (2,0 L) ohne Deckel
- 1x Stieltopf Ø 16 cm (1,5 L) ohne Deckel
- 1x Demeyere Proline Bratpfanne Ø 28 cm (Spitzenklasse-Pfanne)

**Merkmale:**
- InductoSeal®-Boden mit Kupferscheibe für kompromisslose Wärmeleitung
- Silvinox® Oberflächenbehandlung: Edelstahl bleibt silbrig glänzend und leicht zu reinigen
- 7-Schicht-Material (7-Ply) bis zum Rand bei Sauteuse und Pfanne für perfekte Hitzeverteilung
- Geschweißte Edelstahlgriffe ohne Nieten (extrem hygienisch)
- Hergestellt in Belgien mit 30 Jahren Garantie

Die ultimative Investition für absolute Perfektion auf Ihrem Induktionskochfeld.`,
    price: 312.00,
    oldPrice: 455.00,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 mit Kupfer-InductoSeal-Boden',
    dimensions: '5-teiliges Luxus-Set, Gewicht ca. 11,5 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['30 Jahre Garantie', 'Kupferkern', 'Silvinox®', 'Made in Belgium'],
    rating: 4.9,
    reviewCount: 0,
    metaTitle: 'Demeyere Atlantis 7 Basis-Set 5-teilig | NOVA INDUKT',
    metaDescription: 'Demeyere Atlantis 7 Basis-Set 5-teilig mit Kupferkern, TriplInduc-Technologie und Proline-Pfanne. 30 Jahre Garantie. Luxusklasse bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Demeyere Atlantis 7 — Basis-Set 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'le-creuset-3ply-plus-topfset-5tlg',
    supplierSku: 'LEC-3PLY-SET5',
    sortOrder: 6,
    nameDe: 'Le Creuset 3-ply PLUS Topfset 5-teilig',
    shortDescription: 'Hochwertiges 3-Schicht-Mehrschichtmaterial vom Boden bis zum Rand — 30 Jahre Garantie',
    descriptionDe: `Das Le Creuset 3-ply PLUS Topfset 5-teilig zeichnet sich durch seine durchgehende Mehrschicht-Technologie aus. Anders als bei Töpfen mit aufgesetztem Boden zieht sich das 3-Schicht-Material (Edelstahl-Aluminium-Edelstahl) vom Boden bis in die Wände hoch. Das sorgt für eine extrem gleichmäßige Hitzeverteilung und verhindert das Anbrennen in den Ecken.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm (ca. 3,0 L) mit Deckel
- 1x Fleischtopf Ø 18 cm (ca. 2,3 L) mit Deckel
- 1x Fleischtopf Ø 20 cm (ca. 4,0 L) mit Deckel
- 1x Fleischtopf Ø 24 cm (ca. 6,0 L) mit Deckel
- 1x Stielkasserolle Ø 16 cm (ca. 1,9 L) ohne Deckel

**Merkmale:**
- 3-ply Mehrschichtmaterial für perfekte Rundum-Wärmeleitung bis zum oberen Rand
- Hochglanzpolierter Premium-Edelstahl 18/10
- Umlaufender Schüttrand für kleckerfreies Ausgießen
- Praktische Messskala an der Innenseite
- Robuste, genietete Kaltmetallgriffe
- Ofenfest bis 260 °C
- 30 Jahre Herstellergarantie

Herausragende Kochleistung und zeitlose Eleganz mit der Garantie von Le Creuset.`,
    price: 500.00,
    oldPrice: 805.00,
    brand: 'Le Creuset',
    material: '3-ply Mehrschichtmaterial (Edelstahl/Aluminium/Edelstahl)',
    dimensions: '5-teiliges Premium-Set, Gewicht ca. 10,4 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['30 Jahre Garantie', '3-ply Mehrschicht', 'Ofenfest bis 260°C'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Le Creuset 3-ply PLUS Topfset 5-teilig | NOVA INDUKT',
    metaDescription: 'Le Creuset 3-ply PLUS Topfset 5-teilig für Induktion. Durchgehendes Dreischichtmaterial, exzellente Wärmeverteilung, 30 Jahre Garantie chez NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Le Creuset 3-ply PLUS — Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'zwilling-flow-topfset-5tlg',
    supplierSku: 'ZWI-FLOW-SET5',
    sortOrder: 7,
    nameDe: 'Zwilling Flow Kochtopfset 5-teilig',
    shortDescription: 'Modernes Design mit Sigma Classic Sandwichboden und Glasdeckeln',
    descriptionDe: `Das Zwilling Flow Kochtopfset besticht durch sein modernes, geschwungenes Design mit elegant mattiertem Satin-Finish. Der Sigma Classic Sandwichboden mit starkem Aluminiumkern sorgt für eine schnelle Hitzeaufnahme und perfekte Speicherung auf modernen Induktionsherden.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm (ca. 3,0 L) mit Glasdeckel
- 1x Kochtopf Ø 16 cm (ca. 1,8 L) mit Glasdeckel
- 1x Kochtopf Ø 20 cm (ca. 4,0 L) mit Glasdeckel
- 1x Kochtopf Ø 24 cm (ca. 6,0 L) mit Glasdeckel
- 1x Stieltopf Ø 16 cm (ca. 1,5 L) ohne Deckel

**Merkmale:**
- SIGMA Classic Boden: Aluminiumkern für ideale Wärmeverteilung und schnelle Reaktion
- Hochwertiger Edelstahl 18/10 mit pflegeleichtem Satin-Finish
- Passgenaue Güteglasdeckel mit Silikondichtung für wasserarmes und energiesparendes Kochen
- Tropffreier Schüttrand & integrierte Füllskala
- Backofenfest bis 200 °C (mit Deckel bis 180 °C)

Ein leichtes, schnelles und sehr schönes Allround-Set für das tägliche Kochen.`,
    price: 136.79,
    oldPrice: 199.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10 / Glas',
    dimensions: '5-teiliges Designset, Gewicht ca. 6 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Elegantes Satin-Finish', 'Güteglasdeckel', 'Schnelle Erwärmung'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Flow Kochtopfset 5-teilig | NOVA INDUKT',
    metaDescription: 'Zwilling Flow Topfset 5-teilig. Satinierter Edelstahl 18/10, Sigma Classic Sandwichboden, Glasdeckel. Induktionsgeeignet bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Zwilling Flow — Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'silit-toskana-topfset-5tlg',
    supplierSku: 'SIL-TOSKANA-SET5',
    sortOrder: 8,
    nameDe: 'Silit Toskana Topfset 5-teilig',
    shortDescription: 'Hervorragendes Preis-Leistungs-Verhältnis — gleichmäßige Wärmeverteilung, 5-tlg',
    descriptionDe: `Das Silit Toskana Topfset 5-teilig ist die ideale Wahl für preisbewusste Köche, die nicht auf bewährte deutsche Markenqualität verzichten wollen. Im FAZ-Pfannentest (05/2026) wurde die hervorragende, gleichmäßige Hitzeverteilung des Silitherm®-Bodens ausdrücklich gelobt.

**Set-Inhalt:**
- 1x Bratentopf Ø 16 cm mit Glasdeckel
- 1x Bratentopf Ø 20 cm mit Glasdeckel
- 1x Fleischtopf Ø 16 cm mit Glasdeckel
- 1x Fleischtopf Ø 20 cm mit Glasdeckel
- 1x Stielkasserolle Ø 16 cm (ohne Deckel)

**Merkmale:**
- Silitherm®-Allherdboden: extrem gleichmäßige Wärmeverteilung (max. 1 °C Abweichung im Topfboden)
- Hochwertiger Edelstahl 18/10 mit teilmattiertem Finish
- Sichtkochdeckel aus hitzebeständigem Güteglas
- Breiter Schüttrand für sauberes Ausgießen
- Konisches Stapelsystem für platzsparendes Verstauen
- Backofengeeignet bis 180 °C

Das unschlagbare Preis-Leistungs-Verhältnis für den täglichen Induktionseinsatz.`,
    price: 94.73,
    oldPrice: 219.00,
    brand: 'Silit',
    material: 'Edelstahl 18/10 / Glas',
    dimensions: '5-teiliges Set, Gewicht ca. 5,5 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Silitherm® Boden', 'Gleichmäßige Hitze', 'Preistipp FAZ'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'Silit Toskana Topfset 5-teilig | NOVA INDUKT',
    metaDescription: 'Silit Toskana Topfset 5-teilig mit Silitherm-Boden. Hochwertiger Edelstahl, Glasdeckel, Preistipp im FAZ-Vergleich. Induktionsgeeignet bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Silit Toskana — Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'roesle-elegance-globe-topfset-10tlg',
    supplierSku: 'ROS-ELEG-GLOBE-10',
    sortOrder: 9,
    nameDe: 'Rösle Elegance Globe Topfset 10-teilig',
    shortDescription: 'Großes Familien-Komplettset mit antihaftbeschichteten Pfannen & Dämpfeinsatz',
    descriptionDe: `Das Rösle Elegance Globe Topfset 10-teilig bietet eine hervorragende und extrem vielseitige Komplettausstattung für Familienküchen. Neben den klassischen Töpfen enthält das Set zwei antihaftbeschichtete Bratpfannen und einen praktischen Dämpfeinsatz für schonendes Gemüse-Dämpfen.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm mit Glasdeckel
- 1x Kochtopf Ø 16 cm mit Glasdeckel
- 1x Kochtopf Ø 20 cm mit Glasdeckel
- 1x Kochtopf Ø 24 cm mit Glasdeckel
- 1x Stielkasserolle Ø 16 cm (ohne Deckel)
- 1x Milchtopf Ø 14 cm
- 1x Bratpfanne Ø 24 cm (antiadhésive)
- 1x Bratpfanne Ø 28 cm (antiadhésive)
- 1x Dämpfeinsatz Ø 20 cm

**Merkmale:**
- Kapselboden mit Aluminiumkern für schnelle Wärmeübertragung auf Induktion
- Hochwertiger Edelstahl 18/10, hochglanzpoliert
- Pfannen mit langlebiger PTFE-Antihaftbeschichtung (PFOA-frei)
- Praktische Innenskalierung, ergonomische Griffe & breiter Schüttrand
- Güteglasdeckel bis 180 °C hitzebeständig

Das perfekte All-in-One-Set für die anspruchsvolle Familienküche.`,
    price: 158.00,
    oldPrice: 499.00,
    brand: 'Rösle',
    material: 'Edelstahl 18/10 / Glas / Antihaftbeschichtung',
    dimensions: '10-teiliges Komplettset, Gewicht ca. 12,5 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['10-teilig', 'Inklusive Pfannen', 'Mit Dämpfeinsatz'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Rösle Elegance Globe Topfset 10-teilig | NOVA INDUKT',
    metaDescription: 'Rösle Elegance Globe 10-teiliges Kochgeschirr-Set mit Töpfen, Pfannen und Dämpfer. Induktionsgeeigneter Edelstahl. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Rösle Elegance Globe — Topfset 10-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'tefal-duetto-topfset-9tlg',
    supplierSku: 'TEF-DUETTO-SET9',
    sortOrder: 10,
    nameDe: 'Tefal Duetto Topfset 9-teilig',
    shortDescription: 'Praktisches Edelstahl-Set mit integrierten Siebdeckeln zum Abgießen',
    descriptionDe: `Das Tefal Duetto Topfset 9-teilig wurde speziell entwickelt, um das tägliche Kochen zu vereinfachen. Die Glasdeckel verfügen über einen extrabreiten Rand mit integrierten Sieblöchern in zwei verschiedenen Größen — ideal zum sauberen Abgießen von Nudeln oder Reis direkt aus dem Topf.

**Set-Inhalt:**
- 1x Kochtopf Ø 18 cm avec Siebdeckel
- 1x Kochtopf Ø 20 cm avec Siebdeckel
- 1x Kochtopf Ø 22 cm avec Siebdeckel
- 1x Kochtopf Ø 24 cm avec Siebdeckel
- 1x Stielkasserolle Ø 16 cm (ohne Deckel)

**Merkmale:**
- Hochwertiger Edelstahl 18/10 mit hochglanzpoliertem Finish
- Siebdeckel: Löcher im Deckelrand erlauben sicheres Abschütten ohne zusätzliches Sieb
- Praktische Ausgießschnäbel beidseitig
- Gut lesbare Messskala im Inneren
- Dicker Induktions-Kapselboden gegen Deformation und für beste Hitzeübertragung
- Backofenfest bis 260 °C (Glasdeckel bis 180 °C)

Das intelligenteste Einstiegsset für das komfortable Alltags-Kochen.`,
    price: 119.99,
    oldPrice: 145.00,
    brand: 'Tefal',
    material: 'Edelstahl 18/10 / Glas',
    dimensions: '9-teiliges Abgieß-Set, Gewicht ca. 8,2 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Siebdeckel (Abgießhilfe)', '9-teilig', 'Preistipp'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Tefal Duetto Topfset 9-teilig | NOVA INDUKT',
    metaDescription: 'Tefal Duetto Topfset 9-teilig für Induktion. Edelstahl 18/10, Siebdeckel zum Abgießen. Praktisch und preiswert bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Tefal Duetto — Topfset 9-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie 3 : Premium Sets (10 Produits)')
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
  console.log('📊 RÉSUMÉ BATCH SETS')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Catégorie Premium Sets terminée avec succès ! 10/10 produits en base.')
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
