/**
 * NOVA INDUKT — Seed Extra : 6 Crêpe-Pfannen (Expansion)
 * Exécuter avec : npx tsx prisma/seed-products-crepe-extra.ts
 *
 * Catégorie : crepe-pfannen (sortOrder 5–10)
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
    slug: 'de-buyer-mineral-b-pro-crepe-24cm',
    supplierSku: 'DB-MINBP-CP24',
    nameDe: 'de Buyer Mineral B Pro Crêpe-Pfanne 24 cm',
    shortDescription: 'Französische Crêpe-Pfanne mit Eisenbeschichtung — Made in France',
    descriptionDe: `Die de Buyer Mineral B Pro Crêpe-Pfanne 24 cm ist eine echte französische Crêpe-Pfanne aus Stahl mit Eisenbeschichtung. Die professionelle Qualität eignet sich hervorragend für perfekte Crêpes und Pfannkuchen.

**Merkmale:**
- Stahl mit Eisenbeschichtung — natürliche Antihaft-Eigenschaften
- Professionelle Qualität aus Frankreich
- Induktionsgeeignet
- Nicht spülmaschinenfest (Handwäsche empfohlen)
- Hergestellt in Frankreich

Die Mineral B Pro Serie ist die Wahl von Profiköchen für Crêpes und Pfannkuchen.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'de Buyer',
    material: 'Stahl mit Eisenbeschichtung',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.9,
    badges: ['Made in France', 'Pro Serie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'de Buyer Mineral B Pro Crêpe-Pfanne 24 cm — Frankreich | NOVA INDUKT',
    metaDescription: 'de Buyer Mineral B Pro Crêpe-Pfanne 24 cm — Stahl mit Eisenbeschichtung, Made in France. Jetzt bei NOVA INDUKT.',
    categorySlug: 'crepe-pfannen',
    folder: 'de Buyer Mineral B Pro Crêpe — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'de-buyer-mineral-b-pro-crepe-28cm',
    supplierSku: 'DB-MINBP-CP28',
    nameDe: 'de Buyer Mineral B Pro Crêpe-Pfanne 28 cm',
    shortDescription: 'Große französische Crêpe-Pfanne — Made in France',
    descriptionDe: `Die de Buyer Mineral B Pro Crêpe-Pfanne 28 cm bietet mehr Platz für größere Crêpes. Die Eisenbeschichtung entwickelt mit der Zeit eine natürliche Patina.

**Merkmale:**
- Stahl mit Eisenbeschichtung
- Großer Durchmesser (28 cm)
- Professionelle Qualität
- Induktionsgeeignet
- Nicht spülmaschinenfest
- Hergestellt in Frankreich

Ideal für Crêpes, Pfannkuchen und mehr.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'de Buyer',
    material: 'Stahl mit Eisenbeschichtung',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.1,
    badges: ['Made in France', 'Pro Serie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'de Buyer Mineral B Pro Crêpe-Pfanne 28 cm — Groß | NOVA INDUKT',
    metaDescription: 'de Buyer Mineral B Pro Crêpe-Pfanne 28 cm — Stahl mit Eisenbeschichtung, Made in France. Jetzt bei NOVA INDUKT.',
    categorySlug: 'crepe-pfannen',
    folder: 'de Buyer Mineral B Pro Crêpe — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'matfer-black-steel-crepe-25cm',
    supplierSku: 'MAT-BS-CP25',
    nameDe: 'Matfer Black Steel Crêpe-Pfanne 25 cm',
    shortDescription: 'Französische Black Steel Crêpe-Pfanne — Made in France',
    descriptionDe: `Die Matfer Black Steel Crêpe-Pfanne 25 cm bietet eine einzigartige Black Steel Oberfläche für perfekte Crêpes. Die französische Qualität überzeugt durch höchste Verarbeitung.

**Merkmale:**
- Black Steel — natürliche Antihaft-Eigenschaften
- Französische Qualität
- Induktionsgeeignet
- Nicht spülmaschinenfest
- Hergestellt in Frankreich

Die Black Steel Entwicklung sorgt für hervorragende Kochergebnisse.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'Matfer',
    material: 'Black Steel',
    dimensions: 'Ø 25 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.9,
    badges: ['Made in France', 'Black Steel'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Matfer Black Steel Crêpe-Pfanne 25 cm — Frankreich | NOVA INDUKT',
    metaDescription: 'Matfer Black Steel Crêpe-Pfanne 25 cm — Made in France, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'crepe-pfannen',
    folder: 'Matfer Black Steel Crêpe — 25 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'tefal-jamie-oliver-crepe-25cm',
    supplierSku: 'TEF-JO-CP25',
    nameDe: 'Tefal Jamie Oliver Crêpe-Pfanne 25 cm',
    shortDescription: 'Antihaft-Crêpe-Pfanne mit Jamie Oliver Design — spülmaschinenfest',
    descriptionDe: `Die Tefal Jamie Oliver Crêpe-Pfanne 25 cm bietet eine hochwertige Antihaftbeschichtung für perfekte Crêpes. Das Design von Jamie Oliver überzeugt durch Funktionalität und Ästhetik.

**Merkmale:**
- Aluminium mit Antihaftbeschichtung
- Jamie Oliver Design
- Spülmaschinenfest
- Induktionsgeeignet
- Leicht und handlich

Die ideale Crêpe-Pfanne für Einsteiger und Fortgeschrittene.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'Tefal',
    material: 'Aluminium mit Antihaft',
    dimensions: 'Ø 25 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['Jamie Oliver', 'Antihaft'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Tefal Jamie Oliver Crêpe-Pfanne 25 cm — Antihaft | NOVA INDUKT',
    metaDescription: 'Tefal Jamie Oliver Crêpe-Pfanne 25 cm — Antihaft, spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'crepe-pfannen',
    folder: 'Tefal Jamie Oliver Crêpe — 25 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'le-creuset-toughened-non-stick-crepe-24cm',
    supplierSku: 'LEC-TNS-CP24',
    nameDe: 'Le Creuset Toughened Non-Stick Crêpe 24 cm',
    shortDescription: 'Premium Antihaft-Crêpe-Pfanne von Le Creuset — Made in France',
    descriptionDe: `Die Le Creuset Toughened Non-Stick Crêpe bietet eine hochwertige Antihaftbeschichtung für perfekte Crêpes. Die französische Qualität von Le Creuset steht für höchste Ansprüche.

**Merkmale:**
- Aluminium mit Toughened Antihaftbeschichtung
- Französische Qualität
- Spülmaschinenfest
- Induktionsgeeignet
- Hergestellt in Frankreich

Le Creuset steht für Premium-Qualität im Küchenbereich.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'Le Creuset',
    material: 'Aluminium mit Antihaft',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Made in France', 'Toughened'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Le Creuset Toughened Non-Stick Crêpe 24 cm — Premium | NOVA INDUKT',
    metaDescription: 'Le Creuset Toughened Non-Stick Crêpe 24 cm — Made in France, Premium Antihaft. Jetzt bei NOVA INDUKT.',
    categorySlug: 'crepe-pfannen',
    folder: 'Le Creuset Toughened Non-Stick Crêpe — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'fissler-cenit-crepe-pfanne-26cm',
    supplierSku: 'FIS-CEN-CP26',
    nameDe: 'Fissler Cenit Crêpe-Pfanne 26 cm',
    shortDescription: 'Antihaft-Crêpe-Pfanne aus der Cenit Serie — Made in Germany',
    descriptionDe: `Die Fissler Cenit Crêpe-Pfanne 26 cm bietet eine hochwertige Antihaftbeschichtung für perfekte Crêpes. Die deutsche Qualität überzeugt durch Robustheit und Langlebigkeit.

**Merkmale:**
- Aluminium mit Antihaftbeschichtung
- Made in Germany
- Spülmaschinenfest
- Induktionsgeeignet
- Ergonomischer Griff

Die Cenit Serie steht für deutsche Qualität im Küchenbereich.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'Fissler',
    material: 'Aluminium mit Antihaft',
    dimensions: 'Ø 26 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.75,
    badges: ['Made in Germany', 'Antihaft'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Cenit Crêpe-Pfanne 26 cm — Antihaft | NOVA INDUKT',
    metaDescription: 'Fissler Cenit Crêpe-Pfanne 26 cm — Antihaft, Made in Germany, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'crepe-pfannen',
    folder: 'Fissler Cenit Crêpe-Pfanne — 26 cm',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Crêpe-Pfannen (6 Produkte)')
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
    console.log('\n🎉 Seed Extra Crêpe-Pfannen terminé avec succès !')
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
