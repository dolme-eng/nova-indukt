/**
 * NOVA INDUKT — Seed Extra : 8 Messer (Expansion)
 * Exécuter avec : npx tsx prisma/seed-products-messer-extra.ts
 *
 * Catégorie : messer (sortOrder 16–23)
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
    slug: 'zwilling-four-star-chefmesser-20cm',
    supplierSku: 'ZWI-FS-CM20',
    nameDe: 'Zwilling Four Star Kochmesser 20 cm',
    shortDescription: 'Klassisches Kochmesser aus der Four Star Serie — Friodur® Edelstahl',
    descriptionDe: `Das Zwilling Four Star Kochmesser 20 cm gehört zur legendären Four Star Serie, die seit über 40 Jahren zu den meistverkauften Messern der Welt gehört. Die Klinge aus Friodur® Edelstahl wird einer speziellen Kältebehandlung unterzogen, die Härte, Korrosionsbeständigkeit und Flexibilität optimiert.

**Merkmale:**
- Friodur® Edelstahl — Kältegehärtet für lange Schärfe
- Ergonomischer Four-Star-Griff aus Polypropylen
- Geometrisch perfekte Klingenform für vielseitiges Schneiden
- Hergestellt in Solingen, Deutschland
- Perfektes Gleichgewicht zwischen Klinge und Griff

Das Kochmesser ist der unverzichtbare Allrounder in jeder Küche — von Gemüse bis Fleisch.`,
    price: 89.99,
    oldPrice: 109.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '20 cm',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.2,
    badges: ['Made in Germany', 'Four Star'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Zwilling Four Star Kochmesser 20 cm — Edelstahl Messer | NOVA INDUKT',
    metaDescription: 'Zwilling Four Star Kochmesser 20 cm aus Friodur® Edelstahl. Klassisches Profimesser, hergestellt in Solingen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Four Star Kochmesser — 20 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'zwilling-four-star-chefmesser-16cm',
    supplierSku: 'ZWI-FS-CM16',
    nameDe: 'Zwilling Four Star Kochmesser 16 cm',
    shortDescription: 'Kompaktes Kochmesser aus der Four Star Serie — ideal für kleinere Aufgaben',
    descriptionDe: `Das Zwilling Four Star Kochmesser 16 cm bietet die gleiche Premium-Qualität wie sein größerer Bruder, ist aber kompakter und handlicher. Ideal für präzisere Schnittarbeiten und kleinere Küchen.

**Merkmale:**
- Friodur® Edelstahl — Kältegehärtet
- Kompakte Klinge für präzises Arbeiten
- Ergonomischer Four-Star-Griff
- Hergestellt in Solingen, Deutschland
- Hervorragendes Preis-Leistungs-Verhältnis

Für alle, die ein zuverlässiges, handliches Messer für den täglichen Gebrauch suchen.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '16 cm',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.15,
    badges: ['Made in Germany', 'Four Star'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Four Star Kochmesser 16 cm — Kompaktes Messer | NOVA INDUKT',
    metaDescription: 'Zwilling Four Star Kochmesser 16 cm — Friodur® Edelstahl, kompakt, hergestellt in Solingen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Four Star Kochmesser — 16 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'miyabi-5000mcd-bunka-18cm',
    supplierSku: 'MIY-5KCD-BK18',
    nameDe: 'Miyabi 5000MCD Bunka 18 cm',
    shortDescription: 'Handgeschliffenes Bunka-Messer mit MicroCarbide MC63 Stahl — made in Seki/Japan',
    descriptionDe: `Das Miyabi 5000MCD Bunka vereint japanische Messer-Tradition mit modernster Stahltechnologie. Die Klinge aus MicroCarbide MC63 Stahl wird traditionell in Seki, Japan, handgeschliffen und bietet eine außergewöhnliche Schärfe und Haltbarkeit.

**Merkmale:**
- MicroCarbide MC63 Stahl — extreme Härte und Schärfe
- 133-lagige Damastoptik für einzigartiges Design
- DREMOCK-Griff aus veredeltem Holz
- Hergestellt in Seki, Japan
- traditionelle Handveredelung

Ein Messer für anspruchsvolle Köche, die Wert auf Geschichte und Qualität legen.`,
    price: 189.99,
    oldPrice: 229.99,
    brand: 'Miyabi',
    material: 'MicroCarbide MC63 Stahl',
    dimensions: '18 cm',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.17,
    badges: ['Made in Seki/Japan', 'Bunka'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Miyabi 5000MCD Bunka 18 cm — Japanisches Messer | NOVA INDUKT',
    metaDescription: 'Miyabi 5000MCD Bunka 18 cm — MicroCarbide MC63 Stahl, handgeschliffen in Seki/Japan. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Miyabi 5000MCD Bunka — 18 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'miyabi-kaizen-santoku-18cm',
    supplierSku: 'MIY-KAI-SN18',
    nameDe: 'Miyabi Kaizen Santoku 18 cm',
    shortDescription: 'Vielseitiges Santoku mit CMV60 Stahl — aus Seki, Japan',
    descriptionDe: `Das Miyabi Kaizen Santoku ist ein vielseitiges japanisches Universalmesser, das für Schneiden, Hacken und Würfeln gleichermaßen geeignet ist. Der CMV60 Stahl bietet eine ausgewogene Kombination aus Schärfe und Robustheit.

**Merkmale:**
- CMV60 Stahl — gute Schärfe und Korrosionsbeständigkeit
- traditionelle Santoku-Form für vielseitiges Schneiden
- Ergonomischer Kaizen-Griff
- Hergestellt in Seki, Japan
- Preis-Leistungs-Sieger unter den Premium-Messern

Das Santoku ist die japanische Antwort auf das europäische Kochmesser — ideal für alle, die Wert auf Präzision legen.`,
    price: 119.99,
    oldPrice: 149.99,
    brand: 'Miyabi',
    material: 'CMV60 Stahl',
    dimensions: '18 cm',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.16,
    badges: ['Made in Seki/Japan', 'Kaizen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Miyabi Kaizen Santoku 18 cm — Japanisches Santoku Messer | NOVA INDUKT',
    metaDescription: 'Miyabi Kaizen Santoku 18 cm — CMV60 Stahl, hergestellt in Seki/Japan. Vielseitiges Universalmesser. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Miyabi Kaizen Santoku — 18 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'victorinox-fibrox-pro-santoku-18cm',
    supplierSku: 'VIX-FIBX-SN18',
    nameDe: 'Victorinox Fibrox Pro Santoku 18 cm',
    shortDescription: 'Robustes Santoku mit Fibrox-Griff — Schweizer Qualität zum Bestpreis',
    descriptionDe: `Das Victorinox Fibrox Pro Santoku bietet professionelle Qualität zum erschwinglichen Preis. Der robuste Fibrox-Griff ist rutschfest und ergonomisch geformt, während die Edelstahlklinge zuverlässig schneidet.

**Merkmale:**
- Robuster Edelstahl — langlebig und pflegeleicht
- Rutschfester Fibrox-Griff — spülmaschinenfest
- Universelle Santoku-Form
- Schweizer Qualität von Victorinox
- Spülmaschinengeeignet

Ein ideales Einsteigermesser für alle, die Wert auf Qualität ohne Kompromisse legen.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'Victorinox',
    material: 'Edelstahl',
    dimensions: '18 cm',
    dishwasherSafe: true,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.15,
    badges: ['Schweizer Qualität', 'Santoku'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Victorinox Fibrox Pro Santoku 18 cm — Schweizer Messer | NOVA INDUKT',
    metaDescription: 'Victorinox Fibrox Pro Santoku 18 cm — robust, spülmaschinenfest, Schweizer Qualität. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Victorinox Fibrox Pro Santoku — 18 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'bob-kramer-meiji-utility-messer-13cm',
    supplierSku: 'BKR-MEI-UM13',
    nameDe: 'Bob Kramer Meiji Utility-Messer 13 cm',
    shortDescription: 'Präzises Utility-Messer von Bob Kramer — SG2 Stahl, handgeschliffen',
    descriptionDe: `Das Bob Kramer Meiji Utility-Messer ist ein kleines, aber außergewöhnlich scharfes Messer für präzise Schneidarbeiten. Der SG2 Stahl bietet eine außergewöhnliche Schärfe und Haltbarkeit, während das Design von Bob Kramer für perfektes Gleichgewicht sorgt.

**Merkmale:**
- SG2 Stahl — extreme Schärfe und Haltbarkeit
- Handgeschliffen nach Tradition
- Ergonomischer Meiji-Griff
- Design von Bob Kramer
- Ideal für Obst, Gemüse und feine Schnitte

Ein Messer für alle, die Wert auf handwerkliche Perfektion legen.`,
    price: 199.99,
    oldPrice: 249.99,
    brand: 'Bob Kramer',
    material: 'SG2 Stahl',
    dimensions: '13 cm',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.12,
    badges: ['By Bob Kramer', 'SG2 Stahl'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Bob Kramer Meiji Utility-Messer 13 cm — SG2 Stahl | NOVA INDUKT',
    metaDescription: 'Bob Kramer Meiji Utility-Messer 13 cm — SG2 Stahl, handgeschliffen, präzise Schneidarbeiten. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Bob Kramer Meiji Utility — 13 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'twin-fin-ii-schaerfstahl',
    supplierSku: 'ZWI-TFII-SH',
    nameDe: 'Zwilling Twin Fin II Schärfstahl',
    shortDescription: 'Präziser Schärfstahl für die daily-Edge-Pflege — made in Germany',
    descriptionDe: `Der Zwilling Twin Fin II Schärfstahl ist das ideale Werkzeug, um die Schärfe Ihrer Messer im Alltag zu erhalten. Der Edelstahl-Stahl mit feinen Rillen richtet die Messerklinge wieder auf und hält sie schneidewert.

**Merkmale:**
- Edelstahl mit feinen Schärfnasen
- Ergonomischer Twin Fin II Griff
- Für alle Messertypen geeignet
- Hergestellt in Deutschland
- Kompaktes, elegantes Design

Regelmäßiges Abziehen mit dem Schärfstahl verlängert die Lebensdauer Ihres Messers erheblich.`,
    price: 49.99,
    oldPrice: 59.99,
    brand: 'Zwilling',
    material: 'Edelstahl',
    dimensions: '23 cm',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Made in Germany', 'Schärfstahl'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Twin Fin II Schärfstahl — Messer schärfen | NOVA INDUKT',
    metaDescription: 'Zwilling Twin Fin II Schärfstahl — Edelstahl, Made in Germany, für alle Messertypen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Twin Fin II Schärfstahl',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'victorinox-swiss-classic-messerset-6tlg',
    supplierSku: 'VIX-SWCL-MS6',
    nameDe: 'Victorinox Swiss Classic Messerset 6-teilig',
    shortDescription: 'Komplettes 6-teiliges Messerset — Schweizer Qualität für jeden Bedarf',
    descriptionDe: `Das Victorinox Swiss Classic Messerset enthält sechs vielseitige Küchenmesser für jeden Bedarf. Von der Brotmesser bis zum Gemüsemesser — jedes Messer bietet die typische Schweizer Qualität von Victorinox.

**Merkmale:**
- 6 vielseitige Küchenmesser
- Robuster Edelstahl
- Rutschfeste Griffe
- Spülmaschinengeeignet
- Schweizer Qualität von Victorinox
- Lieferung in praktischer Box

Das ideale Set für alle, die ihre Küchenmesserausstattung komplettieren möchten.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Victorinox',
    material: 'Edelstahl',
    dimensions: '6-teilig',
    dishwasherSafe: true,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.0,
    badges: ['Schweizer Qualität', '6-teilig'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Victorinox Swiss Classic Messerset 6-teilig — Messer Set | NOVA INDUKT',
    metaDescription: 'Victorinox Swiss Classic Messerset 6-teilig — Schweizer Qualität, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Victorinox Swiss Classic Messerset — 6-teilig',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Messer (8 Produkte)')
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
    console.log('\n🎉 Seed Extra Messer terminé avec succès !')
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
