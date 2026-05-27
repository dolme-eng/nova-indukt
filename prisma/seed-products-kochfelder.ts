/**
 * NOVA INDUKT — Seed Catégorie 5 : Induktionskochfelder & Herde (5 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-kochfelder.ts
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
    slug: 'bosch-serie-4-pif64rbb5e-induktionskochfeld',
    supplierSku: 'BOS-PIF64-60',
    sortOrder: 1,
    nameDe: 'Bosch Serie 4 PIF64RBB5E Induktionskochfeld',
    shortDescription: 'Autarkes Einbau-Induktionskochfeld (60 cm) mit Bräterzone — Stiftung Warentest Testsieger (Note 2,0)',
    descriptionDe: `Das Bosch Serie 4 PIF64RBB5E Induktionskochfeld ist der offizielle Testsieger bei Stiftung Warentest (11/2025, Note 2,0). Dieses autarke 60 cm Einbau-Kochfeld vereint erstklassige Bosch-Qualität mit moderner Funktionalität und hoher Sicherheit zu einem unschlagbaren Preis-Leistungs-Verhältnis.

**Kochzonen-Ausstattung:**
- Zone 1 (vorne links): Ø 14,5 cm — 1,4 kW (Boost 2,2 kW)
- Zone 2 (vorne rechts): Ø 21 cm — 2,2 kW (Boost 3,7 kW) mit **Bräterzone** (ovale Erweiterung für Bräter)
- Zone 3 (hinten links): Ø 18 cm — 1,8 kW (Boost 3,1 kW)
- Zone 4 (hinten rechts): Ø 18 cm — 1,8 kW (Boost 3,1 kW)

**Merkmale:**
- **TouchSelect:** Bequeme Leistungsregelung in 17 Stufen über die DirectTouch-Tastatur auf der Glaskeramik.
- **PowerBoost-Funktion:** Bis zu 50 % schnellere Hitzeentwicklung (z.B. für kochendes Wasser).
- **Made in Germany:** Gefertigt mit modernsten Präzisionsstandards in Deutschland.
- **SCHOTT CERAN®:** Strapazierfähige, elegante Glaskeramik-Oberfläche mit umlaufendem Edelstahlrahmen.
- **Sicherheitsfunktionen:** Kindersicherung, automatische Sicherheitsabschaltung, 2-stufige Restwärmeanzeige für jede Kochzone.

Die perfekte Wahl für alle, die ein zuverlässiges, sicheres und langlebiges Induktionskochfeld in Markenqualität suchen.`,
    price: 399.00,
    oldPrice: 1573.00,
    stock: 12,
    initialStock: 12,
    brand: 'Bosch',
    material: 'Glaskeramik SCHOTT CERAN® / Edelstahlrahmen',
    dimensions: '60 cm (583 x 513 x 51 mm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Stiftung Warentest Testsieger', 'Made in Germany', 'Bräterzone'],
    rating: 4.7,
    reviewCount: 1896,
    metaTitle: 'Bosch Serie 4 PIF64RBB5E Induktionskochfeld | NOVA INDUKT',
    metaDescription: 'Bosch Serie 4 PIF64RBB5E autarkes 60 cm Induktionskochfeld. Testsieger Stiftung Warentest (2,0). Ovale Bräterzone, TouchSelect, PowerBoost. Made in Germany.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Bosch PIF64RBB5E — Serie 4 — 60 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
  {
    slug: 'siemens-iq700-ex645lyc1e-induktionskochfeld',
    supplierSku: 'SIEM-EX645-60',
    sortOrder: 2,
    nameDe: 'Siemens iQ700 EX645LYC1E Induktionskochfeld',
    shortDescription: 'Autarkes Premium-Induktionskochfeld (60 cm) mit varioInduction Plus & Bratsensor Plus',
    descriptionDe: `Das Siemens iQ700 EX645LYC1E ist ein autarkes Premium-Induktionskochfeld (60 cm) der Luxusklasse. Ausgezeichnet mit dem Red Dot Design Award, bietet dieses Kochfeld grenzenlose Flexibilität beim Kochen und Braten auf höchstem technischem Niveau.

**varioInduction Plus & Flexibilität:**
- Dank der vollflexiblen varioInduction-Kochzonen können Sie Töpfe und Pfannen beliebig platzieren. Das Kochfeld erkennt die Größe, Anzahl und Form Ihrer Gefäße automatisch und schaltet Kochzonen zusammen.

**Merkmale:**
- **Bratsensor Plus:** Hält die Temperatur in der Pfanne nach dem Erhitzen vollautomatisch konstant (5 wählbare Stufen), um ein Anbrennen oder Überhitzen zu verhindern.
- **Dual lightSlider:** Der elegante, intuitive Touch-Slider leuchtet beim Einschalten auf und ermöglicht eine absolut präzise Steuerung mit 17 Stufen per Fingertipp.
- **powerMove Plus:** Teilt die Flex-Kochzone in drei verschiedene Temperaturzonen ein (Vorne: Kochen, Mitte: Köcheln, Hinten: Warmhalten) — aktivieren Sie Zonen einfach durch Verschieben des Topfes!
- **PowerBoost & PanBoost:** Maximale Power für blitzschnelles Aufheizen von Töpfen und Pfannen.
- **Made in Germany:** Hochwertige Schott Ceran® Glaskeramik mit elegantem Edelstahl-Flachrahmen.

Ein absolutes Highlight für anspruchsvolle Hobbyköche, die modernste Flexibilität und perfekte Brat-Ergebnisse suchen.`,
    price: 549.00,
    oldPrice: 2296.00,
    stock: 8,
    initialStock: 8,
    brand: 'Siemens',
    material: 'Glaskeramik SCHOTT CERAN® / Edelstahlrahmen',
    dimensions: '60 cm (583 x 513 x 55 mm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Red Dot Design Award', 'varioInduction Plus', 'Bratsensor Plus', 'Dual lightSlider'],
    rating: 4.8,
    reviewCount: 136,
    metaTitle: 'Siemens iQ700 EX645LYC1E Induktionskochfeld | NOVA INDUKT',
    metaDescription: 'Siemens iQ700 EX645LYC1E Premium 60 cm Induktionskochfeld. varioInduction flexible Zonen, Bratsensor Plus, Dual lightSlider Steuerung, powerMove Plus. Made in Germany.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Siemens EX645LYC1E — iQ700 — 60 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'siemens-iq300-eh801hfb1e-induktionskochfeld',
    supplierSku: 'SIEM-EH801-80',
    sortOrder: 3,
    nameDe: 'Siemens iQ300 EH801HFB1E Induktionskochfeld',
    shortDescription: 'Rahmenloses 80 cm Induktionskochfeld — flächenbündig, Home Connect & Pastastufe',
    descriptionDe: `Das Siemens iQ300 EH801HFB1E ist ein großzügiges 80 cm Induktionskochfeld für anspruchsvolle Küchendesigns. Es wird komplett flächenbündig in die Arbeitsplatte eingebaut (rahmenlos) und bietet modernste Funktionen wie Smart-Home-Anbindung über Home Connect und ein spezielles Nudelkochprogramm.

**Kochzonen & Power:**
- 4 Kochzonen mit großzügigen Abständen
- Inklusive großer **Bräterzone** (Ø 21 cm) für großes Kochgeschirr
- Anschlusswert 7,4 kW mit intelligentem Energieverteilungs-Manager

**Merkmale:**
- **Flächenbündiger Einbau (Rahmenlos):** Perfekte optische Integration in Arbeitsplatten aus Stein oder Granit.
- **Home Connect:** Steuern und überwachen Sie Ihr Kochfeld ganz bequem via Smartphone oder integrieren Sie es in Ihre Smart-Home-Szenarien.
- **TouchSlider-Steuerung:** Gradgenaue Temperaturregelung per direktem Antippen oder Entlangstreichen mit dem Finger.
- **Pastastufe & Koch-Features:** Automatisches Pastaprogramm (kocht Wasser auf und hält es exakt am Siedepunkt), Warmhaltefunktion, PowerBoost, QuickStart und ReStart.

Luxuriöses Design und viel Platz zum Kochen für große Familien und kulinarische Kreationen.`,
    price: 599.00,
    oldPrice: 900.00,
    stock: 10,
    initialStock: 10,
    brand: 'Siemens',
    material: 'Glaskeramik SCHOTT CERAN® / Rahmenlos',
    dimensions: '80 cm (792 x 512 x 56 mm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['flächenbündig rahmenlos', 'Home Connect Smart', 'TouchSlider', 'Pastastufe'],
    rating: 4.5,
    reviewCount: 42,
    metaTitle: 'Siemens iQ300 EH801HFB1E 80 cm Kochfeld | NOVA INDUKT',
    metaDescription: 'Siemens iQ300 EH801HFB1E flächenbündiges 80 cm Induktionskochfeld. Rahmenloses Design, Home Connect Smart Control, TouchSlider, Nudelstufe. Made in Germany.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Siemens EH801HFB1E — iQ300 — 80 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'neff-t58tt20n0-flexinduction-induktionskochfeld',
    supplierSku: 'NEF-T58TT-80',
    sortOrder: 4,
    nameDe: 'Neff T58TT20N0 (TTT5820N) Induktionskochfeld',
    shortDescription: 'Luxus-Induktionskochfeld (80 cm) mit FlexInduction & magnetischer TwistPad-Bedienung',
    descriptionDe: `Das Neff T58TT20N0 ist das absolute Highlight für Design- und Komfort-Liebhaber. Dieses 80 cm breite Einbau-Kochfeld kombiniert zwei vollflexible FlexInduction-Zonen mit dem genialen, einzigartigen Neff TwistPad — einer abnehmbaren, magnetischen Einknopf-Bedienung.

**TwistPad® — Die geniale Innovation von Neff:**
- Die Steuerung erfolgt über einen eleganten Edelstahl-Bedienknopf, der magnetisch auf dem Kochfeld haftet. Durch einfaches Antippen wählen Sie die Kochzone und durch Drehen die exakte Leistungsstufe. Zur Sicherheit (Kindersicherung) oder zum schnellen Abwischen (**Wischschutzfunktion**) nehmen Sie den Knopf einfach ab!

**FlexInduction & Kochzonen:**
- Zwei große, flexible Zonen links und rechts erkennen die Größe Ihrer Töpfe und Pfannen selbstständig und verbinden sich zu einer riesigen Fläche. 
- Zusätzlich steht eine klassische runde 21 cm Bräterzone in der Mitte zur Verfügung.

**Merkmale:**
- Hocheffiziente Induktionstechnologie mit PowerBoost
- SCHOTT CERAN® Glaskeramik mit edlem Edelstahlrahmen
- Warmhaltefunktion, Timer, Kindersicherung und Sicherheitsabschaltung

Erleben Sie das intuitivste und spielerischste Kocherlebnis mit der legendären TwistPad-Steuerung von Neff.`,
    price: 799.00,
    oldPrice: 1215.00,
    stock: 5,
    initialStock: 5,
    brand: 'Neff',
    material: 'Glaskeramik SCHOTT CERAN® / Edelstahlrahmen',
    dimensions: '80 cm (Edelstahl-Flachrahmen)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['TwistPad® Magnetknopf', 'FlexInduction', 'Wischschutz', 'Premium 80 cm'],
    rating: 4.6,
    reviewCount: 95,
    metaTitle: 'Neff T58TT20N0 FlexInduction 80 cm mit TwistPad | NOVA INDUKT',
    metaDescription: 'Neff T58TT20N0 80 cm Premium Induktionskochfeld. TwistPad magnetische Steuerung, FlexInduction, Wischschutzfunktion, Edelstahlrahmen. Made in Germany.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Neff T58TT20N0 — TTT5820N — 80 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'siemens-iq700-ex975lxc1e-induktionskochfeld',
    supplierSku: 'SIEM-EX975-90',
    sortOrder: 5,
    nameDe: 'Siemens iQ700 EX975LXC1E Induktionskochfeld',
    shortDescription: 'Gigantisches 90 cm Premium-Kochfeld mit varioInduction Plus, Home Connect & Bratsensor',
    descriptionDe: `Das Siemens iQ700 EX975LXC1E ist das ultimative Flaggschiff unter den Induktionskochfeldern. Mit einer gigantischen Breite von 90 cm bietet es unbegrenzten Platz für ambitionierte Menüs, große Familienfeste und den Einsatz von extragroßem Kochgeschirr auf insgesamt 5 Kochzonen.

**varioInduction Plus — Maximale Flexibilität auf 90 cm:**
- Gleich drei vollflexible Vario-Zonen passen sich automatisch jeder Topfform und -größe an. Kochen Sie mit mehreren Pfannen, Brätern und Töpfen gleichzeitig, ohne an starre Zonen gebunden zu sein.

**Merkmale:**
- **Bratsensor Plus:** Garantiert perfektes Anbraten ohne Verbrennen auf 5 Temperaturstufen.
- **Dual lightSlider:** Die illuminierte Slider-Steuerung ermöglicht ein gradgenaues Einstellen aller Zonen.
- **Home Connect:** Vollwertige Smart-Home Anbindung (Kochfeld-Dunstabzugshaube-Steuerung, App-Kontrolle, Updates).
- **powerMove Plus:** Intuitive Hitzezonen-Steuerung durch einfaches Verschieben des Kochgeschirrs.
- **Flachrahmen-Design:** Edles Edelstahl-Rahmendesign mit SCHOTT CERAN® Glaskeramik.

Das absolute Traum-Kochfeld für jede Luxus-Küche — unschlagbar in Platz, Leistung und smarter Ausstattung.`,
    price: 849.00,
    oldPrice: 2800.00,
    stock: 4,
    initialStock: 4,
    brand: 'Siemens',
    material: 'Glaskeramik SCHOTT CERAN® / Edelstahlrahmen',
    dimensions: '90 cm Premium-Breite',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['varioInduction Plus', 'Bratsensor Plus', 'Home Connect Smart', 'Illuminierter lightSlider'],
    rating: 4.7,
    reviewCount: 104,
    metaTitle: 'Siemens iQ700 EX975LXC1E 90 cm Premium Kochfeld | NOVA INDUKT',
    metaDescription: 'Siemens iQ700 EX975LXC1E Luxus 90 cm Induktionskochfeld. varioInduction Plus 3 Flexzonen, Bratsensor Plus, Home Connect, Dual lightSlider. Made in Germany.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Siemens EX975LXC1E — iQ700 — 90 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie 5 : Induktionskochfelder & Herde (5 Produits)')
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
            stock: p.stock,
            brand: p.brand,
            material: p.material,
            dimensions: p.dimensions,
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
            stock: p.stock,
            initialStock: p.initialStock,
            brand: p.brand,
            material: p.material,
            dimensions: p.dimensions,
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
  console.log('📊 RÉSUMÉ BATCH KOCHFELDER')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Catégorie Induktionskochfelder & Herde terminée avec succès ! 5/5 produits en base.')
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
