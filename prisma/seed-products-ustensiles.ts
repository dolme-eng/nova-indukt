/**
 * NOVA INDUKT — Seed Ustensiles : 20 Küchenutensilien
 * Exécuter avec : npx tsx prisma/seed-products-ustensiles.ts
 *
 * Catégories couvertes :
 *   - Küchenutensilien (Ustensiles de cuisine)
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
  // WMF PROFI PLUS
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'wmf-profi-plus-schoepfkellen-set-3tlg',
    supplierSku: 'WMF-PPSK-3',
    sortOrder: 1,
    nameDe: 'WMF Profi Plus Schöpfkellen-Set 3-teilig',
    shortDescription: 'Drei hochwertige Schöpfkellen aus Cromargan® Edelstahl — Spülmaschinenfest',
    descriptionDe: `Das WMF Profi Plus Schöpfkellen-Set 3-teilig bietet die perfekte Ergänzung für jede moderne Küche. Die drei Schöpfkellen unterschiedlicher Größe eignen sich ideal für das Portionsieren, Servieren und Anrichten von Suppen, Saucen und Beilagen.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — rostfrei, Geschmacksneutral, langlebig
- Drei Größen für unterschiedliche Einsatzzwecke
- Ergonomischer Griff für sicheren Halt
- Perfekt abgestimmte Kellenform für sauberes Schöpfen
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Teil der renommierten Profi Plus-Serie

Die Schöpfkellen aus der WMF Profi Plus-Serie sind unverzichtbare Helfer in der Küche. Ob beim Anrichten von Suppen oder beim Servieren von Saucen — dank der hochwertigen Verarbeitung und des durchdachten Designs gelingen alle Küchenarbeiten mühelos und professionell.`,
    price: 24.99,
    oldPrice: 29.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '3-teilig',
    weightKg: 0.35,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Cromargan®'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Schöpfkellen-Set 3-teilig — Edelstahl Küchenutensil | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Schöpfkellen-Set 3-teilig aus Cromargan® Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus — Schöpfkellen-Set 3-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-profi-plus-kochloeffel',
    supplierSku: 'WMF-PP-KL',
    sortOrder: 2,
    nameDe: 'WMF Profi Plus Kochlöffel',
    shortDescription: 'Eleganter Kochlöffel aus Cromargan® Edelstahl — 30 cm, spülmaschinenfest',
    descriptionDe: `Der WMF Profi Plus Kochlöffel ist ein unverzichtbares Küchenutensil für alle, die Wert auf Qualität und Design legen. Gefertigt aus hochwertigem Cromargan® Edelstahl 18/10, überzeugt er durch seine Robustheit und Langlebigkeit.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — rostfrei und geschmacksneutral
- Langer Griff (30 cm) für sicheren Abstand zum Topf
- Ergonomisches Design für komfortables Arbeiten
- Ideal zum Rühren, Schöpfen und Servieren
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Passend zur gesamten Profi Plus-Serie

Der Kochlöffel aus der WMF Profi Plus-Serie ist ein Multitalent in der Küche. Ob beim Rühren von Suppen, beim Servieren von Saucen oder beim Anrichten von Beilagen — dank seiner vielseitigen Form und der hochwertigen Verarbeitung ist er der ideale Begleiter für jeden Hobby- und Profikoch.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.1,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Kochlöffel 30 cm — Cromargan® Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Kochlöffel 30 cm aus Cromargan® Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus — Kochlöffel',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-profi-plus-saucenheber',
    supplierSku: 'WMF-PP-SH',
    sortOrder: 3,
    nameDe: 'WMF Profi Plus Saucenheber',
    shortDescription: 'Präziser Saucenheber aus Cromargan® Edelstahl — 30 cm, spülmaschinenfest',
    descriptionDe: `Der WMF Profi Plus Saucenheber ist das perfekte Werkzeug für das Servieren von Saucen, Brühen und flüssigen Speisen. Seine durchdachte Form ermöglicht ein präzises und tropffreies Servieren.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — rostfrei, langlebig, geschmacksneutral
- Speziell geformte Kelle für sauberes Servieren
- Langer Griff (30 cm) für sicheren Abstand
- Ergonomischer Griff für sicheren Halt
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Passend zur Profi Plus-Serie

Der Saucenheber zeichnet sich durch seine präzise Formgebung aus, die ein tropffreies Servieren ermöglicht. Die fließenden Übergänge zwischen Griff und Kellenkörper sorgen für hygienische Sauberkeit und einfache Reinigung.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.12,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Saucenheber 30 cm — Cromargan® Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Saucenheber 30 cm aus Cromargan® Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus — Saucenheber',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-profi-plus-schaumkelle',
    supplierSku: 'WMF-PP-SK',
    sortOrder: 4,
    nameDe: 'WMF Profi Plus Schaumkelle',
    shortDescription: 'Funktionale Schaumkelle aus Cromargan® Edelstahl — 30 cm, spülmaschinenfest',
    descriptionDe: `Die WMF Profi Plus Schaumkelle ist ein unverzichtbares Utensil für alle, die gerne auf das Detail achten. Ob beim Entschäumen von Brühen oder beim Servieren von klaren Suppen — dank ihrer speziellen Form gelingt jedes Mal ein perfektes Ergebnis.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — rostfrei und langlebig
- Perforierte Kelle zum effektiven Entschäumen
- Langer Griff (30 cm) für sicheren Abstand zum Kochtopf
- Ergonomisches Design für komfortables Arbeiten
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Ideal für Suppen, Saucen und Brühen

Die Schaumkelle aus der WMF Profi Plus-Serie überzeugt durch ihre funktionalen Details. Die feinen Öffnungen in der Kellenfläche lassen Flüssigkeit hindurch, während Schaum und feste Partikel zurückgehalten werden.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.1,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Schaumkelle 30 cm — Cromargan® Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Schaumkelle 30 cm aus Cromargan® Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus — Schaumkelle',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-profi-plus-grillzange',
    supplierSku: 'WMF-PP-GZ',
    sortOrder: 5,
    nameDe: 'WMF Profi Plus Grillzange',
    shortDescription: 'Universelle Grillzange aus Cromargan® Edelstahl — 30 cm, spülmaschinenfest',
    descriptionDe: `Die WMF Profi Plus Grillzange ist das ideale Werkzeug für alle Grill- und Kochenthusiasten. Ihre robuste Konstruktion und die durchdachte Form ermöglichen ein sicheres Greifen und Wenden von Lebensmitteln.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — robust und rostfrei
- Universell einsetzbar für Grill, Bratpfanne und Ofen
- Sichere Zangenmechanik mit präziser Schließkraft
- Langer Griff (30 cm) für sicheren Abstand
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Perfekt für Grillabende und Küchenalltag

Die Grillzange aus der WMF Profi Plus-Serie überzeugt durch ihre robuste Bauweise und ihre vielseitige Einsetzbarkeit. Ob beim Grillen, Braten oder Servieren — dank der hochwertigen Verarbeitung und des ergonomischen Designs gelingt jede Küchenarbeit mühelos und sicher.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.15,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Universal'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Grillzange 30 cm — Cromargan® Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Grillzange 30 cm aus Cromargan® Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus — Grillzange',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // FISSLER PURE COLLECTION
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'fissler-pure-collection-kochloeffel',
    supplierSku: 'FIS-PC-KL',
    sortOrder: 6,
    nameDe: 'Fissler Pure Collection Kochlöffel',
    shortDescription: 'Hochwertiger Kochlöffel aus Edelstahl 18/10 — 30 cm, spülmaschinenfest',
    descriptionDe: `Der Fissler Pure Collection Kochlöffel verbindet minimalistisches Design mit höchster Funktionalität. Gefertigt aus rostfreiem Edelstahl 18/10, ist er der perfekte Begleiter für alle Küchenarbeiten.

**Merkmale:**
- Edelstahl 18/10 — rostfrei, geschmacksneutral, langlebig
- Elegantes, minimalistisches Design der Pure Collection
- Langer Griff (30 cm) für sicheren Abstand
- Ergonomische Form für komfortables Arbeiten
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Passend zur gesamten Pure Collection-Serie

Der Kochlöffel aus der Fissler Pure Collection besticht durch seine klaren Linien und seine hochwertige Verarbeitung. Die durchdachte Form ermöglicht ein müheloses Rühren und Servieren, während der lange Griff für sicheren Halt sorgt.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.12,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Pure Collection'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Pure Collection Kochlöffel 30 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Pure Collection Kochlöffel 30 cm aus Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Fissler Pure Collection — Kochlöffel',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-pure-collection-schoepfkelle',
    supplierSku: 'FIS-PC-SK',
    sortOrder: 7,
    nameDe: 'Fissler Pure Collection Schöpfkelle',
    shortDescription: 'Elegante Schöpfkelle aus Edelstahl 18/10 — 30 cm, spülmaschinenfest',
    descriptionDe: `Die Fissler Pure Collection Schöpfkelle ist ein Küchenutensil, das Design und Funktionalität perfekt vereint. Aus rostfreiem Edelstahl 18/10 gefertigt, eignet sie sich ideal zum Schöpfen und Servieren von Suppen und Saucen.

**Merkmale:**
- Edelstahl 18/10 — rostfrei, langlebig, geschmacksneutral
- Schlichtes, elegantes Design der Pure Collection
- Perfekt geformte Kelle für sauberes Schöpfen
- Langer Griff (30 cm) für sicheren Abstand
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Passend zur Pure Collection-Serie

Die Schöpfkelle aus der Fissler Pure Collection besticht durch ihre klaren Linien und ihre funktionalen Details. Die durchdachte Kellenform ermöglicht ein präzises und tropffreies Servieren, während der ergonomische Griff für komfortables Arbeiten sorgt.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.12,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Pure Collection Schöpfkelle 30 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Pure Collection Schöpfkelle 30 cm aus Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Fissler Pure Collection — Schöpfkelle',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-pure-collection-saucenheber',
    supplierSku: 'FIS-PC-SH',
    sortOrder: 8,
    nameDe: 'Fissler Pure Collection Saucenheber',
    shortDescription: 'Präziser Saucenheber aus Edelstahl 18/10 — 30 cm, spülmaschinenfest',
    descriptionDe: `Der Fissler Pure Collection Saucenheber ist das perfekte Utensil für alle, die Wert auf ein sauberes und elegantes Servieren legen. Seine spezielle Form ermöglicht ein tropffreies Servieren von Saucen und flüssigen Speisen.

**Merkmale:**
- Edelstahl 18/10 — rostfrei, geschmacksneutral, langlebig
- Durchdachte Form für tropffreies Servieren
- Langer Griff (30 cm) für sicheren Abstand
- Ergonomisches Design für komfortables Arbeiten
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Passend zur Pure Collection-Serie

Der Saucenheber aus der Fissler Pure Collection besticht durch seine funktionalen Details und seine hochwertige Verarbeitung. Die fließenden Übergänge zwischen Griff und Kellenkörper sorgen für hygienische Sauberkeit und einfache Reinigung.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.12,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Fissler Pure Collection Saucenheber 30 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Pure Collection Saucenheber 30 cm aus Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Fissler Pure Collection — Saucenheber',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-pure-collection-nudelkelle',
    supplierSku: 'FIS-PC-NK',
    sortOrder: 9,
    nameDe: 'Fissler Pure Collection Nudelkelle',
    shortDescription: 'Spezialisierte Nudelkelle aus Edelstahl 18/10 — 32 cm, spülmaschinenfest',
    descriptionDe: `Die Fissler Pure Collection Nudelkelle ist das ideale Utensil für Pasta-Liebhaber. Ihre spezielle Form ermöglicht ein sicheres Greifen und Servieren von Nudeln, ohne dass diese herunterfallen.

**Merkmale:**
- Edelstahl 18/10 — rostfrei, langlebig, geschmacksneutral
- Spezielle Zinken-Form für sicheres Greifen von Nudeln
- Langer Griff (32 cm) für sicheren Abstand
- Perfekt für Spaghetti, Penne und andere Nudelformen
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Passend zur Pure Collection-Serie

Die Nudelkelle aus der Fissler Pure Collection überzeugt durch ihre funktionalen Details. Die speziell geformten Zinken ermöglichen ein sicheres Greifen von Nudeln, während die glatte Oberfläche für einfache Reinigung sorgt.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '32 cm',
    weightKg: 0.14,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Nudelkelle'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Pure Collection Nudelkelle 32 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Pure Collection Nudelkelle 32 cm aus Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Fissler Pure Collection — Nudelkelle',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // RÖSLE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'roesle-silicone-backpinsel',
    supplierSku: 'ROS-SIL-BB',
    sortOrder: 10,
    nameDe: 'Rösle Silicone Basting Brush',
    shortDescription: 'Hochwertiger Basting-Pinsel aus Edelstahl und Silicone — 28 cm, spülmaschinenfest',
    descriptionDe: `Der Rösle Silicone Basting Brush ist ein hochwertiges Küchenutensil für alle, die Wert auf Präzision und Qualität legen. Die Kombination aus Edelstahl und hitzebeständigem Silicone macht ihn zum idealen Begleiter beim Bestreichen und Basting.

**Merkmale:**
- Kombination aus Edelstahl und hitzebeständigem Silicone
- Langer Griff (28 cm) für sicheren Abstand
- Silicone-Borsten hitzebeständig und spülmaschinenfest
- Ideal zum Bestreichen von Fleisch, Pastete und Gebäck
- Einfache Reinigung
- Hergestellt in Deutschland
- Perfekt für Grillen und Backen

Der Basting-Pinsel aus der Rösle Silicone-Serie besticht durch seine hochwertige Materialkombination. Die Edelstahlkonstruktion sorgt für Stabilität, während die Silicone-Borsten eine gleichmäßige Verteilung von Marinaden und Glasuren ermöglichen.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Rösle',
    material: 'Edelstahl + Silicone',
    dimensions: '28 cm',
    weightKg: 0.08,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Silicone'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rösle Silicone Basting Brush 28 cm — Edelstahl + Silicone | NOVA INDUKT',
    metaDescription: 'Rösle Silicone Basting Brush 28 cm aus Edelstahl und hitzebeständigem Silicone. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Rösle Silicone — Basting Brush',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'roesle-silicone-spatula',
    supplierSku: 'ROS-SIL-SP',
    sortOrder: 11,
    nameDe: 'Rösle Silicone Spatula',
    shortDescription: 'Vielseitiger Spatel aus Edelstahl und Silicone — 28 cm, spülmaschinenfest',
    descriptionDe: `Der Rösle Silicone Spatula ist ein Multitalent in der Küche. Die Kombination aus robustem Edelstahl und flexiblem Silicone macht ihn zum idealen Utensil für das Kratzen, Umrühren und Servieren.

**Merkmale:**
- Kombination aus Edelstahl und flexiblem Silicone
- Langer Griff (28 cm) für sicheren Abstand
- Flexible Siliconekante für sauberes Kratzen
- Hitzebeständig und spülmaschinenfest
- Ideal zum Kratzen von Schüsseln und Töpfen
- Hergestellt in Deutschland
- Perfekt für Backen und Kochen

Der Spatel aus der Rösle Silicone-Serie überzeugt durch seine vielseitige Einsetzbarkeit. Die flexible Siliconekante ermöglicht ein sauberes Kratzen von Schüsseln und Töpfen, während die robuste Edelstahlkonstruktion für Langlebigkeit sorgt.`,
    price: 11.99,
    oldPrice: 14.99,
    brand: 'Rösle',
    material: 'Edelstahl + Silicone',
    dimensions: '28 cm',
    weightKg: 0.07,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Rösle Silicone Spatula 28 cm — Edelstahl + Silicone | NOVA INDUKT',
    metaDescription: 'Rösle Silicone Spatula 28 cm aus Edelstahl und flexiblem Silicone. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Rösle Silicone — Spatula',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'roesle-silicone-kochloeffel',
    supplierSku: 'ROS-SIL-KL',
    sortOrder: 12,
    nameDe: 'Rösle Silicone Cooking Spoon',
    shortDescription: 'Eleganter Kochlöffel aus Edelstahl und Silicone — 28 cm, spülmaschinenfest',
    descriptionDe: `Der Rösle Silicone Cooking Spoon vereint die Stärken von Edelstahl und Silicone in einem einzigen Küchenutensil. Die Kombination aus robustem Griff und weicher Löffelkante macht ihn zum idealen Begleiter beim Kochen und Servieren.

**Merkmale:**
- Kombination aus Edelstahl und weichem Silicone
- Langer Griff (28 cm) für sicheren Abstand
- Weiche Siliconekante schont Beschichtungen
- Hitzebeständig und spülmaschinenfest
- Ideal zum Rühren und Servieren
- Hergestellt in Deutschland
- Perfekt für Antihaftpfannen

Der Kochlöffel aus der Rösle Silicone-Serie besticht durch seine hochwertige Materialkombination. Die weiche Siliconekante schont selbst empfindliche Antihaftbeschichtungen, während die robuste Edelstahlkonstruktion für Langlebigkeit sorgt.`,
    price: 11.99,
    oldPrice: 14.99,
    brand: 'Rösle',
    material: 'Edelstahl + Silicone',
    dimensions: '28 cm',
    weightKg: 0.07,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Rösle Silicone Cooking Spoon 28 cm — Edelstahl + Silicone | NOVA INDUKT',
    metaDescription: 'Rösle Silicone Cooking Spoon 28 cm aus Edelstahl und weichem Silicone. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Rösle Silicone — Cooking Spoon',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'roesle-silicone-kelle',
    supplierSku: 'ROS-SIL-KL2',
    sortOrder: 13,
    nameDe: 'Rösle Silicone Ladle',
    shortDescription: 'Praktische Schöpfkelle aus Edelstahl und Silicone — 28 cm, spülmaschinenfest',
    descriptionDe: `Die Rösle Silicone Ladle ist die perfekte Kombination aus Robustheit und Flexibilität. Die Edelstahlkonstruktion sorgt für Stabilität, während die Silicone-Beschichtung eine schonende Behandlung von Kochgeschirr gewährleistet.

**Merkmale:**
- Kombination aus Edelstahl und hitzebeständigem Silicone
- Langer Griff (28 cm) für sicheren Abstand
- Großer Fassungsraum für effizientes Schöpfen
- Hitzebeständig und spülmaschinenfest
- Ideal zum Schöpfen von Suppen und Saucen
- Hergestellt in Deutschland
- Perfekt für alle Kochgeschirrarten

Die Schöpfkelle aus der Rösle Silicone-Serie überzeugt durch ihre durchdachte Formgebung. Der große Fassungsraum ermöglicht ein effizientes Schöpfen, während die weiche Siliconekante für eine schonende Behandlung des Kochgeschirrs sorgt.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Rösle',
    material: 'Edelstahl + Silicone',
    dimensions: '28 cm',
    weightKg: 0.08,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Rösle Silicone Ladle 28 cm — Edelstahl + Silicone | NOVA INDUKT',
    metaDescription: 'Rösle Silicone Ladle 28 cm aus Edelstahl und hitzebeständigem Silicone. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Rösle Silicone — Ladle',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'roesle-edelstahl-wender',
    supplierSku: 'ROS-SS-TU',
    sortOrder: 14,
    nameDe: 'Rösle Stainless Steel Turner',
    shortDescription: 'Robuster Wender aus Edelstahl 18/10 — 30 cm, spülmaschinenfest',
    descriptionDe: `Der Rösle Stainless Steel Turner ist ein unverzichtbares Küchenutensil für alle, die Wert auf Qualität und Langlebigkeit legen. Gefertigt aus rostfreiem Edelstahl 18/10, ist er der ideale Begleiter beim Braten und Wenden.

**Merkmale:**
- Edelstahl 18/10 — rostfrei, robust, langlebig
- Flache Kante für sauberes Wenden und Heben
- Langer Griff (30 cm) für sicheren Abstand
- Robuste Konstruktion für schwere Lebensmittel
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Ideal für Bratpfannen und Grillplatten

Der Wender aus der Rösle Edelstahl-Serie besticht durch seine robuste Bauweise und seine hochwertige Verarbeitung. Die flache Kante ermöglicht ein sauberes Wenden von Fleisch, Fisch und Gemüse, während der ergonomische Griff für sicheren Halt sorgt.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Rösle',
    material: 'Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.12,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Edelstahl'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rösle Stainless Steel Turner 30 cm — Edelstahl 18/10 | NOVA INDUKT',
    metaDescription: 'Rösle Stainless Steel Turner 30 cm aus Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Rösle Edelstahl — Turner',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // ZWILLING NOW S
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'zwilling-now-s-kuechenzange',
    supplierSku: 'ZWI-NS-KZ',
    sortOrder: 15,
    nameDe: 'Zwilling Now S Küchenzange',
    shortDescription: 'Vielseitige Küchenzange mit Silikongriff — 28 cm, spülmaschinenfest',
    descriptionDe: `Die Zwilling Now S Küchenzange ist ein unverzichtbares Utensil für alle Küchenenthusiasten. Die Kombination aus rostfreiem Edelstahl und ergonomischem Silikongriff macht sie zum idealen Begleiter beim Kochen und Servieren.

**Merkmale:**
- Rostfreier Edelstahl mit ergonomischem Silikongriff
- Langer Griff (28 cm) für sicheren Abstand
- Praktischer Öffnungsmechanismus mit Feder
- Vielseitig einsetzbar für Kochen und Servieren
- Spülmaschinengeeignet
- Teil der Now S-Serie
- Ergonomischer Griff für sicheren Halt

Die Küchenzange aus der Zwilling Now S-Serie besticht durch ihre hochwertige Materialkombination. Der weiche Silikongriff liegt angenehm in der Hand, während die robuste Edelstahlkonstruktion für Langlebigkeit sorgt.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Zwilling',
    material: 'Edelstahl + Silikongriff',
    dimensions: '28 cm',
    weightKg: 0.1,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Now S Serie'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Küchenzange 28 cm — Edelstahl + Silikongriff | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Küchenzange 28 cm mit Silikongriff. Spülmaschinenfest, Teil der Now S-Serie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Zwilling Now S — Küchenzange',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-now-s-schaumkelle',
    supplierSku: 'ZWI-NS-SK',
    sortOrder: 16,
    nameDe: 'Zwilling Now S Schaumkelle',
    shortDescription: 'Funktionale Schaumkelle mit Silikongriff — 28 cm, spülmaschinenfest',
    descriptionDe: `Die Zwilling Now S Schaumkelle ist ein praktisches Utensil für alle, die Wert auf ein sauberes und elegantes Servieren legen. Die Kombination aus Edelstahl und Silikongriff macht sie zum idealen Begleiter beim Entschäumen und Servieren.

**Merkmale:**
- Rostfreier Edelstahl mit ergonomischem Silikongriff
- Perforierte Kelle zum effektiven Entschäumen
- Langer Griff (28 cm) für sicheren Abstand
- Ideal für Suppen, Saucen und Brühen
- Spülmaschinengeeignet
- Teil der Now S-Serie
- Ergonomischer Griff für sicheren Halt

Die Schaumkelle aus der Zwilling Now S-Serie überzeugt durch ihre funktionalen Details. Die feinen Öffnungen in der Kellenfläche lassen Flüssigkeit hindurch, während Schaum und feste Partikel zurückgehalten werden.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'Zwilling',
    material: 'Edelstahl + Silikongriff',
    dimensions: '28 cm',
    weightKg: 0.08,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Now S Serie'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Schaumkelle 28 cm — Edelstahl + Silikongriff | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Schaumkelle 28 cm mit Silikongriff. Spülmaschinenfest, Teil der Now S-Serie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Zwilling Now S — Schaumkelle',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-now-s-kochloeffel',
    supplierSku: 'ZWI-NS-KL',
    sortOrder: 17,
    nameDe: 'Zwilling Now S Kochlöffel',
    shortDescription: 'Eleganter Kochlöffel mit Silikongriff — 28 cm, spülmaschinenfest',
    descriptionDe: `Der Zwilling Now S Kochlöffel ist ein Multitalent in der Küche. Die Kombination aus rostfreiem Edelstahl und ergonomischem Silikongriff macht ihn zum idealen Begleiter beim Kochen und Servieren.

**Merkmale:**
- Rostfreier Edelstahl mit ergonomischem Silikongriff
- Langer Griff (28 cm) für sicheren Abstand
- Universell einsetzbar für Rühren, Schöpfen und Servieren
- Spülmaschinengeeignet
- Teil der Now S-Serie
- Ergonomischer Griff für sicheren Halt
- Passend zur gesamten Now S-Serie

Der Kochlöffel aus der Zwilling Now S-Serie besticht durch seine vielseitige Einsetzbarkeit. Die glatte Edelstahloberfläche ermöglicht ein müheloses Reinigen, während der weiche Silikongriff für komfortables Arbeiten sorgt.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'Zwilling',
    material: 'Edelstahl + Silikongriff',
    dimensions: '28 cm',
    weightKg: 0.08,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Now S Serie'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Kochlöffel 28 cm — Edelstahl + Silikongriff | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Kochlöffel 28 cm mit Silikongriff. Spülmaschinenfest, Teil der Now S-Serie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Zwilling Now S — Kochlöffel',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-now-s-schneebesen',
    supplierSku: 'ZWI-NS-SB',
    sortOrder: 18,
    nameDe: 'Zwilling Now S Schneebesen',
    shortDescription: 'Robuster Schneebesen mit Silikongriff — 28 cm, spülmaschinenfest',
    descriptionDe: `Der Zwilling Now S Schneebesen ist das ideale Utensil für alle, die gerne backen und kochen. Die Kombination aus rostfreiem Edelstahl und ergonomischem Silikongriff macht ihn zum perfekten Begleiter beim Schlagen und Verrühren.

**Merkmale:**
- Rostfreier Edelstahl mit ergonomischem Silikongriff
- Langer Griff (28 cm) für sicheren Abstand
- Robuste Drähte für effizientes Schlagen
- Ideal zum Schlagen von Eiern, Sahne und Teig
- Spülmaschinengeeignet
- Teil der Now S-Serie
- Ergonomischer Griff für sicheren Halt

Der Schneebesen aus der Zwilling Now S-Serie überzeugt durch seine robuste Bauweise. Die stabilen Edelstahldrähte ermöglichen ein effizientes Schlagen und Verrühren, während der weiche Silikongriff für komfortables Arbeiten sorgt.`,
    price: 11.99,
    oldPrice: 14.99,
    brand: 'Zwilling',
    material: 'Edelstahl + Silikongriff',
    dimensions: '28 cm',
    weightKg: 0.09,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Now S Serie'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Schneebesen 28 cm — Edelstahl + Silikongriff | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Schneebesen 28 cm mit Silikongriff. Spülmaschinenfest, Teil der Now S-Serie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Zwilling Now S — Schneebesen',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // WMF & FISSLER ZUSÄTZLICHE PRODUKTE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'wmf-profi-plus-siebloeffel',
    supplierSku: 'WMF-PP-SL',
    sortOrder: 19,
    nameDe: 'WMF Profi Plus Sieblöffel',
    shortDescription: 'Praktischer Sieblöffel aus Cromargan® Edelstahl — 30 cm, spülmaschinenfest',
    descriptionDe: `Der WMF Profi Plus Sieblöffel ist ein unverzichtbares Utensil für alle, die Wert auf ein sauberes und effizientes Arbeiten in der Küche legen. Die Kombination aus Sieb und Löffel ermöglicht ein gleichzeitiges Schöpfen und Abtropfen.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — rostfrei und langlebig
- Integriertes Sieb zum Abtropfen von Speisen
- Langer Griff (30 cm) für sicheren Abstand
- Perfekt zum Schöpfen von Gemüse und Nudeln
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Passend zur Profi Plus-Serie

Der Sieblöffel aus der WMF Profi Plus-Serie besticht durch seine durchdachte Kombination aus Sieb und Löffel. Die feinen Öffnungen lassen Wasser hindurch, während feste Speisereste zurückgehalten werden.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.12,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Sieblöffel 30 cm — Cromargan® Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Sieblöffel 30 cm aus Cromargan® Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus — Sieblöffel',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-pure-collection-kartoffelstoessel',
    supplierSku: 'FIS-PC-KS',
    sortOrder: 20,
    nameDe: 'Fissler Pure Collection Kartoffelstößel',
    shortDescription: 'Robuster Kartoffelstößel aus Edelstahl 18/10 — 30 cm, spülmaschinenfest',
    descriptionDe: `Der Fissler Pure Collection Kartoffelstößel ist ein spezialisiertes Küchenutensil für die Zubereitung von Kartoffelpüree und anderen pürierten Speisen. Seine robuste Konstruktion und die durchdachte Form ermöglichen ein effizientes und ergonomisches Stößen.

**Merkmale:**
- Edelstahl 18/10 — rostfrei, robust, langlebig
- Spezielle Form für effizientes Stößen
- Langer Griff (30 cm) für sicheren Abstand
- Ergonomisches Design für komfortables Arbeiten
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Ideal für Kartoffelpüree und Mousseline

Der Kartoffelstößel aus der Fissler Pure Collection besticht durch seine spezielle Formgebung. Die flache, breite Stößelfläche ermöglicht ein gleichmäßiges und effizientes Zerdrücken von Kartoffeln und anderen Speisen, während der ergonomische Griff für komfortables Arbeiten sorgt.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '30 cm',
    weightKg: 0.15,
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Kartoffelstößel'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Fissler Pure Collection Kartoffelstößel 30 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Pure Collection Kartoffelstößel 30 cm aus Edelstahl 18/10. Spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Fissler Pure Collection — Kartoffelstößel',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Ustensiles : Küchenutensilien (20 Produkte)')
  console.log('─'.repeat(60))

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
        console.log(`  ↻  [${updated + created}/${products.length}] MIS À JOUR : ${p.nameDe.substring(0, 55)}`)
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
    console.log('\n🎉 Seed Ustensiles terminé avec succès !')
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
