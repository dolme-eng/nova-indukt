/**
 * NOVA INDUKT — Seed Extra : 8 Sauteusen (Expansion)
 * Exécuter avec : npx tsx prisma/seed-products-sauteusen-extra.ts
 *
 * Catégorie : sauteusen (sortOrder 7–14)
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
    slug: 'fissler-adamant-plus-sauteuse-24cm',
    supplierSku: 'FIS-ADP-SA24',
    nameDe: 'Fissler Adamant Plus Sauteuse 24 cm',
    shortDescription: 'Keramikbeschichtete Sauteuse mit Adamant-Beschichtung — Made in Germany',
    descriptionDe: `Die Fissler Adamant Plus Sauteuse 24 cm bietet eine extrem robuste Adamant-Keramikbeschichtung, die langlebig und pflegeleicht ist. Der Aluminiumkörper sorgt für gleichmäßige Wärmeverteilung.

**Merkmale:**
- Adamant-Keramik-Antihaftbeschichtung — extrem robust
- Aluminiumkörper für gleichmäßige Wärmeverteilung
- Induktionsgeeigneter Boden
- Spülmaschinenfest
- Hergestellt in Deutschland

Die Adamant Plus Serie steht für höchste Qualität im Küchenbereich.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Fissler',
    material: 'Aluminium mit Adamant-Keramikbeschichtung',
    dimensions: 'Ø 24 cm, Höhe 7 cm, 2,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.3,
    badges: ['Made in Germany', 'Keramikbeschichtung'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Adamant Plus Sauteuse 24 cm — Keramikbeschichtung | NOVA INDUKT',
    metaDescription: 'Fissler Adamant Plus Sauteuse 24 cm — Adamant-Keramikbeschichtung, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Fissler Adamant Plus Sauteuse — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'fissler-adamant-plus-sauteuse-28cm',
    supplierSku: 'FIS-ADP-SA28',
    nameDe: 'Fissler Adamant Plus Sauteuse 28 cm',
    shortDescription: 'Große keramikbeschichtete Sauteuse — Made in Germany',
    descriptionDe: `Die Fissler Adamant Plus Sauteuse 28 cm bietet mehr Platz für größere Gerichte. Die Adamant-Keramikbeschichtung und der Aluminiumkörper garantieren hervorragende Kochergebnisse.

**Merkmale:**
- Adamant-Keramik-Antihaftbeschichtung
- Großer Durchmesser (28 cm) für Familien
- Aluminiumkörper für gleichmäßige Wärmeverteilung
- Induktionsgeeignet
- Spülmaschinenfest
- Hergestellt in Deutschland

Ideal für Familien und alle, die gerne für mehrere Personen kochen.`,
    price: 89.99,
    oldPrice: 119.99,
    brand: 'Fissler',
    material: 'Aluminium mit Adamant-Keramikbeschichtung',
    dimensions: 'Ø 28 cm, Höhe 7 cm, 3,2 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.6,
    badges: ['Made in Germany', 'Keramikbeschichtung'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Adamant Plus Sauteuse 28 cm — Große Keramikpfanne | NOVA INDUKT',
    metaDescription: 'Fissler Adamant Plus Sauteuse 28 cm — Adamant-Keramikbeschichtung, Made in Germany, 3,2 L. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Fissler Adamant Plus Sauteuse — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'wmf-diadem-plus-sauteuse-24cm',
    supplierSku: 'WMF-DP-SA24',
    nameDe: 'WMF Diadem Plus Sauteuse 24 cm',
    shortDescription: 'Edelstahl-Sauteuse mit TransTherm® Boden — Made in Germany',
    descriptionDe: `Die WMF Diadem Plus Sauteuse 24 cm bietet eine hochwertige Verarbeitung aus Cromargan® Edelstahl 18/10 mit dem bewährten TransTherm® Boden für optimale Wärmeverteilung.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- TransTherm® Boden für optimale Wärmeverteilung
- Induktionsgeeignet
- Spülmaschinenfest
- Hergestellt in Deutschland

Die Diadem Plus Serie ist die Wahl für alle, die Wert auf Edelstahl-Qualität legen.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 7 cm, 2,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.3,
    badges: ['Made in Germany', 'TransTherm®'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Sauteuse 24 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Sauteuse 24 cm — Cromargan® Edelstahl, TransTherm® Boden, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'WMF Diadem Plus Sauteuse — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'wmf-diadem-plus-sauteuse-28cm',
    supplierSku: 'WMF-DP-SA28',
    nameDe: 'WMF Diadem Plus Sauteuse 28 cm',
    shortDescription: 'Große Edelstahl-Sauteuse mit TransTherm® Boden — Made in Germany',
    descriptionDe: `Die WMF Diadem Plus Sauteuse 28 cm bietet mehr Platz für größere Gerichte. Der TransTherm® Boden sorgt für gleichmäßige Wärmeverteilung auf allen Herdarten.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- TransTherm® Boden
- Großer Durchmesser (28 cm)
- Induktionsgeeignet
- Spülmaschinenfest
- Hergestellt in Deutschland

Ideal für Familien und anspruchsvolle Köche.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 28 cm, Höhe 7 cm, 3,2 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.6,
    badges: ['Made in Germany', 'TransTherm®'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Sauteuse 28 cm — Edelstahl, groß | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Sauteuse 28 cm — Cromargan® Edelstahl, TransTherm® Boden, 3,2 L. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'WMF Diadem Plus Sauteuse — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'zwilling-spirit-sauteuse-24cm',
    supplierSku: 'ZWI-SPIR-SA24',
    nameDe: 'Zwilling Spirit Sauteuse 24 cm',
    shortDescription: '3-Ply Edelstahl-Sauteuse aus der Spirit Serie — premium Verarbeitung',
    descriptionDe: `Die Zwilling Spirit Sauteuse 24 cm bietet eine hochwertige 3-Ply-Konstruktion aus Edelstahl 18/10 für optimale Wärmeverteilung und Langlebigkeit.

**Merkmale:**
- 3-Ply-Konstruktion (Edelstahl-Aluminium-Edelstahl)
- Perfekte Wärmeverteilung ohne Hotspots
- Induktionsgeeignet
- Spülmaschinenfest
- Ergonomische Griffe

Die Spirit Serie steht für modernes Design und erstklassige Kochleistung.`,
    price: 89.99,
    oldPrice: 109.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 7 cm, 2,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.4,
    badges: ['Spirit Serie', '3-Ply'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Sauteuse 24 cm — 3-Ply Edelstahl | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Sauteuse 24 cm — 3-Ply Edelstahl 18/10, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Zwilling Spirit Sauteuse — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'zwilling-spirit-sauteuse-28cm',
    supplierSku: 'ZWI-SPIR-SA28',
    nameDe: 'Zwilling Spirit Sauteuse 28 cm',
    shortDescription: 'Große 3-Ply Edelstahl-Sauteuse — Spirit Serie',
    descriptionDe: `Die Zwilling Spirit Sauteuse 28 cm bietet mehr Platz für größere Gerichte. Die 3-Ply-Konstruktion sorgt für gleichmäßige Wärmeverteilung und hervorragende Kochergebnisse.

**Merkmale:**
- 3-Ply-Konstruktion
- Großer Durchmesser (28 cm)
- Perfekte Wärmeverteilung
- Induktionsgeeignet
- Spülmaschinenfest

Ideal für Familien und anspruchsvolle Köche.`,
    price: 109.99,
    oldPrice: 139.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 28 cm, Höhe 7 cm, 3,2 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.7,
    badges: ['Spirit Serie', '3-Ply'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Sauteuse 28 cm — 3-Ply Edelstahl, groß | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Sauteuse 28 cm — 3-Ply Edelstahl 18/10, 3,2 L, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Zwilling Spirit Sauteuse — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'demeyere-essential-5-sauteuse-24cm',
    supplierSku: 'DEM-ESS5-SA24',
    nameDe: 'Demeyere Essential 5 Sauteuse 24 cm',
    shortDescription: 'Premium 5-Schicht-Edelstahl-Sauteuse — 30 Jahre Garantie',
    descriptionDe: `Die Demeyere Essential 5 Sauteuse 24 cm bietet eine außergewöhnliche 5-Schicht-Konstruktion für optimale Wärmeverteilung und Langlebigkeit. Die belgische Qualität überzeugt durch höchste Verarbeitung.

**Merkmale:**
- 5-Schicht-Konstruktion für optimale Wärmeverteilung
- Induzall® Boden für perfekte Induktionsleistung
- 30 Jahre Garantie
- Spülmaschinenfest
- Belgische Qualität

Die Essential 5 Serie ist die Wahl für anspruchsvolle Köche.`,
    price: 119.99,
    oldPrice: 149.99,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 (5-Schicht)',
    dimensions: 'Ø 24 cm, Höhe 7 cm, 2,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['30 Jahre Garantie', '5-Schicht'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Demeyere Essential 5 Sauteuse 24 cm — 5-Schicht Edelstahl | NOVA INDUKT',
    metaDescription: 'Demeyere Essential 5 Sauteuse 24 cm — 5-Schicht Edelstahl, 30 Jahre Garantie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Demeyere Essential 5 Sauteuse — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'demeyere-essential-5-sauteuse-28cm',
    supplierSku: 'DEM-ESS5-SA28',
    nameDe: 'Demeyere Essential 5 Sauteuse 28 cm',
    shortDescription: 'Große 5-Schicht-Edelstahl-Sauteuse — 30 Jahre Garantie',
    descriptionDe: `Die Demeyere Essential 5 Sauteuse 28 cm bietet mehr Platz für größere Gerichte. Die 5-Schicht-Konstruktion und der Induzall® Boden garantieren hervorragende Kochergebnisse.

**Merkmale:**
- 5-Schicht-Konstruktion
- Großer Durchmesser (28 cm)
- Induzall® Boden für perfekte Induktionsleistung
- 30 Jahre Garantie
- Spülmaschinenfest
- Belgische Qualität

Ideal für Familien und anspruchsvolle Köche.`,
    price: 139.99,
    oldPrice: 179.99,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 (5-Schicht)',
    dimensions: 'Ø 28 cm, Höhe 7 cm, 3,2 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['30 Jahre Garantie', '5-Schicht'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Demeyere Essential 5 Sauteuse 28 cm — 5-Schicht, groß | NOVA INDUKT',
    metaDescription: 'Demeyere Essential 5 Sauteuse 28 cm — 5-Schicht Edelstahl, 30 Jahre Garantie, 3,2 L. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Demeyere Essential 5 Sauteuse — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Sauteusen (8 Produkte)')
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
    console.log('\n🎉 Seed Extra Sauteusen terminé avec succès !')
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
