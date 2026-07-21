/**
 * NOVA INDUKT — Seed Extra : 6 Kochfelder
 * Exécuter avec : npx tsx prisma/seed-products-kochfelder-extra.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  // sortOrder metadata: 11-16
  {
    sortOrder: 11,
    slug: 'bosch-serie-6-induktionskochfeld-60cm',
    supplierSku: 'BOS-S6-IK60',
    nameDe: 'Bosch Serie 6 Induktionskochfeld 60 cm',
    shortDescription: 'Induktionskochfeld mit FlexZone — 2 Kochfelder, 60 cm',
    descriptionDe: `Das Bosch Serie 6 Induktionskochfeld 60 cm bietet die innovative FlexZone-Technologie für maximale Flexibilität beim Kochen.

**Merkmale:**
- Glaskeramik-Oberfläche
- 2 Kochfelder + FlexZone
- FlexZone — kombinierbar zu einer großen Kochfläche
- 60×52 cm Einbaumaß
- Induktionskompatibel

Das moderne Kochfeld für die Einbauküche.`,
    price: 599.00,
    oldPrice: 699.00,
    brand: 'Bosch',
    material: 'Glaskeramik',
    dimensions: '60×52 cm, 2 Kochfelder + FlexZone',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 10.0,
    badges: ['Bosch Qualität', 'FlexZone'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Bosch Serie 6 Induktionskochfeld 60 cm — FlexZone | NOVA INDUKT',
    metaDescription: 'Bosch Serie 6 Induktionskochfeld 60 cm mit FlexZone und 2 Kochfeldern. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Bosch Serie 6 Induktionskochfeld — 60 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 12,
    slug: 'siemens-iq700-induktionskochfeld-60cm',
    supplierSku: 'SIEM-IQ7-IK60',
    nameDe: 'Siemens iQ700 Induktionskochfeld 60 cm',
    shortDescription: 'Premium-Induktionskochfeld mit flexInduction — 60 cm',
    descriptionDe: `Das Siemens iQ700 Induktionskochfeld 60 cm bietet die exklusive flexInduction-Technologie für maximale Kochflexibilität.

**Merkmale:**
- Glaskeramik-Oberfläche
- 2 Kochfelder mit flexInduction
- 60×52 cm Einbaumaß
- Premium-Qualität
- Induktionskompatibel

Das Premium-Kochfeld für anspruchsvolle Köche.`,
    price: 699.00,
    oldPrice: 799.00,
    brand: 'Siemens',
    material: 'Glaskeramik',
    dimensions: '60×52 cm, 2 Kochfelder',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 10.5,
    badges: ['iQ700', 'flexInduction'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Siemens iQ700 Induktionskochfeld 60 cm — flexInduction | NOVA INDUKT',
    metaDescription: 'Siemens iQ700 Induktionskochfeld 60 cm mit flexInduction. Premium-Qualität. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Siemens iQ700 Induktionskochfeld — 60 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 13,
    slug: 'neff-induktionskochfeld-60cm',
    supplierSku: 'NEF-IK60',
    nameDe: 'Neff Induktionskochfeld 60 cm',
    shortDescription: 'Induktionskochfeld mit powerBoost — 2 Kochfelder, 60 cm',
    descriptionDe: `Das Neff Induktionskochfeld 60 cm bietet die powerBoost-Funktion für schnelles Aufheizen und Kochen.

**Merkmale:**
- Glaskeramik-Oberfläche
- 2 Kochfelder
- powerBoost-Funktion
- 60×52 cm Einbaumaß
- Induktionskompatibel

Das zuverlässige Kochfeld mit Leistungsreserve.`,
    price: 499.00,
    oldPrice: 599.00,
    brand: 'Neff',
    material: 'Glaskeramik',
    dimensions: '60×52 cm, 2 Kochfelder',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 10.0,
    badges: ['Neff Qualität', 'powerBoost'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Neff Induktionskochfeld 60 cm — powerBoost | NOVA INDUKT',
    metaDescription: 'Neff Induktionskochfeld 60 cm mit powerBoost-Funktion. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Neff Induktionskochfeld — 60 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 14,
    slug: 'aeg-induktionskochfeld-60cm',
    supplierSku: 'AEG-IK60',
    nameDe: 'AEG Induktionskochfeld 60 cm',
    shortDescription: 'Induktionskochfeld mit MaxiSense — 2 Kochfelder, 60 cm',
    descriptionDe: `Das AEG Induktionskochfeld 60 cm bietet die MaxiSense-Technologie für automatische Erkennung der Kochgeschirrgröße.

**Merkmale:**
- Glaskeramik-Oberfläche
- 2 Kochfelder
- MaxiSense — automatische Kochgeschirrerkenntnis
- 60×52 cm Einbaumaß
- Induktionskompatibel

Das intelligent Kochfeld für effizientes Kochen.`,
    price: 449.00,
    oldPrice: 549.00,
    brand: 'AEG',
    material: 'Glaskeramik',
    dimensions: '60×52 cm, 2 Kochfelder',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 10.0,
    badges: ['AEG Qualität', 'MaxiSense'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'AEG Induktionskochfeld 60 cm — MaxiSense | NOVA INDUKT',
    metaDescription: 'AEG Induktionskochfeld 60 cm mit MaxiSense-Technologie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'AEG Induktionskochfeld — 60 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 15,
    slug: 'ikea-mittled-induktionskochfeld-60cm',
    supplierSku: 'IKEA-MIT-IK60',
    nameDe: 'IKEA MITTLED Induktionskochfeld 60 cm',
    shortDescription: 'Induktionskochfeld mit 2 Kochfeldern — günstig und zuverlässig',
    descriptionDe: `Das IKEA MITTLED Induktionskochfeld 60 cm bietet günstige Qualität für die Einbauküche.

**Merkmale:**
- Glaskeramik-Oberfläche
- 2 Kochfelder
- 60×52 cm Einbaumaß
- Günstiger Preis
- Induktionskompatibel

Das preiswerte Kochfeld für Jedermann.`,
    price: 299.00,
    oldPrice: 349.00,
    brand: 'IKEA',
    material: 'Glaskeramik',
    dimensions: '60×52 cm, 2 Kochfelder',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 9.5,
    badges: ['IKEA', 'Günstig'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'IKEA MITTLED Induktionskochfeld 60 cm — Günstig | NOVA INDUKT',
    metaDescription: 'IKEA MITTLED Induktionskochfeld 60 cm — günstig und zuverlässig. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'IKEA MITTLED Induktionskochfeld — 60 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 16,
    slug: 'amzchef-induktionskochfeld-2-kochfeld',
    supplierSku: 'AMZ-2K-IK',
    nameDe: 'AMZCHEF Induktionskochfeld 2-Kochfeld',
    shortDescription: 'Tragbares 2-Kochfeld-Induktionskochfeld — kompakt und mobil',
    descriptionDe: `Das AMZCHEF Induktionskochfeld mit 2 Kochfeldern ist ideal für kleine Küchen, WG-Zimmer oder als zusätzliche Kochstelle.

**Merkmale:**
- Glaskeramik-Oberfläche
- 2 Kochfelder
- 59×36 cm
- Tragbar und mobil
- Induktionskompatibel

Das kompakte Kochfeld für unterwegs oder als Zusatzstelle.`,
    price: 89.99,
    oldPrice: 119.99,
    brand: 'AMZCHEF',
    material: 'Glaskeramik',
    dimensions: '59×36 cm, 2 Kochfelder',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.5,
    badges: ['2 Kochfelder', 'Tragbar'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'AMZCHEF Induktionskochfeld 2-Kochfeld — Tragbar | NOVA INDUKT',
    metaDescription: 'AMZCHEF Induktionskochfeld mit 2 Kochfeldern — tragbar und kompakt. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'AMZCHEF Induktionskochfeld — 2 Kochfeld',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Kochfelder (6 Produkte)')
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
    console.log('\n🎉 Batch Kochfelder Extra terminé avec succès !')
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
