/**
 * NOVA INDUKT — Seed Batch : 10 Backformen
 * Exécuter avec : npx tsx prisma/seed-products-formes-de-cuisson.ts
 *
 * Catégories couvertes :
 *   - Formes de cuisson (Prods 1–10)
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
  // ══════════════════════════════════════════════════════════════
  // BACKFORMEN
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'fissler-cenit-auflaufform-26x18cm',
    supplierSku: 'FIS-CEN-AF26',
    nameDe: 'Fissler Cenit Auflaufform 26×18 cm',
    shortDescription: 'Hochwertige Aluminium-Auflaufform mit Antihaftbeschichtung — Made in Germany',
    descriptionDe: `Die Fissler Cenit Auflaufform 26×18 cm ist die ideale Begleiterin für köstliche Aufläufe, Braten und Kuchen. Aus hochwertigem Aluminium gefertigt und mit einer zuverlässigen Antihaftbeschichtung versehen, sorgt sie für gleichmäßiges Garen und einfaches Entnehmen der Speisen.

**Merkmale:**
- Leichter Aluminiumkörper für gleichmäßige Wärmeverteilung
- Zuverlässige Antihaftbeschichtung — Speisen lassen sich leicht lösen
- Perfekt für Induktionsherde geeignet
- Spülmaschinenfest für einfache Reinigung
- Kompakte Abmessungen — ideal für Familienportionen
- Hergestellt in Deutschland

Die Cenit-Serie von Fissler steht für deutschen Qualitätsanspruch im täglichen Gebrauch.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Fissler',
    material: 'Aluminium mit Antihaft',
    dimensions: '26×18×6 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.0,
    badges: ['Made in Germany', 'Antihaft'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Cenit Auflaufform 26×18 cm — Aluminium Antihaft | NOVA INDUKT',
    metaDescription: 'Fissler Cenit Auflaufform 26×18 cm mit Antihaftbeschichtung. Spülmaschinenfest, induktionsgeeignet. Hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Fissler Cenit Auflaufform — 26x18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-cenit-auflaufform-33x23cm',
    supplierSku: 'FIS-CEN-AF33',
    nameDe: 'Fissler Cenit Auflaufform 33×23 cm',
    shortDescription: 'Große Aluminium-Auflaufform mit Antihaftbeschichtung — ideal für Großfamilien',
    descriptionDe: `Die Fissler Cenit Auflaufform 33×23 cm bietet großzügigen Platz für große Portionen und festliche Anlässe. Der hochwertige Aluminiumkörper sorgt für optimale Wärmeverteilung, während die Antihaftbeschichtung das Entnehmen und Reinigen kinderleicht macht.

**Merkmale:**
- Großes Fassungsvermögen — ideal für Großfamilien und Gesellschaften
- Leichter Aluminiumkörper für schnelle und gleichmäßige Erhitzung
- Zuverlässige Antihaftbeschichtung
- Induktionsgeeignet und spülmaschinenfest
- Robuste Verarbeitung für langlebigen Einsatz
- Hergestellt in Deutschland

Die große Version der Cenit-Serie — wenn mehr Platz für mehr Genuss benötigt wird.`,
    price: 49.99,
    oldPrice: 64.99,
    brand: 'Fissler',
    material: 'Aluminium mit Antihaft',
    dimensions: '33×23×7 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.4,
    badges: ['Made in Germany', 'Antihaft', 'Groß'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler Cenit Auflaufform 33×23 cm — Großformat, Antihaft | NOVA INDUKT',
    metaDescription: 'Fissler Cenit Auflaufform 33×23 cm — großes Format mit Antihaftbeschichtung. Spülmaschinenfest, induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Fissler Cenit Auflaufform — 33x23 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-profi-plus-backform-set',
    supplierSku: 'WMF-PP-BFS3',
    nameDe: 'WMF Profi Plus Backform-Set 3-teilig',
    shortDescription: 'Professionelles 3-teiliges Backform-Set aus Edelstahl — Made in Germany',
    descriptionDe: `Das WMF Profi Plus Backform-Set besteht aus drei hochwertigen Edelstahl-Backformen in verschiedenen Größen. Die robusten Formen bieten eine gleichmäßige Wärmeverteilung und sind dank des 18/10-Edelstahls besonders langlebig und pflegeleicht.

**Merkmale:**
- 3-teiliges Set: 24 cm, 28 cm und 33 cm
- Hochwertiger 18/10-Edelstahl — robust und langlebig
- Gleichmäßige Wärmeverteilung für perfekte Backergebnisse
- Induktionsgeeignet und spülmaschinenfest
- Stapelbar — platzsparendes Verstauen
- Hergestellt in Deutschland

Die Profi Plus Serie von WMF steht für professionelle Qualität im heimischen Backen.`,
    price: 29.99,
    oldPrice: 39.99,
    brand: 'WMF',
    material: 'Edelstahl',
    dimensions: '3-teilig (24, 28, 33 cm)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in Germany', '3-teilig'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Backform-Set 3-teilig — Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Backform-Set 3-teilig aus Edelstahl. Induktionsgeeignet, spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'WMF Profi Plus Backform-Set — 3-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-professional-s-plus-kastenform',
    supplierSku: 'WMF-PP-KF26',
    nameDe: 'WMF Profi Plus Kastenform 26 cm',
    shortDescription: 'Edelstahl-Kastenform für Kuchen und Brot — robust und spülmaschinenfest',
    descriptionDe: `Die WMF Profi Plus Kastenform 26 cm ist die perfekte Form für Kuchen, Brot und Aufläufe. Aus hochwertigem Edelstahl gefertigt, bietet sie gleichmäßige Wärmeverteilung und ist dank ihrer robusten Bauweise ein langlebiger Begleiter in der Küche.

**Merkmale:**
- Hochwertiger 18/10-Edelstahl
- Gleichmäßige Wärmeverteilung — kein Anbrennen
- Perfekt für Kuchen, Brot und Aufläufe
- Induktionsgeeignet und spülmaschinenfest
- Klassisches Design — vielseitig einsetzbar
- Hergestellt in Deutschland

Ein unverzichtbares Küchenutensil für jede Bäckerin und jeden Bäcker.`,
    price: 19.99,
    oldPrice: 24.99,
    brand: 'WMF',
    material: 'Edelstahl',
    dimensions: '26×18×7 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Kastenform 26 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Kastenform 26 cm aus Edelstahl. Induktionsgeeignet, spülmaschinenfest, hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'WMF Profi Plus Kastenform — 26 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-professional-s-plus-tarte-form',
    supplierSku: 'WMF-PP-TF28',
    nameDe: 'WMF Profi Plus Tarte-Form 28 cm',
    shortDescription: 'Edelstahl-Tarte-Form für Tartes, Quiches und Obstspezialitäten',
    descriptionDe: `Die WMF Profi Plus Tarte-Form 28 cm ist ideal für feine Tartes, herzhafte Quiches und köstliche Obstkuchen. Der hochwertige Edelstahl sorgt für gleichmäßiges Garen, während der abnehmbare Boden das Entformen besonders einfach macht.

**Merkmale:**
- Hochwertiger 18/10-Edelstahl
- Abnehmbarer Boden — problemloses Entformen
- Ideal für Tartes, Quiches und Obsttorten
- Induktionsgeeignet und spülmaschinenfest
- Klassischer Rundrand für gleichmäßige Kanten
- Hergestellt in Deutschland

Die Profi Plus Tarte-Form — für professionelle Ergebnisse zu Hause.`,
    price: 17.99,
    oldPrice: 22.99,
    brand: 'WMF',
    material: 'Edelstahl',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Made in Germany'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'WMF Profi Plus Tarte-Form 28 cm — Edelstahl | NOVA INDUKT',
    metaDescription: 'WMF Profi Plus Tarte-Form 28 cm aus Edelstahl mit abnehmbarem Boden. Induktionsgeeignet, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'WMF Profi Plus Tarte-Form — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'stash-cocotte-oval-31x21cm',
    supplierSku: 'STB-COC-OV31',
    nameDe: 'Staub Cocotte Oval 31×21 cm',
    shortDescription: 'Französische Gusseisen-Cocotte — emailliert, ofenfest, made in France',
    descriptionDe: `Die Staub Cocotte Oval 31×21 cm ist das Meisterwerk französischer Gusseisen-Kunst. Die emaillierte Innenfläche sorgt für gleichmäßiges Garen und hervorragende Wärmespeicherung, während der markante Deckel für Saftigkeit und Aromenentfaltung sorgt.

**Merkmale:**
- Emailliertes Gusseisen — hervorragende Wärmespeicherung
- Ovaler Deckel mit Staub-Noppen — Saftigkeitskreislauf für aromareiche Gerichte
- Volumen: 4,2 Liter — ideal für Schmorgerichte und Braten
- Vollständig ofenfest — Perfekt für Schmor- und Garverfahren
- Induktionsgeeignet und spülmaschinenfest
- 5 Jahre Garantie durch Staub
- Hergestellt in Frankreich

Die Staub Cocotte — ein Küchenbegleiter fürs Leben, der mit der Zeit noch schöner wird.`,
    price: 219.99,
    oldPrice: 269.99,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: '31×21×12 cm, 4,2 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 5.0,
    badges: ['Made in France', '5 Jahre Garantie'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Oval 31×21 cm — Emailliertes Gusseisen | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Oval 31×21 cm aus emailliertem Gusseisen. 4,2 L, ofenfest, Made in France. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Staub Cocotte Oval — 31x21 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'le-creuset-signature-kastenform',
    supplierSku: 'LEC-SIG-KF23',
    nameDe: 'Le Creuset Signature Kastenform 23 cm',
    shortDescription: 'Französische Gusseisen-Kastenform — emailliert, ikonisches Design',
    descriptionDe: `Die Le Creuset Signature Kastenform 23 cm vereint klassisches französisches Design mit höchster Kochleistung. Aus emailliertem Gusseisen gefertigt, sorgt sie für gleichmäßige Wärmeverteilung und ist der perfekte Begleiter für herzhafte Kuchen und Aufläufe.

**Merkmale:**
- Emailliertes Gusseisen — exzellente Wärmespeicherung
- Ikonisches Le Creuset Design in charakteristischer Farbe
- Ideal für Kuchen, Brot und Aufläufe
- Vollständig ofenfest und spülmaschinenfest
- Induktionsgeeignet
- 30 Jahre Garantie durch Le Creuset
- Hergestellt in Frankreich

Le Creuset — seit 1925 das Maß der Dinge in der französischen Kochkunst.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'Le Creuset',
    material: 'Emailliertes Gusseisen',
    dimensions: '23×13×7 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.8,
    badges: ['Made in France', '30 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Le Creuset Signature Kastenform 23 cm — Emailliertes Gusseisen | NOVA INDUKT',
    metaDescription: 'Le Creuset Signature Kastenform 23 cm aus emailliertem Gusseisen. 30 Jahre Garantie, Made in France. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Le Creuset Signature Kastenform — 23 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'le-creuset-signature-tarte-form',
    supplierSku: 'LEC-SIG-TF28',
    nameDe: 'Le Creuset Signature Tarte-Form 28 cm',
    shortDescription: 'Französische Gusseisen-Tarte-Form — emailliert, abnehmbarer Boden',
    descriptionDe: `Die Le Creuset Signature Tarte-Form 28 cm ist die perfekte Wahl für feine Tartes, Quiches und Obstkuchen. Der abnehmbare Boden ermöglicht ein müheloses Entformen, während das emaillierte Gusseisen für gleichmäßiges Garen sorgt.

**Merkmale:**
- Emailliertes Gusseisen — gleichmäßige Wärmeverteilung
- Abnehmbarer Boden — problemloses Entformen
- Ideal für Tartes, Quiches und Obstkuchen
- Vollständig ofenfest — bis zu sehr hohen Temperaturen
- Induktionsgeeignet und spülmaschinenfest
- 30 Jahre Garantie durch Le Creuset
- Hergestellt in Frankreich

Die Tarte-Form von Le Creuset — für kulinarische Highlights im klassischen französischen Stil.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Le Creuset',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 2.0,
    badges: ['Made in France', '30 Jahre Garantie'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Le Creuset Signature Tarte-Form 28 cm — Emailliertes Gusseisen | NOVA INDUKT',
    metaDescription: 'Le Creuset Signature Tarte-Form 28 cm aus emailliertem Gusseisen. Abnehmbarer Boden, 30 Jahre Garantie. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Le Creuset Signature Tarte-Form — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'petromax-dutch-oven-dt6-oval',
    supplierSku: 'PET-DT6-OV',
    nameDe: 'Petromax Dutch Oven DT6 Oval',
    shortDescription: 'Robuster Gusseisen-Bräter — voreingebrannt, outdoor-tauglich, 7 Liter',
    descriptionDe: `Die Petromax Dutch Oven DT6 ist ein robuster Gusseisen-Bräter für den Einsatz auf dem Induktionsherd, im Backofen, am Grill und im Freien. Mit 7 Litern Fassungsvermögen eignet sie sich ideal für große Schmorgerichte, Eintöpfe und Braten.

**Merkmale:**
- Massives Gusseisen — voreingebrannt mit pflanzlichem Öl
- Volumen: 7 Liter — ideal für Großfamilien und Gesellschaften
- Ferromagnetischer Gusseisenboden — perfekt für Induktion
- Induktionsgeeignet, grilltauglich und outdoor-sicher
- Spülmaschinenfest für einfache Reinigung
- Ohne PFAS — PFAS-frei
- Hergestellt in Deutschland

Die DT6 vereint traditionelles Handwerk mit moderner Küchentechnik — für anspruchsvolles Kochen überall.`,
    price: 169.99,
    oldPrice: 219.99,
    brand: 'Petromax',
    material: 'Emailliertes Gusseisen',
    dimensions: '32×21×13 cm, 7,0 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 7.5,
    badges: ['Made in Germany', 'PFAS-frei'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Petromax Dutch Oven DT6 Oval 7 L — Gusseisen, Induktion | NOVA INDUKT',
    metaDescription: 'Petromax Dutch Oven DT6 Oval — 7 Liter Gusseisen, voreingebrannt, induktionsgeeignet. PFAS-frei, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Petromax Dutch Oven DT6 — Oval',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'stash-cocotte-ronde-20cm',
    supplierSku: 'STB-COC-R20',
    nameDe: 'Staub Cocotte Ronde 20 cm',
    shortDescription: 'Kompakte runde Gusseisen-Cocotte — ideal für Einzelportionen und Beilagen',
    descriptionDe: `Die Staub Cocotte Ronde 20 cm ist die kompakte Lösung für kleinere Portionen, Beilagen oder spezielle Schmorgerichte. Aus emailliertem Gusseisen gefertigt, bietet sie die gleiche exzellente Wärmespeicherung wie große Cocottes — nur in handlicherem Format.

**Merkmale:**
- Emailliertes Gusseisen — gleichmäßige Wärmeverteilung
- Kompaktes Format — ideal für Einzelportionen und Beilagen
- Volumen: 2,2 Liter
- Markanter Deckel mit Noppen — Saftigkeitskreislauf
- Vollständig ofenfest und spülmaschinenfest
- Induktionsgeeignet
- Made in France

Die kleine Cocotte für große Wirkung — für anspruchsvolle Einzelportionen.`,
    price: 149.99,
    oldPrice: 189.99,
    brand: 'Staub',
    material: 'Emailliertes Gusseisen',
    dimensions: 'Ø 20 cm, 2,2 L',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 3.8,
    badges: ['Made in France', 'Kompakt'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Staub Cocotte Ronde 20 cm — Kompakte Gusseisen-Cocotte | NOVA INDUKT',
    metaDescription: 'Staub Cocotte Ronde 20 cm — kompakte Gusseisen-Cocotte, 2,2 L, Made in France. Induktionsgeeignet. Jetzt bei NOVA INDUKT.',
    categorySlug: 'formes-de-cuisson',
    folder: 'Staub Cocotte Ronde — 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Backformen (10 Produkte)')
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
    console.log('\n🎉 Batch terminé avec succès !')
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
