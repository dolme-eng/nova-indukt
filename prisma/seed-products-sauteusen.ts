/**
 * NOVA INDUKT — Seed Sauteusen : 6 Sauteusen
 * Exécuter avec : npx tsx prisma/seed-products-sauteusen.ts
 *
 * Catégories couvertes :
 *   - Sauteusen (Prods 1–6)
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
  {
    slug: 'fissler-opc-sauteuse-24cm',
    supplierSku: 'FIS-OPC-SA24',
    nameDe: 'Fissler OPC Sauteuse 24 cm',
    shortDescription: 'Hochwertige Edelstahl-Sauteuse mit CookStar® Boden — Made in Germany',
    descriptionDe: `Die Fissler OPC Sauteuse 24 cm vereint deutsche Präzisionsarbeit mit einem universellen Einsatzspektrum. Der patentierte CookStar®-Boden sorgt für gleichmäßige Wärmeverteilung auf allen Herdarten, insbesondere auf Induktionskochfeldern.

**Merkmale:**
- Hochwertiger Edelstahl 18/10 — langlebig und geschmacksneutral
- Patentierter CookStar®-Boden für optimale Wärmeverteilung
- Perfekt für Induktion — ferromagnetischer Boden
- Spülmaschinengeeignet
- 15 Jahre Garantie
- Hergestellt in Deutschland

Die OPC-Serie ist die Premium-Auswahl für anspruchsvolle Kochenthusiasten.`,
    price: 139.99,
    oldPrice: 179.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 8 cm, 2,8 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.6,
    badges: ['Made in Germany', 'CookStar®', '15 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Sauteuse 24 cm — Edelstahl Sauteuse | NOVA INDUKT',
    metaDescription: 'Fissler OPC Sauteuse 24 cm aus Edelstahl 18/10 mit CookStar® Boden. Induktionsgeeignet, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Fissler OPC Sauteuse — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-opc-sauteuse-28cm',
    supplierSku: 'FIS-OPC-SA28',
    nameDe: 'Fissler OPC Sauteuse 28 cm',
    shortDescription: 'Große Edelstahl-Sauteuse mit CookStar® Boden — 3,6 L Fassungsvermögen',
    descriptionDe: `Die Fissler OPC Sauteuse 28 cm bietet dank ihres großzügigen Fassungsvermögens von 3,6 Litern idealen Platz für Familienmahlzeiten. Der CookStar®-Boden garantiert eine gleichmäßige Wärmeverteilung, während der Edelstahl 18/10 höchsten Qualitätsansprüchen genügt.

**Merkmale:**
- Premium-Edelstahl 18/10 — robust und langlebig
- Patentierter CookStar®-Boden für gleichmäßiges Garen
- Großzügiges Volumen von 3,6 L — ideal für 4–5 Personen
- Spülmaschinengeeignet
- 15 Jahre Garantie
- Hergestellt in Deutschland

Die große OPC Sauteuse ist der perfekte Begleiter für anspruchsvolles Kochen im Alltag.`,
    price: 159.99,
    oldPrice: 199.99,
    brand: 'Fissler',
    material: 'Edelstahl 18/10',
    dimensions: 'Ø 28 cm, Höhe 8 cm, 3,6 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.9,
    badges: ['Made in Germany', 'CookStar®', '15 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Sauteuse 28 cm — Edelstahl Sauteuse | NOVA INDUKT',
    metaDescription: 'Fissler OPC Sauteuse 28 cm aus Edelstahl 18/10, 3,6 L Volumen, CookStar® Boden. Induktionsgeeignet, Made in Germany.',
    categorySlug: 'sauteusen',
    folder: 'Fissler OPC Sauteuse — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-function-4-sauteuse-24cm',
    supplierSku: 'WMF-F4-SA24',
    nameDe: 'WMF Function 4 Sauteuse 24 cm',
    shortDescription: 'Vielseitige Sauteuse mit innovativem Function 4 Deckel — Cromargan®',
    descriptionDe: `Die WMF Function 4 Sauteuse 24 cm besticht durch ihren innovativen Function 4 Deckel, der vier praktische Funktionen in einem Deckel vereint. Cromargan® Edelstahl 18/10 sorgt für Langlebigkeit und ein elegantes Design.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — robust und edel
- Function 4 Deckel mit vier Funktionen (Abgießen, Dämpfen, Ausgießen, Auffangen)
- TransTherm®-Universalboden — perfekt für Induktion
- Spülmaschinengeeignet
- Hergestellt in Deutschland

Die Function 4 Serie verbindet intelligente Funktionalität mit bewährter WMF-Qualität.`,
    price: 119.99,
    oldPrice: 149.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 24 cm, Höhe 8 cm, 2,8 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.4,
    badges: ['Made in Germany', 'Function 4 Deckel'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Sauteuse 24 cm — Cromargan® | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Sauteuse 24 cm aus Cromargan® Edelstahl mit Function 4 Deckel. Induktionsgeeignet, Made in Germany.',
    categorySlug: 'sauteusen',
    folder: 'WMF Function 4 Sauteuse — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-function-4-sauteuse-28cm',
    supplierSku: 'WMF-F4-SA28',
    nameDe: 'WMF Function 4 Sauteuse 28 cm',
    shortDescription: 'Große Sauteuse mit Function 4 Deckel — 3,6 L für Familienküche',
    descriptionDe: `Die WMF Function 4 Sauteuse 28 cm bietet großzügigen Raum für Familienmahlzeiten und überzeugt durch den vielseitigen Function 4 Deckel. Cromargan® Edelstahl 18/10 garantiert Langlebigkeit und ein modernes Erscheinungsbild.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — hochwertig und pflegeleicht
- Function 4 Deckel: Abgießen, Dämpfen, Ausgießen, Auffangen
- Großes Volumen von 3,6 L — ideal für große Portionen
- TransTherm®-Universalboden für alle Herdarten
- Spülmaschinengeeignet
- Hergestellt in Deutschland

Die große Function 4 Sauteuse ist die ideale Wahl für die Familienküche.`,
    price: 139.99,
    oldPrice: 179.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10',
    dimensions: 'Ø 28 cm, Höhe 8 cm, 3,6 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.7,
    badges: ['Made in Germany', 'Function 4 Deckel'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'WMF Function 4 Sauteuse 28 cm — Cromargan® | NOVA INDUKT',
    metaDescription: 'WMF Function 4 Sauteuse 28 cm, 3,6 L Volumen, mit Function 4 Deckel. Cromargan® Edelstahl, induktionsgeeignet.',
    categorySlug: 'sauteusen',
    folder: 'WMF Function 4 Sauteuse — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'demeyere-industry-5-sauteuse-24cm',
    supplierSku: 'DEM-IND5-SA24',
    nameDe: 'Demeyere Industry 5 Sauteuse 24 cm',
    shortDescription: 'Premium-Sauteuse mit 5-Schicht-Technologie — 30 Jahre Garantie',
    descriptionDe: `Die Demeyere Industry 5 Sauteuse 24 cm ist ein Meisterwerk der belgischen Metallverarbeitung. Mit ihrer einzigartigen 5-Schicht-Konstruktion bietet sie eine unvergleichliche Wärmeverteilung und -speicherung, die selbst Profiköche überzeugt.

**Merkmale:**
- 5-Schicht-Induktionstechnologie für optimale Wärmeverteilung
- Edelstahl 18/10 — hochwertig und langlebig
- InducPan-Induktionsbodon — maximale Energieeffizienz
- Spülmaschinengeeignet
- 30 Jahre Garantie
- Hergestellt in Belgien

Die Industry 5 Serie steht für höchste Qualitätsansprüche und europäische Handwerkskunst.`,
    price: 149.99,
    oldPrice: 189.99,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 (5-Schicht)',
    dimensions: 'Ø 24 cm, Höhe 8 cm, 3,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.7,
    badges: ['30 Jahre Garantie', '5-Schicht', 'Made in Belgium'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Demeyere Industry 5 Sauteuse 24 cm — 5-Schicht Premium | NOVA INDUKT',
    metaDescription: 'Demeyere Industry 5 Sauteuse 24 cm mit 5-Schicht-Technologie. 30 Jahre Garantie, Made in Belgium. Jetzt bei NOVA INDUKT.',
    categorySlug: 'sauteusen',
    folder: 'Demeyere Industry 5 Sauteuse — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'demeyere-industry-5-sauteuse-28cm',
    supplierSku: 'DEM-IND5-SA28',
    nameDe: 'Demeyere Industry 5 Sauteuse 28 cm',
    shortDescription: 'Premium-Sauteuse mit 5-Schicht-Technologie — 3,8 L Fassungsvermögen',
    descriptionDe: `Die Demeyere Industry 5 Sauteuse 28 cm ist die großzügige Variante der gefeierten Industry 5 Serie. Mit 3,8 Litern Volumen und der patentierten 5-Schicht-Konstruktion ist sie die perfekte Wahl für alle, die höchste Ansprüche an ihre Kochgeschirr stellen.

**Merkmale:**
- 5-Schicht-Induktionstechnologie für perfekte Wärmeverteilung
- Edelstahl 18/10 — geschmacksneutral und robust
- Großes Volumen von 3,8 L — ideal für 4–6 Personen
- InducPan-Induktionsbodon
- Spülmaschinengeeignet
- 30 Jahre Garantie
- Hergestellt in Belgien

Die Industry 5 Sauteuse 28 cm verbindet belgische Handwerkskunst mit modernster Technologie.`,
    price: 169.99,
    oldPrice: 219.99,
    brand: 'Demeyere',
    material: 'Edelstahl 18/10 (5-Schicht)',
    dimensions: 'Ø 28 cm, Höhe 8 cm, 3,8 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['30 Jahre Garantie', '5-Schicht', 'Made in Belgium'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Demeyere Industry 5 Sauteuse 28 cm — 5-Schicht Premium | NOVA INDUKT',
    metaDescription: 'Demeyere Industry 5 Sauteuse 28 cm mit 5-Schicht-Technologie, 3,8 L. 30 Jahre Garantie, Made in Belgium.',
    categorySlug: 'sauteusen',
    folder: 'Demeyere Industry 5 Sauteuse — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Sauteusen : 6 Produkte')
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
    console.log('\n🎉 Sauteusen-Seed terminé avec succès !')
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
