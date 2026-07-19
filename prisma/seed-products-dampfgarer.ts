/**
 * NOVA INDUKT — Seed Catégorie : Dampfgareinsätze / Dämpfeinsätze für Induktion (5 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-dampfgarer.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function imgs(folder: string, files: string[]) {
  const base = `/images/products/${folder}`
  return files.map((file, i) => ({
    url: `${base}/${file}`,
    alt: folder,
    sortOrder: i,
    isMain: i === 0,
  }))
}

const products = [
  {
    slug: 'fissler-opc-daempfeinsatz-20cm',
    supplierSku: 'FIS-OPC-DE20',
    sortOrder: 11,
    nameDe: 'Fissler Original Profi Collection Dämpfeinsatz 20 cm',
    shortDescription: 'Hochwertiger Dämpfeinsatz für die Fissler OPC-Serie — vitaminbewarendes Garen im Edelstahl',
    descriptionDe: `Der Fissler Original Profi Collection Dämpfeinsatz (20 cm) ist die ideale Ergänzung für alle Fissler OPC-Bräter und -Töpfe. Mit ihm schonen Sie wertvolle Vitamine und behalten den vollen Geschmack Ihrer Speisen.

**Merkmale:**
- Hochwertiger Edelstahl 18/10 für langlebigen Einsatz und optimale Wärmeverteilung
- Exakte Passform für alle Fissler Original Profi Collection Töpfe mit Ø 20 cm
- Vitaminschonendes Dämpfen von Gemüse, Fisch und Geflügel
- Kaltbleibende Edelstahl-Handgriffe für sicheres Herausnehmen
- Spülmaschinenfest und pflegeleicht
- Ofengeeignet bis 230°C
- Made in Germany mit 10 Jahre Garantie

Der Dämpfeinsatz ermöglicht sanftes Garen auf dem Induktionsherd und passt perfekt in die Fissler OPC-Kochsysteme. Die 18/10er Edelstahlqualität garantiert eine gleichmäßige Hitzeverteilung und lange Lebensdauer.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 20 cm, Höhe 11 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.65,
    badges: ['Made in Germany', 'CookStar®', '10 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Dämpfeinsatz 20 cm Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Dämpfeinsatz Ø 20 cm aus Edelstahl 18/10. Vitaminbewares Garen auf Induktion. Ofengeeignet bis 230°C. Made in Germany.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Fissler — Original Profi Collection Dämpfeinsatz Ø 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-opc-daempfeinsatz-24cm',
    supplierSku: 'FIS-OPC-DE24',
    sortOrder: 12,
    nameDe: 'Fissler Original Profi Collection Dämpfeinsatz 24 cm',
    shortDescription: 'Großer Dämpfeinsatz für die Fissler OPC 24 cm Serie — sparsam und vitaminreich garen',
    descriptionDe: `Der Fissler Original Profi Collection Dämpfeinsatz (24 cm) wurde für die größeren Töpfe der OPC-Serie entwickelt und bietet Platz für großzügige Portionen.

**Merkmale:**
- Premium-Edelstahl 18/10 für erstklassige Qualität
- Exakte Passform für Fissler OPC Töpfe mit Ø 24 cm
- Perfekt zum schonenden Dämpfen von Gemüse, Fisch, Reis und vielem mehr
- Kaltbleibende Griffe für komfortables Arbeiten
- Spülmaschinenfest und sehr strapazierfähig
- Ofenfest bis zu 230°C
- Made in Germany mit 10 Jahre Garantie

Der 24 cm Dämpfeinsatz eignet sich besonders gut für Familienportionen und große Mengen. Dank des intelligenten Designs passt er perfekt in den 24er OPC-Bräter und sorgt für gleichmäßige Hitzeverteilung bei der Induktionszubereitung.`,
    price: 95.00,
    oldPrice: 119.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 11 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.75,
    badges: ['Made in Germany', 'CookStar®', '10 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Dämpfeinsatz 24 cm Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Dämpfeinsatz Ø 24 cm. Premium Edelstahl 18/10 für vitaminbewares Garen. Ofenfest, spülmaschinenfest. Made in Germany.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Fissler — Original Profi Collection Dämpfeinsatz Ø 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'zwilling-plus-daempfeinsatz-24cm',
    supplierSku: 'ZWI-PLUS-DE24',
    sortOrder: 13,
    nameDe: 'Zwilling Plus Dämpfeinsatz 24 cm',
    shortDescription: 'Universell einsetzbarer Dämpfeinsatz mit seitlichen Griffen für 24 cm Töpfe',
    descriptionDe: `Der Zwilling Plus Dämpfeinsatz (24 cm) ist ein vielseitiges Küchenhelfer für alle, die Wert auf gesundes und schonendes Garen legen. Mit seinen durchdachten seitlichen Griffen lässt er sich problemlos in und aus dem Topf heben.

**Merkmale:**
- Hochwertiger Edelstahl 18/10 für lange Lebensdauer
- Universell passend für viele 24 cm Kochtöpfe und -systeme
- Ergonomische seitliche Griffe für sicheren Halt
- Sanftes Garen von Gemüse, Fisch und eiweißreichen Speisen
- Leicht zu reinigen — spülmaschinenfest
- Robuste Verarbeitung für den täglichen Einsatz

Der Dämpfeinsatz von Zwilling bietet ein hervorragendes Preis-Leistungs-Verhältnis und überzeugt durch die bewährte Zwilling Qualität. Die seitlichen Griffe machen das Handling besonders sicher und komfortabel.`,
    price: 39.95,
    oldPrice: 49.95,
    brand: 'Zwilling',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 9 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.62,
    badges: ['Universell', 'Spülmaschinenfest', 'Seitliche Griffe'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Plus Dämpfeinsatz 24 cm Edelstahl | NOVA INDUKT',
    metaDescription: 'Zwilling Plus Dämpfeinsatz Ø 24 cm aus Edelstahl 18/10. Universell passend, mit seitlichen Griffen. Spülmaschinenfest, ideal für Induktion.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Zwilling — Plus Dämpfeinsatz Ø 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'wmf-compact-cuisine-dampfgareinsatz-24cm',
    supplierSku: 'WMF-COMPACT-DE24',
    sortOrder: 14,
    nameDe: 'WMF Compact Cuisine Dampfgareinsatz 24 cm',
    shortDescription: 'Stapelfähiger Dampfgareinsatz aus Cromargan® — ideal für die sparsame Küche',
    descriptionDe: `Der WMF Compact Cuisine Dampfgareinsatz (24 cm) wurde für die platzsparende Aufbewahrung entwickelt und eignet sich hervorragend für gesundes Garen auf Induktionskochfeldern.

**Merkmale:**
- Exklusiv aus Cromargan® Edelstahl 18/10 — particularly langlebig und pflegeleicht
- Stapelbar für platzsparende Aufbewahrung in der Küchenschublade
- Kompatibel mit allen WMF Compact Cuisine Töpfen (Ø 24 cm)
- Perforierter Boden für gleichmäßige Hitzeverteilung und optimalen Wasserkreislauf
- Kaltbleibende Griffe für sicheren Transport
- Spülmaschinenfest und rostfrei
- Made in Germany — deutsche Qualität

Der Compact Cuisine Dampfgareinsatz ist die perfekte Wahl für bewusstes Kochen. Das Cromargan® Material sorgt für gleichmäßige Temperaturverteilung, während das stapelbare Design Platz in der Küche spart.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 11,5 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.06,
    badges: ['Made in Germany', 'Compact Cuisine', 'Stapelbar'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Compact Cuisine Dampfgareinsatz 24 cm | NOVA INDUKT',
    metaDescription: 'WMF Compact Cuisine Dampfgareinsatz Ø 24 cm aus Cromargan® Edelstahl. Stapelbar, spülmaschinenfest. Perfekt für gesundes Garen auf Induktion.',
    categorySlug: 'induktions-zubehoer',
    folder: 'WMF — Compact Cuisine Dampfgareinsatz Ø 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-opc-daempfeinsatz-28cm',
    supplierSku: 'FIS-OPC-DE28',
    sortOrder: 15,
    nameDe: 'Fissler Original Profi Collection Dämpfeinsatz 28 cm',
    shortDescription: 'Der große Dämpfeinsatz für die Fissler OPC Serie — perfekt für Großfamilien und Feierlichkeiten',
    descriptionDe: `Der Fissler Original Profi Collection Dämpfeinsatz (28 cm) ist das größte Modell der beliebten OPC-Serie und bietet maximale Kapazität für anspruchsvolle Gerichte.

**Merkmale:**
- Erstklassiger Edelstahl 18/10 für professionelle Qualität
- Großzügige Passform für Fissler OPC Töpfe mit Ø 28 cm
- Ideal für große Familienportionen, Buffets und festliche Anlässe
- Vitaminschonendes Garen mit optimaler Hitzeverteilung
- Kaltbleibende, ergonomische Handgriffe
- Spülmaschinenfest und sehr langlebig
- Ofenfest bis 230°C
- Made in Germany mit 10 Jahre Garantie

Der 28 cm Dämpfeinsatz rundet die Fissler OPC-Kochsysteme ab und ermöglicht das Garen großer Mengen ohne Kompromisse bei der Qualität. Ob Gemüse, Fisch oder Reis — mit diesem Dämpfeinsatz wird jedes Gericht zum Erlebnis.`,
    price: 109.00,
    oldPrice: 139.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 28 cm, Höhe 11 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.85,
    badges: ['Made in Germany', 'Großes Format', '10 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Dämpfeinsatz 28 cm Edelstahl | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Dämpfeinsatz Ø 28 cm. Großes Format für Familien. Edelstahl 18/10, ofenfest, Made in Germany.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Fissler — Original Profi Collection Dämpfeinsatz Ø 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie : Dampfgareinsätze / Dämpfeinsätze (5 Produits)')
  console.log('─'.repeat(70))

  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]))

  let created = 0
  let updated = 0
  let errors = 0

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug)
    if (!categoryId) {
      console.error(`  ❌ Catégorie introuvable : ${p.categorySlug}`)
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
        console.log(`  ↻  [${updated + created}/${products.length}] MIS À JOUR : ${p.nameDe.substring(0, 60)}`)
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
            images: { create: imageData },
          },
        })
        created++
        console.log(`  ✓  [${updated + created}/${products.length}] CRÉÉ : ${p.nameDe.substring(0, 60)}`)
      }
    } catch (err: unknown) {
      errors++
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗  ERREUR : ${p.nameDe.substring(0, 40)} — ${msg}`)
    }
  }

  console.log('\n' + '═'.repeat(70))
  console.log('📊 RÉSUMÉ BATCH DAMPFGARER')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Catégorie Dampfgareinsätze terminée avec succès ! 5/5 produits en base.')
  } else {
    console.log(`\n⚠️  ${errors} erreur(s) — vérifiez les logs.`)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
