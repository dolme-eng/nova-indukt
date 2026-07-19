/**
 * NOVA INDUKT — Seed Catégorie 4 : Induktions-Zubehör (5 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-zubehoer.ts
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
  {
    slug: 'rosenstein-soehne-universal-adapterplatte-24cm',
    supplierSku: 'RS-ADAPT-24',
    sortOrder: 1,
    nameDe: 'Rosenstein & Söhne Universal-Adapterplatte 24 cm',
    shortDescription: 'Verwandelt jedes Kochgeschirr in Induktionsgeschirr',
    descriptionDe: `Mit der Universal-Adapterplatte von Rosenstein & Söhne (24 cm) können Sie Ihre geliebten, nicht magnetischen Töpfe und Pfannen endlich auf Ihrem neuen Induktionskochfeld verwenden!

**Merkmale:**
- Ermöglicht die Nutzung von Aluminium-, Kupfer-, Glas-, und Keramiktöpfen
- Hochwertiger Edelstahl mit wärmeleitendem Aluminiumkern
- Dicke: ca. 3-5 mm für optimale Hitzeverteilung
- Abnehmbarer Heber (Poignée) von 19,5 cm Länge, der beim Kochen kalt bleibt
- Erreicht 120°C in ca. 2 Minuten (max. 240°C)
- Spülmaschinengeeignet (nur die Platte, ohne Griff)

Ein absoluter Preis-Leistungs-Sieger (Note 1,2) für alle, die ihr altes Lieblingsgeschirr weiternutzen möchten.`,
    price: 14.99,
    oldPrice: 25.99,
    brand: 'Rosenstein & Söhne',
    material: 'Edelstahl ferromagnetisch / Aluminiumkern',
    dimensions: 'Ø 24 cm, Dicke 3-5 mm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 1.1,
    badges: ['Preis-Leistungs-Sieger', 'Mit abnehmbarem Griff'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Rosenstein & Söhne Induktions-Adapterplatte 24 cm | NOVA INDUKT',
    metaDescription: 'Universal-Adapterplatte für Induktion (24 cm) von Rosenstein & Söhne. Alu, Kupfer und Glas auf Induktion nutzen. Mit abnehmbarem Griff.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Rosenstein & Söhne — Universal-Adapterplatte Ø 24 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'rosenstein-soehne-universal-adapterplatte-20cm',
    supplierSku: 'RS-ADAPT-20',
    sortOrder: 2,
    nameDe: 'Rosenstein & Söhne Universal-Adapterplatte 20 cm',
    shortDescription: 'Der perfekte Induktionsadapter für kleinere Töpfe und Teekannen',
    descriptionDe: `Diese kompaktere Version (20 cm) der Rosenstein & Söhne Universal-Adapterplatte ist ideal, um kleinere nicht magnetische Töpfe, Pfännchen oder auch Teekannen auf Induktion zu verwenden.

**Merkmale:**
- Ermöglicht die Nutzung von Aluminium, Kupfer, Glas und Keramik
- Ferromagnetischer Edelstahl mit effizientem Aluminiumkern
- Inklusive abnehmbarem, kalt bleibendem Griff
- Temperatur bis 240°C, schnelle Erhitzung (120°C in 2 Min.)
- Spülmaschinengeeignet (Platte)

Hervorragendes Preis-Leistungs-Verhältnis für die alltäglichen kleinen Aufgaben in der Küche.`,
    price: 14.99,
    oldPrice: null,
    brand: 'Rosenstein & Söhne',
    material: 'Edelstahl ferromagnetisch / Aluminiumkern',
    dimensions: 'Ø 20 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Top Seller', 'Mit abnehmbarem Griff'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Rosenstein & Söhne Induktions-Adapterplatte 20 cm | NOVA INDUKT',
    metaDescription: 'Kompakte 20 cm Adapterplatte für Induktion. Ideal für Teekannen und kleine Töpfe. Ferromagnetischer Edelstahl mit Alukern.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Rosenstein & Söhne — Universal-Adapterplatte Ø 20 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'interkitchen-induktions-adapterplatte-20cm',
    supplierSku: 'INT-ADAPT-20',
    sortOrder: 3,
    nameDe: 'INTERKITCHEN Induktions-Adapterplatte 20 cm',
    shortDescription: 'Stabile, grifflose Induktions-Adapterplatte für exzellente Wärmeleitung',
    descriptionDe: `Die INTERKITCHEN Adapterplatte ist minimalistisch und funktionell: Sie verzichtet bewusst auf einen Griff und bietet dafür eine extrem flache und stabile Basis. 

**Merkmale:**
- Hervorragende Wärmeleitung für Aluminium, Kupfer, Keramik und Glas
- Ferromagnetischer Edelstahl (ca. 4 mm dick)
- Hitzebeständig bis 250°C
- Spülmaschinenfest

*Hinweis: Da die Platte keinen Griff besitzt, muss sie nach dem Erhitzen vorsichtig mit einem Topflappen oder einer Zange bewegt werden.*`,
    price: 19.49,
    oldPrice: null,
    brand: 'Interkitchen',
    material: 'Ferromagnetischer Edelstahl',
    dimensions: 'Ø 20 cm, Dicke 4 mm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Minimalistisches Design', 'Spülmaschinenfest'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'INTERKITCHEN Induktions-Adapterplatte 20 cm | NOVA INDUKT',
    metaDescription: 'Stabile INTERKITCHEN Induktions-Adapterplatte 20 cm. Extrem flaches Design ohne Griff für maximale Auflage und Hitzeverteilung.',
    categorySlug: 'induktions-zubehoer',
    folder: 'INTERKITCHEN — Induktions-Adapterplatte Ø 20 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'lukata-silikon-induktionskochfeld-schutzmatte',
    supplierSku: 'LUK-SILMAT-52',
    sortOrder: 4,
    nameDe: 'Lukata Silikon-Induktionskochfeld-Schutzmatte',
    shortDescription: 'Magnetische, hitzebeständige Schutzmatte gegen Kratzer und Schmutz',
    descriptionDe: `Verlängern Sie die Lebensdauer Ihres Induktionskochfeldes! Die Lukata Schutzmatte wird zwischen Herd und Topf gelegt. Dank ihrer magnetischen Eigenschaften haftet sie rutschfest auf dem Feld.

**Merkmale:**
- Schützt effektiv vor Kratzern, Flecken und Überkochen
- 100% hitzebeständiges Lebensmittelsilikon (bis 300°C)
- Magnetisch: perfekter Halt ohne Verrutschen
- Waschmaschinen- und spülmaschinengeeignet
- Kann auch als flexibler Untersetzer für heiße Töpfe verwendet werden

Ein unverzichtbares Zubehör für alle, die ihr Glasfeld makellos erhalten wollen.`,
    price: 10.99,
    oldPrice: null,
    brand: 'Lukata',
    material: 'Lebensmittelsilikon (magnetisch)',
    dimensions: '52 x 60 cm (Dicke 1,5-2 mm)',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Magnetisch', 'Hitzebeständig bis 300°C'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Lukata Silikon-Schutzmatte für Induktion | NOVA INDUKT',
    metaDescription: 'Magnetische Silikon-Schutzmatte für Induktionskochfelder von Lukata. Schützt vor Kratzern, rutschfest, hitzebeständig bis 300°C.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Lukata — Silikon Induktionskochfeld-Schutzmatte (Magnétique)',
    imageFiles: ['1.png', '2.png'],
  },
  {
    slug: 'sallys-induktionsmatte-oval',
    supplierSku: 'SAL-SILMAT-OV',
    sortOrder: 5,
    nameDe: 'Sallys Induktionsmatte Oval',
    shortDescription: 'Ovale Premium-Silikonmatte für optimalen Kochfeldschutz',
    descriptionDe: `Die beliebte ovale Induktionsmatte von Sallys Welt. Sie bietet zuverlässigen Schutz für Ihr Kochfeld und verhindert das Verrutschen von Töpfen und Pfannen beim Rühren.

**Merkmale:**
- Ovales Design, passend für viele Standard-Kochzonen
- Widerstandsfähiges Lebensmittelsilikon (bis 240°C)
- Anti-Rutsch-Effekt für sicheres Kochen
- Verhindert Mikrokratzer durch Salz oder Sand auf dem Glasfeld
- Spülmaschinenfest und leicht abwischbar

Bewährte Qualität für ein entspanntes und sicheres Kocherlebnis auf Induktion.`,
    price: 17.99,
    oldPrice: null,
    brand: 'Sallys',
    material: 'Silikon',
    dimensions: 'Oval',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.3,
    badges: ['Premium Qualität', 'Anti-Rutsch'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Sallys Induktionsmatte Oval | NOVA INDUKT',
    metaDescription: 'Ovale Induktionsmatte von Sallys Welt. Schützt das Glasfeld vor Kratzern, hitzebeständig bis 240°C, rutschfest.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Sallys — Induktionsmatte Oval',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'dietrix-kochschutzmatten-induktion-set',
    supplierSku: 'DIE-KOCHMAT-4',
    sortOrder: 6,
    nameDe: 'Dietrix Kochschutzmatten für Induktionskochfelder',
    shortDescription: 'Premium-Kochschutzmatten aus hochtemperaturbeständigem Silikon (4er-Set)',
    descriptionDe: `Die Premium-Kochschutzmatten von Dietrix sind speziell dafür entwickelt, direkt beim Kochen auf der Induktionsplatte verwendet zu werden. Die Wärme wird ohne nennenswerten Energieverlust direkt an das Kochgeschirr übertragen, während die empfindliche Glaskeramik vor Kratzern, Eingebranntem und Flecken geschützt bleibt.

**Set-Inhalt:**
- 2x Ø 20 cm Schutzmatte
- 2x Ø 26 cm Schutzmatte

**Merkmale:**
- Exklusiv für Induktionskochfelder geeignet (NICHT für herkömmliche Glaskeramik- oder Gaskochfelder)
- Hitzebeständig bis 240°C
- 100% rutschfest (rutscht auch bei heftigem Rühren nicht)
- Einfache Reinigung: spülmaschinenfest und flexibel
- Mit praktischem Loch zum Aufhängen

Schützen Sie Ihre teure Induktionsplatte effektiv und kochen Sie direkt auf den flexiblen Premium-Silikonmatten!`,
    price: 49.99,
    oldPrice: null,
    brand: 'Dietrix',
    material: 'Silikon',
    dimensions: 'Set: 2x Ø 20 cm + 2x Ø 26 cm, ca. 2 mm dick',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Kochschutzmatten Premium', 'Spülmaschinenfest', 'Hergestellt für Kochen'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Dietrix Kochschutzmatten Induktion 4er-Set | NOVA INDUKT',
    metaDescription: 'Premium-Kochschutzmatten von Dietrix für Induktionsplatten. 4er-Set (2x 20cm, 2x 26cm). Rutschfest, spülmaschinenfest, hitzebeständig bis 240°C.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Dietrix  Induktionsschutz.de  Kochschutzmatten Set (4-tlg.)',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'dr-beckmann-glaskeramikreiniger-putzstein',
    supplierSku: 'DB-PUTZ-250',
    sortOrder: 7,
    nameDe: 'Dr. Beckmann Glaskeramikreiniger Putzstein',
    shortDescription: 'Sehr ergiebiger, natürlicher Putzstein inkl. 2-Phasen-Spezialschwamm',
    descriptionDe: `Der Dr. Beckmann Glaskeramikreiniger Putzstein ist die Wunderwaffe gegen hartnäckige Verschmutzungen, Verkrustungen und Eingebranntes auf Induktions- und Ceranfeldern.

**Merkmale:**
- Basiert auf feinen, natürlichen Polierkörpern aus Aprikosenkernen
- Inklusive speziellem 2-Phasen-Reinigungsschwamm (schwarze Seite zum Reinigen, rote Seite zum Nachwischen)
- Wasser- und schmutzabweisender Perleffekt sorgt für langanhaltenden Glanz und verringert das Einbrennen
- Made in Germany (hergestellt von delta pronatura)
- Äußerst ergiebig und umweltschonend dank fester Konsistenz

Die feste Paste löst selbst extremste Verkrustungen mühelos ohne jegliche Kratzer auf der Glaskeramik!`,
    price: 3.29,
    oldPrice: null,
    brand: 'Dr. Beckmann',
    material: 'Putzstein (Feste Seife) + Schwamm',
    dimensions: '250 g',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.4,
    badges: ['Reiniger', 'Bestseller in Deutschland', 'Aprikosenkern-Polierkörper'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Dr. Beckmann Glaskeramik-Putzstein 250g | NOVA INDUKT',
    metaDescription: 'Dr. Beckmann Putzstein für Glaskeramik- und Induktionsfelder. Entfernt Eingebranntes kratzfrei. Inklusive zweiseitigem Schwamm. Made in Germany.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Dr. Beckmann — Glaskeramik-Putzstein 250 g',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'ceraclen-3in1-reiniger-pfleger',
    supplierSku: 'CER-3IN1-250',
    sortOrder: 8,
    nameDe: 'Ceraclen 3 in 1 Reiniger & Pfleger',
    shortDescription: 'Vergleich.org Platz 1 Testsieger — reinigt, poliert und schützt intensiv',
    descriptionDe: `Ceraclen 3 in 1 ist der unangefochtene Testsieger auf Vergleich.org für die regelmäßige Pflege von Glaskeramik- und Induktionskochfeldern. 

**Merkmale:**
- 3-in-1 Formel: reinigt gründlich, poliert sanft für Hochglanz und schützt die Oberfläche vor neuem Schmutz
- Hinterlässt einen unsichtbaren, hitzebeständigen Schutzfilm, der das Einbrennen von überkochenden Speisen (z.B. Zucker) verhindert
- Entfernt spielend Alltagsfett, Fingerabdrücke und leichte Kalkflecken
- Empfohlen für den täglichen Gebrauch nach dem Kochen

Die Profi-Pflege für Ihr Induktionsfeld, damit es auch nach Jahren noch aussieht wie am ersten Tag!`,
    price: 3.00,
    oldPrice: null,
    brand: 'Ceraclen',
    material: 'Flüssiger Glaskeramik-Reiniger',
    dimensions: '250 ml',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.4,
    badges: ['Platz 1 Vergleich.org', 'Testsieger', '3-in-1 Formel'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Ceraclen 3 in 1 Reiniger & Pfleger 250ml | NOVA INDUKT',
    metaDescription: 'Ceraclen 3-in-1 Glaskeramikreiniger. Reinigt, poliert und schützt mit speziellem Hitzeschutzfilm. Testsieger auf Vergleich.org.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Ceraclen — 3 in 1 Reiniger & Pfleger',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'siemens-kochfeldreiniger-glaskeramik-induktion',
    supplierSku: 'BSH-311499-250',
    sortOrder: 9,
    nameDe: 'Siemens Kochfeldreiniger für Glaskeramik, Induktion und Edelstahl',
    shortDescription: 'BSH Original-Reiniger für eine professionelle und schonende Pflege',
    descriptionDe: `Der originale BSH Siemens & Bosch Kochfeldreiniger bietet die bestmögliche Abstimmung auf Ihr hochwertiges Kochfeld. Seine Formel wurde vom Hersteller ausgiebig getestet und freigegeben.

**Merkmale:**
- Original BSH Hausgeräte Zubehör (Referenz 311499)
- Kraftvolles Lösen von hartnäckigem Schmutz, Fettspritzern und eingebrannten Flecken
- Speziell abgestimmt auf das Glas von Siemens, Bosch und Neff Induktionskochfeldern
- Verhindert abrasive Beschädigungen und Mikrokratzer durch den Verzicht auf aggressive Chemikalien

Vertrauen Sie dem Original des Herstellers für eine materialschonende, hocheffiziente Reinigung Ihrer Design-Küche.`,
    price: 13.90,
    oldPrice: 15.00,
    brand: 'Siemens',
    material: 'Flüssiger Spezialreiniger',
    dimensions: '250 ml Flasche mit Dosierspender',
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.4,
    badges: ['Original Siemens Zubehör', 'BSH Hersteller-Qualität', 'Reiniger Professionnel'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Siemens original BSH Kochfeldreiniger 250ml | NOVA INDUKT',
    metaDescription: 'Original BSH Siemens & Bosch Spezialreiniger für Glaskeramik, Induktion und Edelstahl. Schonende Intensivreinigung ohne Kratzer.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Siemens — Kochfeldreiniger (Original)',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'waermeverteiler-platte-simmerring-induktionsherd',
    supplierSku: 'WV-SIMMER-24',
    sortOrder: 10,
    nameDe: 'Wärmeverteiler-Platte / Simmerring für Induktionsherd',
    shortDescription: 'Diffusion gleichmäßiger Hitze für empfindliche Töpfe und schonendes Garen',
    descriptionDe: `Der Induktions-Simmerring (24 cm) dient als perfekter Hitzeverteiler für empfindliche Speisen wie Milch, Saucen, Schokolade oder für das extrem langsame Schmoren.

**Merkmale:**
- Verhindert das lokale Anbrennen von Speisen dank vollflächiger Hitzediffusion
- Kann als Wärmeverteiler-Platte, Überkochungsschutz oder auch als praktische Auftau-Wärmedämmplatte genutzt werden
- Robuster Edelstahl
- Spülmaschinenfest

Ideal für Schokolade, cremige Saucen und alle Gerichte, die eine absolut gleichmäßige Wärme ohne lokale Hotspots verlangen.`,
    price: 18.99,
    oldPrice: 27.12,
    brand: 'Simmerring',
    material: 'Edelstahl',
    dimensions: 'Ø 24 cm, Dicke ca. 3-5 mm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['Wärmeverteiler', 'Simmerring', 'Schutz vor Anbrennen'],
    rating: 4.1,
    reviewCount: 0,
    metaTitle: 'Induktions-Simmerring / Wärmeverteilerplatte Ø 24cm | NOVA INDUKT',
    metaDescription: 'Hitzeverteiler-Platte & Simmerring (24 cm) für Induktion. Verhindert das Anbrennen von Milch, Saucen und Schokolade. Edelstahl.',
    categorySlug: 'induktions-zubehoer',
    folder: 'Simmerring  Wärmeverteiler-Platte  Ø 24 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie 4 : Induktions-Zubehör (10 Produits)')
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
  console.log('📊 RÉSUMÉ BATCH ZUBEHÖR')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Catégorie Induktions-Zubehör terminée avec succès ! 5/5 produits en base.')
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
