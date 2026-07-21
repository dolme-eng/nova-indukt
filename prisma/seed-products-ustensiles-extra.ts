/**
 * NOVA INDUKT — Seed Extra : 8 Ustensiles (Expansion)
 * Exécuter avec : npx tsx prisma/seed-products-ustensiles-extra.ts
 *
 * Catégorie : ustensiles (sortOrder 21–28)
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
    slug: 'wmf-profi-plus-nudelkelle',
    supplierSku: 'WMF-PP-NK',
    nameDe: 'WMF Profi Plus Nudelkelle',
    shortDescription: 'Edelstahl-Nudelkelle aus der Profi Plus Serie — Made in Germany',
    descriptionDe: `Die WMF Profi Plus Nudelkelle ist ein unverzichtbares Werkzeug für Pasta-Liebhaber. Aus Cromargan® Edelstahl 18/10 gefertigt, bietet sie optimale Haltbarkeit und ein elegantes Design.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — rostfrei, geschmacksneutral
- Ergonomischer Griff für sicheren Halt
- Perfekt zum Servieren von Nudeln und Salaten
- Spülmaschinenfest
- Hergestellt in Deutschland

Die Profi Plus Serie steht für professionelle Qualität im Küchenalltag.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '32 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.12,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Nudelkelle — Edelstahl Küchenutensil | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Nudelkelle aus Cromargan® Edelstahl 18/10. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus Nudelkelle',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'wmf-profi-plus-kartoffelstock',
    supplierSku: 'WMF-PP-KS',
    nameDe: 'WMF Profi Plus Kartoffelstock',
    shortDescription: 'Edelstahl-Kartoffelstock aus der Profi Plus Serie — Made in Germany',
    descriptionDe: `Der WMF Profi Plus Kartoffelstock ist ideal zum Schockieren von Kartoffeln und Gemüse. Aus Cromargan® Edelstahl 18/10 gefertigt, überzeugt er durch Robustheit und Funktionalität.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- Perfekt zum Schockieren und Abgießen
- Ergonomischer Griff
- Spülmaschinenfest
- Hergestellt in Deutschland

Ein unverzichtbares Utensil für perfekt zubereitete Kartoffeln.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '30 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.15,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Kartoffelstock — Edelstahl Utensil | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Kartoffelstock — Cromargan® Edelstahl, spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus Kartoffelstock',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'fissler-pure-collection-schneebesen',
    supplierSku: 'FIS-PC-SB',
    nameDe: 'Fissler Pure Collection Schneebesen',
    shortDescription: 'Edelstahl-Schneebesen aus der Pure Collection — Made in Germany',
    descriptionDe: `Der Fissler Pure Collection Schneebesen bietet ergonomisches Design und erstklassige Verarbeitung. Aus Edelstahl 18/10 gefertigt, eignet er sich hervorragend zum Schlagen von Eiern, Sahne und Teigen.

**Merkmale:**
- Edelstahl 18/10 — robust und langlebig
- Ergonomischer Griff
- Perfekt für Backen und Kochen
- Spülmaschinenfest
- Hergestellt in Deutschland

Die Pure Collection verbindet minimalistisches Design mit höchster Funktionalität.`,
    price: 11.99,
    oldPrice: 14.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.09,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Fissler Pure Collection Schneebesen — Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Pure Collection Schneebesen — Edelstahl 18/10, Made in Germany, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Fissler Pure Collection Schneebesen',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'fissler-pure-collection-grillzange',
    supplierSku: 'FIS-PC-GZ',
    nameDe: 'Fissler Pure Collection Grillzange',
    shortDescription: 'Edelstahl-Grillzange aus der Pure Collection — Made in Germany',
    descriptionDe: `Die Fissler Pure Collection Grillzange ist ideal für Grill- und Bratgerichte. Aus Edelstahl 18/10 gefertigt, bietet sie sicheren Halt und präzises Arbeiten.

**Merkmale:**
- Edelstahl 18/10 — robust und langlebig
- Ergonomischer Griff mit sicherem Halt
- Perfekt für Grillen und Braten
- Spülmaschinenfest
- Hergestellt in Deutschland

Die Grillzange ist ein unverzichtbares Werkzeug für jeden Grillmeister.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '30 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.13,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Pure Collection Grillzange — Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Pure Collection Grillzange — Edelstahl 18/10, Made in Germany, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Fissler Pure Collection Grillzange',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'roesle-edelstahl-schaumkelle',
    supplierSku: 'ROS-SS-SK',
    nameDe: 'Rösle Edelstahl Schaumkelle',
    shortDescription: 'Präzise Edelstahl-Schaumkelle von Rösle — Made in Germany',
    descriptionDe: `Die Rösle Edelstahl Schaumkelle ist ein elegantes Utensil für das Servieren von Suppen und Saucen. Aus Edelstahl 18/10 gefertigt, überzeugt sie durch minimalistisches Design und höchste Qualität.

**Merkmale:**
- Edelstahl 18/10 — rostfrei und geschmacksneutral
- Elegant minimalistisches Design
- Perfekt zum Servieren von Suppen
- Spülmaschinenfest
- Hergestellt in Deutschland

Rösle steht für deutsche Präzision im Küchenbereich.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Rösle',
    material: 'Edelstahl 18/10',
    dimensions: '30 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.12,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Rösle Edelstahl Schaumkelle — Edelstahl Utensil | NOVA INDUKT',
    metaDescription: 'Rösle Edelstahl Schaumkelle — Edelstahl 18/10, Made in Germany, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Rösle Edelstahl Schaumkelle',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'roesle-edelstahl-schneebesen',
    supplierSku: 'ROS-SS-SB',
    nameDe: 'Rösle Edelstahl Schneebesen',
    shortDescription: 'Eleganter Edelstahl-Schneebesen von Rösle — Made in Germany',
    descriptionDe: `Der Rösle Edelstahl Schneebesen bietet perfekte Ergonomie und erstklassige Verarbeitung. Aus Edelstahl 18/10 gefertigt, eignet er sich hervorragend zum Schlagen von Eiern, Sahne und Teigen.

**Merkmale:**
- Edelstahl 18/10 — robust und langlebig
- Elegant minimalistisches Design
- Ergonomischer Griff
- Spülmaschinenfest
- Hergestellt in Deutschland

Die Rösle Schneebesen vereinen Design und Funktionalität auf höchstem Niveau.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Rösle',
    material: 'Edelstahl 18/10',
    dimensions: '28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.09,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Rösle Edelstahl Schneebesen — Edelstahl | NOVA INDUKT',
    metaDescription: 'Rösle Edelstahl Schneebesen — Edelstahl 18/10, Made in Germany, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Rösle Edelstahl Schneebesen',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'zwilling-now-s-kartoffelstock',
    supplierSku: 'ZWI-NS-KS',
    nameDe: 'Zwilling Now S Kartoffelstock',
    shortDescription: 'Praktischer Kartoffelstock aus der Now S Serie — Edelstahl mit Silikongriff',
    descriptionDe: `Der Zwilling Now S Kartoffelstock ist ein praktisches Utensil für das Schockieren von Kartoffeln und Gemüse. Der Silikongriff bietet sicheren Halt und Komfort.

**Merkmale:**
- Edelstahl mit Silikongriff
- Perfekt zum Schockieren und Abgießen
- Ergonomischer, rutschfester Griff
- Spülmaschinenfest
- Preiswert und funktional

Die Now S Serie bietet modernes Design zum fairen Preis.`,
    price: 11.99,
    oldPrice: 14.99,
    brand: 'Zwilling',
    material: 'Edelstahl + Silikongriff',
    dimensions: '30 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.1,
    badges: ['Now S Serie'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Now S Kartoffelstock — Edelstahl Utensil | NOVA INDUKT',
    metaDescription: 'Zwilling Now S Kartoffelstock — Edelstahl mit Silikongriff, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'Zwilling Now S Kartoffelstock',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'wmf-professional-s-plus-saucenheber-2',
    supplierSku: 'WMF-PP-SH2',
    nameDe: 'WMF Profi Plus Saucenheber',
    shortDescription: 'Edelstahl-Saucenheber aus der Profi Plus Serie — Made in Germany',
    descriptionDe: `Der WMF Profi Plus Saucenheber ist ideal zum Servieren von Saucen, Suppen und Eintöpfen. Aus Cromargan® Edelstahl 18/10 gefertigt, bietet er optimale Haltbarkeit und ein elegantes Design.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- Perfekt zum Servieren von Saucen
- Ergonomischer Griff
- Spülmaschinenfest
- Hergestellt in Deutschland

Die Profi Plus Serie steht für professionelle Qualität im Küchenalltag.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '30 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.11,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Saucenheber — Edelstahl Utensil | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Saucenheber — Cromargan® Edelstahl 18/10, Made in Germany, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'ustensiles',
    folder: 'WMF Profi Plus Saucenheber',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Ustensiles (8 Produkte)')
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
    console.log('\n🎉 Seed Extra Ustensiles terminé avec succès !')
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
