/**
 * NOVA INDUKT — Seed Extra : Backformen (8 Produkte)
 * Exécuter avec : npx tsx prisma/seed-products-formes-extra.ts
 *
 * Catégorie : formes-de-cuisson (sortOrder 11–18)
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
    slug: 'le-creuset-signature-springform-24cm',
    supplierSku: 'LEC-SIG-SF24',
    nameDe: 'Le Creuset Signature Springform 24 cm',
    shortDescription: 'Französische Premium-Springform aus emailliertem Gusseisen — 30 Jahre Garantie',
    descriptionDe: `Die Le Creuset Signature Springform vereint die legendäre Gusseisen-Qualität mit der Praktikabilität einer Springform. Ideal für Kuchen, Tarten und Torten auf dem Induktionsherd oder im Backofen.

**Merkmale:**
- Emailliertes Gusseisen — gleichmäßige Wärmeverteilung, keine Hotspots
- Abnehmbarer Springform-Rand für einfaches Entformen
- Induktionsgeeignet und ofenfest
- Spülmaschinengeeignet (vorsichtig)
- 30 Jahre Garantie durch Le Creuset
- Hergestellt in Frankreich
- Erhältlich in mehreren Farben

Le Creuset steht für französische Tradition und höchste Kochkunst — die Springform ist eine Investition fürs Leben.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'Le Creuset',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.2,
    badges: ['Made in France', '30 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Le Creuset Signature Springform 24 cm — Gusseisen | NOVA INDUKT',
    metaDescription: 'Le Creuset Signature Springform 24 cm — emailliertes Gusseisen, Made in France, 30 Jahre Garantie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Le Creuset Signature Springform — 24 cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'le-creuset-signature-kasserolle-20cm',
    supplierSku: 'LEC-SIG-KAS20',
    nameDe: 'Le Creuset Signature Kasserolle 20 cm',
    shortDescription: 'Französische Gusseisen-Kasserolle — klassisches Design, 2,0 L Volumen',
    descriptionDe: `Die Le Creuset Signature Kasserolle ist ein Klassiker der französischen Küche. Aus emailliertem Gusseisen gefertigt, eignet sie sich perfekt für Saucen, Eintöpfe und Beilagen auf dem Induktionsherd.

**Merkmale:**
- Emailliertes Gusseisen — optimale Wärmespeicherung
- Klassisches Le Creuset-Design mit Farbauswahl
- Integrierte Ausgießer beidseitig
- Gusseisen-Griff — vollständig ofenfest
- Induktionsgeeignet
- 2,0 L Volumen — ideal für Saucen und Beilagen
- Hergestellt in Frankreich

Die Kasserolle ist ein unverzichtbares Werkzeug für alle, die französische Kochkunst zu Hause genießen möchten.`,
    price: 59.99,
    oldPrice: 69.99,
    brand: 'Le Creuset',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 20 cm, 2,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.5,
    badges: ['Made in France', 'Kasserolle'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Le Creuset Signature Kasserolle 20 cm — Gusseisen | NOVA INDUKT',
    metaDescription: 'Le Creuset Signature Kasserolle 20 cm — emailliertes Gusseisen, Made in France, 2,0 L. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Le Creuset Signature Kasserolle — 20 cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'staub-cocotte-ronde-32cm',
    supplierSku: 'STB-COC-R32',
    nameDe: 'Staub Cocotte Ronde 32 cm',
    shortDescription: 'Französische Gusseisen-Cocotte — großzügige 7,0 L für Braten und Eintöpfe',
    descriptionDe: `Die Staub Cocotte Ronde ist das ultimative französische Gusseisen-Topf. Mit 32 cm Durchmesser und 7 Litern Fassungsvermögen ideal für große Braten, Eintöpfe und Familiengerichte.

**Merkmale:**
- Emailliertes Gusseisen — mattschwarze Innenemaille für bessere Patina
- Großzügiges Fassungsvermögen von 7,0 L
- Integrierte Ausgießer beidseitig
- Gusseisen-Griff — vollständig ofenfest
- Induktionsgeeignet
- Spülmaschinengeeignet (vorsichtig)
- Hergestellt in Frankreich

Die Cocotte Ronde ist ein Kochgerät für Generationen — sie wird mit jeder Benutzung besser.`,
    price: 299.00,
    oldPrice: 369.00,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 32 cm, 7,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 8.0,
    badges: ['Made in France', 'Groß'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Ronde 32 cm — Gusseisen 7,0 L | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Ronde 32 cm — emailliertes Gusseisen, 7,0 L, Made in France. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Staub Cocotte Ronde — 32 cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'staub-cocotte-ronde-26cm',
    supplierSku: 'STB-COC-R26',
    nameDe: 'Staub Cocotte Ronde 26 cm',
    shortDescription: 'Französische Gusseisen-Cocotte — 4,0 L für mittlere Portionen',
    descriptionDe: `Die Staub Cocotte Ronde 26 cm ist die mittlere Größe der beliebten Cocotte-Serie. Mit 4 Litern Fassungsvermögen ideal für Familiengerichte und Eintöpfe für 4–6 Personen.

**Merkmale:**
- Emailliertes Gusseisen — mattschwarze Innenemaille
- 4,0 L Fassungsvermögen — ideal für 4–6 Personen
- Integrierte Ausgießer beidseitig
- Gusseisen-Griff — vollständig ofenfest
- Induktionsgeeignet
- Spülmaschinengeeignet (vorsichtig)
- Hergestellt in Frankreich

Die Cocotte Ronde 26 cm ist die perfekte Größe für den Alltag — groß genug für die Familie, kompakt genug für den Herd.`,
    price: 219.00,
    oldPrice: 269.00,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 26 cm, 4,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.8,
    badges: ['Made in France'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Ronde 26 cm — Gusseisen 4,0 L | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Ronde 26 cm — emailliertes Gusseisen, 4,0 L, Made in France. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Staub Cocotte Ronde — 26 cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'petromax-dutch-oven-ft9-32cm',
    supplierSku: 'PET-FT9-32',
    nameDe: 'Petromax Dutch Oven ft9 Duroplast 32 cm',
    shortDescription: 'Robuster Gusseisen-Bräter mit Duroplast-Griff — 8,2 L für Outdoor & Küche',
    descriptionDe: `Die Petromax Dutch Oven ft9 ist ein massiver Gusseisen-Bräter mit innovativem Duroplast-Griff. Mit 8,2 Litern Fassungsvermögen ideal für große Braten, Eintöpfe und Outdoor-Cooking.

**Merkmale:**
- Emailliertes Gusseisen — PFAS-frei
- Duroplast-Griff — hitzebeständig und griffig
- 8,2 L Fassungsvermögen — ideal für große Portionen
- Induktionsgeeignet
- Spülmaschinengeeignet (vorsichtig)
- Outdoor-geeignet (Lagerfeuer, Grill)
- Hergestellt in Deutschland

Die Petromax Dutch Oven ft9 ist der zuverlässige Begleiter für Großverpflegung zu Hause und im Freien.`,
    price: 199.00,
    oldPrice: 249.00,
    brand: 'Petromax',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 32 cm, 8,2 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 8.5,
    badges: ['Made in Germany', 'Duroplast-Griff'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Petromax Dutch Oven ft9 32 cm — Gusseisen 8,2 L | NOVA INDUKT',
    metaDescription: 'Petromax Dutch Oven ft9 32 cm — emailliertes Gusseisen, 8,2 L, Duroplast-Griff. Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Petromax Dutch Oven ft9 — 32 cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'fissler-cenit-auflaufform-28x20cm',
    supplierSku: 'FIS-CEN-AF28',
    nameDe: 'Fissler Cenit Auflaufform 28×20 cm',
    shortDescription: 'Aluminium-Auflaufform mit Antihaftbeschichtung — spülmaschinengeeignet',
    descriptionDe: `Die Fissler Cenit Auflaufform bietet großzügigen Platz für Aufläufe, Lasagnen und Überbackenes. Der robuste Aluminiumkörper und die Antihaftbeschichtung sorgen für einfaches Ausräumen und schnelle Reinigung.

**Merkmale:**
- Robuster Aluminiumkörper
- Antihaftbeschichtung — leichtes Ausräumen
- Großzügige Abmessungen: 28×20×7 cm
- Spülmaschinengeeignet
- Induktionsgeeignet
- Hergestellt in Deutschland

Die Cenit Auflaufform ist der zuverlässige Helfer für den Backofen — von Lasagne bis Auflauf.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'Fissler',
    material: 'Aluminium mit Antihaft',
    dimensions: '28×20×7 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.2,
    badges: ['Made in Germany'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Cenit Auflaufform 28×20 cm — Antihaft | NOVA INDUKT',
    metaDescription: 'Fissler Cenit Auflaufform 28×20 cm — Aluminium mit Antihaft, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Fissler Cenit Auflaufform — 28×20 cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-professional-s-plus-auflaufform-32x24cm',
    supplierSku: 'WMF-PP-AF32',
    nameDe: 'WMF Profi Plus Auflaufform 32×24 cm',
    shortDescription: 'Edelstahl-Auflaufform — robust, spülmaschinenfest, induktionsgeeignet',
    descriptionDe: `Die WMF Profi Plus Auflaufform bietet großzügigen Platz für große Aufläufe und Überbackenes. Der robuste Edelstahlkörper ist besonders langlebig und spülmaschinenfest.

**Merkmale:**
- Robuster Edelstahlkörper
- Großzügige Abmessungen: 32×24×7 cm
- Spülmaschinengeeignet
- Induktionsgeeignet
- Hergestellt in Deutschland

Die WMF Profi Plus Auflaufform ist die langlebige Wahl für den ambitionierten Hobbykoch.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'WMF',
    material: 'Edelstahl',
    dimensions: '32×24×7 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Made in Germany'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Auflaufform 32×24 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Auflaufform 32×24 cm — Edelstahl, Made in Germany, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'WMF Profi Plus Auflaufform — 32×24 cm',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'petromax-dutch-oven-ft6-28cm',
    supplierSku: 'PET-FT6-28',
    nameDe: 'Petromax Dutch Oven ft6 Duroplast 28 cm',
    shortDescription: 'Mittlerer Gusseisen-Bräter mit Duroplast-Griff — 5,3 L, PFAS-frei',
    descriptionDe: `Die Petromax Dutch Oven ft6 ist die mittlere Größe der beliebten Dutch-Oven-Serie. Mit 5,3 Litern Fassungsvermögen ideal für Familiengerichte und Eintöpfe.

**Merkmale:**
- Emailliertes Gusseisen — PFAS-frei
- Duroplast-Griff — hitzebeständig und griffig
- 5,3 L Fassungsvermögen — ideal für 4–6 Personen
- Induktionsgeeignet
- Spülmaschinengeeignet (vorsichtig)
- Outdoor-geeignet
- Hergestellt in Deutschland

Die Petromax Dutch Oven ft6 ist der vielseitige Bräter für die Küche und das Freien.`,
    price: 149.00,
    oldPrice: 189.00,
    brand: 'Petromax',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 28 cm, 5,3 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 6.5,
    badges: ['Made in Germany', 'PFAS-frei'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Petromax Dutch Oven ft6 28 cm — Gusseisen 5,3 L | NOVA INDUKT',
    metaDescription: 'Petromax Dutch Oven ft6 28 cm — emailliertes Gusseisen, 5,3 L, PFAS-frei. Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Petromax Dutch Oven ft6 — 28 cm',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Extra : Backformen (8 Produkte)')
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
    console.log('\n🎉 Backformen Extra terminé avec succès !')
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
