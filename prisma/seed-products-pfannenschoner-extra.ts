/**
 * NOVA INDUKT — Seed : Pfannenschoner & Topfregale (8 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-pfannenschoner-extra.ts
 *
 * Catégorie : pfannenschoner-topfregale (sortOrder 11–18)
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
    slug: 'fissler-topfregal-edelstahl-4fach',
    supplierSku: 'FIS-TR-4F',
    nameDe: 'Fissler Topfregal Edelstahl 4-fach',
    shortDescription: 'Stabiles Edelstahl-Topfregal mit 4 Fächern — platzsparend & induktionsgeeignet',
    descriptionDe: `Das Fissler Topfregal aus hochwertigem Edelstahl bietet Platz für bis zu 4 Pfannen oder Töpfe. Die stabile Konstruktion und die rutschfesten Füße sorgen für sicheren Stand im Schrank oder auf der Arbeitsplatte.

**Merkmale:**
- Hochwertiger Edelstahl — robust und langlebig
- 4 Fächer für verschiedene Pfannen- und Topfgrößen
- Rutschfeste Gummifüße für sicheren Stand
- Platzsparendes Design — ideal für Einbau- und Stehschränke
- Einfache Montage ohne Werkzeug
- Induktionsgeeignet

Praktische Lösung für die ordentliche Aufbewahrung Ihrer Induktionspfannen.`,
    price: 49.99,
    oldPrice: 59.99,
    brand: 'Fissler',
    material: 'Edelstahl',
    dimensions: '4-fach, 33×30×35 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.2,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Topfregal Edelstahl 4-fach — Pfannenaufbewahrung | NOVA INDUKT',
    metaDescription: 'Fissler Topfregal Edelstahl 4-fach — stabile Pfannenaufbewahrung, platzsparend, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Fissler Topfregal Edelstahl 4-fach',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'zwilling-topfregal-edelstahl-3fach',
    supplierSku: 'ZWI-TR-3F',
    nameDe: 'Zwilling Topfregal Edelstahl 3-fach',
    shortDescription: 'Elegantes Zwilling-Topfregal aus Edelstahl mit 3 Fächern',
    descriptionDe: `Das Zwilling Topfregal vereint hochwertigen Edelstahl mit durchdachtem Design. Drei Fächer bieten Platz für die wichtigsten Pfannen und Töpfe, während der elegante Look in jede moderne Küche passt.

**Merkmale:**
- 3-fach-Aufteilung für Pfannen verschiedener Größen
- Hochwertiger Edelstahl — langlebig und pflegeleicht
- Stabile Konstruktion mit rutschfesten Füßen
- Elegantes Zwilling-Design
- Induktionsgeeignet
- Einfache Montage

Zwilling Qualität für die ordentliche Aufbewahrung Ihrer Kochgeschirre.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Zwilling',
    material: 'Edelstahl',
    dimensions: '3-fach, 30×28×30 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['Zwilling Qualität'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Topfregal Edelstahl 3-fach — Pfannenaufbewahrung | NOVA INDUKT',
    metaDescription: 'Zwilling Topfregal Edelstahl 3-fach — hochwertige Pfannenaufbewahrung von Zwilling. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Zwilling Topfregal Edelstahl 3-fach',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'rivsalt-topfregal-5-stufen',
    supplierSku: 'RIV-TR-5S',
    nameDe: 'Rivsalt Topfregal 5 Stufen',
    shortDescription: 'Schwedisches Topfregal mit 5 Stufen — modernes Design für die Küchenzeile',
    descriptionDe: `Das Rivsalt Topfregal besticht durch sein scandinavisches Design und bietet mit 5 Stufen großzügigen Platz für Pfannen, Töpfe und Kochgeschirr. Die schwarze Metallkonstruktion passt perfekt in moderne Küchen.

**Merkmale:**
- 5 Stufen für maximale Stauraumausnutzung
- Schwedisches Minimalistendesign in Schwarz
- Robuste Metallkonstruktion
- Stabile Standfüße
- Ideal für Küchenzeile oder Wandmontage
- Induktionsgeeignet

Schwedisches Design trifft auf praktische Stauraumlösung.`,
    price: 79.99,
    oldPrice: 89.99,
    brand: 'Rivsalt',
    material: 'Metall schwarz',
    dimensions: '5 Stufen, 40×30×45 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.8,
    badges: ['Schwedisches Design', '5 Stufen'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rivsalt Topfregal 5 Stufen — Schwedisches Design | NOVA INDUKT',
    metaDescription: 'Rivsalt Topfregal 5 Stufen — schwedisches Design, schwarzes Metall, 5 Ebenen für Pfannen und Töpfe. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Rivsalt Topfregal 5 Stufen',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-pfannenschoner-30cm',
    supplierSku: 'WMF-PS-30',
    nameDe: 'WMF Pfannenschoner 30 cm',
    shortDescription: 'Pfannenschoner aus Filz und Stoff — schützt Antihaftbeschichtung zuverlässig',
    descriptionDe: `Der WMF Pfannenschoner schützt Ihre wertvollen Antihaftpfannen vor Kratzern und Beschädigungen. Aus weichem Filz und strapazierfähigem Stoff gefertigt, passt er sich ideal an Pfannen mit 30 cm Durchmesser an.

**Merkmale:**
- Weicher Filz + stabiler Stoff — maximaler Kratzschutz
- Passend für Pfannen mit Ø 30 cm
- Maschinenwäsche möglich
- Kompakt und platzsparend
- Made in Germany
- Induktionsgeeignet

Einfache und wirkungsvolle Lösung zum Schutz Ihrer Pfannenbeschichtung.`,
    price: 16.99,
    oldPrice: 21.99,
    brand: 'WMF',
    material: 'Filz + Stoff',
    dimensions: 'Ø 30 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.2,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Pfannenschoner 30 cm — Kratzschutz für Pfannen | NOVA INDUKT',
    metaDescription: 'WMF Pfannenschoner 30 cm aus Filz und Stoff — schützt Antihaftbeschichtung vor Kratzern. Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'WMF Pfannenschoner 30cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'fissler-pfannenschoner-30cm',
    supplierSku: 'FIS-PS-30',
    nameDe: 'Fissler Pfannenschoner 30 cm',
    shortDescription: 'Hochwertiger Pfannenschoner von Fissler — schont Antihaftbeschichtungen',
    descriptionDe: `Der Fissler Pfannenschoner aus Filz und Stoff bietet zuverlässigen Schutz für Ihre Fissler- und andere Antihaftpfannen. Das Material ist weich genug, um die Beschichtung nicht zu beschädigen, aber stabil genug für dauerhaften Einsatz.

**Merkmale:**
- Kombination aus Filz und strapazierfähigem Stoff
- Passend für Pfannen mit Ø 30 cm
- Schont empfindliche Antihaftbeschichtungen
- Leicht zu reinigen
- Made in Germany
- Induktionsgeeignet

Die ideale Ergänzung zu Ihren Fissler-Pfannen.`,
    price: 18.99,
    oldPrice: 24.99,
    brand: 'Fissler',
    material: 'Filz + Stoff',
    dimensions: 'Ø 30 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.2,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Pfannenschoner 30 cm — Schutz für Antihaftpfannen | NOVA INDUKT',
    metaDescription: 'Fissler Pfannenschoner 30 cm — hochwertiger Kratzschutz aus Filz und Stoff. Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Fissler Pfannenschoner 30cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'tefal-pfannenschoner-30cm',
    supplierSku: 'TEF-PS-30',
    nameDe: 'Tefal Pfannenschoner 30 cm',
    shortDescription: 'Silikon-Pfannenschoner von Tefal — spülmaschinenfest & langlebig',
    descriptionDe: `Der Tefal Pfannenschoner besteht aus robustem Silikon und bietet hervorragenden Schutz für Ihre Antihaftpfannen. Die Silikonscheibe ist besonders langlebig und einfach zu reinigen.

**Merkmale:**
- Robuste Silikonscheibe — extrem langlebig
- Passend für Pfannen mit Ø 30 cm
- Spülmaschinenfest — einfache Reinigung
- Hitzebeständig
- Antihaft-Schutz
- Induktionsgeeignet

Die langlebige Alternative zu Filz-Pfannenschonern.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Tefal',
    material: 'Silikonscheibe',
    dimensions: 'Ø 30 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.15,
    badges: ['Antihaft-Schutz'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Tefal Pfannenschoner 30 cm — Silikon Kratzschutz | NOVA INDUKT',
    metaDescription: 'Tefal Pfannenschoner 30 cm aus Silikon — spülmaschinenfest, langlebig, schützt Antihaftbeschichtung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Tefal Pfannenschoner 30cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'ikea-variera-topfregal-2fach',
    supplierSku: 'IKEA-VAR-TR2',
    nameDe: 'IKEA VARIERA Topfregal 2-fach',
    shortDescription: 'Günstiges Topfregal von IKEA — 2 Fächer, stabiler Stahl',
    descriptionDe: `Das IKEA VARIERA Topfregal bietet mit 2 Fächern Platz für die wichtigsten Pfannen und Töpfe. Der stabile Stahl und das kompakte Design machen es zur idealen Lösung für kleine Küchen.

**Merkmale:**
- 2 Fächer für Pfannen und Töpfe
- Robuster Stahl
- Kompaktes Design — ideal für kleine Küchen
- Rutschfeste Füße
- Günstiger Preis
- Induktionsgeeignet

Günstige und praktische Aufbewahrungslösung für Ihre Pfannen.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'IKEA',
    material: 'Stahl',
    dimensions: '2-fach, 25×28×20 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Günstig'],
    rating: 4.1,
    reviewCount: 0,
    metaTitle: 'IKEA VARIERA Topfregal 2-fach — Günstige Pfannenaufbewahrung | NOVA INDUKT',
    metaDescription: 'IKEA VARIERA Topfregal 2-fach — günstige und stabile Pfannenaufbewahrung aus Stahl. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'IKEA VARIERA Topfregal 2-fach',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-topfregal-edelstahl-3fach',
    supplierSku: 'WMF-TR-3F',
    nameDe: 'WMF Topfregal Edelstahl 3-fach',
    shortDescription: 'WMF Topfregal aus Cromargan® Edelstahl — 3 Fächer, Made in Germany',
    descriptionDe: `Das WMF Topfregal aus Cromargan® Edelstahl überzeugt durch hochwertige Verarbeitung und elegantes Design. Drei Fächer bieten ausreichend Platz für Ihre Lieblingspfannen und Töpfe.

**Merkmale:**
- 3 Fächer für verschiedene Pfannengrößen
- Cromargan® Edelstahl — rostfrei und pflegeleicht
- Stabile Konstruktion mit rutschfesten Füßen
- Elegantes WMF-Design
- Made in Germany
- Induktionsgeeignet

Hochwertige Aufbewahrungslösung von WMF für anspruchsvolle Kochenthusiasten.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '3-fach, 30×28×30 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Topfregal Edelstahl 3-fach — Cromargan® Pfannenaufbewahrung | NOVA INDUKT',
    metaDescription: 'WMF Topfregal Edelstahl 3-fach — Cromargan® Edelstahl, Made in Germany, elegante Pfannenaufbewahrung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'WMF Topfregal Edelstahl 3-fach',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed : Pfannenschoner & Topfregale (8 Produkte)')
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
    console.log('\n🎉 Pfannenschoner & Topfregale seed terminé avec succès !')
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
