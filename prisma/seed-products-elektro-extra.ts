/**
 * NOVA INDUKT — Seed : Elektrogeräte (8 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-elektro-extra.ts
 *
 * Catégorie : elektrogeraete (sortOrder 9–16)
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
    slug: 'wm-kitchenline-handmixer',
    supplierSku: 'WMF-KL-HM',
    nameDe: 'WMF KitchenLine Handmixer',
    shortDescription: 'Leistungsstarker Handmixer mit 400 Watt — 5 Geschwindigkeiten + Turbo-Funktion',
    descriptionDe: `Der WMF KitchenLine Handmixer überzeugt mit 400 Watt Leistung und 5 Geschwindigkeiten für perfekte Ergebnisse bei Back- und Küchenarbeiten. Die ergonomische Form und das geringe Gewicht machen auch längere Arbeitsschritte angenehm.

**Merkmale:**
- 400 Watt Motor — leistungsstark und leise
- 5 Geschwindigkeiten + Turbo-Funktion
- Ergonomisches Design für komfortales Arbeiten
- Einfacher Geschwindigkeitsregler am Griff
- Leicht zu reinigen — Abnehmbare Knethaken
- Hochwertige Verarbeitung aus Kunststoff und Edelstahl

Der ideale Handmixer für ambitionierte Hobby-Köche.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'WMF',
    material: 'Kunststoff + Edelstahl',
    dimensions: '400W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.2,
    badges: ['400 Watt'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF KitchenLine Handmixer 400W — Küchenhilfe | NOVA INDUKT',
    metaDescription: 'WMF KitchenLine Handmixer mit 400 Watt, 5 Geschwindigkeiten und Turbo-Funktion. Leistungsstark und ergonomisch. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF KitchenLine Handmixer',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wm-professional-s-plus-stabmixer',
    supplierSku: 'WMF-PP-SM',
    nameDe: 'WMF Profi Plus Stabmixer',
    shortDescription: 'Edelstahl-Stabmixer mit 600 Watt — Made in Germany, spülmaschinengeeignetes Mixbecher',
    descriptionDe: `Der WMF Profi Plus Stabmixer ist ein echtes Schmuckstück deutscher Ingenieurskunst. Mit 600 Watt Leistung und dem hochwertigen Edelstahl-Design meistert er souverän alle Mixing-Aufgaben — von Suppen über Smoothies bis zu Saucen.

**Merkmale:**
- 600 Watt Leistung — für anspruchsvolle Aufgaben
- Hochwertiger Edelstahl-Body
- 2 Geschwindigkeiten + Turbo
- Abnehmbarer Mixstab — spülmaschinengeeignet
- Leicht und handlich
- Made in Germany

Professionelle Qualität für die heimische Küche.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'WMF',
    material: 'Edelstahl',
    dimensions: '600W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Made in Germany', '600 Watt'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Stabmixer 600W — Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Stabmixer 600 Watt — Edelstahl, Made in Germany, spülmaschinengeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF Profi Plus Stabmixer',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'fissler-multi-mixer-handmixer',
    supplierSku: 'FIS-MM-HM',
    nameDe: 'Fissler Multi-Mixer Handmixer',
    shortDescription: 'Kompakter Handmixer von Fissler — 350 Watt, Made in Germany',
    descriptionDe: `Der Fissler Multi-Mixer ist ein kompakter und leistungsstarker Handmixer für den täglichen Einsatz in der Küche. Mit 350 Watt bietet er ausreichend Kraft für Teige, Cremes und Getränke.

**Merkmale:**
- 350 Watt Motor — kraftvoll und zuverlässig
- Kompaktes Design — platzsparend in der Schublade
- 3 Geschwindigkeiten + Turbo
- Abnehmbare Teigschläger — einfach zu reinigen
- Made in Germany
- Ergonomischer Griff

Fissler Qualität für alle Mixing-Aufgaben im Alltag.`,
    price: 29.99,
    oldPrice: 39.99,
    brand: 'Fissler',
    material: 'Kunststoff + Edelstahl',
    dimensions: '350W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.9,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Fissler Multi-Mixer Handmixer 350W — Made in Germany | NOVA INDUKT',
    metaDescription: 'Fissler Multi-Mixer Handmixer 350 Watt — Made in Germany, kompakt und leistungsstark. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Fissler Multi-Mixer Handmixer',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'tefal-blendforce-stabmixer',
    supplierSku: 'TEF-BF-SM',
    nameDe: 'Tefal Blendforce Stabmixer',
    shortDescription: 'Leistungsstarker Stabmixer mit 450 Watt — Power Crisp-Technologie',
    descriptionDe: `Der Tefal Blendforce Stabmixer überzeugt mit 450 Watt und der innovativen Power Crisp-Technologie für besonders cremige Ergebnisse. Ob Suppen, Smoothies oder Babynahrung — dieser Stabmixer meistert alles.

**Merkmale:**
- 450 Watt Motor — stark genug für harte Zutaten
- Power Crisp-Technologie — für besonders cremige Ergebnisse
- 2 Geschwindigkeiten + Turbo
- Messingmesser für optimale Ergebnisse
- Spülmaschinenfester Mixstab
- Kompaktes Design

Tefal Qualität für schnelle Mixing-Ergebnisse.`,
    price: 24.99,
    oldPrice: 34.99,
    brand: 'Tefal',
    material: 'Kunststoff + Edelstahl',
    dimensions: '450W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['450 Watt'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Tefal Blendforce Stabmixer 450W — Power Crisp | NOVA INDUKT',
    metaDescription: 'Tefal Blendforce Stabmixer 450 Watt mit Power Crisp-Technologie. Leistungsstark und einfach zu reinigen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Tefal Blendforce Stabmixer',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wm-kitchenline-wasserkocher-12l',
    supplierSku: 'WMF-KL-WK12',
    nameDe: 'WMF KitchenLine Wasserkocher 1,2 L',
    shortDescription: 'Eleganter Wasserkocher aus Edelstahl und Glas — 2400 Watt, 1,2 Liter',
    descriptionDe: `Der WMF KitchenLine Wasserkocher verbindet elegantes Design mit hoher Leistungsfähigkeit. Der 1,2 Liter Wasserkocher aus Edelstahl und Glas ist ideal für 1–2 Personen und bringt Wasser schnell zum Kochen.

**Merkmale:**
- 2400 Watt — besonders schnelles Aufkochen
- 1,2 Liter Fassungsvermögen — ideal für 1–2 Personen
- Edelstahl + Glas — hochwertiges Design
- Automatische Abschaltung nach Kochen
- Wasserstandsanzeige
- Kabelloser Abstellbehälter

Praktischer Wasserkocher für schnellen Tee oder Kaffee.`,
    price: 29.99,
    oldPrice: 39.99,
    brand: 'WMF',
    material: 'Edelstahl + Glas',
    dimensions: '1,2 L, 2400W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.9,
    badges: ['2400 Watt'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF KitchenLine Wasserkocher 1,2 L — Edelstahl & Glas | NOVA INDUKT',
    metaDescription: 'WMF KitchenLine Wasserkocher 1,2 L — 2400 Watt, Edelstahl und Glas, automatische Abschaltung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF KitchenLine Wasserkocher 1.2L',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'tefal-maison-wasserkocher-17l',
    supplierSku: 'TEF-MAI-WK17',
    nameDe: 'Tefal Maison Wasserkocher 1,7 L',
    shortDescription: 'Großzügiger Wasserkocher mit 1,7 L — edles Edelstahl-Design',
    descriptionDe: `Der Tefal Maison Wasserkocher bietet mit 1,7 Litern Fassungsvermögen ausreichend Wasser für die ganze Familie. Das edle Edelstahl-Design und die 2400 Watt Leistung machen ihn zum zuverlässigen Begleiter in der Küche.

**Merkmale:**
- 1,7 Liter — ideal für Familien
- 2400 Watt — schnelles Aufkochen
- Edelstahl + Glas — elegantes Maison-Design
- Automatische Abschaltung
- Integrierter Wasserfilter gegen Kalkablagerungen
- Kabelloser Abstellbehälter mit 360°-Drehteller

Der perfekte Wasserkocher für große Familien.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'Tefal',
    material: 'Edelstahl + Glas',
    dimensions: '1,7 L, 2400W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.1,
    badges: ['Maison Serie'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Tefal Maison Wasserkocher 1,7 L — Edelstahl | NOVA INDUKT',
    metaDescription: 'Tefal Maison Wasserkocher 1,7 L — 2400 Watt, Edelstahl-Design, für die ganze Familie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Tefal Maison Wasserkocher 1.7L',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'tefal-snack-collection-sandwich-maker',
    supplierSku: 'TEF-SC-SM',
    nameDe: 'Tefal Snack Collection Sandwich-Maker',
    shortDescription: 'Vielseitiger Sandwich-Maker mit Antihaft-Beschichtung — 800 Watt',
    descriptionDe: `Der Tefal Snack Collection Sandwich-Maker ist der perfekte Begleiter für schnelle Snacks und Frühstück. Die Antihaft-Beschichtung sorgt für einfaches Reinigen und perfekte Ergebnisse.

**Merkmale:**
- 800 Watt — schnell erhitzbar
- Aluminium-Platten mit Antihaft-Beschichtung
- Kompaktes Design — platzsparendes Verstauen
- Einfache Reinigung dank Antihaft
- Indikatorlicht für Betriebsbereitschaft
- Leicht und handlich

Der schnelle Weg zu knusprigen Sandwiches und Toast.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Tefal',
    material: 'Aluminium + Antihaft',
    dimensions: '800W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Antihaft', 'Sandwich-Maker'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Tefal Snack Collection Sandwich-Maker 800W — Antihaft | NOVA INDUKT',
    metaDescription: 'Tefal Snack Collection Sandwich-Maker — 800 Watt, Antihaft-Beschichtung, kompakt. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'Tefal Snack Collection Sandwich-Maker',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-kapsel-kaffee-maschine',
    supplierSku: 'WMF-KKM',
    nameDe: 'WMF Kapsel-Kaffee-Maschine',
    shortDescription: 'Kompakte Kapsel-Kaffee-Maschine mit 15 bar — Edelstahl-Design',
    descriptionDe: `Die WMF Kapsel-Kaffee-Maschine bringt den Geschmack von echtem Espresso und Kaffee nach Hause. Mit 15 bar Druck und der kompakten Bauweise ist sie ideal für kleine Küchen und Büros.

**Merkmale:**
- 15 bar Pumpendruck — für aromatischen Kaffee
- 1400 Watt Heizleistung
- Kompaktes Edelstahl-Design
- Kapsel-kompatibel mit verschiedenen Systemen
- Integrierter Wassertank
- Einfache Bedienung mit einem Knopfdruck

Genießen Sie Espresso-Qualität im eigenen Zuhause.`,
    price: 59.99,
    oldPrice: 74.99,
    brand: 'WMF',
    material: 'Edelstahl + Kunststoff',
    dimensions: '15 bar, 1400W',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.0,
    badges: ['15 bar', 'Kapsel-kompatibel'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Kapsel-Kaffee-Maschine 15 bar — Espresso | NOVA INDUKT',
    metaDescription: 'WMF Kapsel-Kaffee-Maschine — 15 bar, 1400W, Edelstahl-Design, kompakt und leistungsstark. Jetzt bei NOVA INDUKT.',
    categorySlug: 'elektrogeraete',
    folder: 'WMF Kapsel-Kaffee-Maschine',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed : Elektrogeräte (8 Produkte)')
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
    console.log('\n🎉 Elektrogeräte seed terminé avec succès !')
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
