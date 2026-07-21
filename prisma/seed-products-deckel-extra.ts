/**
 * NOVA INDUKT — Seed Extra : Ersatzdeckel & Griffe (8 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-deckel-extra.ts
 *
 * Catégorie : deckel-griffe (sortOrder 16–23)
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
  {
    slug: 'wmf-professional-select-deckel-20cm',
    supplierSku: 'WMF-PS-D20',
    nameDe: 'WMF Professional Select Glasdeckel 20 cm',
    shortDescription: 'Premium-Glasdeckel für WMF Professional Select — Ø 20 cm',
    descriptionDe: 'Der WMF Professional Select Glasdeckel 20 cm ist der perfekte Ersatzdeckel für die Professional Select Serie. Hochwertiges Glas mit Edelstahlrand und Dampfauslass.',
    price: 34.99,
    oldPrice: 44.99,
    brand: 'WMF',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 20 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.5,
    badges: ['Professional Select', 'Made in Germany'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Professional Select Glasdeckel 20 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'WMF Professional Select Glasdeckel 20 cm. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'WMF Professional Select Deckel — 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'wmf-professional-select-deckel-24cm',
    supplierSku: 'WMF-PS-D24',
    nameDe: 'WMF Professional Select Glasdeckel 24 cm',
    shortDescription: 'Premium-Glasdeckel für WMF Professional Select — Ø 24 cm',
    descriptionDe: 'Der WMF Professional Select Glasdeckel 24 cm ist der perfekte Ersatzdeckel für die Professional Select Serie. Hochwertiges Glas mit Edelstahlrand und Dampfauslass.',
    price: 39.99,
    oldPrice: 49.99,
    brand: 'WMF',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Professional Select', 'Made in Germany'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Professional Select Glasdeckel 24 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'WMF Professional Select Glasdeckel 24 cm. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'WMF Professional Select Deckel — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-vitavit-deckel-22cm',
    supplierSku: 'FIS-VV-D22',
    nameDe: 'Fissler vitavit Glasdeckel 22 cm',
    shortDescription: 'Glasdeckel für Fissler vitavit Serie — Ø 22 cm',
    descriptionDe: 'Der Fissler vitavit Glasdeckel 22 cm passt perfekt zu Fissler vitavit Töpfen und Pfannen. Hochwertiges Glas mit Edelstahlrand und Dampfauslass.',
    price: 32.99,
    oldPrice: 39.99,
    brand: 'Fissler',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 22 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.5,
    badges: ['Passend für vitavit', 'Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler vitavit Glasdeckel 22 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Fissler vitavit Glasdeckel 22 cm. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Fissler vitavit Deckel — 22 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-vitavit-deckel-26cm',
    supplierSku: 'FIS-VV-D26',
    nameDe: 'Fissler vitavit Glasdeckel 26 cm',
    shortDescription: 'Glasdeckel für Fissler vitavit Serie — Ø 26 cm',
    descriptionDe: 'Der Fissler vitavit Glasdeckel 26 cm passt perfekt zu Fissler vitavit Töpfen und Pfannen. Hochwertiges Glas mit Edelstahlrand und Dampfauslass.',
    price: 37.99,
    oldPrice: 44.99,
    brand: 'Fissler',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 26 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['Passend für vitavit', 'Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler vitavit Glasdeckel 26 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Fissler vitavit Glasdeckel 26 cm. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Fissler vitavit Deckel — 26 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'zwilling-two-move-deckel-24cm',
    supplierSku: 'ZWI-TM-D24',
    nameDe: 'Zwilling Two Move Glasdeckel 24 cm',
    shortDescription: 'Glasdeckel für Zwilling Two Move Serie — Ø 24 cm',
    descriptionDe: 'Der Zwilling Two Move Glasdeckel 24 cm passt perfekt zu Zwilling Two Move Töpfen. Hochwertiges Glas mit Edelstahlrand und Dampfauslass.',
    price: 36.99,
    oldPrice: 44.99,
    brand: 'Zwilling',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Two Move Serie', 'Glas+Edelstahl'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Two Move Glasdeckel 24 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Zwilling Two Move Glasdeckel 24 cm. Spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Zwilling Two Move Deckel — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'zwilling-two-move-deckel-28cm',
    supplierSku: 'ZWI-TM-D28',
    nameDe: 'Zwilling Two Move Glasdeckel 28 cm',
    shortDescription: 'Glasdeckel für Zwilling Two Move Serie — Ø 28 cm',
    descriptionDe: 'Der Zwilling Two Move Glasdeckel 28 cm passt perfekt zu Zwilling Two Move Töpfen. Hochwertiges Glas mit Edelstahlrand und Dampfauslass.',
    price: 42.99,
    oldPrice: 52.99,
    brand: 'Zwilling',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Two Move Serie', 'Glas+Edelstahl'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Two Move Glasdeckel 28 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Zwilling Two Move Glasdeckel 28 cm. Spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Zwilling Two Move Deckel — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'demeyere-inducity-deckel-24cm',
    supplierSku: 'DEM-IND-D24',
    nameDe: 'Demeyere Inducity Glasdeckel 24 cm',
    shortDescription: 'Premium-Glasdeckel für Demeyere Inducity — Ø 24 cm',
    descriptionDe: 'Der Demeyere Inducity Glasdeckel 24 cm ist der passende Ersatzdeckel für die Inducity Serie. Premium-Glas mit Edelstahlrand und Dampfauslass.',
    price: 49.99,
    oldPrice: 59.99,
    brand: 'Demeyere',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['Inducity Serie', 'Made in Belgium'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Demeyere Inducity Glasdeckel 24 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Demeyere Inducity Glasdeckel 24 cm. Premium-Qualität, Made in Belgium, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Demeyere Inducity Deckel — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'stal-ersatzgriff-universal',
    supplierSku: 'STL-GR-UNI',
    nameDe: 'Stal Universal-Ersatzgriff',
    shortDescription: 'Universal-Ersatzgriff für Stal Pfannen und Töpfe',
    descriptionDe: 'Der Stal Universal-Ersatzgriff ist der perfekte Ersatz für abgenutzte oder beschädigte Griffe. Einfache Montage und robuste Verarbeitung.',
    price: 19.99,
    oldPrice: 24.99,
    brand: 'Stal',
    material: 'Edelstahl + Bakelit',
    dimensions: 'Universal-Passform',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Universal', 'Einfacher Austausch'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Stal Universal-Ersatzgriff — Edelstahl | NOVA INDUKT',
    metaDescription: 'Stal Universal-Ersatzgriff aus Edelstahl und Bakelit. Einfache Montage, robust. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Stal Universal-Ersatzgriff',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Ersatzdeckel & Griffe (8 Produkte)')
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
    console.log('\n🎉 Batch terminé avec succès !')
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
