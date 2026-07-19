/**
 * NOVA INDUKT — Seed : Schnellkochtöpfe (5 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-schnellkochtopfe.ts
 *
 * Catégories couvertes :
 *   - Sous-cat : Schnellkochtöpfe (Prods 1–5)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Génère les images à partir du dossier public local */
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
  // ══════════════════════════════════════════════════════════════
  // SOUS-CATÉGORIE : SCHNELLKOCHTÖPFE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'fissler-vitavit-edition-45l',
    supplierSku: 'FIS-VVE-45',
    nameDe: 'Fissler vitavit edition Schnellkochtopf 4,5 L',
    shortDescription: 'Premium-Schnellkochtopf aus Edelstahl 18/10 mit Sicomatic®-Verschluss — Made in Germany',
    descriptionDe: `Die Fissler vitavit edition 4,5 L gehört zu den besten Schnellkochtöpfen auf dem deutschen Markt. Der hochwertige Edelstahlkörper 18/10 und das patentierte Sicomatic®-Verschlusssystem garantieren schnelles und sicheres Kochen bei gleichmäßiger Wärmeverteilung.

**Merkmale:**
- Edelstahl 18/10 — robust, langlebig und Geschmacksneutral
- Sicomatic®-Verschluss — schnelles und sicheres Verschließen
- Integrierter Dampfregler für präzise Drucksteuerung
- Ferromagnetischer Boden — 100 % induktionskompatibel
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 10 Jahre Garantie

Die vitavit edition verbindet deutsche Ingenieurskunst mit höchster Kochkomfort für anspruchsvolle Hobbykoch und Profis.`,
    price: 99.99,
    oldPrice: 129.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '4,5 L, Ø 22 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['Made in Germany', '10 Jahre Garantie', 'Sicomatic®'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler vitavit edition 4,5 L Schnellkochtopf — Edelstahl, Induktion | NOVA INDUKT',
    metaDescription: 'Fissler vitavit edition Schnellkochtopf 4,5 L aus Edelstahl 18/10 mit Sicomatic®-Verschluss. Made in Germany, 10 Jahre Garantie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'Fissler vitavit edition — 4,5 L',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'fissler-vitavit-edition-65l',
    supplierSku: 'FIS-VVE-65',
    nameDe: 'Fissler vitavit edition Schnellkochtopf 6,5 L',
    shortDescription: 'Großvolumiger Premium-Schnellkochtopf mit Sicomatic® — ideal für Familien',
    descriptionDe: `Die Fissler vitavit edition 6,5 L bietet das gleiche exzellente Qualitätsniveau wie das kleinere Modell, jedoch mit großzügigem Fassungsvermögen für Familien und größere Portionen. Der Edelstahl 18/10 und das Sicomatic®-System machen den Unterschied.

**Merkmale:**
- Großes Volumen von 6,5 L — ideal für 4–6 Personen
- Edelstahl 18/10 — hochwertig und langlebig
- Sicomatic®-Verschluss — schnelles und sicheres Verschließen
- Integrierter Dampfregler für präzise Drucksteuerung
- Ferromagnetischer Boden — 100 % induktionskompatibel
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 10 Jahre Garantie

Das große Modell der vitavit edition Serie — für alle, die viel und schnell kochen möchten.`,
    price: 119.99,
    oldPrice: 149.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: '6,5 L, Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.2,
    badges: ['Made in Germany', '10 Jahre Garantie', 'Sicomatic®'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler vitavit edition 6,5 L Schnellkochtopf — Familien-Modell | NOVA INDUKT',
    metaDescription: 'Fissler vitavit edition Schnellkochtopf 6,5 L — Edelstahl 18/10, Sicomatic®-Verschluss, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'Fissler vitavit edition — 6,5 L',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'wmf-perfect-plus-45l',
    supplierSku: 'WMF-PP-45',
    nameDe: 'WMF Perfect Plus Schnellkochtopf 4,5 L',
    shortDescription: 'Cromargan® Edelstahl-Schnellkochtopf mit TransTherm®-Boden — Made in Germany',
    descriptionDe: `Das WMF Perfect Plus 4,5 L vereint das bewährte Cromargan®-Material mit der patentierten TransTherm®-Technologie für optimale Wärmespeicherung und gleichmäßige Verteilung auf Induktionskochfeldern.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — WMFs Premium-Material
- TransTherm®-Boden — optimale Wärmespeicherung und -verteilung
- universeller Dampfkorb für verschiedene Zubereitungsarten
- Einfache und sichere Bedienung
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 10 Jahre Garantie auf das Cromargan®-Material

WMF steht für deutsche Qualität und langlebige Kochgeschirr — das Perfect Plus ist ein Klassiker.`,
    price: 89.99,
    oldPrice: 119.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '4,5 L, Ø 22 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.6,
    badges: ['Made in Germany', 'TransTherm®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Perfect Plus 4,5 L Schnellkochtopf — Cromargan® | NOVA INDUKT',
    metaDescription: 'WMF Perfect Plus Schnellkochtopf 4,5 L mit TransTherm®-Boden. Cromargan® Edelstahl 18/10, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'WMF Perfect Plus — 4,5 L',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'wmf-perfect-plus-65l',
    supplierSku: 'WMF-PP-65',
    nameDe: 'WMF Perfect Plus Schnellkochtopf 6,5 L',
    shortDescription: 'Großvolumiger Cromargan®-Schnellkochtopf mit TransTherm® — ideal für Familien',
    descriptionDe: `Das WMF Perfect Plus 6,5 L bietet großzügiges Fassungsvermögen für Familienkochen und größere Mahlzeiten. Cromargan® und TransTherm® sorgen für exzellente Kochergebnisse auf Induktionsherden.

**Merkmale:**
- Großes Volumen von 6,5 L — ideal für 4–6 Personen
- Cromargan® Edelstahl 18/10 — langlebig und resistent
- TransTherm®-Boden — gleichmäßige Wärmeverteilung ohne Hotspots
- Universeller Dampfkorb für flexibles Kochen
- Spülmaschinengeeignet
- Hergestellt in Deutschland
- 10 Jahre Garantie

Das große Perfect Plus Modell — für anspruchsvolle Familienküche mit WMF-Qualität.`,
    price: 109.99,
    oldPrice: 139.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: '6,5 L, Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.0,
    badges: ['Made in Germany', 'TransTherm®'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Perfect Plus 6,5 L Schnellkochtopf — Großes Modell | NOVA INDUKT',
    metaDescription: 'WMF Perfect Plus Schnellkochtopf 6,5 L — Cromargan® Edelstahl, TransTherm®-Boden, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'WMF Perfect Plus — 6,5 L',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },

  {
    slug: 'kuhn-rikon-duromatic-50l',
    supplierSku: 'KRN-DT-50',
    nameDe: 'Kuhn Rikon Duromatic Top Schnellkochtopf 5,0 L',
    shortDescription: 'Schweizer Qualität — Edelstahl-Schnellkochtopf mit 5 Jahre Garantie',
    descriptionDe: `Der Kuhn Rikon Duromatic Top 5,0 L steht für Schweizer Präzision und höchste Qualität im Bereich Schnellkochtöpfe. Der robuste Edelstahl 18/10 und das bewährte Duromatic-System ermöglichen schnelles und energiesparendes Kochen.

**Merkmale:**
- Edelstahl 18/10 — hochwertig und langlebig
- Duromatic-Verschluss — schnelles und sicheres Öffnen/Schließen
- Optimale Wärmeverteilung durch dicken Sandwichboden
- Ferromagnetischer Boden — 100 % induktionskompatibel
- Spülmaschinengeeignet
- Hergestellt in der Schweiz
- 5 Jahre Garantie

Kuhn Rikon steht für Schweizer Spitzenqualität — der Duromatic Top ist ein Garant für langlebige Kochfreude.`,
    price: 89.99,
    oldPrice: 119.99,
    brand: 'Kuhn Rikon',
    material: 'Edelstahl 18/10',
    dimensions: '5,0 L, Ø 22 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Made in Switzerland', '5 Jahre Garantie'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Kuhn Rikon Duromatic Top 5,0 L Schnellkochtopf — Schweizer Qualität | NOVA INDUKT',
    metaDescription: 'Kuhn Rikon Duromatic Top Schnellkochtopf 5,0 L — Edelstahl 18/10, Made in Switzerland, 5 Jahre Garantie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'schnellkochtopfe',
    folder: 'Kuhn Rikon Duromatic Top — 5,0 L',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed : Schnellkochtöpfe (5 Produkte)')
  console.log('─'.repeat(60))

  // Récupérer les catégories existantes
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
        // Mise à jour
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

        // Mettre à jour les images
        await prisma.productImage.deleteMany({ where: { productId: existing.id } })
        await prisma.productImage.createMany({
          data: imageData.map((img) => ({ ...img, productId: existing.id })),
        })

        updated++
        console.log(`  ↻  [${updated + created}/${products.length}] MIS À JOUR : ${p.nameDe.substring(0, 55)}`)
      } else {
        // Création
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
    console.log('\n🎉 Seed Schnellkochtöpfe terminé avec succès !')
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
