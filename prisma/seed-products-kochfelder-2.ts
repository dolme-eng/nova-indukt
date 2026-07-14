/**
 * NOVA INDUKT — Seed Catégorie 5 : Induktionskochfelder & Herde (Batch 2 — 5 Produits)
 * Exécuter avec : npx tsx prisma/seed-products-kochfelder-2.ts
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
    slug: 'bora-professional-3-pkfi3-induktionskochfeld-kochfeldabzug',
    supplierSku: 'BOR-PROFI3-80',
    sortOrder: 6,
    nameDe: 'Bora Professional 3.0 PKFI3 Induktionskochfeld mit Kochfeldabzug',
    shortDescription: 'Premium 80 cm Induktionskochfeld mit integriertem Kochfeldabzug — kein Dunstabzug nötig. Made in Austria.',
    descriptionDe: `Das Bora Professional 3.0 PKFI3 ist die absolute Referenz auf dem deutschen Premium-Küchenmarkt. Dieses revolutionäre 80 cm Induktionskochfeld integriert ein leistungsstarkes Absaugsystem direkt in die Arbeitsplatte — eine Dunstabzugshaube wird vollständig überflüssig.

**Kochfeldabzug — Die Revolution in der modernen Küche:**
- Das Absaugsystem sitzt zentral im Kochfeld und zieht Dämpfe, Gerüche und Fette direkt am Entstehungsort ab.
- Bis zu 700 m³/h Absaugleistung — leise, effizient, unsichtbar.
- Keine Haube, die die Sicht verstellt: Das Ergebnis ist eine offene, luftige und designstarke Küche.

**Technische Highlights:**
- **4 Induktionskochzonen** mit je 17 Leistungsstufen
- **PowerBoost:** Maximale Heizleistung (7,4 kW) für blitzschnelles Aufheizen
- **Glaskeramik SCHOTT CERAN®:** Elegante, kratzfeste Oberfläche
- **Bedienung:** Kombinierter Touch-Control und Bora-Drehknopf — intuitiv und präzise
- **Timer & automatische Absaugung:** Das Kochfeld steuert den Lüfter vollautomatisch
- **Made in Austria:** Höchste Fertigungsqualität aus österreichischer Manufaktur

**Sicherheit:**
- Restwärmeanzeige für alle Zonen
- Kindersicherung
- Automatische Sicherheitsabschaltung

**Varianten:**
- PKFI3 (Edelstahl/Inox)
- PKFI3AB (All Black — vollständig mattschwarz)

Das Bora Professional 3.0 ist kein Kochfeld — es ist eine Küchen-Revolution. Die meistgekaufte und meistempfohlene Lösung für alle, die auf eine Dunstabzugshaube verzichten wollen.`,
    price: 2049.00,
    oldPrice: 3288.00,
    brand: 'Bora',
    material: 'Glaskeramik SCHOTT CERAN® / Edelstahl — Made in Austria',
    dimensions: '80 cm (800 x 520 x 200 mm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Kochfeldabzug integriert', 'Keine Haube nötig', 'Made in Austria', '17 Leistungsstufen'],
    rating: 4.8,
    reviewCount: 312,
    metaTitle: 'Bora Professional 3.0 PKFI3 Kochfeldabzug 80 cm | NOVA INDUKT',
    metaDescription: 'Bora Professional 3.0 PKFI3: 80 cm Induktionskochfeld mit integriertem Kochfeldabzug. Keine Dunstabzugshaube nötig. 700 m³/h, SCHOTT CERAN®, Made in Austria.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Bora Professional 3.0 — PKFI3 — 80 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'ikea-tillreda-induktionskochfeld-tragbar-2-zonen',
    supplierSku: 'IKEA-TILLREDA-2Z',
    sortOrder: 7,
    nameDe: 'IKEA TILLREDA Induktionskochfeld tragbar 2 Zonen',
    shortDescription: 'Tragbares 2-Zonen Induktionskochfeld — kompakt, leicht & günstig. Ideal für Camping, Studenten & Zweitküche.',
    descriptionDe: `Das IKEA TILLREDA ist der smarte Einstieg in die Welt der Induktions-Technologie. Dieses tragbare 2-Zonen-Kochfeld ist kompakt, erschwinglich und überall einsetzbar — von der Studentenwohnung über den Campingplatz bis zur Zweitküche beim Renovieren.

**Zwei unabhängige Kochzonen:**
- Zone 1: Ø 158 mm — 1,5 kW (ideal für kleine Töpfe)
- Zone 2: Ø 180 mm — 2,0 kW (für mittlere bis große Töpfe)

**Besondere Vorteile:**
- **Tragbar & leicht:** ~3,5 kg — einfach mitnehmen, überall aufstellen
- **Standardsteckdose:** Keine Sonderinstallation nötig — einfach einstecken und loslegen
- **Umschaltbarer Anschluss:** 10A-Modus (2,2 kW) für normale Steckdosen, 15A-Modus (3,5 kW) für mehr Leistung
- **9 Leistungsstufen** — feinfühlige Steuerung via Touch-Control
- **Skandinavisches Design:** Schlichtes Weiß, kompakte Form, passt überall hin

**Sicherheit:**
- Kindersicherung (Kindersicherungsverriegelung)
- Elektronisches Display für klare Anzeige

**Ideal für:**
- Studenten und WG-Bewohner
- Camping, Gartenhütte, Büroküche
- Küchenrenovierung (Zwischennutzung)
- Als günstiger Einstieg in die Induktions-Technologie

Unschlagbarer Preis-Leistungs-Maßstab — das beliebteste portable Induktionskochfeld in Deutschland.`,
    price: 79.00,
    oldPrice: null,
    brand: 'IKEA',
    material: 'Glaskeramik / Kunststoff-Gehäuse',
    dimensions: '60 x 36 x 6 cm — ~3,5 kg',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Tragbar', '2 Zonen', 'Standardsteckdose', 'Bestseller Camping'],
    rating: 4.3,
    reviewCount: 2841,
    metaTitle: 'IKEA TILLREDA Induktionskochfeld tragbar 2 Zonen | NOVA INDUKT',
    metaDescription: 'IKEA TILLREDA tragbares 2-Zonen Induktionskochfeld. 79€, leicht, kompakt. Ideal für Camping, Studenten, Zweitküche. Standardsteckdose, Kindersicherung.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'IKEA TILLREDA — Tragbar 2 Zonen',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'amzchef-fym35-s16-doppel-induktionskochplatte',
    supplierSku: 'AMZ-FYM35-2Z',
    sortOrder: 8,
    nameDe: 'AMZCHEF FYM35-S16 Doppel-Induktionskochplatte',
    shortDescription: 'Testsieger Welt.de 2026 — 2-Zonen Induktionskochplatte mit 6 Antirutschfüßen, Timer & 10 Leistungsstufen.',
    descriptionDe: `Das AMZCHEF FYM35-S16 ist der **Testsieger 2026 bei Welt.de** im Segment der tragbaren 2-Platten-Induktionskochfelder. Es überzeugt durch außergewöhnliche Stabilität, kompaktes Format und ein hervorragendes Preis-Leistungs-Verhältnis.

**Zwei leistungsstarke Kochzonen:**
- Zone 1: ~1,8 kW — ideal für mittlere Töpfe
- Zone 2: ~1,8 kW — für Bratpfannen und große Töpfe
- Gesamtleistung: ~3,5 kW

**Was das FYM35-S16 besonders macht:**
- **6 Antirutsch-Standfüße:** Außergewöhnlich stabile Standposition — kein Verrutschen, kein Wackeln
- **10 Leistungsstufen** mit präziser Touch-Control Bedienung
- **Integrierter Timer:** Zeitschaltuhr für automatisches Abschalten
- **10 Temperaturstufen:** Von sanftem Warmhalten bis zum Schnellkochen
- **LED-Display:** Klare, gut lesbare Anzeige aller Einstellungen

**Sicherheitsausstattung:**
- Kindersicherung (Tastensperre)
- Überhitzungsschutz mit automatischer Abschaltung
- Automatische Erkennung von Kochgeschirr (kein Strom ohne Topf)

**Kompakt & alltagstauglich:**
- Maße: 56,7 x 36,1 x 7 cm — passt auf jede Arbeitsplatte
- Gewicht: ~4 kg — leicht zu transportieren und zu verstauen
- Robustes Glaskeramik-Kochfeld in elegantem Schwarz

Testsieger der Kategorie "Induktionskochfeld 2 Platten" — Welt.de Vergleich 2026.`,
    price: 114.00,
    oldPrice: 159.00,
    brand: 'AMZCHEF',
    material: 'Glaskeramik / Edelstahl-Gehäuse',
    dimensions: '56,7 x 36,1 x 7 cm — ~4 kg',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Testsieger Welt.de 2026', '6 Antirutschfüße', 'Timer', '10 Stufen'],
    rating: 4.4,
    reviewCount: 1543,
    metaTitle: 'AMZCHEF FYM35-S16 Doppel-Induktionskochplatte | NOVA INDUKT',
    metaDescription: 'AMZCHEF FYM35-S16: Testsieger Welt.de 2026. 2-Zonen tragbare Induktionskochplatte, 3,5 kW, 6 Antirutschfüße, Timer, 10 Leistungsstufen. 114€.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'AMZCHEF FYM35-S16 — Doppel-Induktionskochplatte',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'miele-cs-7612-fl-smartline-induktionskochfeld-domino',
    supplierSku: 'MIE-CS7612-38',
    sortOrder: 9,
    nameDe: 'Miele CS 7612 FL SmartLine Induktionskochfeld',
    shortDescription: 'Luxus-Domino 38 cm Induktionsmodul mit PowerFlex & M Sense — kombinierbar in der Miele SmartLine/ProLine Modulserie.',
    descriptionDe: `Das Miele CS 7612 FL SmartLine ist das Meisterstück der modularen Küchentechnologie. Dieses 38 cm breite Induktions-Domino-Modul repräsentiert das Höchste, was deutsche Küchentechnik zu bieten hat.

**PowerFlex — Eine Zone für alle Topfgrößen:**
- Die einzige Kochzone ist als vollflexible **PowerFlex-Zone** ausgeführt, die sich automatisch jeder Topfgröße und -form anpasst.
- Optimale Energieverteilung: Das Kochfeld erkennt exakt die Auflagefläche Ihres Kochgeschirrs und aktiviert nur die notwendigen Induktionsspulen.
- Anschlusswert: 3,7 kW — kompakt und dennoch leistungsstark.

**SmartLine-Modulkonzept:**
- Kombinieren Sie dieses Modul mit anderen Miele SmartLine-Einheiten (Wok, Teppanyaki, Sous-Vide) für eine völlig individuelle, maßgeschneiderte Kochfeld-Konfiguration.
- **M Sense Ready:** Vollständige Kompatibilität mit dem intelligenten Miele M Sense-System für automatisierte Kochprogramme.
- Flächenbündige oder aufliegende Montage möglich (Einbautiefe ~55 mm).

**Miele-Qualität pur:**
- Glaskeramik SCHOTT CERAN® — kratzfest, elegant, leicht zu reinigen
- 9 Leistungsstufen mit präziser Touch-Steuerung
- **KeepWarm:** Hält fertige Speisen bei perfekter Temperatur
- **Timer:** Automatische Kochzeit-Steuerung
- **Restwärmeanzeige** und automatische Sicherheitsabschaltung
- Gefertigt in Deutschland — Miele-Qualitätsstandard

Für alle, die das Beste vom Besten möchten: Das Miele SmartLine-System ist die Krönung des modernen Induktionskochens.`,
    price: 1420.00,
    oldPrice: 1790.00,
    brand: 'Miele',
    material: 'Glaskeramik SCHOTT CERAN® — Made in Germany',
    dimensions: '38,2 x 52,4 cm (Domino-Modul)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['PowerFlex Zone', 'SmartLine Modul', 'M Sense Ready', 'Made in Germany'],
    rating: 4.7,
    reviewCount: 68,
    metaTitle: 'Miele CS 7612 FL SmartLine Induktions-Domino 38 cm | NOVA INDUKT',
    metaDescription: 'Miele CS 7612 FL SmartLine: 38 cm Domino Induktionsmodul mit PowerFlex, M Sense, KeepWarm. Kombinierbar mit Wok & Teppanyaki-Modulen. Made in Germany.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'Miele CS 7612 FL — SmartLine — 38 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
  {
    slug: 'aeg-ikb6431axb-autarkes-induktionskochfeld-60cm',
    supplierSku: 'AEG-IKB6431-60',
    sortOrder: 10,
    nameDe: 'AEG IKB6431AXB Autarkes Induktionskochfeld 60 cm',
    shortDescription: 'Empfehlung Chefkoch 2026 — 60 cm mit Power-Funktion, ovale Bräterzone & Hob2Hood Hotten-Automatik.',
    descriptionDe: `Das AEG IKB6431AXB ist die kluge Wahl für alle, die auf 60 cm maximale Funktionalität zum attraktiven Preis suchen. Von Chefkoch.de für 2026 als besondere Empfehlung ausgezeichnet, kombiniert es AEG-Ingenieurskunst mit einer beeindruckenden Ausstattungsliste.

**Vier Kochzonen — davon eine ovale Bräterzone:**
- Zone 1 (vorne links): Ø 14,5 cm — 1,4 kW
- Zone 2 (vorne rechts): Ø 21 cm — 2,2 kW — **ovale Bräterzone** für Bräter & Grillpfannen
- Zone 3 (hinten links): Ø 18 cm — 1,8 kW
- Zone 4 (hinten rechts): Ø 18 cm — 1,8 kW
- Gesamtanschlusswert: 7,35 kW

**Exklusive AEG-Funktionen:**
- **Power-Funktion:** Bringt 1 Liter Wasser in unter 2 Minuten zum Kochen — die schnellste Heizmethode im Segment.
- **Topferkennung:** Das Kochfeld erkennt automatisch den genauen Durchmesser Ihres Topfes und passt die Heizzone präzise an — kein Energieverlust.
- **Hob2Hood:** Revolutionäre automatische Verbindung mit einer AEG-kompatiblen Dunstabzugshaube — das Kochfeld steuert die Haube vollautomatisch nach Bedarf.
- **Warmhaltefunktion** auf allen Zonen
- **Timer** für alle Kochzonen unabhängig einstellbar

**Design & Verarbeitung:**
- Elegantes Schwarz mit umlaufendem Edelstahlrahmen
- Glaskeramik SCHOTT CERAN® — kratzfest und leicht zu reinigen
- Schlichtes Touch-Control Interface — sauber und übersichtlich

**Sicherheit:**
- Restwärmeanzeige für jede Zone
- Kindersicherung
- Automatische Sicherheitsabschaltung

Chefkoch.de Empfehlung 2026 — das Induktionskochfeld, das alles bietet, was man wirklich braucht.`,
    price: 320.00,
    oldPrice: 450.00,
    brand: 'AEG',
    material: 'Glaskeramik SCHOTT CERAN® / Edelstahlrahmen',
    dimensions: '60 cm (583 x 513 x 55 mm)',
    dishwasherSafe: false,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Chefkoch Empfehlung 2026', 'Power-Funktion', 'Hob2Hood', 'Bräterzone oval'],
    rating: 4.4,
    reviewCount: 876,
    metaTitle: 'AEG IKB6431AXB Autarkes Induktionskochfeld 60 cm | NOVA INDUKT',
    metaDescription: 'AEG IKB6431AXB: Chefkoch Empfehlung 2026. 60 cm Induktionskochfeld mit Power-Funktion (1L Wasser < 2 min), ovale Bräterzone, Hob2Hood, SCHOTT CERAN®.',
    categorySlug: 'induktionskochfelder-herde',
    folder: 'AEG IKB6431AXB — Autark — 60 cm',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Catégorie 5 : Induktionskochfelder & Herde (Batch 2 — 5 Produits)')
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
  console.log('📊 RÉSUMÉ BATCH KOCHFELDER — BATCH 2')
  console.log('═'.repeat(70))
  console.log(`  ✅ Créés       : ${created}`)
  console.log(`  ↻  Mis à jour  : ${updated}`)
  console.log(`  ❌ Erreurs     : ${errors}`)
  console.log('═'.repeat(70))

  if (errors === 0) {
    console.log('\n🎉 Batch 2 Kochfelder terminé avec succès ! 5/5 produits en base.')
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
