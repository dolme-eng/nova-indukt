/**
 * NOVA INDUKT — Seed Batch : 10 Bestecke
 * Exécuter avec : npx tsx prisma/seed-products-bestecke.ts
 *
 * Catégories couvertes :
 *   - Bestecksets (Prods 1–8)
 *   - Messersets (Prods 9–10)
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
  // ══════════════════════════════════════════════════════════════
  // BESTECKSETS
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'wmf-monde-bestechenset-68-teilig',
    supplierSku: 'WMF-MON-BS68',
    nameDe: 'WMF Monde Bestechenset 68-teilig',
    shortDescription: 'Premium-Besteckset 68-teilig für 12 Personen — Cromargan® Edelstahl, Made in Germany',
    descriptionDe: `Das WMF Monde Bestechenset 68-teilig ist das ultimative Besteckset für anspruchsvolle Tischkultur. Cromargan® Edelstahl in Premium-Qualität, hergestellt in Deutschland.

**Merkmale:**
- 68-teilig für 12 Personen
- Cromargan® Edelstahl — rostfrei, spülmaschinenfest
- Hergestellt in Deutschland
- Zeitloses, elegantes Design
- Hochwertige Verarbeitung
- Perfekt für feierliche Anlässe

Das Premium-Besteck für besondere Momente am Tisch.`,
    price: 179.99,
    oldPrice: 219.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.5,
    badges: ['Made in Germany', '12 Personen', 'Premium'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'WMF Monde Bestechenset 68-teilig — 12 Personen, Premium | NOVA INDUKT',
    metaDescription: 'WMF Monde Bestechenset 68-teilig für 12 Personen — Cromargan®, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Monde Bestechenset 68-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wmf-monde-bestechenset-30-teilig',
    supplierSku: 'WMF-MON-BS30',
    nameDe: 'WMF Monde Bestechenset 30-teilig (6 Pers.)',
    shortDescription: 'Premium-Besteckset 30-teilig für 6 Personen — Cromargan® Edelstahl, Made in Germany',
    descriptionDe: `Das WMF Monde Bestechenset 30-teilig bietet Premium-Qualität für 6 Personen. Cromargan® Edelstahl in bewährter WMF-Qualität, hergestellt in Deutschland.

**Merkmale:**
- 30-teilig für 6 Personen
- Cromargan® Edelstahl — rostfrei, spülmaschinenfest
- Hergestellt in Deutschland
- Zeitloses, elegantes Design
- Hochwertige Verarbeitung
- Ideal für den Alltag

Das Premium-Besteck für den täglichen Gebrauch.`,
    price: 89.99,
    oldPrice: 109.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '30-teilig (6 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['Made in Germany', '6 Personen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Monde Bestechenset 30-teilig — 6 Personen, Made in Germany | NOVA INDUKT',
    metaDescription: 'WMF Monde Bestechenset 30-teilig für 6 Personen — Cromargan®, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Monde Bestechenset 30-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wmf-function-4-bestechenset-68-teilig',
    supplierSku: 'WMF-F4-BS68',
    nameDe: 'WMF Function 4 Bestechenset 68-teilig',
    shortDescription: 'Besteckset 68-teilig für 12 Personen — Cromargan® Edelstahl, Made in Germany',
    descriptionDe: `Das WMF Function 4 Bestechenset 68-teilig bietet bewährte Qualität für 12 Personen. Cromargan® Edelstahl in funktionallem Design, hergestellt in Deutschland.

**Merkmale:**
- 68-teilig für 12 Personen
- Cromargan® Edelstahl — rostfrei, spülmaschinenfest
- Hergestellt in Deutschland
- Funktional-schlichtes Design
- Hochwertige Verarbeitung
- Ideal für große Familien

Die funktional-elegante Wahl für Familien und Feierlichkeiten.`,
    price: 129.99,
    oldPrice: 159.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.5,
    badges: ['Made in Germany', '12 Personen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Bestechenset 68-teilig — 12 Personen | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Bestechenset 68-teilig für 12 Personen — Cromargan®, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Function 4 Bestechenset 68-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wmf-function-4-bestechenset-30-teilig',
    supplierSku: 'WMF-F4-BS30',
    nameDe: 'WMF Function 4 Bestechenset 30-teilig (6 Pers.)',
    shortDescription: 'Besteckset 30-teilig für 6 Personen — Cromargan® Edelstahl, Made in Germany',
    descriptionDe: `Das WMF Function 4 Bestechenset 30-teilig bietet bewährte Qualität für 6 Personen. Cromargan® Edelstahl in funktionallem Design, hergestellt in Deutschland.

**Merkmale:**
- 30-teilig für 6 Personen
- Cromargan® Edelstahl — rostfrei, spülmaschinenfest
- Hergestellt in Deutschland
- Funktional-schlichtes Design
- Hochwertige Verarbeitung
- Ideal für kleine Haushalte

Die funktional-elegante Wahl für den täglichen Gebrauch.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '30-teilig (6 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['Made in Germany', '6 Personen'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Bestechenset 30-teilig — 6 Personen | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Bestechenset 30-teilig für 6 Personen — Cromargan®, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Function 4 Bestechenset 30-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'zwilling-spirit-bestechenset-68-teilig',
    supplierSku: 'ZWI-SPIR-BS68',
    nameDe: 'Zwilling Spirit Bestechenset 68-teilig',
    shortDescription: 'Besteckset 68-teilig für 12 Personen — Edelstahl 18/10, Spirit Serie',
    descriptionDe: `Das Zwilling Spirit Bestechenset 68-teilig bietet Premium-Qualität für 12 Personen. Edelstahl 18/10 in der eleganten Spirit-Serie.

**Merkmale:**
- 68-teilig für 12 Personen
- Edelstahl 18/10 — rostfrei, spülmaschinenfest
- Elegante Spirit-Serie
- Hochwertige Verarbeitung
- Zeitloses Design
- Ideal für feierliche Anlässe

Das elegante Besteck für besondere Momente am Tisch.`,
    price: 149.99,
    oldPrice: 189.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.0,
    badges: ['Spirit Serie', '12 Personen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Bestechenset 68-teilig — 12 Personen, Spirit Serie | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Bestechenset 68-teilig für 12 Personen — Edelstahl 18/10, Spirit Serie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Spirit Bestechenset 68-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'zwilling-spirit-bestechenset-30-teilig',
    supplierSku: 'ZWI-SPIR-BS30',
    nameDe: 'Zwilling Spirit Bestechenset 30-teilig (6 Pers.)',
    shortDescription: 'Besteckset 30-teilig für 6 Personen — Edelstahl 18/10, Spirit Serie',
    descriptionDe: `Das Zwilling Spirit Bestechenset 30-teilig bietet Premium-Qualität für 6 Personen. Edelstahl 18/10 in der eleganten Spirit-Serie.

**Merkmale:**
- 30-teilig für 6 Personen
- Edelstahl 18/10 — rostfrei, spülmaschinenfest
- Elegante Spirit-Serie
- Hochwertige Verarbeitung
- Zeitloses Design
- Ideal für den Alltag

Das elegante Besteck für den täglichen Gebrauch.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: '30-teilig (6 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Spirit Serie', '6 Personen'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Bestechenset 30-teilig — 6 Personen, Spirit Serie | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Bestechenset 30-teilig für 6 Personen — Edelstahl 18/10, Spirit Serie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Spirit Bestechenset 30-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'zwilling-now-s-bestechenset-68-teilig',
    supplierSku: 'ZWI-NS-BS68',
    nameDe: 'Zwilling Now S Bestechenset 68-teilig',
    shortDescription: 'Besteckset 68-teilig für 12 Personen — Edelstahl 18/10, Now S Serie',
    descriptionDe: `Das Zwilling Now S Bestechenset 68-teilig bietet moderne Qualität für 12 Personen. Edelstahl 18/10 in der zeitgemäßen Now S-Serie.

**Merkmale:**
- 68-teilig für 12 Personen
- Edelstahl 18/10 — rostfrei, spülmaschinenfest
- Zeitgemäße Now S-Serie
- Hochwertige Verarbeitung
- Modernes, schlichtes Design
- Ideal für feierliche Anlässe

Das moderne Besteck für zeitgemäße Tischkultur.`,
    price: 99.99,
    oldPrice: 129.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.0,
    badges: ['Now S Serie', '12 Personen'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Bestechenset 68-teilig — 12 Personen, Now S Serie | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Bestechenset 68-teilig für 12 Personen — Edelstahl 18/10, Now S Serie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Now S Bestechenset 68-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'zwilling-now-s-bestechenset-30-teilig',
    supplierSku: 'ZWI-NS-BS30',
    nameDe: 'Zwilling Now S Bestechenset 30-teilig (6 Pers.)',
    shortDescription: 'Besteckset 30-teilig für 6 Personen — Edelstahl 18/10, Now S Serie, idealer Einstieg',
    descriptionDe: `Das Zwilling Now S Bestechenset 30-teilig bietet moderne Qualität für 6 Personen. Edelstahl 18/10 in der zeitgemäßen Now S-Serie — ideal als Einstiegs-Besteck.

**Merkmale:**
- 30-teilig für 6 Personen
- Edelstahl 18/10 — rostfrei, spülmaschinenfest
- Zeitgemäße Now S-Serie
- Hochwertige Verarbeitung
- Modernes, schlichtes Design
- Ideal als Einstieg

Das moderne Einstiegs-Besteck für junge Haushalte.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: '30-teilig (6 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Now S Serie', '6 Personen', 'Einsteiger'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Bestechenset 30-teilig — 6 Personen, Einsteiger | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Bestechenset 30-teilig für 6 Personen — Edelstahl 18/10, Now S, idealer Einstieg. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Now S Bestechenset 30-teilig',
    imageFiles: ['1.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // MESSERSETS
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'wmf-monde-messerset-3-teilig',
    supplierSku: 'WMF-MON-MS3',
    nameDe: 'WMF Monde Messerset 3-teilig',
    shortDescription: 'Premium-Messerset 3-teilig — Kochmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm',
    descriptionDe: `Das WMF Monde Messerset 3-teilig bietet die wichtigsten Küchenmesser in Premium-Qualität. Cromargan® Edelstahl, hergestellt in Deutschland.

**Merkmale:**
- 3-teilig: Kochmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm
- Cromargan® Edelstahl — rostfrei
- Hergestellt in Deutschland
- Ergonomischer Griff
- Scharfe Klinge für präzises Schneiden
- Hochwertige Verarbeitung

Die drei unverzichtbaren Messer für jede Küche.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '3-teilig (Kochmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.5,
    badges: ['Made in Germany', '3-teilig'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Monde Messerset 3-teilig — Cromargan®, Made in Germany | NOVA INDUKT',
    metaDescription: 'WMF Monde Messerset 3-teilig — Kochmesser, Universalmesser, Schärfmesser. Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Monde Messerset 3-teilig',
    imageFiles: ['1.png'],
  },

  {
    slug: 'zwilling-pro-s-messerset-3-teilig',
    supplierSku: 'ZWI-PROS-MS3',
    nameDe: 'Zwilling Pro S Messerset 3-teilig',
    shortDescription: 'Professionelles Messerset 3-teilig — Friodur® Edelstahl, Made in Germany',
    descriptionDe: `Das Zwilling Pro S Messerset 3-teilig bietet professionelle Küchenmesser in Premium-Qualität. Friodur® Edelstahl, hergestellt in Deutschland.

**Merkmale:**
- 3-teilig: Kochmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm
- Friodur® Edelstahl — rostfrei, besonders hart
- Hergestellt in Deutschland
- Ergonomischer Griff
- Scharfe Klinge für präzises Schneiden
- Hochwertige Verarbeitung

Die drei unverzichtbaren Messer für anspruchsvolle Köche.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '3-teilig (Kochmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.45,
    badges: ['Made in Germany', 'Friodur®'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Pro S Messerset 3-teilig — Friodur®, Made in Germany | NOVA INDUKT',
    metaDescription: 'Zwilling Pro S Messerset 3-teilig — Friodur® Edelstahl, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Pro S Messerset 3-teilig',
    imageFiles: ['1.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Bestecke (10 Produkte)')
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
    console.log('\n🎉 Batch Bestecke terminé avec succès !')
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
