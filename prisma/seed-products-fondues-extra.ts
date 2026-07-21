/**
 * NOVA INDUKT — Seed Extra : Fondues & Raclette (6 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-fondues-extra.ts
 *
 * Catégorie : fondues-raclette (sortOrder 7–12)
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
    slug: 'staub-cocotte-fondue-25l',
    supplierSku: 'STB-CC-FD25',
    nameDe: 'Staub Cocotte Fondue-Set 2,5 L',
    shortDescription: 'Elegantes Fondue-Set aus Gusseisen — Emaille-Innenbeschichtung',
    descriptionDe: 'Das Staub Cocotte Fondue-Set 2,5 L vereint französische Kochkunst mit erstklassiger Qualität. Die Gusseisen-Konstruktion sorgt für gleichmäßige Wärmeverteilung und hält die Fondue langwarm.',
    price: 199.99,
    oldPrice: 249.99,
    brand: 'Staub',
    material: 'Gusseisen + Emaille',
    dimensions: '2,5 L, Ø 22 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 4.2,
    badges: ['Französische Qualität', 'Gusseisen'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Fondue-Set 2,5 L — Gusseisen | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Fondue-Set 2,5 L aus Gusseisen mit Emaille. Französische Qualität, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Staub Cocotte Fondue — 2,5 L',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'le-creuset-fondue-set-20l',
    supplierSku: 'LC-FD-20',
    nameDe: 'Le Creuset Fondue-Set 2,0 L',
    shortDescription: 'Premium-Fondue-Set aus Gusseisen — ikonisches Design',
    descriptionDe: 'Das Le Creuset Fondue-Set 2,0 L ist die Quintessenz französischer Kochkultur. Die Gusseisen-Konstruktion garantiert optimale Wärmespeicherung für genussreiches Fondue-Erlebnis.',
    price: 259.99,
    oldPrice: 299.99,
    brand: 'Le Creuset',
    material: 'Gusseisen + Emaille',
    dimensions: '2,0 L, Ø 20 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.8,
    badges: ['Premium', 'Französisches Design'],
    rating: 4.9,
    reviewCount: 0,
    metaTitle: 'Le Creuset Fondue-Set 2,0 L — Premium Gusseisen | NOVA INDUKT',
    metaDescription: 'Le Creuset Fondue-Set 2,0 L aus Gusseisen. Ikonisches Design, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Le Creuset Fondue — 2,0 L',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'zwilling-raclette-pfanne-8-teilig',
    supplierSku: 'ZWI-RAC-8',
    nameDe: 'Zwilling Raclette-Pfanne 8-teilig',
    shortDescription: 'Hochwertiges Raclette-Set mit Granitium-Antihaftbeschichtung',
    descriptionDe: 'Das Zwilling Raclette-Set bietet alles für gemütliche Raclette-Abende. Acht Pfännchen mit Granitium-Antihaftbeschichtung ermöglichen gleichzeitiges Garen und Servieren.',
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Zwilling',
    material: 'Aluminium + Granitium',
    dimensions: '8-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.2,
    badges: ['Granitium', '8 Pfännchen'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Raclette-Pfanne 8-teilig — Granitium | NOVA INDUKT',
    metaDescription: 'Zwilling Raclette-Set 8-teilig mit Granitium-Antihaftbeschichtung. Induktionsgeeignet, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Zwilling Raclette — 8-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-fondue-set-18l',
    supplierSku: 'FIS-FD-18',
    nameDe: 'Fissler Fondue-Set 1,8 L',
    shortDescription: 'Praktisches Fondue-Set mit Edelstahlschale — Made in Germany',
    descriptionDe: 'Das Fissler Fondue-Set 1,8 L bietet erstklassige deutsche Qualität für Ihr Fondue-Erlebnis. Die Edelstahlschale ist robust, pflegeleicht und induktionsgeeignet.',
    price: 119.99,
    oldPrice: 149.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '1,8 L, Ø 19 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.6,
    badges: ['Made in Germany', 'Edelstahl'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Fissler Fondue-Set 1,8 L — Edelstahl, Made in Germany | NOVA INDUKT',
    metaDescription: 'Fissler Fondue-Set 1,8 L aus Edelstahl. Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Fissler Fondue — 1,8 L',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'tefal-raclette-party-12-teilig',
    supplierSku: 'TEF-RAC-12',
    nameDe: 'Tefal Raclette Party 12-teilig',
    shortDescription: 'Großes Raclette-Set für 12 Personen — Granitium-Antihaft',
    descriptionDe: 'Das Tefal Raclette Party Set ist ideal für große Gesellschaften. 12 hochwertige Pfännchen mit Granitium-Antihaftbeschichtung ermöglichen gemütliche Raclette-Abende.',
    price: 89.99,
    oldPrice: 109.99,
    brand: 'Tefal',
    material: 'Aluminium + Granitium',
    dimensions: '12-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['12 Pfännchen', 'Für große Gruppen'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Tefal Raclette Party 12-teilig — Granitium | NOVA INDUKT',
    metaDescription: 'Tefal Raclette Party Set 12-teilig mit Granitium-Antihaftbeschichtung. Induktionsgeeignet, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Tefal Raclette Party — 12-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'bugatti-raclette-8-teilig',
    supplierSku: 'BUG-RAC-8',
    nameDe: 'Bugatti Raclette-Set 8-teilig',
    shortDescription: 'Elegantes Raclette-Set mit italienischem Design',
    descriptionDe: 'Das Bugatti Raclette-Set 8-teilig vereint italienisches Design mit erstklassiger Qualität. Die Pfännchen aus Aluminium mit Antihaftbeschichtung sorgen für perfekte Ergebnisse.',
    price: 69.99,
    oldPrice: 84.99,
    brand: 'Bugatti',
    material: 'Aluminium + Antihaft',
    dimensions: '8-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['Italienisches Design', 'Antihaft'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Bugatti Raclette-Set 8-teilig — Italienisches Design | NOVA INDUKT',
    metaDescription: 'Bugatti Raclette-Set 8-teilig mit Antihaftbeschichtung. Italienisches Design, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Bugatti Raclette — 8-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Fondues & Raclette (6 Produkte)')
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
