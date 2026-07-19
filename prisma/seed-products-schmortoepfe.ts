/**
 * NOVA INDUKT — Seed Catégorie : Schmortöpfe / Dutch Ovens (8 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-schmortoepfe.ts
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
  // SCHMORTÖPFE / DUTCH OVENS — Emailliertes Gusseisen
  // ══════════════════════════════════════════════════════════════
  {
    slug: 'staub-cocotte-ronde-24cm',
    supplierSku: 'STB-COC-24',
    sortOrder: 1,
    nameDe: 'Staub Cocotte Ronde 24 cm (3,8 L)',
    shortDescription: 'Französische Gusseisen-Cocotte mit selbstschließender Tropfstruktur im Deckel — 3,8 L',
    descriptionDe: `Die Staub Cocotte Ronde 24 cm ist ein klassischer französischer Schmortopf aus emailliertem Gusseisen. Das massiv gegossene Gusseisen speichert Wärme hervorragend und gibt sie gleichmäßig an das Speisefett ab — ideal für langsames Schmoren, Braten und Aufläufen auf Induktionsherden.

**Merkmale:**
- Massives emailliertes Gusseisen für optimale Wärmespeicherung und gleichmäßige Verteilung
- Schwarze Innenemaille: robust, leicht zu reinigen und ideal zur Kontrolle des Bräunungsgrades
- Selbstschließende Tropfstruktur im Deckel: Kondensat tropft gleichmäßig auf das Gargut zurück — bleibt saftig und aromatisch
- Schwerer Deckel für dichten Verschluss und optimalen Dampfkreislauf
- Geeignet für alle Kochfelder inklusive Induktion, Backofen bis 260 °C und Grill
- Hergestellt in Frankreich mit 5 Jahren Garantie

Die Cocotte Ronde von Staub ist ein unverzichtbares Küchenwerkzeug für alle Liebhaber der französischen Schmorküche. Die selbstschließende Tropfstruktur im Deckel sorgt dafür, dass Kondensat gleichmäßig auf das Speisefett zurücktropft und so die Saftigkeit des Garguts erhält. Kompaktes Format für 2–4 Personen.`,
    price: 199.00,
    oldPrice: 249.00,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 24 cm, Höhe 10 cm (mit Deckel 16 cm), 3,8 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.7,
    badges: ['Made in France', '5 Jahre Garantie', 'Selbstschließende Tropfstruktur'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Ronde 24 cm (3,8 L) | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Ronde 24 cm aus emailliertem Gusseisen. Selbstschließende Tropfstruktur, induktionsgeeignet, Made in France. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Staub Cocotte Ronde — Cocotte 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'staub-cocotte-ronde-28cm',
    supplierSku: 'STB-COC-28',
    sortOrder: 2,
    nameDe: 'Staub Cocotte Ronde 28 cm (5,2 L)',
    shortDescription: 'Große Gusseisen-Cocotte mit Premium-Emaille für anspruchsvolles Schmoren — 5,2 L',
    descriptionDe: `Die Staub Cocotte Ronde 28 cm bietet Platz für großzügige Schmorgerichte und ist die bevorzugte Wahl für Familien und Einladungen. Aus massivem Gusseisen gefertigt und mit einer hochwertigen schwarzen Emaille im Innenraum versehen, gewährleistet sie eine perfekte Hitzeverteilung auf Induktionsherden.

**Merkmale:**
- Massives emailliertes Gusseisen für exzellente Wärmespeicherung und gleichmäßiges Garen
- Premium schwarze Innenemaille: besonders robust, kratzfest und leicht zu pflegen
- Selbstschließende Tropfstruktur im Deckel für Saftigkeit und Aromen
- Schwerer Gusseisen-Deckel für optimalen Dampfkreislauf
- Geeignet für alle Herdarten inklusive Induktion, Backofen bis 260 °C und Grill
- Hergestellt in Frankreich mit 5 Jahren Garantie

Die 28-cm-Variante eigneten sich hervorragend für Gerichte für 4–6 Personen. Die Premium-Emaille bietet eine besonders widerstandsfähige Oberfläche, die auch bei häufiger Nutzung ihre Qualität behält.`,
    price: 259.00,
    oldPrice: 329.00,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 28 cm, Höhe 12 cm (mit Deckel 18 cm), 5,2 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 7.2,
    badges: ['Made in France', '5 Jahre Garantie', 'Premium Emaille'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Ronde 28 cm (5,2 L) | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Ronde 28 cm (5,2 L) aus emailliertem Gusseisen. Premium-Emaille, selbstschließende Tropfstruktur, induktionsgeeignet. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Staub Cocotte Ronde — Cocotte 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'le-creuset-signature-braeter-rund-26cm',
    supplierSku: 'LEC-SIGN-26',
    sortOrder: 3,
    nameDe: 'Le Creuset Signature Bräter Rund 26 cm (5,3 L)',
    shortDescription: 'Der legendäre Gusseisen-Bräter mit 30 Jahren Garantie — Made in France — 5,3 L',
    descriptionDe: `Der Le Creuset Signature Bräter Rund 26 cm ist das weltweite Symbol für erstklassiges Schmoren. Aus massivem Gusseisen in Frankreich gegossen und mit einer langlebigen, leuchtenden Emaille überzogen, speichert er die Hitze optimal und sorgt für eine gleichmäßige Wärmeverteilung — perfekt für zarte Schmorgerichte auf Induktionsplatten.

**Merkmale:**
- Massives Gusseisen für herausragende Wärmespeicherung und gleichmäßiges Garen
- Helle Innenemaille: robust, leicht zu reinigen und ideal zur Kontrolle des Bräunungsgrades
- Signature-Ausstattung: ergonomische, größere Griffe & hitzebeständiger Edelstahlknauf (bis 260 °C)
- Dicht schließender Deckel mit Kondensations-Ringen für optimale Saftigkeit
- Geeignet für alle Kochfelder inklusive Induktion, Backofen und Grill
- Hergestellt in Frankreich mit 30 Jahren Garantie

Ein wunderschöner Klassiker, der direkt vom Kochfeld stilvoll auf dem Tisch serviert werden kann. Die Signature-Serie bietet eine komfortablere Handhabung durch größere Griffe.`,
    price: 289.00,
    oldPrice: 349.00,
    brand: 'Le Creuset',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 26 cm, Höhe 11 cm (mit Deckel 17 cm), 5,3 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.3,
    badges: ['Made in France', '30 Jahre Garantie', 'Premium Gusseisen'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Le Creuset Signature Bräter Rund 26 cm (5,3 L) | NOVA INDUKT',
    metaDescription: 'Le Creuset Signature runder Gusseisen-Bräter 26 cm (5,3 L). Hervorragende Hitzespeicherung, induktionsgeeignet, 30 Jahre Garantie. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Le Creuset Signature — Bräter rund 26 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'le-creuset-signature-braeter-rund-28cm',
    supplierSku: 'LEC-SIGN-28',
    sortOrder: 4,
    nameDe: 'Le Creuset Signature Bräter Rund 28 cm (6,7 L)',
    shortDescription: 'Großzügiger Gusseisen-Bräter für 8–10 Personen — 30 Jahre Garantie — 6,7 L',
    descriptionDe: `Der Le Creuset Signature Bräter Rund 28 cm ist die perfekte Wahl für große Familienfeiern und Einladungen. Mit einem Fassungsvermögen von 6,7 Litern bietet er genug Platz für Schmorgerichte, Eintöpfe und Aufläufe für 8–10 Personen. Aus massivem Gusseisen in Frankreich gegossen, garantiert er eine gleichmäßige Wärmeverteilung auf jedem Kochfeld — inklusive Induktion.

**Merkmale:**
- Massives Gusseisen für optimale Wärmespeicherung und gleichmäßiges Garen
- Helle Innenemaille: robust, leicht zu reinigen und ideal zur Kontrolle des Bräunungsgrades
- Signature-Ausstattung: ergonomische, größere Griffe & hitzebeständiger Edelstahlknauf (bis 260 °C)
- Dicht schließender Deckel mit Kondensations-Ringen
- Geeignet für alle Herdarten inklusive Induktion, Backofen und Grill
- Hergestellt in Frankreich mit 30 Jahren Garantie

Der größte Rundbräter der Signature-Serie — ideal für Festmähler und das schonende Schmoren großer Fleischportionen.`,
    price: 329.00,
    oldPrice: 399.00,
    brand: 'Le Creuset',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 28 cm, Höhe 12 cm (mit Deckel 18 cm), 6,7 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 6.7,
    badges: ['Made in France', '30 Jahre Garantie', 'Für 8-10 Personen'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Le Creuset Signature Bräter Rund 28 cm (6,7 L) | NOVA INDUKT',
    metaDescription: 'Le Creuset Signature runder Gusseisen-Bräter 28 cm (6,7 L) für 8–10 Personen. Premium Gusseisen, induktionsgeeignet, 30 Jahre Garantie. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Le Creuset Signature — Bräter rund 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'petromax-brater-ft6-28cm',
    supplierSku: 'PET-FT6-28',
    sortOrder: 5,
    nameDe: 'Petromax Bräter ft6 Duroplast 28 cm',
    shortDescription: 'Robuster Gusseisen-Bräter mit hitzebeständigen Duroplast-Griffen — PFAS-frei — 5,3 L',
    descriptionDe: `Der Petromax Bräter ft6 ist ein hochwertiger Schmortopf aus emailliertem Gusseisen, der für seine Robustheit und Langlebigkeit bekannt ist. Die hitzebeständigen Duroplast-Griffe bieten einen sicheren und komfortalen Griff, auch wenn der Bräter direkt aus dem Backofen kommt. Die PVC-freie Beschichtung ist PFAS-frei und schont die Umwelt.

**Merkmale:**
- Massives emailliertes Gusseisen für exzellente Wärmespeicherung und gleichmäßige Verteilung
- Hitzebeständige Duroplast-Griffe: sicher und komfortabel auch bei hohen Temperaturen
- PFAS-frei: umweltfreundlich und gesundheitlich unbedenklich
- Geeignet für alle Herdarten inklusive Induktion, Backofen und Grill
- Robuste Emaille-Oberfläche: kratzfest und leicht zu reinigen
- Hergestellt in Deutschland

Der Petromax ft6 ist die ideale Wahl für alle, die Wert auf deutsche Qualität und ein umweltfreundliches Material legen. Der Bräter eignet sich perfekt für das schonende Schmoren, Braten und Backen.`,
    price: 149.00,
    oldPrice: 189.00,
    brand: 'Petromax',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 28 cm, Höhe 11 cm (mit Deckel 17 cm), 5,3 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 6.5,
    badges: ['Made in Germany', 'Duroplast-Griff', 'PFAS-frei'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Petromax Bräter ft6 Duroplast 28 cm | NOVA INDUKT',
    metaDescription: 'Petromax Bräter ft6 28 cm aus emailliertem Gusseisen mit Duroplast-Griffen. PFAS-frei, induktionsgeeignet, Made in Germany. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Petromax Bräter ft6 — Bräter 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'chasseur-cocotte-ronde-24cm',
    supplierSku: 'CHA-COC-24',
    sortOrder: 6,
    nameDe: 'Chasseur Cocotte Ronde 24 cm (3,5 L)',
    shortDescription: 'Französische Gusseisen-Cocotte im traditionellen Design — Premium-Emaille — 3,5 L',
    descriptionDe: `Die Chasseur Cocotte Ronde 24 cm vereint französische Tradition mit moderner Qualität. Aus massivem Gusseisen in Frankreich gegossen und mit einer hochwertigen Emaille versehen, bietet sie eine hervorragende Wärmespeicherung und -verteilung auf Induktionsherden. Das klassische Design eignet sich sowohl für die Zubereitung als auch für die stilvolle Präsentation am Tisch.

**Merkmale:**
- Massives emailliertes Gusseisen für optimale Wärmespeicherung
- Hochwertige Emaille-Oberfläche: robust, leicht zu reinigen und pflegeleicht
- Klassisches französisches Design für Küche und Tisch
- Geeignet für alle Kochfelder inklusive Induktion, Backofen und Grill
- Dicht schließender Deckel für Saftigkeit und Aromen
- Hergestellt in Frankreich

Die Chasseur Cocotte ist eine hervorragende Alternative für alle, die französische Qualität zu einem attraktiven Preis suchen. Perfekt für das Schmoren von Fleisch, Gemüseaufläufen und Eintöpfen.`,
    price: 179.00,
    oldPrice: 219.00,
    brand: 'Chasseur',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 24 cm, Höhe 10 cm (mit Deckel 15 cm), 3,5 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.5,
    badges: ['Made in France', 'Französische Tradition', 'Premium Emaille'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Chasseur Cocotte Ronde 24 cm (3,5 L) | NOVA INDUKT',
    metaDescription: 'Chasseur Cocotte Ronde 24 cm (3,5 L) aus emailliertem Gusseisen. Französische Tradition, induktionsgeeignet, Made in France. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Chasseur Cocotte Ronde — Cocotte 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'petromax-brater-ft9-32cm',
    supplierSku: 'PET-FT9-32',
    sortOrder: 7,
    nameDe: 'Petromax Bräter ft9 Duroplast 32 cm',
    shortDescription: 'Großvolumiger Gusseisen-Bräter für 8–10 Personen — PFAS-frei — 8,2 L',
    descriptionDe: `Der Petromax Bräter ft9 ist ein großzügiger Schmortopf aus emailliertem Gusseisen für die Zubereitung großer Portionen. Mit einem Fassungsvermögen von 8,2 Litern eignet er sich ideal für Familienfeiern und Festmähler. Die hitzebeständigen Duroplast-Griffe bieten einen sicheren Griff, während die PFAS-freie Beschichtung umweltfreundlich und gesundheitlich unbedenklich ist.

**Merkmale:**
- Massives emailliertes Gusseisen für exzellente Wärmespeicherung und gleichmäßige Verteilung
- Hitzebeständige Duroplast-Griffe: sicher und komfortabel auch bei hohen Temperaturen
- PFAS-frei: umweltfreundlich und gesundheitlich unbedenklich
- Großvolumig: ideal für 8–10 Personen
- Geeignet für alle Herdarten inklusive Induktion, Backofen und Grill
- Robuste Emaille-Oberfläche: kratzfest und leicht zu reinigen
- Hergestellt in Deutschland

Der Petromax ft9 ist die perfekte Wahl für große Runden. Ob Schmorbraten, Eintopf oder Auflauf — mit diesem Bräter gelingen auch große Mengen mühelos.`,
    price: 199.00,
    oldPrice: 249.00,
    brand: 'Petromax',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 32 cm, Höhe 13 cm (mit Deckel 19 cm), 8,2 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 8.5,
    badges: ['Made in Germany', 'Für 8-10 Personen', 'PFAS-frei'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Petromax Bräter ft9 Duroplast 32 cm | NOVA INDUKT',
    metaDescription: 'Petromax Bräter ft9 32 cm (8,2 L) aus emailliertem Gusseisen mit Duroplast-Griffen. Großvolumig, PFAS-frei, induktionsgeeignet. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Petromax Bräter ft9 — Bräter 32 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'staub-cocotte-ronde-20cm',
    supplierSku: 'STB-COC-20',
    sortOrder: 8,
    nameDe: 'Staub Cocotte Ronde 20 cm (2,2 L)',
    shortDescription: 'Kompakte Gusseisen-Cocotte für 2–3 Personen — selbstschließende Tropfstruktur — 2,2 L',
    descriptionDe: `Die Staub Cocotte Ronde 20 cm ist die kompakte Variante der legendären französischen Cocotte. Ideal für 2–3 Personen bietet sie alle Vorteile des emaillierten Gusseisens: optimale Wärmespeicherung, gleichmäßige Verteilung und schonendes Garen auf Induktionsherden.

**Merkmale:**
- Massives emailliertes Gusseisen für optimale Wärmespeicherung
- Schwarze Innenemaille: robust, leicht zu reinigen
- Selbstschließende Tropfstruktur im Deckel für Saftigkeit
- Kompaktes Format: ideal für 2–3 Personen
- Geeignet für alle Kochfelder inklusive Induktion, Backofen bis 260 °C und Grill
- Hergestellt in Frankreich mit 5 Jahren Garantie

Die kleinste Cocotte Ronde von Staub ist perfekt für Paare, Singles oder als Beilagen-Topf. Die selbstschließende Tropfstruktur sorgt auch in kleiner Portion für Saftigkeit und Aromen.`,
    price: 149.00,
    oldPrice: 189.00,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 20 cm, Höhe 9 cm (mit Deckel 14 cm), 2,2 Liter',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.8,
    badges: ['Made in France', 'Kompakt', 'Für 2-3 Personen'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Ronde 20 cm (2,2 L) | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Ronde 20 cm (2,2 L) aus emailliertem Gusseisen. Kompakt, selbstschließende Tropfstruktur, induktionsgeeignet. Bei NOVA INDUKT.',
    categorySlug: 'induktionstoepfe',
    folder: 'Staub Cocotte Ronde — Cocotte 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie : Schmortöpfe / Dutch Ovens (8 Produits)')
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
  console.log('📊 RÉSUMÉ BATCH SCHMORTÖPFE')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Catégorie Schmortöpfe terminée avec succès ! 8/8 produits en base.')
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
