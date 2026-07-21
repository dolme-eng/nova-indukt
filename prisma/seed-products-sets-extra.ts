/**
 * NOVA INDUKT — Seed Extra : 6 Induktions-Sets
 * Exécuter avec : npx tsx prisma/seed-products-sets-extra.ts
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
  // sortOrder metadata: 14-19
  {
    sortOrder: 14,
    slug: 'wmf-diadem-plus-set-7-teilig',
    supplierSku: 'WMF-DP-SET7',
    nameDe: 'WMF Diadem Plus Set 7-teilig',
    shortDescription: '7-teiliges Kochgeschirr-Set mit Cromargan® Edelstahl — Made in Germany',
    descriptionDe: `Das WMF Diadem Plus Set 7-teilig bietet alles, was für die Induktionsküche benötigt wird — Made in Germany.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- 7-teilig: 3 Töpfe + 2 Pfannen + 2 Deckel
- TransTherm®-Universalboden
- Spülmaschinengeeignet
- Hergestellt in Deutschland

Das Komplettset für die Neuausstattung der Induktionsküche.`,
    price: 149.99,
    oldPrice: 199.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '7-teilig (3 Töpfe + 2 Pfannen + 2 Deckel)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 8.0,
    badges: ['Made in Germany', '7-teilig'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Set 7-teilig — Edelstahl Kochgeschirr Set | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Set 7-teilig mit Cromargan® Edelstahl, Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'WMF Diadem Plus Set — 7-teilig',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 15,
    slug: 'wmf-function-4-set-7-teilig',
    supplierSku: 'WMF-F4-SET7',
    nameDe: 'WMF Function 4 Set 7-teilig',
    shortDescription: '7-teiliges Kochgeschirr-Set mit Function 4 Deckel — Made in Germany',
    descriptionDe: `Das WMF Function 4 Set 7-teilig überzeugt durch den innovativen Function 4 Deckel mit 4 Funktionen.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- 7-teilig: 3 Töpfe + 2 Pfannen + 2 Deckel
- Function 4 Deckel — Abgießen, Dünsten, Dampf ablassen, Ablage
- Spülmaschinengeeignet
- Hergestellt in Deutschland

Innovatives Set mit multifunktionalen Deckeln für die Induktionsküche.`,
    price: 179.99,
    oldPrice: 229.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '7-teilig (3 Töpfe + 2 Pfannen + 2 Deckel)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 8.5,
    badges: ['Made in Germany', 'Function 4 Deckel'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Set 7-teilig — Edelstahl Kochgeschirr Set | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Set 7-teilig mit Function 4 Deckeln, Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'WMF Function 4 Set — 7-teilig',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 16,
    slug: 'zwilling-spirit-set-7-teilig',
    supplierSku: 'ZWI-SPIR-SET7',
    nameDe: 'Zwilling Spirit Set 7-teilig',
    shortDescription: '7-teiliges Edelstahl-Set mit Spirit-Serie-Qualität',
    descriptionDe: `Das Zwilling Spirit Set 7-teilig bietet bewährte Spirit-Serie-Qualität im praktischen Komplett-Set.

**Merkmale:**
- Edelstahl 18/10
- 7-teilig
- Sigma-Technologie für optimale Wärmeverteilung
- Spülmaschinengeeignet
- Induktionskompatibel

Das Spirit-Set für den optimalen Einstieg in die Induktionswelt.`,
    price: 129.99,
    oldPrice: 169.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: '7-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 7.5,
    badges: ['Spirit Serie', '7-teilig'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Set 7-teilig — Edelstahl Kochgeschirr Set | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Set 7-teilig mit Edelstahl, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Zwilling Spirit Set — 7-teilig',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 17,
    slug: 'fissler-opc-set-5-teilig',
    supplierSku: 'FIS-OPC-SET5',
    nameDe: 'Fissler OPC Set 5-teilig',
    shortDescription: '5-teiliges Premium-Set mit CookStar®-Boden — Made in Germany',
    descriptionDe: `Das Fissler OPC Set 5-teilig bietet exklusive CookStar®-Qualität im praktischen Set.

**Merkmale:**
- Edelstahl 18/10 mit CookStar®-Universalboden
- 5-teilig: 2 Töpfe + 1 Pfanne + 2 Deckel
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Premium-Qualität

Das Premium-Set für anspruchsvolles Kochen auf Induktion.`,
    price: 249.99,
    oldPrice: 299.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '5-teilig (2 Töpfe + 1 Pfanne + 2 Deckel)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 6.0,
    badges: ['Made in Germany', 'CookStar®', '5-teilig'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Set 5-teilig — Premium Edelstahl Kochgeschirr | NOVA INDUKT',
    metaDescription: 'Fissler OPC Set 5-teilig mit CookStar®-Boden, Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Fissler OPC Set — 5-teilig',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 18,
    slug: 'demeyere-essential-5-set-5-teilig',
    supplierSku: 'DEM-ESS5-SET5',
    nameDe: 'Demeyere Essential 5 Set 5-teilig',
    shortDescription: '5-teiliges Set mit 5-Schicht-Technologie — 30 Jahre Garantie',
    descriptionDe: `Das Demeyere Essential 5 Set 5-teilig bietet die einzigartige 5-Schicht-Technologie für optimale Kochergebnisse.

**Merkmale:**
- Edelstahl 18/10 mit 5-Schicht-Technologie
- 5-teilig
- 30 Jahre Garantie
- Spülmaschinengeeignet
- Induktionskompatibel

Premium-Set mit 30 Jahren Garantie — eine Investition fürs Leben.`,
    price: 199.99,
    oldPrice: 249.99,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 (5-Schicht)',
    dimensions: '5-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 7.0,
    badges: ['30 Jahre Garantie', '5-Schicht'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Demeyere Essential 5 Set 5-teilig — 5-Schicht Edelstahl | NOVA INDUKT',
    metaDescription: 'Demeyere Essential 5 Set 5-teilig mit 5-Schicht-Technologie, 30 Jahre Garantie, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Demeyere Essential 5 Set — 5-teilig',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 19,
    slug: 'silit-silargan-set-5-teilig',
    supplierSku: 'SIL-SIL-SET5',
    nameDe: 'Silit Silargan Set 5-teilig',
    shortDescription: '5-teiliges Set mit Silargan® Funktionskeramik — Made in Germany',
    descriptionDe: `Das Silit Silargan Set 5-teilig bietet die einzigartige Silargan®-Funktionskeramik im praktischen Komplett-Set.

**Merkmale:**
- Silargan® Funktionskeramik
- 5-teilig
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- Ohne PTFE und PFOA

Das Set für alle, die auf keramische Beschichtung setzen.`,
    price: 169.99,
    oldPrice: 219.99,
    brand: 'Silit',
    material: 'Silargan® Funktionskeramik',
    dimensions: '5-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 6.5,
    badges: ['Made in Germany', 'Silargan®'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Silit Silargan Set 5-teilig — Funktionskeramik Kochgeschirr | NOVA INDUKT',
    metaDescription: 'Silit Silargan Set 5-teilig mit Funktionskeramik, Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-sets',
    folder: 'Silit Silargan Set — 5-teilig',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Induktions-Sets (6 Produkte)')
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
    console.log('\n🎉 Batch Sets Extra terminé avec succès !')
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
