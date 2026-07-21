/**
 * NOVA INDUKT — Seed : Reinigung & Pflege (6 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-reinigung-extra.ts
 *
 * Catégorie : reinigung-pflege (sortOrder 7–12)
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
    slug: 'wmf-edelstahl-reiniger-250ml',
    supplierSku: 'WMF-ER-250',
    nameDe: 'WMF Edelstahl-Reiniger 250 ml',
    shortDescription: 'Spezialreiniger für Edelstahl-Oberflächen — 250 ml, Made in Germany',
    descriptionDe: `Der WMF Edelstahl-Reiniger ist speziell für die Pflege von Edelstahl-Küchengeräten entwickelt worden. Das Reinigungsmittel entfernt Fingerabdrücke, Wasserflecken und kleine Kratzer und sorgt für einen glänzenden Look.

**Merkmale:**
- Speziell für Edelstahl-Oberflächen
- Entfernt Fingerabdrücke und Wasserflecken
- 250 ml Flasche
- Made in Germany
- Einfache Anwendung
- Pflegend und reinigend

Die ideale Pflege für Ihre Edelstahl-Küchengeräte.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'WMF',
    material: 'Reinigungsmittel',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Made in Germany'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'WMF Edelstahl-Reiniger 250 ml — Pflege für Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Edelstahl-Reiniger 250 ml — speziell für Edelstahl, entfernt Flecken, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'WMF Edelstahl-Reiniger 250ml',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'fissler-antihaft-reiniger-250ml',
    supplierSku: 'FIS-AHR-250',
    nameDe: 'Fissler Antihaft-Reiniger 250 ml',
    shortDescription: 'Spezialreiniger für Antihaftpfannen — 250 ml, Made in Germany',
    descriptionDe: `Der Fissler Antihaft-Reiniger ist speziell für die Pflege von Antihaft-Beschichtungen entwickelt worden. Das Reinigungsmittel reinigt schonend und pflegt die empfindliche Beschichtung Ihrer Pfannen.

**Merkmale:**
- Speziell für Antihaft-Beschichtungen
- Reinigt schonend und pflegend
- 250 ml Flasche
- Made in Germany
- Schont empfindliche Beschichtungen
- Einfache Anwendung

Die richtige Pflege für Ihre Fissler-Antihaftpfannen.`,
    price: 9.99,
    oldPrice: 12.99,
    brand: 'Fissler',
    material: 'Reinigungsmittel',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Made in Germany', 'Antihaft'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'Fissler Antihaft-Reiniger 250 ml — Pflege für Antihaftpfannen | NOVA INDUKT',
    metaDescription: 'Fissler Antihaft-Reiniger 250 ml — speziell für Antihaft-Beschichtungen, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Fissler Antihaft-Reiniger 250ml',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'ballarini-reiniger-antihaft-250ml',
    supplierSku: 'BAL-RAH-250',
    nameDe: 'Ballarini Reiniger für Antihaft 250 ml',
    shortDescription: 'Italienischer Antihaft-Reiniger — 250 ml, schonende Reinigung',
    descriptionDe: `Der Ballarini Reiniger für Antihaft-Beschichtungen bringt italienische Qualität in die Pflegenroutine. Das Reinigungsmittel reinigt schonend und hält Ihre Antihaftpfannen in Schuss.

**Merkmale:**
- Speziell für Antihaft-Beschichtungen
- Italienische Qualität
- 250 ml Flasche
- Reinigt schonend
- Pflegt die Beschichtung
- Einfache Anwendung

Pflegeprodukt für Ihre Ballarini-Antihaftpfannen.`,
    price: 8.99,
    oldPrice: 11.99,
    brand: 'Ballarini',
    material: 'Reinigungsmittel',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Italianisch'],
    rating: 4.1,
    reviewCount: 0,
    metaTitle: 'Ballarini Reiniger für Antihaft 250 ml — Italianische Qualität | NOVA INDUKT',
    metaDescription: 'Ballarini Reiniger für Antihaft 250 ml — italienische Qualität, schonende Reinigung für Antihaftpfannen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Ballarini Reiniger Antihaft 250ml',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'le-creuset-pflegeoel-150ml',
    supplierSku: 'LEC-PO-150',
    nameDe: 'Le Creuset Pflegeöl 150 ml',
    shortDescription: 'Hochwertiges Pflegeöl für Emaille-Oberflächen — 150 ml, Made in France',
    descriptionDe: `Das Le Creuset Pflegeöl ist speziell für die Pflege von Emaille-Oberflächen entwickelt worden. Es schützt und pflegt Ihre Le Creuset-Kochgeschirre und sorgt für einen glänzenden Look.

**Merkmale:**
- Speziell für Emaille-Oberflächen
- 150 ml Flasche
- Made in France
- Pflegt und schützt
- Verlängert die Lebensdauer
- Einfache Anwendung

Die ideale Pflege für Ihre Le Creuset-Kochgeschirre.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Le Creuset',
    material: 'Pflegeöl',
    dimensions: '150 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.2,
    badges: ['Made in France', 'Emaille-Pflege'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Le Creuset Pflegeöl 150 ml — Emaille-Pflege | NOVA INDUKT',
    metaDescription: 'Le Creuset Pflegeöl 150 ml — speziell für Emaille, Made in France, pflegt und schützt. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Le Creuset Pflegeöl 150ml',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'weber-grillreiniger-500ml',
    supplierSku: 'WEB-GR2-500',
    nameDe: 'Weber Grillreiniger 500 ml',
    shortDescription: 'Weber Original Grillreiniger — 500 ml, für alle Grilltypen',
    descriptionDe: `Der Weber Grillreiniger ist der perfekte Helfer für die Grillsaison. Das Reinigungsmittel entfernt hartnäckige Verschmutzungen und Fettreste von allen Grilltypen — ohne Beschädigung der Grillflächen.

**Merkmale:**
- Weber Original Qualität
- 500 ml Flasche
- Entfernt Fett und Verschmutzungen
- Für alle Grilltypen
- Schont die Grillflächen
- Einfache Anwendung

Der perfekte Begleiter für Sauberkeit am Grill.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Weber',
    material: 'Reinigungsmittel',
    dimensions: '500 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Weber Original'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Weber Grillreiniger 500 ml — Original Grillreiniger | NOVA INDUKT',
    metaDescription: 'Weber Grillreiniger 500 ml — Weber Original, entfernt Fett und Verschmutzungen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Weber Grillreiniger 500ml',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'dr-beckmann-herdreiniger-500ml',
    supplierSku: 'DRB-HR-500',
    nameDe: 'Dr. Beckmann Herdreiniger 500 ml',
    shortDescription: 'Spezialreiniger für Ceranfelder und Herdplatten — 500 ml',
    descriptionDe: `Der Dr. Beckmann Herdreiniger ist speziell für die Reinigung von Ceranfeldern, Induktionskochfeldern und Herdplatten entwickelt worden. Er entfernt hartnäckige Verschmutzungen ohne Kratzer zu hinterlassen.

**Merkmale:**
- Speziell für Ceranfelder und Herdplatten
- 500 ml Flasche
- Entfernt hartnäckige Verschmutzungen
- Kratzfreie Reinigung
- Für alle Herdtypen
- Einfache Anwendung

Die perfekte Lösung für saubere Kochfelder.`,
    price: 6.99,
    oldPrice: 8.99,
    brand: 'Dr. Beckmann',
    material: 'Reinigungsmittel',
    dimensions: '500 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Herdreiniger', '500 ml'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'Dr. Beckmann Herdreiniger 500 ml — Ceranfeld-Reiniger | NOVA INDUKT',
    metaDescription: 'Dr. Beckmann Herdreiniger 500 ml — speziell für Ceranfelder, kratzfreie Reinigung. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Dr. Beckmann Herdreiniger 500ml',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed : Reinigung & Pflege (6 Produkte)')
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
    console.log('\n🎉 Reinigung & Pflege seed terminé avec succès !')
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
