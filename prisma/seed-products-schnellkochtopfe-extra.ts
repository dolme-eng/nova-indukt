/**
 * NOVA INDUKT — Seed Extra : Schnellkochtöpfe (6 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-schnellkochtopfe-extra.ts
 *
 * Catégorie : schnellkochtopfe (sortOrder 6–11)
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
    slug: 'fissler-vitavit-edition-80l',
    supplierSku: 'FIS-VVE-80',
    nameDe: 'Fissler vitavit edition Schnellkochtopf 8,0 L',
    shortDescription: 'Premium-Schnellkochtopf mit Sicomatic®-Verschluss — 8 Liter, hergestellt in Deutschland',
    descriptionDe: `Das Fissler vitavit edition Schnellkochtopf ist ein Premium-Produkt der Extraklasse. Mit dem patentierten Sicomatic®-Sicherheitsverschluss bietet es maximale Sicherheit und Komfort beim Druckkochen.

**Merkmale:**
- Edelstahl 18/10 — hochwertig, langlebig, geschmacksneutral
- Sicomatic®-Sicherheitsverschluss — einfach und sicher zu bedienen
- Fissler-Original-Induktionsboden für optimale Wärmeverteilung
- Integrierte Skala im Inneren für präzises Nachfüllen
- Spülmaschinengeeignet
- 2 Kochprogramme (schnell & schonend)
- Hergestellt in Deutschland

Mit 8 Litern Fassungsvermögen ideal für große Familien und Mahlzeiten für 6–8 Personen.`,
    price: 139.99,
    oldPrice: 169.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '8,0 L, Ø 26 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.8,
    badges: ['Made in Germany', 'Sicomatic®'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler vitavit edition Schnellkochtopf 8,0 L — Premium Druckkochtopf | NOVA INDUKT',
    metaDescription: 'Fissler vitavit edition Schnellkochtopf 8,0 L mit Sicomatic®-Verschluss. Edelstahl 18/10, induktionsgeeignet, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'Fissler vitavit edition — 8,0 L',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-perfect-plus-80l',
    supplierSku: 'WMF-PP-80',
    nameDe: 'WMF Perfect Plus Schnellkochtopf 8,0 L',
    shortDescription: 'Robuster Schnellkochtopf mit TransTherm®-Boden — Cromargan® Edelstahl',
    descriptionDe: `Das WMF Perfect Plus Schnellkochtopf überzeugt durch seine robuste Bauweise und den bewährten TransTherm®-Boden für gleichmäßige Wärmeverteilung auf allen Herdplatten inkl. Induktion.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — robust und pflegeleicht
- TransTherm®-Universalboden — optimale Wärmeverteilung auf Induktion
- Sicherheitsventil mit Doppelfunktion (Dampfableitung + Überdrucksicherung)
- Ergonomischer SoftTouch-Griff
- Integrierte Füllstandsanzeige
- Spülmaschinengeeignet
- 2 Kochstufen (schnell & schonend)
- Hergestellt in Deutschland

Das Perfect Plus ist der zuverlässige Begleiter für schnelles und energieeffizientes Druckkochen.`,
    price: 129.99,
    oldPrice: 159.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '8,0 L, Ø 26 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.5,
    badges: ['Made in Germany', 'TransTherm®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Perfect Plus Schnellkochtopf 8,0 L — Cromargan® | NOVA INDUKT',
    metaDescription: 'WMF Perfect Plus Schnellkochtopf 8,0 L mit TransTherm®-Boden. Cromargan® Edelstahl, induktionsgeeignet, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'WMF Perfect Plus — 8,0 L',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'kuhn-rikon-duromatic-40l',
    supplierSku: 'KRN-DT-40',
    nameDe: 'Kuhn Rikon Duromatic Top 4,0 L',
    shortDescription: 'Schweizer Schnellkochtopf — kompakt, sicher, langlebig',
    descriptionDe: `Das Kuhn Rikon Duromatic Top ist ein Schweizer Klassiker unter den Schnellkochtöpfen. Mit 4 Litern Fassungsvermögen ideal für 2–4 Personen und überzeugt durch höchste Schweizer Qualitätsstandards.

**Merkmale:**
- Edelstahl 18/10 — hochwertig und robust
- Swiss-Made Qualität — hergestellt in der Schweiz
- Sicherheitsventil mit 3-facher Sicherheitsfunktion
- Optimale Wärmeverteilung dank 5-Punkt-Boden
- Spülmaschinengeeignet
- Kompaktes Design — platzsparend in der Küche
- Perfekt für kleine Haushalte und Beilagen

Kuhn Rikon steht für Schweizer Präzision und höchste Sicherheitsstandards bei Druckkochtopf-Produkten.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Kuhn Rikon',
    material: 'Edelstahl 18/10',
    dimensions: '4,0 L, Ø 20 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.2,
    badges: ['Made in Switzerland'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Kuhn Rikon Duromatic Top 4,0 L — Schweizer Schnellkochtopf | NOVA INDUKT',
    metaDescription: 'Kuhn Rikon Duromatic Top 4,0 L — Made in Switzerland, Edelstahl 18/10, induktionsgeeignet. Kompaktes Premium-Schnellkochtopf. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'Kuhn Rikon Duromatic Top — 4,0 L',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'kuhn-rikon-duromatic-65l',
    supplierSku: 'KRN-DT-65',
    nameDe: 'Kuhn Rikon Duromatic Top 6,5 L',
    shortDescription: 'Schweizer Premium-Schnellkochtopf — 6,5 Liter für Familien',
    descriptionDe: `Das Kuhn Rikon Duromatic Top 6,5 L ist die große Variante des Schweizer Klassikers. Ideal für Familien und wenn es mal mehr sein soll — mit höchster Schweizer Qualitätsarbeit.

**Merkmale:**
- Edelstahl 18/10 — hochwertig, robust, langlebig
- Swiss-Made Qualität — hergestellt in der Schweiz
- Sicherheitsventil mit 3-facher Sicherheitsfunktion
- 5-Punkt-Boden für optimale Wärmeverteilung
- Spülmaschinengeeignet
- Großzügiges Fassungsvermögen für 4–6 Personen
- Perfekt für Eintöpfe, Braten und große Mengen

Das Duromatic Top 6,5 L vereint Schweizer Qualität mit großzügigem Fassungsvermögen für die gesamte Familie.`,
    price: 99.99,
    oldPrice: 129.99,
    brand: 'Kuhn Rikon',
    material: 'Edelstahl 18/10',
    dimensions: '6,5 L, Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.0,
    badges: ['Made in Switzerland'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Kuhn Rikon Duromatic Top 6,5 L — Schweizer Schnellkochtopf | NOVA INDUKT',
    metaDescription: 'Kuhn Rikon Duromatic Top 6,5 L — Made in Switzerland, Edelstahl 18/10, induktionsgeeignet. Großes Familien-Schnellkochtopf. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'Kuhn Rikon Duromatic Top — 6,5 L',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'fissler-vitavit-edition-30l',
    supplierSku: 'FIS-VVE-30',
    nameDe: 'Fissler vitavit edition Schnellkochtopf 3,0 L',
    shortDescription: 'Kompaktes Premium-Schnellkochtopf mit Sicomatic® — ideal für kleine Haushalte',
    descriptionDe: `Das Fissler vitavit edition Schnellkochtopf in der kompakten 3,0 L Variante bietet die gleiche Premium-Qualität wie größere Modelle — ideal für Singles, Paare oder als zweites Topf in der Küche.

**Merkmale:**
- Edelstahl 18/10 — hochwertig, langlebig, geschmacksneutral
- Sicomatic®-Sicherheitsverschluss — einfach und sicher
- Kompaktes Design — perfekt für kleine Portionen
- Fissler-Original-Induktionsboden
- Integrierte Skala im Inneren
- Spülmaschinengeeignet
- 2 Kochprogramme
- Hergestellt in Deutschland

Das kompakte vitavit edition bietet Premium-Druckkochen auch für kleinere Haushalte.`,
    price: 89.99,
    oldPrice: 109.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '3,0 L, Ø 18 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in Germany', 'Kompakt'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler vitavit edition Schnellkochtopf 3,0 L — Kompakt | NOVA INDUKT',
    metaDescription: 'Fissler vitavit edition Schnellkochtopf 3,0 L — kompakt, Sicomatic®-Verschluss, Edelstahl 18/10, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'Fissler vitavit edition — 3,0 L',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-perfect-plus-30l',
    supplierSku: 'WMF-PP-30',
    nameDe: 'WMF Perfect Plus Schnellkochtopf 3,0 L',
    shortDescription: 'Kompaktes Cromargan®-Schnellkochtopf mit TransTherm®-Boden',
    descriptionDe: `Das WMF Perfect Plus Schnellkochtopf in der 3,0 L Variante ist die ideale Wahl für kleinere Haushalte. Mit dem bewährten TransTherm®-Boden und robustem Cromargan® Edelstahl bietet es zuverlässige Leistung.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — robust und pflegeleicht
- TransTherm®-Universalboden — optimale Wärmeverteilung
- Sicherheitsventil mit Doppelfunktion
- Kompaktes Design — platzsparend
- Ergonomischer SoftTouch-Griff
- Spülmaschinengeeignet
- 2 Kochstufen
- Hergestellt in Deutschland

Das kompakte Perfect Plus ist der zuverlässige Begleiter für schnelles Druckkochen in kleinen Haushalten.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '3,0 L, Ø 18 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['Made in Germany'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Perfect Plus Schnellkochtopf 3,0 L — Kompakt | NOVA INDUKT',
    metaDescription: 'WMF Perfect Plus Schnellkochtopf 3,0 L — Cromargan® Edelstahl, TransTherm®-Boden, kompakt. Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'WMF Perfect Plus — 3,0 L',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Schnellkochtöpfe (6 Produkte)')
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
    console.log('\n🎉 Schnellkochtöpfe Extra terminé avec succès !')
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
