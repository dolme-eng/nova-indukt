/**
 * NOVA INDUKT — Seed Batch : Grillpfannen (sortOrder 21–26)
 * Exécuter avec : npx tsx prisma/seed-products-grillpfannen.ts
 *
 * Les Grillpfannen appartiennent à la catégorie "induktionspfannen".
 * sortOrder commence à 21 pour continuer après les Bratpfannen (1–20).
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function imgs(folder: string, files: string[]) {
  const base = `/images/products/${folder}`
  return files.map((file, i) => ({
    url: `${base}/${file}`,
    alt: folder,
    sortOrder: i,
    isMain: i === 0,
  }))
}

const products = [
  // ══════════════════════════════════════════════════════════════
  // GRILLPFANNEN — Induktionsgeeignete Grillpfannen
  // sortOrder 21–26
  // ══════════════════════════════════════════════════════════════
  {
    slug: 'fissler-cenit-grillpfanne-28x28cm',
    supplierSku: 'FIS-CENIT-G28',
    sortOrder: 21,
    nameDe: 'Fissler Cenit Grillpfanne 28x28 cm',
    shortDescription: 'Gerillte Antihaftpfanne aus Aluminium mit 3-Schicht-Antihaftbeschichtung — ideal für Induktion',
    descriptionDe: `Die Fissler Cenit Grillpfanne 28x28 cm bietet perfekte Grillstreben auf dem Induktionsherd. Die hochwertige 3-Schicht-Antihaftbeschichtung sorgt für ein leichtes Lösen der Speisen und eine besonders einfache Reinigung.

**Merkmale:**
- 3-Schicht-Antihaftbeschichtung: extrem robust und langlebig, PFAS-frei
- Gerillte Oberfläche für authentische Grillstreben und Fettableitung
- Leichter Aluminiumkörper für schnelle und gleichmäßige Erwärmung
- Spezieller Induktionsboden für optimale Energieeffizienz auf Induktionskochfeldern
- Ergonomischer Griff mit weichem Griffanteil für sicheren Halt
- Spülmaschinengeeignet und backofenfest bis 160 °C
- Hergestellt in Italien

Die Fissler Cenit Serie überzeugt durch ihr modernes Design und erstklassige Verarbeitung — perfekt für alle, die Wert auf Funktionalität und Ästhetik legen.`,
    price: 61.74,
    oldPrice: 79.99,
    brand: 'Fissler',
    material: 'Aluminium mit 3-Schicht-Antihaftbeschichtung',
    dimensions: '28 x 28 cm, Höhe 4 cm, 2,1 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.08,
    badges: ['Made in Italy', '3-Schicht-Antihaft', 'Gerillt'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Fissler Cenit Grillpfanne 28x28 cm | NOVA INDUKT',
    metaDescription: 'Fissler Cenit Grillpfanne 28x28 cm — Aluminium, 3-Schicht-Antihaftbeschichtung, gerillt, induktionsgeeignet. Hergestellt in Italien bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Fissler Cenit — Grillpfanne 28x28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'wmf-durado-grillpfanne-28x28cm',
    supplierSku: 'WMF-DURA-G28',
    sortOrder: 22,
    nameDe: 'WMF Durado Grillpfanne 28x28 cm',
    shortDescription: 'Cromargan® Edelstahl-Grillpfanne mit Keramikbeschichtung — robust und induktionsgeeignet',
    descriptionDe: `Die WMF Durado Grillpfanne 28x28 cm verbindet die Robustheit von Cromargan® Edelstahl mit einer hochwertigen Keramikbeschichtung. Die gerillte Oberfläche sorgt für perfekte Grillstreben und leitet Fett ideal ab — für fettarmes Grillen auf Induktion.

**Merkmale:**
- Cromargan® Edelstahl 18/10 — unverwüstlich, geschmacksneutral und hygienisch
- Hochwertige Keramikbeschichtung: kratzfest, hitzebeständig und PFAS-frei
- Gerillte Oberfläche für authentische Grillmuster und Fettableitung
- Perfekt abgestimmter TransTherm®-Allherdboden für hervorragende Induktionsleistung
- Solider Hohlgriff zur Reduzierung der Wärmeübertragung
- Spülmaschinengeeignet und backofenfest bis 180 °C
- Hergestellt in Deutschland

WMF Durado steht für deutsche Qualität und langlebige Materialkombination — ideal für anspruchsvolle Hobbyköche.`,
    price: 49.99,
    oldPrice: 65.00,
    brand: 'WMF',
    material: 'Cromargan® Edelstahl 18/10 mit Keramikbeschichtung',
    dimensions: '28 x 28 cm, Höhe 4 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.32,
    badges: ['Made in Germany', 'Keramikbeschichtung', 'Gerillt'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Durado Grillpfanne 28x28 cm | NOVA INDUKT',
    metaDescription: 'WMF Durado Grillpfanne 28x28 cm — Cromargan Edelstahl 18/10, Keramikbeschichtung, gerillt, induktionsgeeignet. Made in Germany bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'WMF Durado — Grillpfanne 28x28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'tefal-natural-on-induction-grillpfanne-26cm',
    supplierSku: 'TEF-NATON-G26',
    sortOrder: 23,
    nameDe: 'Tefal Natural On Induction Grillpfanne 26 cm',
    shortDescription: 'Runde Grillpfanne mit Mineralia+ Antihaftbeschichtung und Thermo-Signal — PFAS-frei',
    descriptionDe: `Die Tefal Natural On Induction Grillpfanne 26 cm ist die ideale Wahl für gesundes Grillen ohne PFAS. Die Mineralia+ Antihtaftbeschichtung enthält echte Mineralpartikel für extra Härte und Langlebigkeit, während das Thermo-Signal die optimale Brattemperatur anzeigt.

**Merkmale:**
- Mineralia+ Antihaftbeschichtung: enthält echte Mineralpartikel, extrem robust und kratzfest
- Thermo-Signal: zeigt die ideale Erhitzungstemperatur an (Punkt wird gleichmäßig rot)
- Vollständig PFAS-frei — gesundes Braten ohne chemische Weichmacher
- Leichter Aluminiumkörper für schnelle und gleichmäßige Wärmeverteilung
- Spezieller ferromagnetischer Induktionsboden
- Gerillte Oberfläche für perfekte Grillstreben
- Spülmaschinengeeignet
- Ergonomischer, hitzebeständiger Griff

Tefal Natural On — natürliches Material, natürliche Geschmäcker, für alle Induktionskochfelder geeignet.`,
    price: 59.99,
    oldPrice: 75.00,
    brand: 'Tefal',
    material: 'Aluminium mit Mineralia+ Antihaftbeschichtung',
    dimensions: 'Ø 26 cm, Höhe 4 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.3,
    badges: ['Thermo-Signal', 'Mineralia+', 'PFAS-frei'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Tefal Natural On Induction Grillpfanne 26 cm | NOVA INDUKT',
    metaDescription: 'Tefal Natural On Induction Grillpfanne 26 cm — Mineralia+ Antihaft, Thermo-Signal, PFAS-frei, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Tefal Natural On Induction — Grillpfanne 26 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'zwilling-summit-plus-grillpfanne-28cm',
    supplierSku: 'ZWI-SUM-G28',
    sortOrder: 24,
    nameDe: 'Zwilling Summit+ Grillpfanne 28 cm',
    shortDescription: 'Aluminium-Grillpfanne mit Keramik-Antihaftbeschichtung — stapelbar und PFAS-frei',
    descriptionDe: `Die Zwilling Summit+ Grillpfanne 28 cm besticht durch ihre keramische Antihtaftbeschichtung und das durchdachte stapelbare Design. Perfekt für alle Induktionskochfelder und ideal für gesundes Grillen ohne PFAS.

**Merkmale:**
- Hochwertige Keramik-Antihaftbeschichtung: PFAS-frei, kratzfest und hitzebeständig
- Leichter Aluminiumkörper für optimale Wärmeverteilung
- Spezieller ferromagnetischer Boden für hervorragende Induktionsleistung
- Stapelbares Design — platzsparende Aufbewahrung
- Gerillte Oberfläche für perfekte Grillstreben und Fettableitung
- Robuster, ergonomischer Griff
- Spülmaschinengeeignet und backofenfest bis 170 °C

Zwilling Summit+ — modernes Design trifft nachhaltige Materialwahl für die qualitätsbewusste Induktionsküche.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'Zwilling',
    material: 'Aluminium mit Keramik-Antihaftbeschichtung',
    dimensions: 'Ø 28 cm, Höhe 4 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.5,
    badges: ['Keramikbeschichtung', 'PFAS-frei', 'Stapelbar'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Zwilling Summit+ Grillpfanne 28 cm | NOVA INDUKT',
    metaDescription: 'Zwilling Summit+ Grillpfanne 28 cm — Keramik-Antihaftbeschichtung, PFAS-frei, stapelbar, induktionsgeeignet. Bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Zwilling Summit+ — Grillpfanne 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'fissler-opc-grillpfanne-28cm',
    supplierSku: 'FIS-OPC-G28',
    sortOrder: 25,
    nameDe: 'Fissler Original Profi Collection Grillpfanne 28 cm',
    shortDescription: 'Premium-Grillpfanne aus Edelstahl 18/10 mit CookStar® Boden — unbeschichtet, Profi-Qualität',
    descriptionDe: `Die Fissler Original Profi Collection Grillpfanne 28 cm ist die Referenz unter den unbeschichteten Grillpfannen. Ohne jegliche Beschichtung bietet sie eine natürliche Edelstahloberfläche, die sich mit der Zeit eine wertvolle Patina bildet — für intensivsten Geschmack auf dem Induktionsherd.

**Merkmale:**
- Unbeschichtete Edelstahloberfläche 18/10 — geschmacksneutral und äußerst langlebig
- CookStar® Allherdboden (5,5 mm): extrem dicker, formstabiler Boden für perfekte Hitzeverteilung
- Speziell optimiert für die Nutzung auf Induktionskochfeldern
- Gerillte Oberfläche für perfekte Grillstreben und natürliche Fettreduktion
- Kaltmetallgriffe: bleiben auf dem Herd angenehm kühl
- Backofenfest bis 230 °C
- Hergestellt in Deutschland — Made in Germany

Die unbeschichtete Profi-Qualität für Köche, die Wert auf natürliche Aromen und maximale Langlebigkeit legen.`,
    price: 159.00,
    oldPrice: 199.00,
    brand: 'Fissler',
    material: 'Edelstahl 18/10 (unbeschichtet, CookStar® Boden)',
    dimensions: 'Ø 28 cm, Höhe 5 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.1,
    badges: ['Made in Germany', 'CookStar®', 'Unbeschichtet', 'Profi-Qualität'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Fissler Original Profi Collection Grillpfanne 28 cm | NOVA INDUKT',
    metaDescription: 'Fissler Original Profi Collection Grillpfanne 28 cm — Edelstahl 18/10 unbeschichtet, CookStar-Boden, induktionsgeeignet. Made in Germany bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'Fissler Original Profi Collection — Grillpfanne 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'wmf-performance-grillpfanne-28cm',
    supplierSku: 'WMF-PERF-G28',
    sortOrder: 26,
    nameDe: 'WMF Performance Grillpfanne 28 cm',
    shortDescription: 'Edelstahl-Grillpfanne mit TransTherm® Boden — unbeschichtet, für Induktion optimiert',
    descriptionDe: `Die WMF Performance Grillpfanne 28 cm wurde spezi für anspruchsvolles Grillen auf Induktionsherden entwickelt. Die unbeschichtete Edelstahloberfläche sorgt für intensiven Bräunungsgeschmack, während der TransTherm®-Boden eine optimale und energieeffiziente Wärmeverteilung gewährleistet.

**Merkmale:**
- Hochwertiger Edelstahl 18/10 — unbeschichtet, geschmacksneutral und langlebig
- TransTherm® Allherdboden: gekapselter Aluminiumkern für beste Induktionsleistung
- Gerillte Oberfläche für perfekte Grillstreben und natürliche Fettreduktion
- Plan stabiler Boden — kein Verziehen bei hohen Temperaturen
- Solide Edelstahlgriffe mit ergonomischem Design
- Spülmaschinengeeignet und backofenfest bis 240 °C
- Hergestellt in Deutschland

WMF Performance — die Verbindung aus traditioneller deutscher Handwerkskunst und moderner Induktionstechnologie.`,
    price: 99.99,
    oldPrice: 129.99,
    brand: 'WMF',
    material: 'Edelstahl 18/10 mit TransTherm®-Boden',
    dimensions: 'Ø 28 cm, Höhe 5 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in Germany', 'TransTherm®', 'Unbeschichtet'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'WMF Performance Grillpfanne 28 cm | NOVA INDUKT',
    metaDescription: 'WMF Performance Grillpfanne 28 cm — Edelstahl 18/10 unbeschichtet, TransTherm-Boden, induktionsgeeignet. Hergestellt in Deutschland bei NOVA INDUKT.',
    categorySlug: 'induktionspfannen',
    folder: 'WMF Performance — Grillpfanne 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Grillpfannen (6 Produkte)')
  console.log('─'.repeat(70))

  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]))

  let created = 0
  let updated = 0
  let errors = 0

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug)
    if (!categoryId) {
      console.error(`  ❌ Catégorie introuvable : ${p.categorySlug}`)
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
        console.log(`  ↻  [${updated + created}/${products.length}] MIS À JOUR : ${p.nameDe.substring(0, 60)}`)
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
            images: { create: imageData },
          },
        })
        created++
        console.log(`  ✓  [${updated + created}/${products.length}] CRÉÉ : ${p.nameDe.substring(0, 60)}`)
      }
    } catch (err: unknown) {
      errors++
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗  ERREUR : ${p.nameDe.substring(0, 40)} — ${msg}`)
    }
  }

  console.log('\n' + '═'.repeat(70))
  console.log('📊 RÉSUMÉ BATCH GRILLPFANNEN')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Batch Grillpfannen terminé avec succès ! 6/6 produits en base.')
  } else {
    console.log(`\n⚠️  ${errors} erreur(s) — vérifiez les logs.`)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
