/**
 * NOVA INDUKT — Seed Batch : 8 Elektro-Küchengeräte
 * Exécuter avec : npx tsx prisma/seed-products-elektrogeraete.ts
 *
 * Catégories couvertes :
 *   - Handmixer (Prod 1)
 *   - Standmixer (Prod 2)
 *   - Stabmixer (Prod 3)
 *   - Wasserkocher (Prods 4–5)
 *   - Waffeleisen (Prod 6)
 *   - Contactgrill (Prod 7)
 *   - Pizzaofen (Prod 8)
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
    slug: 'wm-zeppelin-handmixer',
    supplierSku: 'WMF-ZEP-HM',
    nameDe: 'WMF Zeppelin Handmixer',
    shortDescription: 'Leistungsstarker Handmixer mit 300 Watt — 2 Stufen, inklusive Schneebesen',
    descriptionDe: `Der WMF Zeppelin Handmixer bietet mit 300 Watt Leistung und 2 Stufen die ideale Kombination aus Kraft und Komfort. Die hochwertige Verarbeitung aus Kunststoff und Edelstahl sorgt für Langlebigkeit.

**Merkmale:**
- 300 Watt Leistung für einfaches Mixen
- 2 Stufen für variable Geschwindigkeitswahl
- Hochwertige Verarbeitung aus Kunststoff und Edelstahl
- Ergonomischer Griff
- Inklusive Schneebesen und Knethaken
- Leicht und handlich

Der praktische Helfer für Teig, Sahne und mehr.`,
    price: 29.99,
    oldPrice: 39.99,
    brand: 'WMF',
    material: 'Kunststoff + Edelstahl',
    dimensions: '300W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.0,
    badges: ['300 Watt', '2 Stufen'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Zeppelin Handmixer 300W — 2 Stufen | NOVA INDUKT',
    metaDescription: 'WMF Zeppelin Handmixer mit 300 Watt, 2 Stufen, Edelstahl. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF Zeppelin Handmixer',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wm-kitchenline-standmixer',
    supplierSku: 'WMF-KL-SM16',
    nameDe: 'WMF KitchenLine Standmixer 1,6 L',
    shortDescription: 'Leistungsstarker Standmixer mit 600 Watt — 1,6 Liter Fassungsvermögen',
    descriptionDe: `Der WMF KitchenLine Standmixer bietet mit 600 Watt Leistung und 1,6 Litern Fassungsvermögen die ideale Leistung für Smoothies, Suppen und mehr. Die hochwertige Verarbeitung aus Kunststoff und Metall sorgt für Langlebigkeit.

**Merkmale:**
- 600 Watt Leistung für starke Mixergebnisse
- 1,6 Liter Fassungsvermögen — ideal für 2–4 Personen
- Hochwertige Verarbeitung aus Kunststoff und Metall
- Verschiedene Geschwindigkeitsstufen
- Ergonomischer Griff
- Einfache Bedienung und Reinigung

Der leistungsstarke Standmixer für tägliche Küchenarbeit.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'WMF',
    material: 'Kunststoff + Metall',
    dimensions: '1,6 L, 600W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.5,
    badges: ['600 Watt', '1,6 Liter'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF KitchenLine Standmixer 1,6 L — 600W | NOVA INDUKT',
    metaDescription: 'WMF KitchenLine Standmixer 1,6 L mit 600 Watt — leistungsstark, hochwertig. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF KitchenLine Standmixer',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wm-zeppelin-stabmixer',
    supplierSku: 'WMF-ZEP-SM',
    nameDe: 'WMF Zeppelin Stabmixer',
    shortDescription: 'Praktischer Stabmixer mit 300 Watt — Edelstahl-Aufsatz',
    descriptionDe: `Der WMF Zeppelin Stabmixer bietet mit 300 Watt Leistung und dem hochwertigen Edelstahl-Aufsatz die ideale Lösung für das Pürieren direkt im Topf. Die kompakte Bauweise macht ihn zum unverzichtbaren Küchenhelfer.

**Merkmale:**
- 300 Watt Leistung für effektives Pürieren
- Hochwertiger Edelstahl-Aufsatz
- Kompakte und handliche Bauweise
- Einfache Reinigung
- Ergonomischer Griff
- Ideal für Suppen, Smoothies und Babybrei

Der praktische Stabmixer für schnelle Küchenarbeit.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'WMF',
    material: 'Edelstahl + Kunststoff',
    dimensions: '300W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['300 Watt', 'Edelstahl'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Zeppelin Stabmixer 300W — Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Zeppelin Stabmixer mit 300 Watt und Edelstahl-Aufsatz. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF Zeppelin Stabmixer',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wm-kitchenline-wasserkocher',
    supplierSku: 'WMF-KL-WK17',
    nameDe: 'WMF KitchenLine Wasserkocher 1,7 L',
    shortDescription: 'Eleganter Wasserkocher mit 2400 Watt — 1,7 Liter Fassungsvermögen',
    descriptionDe: `Der WMF KitchenLine Wasserkocher bietet mit 2400 Watt Leistung und 1,7 Litern Fassungsvermögen eine schnelle und effiziente Wasserkochung. Die hochwertige Verarbeitung aus Edelstahl und Glas sorgt für Eleganz und Langlebigkeit.

**Merkmale:**
- 2400 Watt Leistung für schnelles Aufkochen
- 1,7 Liter Fassungsvermögen
- Hochwertiger Edelstahl- und Glas-Aufbau
- Integriertes Wasserkoch-System
- Automatische Abschaltung
- Beleuchteter Wasserstand

Der elegante Wasserkocher für schnellen Tee und Kaffee.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'WMF',
    material: 'Edelstahl + Glas',
    dimensions: '1,7 L, 2400W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.2,
    badges: ['2400 Watt', '1,7 Liter'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF KitchenLine Wasserkocher 1,7 L — 2400W | NOVA INDUKT',
    metaDescription: 'WMF KitchenLine Wasserkocher 1,7 L mit 2400 Watt — Edelstahl, elegant. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF KitchenLine Wasserkocher',
    imageFiles: ['1.png'],
  },

  {
    slug: 'fissler-heat-memory-wasserkocher',
    supplierSku: 'FIS-HM-WK15',
    nameDe: 'Fissler Heat Memory Wasserkocher 1,5 L',
    shortDescription: 'Premium-Wasserkocher mit Heat Memory — Temperaturhalt, Made in Germany',
    descriptionDe: `Der Fissler Heat Memory Wasserkocher bietet eine einzigartige Kombination aus 2400 Watt Leistung und der patentierten Heat Memory-Technologie. Die Temperaturhalt-Funktion hält das Wasser auf der gewünschten Temperatur — ideal für verschiedene Teesorten.

**Merkmale:**
- 2400 Watt Leistung für schnelles Aufkochen
- 1,5 Liter Fassungsvermögen
- Patentierte Heat Memory-Technologie
- Temperaturhalt-Funktion
- Hochwertiger Edelstahl- und Glas-Aufbau
- Hergestellt in Deutschland
- Automatische Abschaltung

Der Premium-Wasserkocher für anspruchsvolle Teeliebhaber.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'Fissler',
    material: 'Edelstahl + Glas',
    dimensions: '1,5 L, 2400W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.1,
    badges: ['Made in Germany', 'Heat Memory', 'Temperaturhalt'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Heat Memory Wasserkocher 1,5 L — Made in Germany | NOVA INDUKT',
    metaDescription: 'Fissler Heat Memory Wasserkocher 1,5 L — Heat Memory, Temperaturhalt, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Fissler Heat Memory Wasserkocher',
    imageFiles: ['1.png'],
  },

  {
    slug: 'tefal-masterclass-waffeleisen',
    supplierSku: 'TEF-MC-WAF',
    nameDe: 'Tefal Masterclass Waffeleisen',
    shortDescription: 'Hochwertiges Waffeleisen mit Antihaft-Beschichtung — 1200 Watt',
    descriptionDe: `Das Tefal Masterclass Waffeleisen bietet mit 1200 Watt Leistung und der bewährten Antihaft-Beschichtung perfekte Waffeln. Die hochwertige Verarbeitung aus Aluminium sorgt für gleichmäßige Hitzeverteilung.

**Merkmale:**
- 1200 Watt Leistung für schnelles Aufheizen
- Antihaft-Beschichtung für leichtes Lösen der Waffeln
- Gleichmäßige Hitzeverteilung durch Aluminium
- Praktisches Design mit Griff
- Leicht zu reinigen
- Perfekt für amerikanische Waffeln

Für knusprige Waffeln zum Frühstück oder als Nachtisch.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Tefal',
    material: 'Aluminium + Antihaft',
    dimensions: '1200W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Antihaft', '1200 Watt'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Tefal Masterclass Waffeleisen — Antihaft, 1200W | NOVA INDUKT',
    metaDescription: 'Tefal Masterclass Waffeleisen mit Antihaft-Beschichtung und 1200 Watt. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Tefal Masterclass Waffeleisen',
    imageFiles: ['1.png'],
  },

  {
    slug: 'tefal-masterclass-contactgrill',
    supplierSku: 'TEF-MC-CG',
    nameDe: 'Tefal Masterclass Contactgrill',
    shortDescription: 'Leistungsstarker Contactgrill mit 2000 Watt — beidseitig grillen',
    descriptionDe: `Der Tefal Masterclass Contactgrill bietet mit 2000 Watt Leistung die Möglichkeit, beidseitig zu grillen. Die hochwertige Verarbeitung aus Aluminium und Edelstahl sorgt für professionelle Ergebnisse.

**Merkmale:**
- 2000 Watt Leistung für schnelles Grillen
- Beidseitiges Grillen für doppelte Fläche
- Hochwertige Verarbeitung aus Aluminium und Edelstahl
- Antihaft-Beschichtung
- Einstellbare Temperatur
- Praktischer Auffangschalen

Der leistungsstarke Contactgrill für Indoor-Grillerlebnisse.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'Tefal',
    material: 'Aluminium + Edelstahl',
    dimensions: '2000W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.5,
    badges: ['2000 Watt', 'Beidseitig grillen'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Tefal Masterclass Contactgrill — 2000W, beidseitig | NOVA INDUKT',
    metaDescription: 'Tefal Masterclass Contactgrill mit 2000 Watt — beidseitig grillen, leistungsstark. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Tefal Masterclass Contactgrill',
    imageFiles: ['1.png'],
  },

  {
    slug: 'tefal-pizzaofen-ondine',
    supplierSku: 'TEF-OND-PO',
    nameDe: 'Tefal Ondine Pizzaofen',
    shortDescription: 'Premium-Pizzaofen mit Steinplatte — bis 400°C, 1600 Watt',
    descriptionDe: `Der Tefal Ondine Pizzaofen erreicht Temperaturen bis zu 400°C und ermöglicht so das-backen von perfekten Pizzen mit knusprigem Boden. Die hochwertige Steinplatte und die Edelstahlkonstruktion sorgen für professionelle Ergebnisse.

**Merkmale:**
- Bis zu 400°C für perfekte Pizza
- 1600 Watt Leistung
- Echte Steinplatte für knusprigen Boden
- Hochwertige Edelstahlkonstruktion
- Inklusive Pizzaschaufel
- Kompaktes Design

Der Pizzaofen für echte Pizzatalent zu Hause.`,
    price: 129.99,
    oldPrice: 159.99,
    brand: 'Tefal',
    material: 'Edelstahl + Stein',
    dimensions: '1600W, bis 400°C',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.5,
    badges: ['Bis 400°C', 'Steinplatte', 'Pizzaofen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Tefal Ondine Pizzaofen — bis 400°C, Steinplatte | NOVA INDUKT',
    metaDescription: 'Tefal Ondine Pizzaofen mit Steinplatte — bis 400°C, 1600W, Edelstahl. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Tefal Ondine Pizzaofen',
    imageFiles: ['1.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Elektro-Küchengeräte (8 Produkte)')
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
    console.log('\n🎉 Batch Elektro-Küchengeräte terminé avec succès !')
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
