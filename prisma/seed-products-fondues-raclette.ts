/**
 * NOVA INDUKT — Seed Batch : 6 Fondues & Raclette
 * Exécuter avec : npx tsx prisma/seed-products-fondues-raclette.ts
 *
 * Catégories couvertes :
 *   - Fondues & Raclette (Prods 1–6)
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
  // FONDUES & RACLETTE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'stelton-emma-fondue-set',
    supplierSku: 'STL-EMM-FD15',
    nameDe: 'Stelton Emma Fondue-Set 1,5 L',
    shortDescription: 'Elegantes Fondue-Set im skandinavischen Design — Emaille und Edelstahl',
    descriptionDe: `Das Stelton Emma Fondue-Set 1,5 L verbindet dänisches Minimaldesign mit erstklassiger Kochleistung. Die Emaille-Schale auf edelstahlernem Ständer sorgt für gleichmäßige Erhitzung, während das elegante Design jeden Esstisch verschönert.

**Merkmale:**
- Premium-Emaille-Schale auf Edelstahlständer
- Volumen: 1,5 L — ideal für 4–6 Personen
- Induktionsgeeignet für flexible Nutzung
- Elegantes, zeitloses dänisches Design
- Abnehmbarer Brenner für einfache Reinigung
- Inklusive Edelstahl-Fonduegabeln (6 Stk.)
- Nicht spülmaschinengeeignet — Handwäsche empfohlen

Das Emma Fondue-Set — wo skandinavische Eleganz auf Genusskultur trifft.`,
    price: 179.99,
    oldPrice: 219.99,
    brand: 'Stelton',
    material: 'Emaille+Edelstahl',
    dimensions: '1,5 L, Ø 18 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Dänisches Design', 'Premium'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Stelton Emma Fondue-Set 1,5 L — Dänisches Design | NOVA INDUKT',
    metaDescription: 'Stelton Emma Fondue-Set 1,5 L aus Emaille und Edelstahl. Dänisches Design, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Stelton Emma Fondue-Set — 1,5 L',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'tefal-apicio-fondue-set',
    supplierSku: 'TEF-APC-FD12',
    nameDe: 'Tefal Apicio Fondue-Set 1,2 L',
    shortDescription: 'Antihaft-Fondue-Set mit Edelstahleinlage — einfach und pflegeleicht',
    descriptionDe: `Das Tefal Apicio Fondue-Set 1,2 L ist die perfekte Einsteiger- oder Alltags-Fondue-Lösung. Die Antihaft-Innenbeschichtung sorgt dafür, dass Käse und Schokolade nicht anbrennen, und macht die Reinigung zum Kinderspiel.

**Merkmale:**
- Antihaft-Innenbeschichtung — kein Anbrennen, einfache Reinigung
- Volumen: 1,2 L — ideal für 2–4 Personen
- Edelstahleinlage für langlebigen Einsatz
- Induktionsgeeignet
- Spülmaschinengeeignet
- Kompaktes Design — platzsparendes Verstauen
- Schnelle und gleichmäßige Erhitzung

Das Apicio Set — für unkompliziertes Fondue-Vergnügen im Alltag.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Tefal',
    material: 'Aluminium + Edelstahl',
    dimensions: '1,2 L, Ø 16 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Antihaft', 'Einfach'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Tefal Apicio Fondue-Set 1,2 L — Antihaft, Induktion | NOVA INDUKT',
    metaDescription: 'Tefal Apicio Fondue-Set 1,2 L mit Antihaftbeschichtung. Spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Tefal Apicio Fondue-Set — 1,2 L',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'tefal-preference-raclette-pfanne',
    supplierSku: 'TEF-PREF-RP8',
    nameDe: 'Tefal Préférence Raclette-Pfanne 8-teilig',
    shortDescription: 'Komplettes Raclette-Set mit 8 Pfännchen — Granitium-Antihaft',
    descriptionDe: `Das Tefal Préférence Raclette-Set bietet alles, was für gemütliche Raclette-Abende benötigt wird. Acht hochwertige Pfännchen mit Granitium-Antihaftbeschichtung ermöglichen gleichzeitiges Garen und Servieren.

**Merkmale:**
- 8 teilmöblierte Pfännchen mit Granitium-Antihaftbeschichtung
- Induktionsgeeignet — flexibel auf verschiedenen Herden einsetzbar
- Spülmaschinengeeignet — einfache Reinigung nach dem Raclette-Abend
- Kompaktes Design — platzsparendes Verstauen
- Gleichmäßige Erhitzung für perfekte Ergebnisse
- Robuste Verarbeitung für langlebigen Einsatz

Das komplette Set für den perfekten Raclette-Abend mit Familie und Freunden.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'Tefal',
    material: 'Aluminium + Granitium',
    dimensions: '8-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Granitium', '8 Pfännchen'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Tefal Préférence Raclette-Pfanne 8-teilig — Granitium | NOVA INDUKT',
    metaDescription: 'Tefal Préférence Raclette-Set 8-teilig mit Granitium-Antihaftbeschichtung. Induktionsgeeignet, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Tefal Préférence Raclette-Pfanne — 8-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'bugatti-fondue-set-15l',
    supplierSku: 'BUG-FD-15',
    nameDe: 'Bugatti Fondue-Set 1,5 L',
    shortDescription: 'Italienisches Fondue-Set mit Keramik-Heizkörper — Design und Qualität',
    descriptionDe: `Das Bugatti Fondue-Set 1,5 L vereint italienisches Design mit höchster Funktionalität. Der innovative Keramik-Heizkörper sorgt für präzise und gleichmäßige Temperaturregelung, während das edle Edelstahldesign jeden Tisch verschönert.

**Merkmale:**
- Edelstahlkörper mit Keramik-Heizkörper — präzise Temperaturregelung
- Volumen: 1,5 L — ideal für 4–6 Personen
- Induktionsgeeignet
- Spülmaschinengeeignet
- Italienisches Design — elegante Optik
- Inklusive Edelstahl-Fonduegabeln
- Robuste Verarbeitung

Das Bugatti Fondue-Set — wo italienische Lebensart auf erstklassige Kochkunst trifft.`,
    price: 129.99,
    oldPrice: 159.99,
    brand: 'Bugatti',
    material: 'Edelstahl + Keramik',
    dimensions: '1,5 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.2,
    badges: ['Italienisches Design', 'Keramik-Heizkörper'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Bugatti Fondue-Set 1,5 L — Italienisches Design, Keramik | NOVA INDUKT',
    metaDescription: 'Bugatti Fondue-Set 1,5 L mit Keramik-Heizkörper. Italienisches Design, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Bugatti Fondue-Set — 1,5 L',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-fondue-set-20l',
    supplierSku: 'ZWI-SPIR-FD20',
    nameDe: 'Zwilling Spirit Fondue-Set 2,0 L',
    shortDescription: 'Edelstahl-Fondue-Set der Spirit-Serie — großes Volumen, robust',
    descriptionDe: `Das Zwilling Spirit Fondue-Set 2,0 L bietet großzügiges Platz für größere Gesellschaften. Aus hochwertigem Edelstahl gefertigt, überzeugt es durch seine robuste Bauweise und die exzellente Wärmeverteilung der Spirit-Serie.

**Merkmale:**
- Hochwertiger Edelstahl — robust und langlebig
- Großes Volumen: 2,0 L — ideal für 6–8 Personen
- Induktionsgeeignet
- Spülmaschinengeeignet
- Praktischer Deckel zum kontrollierten Schmelzen
- Ergonomischer Griff für sicheres Tragen
- Inklusive Edelstahl-Fonduegabeln (6 Stk.)

Das Spirit Fondue-Set — für großzügiges Fondue-Vergnügen in anspruchsvollem Design.`,
    price: 89.99,
    oldPrice: 119.99,
    brand: 'Zwilling',
    material: 'Edelstahl',
    dimensions: '2,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['Spirit Serie', 'Edelstahl'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Fondue-Set 2,0 L — Edelstahl, Induktion | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Fondue-Set 2,0 L aus Edelstahl. Großes Volumen, spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'Zwilling Spirit Fondue-Set — 2,0 L',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'de-buyer-raclette-pfanne-8-teilig',
    supplierSku: 'DB-RAC-8',
    nameDe: 'de Buyer Raclette-Pfanne 8-teilig',
    shortDescription: 'Professionelles Raclette-Set aus Stahl und Emaille — Made in France',
    descriptionDe: `Das de Buyer Raclette-Set bietet professionelle Qualität für anspruchsvolle Raclette-Liebhaber. Die Pfännchen aus Stahl mit Emaille-Innenbeschichtung sorgen für gleichmäßiges Garen und eine edle Optik.

**Merkmale:**
- Stahl-Pfännchen mit Emaille-Innenbeschichtung
- 8 teilmöblierte Pfännchen — ideal für größere Gesellschaften
- Induktionsgeeignet
- Spülmaschinengeeignet
- Professionelle Qualität — Made in France
- Robuste Verarbeitung für langlebigen Einsatz
- Gleichmäßige Wärmeverteilung

Das de Buyer Raclette-Set — professionelle Qualität für den Raclette-Genuss zu Hause.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'de Buyer',
    material: 'Stahl + Emaille',
    dimensions: '8-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Made in France', 'Professionell'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'de Buyer Raclette-Pfanne 8-teilig — Profi-Qualität | NOVA INDUKT',
    metaDescription: 'de Buyer Raclette-Set 8-teilig aus Stahl und Emaille. Professionelle Qualität, Made in France, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'fondues-raclette',
    folder: 'de Buyer Raclette-Pfanne — 8-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Fondues & Raclette (6 Produkte)')
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
