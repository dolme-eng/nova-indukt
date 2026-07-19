/**
 * NOVA INDUKT — Seed : Thermometer (4 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-thermometers.ts
 *
 * Catégories couvertes :
 *   - Sous-cat : Induktions-Zubehör (Prods 11–14)
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
  // SOUS-CATÉGORIE : INDUKTIONS-ZUBEHÖR — THERMOMETER
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'tfa-air-control-digital',
    supplierSku: 'TFA-AC-DIG',
    nameDe: 'TFA Air Control Digital-Thermometer',
    shortDescription: 'Digital-Thermometer für präzise Temperaturmessung — kompaktes Design',
    descriptionDe: `Das TFA Air Control Digital-Thermometer bietet zuverlässige und schnelle Temperaturmessungen für den täglichen Einsatz in der Küche oder im Haushalt. Das kompakte Kunststoffgehäuse und das klare LCD-Display machen es zum idealen Begleiter.

**Merkmale:**
- Präzise digitale Temperaturmessung
- Klares LCD-Display für schnelle Ablesung
- Kompaktes Kunststoffgehäuse — leicht und handlich
- Induktionsgeeignet — kann direkt am Kochfeld eingesetzt werden
- Einfache Bedienung
- Energieeffizienter Betrieb

Das Air Control ist ein zuverlässiges Thermometer für alle, die Wert auf Genauigkeit und Einfachheit legen.`,
    price: 19.99,
    oldPrice: 24.99,
    brand: 'TFA',
    material: 'Kunststoff',
    dimensions: '12 x 6 x 2 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.1,
    badges: ['Digital', 'LCD-Display'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'TFA Air Control Digital-Thermometer — Präzise Küchenthermometer | NOVA INDUKT',
    metaDescription: 'TFA Air Control Digital-Thermometer — kompaktes Design, LCD-Display, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'TFA Air Control Digital-Thermometer',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'tfa-pipet-kuhlschrank',
    supplierSku: 'TFA-PIP-KS',
    nameDe: 'TFA Pipet Kühlschrankthermometer',
    shortDescription: 'Kompaktes Kühlschrankthermometer — zuverlässige Temperaturüberwachung',
    descriptionDe: `Das TFA Pipet Kühlschrankthermometer ist speziell für die Überwachung der Temperatur in Kühlschränken und Gefrierschränken entwickelt worden. Sein kleines Format und die einfache Montage machen es zum perfekten Helfer für Lebensmittelsicherheit.

**Merkmale:**
- Speziell für Kühlschrank und Gefrierschrank
- Kompaktes Design — passt in jedes Regal
- Klare Anzeige der aktuellen Temperatur
- Leicht zu montieren (magnetisch oder abstellbar)
- Kunststoffgehäuse — robust und langlebig
- Induktionsgeeignet — kann auch am Induktionsherd verwendet werden

Sichere Lebensmittel durch zuverlässige Temperaturkontrolle — das Pipet ist ein Muss für jede Küche.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'TFA',
    material: 'Kunststoff',
    dimensions: '8 x 4 x 1,5 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.05,
    badges: ['Kühlschrank', 'Kompakt'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'TFA Pipet Kühlschrankthermometer — Kompakt, Zuverlässig | NOVA INDUKT',
    metaDescription: 'TFA Pipet Kühlschrankthermometer — kompakt, zuverlässig, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'TFA Pipet Kühlschrankthermometer',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'soehnle-digital-kuechen-thermometer',
    supplierSku: 'SOE-DK-THERM',
    nameDe: 'Soehnle Digital-Küchenthermometer',
    shortDescription: 'Digital-Küchenthermometer aus Edelstahl — schnelle Anzeige und hohe Präzision',
    descriptionDe: `Das Soehnle Digital-Küchenthermometer kombiniert hochwertigen Edelstahl mit modernster Digitaltechnik für präzise Temperaturmessungen beim Kochen und Backen. Die schnellanzeige sorgt für sofortige Ergebnisse.

**Merkmale:**
- Hochwertige Edelstahl-Spitze für lange Lebensdauer
- Digitale Schnellanzeige — sofortige Temperaturablesung
- Praktisches Kunststoff-Handy-Design
- Große Ziffern für einfaches Ablesen
- Induktionsgeeignet — kann direkt am Kochfeld verwendet werden
- Einfache Reinigung

Das Soehnle Digital-Küchenthermometer ist der zuverlässige Begleiter für alle, die Wert auf Präzision und Qualität legen.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Soehnle',
    material: 'Edelstahl + Kunststoff',
    dimensions: '15 x 3 x 2 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.08,
    badges: ['Digital', 'Schnellanzeige'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Soehnle Digital-Küchenthermometer — Edelstahl, Präzise | NOVA INDUKT',
    metaDescription: 'Soehnle Digital-Küchenthermometer mit Edelstahl-Spitze und Schnellanzeige. Induktionsgeeignet — jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Soehnle Digital-Küchenthermometer',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'tfa-digoo-dual',
    supplierSku: 'TFA-DG-DUAL',
    nameDe: 'TFA Digoo Dual-Thermometer',
    shortDescription: 'Dual-Sensor-Thermometer mit doppelter Präzision — digitale Anzeige',
    descriptionDe: `Das TFA Digoo Dual-Thermometer überzeugt mit zwei unabhängigen Sensoren für gleichzeitige Temperaturmessungen. Ob für die Überwachung von Vorgängen oder für präzise Temperaturkontrolle — das Dual-Thermometer bietet höchste Genauigkeit.

**Merkmale:**
- Dual-Sensor-Technologie — zwei gleichzeitige Messungen
- Digitale Anzeige mit hoher Präzision
- Kompaktes Kunststoffgehäuse
- Induktionsgeeignet — kann am Induktionsherd verwendet werden
- Einfache Bedienung mit klaren Tasten
- Langlebige Batterie

Das Digoo Dual ist das Thermometer für anspruchsvolle Anwender, die höchste Präzision und Vielseitigkeit benötigen.`,
    price: 24.99,
    oldPrice: 29.99,
    brand: 'TFA',
    material: 'Kunststoff',
    dimensions: '10 x 7 x 2 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.12,
    badges: ['Dual-Sensor', 'Digital', 'Präzise'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'TFA Digoo Dual-Thermometer — Dual-Sensor, Präzise | NOVA INDUKT',
    metaDescription: 'TFA Digoo Dual-Thermometer mit Dual-Sensor-Technologie und digitaler Anzeige. Induktionsgeeignet — jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'TFA Digoo Dual-Thermometer',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed : Thermometer (4 Produkte)')
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
    console.log('\n🎉 Seed Thermometer terminé avec succès !')
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
