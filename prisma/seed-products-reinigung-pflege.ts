/**
 * NOVA INDUKT — Seed Batch : 6 Reinigung & Pflege
 * Exécuter avec : npx tsx prisma/seed-products-reinigung-pflege.ts
 *
 * Catégories couvertes :
 *   - Reinigungsmittel (Prods 1, 3, 4, 6)
 *   - Pflegeöle (Prods 2, 5)
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
    slug: 'weber-reiniger-grillreiniger',
    supplierSku: 'WEB-GR-500',
    nameDe: 'Weber Premium Grillreiniger 500 ml',
    shortDescription: 'Hochwertiger Grillreiniger — Weber Original, 500 ml',
    descriptionDe: `Der Weber Premium Grillreiniger entfernt hartnäckige Verschmutzungen und Fettreste von Grillrost und Grilloberfläche. Das Weber Original in praktischer 500 ml Flasche.

**Merkmale:**
- 500 ml Fassungsvermögen
- Weber Original
- Entfernt hartnäckige Verschmutzungen
- Für alle Grilltypen
- Einfache Anwendung
- Zuverlässige Reinigungskraft

Der perfekte Begleiter für die Grillpflege.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Weber',
    material: 'Reinigungsmittel',
    dimensions: '500 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Weber Original', '500 ml'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Weber Premium Grillreiniger 500 ml — Weber Original | NOVA INDUKT',
    metaDescription: 'Weber Premium Grillreiniger 500 ml — Weber Original, zuverlässig. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Weber Premium Grillreiniger',
    imageFiles: ['1.png'],
  },

  {
    slug: 'weber-reiniger-holzschutz',
    supplierSku: 'WEB-HSO-250',
    nameDe: 'Weber Holzschutzöl 250 ml',
    shortDescription: 'Pflegeöl für Holzgriffe und Holzbretter — Weber Original, 250 ml',
    descriptionDe: `Das Weber Holzschutzöl pflegt und schützt Holzgriffe, Holzbretter und andere Holzteile am Grill. Das Weber Original in praktischer 250 ml Flasche.

**Merkmale:**
- 250 ml Fassungsvermögen
- Weber Original
- Pflegt und schützt Holz
- Verhindert Austrocknung
- Einfache Anwendung
- Lebensmittelecht

Die natürliche Pflege für Holzteile am Grill.`,
    price: 14.99,
    oldPrice: 19.99,
    brand: 'Weber',
    material: 'Pflegeöl',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Weber Original', 'Holzschutz'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Weber Holzschutzöl 250 ml — Pflegeöl, Weber Original | NOVA INDUKT',
    metaDescription: 'Weber Holzschutzöl 250 ml — pflegt Holzgriffe, Weber Original. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Weber Holzschutzöl',
    imageFiles: ['1.png'],
  },

  {
    slug: 'wmf-antihaft-reiniger',
    supplierSku: 'WMF-AHR-250',
    nameDe: 'WMF Antihaft-Reiniger 250 ml',
    shortDescription: 'Reiniger speziell für Antihaftbeschichtungen — Made in Germany, 250 ml',
    descriptionDe: `Der WMF Antihaft-Reiniger ist speziell für die schonende Reinigung von Antihaftbeschichtungen entwickelt. Das Reinigungsmittel entfernt Verschmutzungen ohne die empfindliche Beschichtung zu beschädigen.

**Merkmale:**
- 250 ml Fassungsvermögen
- Speziell für Antihaftbeschichtungen
- Hergestellt in Deutschland
- Schonende Reinigung
- Entfernt Fett und Verschmutzungen
- Beschichtungsschonend

Die schonende Reinigung für Ihre Antihaftpfannen.`,
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
    badges: ['Made in Germany', '250 ml'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'WMF Antihaft-Reiniger 250 ml — Made in Germany | NOVA INDUKT',
    metaDescription: 'WMF Antihaft-Reiniger 250 ml — Made in Germany, beschichtungsschonend. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'WMF Antihaft-Reiniger',
    imageFiles: ['1.png'],
  },

  {
    slug: 'fissler-edelstahl-reiniger',
    supplierSku: 'FIS-ER-250',
    nameDe: 'Fissler Edelstahl-Reiniger 250 ml',
    shortDescription: 'Reiniger speziell für Edelstahl — Made in Germany, 250 ml',
    descriptionDe: `Der Fissler Edelstahl-Reiniger entfernt Fingerabdrücke, Wasserflecken und Verschmutzungen von Edelstahloberflächen. Das Reinigungsmittel poliert Edelstahl zu Hochglanz.

**Merkmale:**
- 250 ml Fassungsvermögen
- Speziell für Edelstahloberflächen
- Hergestellt in Deutschland
- Entfernt Fingerabdrücke und Wasserflecken
- Poliert zu Hochglanz
- Pflegende Wirkung

Die perfekte Pflege für Ihre Edelstahlprodukte.`,
    price: 8.99,
    oldPrice: 11.99,
    brand: 'Fissler',
    material: 'Reinigungsmittel',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Made in Germany', 'Edelstahl'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'Fissler Edelstahl-Reiniger 250 ml — Made in Germany | NOVA INDUKT',
    metaDescription: 'Fissler Edelstahl-Reiniger 250 ml — Made in Germany, poliert zu Hochglanz. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Fissler Edelstahl-Reiniger',
    imageFiles: ['1.png'],
  },

  {
    slug: 'ballarini-pflege-ol',
    supplierSku: 'BAL-PO-250',
    nameDe: 'Ballarini Pflegeöl 250 ml',
    shortDescription: 'Pflegeöl für Antihaftbeschichtungen — Italianisch, 250 ml',
    descriptionDe: `Das Ballarini Pflegeöl pflegt und schützt Antihaftbeschichtungen vor Austrocknung und Beschädigungen. Das Pflegeöl in praktischer 250 ml Flasche.

**Merkmale:**
- 250 ml Fassungsvermögen
- Pflegt Antihaftbeschichtung
- Italianisch-Tradition
- Verhindert Austrocknung
- Einfache Anwendung
- Lebensmittelecht

Die natürliche Pflege für Ihre Antihaftpfannen aus Italien.`,
    price: 7.99,
    oldPrice: 9.99,
    brand: 'Ballarini',
    material: 'Pflegeöl',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.25,
    badges: ['Italianisch', 'Antihaft-Pflege'],
    rating: 4.1,
    reviewCount: 0,
    metaTitle: 'Ballarini Pflegeöl 250 ml — Antihaft-Pflege | NOVA INDUKT',
    metaDescription: 'Ballarini Pflegeöl 250 ml — pflegt Antihaftbeschichtung, Italianisch. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Ballarini Pflegeöl',
    imageFiles: ['1.png'],
  },

  {
    slug: 'le-creuset-emaille-reiniger',
    supplierSku: 'LEC-ER-250',
    nameDe: 'Le Creuset Emaille-Reiniger 250 ml',
    shortDescription: 'Reiniger speziell für Emaille-Produkte — Made in France, 250 ml',
    descriptionDe: `Der Le Creuset Emaille-Reiniger entfernt Verschmutzungen und Flecken von emaillierten Oberflächen. Das Reinigungsmittel in praktischer 250 ml Flasche, hergestellt in Frankreich.

**Merkmale:**
- 250 ml Fassungsvermögen
- Speziell für Emaille-Produkte
- Hergestellt in Frankreich
- Schonende Reinigung
- Entfernt Verschmutzungen und Flecken
- Beschichtungsschonend

Die schonende Reinigung für Ihre Le Creuset-Produkte.`,
    price: 12.99,
    oldPrice: 16.99,
    brand: 'Le Creuset',
    material: 'Reinigungsmittel',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Made in France', 'Emaille'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Le Creuset Emaille-Reiniger 250 ml — Made in France | NOVA INDUKT',
    metaDescription: 'Le Creuset Emaille-Reiniger 250 ml — Made in France, Emaille-spezifisch. Jetzt bei NOVA INDUKT.',
    categorySlug: 'reinigung-pflege',
    folder: 'Le Creuset Emaille-Reiniger',
    imageFiles: ['1.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Reinigung & Pflege (6 Produkte)')
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
    console.log('\n🎉 Batch Reinigung & Pflege terminé avec succès !')
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
