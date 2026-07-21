/**
 * NOVA INDUKT — Seed Extra : 8 Induktionspfannen
 * Exécuter avec : npx tsx prisma/seed-products-pfannen-extra.ts
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
  // sortOrder metadata: 27-34
  {
    sortOrder: 27,
    slug: 'fissler-adamant-plus-bratpfanne-24cm',
    supplierSku: 'FIS-ADP-BP24',
    nameDe: 'Fissler Adamant Plus Bratpfanne 24 cm',
    shortDescription: 'Aluminium-Bratpfanne mit Adamant-Keramikbeschichtung — Made in Germany',
    descriptionDe: `Die Fissler Adamant Plus Bratpfanne 24 cm vereint deutsche Qualität mit modernster Keramik-Antihafttechnologie. Die Adamant-Keramikbeschichtung ist besonders kratzfest und langlebig.

**Merkmale:**
- Aluminiumkörper mit Adamant-Keramik-Antihaftbeschichtung
- Ferromagnetischer Edelstahlboden — perfekt für Induktion
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- PFAS-frei

Kompakte Pfanne für schnelle Alltagsgerichte auf dem Induktionskochfeld.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'Fissler',
    material: 'Aluminium mit Adamant-Keramikbeschichtung',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Made in Germany', 'Keramikbeschichtung'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Adamant Plus Bratpfanne 24 cm — Keramik Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Fissler Adamant Plus Bratpfanne 24 cm mit Keramikbeschichtung, induktionsgeeignet, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Fissler Adamant Plus Bratpfanne — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 28,
    slug: 'fissler-adamant-plus-bratpfanne-28cm',
    supplierSku: 'FIS-ADP-BP28',
    nameDe: 'Fissler Adamant Plus Bratpfanne 28 cm',
    shortDescription: 'Aluminium-Bratpfanne mit Adamant-Keramikbeschichtung — Made in Germany',
    descriptionDe: `Die Fissler Adamant Plus Bratpfanne 28 cm bietet mehr Platz für größere Gerichte und überzeugt durch ihre Adamant-Keramikbeschichtung.

**Merkmale:**
- Aluminiumkörper mit Adamant-Keramik-Antihaftbeschichtung
- Ferromagnetischer Edelstahlboden — perfekt für Induktion
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- PFAS-frei

Die größere Version für Familien und ambitionierte Köche.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Fissler',
    material: 'Aluminium mit Adamant-Keramikbeschichtung',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['Made in Germany', 'Keramikbeschichtung'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Adamant Plus Bratpfanne 28 cm — Keramik Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Fissler Adamant Plus Bratpfanne 28 cm mit Keramikbeschichtung, induktionsgeeignet, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Fissler Adamant Plus Bratpfanne — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 29,
    slug: 'wmf-diadem-plus-bratpfanne-24cm',
    supplierSku: 'WMF-DP-BP24',
    nameDe: 'WMF Diadem Plus Bratpfanne 24 cm',
    shortDescription: 'Aluminium-Bratpfanne mit Keramik-Innenbeschichtung — Made in Germany',
    descriptionDe: `Die WMF Diadem Plus Bratpfanne 24 cm besticht durch ihre hochwertige Keramik-Innenbeschichtung und den bewährten WMF-Qualitätsanspruch.

**Merkmale:**
- Aluminiumkörper mit Keramik-Innenbeschichtung
- Ferromagnetischer Induktionsboden
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- PFAS-frei

Kompakte und leicht bedienbare Pfanne für die Induktionsküche.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'WMF',
    material: 'Aluminium mit Keramikbeschichtung',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.3,
    badges: ['Made in Germany', 'Keramik-Innenbeschichtung'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Bratpfanne 24 cm — Keramik Induktionspfanne | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Bratpfanne 24 cm mit Keramikbeschichtung, induktionsgeeignet, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'WMF Diadem Plus Bratpfanne — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 30,
    slug: 'wmf-diadem-plus-bratpfanne-28cm',
    supplierSku: 'WMF-DP-BP28',
    nameDe: 'WMF Diadem Plus Bratpfanne 28 cm',
    shortDescription: 'Aluminium-Bratpfanne mit Keramik-Innenbeschichtung — Made in Germany',
    descriptionDe: `Die WMF Diadem Plus Bratpfanne 28 cm bietet großzügigen Kochplatz mit zuverlässiger Keramik-Antihaftwirkung.

**Merkmale:**
- Aluminiumkörper mit Keramik-Innenbeschichtung
- Ferromagnetischer Induktionsboden
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- PFAS-frei

Die Standardgröße für vielseitiges Kochen auf Induktion.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'WMF',
    material: 'Aluminium mit Keramikbeschichtung',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.6,
    badges: ['Made in Germany', 'Keramik-Innenbeschichtung'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Bratpfanne 28 cm — Keramik Induktionspfanne | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Bratpfanne 28 cm mit Keramikbeschichtung, induktionsgeeignet, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'WMF Diadem Plus Bratpfanne — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 31,
    slug: 'tefal-talent-pro-bratpfanne-26cm',
    supplierSku: 'TEF-TPRO-BP26',
    nameDe: 'Tefal Talent Pro Bratpfanne 26 cm',
    shortDescription: 'Leichtgewicht-Aluminium mit Titanium-Antihaft und Thermo-Signal',
    descriptionDe: `Die Tefal Talent Pro Bratpfanne 26 cm überzeugt durch ihre Titanium-verstärkte Antihaftbeschichtung und den praktischen Thermo-Spot-Temperaturindikator.

**Merkmale:**
- Aluminiumkörper mit Titanium-Antihaftbeschichtung
- Thermo-Spot-Temperaturindikator
- Ferromagnetischer Induktionsboden
- Spülmaschinengeeignet
- Ohne PFOA

Leichte und zuverlässige Pfanne für den Induktionsherd.`,
    price: 44.99,
    oldPrice: 59.99,
    brand: 'Tefal',
    material: 'Aluminium mit Titanium-Antihaft',
    dimensions: 'Ø 26 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.1,
    badges: ['Thermo-Signal', 'Titanium'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Tefal Talent Pro Bratpfanne 26 cm — Titanium Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Tefal Talent Pro Bratpfanne 26 cm mit Titanium-Antihaft und Thermo-Spot, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Tefal Talent Pro Bratpfanne — 26 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 32,
    slug: 'tefal-talent-pro-bratpfanne-28cm',
    supplierSku: 'TEF-TPRO-BP28',
    nameDe: 'Tefal Talent Pro Bratpfanne 28 cm',
    shortDescription: 'Leichtgewicht-Aluminium mit Titanium-Antihaft und Thermo-Signal',
    descriptionDe: `Die Tefal Talent Pro Bratpfanne 28 cm bietet mehr Kochfläche bei bewährter Titanium-Qualität.

**Merkmale:**
- Aluminiumkörper mit Titanium-Antihaftbeschichtung
- Thermo-Spot-Temperaturindikator
- Ferromagnetischer Induktionsboden
- Spülmaschinengeeignet
- Ohne PFOA

Die größere Variante für mehr Platz beim Kochen.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Tefal',
    material: 'Aluminium mit Titanium-Antihaft',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.3,
    badges: ['Thermo-Signal', 'Titanium'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Tefal Talent Pro Bratpfanne 28 cm — Titanium Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Tefal Talent Pro Bratpfanne 28 cm mit Titanium-Antihaft und Thermo-Spot, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Tefal Talent Pro Bratpfanne — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 33,
    slug: 'zwilling-summit-plus-bratpfanne-24cm',
    supplierSku: 'ZWI-SUMP-BP24',
    nameDe: 'Zwilling Summit+ Bratpfanne 24 cm',
    shortDescription: 'Aluminium-Bratpfanne mit Keramikbeschichtung — PFAS-frei',
    descriptionDe: `Die Zwilling Summit+ Bratpfanne 24 cm besticht durch ihre Keramik-Antihaftbeschichtung und den PFAS-freien Aufbau.

**Merkmale:**
- Aluminiumkörper mit Keramik-Antihaftbeschichtung
- Ferromagnetischer Induktionsboden
- Spülmaschinengeeignet
- PFAS-frei
- Leichtes Design

Kompakte, umweltfreundliche Pfanne für die Induktionsküche.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Zwilling',
    material: 'Aluminium mit Keramikbeschichtung',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.2,
    badges: ['Keramikbeschichtung', 'PFAS-frei'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Summit+ Bratpfanne 24 cm — Keramik Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Zwilling Summit+ Bratpfanne 24 cm mit Keramikbeschichtung, PFAS-frei, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Zwilling Summit Plus Bratpfanne — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 34,
    slug: 'zwilling-summit-plus-bratpfanne-28cm',
    supplierSku: 'ZWI-SUMP-BP28',
    nameDe: 'Zwilling Summit+ Bratpfanne 28 cm',
    shortDescription: 'Aluminium-Bratpfanne mit Keramikbeschichtung — PFAS-frei',
    descriptionDe: `Die Zwilling Summit+ Bratpfanne 28 cm bietet großzügigen Kochplatz mit PFAS-freier Keramikbeschichtung.

**Merkmale:**
- Aluminiumkörper mit Keramik-Antihaftbeschichtung
- Ferromagnetischer Induktionsboden
- Spülmaschinengeeignet
- PFAS-frei
- Leichtes Design

Die Standardgröße für vielseitiges Kochen auf Induktion.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'Zwilling',
    material: 'Aluminium mit Keramikbeschichtung',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Keramikbeschichtung', 'PFAS-frei'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Summit+ Bratpfanne 28 cm — Keramik Induktionspfanne | NOVA INDUKT',
    metaDescription: 'Zwilling Summit+ Bratpfanne 28 cm mit Keramikbeschichtung, PFAS-frei, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Zwilling Summit Plus Bratpfanne — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Induktionspfannen (8 Produkte)')
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
    console.log('\n🎉 Batch Pfannen Extra terminé avec succès !')
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
