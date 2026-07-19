/**
 * NOVA INDUKT — Seed Catégorie 2 : Induktionstöpfe (10 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-toepfe.ts
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
  // ══════════════════════════════════════════════════════════════
  // CASSEROLES HAUTES ( Fleischtöpfe / Kochtöpfe )
  // ══════════════════════════════════════════════════════════════
  {
    slug: 'fissler-original-profi-collection-kochtopf-24cm',
    supplierSku: 'FIS-OPC-KT24',
    sortOrder: 1,
    nameDe: 'Fissler Original Profi Collection Kochtopf hoch 24 cm',
    shortDescription: 'Profikochtopf aus massivem Edelstahl mit CookStar® Allherdboden — 6,3 L',
    descriptionDe: `Der Fissler Original Profi Collection Kochtopf (hoch, 24 cm) ist die absolute Referenz in deutschen Profiküchen. Hergestellt aus extrem dickwandigem, mattiertem Edelstahl 18/10, ist dieser Topf extrem robust, langlebig und perfekt auf moderne Induktionskochfelder abgestimmt.

**Merkmale:**
- CookStar® Allherdboden (7,2 mm) für perfekte Planstabilität und maximale Energieeffizienz auf Induktion
- Hochwertiger, schwerer Edelstahl 18/10 (mattiert) — kratz- und wasserfleckenresistent
- Kaltmetallgriffe: bleiben auf dem Herd spürbar kühler
- Kondensat-Plus-Funktion im Metalldeckel für saftigeres Kochgut
- Messskala an der Topfinnenseite & extra breiter Schüttrand
- Backofengeeignet bis 230 °C
- Hergestellt in Deutschland (Made in Germany)

Indestructible, lourd et thermiquement parfait — l'excellence absolue de Fissler.`,
    price: 199.00,
    oldPrice: 220.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10 (unbeschichtet)',
    dimensions: 'Ø 24 cm, Höhe 14 cm, 6,3 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.2,
    badges: ['Made in Germany', 'CookStar®', 'Kaltmetallgriffe'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Fissler Original Profi Collection Kochtopf 24 cm | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Kochtopf hoch 24 cm (6,3 L). Inox 18/10, CookStar-Boden, induktionsgeeignet. Hergestellt in Deutschland bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Fissler Original Profi Collection — Kochtopf 24 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'demeyere-atlantis-7-kochtopf-20cm',
    supplierSku: 'DEM-ATL-20',
    sortOrder: 2,
    nameDe: 'Demeyere Atlantis 7 Kochtopf 20 cm',
    shortDescription: 'Premium-Kochtopf mit InductoSeal® Kupferboden & Silvinox® Finish — 3,3 L',
    descriptionDe: `Der Demeyere Atlantis 7 Kochtopf gehört zur unangefochtenen Spitzenklasse. Dank der TriplInduc®-Technologie ist dieser Topf auf Induktionsherden bis zu 30% effizienter als Standardgeschirr. Der patentierte InductoSeal®-Boden enthält eine integrierte Kupferscheibe für sofortige Wärmeleitung.

**Merkmale:**
- InductoSeal®-Boden mit echtem Kupferkern für unschlagbare Temperaturkontrolle
- TriplInduc®-Boden: optimiert für überragenden Wirkungsgrad auf Induktion
- Silvinox® Oberflächenbehandlung: Edelstahl bleibt silberglänzend, leicht zu reinigen und fingerabdruckresistent
- 7-Schicht-Material (7-Ply) bis zum Rand für gleichmäßige Hitzeverteilung
- Massive, geschweißte Edelstahlgriffe ohne Nieten (hygienisch)
- Hergestellt in Belgien mit 30 Jahren Garantie

Die absolute "Rolls-Royce" unter den Induktionstöpfen für anspruchsvolle Gourmetküchen.`,
    price: 229.00,
    oldPrice: 260.00,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 mit Kupfer-InductoSeal-Boden',
    dimensions: 'Ø 20 cm, Höhe 10,5 cm, 3,3 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['30 Jahre Garantie', 'Kupferkern', 'TriplInduc®', 'Silvinox®'],
    rating: 4.9,
    reviewCount: 0,
    metaTitle: 'Demeyere Atlantis 7 Kochtopf 20 cm — Kupferkern | NOVA INDUKT',
    metaDescription: 'Demeyere Atlantis 7 Kochtopf 20 cm mit InductoSeal-Kupferboden und TriplInduc. Höchste Induktionseffizienz. 30 Jahre Garantie bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Demeyere Atlantis 7 — Kochtopf 20 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'zwilling-twin-classic-kochtopf-20cm',
    supplierSku: 'ZWI-TWIN-20',
    sortOrder: 3,
    nameDe: 'Zwilling Twin Classic Kochtopf 20 cm',
    shortDescription: 'Zuverlässiger Edelstahl-Kochtopf mit Sigma Classic Sandwichboden — 3,5 L',
    descriptionDe: `Der Zwilling Twin Classic Kochtopf ist der ideale Allrounder für die qualitätsbewusste Küche. Ausgestattet mit dem bewährten Sigma Classic Sandwichboden mit starkem Aluminiumkern bietet er eine gleichmäßige Wärmeverteilung und schnelle Reaktionszeit auf Induktionsplatten.

**Merkmale:**
- SIGMA Classic Sandwichboden: Aluminiumkern für optimale Hitzespeicherung und -verteilung
- Hochwertiger Edelstahl 18/10, elegant satiniert
- Integrierte Füllskala im Topfinneren
- Ergonomisch geformte Edelstahlgriffe (bleiben angenehm kühl)
- Präziser, tropffreier Schüttrand
- Spülmaschinengeeignet und backofenfest

Qualität und Langlebigkeit im klassischen Design zum hervorragenden Preis-Leistungs-Verhältnis.`,
    price: 44.90,
    oldPrice: 54.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 20 cm, 3,5 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['Classic Design', 'Messskala'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Twin Classic Kochtopf 20 cm | NOVA INDUKT',
    metaDescription: 'Zwilling Twin Classic Kochtopf 20 cm (3,5 L) mit Sigma Classic Sandwichboden. Langlebiger Edelstahl 18/10, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Zwilling Twin Classic — Kochtopf 20 cm  Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'silit-silargan-elegance-line-stielkasserolle-16cm',
    supplierSku: 'SIL-ELEG-SK16',
    sortOrder: 4,
    nameDe: 'Silit Elegance Line Silargan Stielkasserolle 16 cm',
    shortDescription: 'Funktionskeramik Silargan® — extrem robust, schneidfest und nickelfrei, 1,4 L',
    descriptionDe: `Die Silit Elegance Line Stielkasserolle besticht durch die innovative Funktionskeramik Silargan®. Die extrem harte, porenfreie und kratzfeste Oberfläche ist nickelfrei und geschmacksneutral — perfekt für Allergiker sowie das aromaschonende Zubereiten von Soßen, Suppen und Milchspeisen.

**Merkmale:**
- Silargan® Funktionskeramik: unverwüstlich, kratzfest, nickelfrei und antibakteriell
- Durchgehender Stahlkern für hervorragende Wärmeleitung bis in die Wände
- Silitherm®-Allherdboden: perfekt plan und optimal für Induktion
- Breiter Schüttrand für kleckerfreies Ausgießen
- Robuster Edelstahl-Stielgriff
- Hergestellt in Deutschland (Made in Germany)

Die perfekte Wahl für empfindliche Speisen und anspruchsvolle Allergiker, die keine Kompromisse eingehen wollen.`,
    price: 69.95,
    oldPrice: 79.99,
    brand: 'Silit',
    material: 'Silargan® Funktionskeramik mit Stahlkern',
    dimensions: 'Ø 16 cm, 1,4 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.2,
    badges: ['Made in Germany', 'Silargan® Keramik', 'Nickelfrei (Allergiker geeignet)'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Silit Silargan Elegance Line Stielkasserolle 16 cm | NOVA INDUKT',
    metaDescription: 'Silit Elegance Line 16 cm Stielkasserolle aus Silargan-Funktionskeramik. Nickelfrei, kratzfest, induktionsgeeignet. Hergestellt in Deutschland.',
    categorySlug: 'induktionstoepfe',
    folder: 'Silit Silargan Elegance Line — Stielkasserolle 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // MARMITES & SAUTEUSES ( Bratentöpfe / Sauteusen )
  // ══════════════════════════════════════════════════════════════
  {
    slug: 'wmf-function-4-bratentopf-20cm',
    supplierSku: 'WMF-FUNC4-BT20',
    sortOrder: 5,
    nameDe: 'WMF Function 4 Bratentopf 20 cm',
    shortDescription: 'Cromargan® Bratentopf mit innovativem 4-Positionen-Glasdeckel — 2,5 L',
    descriptionDe: `Der WMF Function 4 Bratentopf kombiniert die exzellenten Kocheigenschaften von Cromargan® Edelstahl mit einem genialen Multifunktionsdeckel. Der Deckel besitzt einen roten Silikonring mit 4 verschiedenen Abgießfunktionen, sodass Flüssigkeiten kontrolliert abgegossen werden können, ohne den Deckel abzunehmen.

**Merkmale:**
- Cromargan® Edelstahl Rostfrei 18/10 — unempfindlich, hygienisch und geschmacksneutral
- TransTherm®-Allherdboden: dicker Aluminiumkern, gekapselt in Edelstahl, für beste Induktionseigenschaften
- Function 4 Deckel: 4 Positionen zum Ausgießen (geschlossen, weit offen, feine Sieblöcher, grobe Sieblöcher)
- Hohlgriffe: erwärmen sich während des Kochens kaum
- Integrierte Füllskala
- Hergestellt in Deutschland

Die ideale Verbindung aus deutscher Ingenieurskunst und modernem Design für die Induktionsküche.`,
    price: 84.90,
    oldPrice: 94.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 20 cm, Höhe ca. 8 cm, 2,5 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.9,
    badges: ['Made in Germany', 'Function 4 Deckel', 'Cromargan®'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Bratentopf 20 cm | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Bratentopf 20 cm (2,5 L). Cromargan-Edelstahl 18/10, TransTherm-Boden, Multifunktionsdeckel. Induktionsgeeignet bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'WMF Function 4 — Bratentopf 20 cm (individuel)',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'le-creuset-signature-braeter-rund-24cm',
    supplierSku: 'LEC-SIGN-24',
    sortOrder: 6,
    nameDe: 'Le Creuset Signature Gusseisen-Bräter rund 24 cm',
    shortDescription: 'Legendärer gusseiserner Schmortopf mit Emaille-Beschichtung — 4,2 L',
    descriptionDe: `Der Le Creuset Signature Bräter ist das weltweite Symbol für erstklassiges Schmoren. Aus massivem Gusseisen in Frankreich gegossen und mit einer langlebigen Emaille überzogen, speichert er die Hitze optimal und sorgt für eine gleichmäßige Wärmeverteilung — perfekt für zarte Schmorgerichte auf Induktionsplatten.

**Merkmale:**
- Massives Gusseisen für herausragende Wärmespeicherung und gleichmäßiges Garen
- Helle Innenemaille: robust, leicht zu reinigen und ideal zur Kontrolle des Bräunungsgrades
- Signature-Ausstattung: ergonomische, größere Griffe & hitzebeständiger Edelstahlknauf (bis 260 °C)
- Dicht schließender Deckel mit Kondensations-Ringen
- Geeignet für alle Kochfelder inklusive Induktion, Backofen und Grill
- Hergestellt in Frankreich mit 30 Jahren Garantie

Ein wunderschöner Klassiker, der direkt vom Kochfeld stilvoll auf dem Tisch serviert werden kann.`,
    price: 249.00,
    oldPrice: 280.00,
    brand: 'Le Creuset',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 24 cm, Höhe 10 cm (mit Deckel ca. 16 cm), 4,2 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 4.3,
    badges: ['Made in France', '30 ans Garantie', 'Premium Gusseisen'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Le Creuset Signature Gusseisen-Bräter 24 cm | NOVA INDUKT',
    metaDescription: 'Le Creuset Signature runder Gusseisen-Bräter 24 cm (4,2 L) emailliert. Höchste Hitzespeicherung, induktionsgeeignet, 30 Jahre Garantie.',
    categorySlug: 'induktionstoepfe',
    folder: 'Le Creuset Signature — Bräter rund 24 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'wmf-fusiontec-mineral-pro-bratentopf-22cm',
    supplierSku: 'WMF-FUSION-BT22',
    sortOrder: 7,
    nameDe: 'WMF Fusiontec Mineral Pro Bratentopf 22 cm',
    shortDescription: 'High-Tech-Funktionskeramik — extrem harte, kratzfeste Oberfläche, 3,1 L',
    descriptionDe: `Der WMF Fusiontec Mineral Pro Bratentopf wird in einem aufwendigen High-Tech-Verfahren in Deutschland hergestellt. Die Verbindung aus Spezialstahl und natürlichen Mineralien erzeugt eine nahezu unzerstörbare, porenfreie Oberfläche, die kratzfest, säureresistent und extrem pflegeleicht ist.

**Merkmale:**
- Fusiontec-Material: exzellente Hitzeverteilung und -speicherung wie bei Gusseisen, aber präziser steuerbar
- Absolut kratzfeste, glatte Oberfläche (metallische Utensilien bedenkenlos nutzbar)
- Hohlgriffe aus Edelstahl (reduzieren die Wärmeübertragung)
- Hochwertiger Glasdeckel für Sichtkochen
- Hervorragende Magnetisierbarkeit — extrem schnell und effizient auf Induktionsfeldern
- Hergestellt in Deutschland (Made in Germany) avec 30 ans de garantie sur le matériau Fusiontec

Das modernste Material für grenzenlose Kochfreude und absolute Kratzfestigkeit.`,
    price: 139.00,
    oldPrice: 159.00,
    brand: 'WMF',
    material: 'Fusiontec High-Tech-Funktionskeramik',
    dimensions: 'Ø 22 cm, Höhe ca. 9 cm, 3,1 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['Made in Germany', 'Kratzfest', 'Fusiontec®', '30 Jahre Materialgarantie'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Fusiontec Mineral Pro Bratentopf 22 cm | NOVA INDUKT',
    metaDescription: 'WMF Fusiontec Mineral Pro Bratentopf 22 cm (3,1 L). Kratzfeste Funktionskeramik, induktionsoptimiert. Hergestellt in Deutschland bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'WMF Fusiontec Mineral Pro — Bratentopf 22 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'roesle-elegance-globe-topfset-14teilig',
    supplierSku: 'ROS-ELEG-SET14',
    sortOrder: 11,
    nameDe: 'Rösle Elegance Globe Topfset 14-teilig',
    shortDescription: 'Riesiges Rundum-Sorglos-Set aus Edelstahl 18/10 im modernen Kugeldesign',
    descriptionDe: `Das Rösle Elegance Globe Topfset ist das größte Komplettset in unserem Sortiment. Es bietet ambitionierten Hobbyköchen 14 perfekt aufeinander abgestimmte Teile aus hochwertigem Edelstahl 18/10 im charakteristischen, modernen kugeligen Globe-Design.

**Set-Inhalt:**
- Mehrere Fleischtöpfe, Bratentöpfe, Stielkasserollen, passende Güteglasdeckel, Schüsseln und praktisches Kochzubehör.
- Genaue Zusammensetzung für vielfältiges Kochen, Dünsten, Dämpfen und Servieren.

**Merkmale:**
- Gekapselter Sandwichboden mit Aluminiumkern für optimale Hitzeverteilung auf Induktionsfeldern
- Hochwertiger Edelstahl 18/10, hochglanzpoliert
- Praktische Innenskalierung & rundumlaufender Schüttrand
- Ergonomisch geformte Edelstahlgriffe
- Deckel aus Güteglas (hitzebeständig bis 180 °C) für Sichtkochen

Das ultimative "Rundum-Sorglos-Paket" für die komplette Küche mit bewährter Rösle-Qualität.`,
    price: 349.00,
    oldPrice: 399.00,
    brand: 'Rösle',
    material: 'Edelstahl 18/10 / Glas',
    dimensions: '14-teiliges Komplettset',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 12.0,
    badges: ['14-teilig', 'Kugel-Design', 'Komplettset'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rösle Elegance Globe Topfset 14-teilig | NOVA INDUKT',
    metaDescription: 'Rösle Elegance Globe 14-teiliges Topfset für Induktion. Edelstahl 18/10 im modernen Globe-Design, Güteglasdeckel. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Rösle Elegance Globe — Topfset 14-tlg',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  // ══════════════════════════════════════════════════════════════
  // COMPLETE SETS (Ajoutés dans Töpfe)
  // ══════════════════════════════════════════════════════════════
  {
    slug: 'wmf-function-4-topfset-5teilig',
    supplierSku: 'WMF-FUNC4-SET5-TOEPFE',
    sortOrder: 12,
    nameDe: 'WMF Function 4 Topfset Induktion 5-teilig',
    shortDescription: 'Premium-Set aus Cromargan® Edelstahl mit 4-Positionen-Glasdeckeln',
    descriptionDe: `Das WMF Function 4 Topfset ist das ultimative Kochgeschirr-Set für die moderne Induktionsküche. Hergestellt aus strapazierfähigem Cromargan® Edelstahl 18/10, besticht das 5-teilige Set durch seine innovativen Funktionsdeckel mit rotem Silikonrand für kontrolliertes Abgießen ohne Sieb.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm (ca. 2,5 L) mit Deckel
- 1x Fleischtopf Ø 16 cm (ca. 1,9 L) mit Deckel
- 1x Fleischtopf Ø 20 cm (ca. 3,4 L) mit Deckel
- 1x Fleischtopf Ø 24 cm (ca. 5,7 L) mit Deckel
- 1x Stielkasserolle Ø 16 cm (ca. 1,4 L) ohne Deckel

**Merkmale:**
- TransTherm®-Allherdböden für hervorragende Induktionsleistung und Wärmespeicherung
- Function 4 Deckel mit Silikonring (4 definierte Abgießpositionen)
- Hohlgriffe zur Verringerung der Wärmeübertragung
- Innenskalierung & breiter Schüttrand
- Hergestellt in Deutschland mit 20 Jahren Garantie auf die Edelstahlteile

Die perfekte Erstausstattung in Profi-Qualität für Ihr Induktionsfeld.`,
    price: 319.00,
    oldPrice: 359.00,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10 / Silikon / Glas',
    dimensions: '5-teiliges Set, Gesamtgewicht ca. 8,4 kg',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 8.4,
    badges: ['Made in Germany', 'Function 4 Deckel', '5-teiliges Set', 'Cromargan®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Topfset 5-teilig Induktion | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Topfset 5-teilig für Induktion. Cromargan-Edelstahl 18/10, Multifunktionsdeckel, TransTherm-Boden. Hergestellt in Deutschland.',
    categorySlug: 'induktions-sets',
    folder: 'WMF Function 4 — Topfset 5-teilig',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'fissler-intensa-topfset-5teilig',
    supplierSku: 'FIS-INTENSA-SET5-TOEPFE',
    sortOrder: 13,
    nameDe: 'Fissler Intensa Topfset Induktion 5-teilig',
    shortDescription: 'Testsieger Stiftung Warentest — herausragende Induktionseffizienz, 5-tlg',
    descriptionDe: `Das Fissler Intensa Topfset holte den unangefochtenen 1. Platz bei der Stiftung Warentest (01/2017) mit der Note 1,9 (sehr gut). Es zeichnet sich durch außergewöhnliche Induktions-Erhitzungsgeschwindigkeit, exzellente Planstabilität und innovative Kunststoffgriffe aus, die thermisch perfekt isoliert sind.

**Set-Inhalt:**
- 1x Bratentopf Ø 20 cm mit Deckel
- 1x Kochtopf Ø 16 cm mit Deckel
- 1x Kochtopf Ø 20 cm mit Deckel
- 1x Kochtopf Ø 24 cm mit Deckel
- 1x Stielkasserolle Ø 16 cm (ohne Deckel)

**Merkmale:**
- CookStar® Allherdboden: extrem dicker, formstabiler Boden für bestmögliche Energieaufnahme auf Induktion
- Hochwertige wärmeisolierende Kunststoffgriffe (bleiben dauerhaft kühl auf dem Herd)
- Integrierte Abgießfunktion im Deckel (einfaches Abschütten von Nudelwasser)
- Praktische Deckelhalterung am Topfrand zum Einhängen
- Konische Form: Töpfe gleicher Größe sind ineinander stapelbar!
- Hergestellt in Deutschland (Made in Germany)

Das intelligenteste und energieeffizienteste Topfset auf dem Markt — der verdiente Testsieger.`,
    price: 329.00,
    oldPrice: 359.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10 / Kunststoff / Glas',
    dimensions: '5-teiliges Testsieger-Set',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 8.5,
    badges: ['Testsieger Stiftung Warentest', 'Made in Germany', 'Ineinander stapelbar', '5-teilig'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Fissler Intensa Topfset 5-teilig Testsieger | NOVA INDUKT',
    metaDescription: 'Fissler Intensa 5-teiliges Topfset für Induktion. Note 1,9 Stiftung Warentest. CookStar-Boden, wärmeisolierte Griffe, stapelbar. Made in Germany.',
    categorySlug: 'induktions-sets',
    folder: 'Fissler Intensa — Bratentopf 20 cm  Topfset 5-tlg',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie 2 : Induktionstöpfe (10 Produits)')
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
  console.log('📊 RÉSUMÉ BATCH TOEPFE')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Catégorie Induktionstöpfe terminée avec succès ! 8/8 produits en base.')
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
