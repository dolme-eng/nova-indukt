/**
 * NOVA INDUKT — Seed Extra : 8 Zubehör
 * Exécuter avec : npx tsx prisma/seed-products-zubehoer-extra.ts
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
  // sortOrder metadata: 15-22
  {
    sortOrder: 15,
    slug: 'tfa-digital-kuehlschrank-thermometer',
    supplierSku: 'TFA-DIG-KS',
    nameDe: 'TFA Digital-Kühlschrankthermometer',
    shortDescription: 'Digitales Thermometer für den Kühlschrank — kompakt und zuverlässig',
    descriptionDe: `Das TFA Digital-Kühlschrankthermometer zeigt die Temperatur im Kühlschrank präzise an und hilft, Lebensmittel richtig zu lagern.

**Merkmale:**
- Digitale Anzeige
- Kompaktes Design (7×5×1 cm)
- Einfache Montage
- Induktionskompatibel als Zubehör

Ein unverzichtbares Hilfsmittel für die Küche.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'TFA',
    material: 'Kunststoff',
    dimensions: '7×5×1 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.04,
    badges: ['Digital', 'Kühlschrank'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'TFA Digital-Kühlschrankthermometer — Küchenzubehör | NOVA INDUKT',
    metaDescription: 'TFA Digital-Kühlschrankthermometer — digitale Temperaturanzeige für den Kühlschrank. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'TFA Digital-Kühlschrankthermometer',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 16,
    slug: 'soehnle-kuechenwaage-digital',
    supplierSku: 'SOE-KWD-5',
    nameDe: 'Soehnle Küchenwaage Digital',
    shortDescription: 'Digitale Küchenwaage mit Edelstahl und Glasplatte — 5 kg',
    descriptionDe: `Die Soehnle Küchenwaage Digital bietet präzise Wägungen bis 5 kg mit modernem Design aus Edelstahl und Glas.

**Merkmale:**
- Digitale Anzeige mit Tare-Funktion
- Edelstahl + Glas-Design
- Wäebereich bis 5 kg
- Einfache Reinigung

Die elegante Küchenwaage für präzises Kochen.`,
    price: 24.99,
    oldPrice: 29.99,
    brand: 'Soehnle',
    material: 'Edelstahl + Glas',
    dimensions: '5 kg',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Digital', '5 kg', 'Glasplatte'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Soehnle Küchenwaage Digital — Edelstahl + Glas | NOVA INDUKT',
    metaDescription: 'Soehnle Küchenwaage Digital mit Edelstahl und Glasplatte, 5 kg Wäebereich. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Soehnle Küchenwaage Digital',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 17,
    slug: 'wmf-kitchenmaxx-schneidebrett',
    supplierSku: 'WMF-KM-SB',
    nameDe: 'WMF Küchenmaxx Schneidebrett',
    shortDescription: 'Großes Bambus-Schneidebrett — 36×26 cm',
    descriptionDe: `Das WMF Küchenmaxx Schneidebrett bietet großzügigen Platz für die Zubereitung und ist aus nachhaltigem Bambus gefertigt.

**Merkmale:**
- Nachhaltiger Bambus
- Großes Format (36×26×2 cm)
- Schonend für Messerklingen
- Leicht zu reinigen

Das praktische Schneidebrett für die moderne Küche.`,
    price: 19.99,
    oldPrice: 24.99,
    brand: 'WMF',
    material: 'Bambus',
    dimensions: '36×26×2 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.9,
    badges: ['Bambus', 'Groß'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Küchenmaxx Schneidebrett — Bambus 36×26 cm | NOVA INDUKT',
    metaDescription: 'WMF Küchenmaxx Schneidebrett aus Bambus, 36×26 cm, groß und schmutzabweisend. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'WMF Küchenmaxx Schneidebrett',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 18,
    slug: 'fissler-adapterplatte-16cm',
    supplierSku: 'FIS-ADP-16',
    nameDe: 'Fissler Adapterplatte 16 cm',
    shortDescription: 'Edelstahl-Adapterplatte für kleine Töpfe — Made in Germany',
    descriptionDe: `Die Fissler Adapterplatte 16 cm ermöglicht die Verwendung kleinerer Töpfe und Pfannen auf dem Induktionskochfeld.

**Merkmale:**
- Edelstahl
- Ø 16 cm
- Spülmaschinengeeignet
- Made in Germany
- Für kleine Töpfe und Pfannen

Die Adapterplatte für den flexiblen Einsatz auf Induktion.`,
    price: 24.99,
    oldPrice: 29.99,
    brand: 'Fissler',
    material: 'Edelstahl',
    dimensions: 'Ø 16 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.4,
    badges: ['Made in Germany', 'Für kleine Töpfe'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Fissler Adapterplatte 16 cm — Edelstahl Induktion | NOVA INDUKT',
    metaDescription: 'Fissler Adapterplatte 16 cm aus Edelstahl, Made in Germany, für kleine Töpfe auf Induktion. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Fissler Adapterplatte — 16 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 19,
    slug: 'wmf-adapterplatte-14cm',
    supplierSku: 'WMF-ADP-14',
    nameDe: 'WMF Adapterplatte 14 cm',
    shortDescription: 'Edelstahl-Adapterplatte für kleine Töpfe — Made in Germany',
    descriptionDe: `Die WMF Adapterplatte 14 cm ermöglicht die Verwendung von Espressokochern und kleinen Töpfen auf Induktion.

**Merkmale:**
- Edelstahl
- Ø 14 cm
- Spülmaschinengeeignet
- Made in Germany
- Für kleine Töpfe und Espressokocher

Die kompakte Adapterplatte für Spezialanwendungen.`,
    price: 19.99,
    oldPrice: 24.99,
    brand: 'WMF',
    material: 'Edelstahl',
    dimensions: 'Ø 14 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.35,
    badges: ['Made in Germany'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'WMF Adapterplatte 14 cm — Edelstahl Induktion | NOVA INDUKT',
    metaDescription: 'WMF Adapterplatte 14 cm aus Edelstahl, Made in Germany, für kleine Töpfe auf Induktion. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'WMF Adapterplatte — 14 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 20,
    slug: 'zwilling-schneidebrett-set-3tlg',
    supplierSku: 'ZWI-SB-SET3',
    nameDe: 'Zwilling Schneidebrett Set 3-teilig',
    shortDescription: '3-teiliges Bambus-Schneidebrett-Set in S/M/L',
    descriptionDe: `Das Zwilling Schneidebrett Set 3-teilig bietet drei Größen aus nachhaltigem Bambus für verschiedene Zubereitungsaufgaben.

**Merkmale:**
- Nachhaltiger Bambus
- 3-teilig (S/M/L)
- Schonend für Messerklingen
- Leicht zu reinigen
- Praktisches Set für die ganze Küche

Das ultimative Schneidebrett-Set für jeden Bedarf.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'Zwilling',
    material: 'Bambus',
    dimensions: '3-teilig (S/M/L)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['3-teilig', 'Bambus'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Schneidebrett Set 3-teilig — Bambus | NOVA INDUKT',
    metaDescription: 'Zwilling Schneidebrett Set 3-teilig aus Bambus in verschiedenen Größen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Zwilling Schneidebrett Set — 3-teilig',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 21,
    slug: 'kratzschutzmatte-induktion-28cm',
    supplierSku: 'KRA-SM-28',
    nameDe: 'Kratzschutzmatte Induktion 28 cm',
    shortDescription: 'Glasfaser-Matte für Kratzechutz auf dem Induktionskochfeld',
    descriptionDe: `Die Kratzschutzmatte 28 cm schützt das Induktionskochfeld vor Kratzern und Beschädigungen.

**Merkmale:**
- Glasfaser
- Ø 28 cm
- Spülmaschinengeeignet
- Induktionskompatibel
- Kratzschutz für das Kochfeld

Die einfache und wirkungsvolle Lösung zum Schutz des Kochfelds.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'Kratzschutz',
    material: 'Glasfaser',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.15,
    badges: ['Glasfaser', 'Kratzschutz'],
    rating: 4.1,
    reviewCount: 0,
    metaTitle: 'Kratzschutzmatte Induktion 28 cm — Glasfaser | NOVA INDUKT',
    metaDescription: 'Kratzschutzmatte 28 cm aus Glasfaser für Induktionskochfelder. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Kratzschutzmatte Induktion — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
  {
    sortOrder: 22,
    slug: 'kratzschutzmatte-induktion-32cm',
    supplierSku: 'KRA-SM-32',
    nameDe: 'Kratzschutzmatte Induktion 32 cm',
    shortDescription: 'Glasfaser-Matte für Kratzechutz auf dem Induktionskochfeld',
    descriptionDe: `Die Kratzschutzmatte 32 cm bietet Schutz für größere Induktionskochfelder.

**Merkmale:**
- Glasfaser
- Ø 32 cm
- Spülmaschinengeeignet
- Induktionskompatibel
- Kratzschutz für das Kochfeld

Die größere Variante für Standard-Induktionskochfelder.`,
    price: 11.99,
    oldPrice: 14.99,
    brand: 'Kratzschutz',
    material: 'Glasfaser',
    dimensions: 'Ø 32 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.18,
    badges: ['Glasfaser', 'Kratzschutz'],
    rating: 4.1,
    reviewCount: 0,
    metaTitle: 'Kratzschutzmatte Induktion 32 cm — Glasfaser | NOVA INDUKT',
    metaDescription: 'Kratzschutzmatte 32 cm aus Glasfaser für Induktionskochfelder. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Kratzschutzmatte Induktion — 32 cm',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Zubehör (8 Produkte)')
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
    console.log('\n🎉 Batch Zubehör Extra terminé avec succès !')
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
