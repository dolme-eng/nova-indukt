/**
 * NOVA INDUKT — Seed Crêpe-Pfannen : 4 Crêpe-Pfannen
 * Exécuter avec : npx tsx prisma/seed-products-crepe-pfannen.ts
 *
 * Catégories couvertes :
 *   - Crêpe-Pfannen (Prods 1–4)
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
    slug: 'de-buyer-mineral-b-crepe-pfanne-24cm',
    supplierSku: 'DB-MINB-CP24',
    nameDe: 'de Buyer Mineral B Crêpe-Pfanne 24 cm',
    shortDescription: 'Professionelle Crêpe-Pfanne mit Eisenbeschichtung — Made in France',
    descriptionDe: `Die de Buyer Mineral B Crêpe-Pfanne 24 cm ist die Wahl professioneller Küchenchefs für perfekte Crêpes. Der Eisenbeschichtete Boden entwickelt mit der Zeit eine natürliche Patina, die die Antihaft-Eigenschaften verbessert.

**Merkmale:**
- Stahlkörper mit reiner Eisenbeschichtung — PFAS-frei
- natürliche Patina-Entwicklung für bessere Antihaft-Eigenschaften
- Induktionsgeeignet — ferromagnetischer Boden
- Nicht spülmaschinengeeignet — Handwäsche empfohlen
- Hergestellt in Frankreich
- Professionelle Qualität für Heim und Gastronomie

Die Mineral B Serie ist die klassische Wahl für Crêpe-Liebhaber weltweit.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'de Buyer',
    material: 'Stahl mit Eisenbeschichtung',
    dimensions: 'Ø 24 cm, Höhe 2 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.85,
    badges: ['Made in France', 'Eisenbeschichtung', 'Professionell'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'de Buyer Mineral B Crêpe-Pfanne 24 cm — Eisenbeschichtet | NOVA INDUKT',
    metaDescription: 'de Buyer Mineral B Crêpe-Pfanne 24 cm mit Eisenbeschichtung. Made in France, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'crepe-pfannen',
    folder: 'de Buyer Mineral B Crêpe — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'de-buyer-mineral-b-crepe-pfanne-28cm',
    supplierSku: 'DB-MINB-CP28',
    nameDe: 'de Buyer Mineral B Crêpe-Pfanne 28 cm',
    shortDescription: 'Große Crêpe-Pfanne mit Eisenbeschichtung — ideal für größere Crêpes',
    descriptionDe: `Die de Buyer Mineral B Crêpe-Pfanne 28 cm bietet mehr Platz für größere Crêpes und ist ideal für Familien oder wenn für mehrere Personen gleichzeitig gekocht wird. Die Eisenbeschichtung sorgt mit der Zeit für exzellente Antihaft-Eigenschaften.

**Merkmale:**
- Stahlkörper mit reiner Eisenbeschichtung — PFAS-frei
- Größere Variante für mehr Crêpes-Volumen
- Natürliche Patina-Entwicklung
- Induktionsgeeignet
- Nicht spülmaschinengeeignet
- Hergestellt in Frankreich

Die 28 cm Variante ist die perfekte Wahl für alle, die mehr Platz benötigen.`,
    price: 59.99,
    oldPrice: 79.99,
    brand: 'de Buyer',
    material: 'Stahl mit Eisenbeschichtung',
    dimensions: 'Ø 28 cm, Höhe 2 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.0,
    badges: ['Made in France', 'Eisenbeschichtung', 'Groß'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'de Buyer Mineral B Crêpe-Pfanne 28 cm — Eisenbeschichtet | NOVA INDUKT',
    metaDescription: 'de Buyer Mineral B Crêpe-Pfanne 28 cm mit Eisenbeschichtung. Groß, induktionsgeeignet, Made in France.',
    categorySlug: 'crepe-pfannen',
    folder: 'de Buyer Mineral B Crêpe — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'matfer-copper-steel-crepe-pfanne-24cm',
    supplierSku: 'MAT-CS-CP24',
    nameDe: 'Matfer Copper Steel Crêpe-Pfanne 24 cm',
    shortDescription: 'Professionelle Crêpe-Pfanne mit Kupferkern — Made in France',
    descriptionDe: `Die Matfer Copper Steel Crêpe-Pfanne 24 cm vereint die exzellente Wärmeleitfähigkeit von Kupfer mit der Robustheit von Edelstahl. Diese Kombination macht sie zur ersten Wahl professioneller Küchen für perfekte Crêpes und Pfannkuchen.

**Merkmale:**
- Kupferkern für exzellente Wärmeverteilung
- Edelstahl-Außenbeschichtung für Langlebigkeit
- Induktionsgeeignet dank ferromagnetischem Boden
- Nicht spülmaschinengeeignet
- Hergestellt in Frankreich
- Professionelle Qualität

Die Copper Steel Serie steht für höchste französische Kochkunst.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Matfer',
    material: 'Kupfer+Edelstahl',
    dimensions: 'Ø 24 cm, Höhe 2 cm',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.1,
    badges: ['Made in France', 'Kupferkern', 'Professionell'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Matfer Copper Steel Crêpe-Pfanne 24 cm — Kupferkern | NOVA INDUKT',
    metaDescription: 'Matfer Copper Steel Crêpe-Pfanne 24 cm mit Kupferkern. Made in France, induktionsgeeignet, professionell.',
    categorySlug: 'crepe-pfannen',
    folder: 'Matfer Copper Steel Crêpe — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'tefal-preference-crepe-pfanne-25cm',
    supplierSku: 'TEF-PREF-CP25',
    nameDe: 'Tefal Préférence Crêpe-Pfanne 25 cm',
    shortDescription: 'Einsteiger-Crêpe-Pfanne mit Antihaftbeschichtung — Thermo-Signal',
    descriptionDe: `Die Tefal Préférence Crêpe-Pfanne 25 cm ist die ideale Einsteiger-Option für alle, die regelmäßig Crêpes zubereiten möchten. Die bewährte Antihaftbeschichtung und das Thermo-Signal erleichtern das Garen.

**Merkmale:**
- Leichtgewicht-Aluminiumkörper für schnelle Erhitzung
- Antihaftbeschichtung für müheloses Wenden
- Praktisches Thermo-Signal für ideale Temperatur
- Spülmaschinengeeignet
- Induktionsgeeignet
- Ideal für Einsteiger und Gelegenheitsköche

Die Préférence Serie bietet Tefal-Qualität zum Einstiegspreis.`,
    price: 29.99,
    oldPrice: 39.99,
    brand: 'Tefal',
    material: 'Aluminium mit Antihaft',
    dimensions: 'Ø 25 cm, Höhe 2 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.65,
    badges: ['Thermo-Signal', 'Antihaft', 'Einsteiger'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Tefal Préférence Crêpe-Pfanne 25 cm — Antihaft | NOVA INDUKT',
    metaDescription: 'Tefal Préférence Crêpe-Pfanne 25 cm mit Antihaft und Thermo-Signal. Leicht, induktionsgeeignet, spülmaschinenfest.',
    categorySlug: 'crepe-pfannen',
    folder: 'Tefal Préférence Crêpe — 25 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Crêpe-Pfannen : 4 Produkte')
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
    console.log('\n🎉 Crêpe-Pfannen-Seed terminé avec succès !')
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
