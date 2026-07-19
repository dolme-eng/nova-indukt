/**
 * NOVA INDUKT — Seed Batch : 10 Pfannenschoner & Topfregale
 * Exécuter avec : npx tsx prisma/seed-products-pfannenschoner-topfregale.ts
 *
 * Catégories couvertes :
 *   - Pfannenschoner (Prods 1–6)
 *   - Topfregale (Prods 7–10)
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
  // ══════════════════════════════════════════════════════════════
  // PFANNENSCHONER
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'tefal-pfannenschoner-26cm',
    supplierSku: 'TEF-PS-26',
    nameDe: 'Tefal Pfannenschoner 26 cm',
    shortDescription: 'Silikonscheibe zum Schutz von Antihaftbeschichtungen — spülmaschinenfest',
    descriptionDe: `Der Tefal Pfannenschoner 26 cm schützt Ihre wertvollen Antihaftpfannen vor Kratzern und Beschädigungen beim Stapeln. Die hochwertige Silikonscheibe legt sich zwischen die Pfannen und verhindert direkten Kontakt der Beschichtungen.

**Merkmale:**
- Hochwertige Silikonscheibe für zuverlässigen Schutz
- Perfekt für Pfannen mit Ø 26 cm
- Spülmaschinenfest und leicht zu reinigen
- Induktionsgeeignet
- Kompakt und platzsparend
- Schützt Antihaftbeschichtung vor Kratzern

Ein einfaches, aber unverzichtbares Utensil für jede Küche mit Antihaftpfannen.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'Tefal',
    material: 'Silikonscheibe',
    dimensions: 'Ø 26 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.1,
    badges: ['Antihaft-Schutz'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Tefal Pfannenschoner 26 cm — Silikonscheibe für Antihaftpfannen | NOVA INDUKT',
    metaDescription: 'Tefal Pfannenschoner 26 cm aus Silikon — schützt Antihaftbeschichtung, spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Tefal Pfannenschoner — 26 cm',
    imageFiles: ['1.png'],
  },

  {
    slug: 'tefal-pfannenschoner-28cm',
    supplierSku: 'TEF-PS-28',
    nameDe: 'Tefal Pfannenschoner 28 cm',
    shortDescription: 'Silikonscheibe zum Schutz von Antihaftbeschichtungen — spülmaschinenfest',
    descriptionDe: `Der Tefal Pfannenschoner 28 cm schützt Ihre wertvollen Antihaftpfannen vor Kratzern und Beschädigungen beim Stapeln. Die hochwertige Silikonscheibe legt sich zwischen die Pfannen und verhindert direkten Kontakt der Beschichtungen.

**Merkmale:**
- Hochwertige Silikonscheibe für zuverlässigen Schutz
- Perfekt für Pfannen mit Ø 28 cm
- Spülmaschinenfest und leicht zu reinigen
- Induktionsgeeignet
- Kompakt und platzsparend
- Schützt Antihaftbeschichtung vor Kratzern

Ein einfaches, aber unverzichtbares Utensil für jede Küche mit Antihaftpfannen.`,
    price: 10.99,
    oldPrice: 14.99,
    brand: 'Tefal',
    material: 'Silikonscheibe',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.12,
    badges: ['Antihaft-Schutz'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Tefal Pfannenschoner 28 cm — Silikonscheibe für Antihaftpfannen | NOVA INDUKT',
    metaDescription: 'Tefal Pfannenschoner 28 cm aus Silikon — schützt Antihaftbeschichtung, spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Tefal Pfannenschoner — 28 cm',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wmf-pfannenschoner-26cm',
    supplierSku: 'WMF-PS-26',
    nameDe: 'WMF Pfannenschoner 26 cm',
    shortDescription: 'Filz- und Stoffschoner für schonenden Pfannenschutz — Made in Germany',
    descriptionDe: `Der WMF Pfannenschoner 26 cm aus Filz und Stoff bietet einen schonenden und zuverlässigen Schutz für Ihre Pfannen beim Stapeln. Die hochwertige Verarbeitung Made in Germany garantiert Langlebigkeit.

**Merkmale:**
- Kombination aus Filz und Stoff für optimalen Schutz
- Perfekt für Pfannen mit Ø 26 cm
- Hergestellt in Deutschland
- Induktionsgeeignet
- Schont empfindliche Antihaftbeschichtungen
- Hochwertige WMF-Qualität

Die bewährte Qualität von WMF auch beim Pfannenschutz.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'WMF',
    material: 'Filz + Stoff',
    dimensions: 'Ø 26 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.15,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Pfannenschoner 26 cm — Filz + Stoff, Made in Germany | NOVA INDUKT',
    metaDescription: 'WMF Pfannenschoner 26 cm aus Filz und Stoff — Made in Germany, schont Antihaftbeschichtung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'WMF Pfannenschoner — 26 cm',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wmf-pfannenschoner-28cm',
    supplierSku: 'WMF-PS-28',
    nameDe: 'WMF Pfannenschoner 28 cm',
    shortDescription: 'Filz- und Stoffschoner für schonenden Pfannenschutz — Made in Germany',
    descriptionDe: `Der WMF Pfannenschoner 28 cm aus Filz und Stoff bietet einen schonenden und zuverlässigen Schutz für Ihre Pfannen beim Stapeln. Die hochwertige Verarbeitung Made in Germany garantiert Langlebigkeit.

**Merkmale:**
- Kombination aus Filz und Stoff für optimalen Schutz
- Perfekt für Pfannen mit Ø 28 cm
- Hergestellt in Deutschland
- Induktionsgeeignet
- Schont empfindliche Antihaftbeschichtungen
- Hochwertige WMF-Qualität

Die bewährte Qualität von WMF auch beim Pfannenschutz.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'WMF',
    material: 'Filz + Stoff',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.18,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Pfannenschoner 28 cm — Filz + Stoff, Made in Germany | NOVA INDUKT',
    metaDescription: 'WMF Pfannenschoner 28 cm aus Filz und Stoff — Made in Germany, schont Antihaftbeschichtung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'WMF Pfannenschoner — 28 cm',
    imageFiles: ['1.png'],
  },

  {
    slug: 'fissler-pfannenschoner-26cm',
    supplierSku: 'FIS-PS-26',
    nameDe: 'Fissler Pfannenschoner 26 cm',
    shortDescription: 'Filz- und Stoffschoner für schonenden Pfannenschutz — Made in Germany',
    descriptionDe: `Der Fissler Pfannenschoner 26 cm aus Filz und Stoff schützt Ihre Pfannen vor Kratzern beim Stapeln. Die hochwertige deutsche Qualität sorgt für Langlebigkeit und zuverlässigen Schutz.

**Merkmale:**
- Kombination aus Filz und Stoff für optimalen Schutz
- Perfekt für Pfannen mit Ø 26 cm
- Hergestellt in Deutschland
- Induktionsgeeignet
- Schont empfindliche Antihaftbeschichtungen
- Hochwertige Fissler-Qualität

Fissler — Markenqualität auch beim Pfannenschutz.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Fissler',
    material: 'Filz + Stoff',
    dimensions: 'Ø 26 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.15,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Pfannenschoner 26 cm — Filz + Stoff, Made in Germany | NOVA INDUKT',
    metaDescription: 'Fissler Pfannenschoner 26 cm aus Filz und Stoff — Made in Germany, schont Antihaftbeschichtung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Fissler Pfannenschoner — 26 cm',
    imageFiles: ['1.png'],
  },

  {
    slug: 'fissler-pfannenschoner-28cm',
    supplierSku: 'FIS-PS-28',
    nameDe: 'Fissler Pfannenschoner 28 cm',
    shortDescription: 'Filz- und Stoffschoner für schonenden Pfannenschutz — Made in Germany',
    descriptionDe: `Der Fissler Pfannenschoner 28 cm aus Filz und Stoff schützt Ihre Pfannen vor Kratzern beim Stapeln. Die hochwertige deutsche Qualität sorgt für Langlebigkeit und zuverlässigen Schutz.

**Merkmale:**
- Kombination aus Filz und Stoff für optimalen Schutz
- Perfekt für Pfannen mit Ø 28 cm
- Hergestellt in Deutschland
- Induktionsgeeignet
- Schont empfindliche Antihaftbeschichtungen
- Hochwertige Fissler-Qualität

Fissler — Markenqualität auch beim Pfannenschutz.`,
    price: 16.99,
    oldPrice: 21.99,
    brand: 'Fissler',
    material: 'Filz + Stoff',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.18,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Pfannenschoner 28 cm — Filz + Stoff, Made in Germany | NOVA INDUKT',
    metaDescription: 'Fissler Pfannenschoner 28 cm aus Filz und Stoff — Made in Germany, schont Antihaftbeschichtung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Fissler Pfannenschoner — 28 cm',
    imageFiles: ['1.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // TOPFREGALE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'rivsalt-topfregal-klein',
    supplierSku: 'RIV-TR-KL',
    nameDe: 'Rivsalt Topfregal Klein (3 Stufen)',
    shortDescription: 'Kompaktes Topfregal aus Metall — Schwedisches Design, 3 Stufen',
    descriptionDe: `Das Rivsalt Topfregal Klein bietet mit seinen 3 Stufen Platz für bis zu 9 Töpfe oder Pfannen. Das schlichte schwedische Design aus schwarzem Metall fügt sich in jede moderne Küche ein.

**Merkmale:**
- 3 Stufen für bis zu 9 Töpfe oder Pfannen
- Robuster Metallrahmen in Schwarz
- Schwedisches Minimal-Design
- Kompakte Abmessungen für kleine Küchen
- Einfacher Aufbau
- Stabile Konstruktion

Schwedisches Design trifft auf praktische Stauraumlösung.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Rivsalt',
    material: 'Metall schwarz',
    dimensions: '3 Stufen, 30×25×30 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Schwedisches Design', '3 Stufen'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rivsalt Topfregal Klein 3 Stufen — Schwedisches Design | NOVA INDUKT',
    metaDescription: 'Rivsalt Topfregal Klein mit 3 Stufen — schwedisches Design, Metall schwarz, platzsparend. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Rivsalt Topfregal Klein',
    imageFiles: ['1.png'],
  },

  {
    slug: 'rivsalt-topfregal-gross',
    supplierSku: 'RIV-TR-GR',
    nameDe: 'Rivsalt Topfregal Groß (4 Stufen)',
    shortDescription: 'Großes Topfregal aus Metall — Schwedisches Design, 4 Stufen',
    descriptionDe: `Das Rivsalt Topfregal Groß bietet mit seinen 4 Stufen großzügigen Platz für bis zu 12 Töpfe oder Pfannen. Das schlichte schwedische Design aus schwarzem Metall ist nicht nur funktional, sondern auch ein echter Hingucker.

**Merkmale:**
- 4 Stufen für bis zu 12 Töpfe oder Pfannen
- Robuster Metallrahmen in Schwarz
- Schwedisches Minimal-Design
- Großzügige Abmessungen für große Küchen
- Einfacher Aufbau
- Stabile Konstruktion

Platz für die gesamte Pfannensammlung im schwedischen Design.`,
    price: 59.99,
    oldPrice: 69.99,
    brand: 'Rivsalt',
    material: 'Metall schwarz',
    dimensions: '4 Stufen, 35×30×40 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.2,
    badges: ['Schwedisches Design', '4 Stufen'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rivsalt Topfregal Groß 4 Stufen — Schwedisches Design | NOVA INDUKT',
    metaDescription: 'Rivsalt Topfregal Groß mit 4 Stufen — schwedisches Design, Metall schwarz, großzügig. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'Rivsalt Topfregal Gross',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wmf-topfregal-edelstahl',
    supplierSku: 'WMF-TR-4F',
    nameDe: 'WMF Topfregal Edelstahl 4-fach',
    shortDescription: 'Hochwertiges Edelstahl-Topfregal — Cromargan® Made in Germany',
    descriptionDe: `Das WMF Topfregal aus Cromargan® Edelstahl bietet 4 Stufen für eine ordentliche Aufbewahrung Ihrer Töpfe und Pfannen. Die hochwertige Verarbeitung aus Edelstahl passt perfekt in moderne Küchen.

**Merkmale:**
- 4-fach-Aufbewahrung für Töpfe und Pfannen
- Hochwertiges Cromargan® Edelstahl
- Hergestellt in Deutschland
- Stabile Konstruktion
- Elegantes Edelstahl-Design
- Pflegeleicht und langlebig

Die bewährte WMF-Qualität auch für die Stauraumlösung in der Küche.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl',
    dimensions: '4-fach, 33×30×35 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in Germany', 'Edelstahl'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Topfregal Edelstahl 4-fach — Cromargan® Made in Germany | NOVA INDUKT',
    metaDescription: 'WMF Topfregal Edelstahl 4-fach — Cromargan®, Made in Germany, hochwertig. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'WMF Topfregal Edelstahl',
    imageFiles: ['1.png'],
  },

  {
    slug: 'ikea-variera-topfregal',
    supplierSku: 'IKEA-VAR-TR',
    nameDe: 'IKEA VARIERA Topfregal',
    shortDescription: 'Günstiges Stahl-Topfregal — 3 Stufen, stapelbar',
    descriptionDe: `Das IKEA VARIERA Topfregal bietet mit seinen 3 Stufen eine günstige und platzsparende Lösung zur Aufbewahrung von Töpfen und Pfannen. Die stabile Stahlkonstruktion ist stapelbar und passt in jede Küche.

**Merkmale:**
- 3 Stufen für Töpfe und Pfannen
- Stabile Stahlkonstruktion
- Stapelbar für mehr Stauraum
- Günstiger Preis
- Kompakte Abmessungen
- Einfacher Aufbau

Die praktische und günstige Lösung für mehr Ordnung in der Küche.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'IKEA',
    material: 'Stahl',
    dimensions: '3 Stufen, 25×28×30 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.0,
    badges: ['Günstig', 'Stapelbar'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'IKEA VARIERA Topfregal — Günstig, Stapelbar | NOVA INDUKT',
    metaDescription: 'IKEA VARIERA Topfregal — 3 Stufen, Stahl, stapelbar, günstig. Jetzt bei NOVA INDUKT.',
    categorySlug: 'pfannenschoner-topfregale',
    folder: 'IKEA VARIERA Topfregal',
    imageFiles: ['1.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Pfannenschoner & Topfregale (10 Produkte)')
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
    console.log('\n🎉 Batch Pfannenschoner & Topfregale terminé avec succès !')
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
