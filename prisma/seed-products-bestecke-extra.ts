/**
 * NOVA INDUKT — Seed : Bestecke (8 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-bestecke-extra.ts
 *
 * Catégorie : bestecke (sortOrder 11–18)
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
    slug: 'wmf-monde-essbesteck-68-teilig',
    supplierSku: 'WMF-MON-EB68',
    nameDe: 'WMF Monde Essbesteck 68-teilig',
    shortDescription: 'Premium-Essbesteck aus Cromargan® Edelstahl — 68-teilig für 12 Personen',
    descriptionDe: `Das WMF Monde Essbesteck ist ein Meisterwerk deutschen Schmiedehandwerks. Aus Cromargan® Edelstahl gefertigt, verbindet es elegantes Design mit höchster Qualität. Das 68-teilige Set bietet Platz für 12 Personen und ist der perfekte Begleiter für festliche Anlässe.

**Merkmale:**
- 68-teilig — für 12 Personen
- Cromargan® Edelstahl — rostfrei und langlebig
- Elegantes Monde-Design
- Spülmaschinenfest
- Made in Germany
- Hochwertige Verarbeitung

Investition in die höchste Besteckqualität für Generationen.`,
    price: 199.99,
    oldPrice: 249.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 6.0,
    badges: ['Made in Germany', '12 Personen'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'WMF Monde Essbesteck 68-teilig — Cromargan® Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Monde Essbesteck 68-teilig — Cromargan® Edelstahl, Made in Germany, für 12 Personen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Monde Essbesteck 68-teilig',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-function-4-essbesteck-68-teilig',
    supplierSku: 'WMF-F4-EB68',
    nameDe: 'WMF Function 4 Essbesteck 68-teilig',
    shortDescription: 'Funktionales Essbesteck mit durchdachtem Design — 68-teilig für 12 Personen',
    descriptionDe: `Das WMF Function 4 Essbesteck besticht durch sein durchdachtes Design, bei dem jedes Besteckteil für maximale Funktionalität entwickelt wurde. Die 68-teilige Zusammenstellung bietet Platz für 12 Personen.

**Merkmale:**
- 68-teilig — für 12 Personen
- Cromargan® Edelstahl — rostfrei und pflegeleicht
- Durchdachtes Function 4 Design
- Spülmaschinenfest
- Made in Germany
- Ergonomische Handhabung

Funktion trifft auf elegantes Design — Made in Germany.`,
    price: 149.99,
    oldPrice: 189.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 6.0,
    badges: ['Made in Germany', '12 Personen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Essbesteck 68-teilig — Design-Besteck | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Essbesteck 68-teilig — Cromargan® Edelstahl, Made in Germany, durchdachtes Design. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Function 4 Essbesteck 68-teilig',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'zwilling-spirit-essbesteck-68-teilig',
    supplierSku: 'ZWI-SPIR-EB68',
    nameDe: 'Zwilling Spirit Essbesteck 68-teilig',
    shortDescription: 'Elegantes Zwilling-Besteck aus Edelstahl 18/10 — 68-teilig für 12 Personen',
    descriptionDe: `Das Zwilling Spirit Essbesteck verbindet schlichte Eleganz mit höchster Qualität. Aus Edelstahl 18/10 gefertigt, überzeugt es durch seine langlebige Verarbeitung und den komfortablen Griff.

**Merkmale:**
- 68-teilig — für 12 Personen
- Edelstahl 18/10 — besonders langlebig
- Schlichtes Spirit-Design
- Spülmaschinenfest
- Zwilling Qualität
- Komfortable Handhabung

Zwilling Qualität für jeden Tag und festliche Anlässe.`,
    price: 169.99,
    oldPrice: 209.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.5,
    badges: ['Spirit Serie', '12 Personen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Essbesteck 68-teilig — Edelstahl 18/10 | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Essbesteck 68-teilig — Edelstahl 18/10, elegantes Design, für 12 Personen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Spirit Essbesteck 68-teilig',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'zwilling-now-s-essbesteck-68-teilig',
    supplierSku: 'ZWI-NS-EB68',
    nameDe: 'Zwilling Now S Essbesteck 68-teilig',
    shortDescription: 'Modernes Besteck-Set von Zwilling — 68-teilig, Edelstahl 18/10',
    descriptionDe: `Das Zwilling Now S Essbesteck besticht durch sein modernes, schlichtes Design und hochwertige Verarbeitung. Das 68-teilige Set bietet Platz für 12 Personen und eignet sich perfekt für den täglichen Gebrauch.

**Merkmale:**
- 68-teilig — für 12 Personen
- Edelstahl 18/10 — robust und langlebig
- Modernes Now S Design
- Spülmaschinenfest
- Zwilling Qualität
- Leicht und komfortabel

Modernes Design für den Alltag in der Küche.`,
    price: 119.99,
    oldPrice: 149.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: '68-teilig (12 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.5,
    badges: ['Now S Serie', '12 Personen'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Essbesteck 68-teilig — Modernes Besteck | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Essbesteck 68-teilig — Edelstahl 18/10, modernes Design, für 12 Personen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Now S Essbesteck 68-teilig',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-monde-messerset-5-teilig',
    supplierSku: 'WMF-MON-MS5',
    nameDe: 'WMF Monde Messerset 5-teilig',
    shortDescription: 'Professionelles Messerset aus Cromargan® Edelstahl — 5 Messer für jeden Einsatz',
    descriptionDe: `Das WMF Monde Messerset vereint die wichtigsten Küchenmesser in einem edlen Set. Aus Cromargan® Edelstahl gefertigt und Made in Germany, überzeugt jedes Messer durch seine Schärfe und Langlebigkeit.

**Merkmale:**
- 5-teilig: Kochmesser 20cm, Brotmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm, Filetiermesser 16cm
- Cromargan® Edelstahl — rostfrei und langlebig
- Made in Germany
- Ergonomische Griffe
- Perfekte Balance und Schärfe
- Hochwertige Messerhüllen inklusive

Die Grundausstattung für jede ambitionierte Küche.`,
    price: 89.99,
    oldPrice: 109.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '5-teilig (Kochmesser 20cm, Brotmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm, Filetiermesser 16cm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Made in Germany', '5-teilig'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Monde Messerset 5-teilig — Cromargan® Messer | NOVA INDUKT',
    metaDescription: 'WMF Monde Messerset 5-teilig — Cromargan® Edelstahl, Made in Germany, 5 hochwertige Küchenmesser. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Monde Messerset 5-teilig',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'zwilling-pro-s-messerset-5-teilig',
    supplierSku: 'ZWI-PROS-MS5',
    nameDe: 'Zwilling Pro S Messerset 5-teilig',
    shortDescription: 'Professionelles Messerset von Zwilling — Friodur® Edelstahl, Made in Germany',
    descriptionDe: `Das Zwilling Pro S Messerset steht für höchste Messer-Qualität. Die Friodur® Edelstahlmesser sind besonders hart und schärfstabil. Das 5-teilige Set bietet die wichtigsten Messer für die Profiküche.

**Merkmale:**
- 5-teilig — die wichtigsten Küchenmesser
- Friodur® Edelstahl —冰gehärtet für maximale Schärfe
- Made in Germany
- Ergonomische Vollgriffe
- Perfekte Balance
- Hochwertige Verarbeitung

Professionelle Messer für anspruchsvolle Kochenthusiasten.`,
    price: 129.99,
    oldPrice: 159.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '5-teilig',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.75,
    badges: ['Made in Germany', '5-teilig'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Zwilling Pro S Messerset 5-teilig — Friodur® Edelstahl | NOVA INDUKT',
    metaDescription: 'Zwilling Pro S Messerset 5-teilig — Friodur® Edelstahl, Made in Germany, professionelle Küchenmesser. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Zwilling Pro S Messerset 5-teilig',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'victorinox-swiss-classic-besteck-set-24tlg',
    supplierSku: 'VIX-SWCL-BS24',
    nameDe: 'Victorinox Swiss Classic Besteck-Set 24-teilig',
    shortDescription: 'Schweizer Besteck-Qualität — 24-teilig, spülmaschinenfest',
    descriptionDe: `Das Victorinox Swiss Classic Besteck-Set bringt Schweizer Qualität auf den Esstisch. Das 24-teilige Set bietet Platz für 4 Personen und überzeugt durch seine robuste Verarbeitung.

**Merkmale:**
- 24-teilig — für 4 Personen
- Edelstahl — rostfrei und langlebig
- Schweizer Qualität
- Spülmaschinenfest
- Klassisches Design
- Robust und alltagstauglich

Schweizer Präzision für Ihren täglichen Gebrauch.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Victorinox',
    material: 'Edelstahl',
    dimensions: '24-teilig (4 Personen)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.2,
    badges: ['Schweizer Qualität', '4 Personen'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Victorinox Swiss Classic Besteck-Set 24-teilig — Schweizer Qualität | NOVA INDUKT',
    metaDescription: 'Victorinox Swiss Classic Besteck-Set 24-teilig — Schweizer Qualität, Edelstahl, für 4 Personen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'Victorinox Swiss Classic Besteck-Set 24-teilig',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-bestedeckhalter-edelstahl',
    supplierSku: 'WMF-BDH',
    nameDe: 'WMF Bestedeckhalter Edelstahl',
    shortDescription: 'Praktischer Besteckhalter aus Cromargan® Edelstahl — für 24-teilige Besteck-Sets',
    descriptionDe: `Der WMF Bestedeckhalter sorgt für Ordnung in der Schublade. Aus Cromargan® Edelstahl gefertigt, passt er ideal zu 24-teiligen Besteck-Sets und hält jedes Besteckteil sicher an seinem Platz.

**Merkmale:**
- Cromargan® Edelstahl — rostfrei und robust
- Für 24-teilige Besteck-Sets
- Praktische Einteilung für jedes Besteckteil
- Rutschfeste Füße
- Made in Germany
- Einfach zu reinigen

Ordnung und Übersicht in Ihrer Besteckschublade.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: 'für 24-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.4,
    badges: ['Made in Germany', 'Besteckbox'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'WMF Bestedeckhalter Edelstahl — Cromargan® Besteckbox | NOVA INDUKT',
    metaDescription: 'WMF Bestedeckhalter Edelstahl — Cromargan® Edelstahl, Made in Germany, für 24-teilige Besteck-Sets. Jetzt bei NOVA INDUKT.',
    categorySlug: 'bestecke',
    folder: 'WMF Bestedeckhalter Edelstahl',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed : Bestecke (8 Produkte)')
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
    console.log('\n🎉 Bestecke seed terminé avec succès !')
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
