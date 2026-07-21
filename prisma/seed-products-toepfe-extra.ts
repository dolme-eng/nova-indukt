/**
 * NOVA INDUKT — Seed Extra : 8 Induktionstöpfe
 * Exécuter avec : npx tsx prisma/seed-products-toepfe-extra.ts
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
  // sortOrder metadata: 19-26
  {
    sortOrder: 19,
    slug: 'wmf-diadem-plus-kochtopf-hoch-20cm',
    supplierSku: 'WMF-DP-KT20',
    nameDe: 'WMF Diadem Plus Kochtopf hoch 20 cm',
    shortDescription: 'Edelstahl-Topf mit TransTherm®-Boden — Made in Germany',
    descriptionDe: `Der WMF Diadem Plus Kochtopf hoch 20 cm bietet bewährte WMF-Qualität mit dem patentierten TransTherm®-Universalboden für optimale Wärmeverteilung auf Induktion.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- TransTherm®-Universalboden — optimale Wärmeverteilung
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 3,0 L Fassungsvermögen

Kompakter Kochtopf für Suppen und Beilagen.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 20 cm, Höhe 12 cm, 3,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Made in Germany', 'TransTherm®'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Kochtopf hoch 20 cm — Edelstahl Induktion | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Kochtopf 20 cm mit TransTherm®-Boden, Cromargan® Edelstahl, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'WMF Diadem Plus Kochtopf hoch — 20 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 20,
    slug: 'wmf-diadem-plus-kochtopf-hoch-24cm',
    supplierSku: 'WMF-DP-KT24',
    nameDe: 'WMF Diadem Plus Kochtopf hoch 24 cm',
    shortDescription: 'Edelstahl-Topf mit TransTherm®-Boden — Made in Germany, 5,0 L',
    descriptionDe: `Der WMF Diadem Plus Kochtopf hoch 24 cm ist die ideale Wahl für größere Portionen und bietet 5 Liter Fassungsvermögen.

**Merkmale:**
- Cromargan® Edelstahl 18/10
- TransTherm®-Universalboden — optimale Wärmeverteilung
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 5,0 L Fassungsvermögen

Der Universaltopf für Familienkochen auf Induktion.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 14 cm, 5,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in Germany', 'TransTherm®'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Kochtopf hoch 24 cm — Edelstahl Induktion | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Kochtopf 24 cm mit TransTherm®-Boden, Cromargan® Edelstahl, 5 L, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'WMF Diadem Plus Kochtopf hoch — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 21,
    slug: 'zwilling-plus-kochtopf-hoch-20cm',
    supplierSku: 'ZWI-P-KT20',
    nameDe: 'Zwilling Plus Kochtopf hoch 20 cm',
    shortDescription: '3-Ply Edelstahl-Topf mit Sigma Classic — ideal für Induktion',
    descriptionDe: `Der Zwilling Plus Kochtopf hoch 20 cm bietet eine 3-Schicht-Konstruktion für optimale Wärmeverteilung auf dem Induktionskochfeld.

**Merkmale:**
- Edelstahl 18/10 mit 3-Ply-Konstruktion
- Sigma Classic-Technologie
- Spülmaschinengeeignet
- 3,0 L Fassungsvermögen
- Induktionskompatibel

Leichter und schneller Topf für die moderne Küche.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 20 cm, Höhe 12 cm, 3,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.3,
    badges: ['3-Ply', 'Sigma Classic'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Plus Kochtopf hoch 20 cm — 3-Ply Induktion | NOVA INDUKT',
    metaDescription: 'Zwilling Plus Kochtopf 20 cm mit 3-Ply-Technologie, Edelstahl, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Zwilling Plus Kochtopf hoch — 20 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 22,
    slug: 'zwilling-plus-kochtopf-hoch-24cm',
    supplierSku: 'ZWI-P-KT24',
    nameDe: 'Zwilling Plus Kochtopf hoch 24 cm',
    shortDescription: '3-Ply Edelstahl-Topf mit Sigma Classic — 5,0 L',
    descriptionDe: `Der Zwilling Plus Kochtopf hoch 24 cm bietet 5 Liter Fassungsvermögen und die bewährte 3-Ply-Qualität.

**Merkmale:**
- Edelstahl 18/10 mit 3-Ply-Konstruktion
- Sigma Classic-Technologie
- Spülmaschinengeeignet
- 5,0 L Fassungsvermögen
- Induktionskompatibel

Der Allround-Topf für Familien und größere Portionen.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 14 cm, 5,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['3-Ply', 'Sigma Classic'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Plus Kochtopf hoch 24 cm — 3-Ply Induktion | NOVA INDUKT',
    metaDescription: 'Zwilling Plus Kochtopf 24 cm mit 3-Ply-Technologie, Edelstahl, 5 L, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Zwilling Plus Kochtopf hoch — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 23,
    slug: 'silit-silargan-kochtopf-hoch-20cm',
    supplierSku: 'SIL-SIL-KT20',
    nameDe: 'Silit Silargan Kochtopf hoch 20 cm',
    shortDescription: 'Silargan® Funktionskeramik — Made in Germany, 3,0 L',
    descriptionDe: `Der Silit Silargan Kochtopf hoch 20 cm bietet die einzigartige Silargan®-Funktionskeramik für schonendes Kochen und optimale Wärmespeicherung.

**Merkmale:**
- Silargan® Funktionskeramik — extrem robust und langlebig
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 3,0 L Fassungsvermögen
- Ohne PTFE und PFOA

Ein Topf für das Leben — Silargan® wird mit der Zeit immer besser.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'Silit',
    material: 'Silargan® Funktionskeramik',
    dimensions: 'Ø 20 cm, Höhe 12 cm, 3,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Made in Germany', 'Silargan®'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Silit Silargan Kochtopf hoch 20 cm — Funktionskeramik Induktion | NOVA INDUKT',
    metaDescription: 'Silit Silargan Kochtopf 20 cm mit Funktionskeramik, Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Silit Silargan Kochtopf hoch — 20 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 24,
    slug: 'silit-silargan-kochtopf-hoch-24cm',
    supplierSku: 'SIL-SIL-KT24',
    nameDe: 'Silit Silargan Kochtopf hoch 24 cm',
    shortDescription: 'Silargan® Funktionskeramik — Made in Germany, 5,0 L',
    descriptionDe: `Der Silit Silargan Kochtopf hoch 24 cm bietet 5 Liter Fassungsvermögen mit der exklusiven Silargan®-Qualität.

**Merkmale:**
- Silargan® Funktionskeramik — extrem robust und langlebig
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 5,0 L Fassungsvermögen
- Ohne PTFE und PFOA

Der große Silargan®-Topf für Familienkochen auf Induktion.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'Silit',
    material: 'Silargan® Funktionskeramik',
    dimensions: 'Ø 24 cm, Höhe 14 cm, 5,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in Germany', 'Silargan®'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Silit Silargan Kochtopf hoch 24 cm — Funktionskeramik Induktion | NOVA INDUKT',
    metaDescription: 'Silit Silargan Kochtopf 24 cm mit Funktionskeramik, Made in Germany, 5 L, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Silit Silargan Kochtopf hoch — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 25,
    slug: 'fissler-opc-schmortopf-24cm',
    supplierSku: 'FIS-OPC-ST24',
    nameDe: 'Fissler OPC Schmortopf mit Metalldeckel 24 cm',
    shortDescription: 'Premium-Schmortopf mit CookStar®-Boden — Made in Germany, 3,5 L',
    descriptionDe: `Der Fissler OPC Schmortopf 24 cm mit Metalldeckel bietet die exklusive CookStar®-Bodentechnologie für optimales Schmoren auf Induktion.

**Merkmale:**
- Edelstahl 18/10 mit CookStar®-Universalboden
- Metalldeckel — ideal zum Schmoren
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 3,5 L Fassungsvermögen

Der Premium-Schmortopf für anspruchsvolles Garen auf Induktion.`,
    price: 119.00,
    oldPrice: 149.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 10 cm, 3,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in Germany', 'CookStar®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Schmortopf 24 cm — CookStar® Edelstahl Induktion | NOVA INDUKT',
    metaDescription: 'Fissler OPC Schmortopf 24 cm mit Metalldeckel und CookStar®-Boden, Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Fissler OPC Schmortopf — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 26,
    slug: 'fissler-opc-schmortopf-28cm',
    supplierSku: 'FIS-OPC-ST28',
    nameDe: 'Fissler OPC Schmortopf mit Metalldeckel 28 cm',
    shortDescription: 'Premium-Schmortopf mit CookStar®-Boden — Made in Germany, 5,0 L',
    descriptionDe: `Der Fissler OPC Schmortopf 28 cm mit Metalldeckel bietet 5 Liter Fassungsvermögen für großzügiges Schmoren.

**Merkmale:**
- Edelstahl 18/10 mit CookStar®-Universalboden
- Metalldeckel — ideal zum Schmoren
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 5,0 L Fassungsvermögen

Der große Schmortopf für Festmahlzeiten und Familienkochen.`,
    price: 139.00,
    oldPrice: 179.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 28 cm, Höhe 11 cm, 5,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Made in Germany', 'CookStar®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Schmortopf 28 cm — CookStar® Edelstahl Induktion | NOVA INDUKT',
    metaDescription: 'Fissler OPC Schmortopf 28 cm mit Metalldeckel und CookStar®-Boden, Made in Germany, 5 L, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Fissler OPC Schmortopf — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Induktionstöpfe (8 Produkte)')
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
    console.log('\n🎉 Batch Töpfe Extra terminé avec succès !')
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
