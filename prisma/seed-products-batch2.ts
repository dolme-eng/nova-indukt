/**
 * NOVA INDUKT — Seed Batch 2 : Induktionspfannen (Produits 11–20)
 * Exécuter avec : npx tsx prisma/seed-products-batch2.ts
 *
 * Organisation sur le site (par type, par prix croissant) :
 *   Groupe 1 — Antihaft Einsteiger   : Zwilling, Berndes, Rösle, WMF Durado
 *   Groupe 2 — Antihaft Mid-Range    : WMF Permadur, SKK, Woll Eco Lite
 *   Groupe 3 — Edelstahl / Profi     : Fissler Crispy (inox), Demeyere Proline 7
 *   Groupe 4 — Gusseisen (suite)     : Lodge L10SK3 30cm
 *
 * sortOrder détermine l'ordre d'affichage dans la catégorie :
 *   1–10 (batch 1 déjà en base), batch 2 commence à 11
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
  // GROUPE 1 — ANTIHAFT EINSTEIGER (entrée de gamme)
  // sortOrder 11–14 : affichées en premières parmi les antihaft abordables
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'zwilling-madura-plus-28cm',
    supplierSku: 'ZWI-MADURA-28',
    sortOrder: 11,
    nameDe: 'Zwilling Madura Plus Bratpfanne 28 cm',
    shortDescription: 'Langlebige Keramik-Antihaftbeschichtung — Zwilling-Qualität, spülmaschinengeeignet',
    descriptionDe: `Die Zwilling Madura Plus überzeugt mit einer besonders widerstandsfähigen Keramik-Antihaftbeschichtung und dem typischen Zwilling-Qualitätsanspruch. Ihr Aluminiumkörper mit ferromagnetischem Boden sorgt für schnelle und gleichmäßige Erwärmung auf dem Induktionskochfeld.

**Merkmale:**
- Hochwertige Keramik-Antihaftbeschichtung für besondere Langlebigkeit
- Leichter Aluminiumkörper für komfortables Kochen
- Ferromagnetischer Induktionsboden für alle Herdarten
- Spülmaschinengeeignet für einfache Reinigung
- Ergonomischer Griff mit angenehmem Grip
- Hergestellt von Zwilling — über 280 Jahre Erfahrung im Kochgeschirr
- Ohne PFOA

Mit 4,1/5 Sternen bei über 832 Bewertungen eine zuverlässige Wahl für die tägliche Küche.`,
    price: 56.55,
    oldPrice: 69.99,
    stock: 25,
    initialStock: 25,
    brand: 'Zwilling',
    material: 'Aluminium mit Keramik-Antihaftbeschichtung',
    dimensions: 'Ø 28 cm, Höhe ca. 5 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Zwilling Qualität', 'Keramikbeschichtung'],
    rating: 4.1,
    reviewCount: 0,
    metaTitle: 'Zwilling Madura Plus Bratpfanne 28 cm — Induktion | NOVA INDUKT',
    metaDescription: 'Zwilling Madura Plus 28 cm — Keramik-Antihaftbeschichtung, induktionsgeeignet, spülmaschinenfest. Jetzt bei NOVA INDUKT kaufen.',
    categorySlug: 'induktionspfannen',
    folder: 'Zwilling Madura Plus — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'berndes-vario-click-induction-28cm',
    supplierSku: 'BER-VARIO-28',
    sortOrder: 12,
    nameDe: 'Berndes Vario Click Induction Bratpfanne 28 cm',
    shortDescription: 'Abnehmbarer Griff, backofengeeignet — das praktische Vario-Click-System',
    descriptionDe: `Die Berndes Vario Click Induction ist die praktischste Bratpfanne auf dem Markt: Der patentierte Vario-Click-Griff lässt sich in weniger als einer Sekunde ab- und anklipsen. So wird die Pfanne zur Ofenform, lässt sich platzsparend stapeln und ist ideal für kleine Küchen.

**Merkmale:**
- Vario-Click-System: Griff in 1 Sekunde abklipsbar
- Backofengeeignet ohne Griff
- Stapelbar für platzsparendes Aufbewahren
- Robuster Aluminiumgusskörper mit speziellem Induktionsboden
- Verstärkte Antihaftbeschichtung
- Spülmaschinengeeignet (ohne Griff)
- Hergestellt in Deutschland
- Ohne PFOA

Erhältlich in mehreren Größen (20–32 cm) für das komplette Kochgeschirr-Set mit einem System.`,
    price: 64.90,
    oldPrice: 85.99,
    stock: 20,
    initialStock: 20,
    brand: 'Berndes',
    material: 'Aluminiumguss mit Antihaftbeschichtung',
    dimensions: 'Ø 28 cm, Höhe ca. 5 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Abnehmbarer Griff', 'Backofengeeignet'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Berndes Vario Click Induction 28 cm — Bratpfanne mit abnehmbarem Griff | NOVA INDUKT',
    metaDescription: 'Berndes Vario Click Induction 28 cm — abnehmbarer Griff, backofengeeignet, stapelbar. Hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Berndes Vario Click Induction — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'roesle-silence-pro-28cm',
    supplierSku: 'ROS-SILENCE-28',
    sortOrder: 13,
    nameDe: 'Rösle Silence Pro Bratpfanne 28 cm',
    shortDescription: 'Lautlose Induktionsküche — Edelstahl-Antihaft mit ProPlex-Beschichtung',
    descriptionDe: `Die Rösle Silence Pro wurde speziell für ruhiges, vibrationsloses Kochen auf Induktionskochfeldern entwickelt. Der robuste Sandwichboden aus ferromagnetischem Stahl eliminiert typische Induktionsgeräusche und sorgt für gleichmäßige Wärmeverteilung.

**Merkmale:**
- „Silence Pro" — minimale Geräuschentwicklung auf dem Induktionskochfeld
- Hochwertige PTFE-Antihaftbeschichtung (ProPlex)
- Robuster Sandwichboden aus Edelstahl 18/10
- Präziser Ausgießrand für sauberes Servieren
- Integrierte Messskala
- Ergonomischer Griff mit sicherem Halt
- Backofengeeignet bis 200 °C
- Spülmaschinengeeignet
- Hergestellt in Deutschland — ohne PFOA

Ausgezeichnetes Preis-Leistungs-Verhältnis in der Rösle-Premiumlinie.`,
    price: 54.99,
    oldPrice: 89.95,
    stock: 22,
    initialStock: 22,
    brand: 'Rösle',
    material: 'Edelstahl 18/10 mit ProPlex-Antihaftbeschichtung',
    dimensions: 'Ø 28 cm, Höhe ca. 5,5 cm, ca. 2,8 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Silence Pro', 'Edelstahl'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rösle Silence Pro Bratpfanne 28 cm — Leise Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Rösle Silence Pro 28 cm — lautlose Induktionspfanne, Edelstahl, ProPlex-Beschichtung. Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Rösle Silence Pro — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-durado-28cm',
    supplierSku: 'WMF-DURA-28',
    sortOrder: 14,
    nameDe: 'WMF Durado Bratpfanne 28 cm',
    shortDescription: 'Cromargan® Edelstahl mit Keramikbeschichtung — backofengeeignet, günstig',
    descriptionDe: `Die WMF Durado kombiniert den legendären Cromargan® Edelstahl Rostfrei 18/10 mit einer modernen Keramik-Antihaftbeschichtung. Der TransTherm-Allherdboden sorgt für optimale Wärmeverteilung auf dem Induktionskochfeld und ist ohne Deformation belastbar.

**Merkmale:**
- Cromargan® Edelstahl Rostfrei 18/10 — WMF-Markenqualität
- Keramik-Antihaftbeschichtung — ohne PFOA
- TransTherm-Allherdboden — ferromagnetisch, für alle Herdarten
- Backofengeeignet (ohne Einschränkung des Griffs)
- Spülmaschinengeeignet für einfache Reinigung
- Elegantes Design — erhältlich als 24+28 cm Set
- Hergestellt in Deutschland

Ideale Einstiegspfanne in die WMF-Qualitätswelt zu einem attraktiven Preis.`,
    price: 52.90,
    oldPrice: 65.00,
    stock: 30,
    initialStock: 30,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10 mit Keramikbeschichtung',
    dimensions: 'Ø 28 cm, Höhe ca. 5,5 cm, ca. 2,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Cromargan®', 'Keramikbeschichtung'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Durado Bratpfanne 28 cm — Cromargan® Induktionspfanne | NOVA INDUKT',
    metaDescription: 'WMF Durado 28 cm — Cromargan® Edelstahl mit Keramikbeschichtung, backofengeeignet, induktionskompatibel. Hergestellt in Deutschland.',
    categorySlug: 'induktionspfannen',
    folder: 'WMF Durado — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // GROUPE 2 — ANTIHAFT MID-RANGE (milieu de gamme)
  // sortOrder 15–17
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'wmf-permadur-advance-28cm',
    supplierSku: 'WMF-PERMA-28',
    sortOrder: 15,
    nameDe: 'WMF Permadur Advance Bratpfanne 28 cm',
    shortDescription: 'Robuster Permadur-Antihaftbelag — besonders hohe Wärmespeicherung',
    descriptionDe: `Die WMF Permadur Advance ist die leistungsstärkste Antihaft-Bratpfanne in der WMF-Mitteklasse. Ihr massiver Aluminiumkörper mit verstärktem Permadur-Antihaftbelag und dem extra dicken Induktionsboden ermöglicht intensives Anbraten ohne Temperatureinbruch.

**Merkmale:**
- Verstärkter Permadur-Antihaftbelag — langlebiger als Standard-PTFE
- Extra dicker ferromagnetischer Induktionsboden für hohe Wärmespeicherung
- Möglichkeit, ohne Fett zu braten (z. B. Schweinefleisch)
- Eingebauter Ausgießrand (Schüttrand)
- Höherer Rand (5,5 cm) für Soßen und Schmoren
- Spülmaschinengeeignet
- Hergestellt in Deutschland — ohne PFOA

Die Permadur Advance eignet sich besonders für Hobbyköche, die eine robustere Alternative zur Standardantihaft suchen.`,
    price: 67.50,
    oldPrice: 75.00,
    stock: 18,
    initialStock: 18,
    brand: 'WMF',
    material: 'Aluminium mit Permadur-Antihaftbeschichtung',
    dimensions: 'Ø 28 cm, Höhe ca. 5,5 cm, ca. 2,8 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Permadur Beschichtung', 'Hohe Wärmespeicherung'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Permadur Advance Bratpfanne 28 cm — Robuste Antihaft-Induktionspfanne | NOVA INDUKT',
    metaDescription: 'WMF Permadur Advance 28 cm — robuste Antihaftbeschichtung, dicker Induktionsboden, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'WMF Permadur Advance — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'skk-titan-durit-resist-75264-26cm',
    supplierSku: 'SKK-75264-26',
    sortOrder: 16,
    nameDe: 'SKK Titan Durit Resist Guss-Bratpfanne 26 cm',
    shortDescription: 'Handgegossene Aluguss-Pfanne aus Deutschland — 3-Schicht-Titan-Beschichtung',
    descriptionDe: `Die SKK Titan Durit Resist 75264 ist ein Meisterstück der deutschen Handwerkstradition: In aufwendiger Handguss-Fertigung in Deutschland entstehen diese massiven Aluminiumgusspfannen mit einer dreischichtigen Titan-Antihaftbeschichtung für außergewöhnliche Haltbarkeit.

**Merkmale:**
- Handgegossener Aluminiumgusskörper — Einzelstückfertigung in Deutschland
- 3-Schicht-Titan-Durit-Resist-Beschichtung für maximale Langlebigkeit
- Ferromagnetischer Induktionsboden integriert im Guss
- Hoher Rand (5,5 cm) — ideal auch zum Schmoren
- Hervorragende Wärmespeicherung und gleichmäßige Verteilung
- Sehr stabiler Boden, keine Deformation möglich
- Hergestellt in Deutschland — Made in Germany
- Ohne PFOA

SKK — seit über 60 Jahren Synonym für handgefertigtes Premium-Kochgeschirr aus dem Saarland.`,
    price: 72.00,
    oldPrice: 88.00,
    stock: 12,
    initialStock: 12,
    brand: 'SKK',
    material: 'Handgegossener Aluminiumguss mit 3-Schicht-Titan-Beschichtung',
    dimensions: 'Ø 26 cm, Höhe 5,5 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Handgegossen', '3-Schicht-Titan'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'SKK Titan Durit Resist 26 cm — Handgegossene Induktionspfanne | NOVA INDUKT',
    metaDescription: 'SKK Titan Durit Resist 75264 26 cm — handgegossener Aluminiumguss, 3-Schicht-Beschichtung, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'SKK Titan Durit Resist 75264 — 26 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'woll-eco-lite-qxr-24cm',
    supplierSku: 'WOL-ECO-24',
    sortOrder: 17,
    nameDe: 'Woll Eco Lite QXR Flachpfanne 24 cm',
    shortDescription: 'Ökologisch & nickelfrei — aus 100% recyceltem Aluminium, hergestellt in Deutschland',
    descriptionDe: `Die Woll Eco Lite QXR ist die nachhaltigste Bratpfanne im Sortiment: Sie besteht aus 100% recyceltem Aluminium und ist mit einem nickelfreien QXR-Antihaftbelag ausgestattet — ideal für Allergiker und umweltbewusste Köche.

**Merkmale:**
- 100% recyceltes Aluminium — ressourcenschonende Produktion
- QXR-Antihaftbeschichtung — vollständig nickelfrei (ideal für Nickelallergiker)
- Spezieller Induktionsboden aus ferromagnetischem Stahl
- Abnehmbarer Griff — backofengeeignet
- Spülmaschinengeeignet
- Sehr gute Wärmeverteilung ohne Hotspots
- Hergestellt in Saarbrücken, Deutschland
- 3 Jahre Garantie
- Ohne PFOA, ohne Nickel

Qualitätspfanne mit gutem Gewissen — die Öko-Wahl ohne Kompromisse bei der Leistung.`,
    price: 54.99,
    oldPrice: 64.95,
    stock: 20,
    initialStock: 20,
    brand: 'Woll',
    material: '100% recyceltes Aluminium mit QXR-Nickelfreier-Beschichtung',
    dimensions: 'Ø 24 cm, Höhe ca. 4,5 cm, ca. 1,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', '100% Recycelt', 'Nickelfrei', '3 Jahre Garantie'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Woll Eco Lite QXR 24 cm — Ökologische Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Woll Eco Lite QXR 24 cm — 100% recyceltes Aluminium, nickelfrei, hergestellt in Deutschland. Nachhaltig & leistungsstark — bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Woll Eco Lite QXR — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // GROUPE 3 — EDELSTAHL / PROFI (inox sans revêtement, haut de gamme)
  // sortOrder 18–19 : en fin de gamme car plus techniques et chers
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'fissler-crispy-steelux-premium-24cm',
    supplierSku: 'FIS-CRISPY-24',
    sortOrder: 18,
    nameDe: 'Fissler Crispy Steelux Premium Bratpfanne 24 cm',
    shortDescription: 'Profipfanne ohne Beschichtung — perfekte Kruste für Steaks, Backofengeeignet',
    descriptionDe: `Die Fissler Crispy Steelux Premium ist keine gewöhnliche Bratpfanne: Als unbeschichtete Edelstahl-Profiküchenpfanne ist sie auf maximales Anbraten und die Bildung einer perfekten, knusprigen Kruste spezialisiert. Kein Antihaft — dafür unübertroffene Röstaromen.

**Merkmale:**
- Massiver 18/10-Edelstahlkörper ohne Antihaftbeschichtung
- CookStar® Allherdboden (4,8 mm dick) — ferromagnetisch, perfekte Induktionsleistung
- Speziell für intensives Anbraten und maximale Maillard-Reaktion
- Integrierte Messskala im Inneren
- Extra breiter Ausgießrand für beidseitiges Ausgießen
- Sicherheitsgriff mit Fingerschutz — ohne Nieten (rivet-free)
- Vollständig backofengeeignet
- Spülmaschinengeeignet
- Hergestellt in Deutschland

Diese Pfanne wird mit jeder Nutzung besser — die Oberfläche entwickelt sich zur natürlichen Patina.`,
    price: 134.90,
    oldPrice: 159.00,
    stock: 10,
    initialStock: 10,
    brand: 'Fissler',
    material: 'Edelstahl 18/10 (unbeschichtet, CookStar® Boden)',
    dimensions: 'Ø 24 cm, Höhe ca. 5 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Ohne Beschichtung', 'Profi Crispy', 'CookStar®'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler Crispy Steelux Premium 24 cm — Edelstahl Profi-Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Fissler Crispy Steelux Premium 24 cm — unbeschichteter Edelstahl, CookStar®-Boden, induktionsgeeignet. Hergestellt in Deutschland. Jetzt kaufen.',
    categorySlug: 'induktionspfannen',
    folder: 'Fissler Crispy Steelux Premium — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'demeyere-proline-7-28cm',
    supplierSku: 'DEM-PROL7-28',
    sortOrder: 19,
    nameDe: 'Demeyere Proline 7 Bratpfanne 28 cm',
    shortDescription: 'Die stärkste Induktionspfanne der Welt — 7-lagig, 4,8 mm, 30 Jahre Garantie',
    descriptionDe: `Die Demeyere Proline 7 gilt weltweit als Referenz unter den unbeschichteten Edelstahl-Bratpfannen. Mit 7 übereinander geschmiedeten Metallschichten und einem 4,8 mm dicken Boden eliminiert sie jeden Temperatureinbruch und bietet professionelle Kochleistung für anspruchsvollste Gerichte.

**Merkmale:**
- 7 Metallschichten (7-ply) — der dickste Bratpfannenboden auf dem Markt (4,8 mm)
- Perfekte Wärmeverteilung ohne jegliche Hotspots — professionelle Gleichmäßigkeit
- Massive angeschweißte Edelstahlgriffe ohne Nieten
- Unbeschichtete Edelstahloberfläche — entwickelt mit Zeit eine natürliche Patina
- Vollständig induktionsgeeignet und backofengeeignet
- Spülmaschinengeeignet
- Hergestellt in Belgien — 30 Jahre Garantie auf bestimmte Modelle
- Ohne jegliche Chemikalie

Von professionellen Köchen und Food-Kritikern weltweit als "die beste Bratpfanne" bezeichnet.`,
    price: 189.00,
    oldPrice: 220.00,
    stock: 8,
    initialStock: 8,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 — 7 Schichten (7-ply), 4,8 mm Bodenstärke',
    dimensions: 'Ø 28 cm, Höhe ca. 5 cm, ca. 3 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['30 Jahre Garantie', '7-lagig', 'Profi-Referenz', 'Made in Belgium'],
    rating: 4.9,
    reviewCount: 0,
    metaTitle: 'Demeyere Proline 7 Bratpfanne 28 cm — Premium 7-lagige Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Demeyere Proline 7 28 cm — 7 Schichten, 4,8 mm Boden, induktionsgeeignet, 30 Jahre Garantie. Die beste Bratpfanne der Welt. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Demeyere Proline 7 — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // GROUPE 4 — GUSSEISEN (suite)
  // sortOrder 20 : complement de la série fonte du batch 1
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'lodge-logic-l10sk3-gusseisen-30cm',
    supplierSku: 'LOD-L10SK3-30',
    sortOrder: 20,
    nameDe: 'Lodge Logic Gusseisen Bratpfanne 30 cm',
    shortDescription: 'Großformatige Gusseisenpfanne 30 cm — Lifetime-Garantie, voreingebrannt',
    descriptionDe: `Die Lodge L10SK3 ist die größere Schwester der beliebten L8SK3 und bietet mit 30 cm Durchmesser ausreichend Platz für Familienmahlzeiten, Steaks, Braten oder komplette Mahlzeiten in einer einzigen Pfanne.

**Merkmale:**
- Massives Gusseisen — aus einem Stück gefertigt, keine Schwachstellen
- Ferromagnetisches Gusseisen — ideal für alle Induktionskochfelder
- Voreingebrannt (pre-seasoned) mit pflanzlichem Öl — sofort einsatzbereit
- Großes Format (30 cm) für Familien und große Portionen
- Für alle Herdarten geeignet — auch Grill und offenes Feuer
- Vollständig ofenfest ohne Temperaturbegrenzung
- Zwei integrierte Ausgießer
- Hergestellt in den USA
- Lifetime Guarantee (Garantie auf Lebenszeit)

Dieselbe unübertroffene Lodge-Qualität wie das 26 cm Modell — jetzt mit noch mehr Kochfläche.`,
    price: 47.90,
    oldPrice: 64.90,
    stock: 25,
    initialStock: 25,
    brand: 'Lodge',
    material: 'Gusseisen (unbehandelt, voreingebrannt)',
    dimensions: 'Ø 30 cm (außen), Ø 26 cm (innen), Höhe 5,72 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Lifetime Garantie', 'Made in USA', '30 cm Format'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Lodge Logic L10SK3 Gusseisenpfanne 30 cm — Induktionsgeeignet | NOVA INDUKT',
    metaDescription: 'Lodge Logic Gusseisenpfanne 30 cm — pre-seasoned, induktionsgeeignet, Lifetime-Garantie. Hergestellt in den USA. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Lodge Gusseisenpfanne L10SK3 — 30 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch 2 : Induktionspfannen (10 Produkte restants)')
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
            stock: p.stock,
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
            stock: p.stock,
            initialStock: p.initialStock,
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
  console.log('📊 RÉSUMÉ BATCH 2')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Batch 2 terminé avec succès ! 20/20 produits en base.')
    console.log('\n📋 Organisation finale dans la catégorie Induktionspfannen :')
    console.log('   Antihaft Einsteiger  (sortOrder 11–14) : Zwilling, Berndes, Rösle, WMF Durado')
    console.log('   Antihaft Mid-Range   (sortOrder 15–17) : WMF Permadur, SKK, Woll Eco Lite')
    console.log('   Edelstahl / Profi    (sortOrder 18–19) : Fissler Crispy, Demeyere Proline 7')
    console.log('   Gusseisen (suite)    (sortOrder 20)    : Lodge L10SK3 30cm')
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
