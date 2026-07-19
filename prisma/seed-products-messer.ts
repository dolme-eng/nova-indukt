/**
 * NOVA INDUKT — Seed Messer : 15 Kochmesser
 * Exécuter avec : npx tsx prisma/seed-products-messer.ts
 *
 * Catégories couvertes :
 *   - Kochmesser (Prods 1–15)
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
  // ZWILLING PRO S SERIE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'zwilling-pro-s-chefmesser-20cm',
    supplierSku: 'ZWI-PROS-CM20',
    nameDe: 'Zwilling Pro S Kochmesser 20 cm',
    shortDescription: 'Professionelles Kochmesser mit Friodur®-Klinge — Made in Germany',
    descriptionDe: `Das Zwilling Pro S Kochmesser 20 cm ist ein unverzichtbares Werkzeug für anspruchsvolle Hobbyköche und Profis. Die durch Friodur®-Verfahren vergütete Edelstahlklinge bietet eine außergewöhnliche Schnitthaltigkeit und Korrosionsbeständigkeit. Die ergonomische dreifach Nietverbindung sorgt für perfekte Balance und Sicherheit beim Schneiden.

**Merkmale:**
- Friodur® Edelstahlklinge — optimal gehärtet für langanhaltende Schärfe
- Ergonomischer polymergefüllter Griff für sicheren Halt
- Dreifach Nietverbindung für Langlebigkeit und Balance
- Klassische Solinger Klingengeometrie
- Hergestellt in Deutschland (SOLINGEN)
- Ideal für Gemüse, Fleisch und Kräuter
- Nicht spülmaschinenfest — Handwäsche empfohlen

Das Pro S Kochmesser ist die Wahl von Profis weltweit und steht für höchste deutsche Messerqualität.`,
    price: 99.99,
    oldPrice: 129.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '20 cm',
    weightKg: 0.2,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Friodur®', 'Ergonomischer Griff'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Zwilling Pro S Kochmesser 20 cm — Friodur® Edelstahl | NOVA INDUKT',
    metaDescription: 'Zwilling Pro S Kochmesser 20 cm mit Friodur®-Klinge, hergestellt in Solingen. Ergonomischer Griff, professionelle Qualität. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Pro S — Kochmesser 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-pro-s-chefmesser-26cm',
    supplierSku: 'ZWI-PROS-CM26',
    nameDe: 'Zwilling Pro S Kochmesser 26 cm',
    shortDescription: 'Großes Profi-Kochmesser mit 26 cm Klinge — für große Schneidearbeiten',
    descriptionDe: `Das Zwilling Pro S Kochmesser 26 cm bietet durch seine größere Klinge noch mehr Power und Effizienz bei umfangreichen Schneidearbeiten. Perfekt für Grobmengen, große Gemüsesortimente oder das präzise Zerteilen von Fleisch. Die bewährte Friodur®-Qualität und der ergonomische Griff setzen Maßstäbe.

**Merkmale:**
- 26 cm lange Friodur® Edelstahlklinge — ideal für Grobmengen
- Ergonomischer polymergefüllter Griff für ermüdungsfreies Arbeiten
- Dreifach Nietverbindung für maximale Stabilität
- Optimale Balance zwischen Klinge und Griff
- Hergestellt in Deutschland (SOLINGEN)
- Perfekt für große Küchen und professionelle Anwendungen
- Handwäsche empfohlen

Die größere Version des Pro S Kochmessers für alle, die mehr Klinge und mehr Leistung benötigen.`,
    price: 139.99,
    oldPrice: 179.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '26 cm',
    weightKg: 0.25,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Friodur®', 'Professional'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Zwilling Pro S Kochmesser 26 cm — Friodur® Profi-Messer | NOVA INDUKT',
    metaDescription: 'Zwilling Pro S Kochmesser 26 cm mit Friodur®-Klinge. Großes Profi-Messer, hergestellt in Solingen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Pro S — Kochmesser 26 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-pro-s-utility-messer-16cm',
    supplierSku: 'ZWI-PROS-UM16',
    nameDe: 'Zwilling Pro S Utility-Messer 16 cm',
    shortDescription: 'Vielseitiges Allzweckmesser — ideal für mittelgroße Schneidearbeiten',
    descriptionDe: `Das Zwilling Pro S Utility-Messer 16 cm ist die perfekte Brücke zwischen Kochmesser und Schärfmesser. Seine vielseitige Klinge eignet sich hervorragend für mittelgroße Schneidearbeiten wie das Schneiden von Obst, Gemüse oder kleineren Fleischstücken. Die bewährte Friodur®-Qualität garantiert lange Schärfe.

**Merkmale:**
- 16 cm vielseitige Friodur® Edelstahlklinge
- Ergonomischer Griff für sicheren Halt
- Ideal für Obst, Gemüse und kleinere Fleischarbeiten
- Dreifach Nietverbindung für Langlebigkeit
- Hergestellt in Deutschland (SOLINGEN)
- Perfektes Mittelmaß für den täglichen Einsatz
- Handwäsche empfohlen

Ein unverzichtbares Multitalent für jede Küche — weder zu groß noch zu klein.`,
    price: 69.99,
    oldPrice: 89.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '16 cm',
    weightKg: 0.15,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Vielseitig'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Zwilling Pro S Utility-Messer 16 cm — Vielseitiges Küchenmesser | NOVA INDUKT',
    metaDescription: 'Zwilling Pro S Utility-Messer 16 cm — vielseitiges Allzweckmesser mit Friodur®-Klinge. Hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Pro S — Utility-Messer 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-pro-s-schaerfmesser-18cm',
    supplierSku: 'ZWI-PROS-SM18',
    nameDe: 'Zwilling Pro S Schärfmesser 18 cm',
    shortDescription: 'Präzises Schärfmesser für Gemüse und feine Schneidearbeiten',
    descriptionDe: `Das Zwilling Pro S Schärfmesser 18 cm wurde für präzise Schälarbeiten und feines Schneiden entwickelt. Die schmale, spitze Klinge ermöglicht detailgetreue Arbeiten wie das Entkernen, Schälen oder das Herstellen feiner Julienne-Streifen. Die Friodur®-Qualität sorgt für langanhaltende Schärfe.

**Merkmale:**
- 18 cm schmale Friodur® Edelstahlklinge — ideal für Präzisionsarbeiten
- Spitze Klingenspitze für detailgetreue Schneidearbeiten
- Ergonomischer Griff für sicheren, kontrollierten Halt
- Hervorragend zum Entkernen, Schälen und Dekorieren
- Hergestellt in Deutschland (SOLINGEN)
- Perfekt für Salate, Desserts und Garnierungen
- Handwäsche empfohlen

Das Schärfmesser ergänzt die Pro S-Serie als Werkzeug für feine, präzise Arbeiten in der Küche.`,
    price: 59.99,
    oldPrice: 79.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '18 cm',
    weightKg: 0.15,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Schärfmesser'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Pro S Schärfmesser 18 cm — Präzises Küchenmesser | NOVA INDUKT',
    metaDescription: 'Zwilling Pro S Schärfmesser 18 cm — schmale Friodur®-Klinge für präzise Schälarbeiten. Hergestellt in Solingen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Pro S — Schärfmesser 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // MIYABI SERIE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'miyabi-5000mcd-gyuto-20cm',
    supplierSku: 'MIY-5KCD-GY20',
    nameDe: 'Miyabi 5000MCD Gyuto 20 cm',
    shortDescription: 'Japanisches Gyuto mit 63 HRC MicroCarbide-Stahl — Made in Seki/Japan',
    descriptionDe: `Das Miyabi 5000MCD Gyuto 20 cm ist ein Meisterwerk japanischer Messerherstellung. Die dreilagige Klinge aus MicroCarbide MC63-Stahl erreicht eine Härte von 63 HRC und bietet dadurch eine außergewöhnliche Schnitthaltigkeit. Die handgeschliffene Klinge mit 46 Schichten Damaszus-Stahl ist ein echtes Kunstwerk.

**Merkmale:**
- MicroCarbide MC63 Stahlklinge — 63 HRC für extrem lange Schärfe
- Dreilagige Konstruktion (San Mai) für optimale Schnitteigenschaften
- 46 Schichten Damaszus-Stahl als äußere Verkleidung
- Ergonomischer D-Form-Griff aus Pakkawood
- Handgeschliffen mit Honbazuke-Verfahren
- Hergestellt in Seki/Japan
- Nicht spülmaschinenfest

Das Miyabi 5000MCD Gyuto vereint traditionelle japanische Kunstfertigkeit mit modernster Stahltechnologie.`,
    price: 199.99,
    oldPrice: 249.99,
    brand: 'Miyabi',
    material: 'MicroCarbide MC63 Stahl',
    dimensions: '20 cm',
    weightKg: 0.18,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Seki/Japan', '63 HRC', 'Dreilagig'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Miyabi 5000MCD Gyuto 20 cm — Japanisches Kochmesser | NOVA INDUKT',
    metaDescription: 'Miyabi 5000MCD Gyuto 20 cm mit MicroCarbide MC63-Stahl, 63 HRC. Dreilagig, handgeschliffen, Made in Seki/Japan. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Miyabi 5000MCD — Gyuto 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'miyabi-5000mcd-santoku-18cm',
    supplierSku: 'MIY-5KCD-SN18',
    nameDe: 'Miyabi 5000MCD Santoku 18 cm',
    shortDescription: 'Japanisches Santoku mit 63 HRC — das universelle Drei-Tugenden-Messer',
    descriptionDe: `Das Miyabi 5000MCD Santoku 18 cm ist das japanische Pendant zum westlichen Kochmesser. „Santoku" bedeutet „drei Tugenden" und steht für das Schneiden von Fleisch, Fisch und Gemüse. Die MicroCarbide MC63-Stahlklinge mit 63 HRC bietet eine außergewöhnliche Schnitthaltigkeit und Präzision.

**Merkmale:**
- MicroCarbide MC63 Stahlklinge — 63 HRC für extrem lange Schärfe
- Dreilagige Konstruktion für optimale Schnitteigenschaften
- Flache Klinge ideal für das typische japanische Schneiden (Push-Cut)
- 46 Schichten Damaszus-Stahl als äußere Verkleidung
- Ergonomischer D-Form-Griff aus Pakkawood
- Hergestellt in Seki/Japan
- Nicht spülmaschinenfest

Das Santoku ist die japanische Alternative zum Kochmesser und überzeugt durch seine Vielseitigkeit.`,
    price: 179.99,
    oldPrice: 219.99,
    brand: 'Miyabi',
    material: 'MicroCarbide MC63 Stahl',
    dimensions: '18 cm',
    weightKg: 0.16,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Seki/Japan', '63 HRC', 'Santoku'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Miyabi 5000MCD Santoku 18 cm — Japanisches Santoku-Messer | NOVA INDUKT',
    metaDescription: 'Miyabi 5000MCD Santoku 18 cm mit MicroCarbide MC63-Stahl, 63 HRC. Dreilagig, Made in Seki/Japan. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Miyabi 5000MCD — Santoku 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'miyabi-birchwood-santoku-18cm',
    supplierSku: 'MIY-BIRCH-SN18',
    nameDe: 'Miyabi Birchwood Santoku 18 cm',
    shortDescription: 'Santoku mit elegantem Birkenholz-Griff — SG2 MicroCarbide Stahl',
    descriptionDe: `Das Miyabi Birchwood Santoku 18 cm verbindet höchste Schneidleistung mit natürlicher Eleganz. Die SG2 MicroCarbide-Stahlklinge mit 61 HRC bietet hervorragende Schnitthaltigkeit, während der Griff aus echtem Birkenholz einzigartige Warmheit und Komfort bietet. Jedes Messer ist aufgrund des natürlichen Materials ein Unikat.

**Merkmale:**
- SG2 MicroCarbide Stahlklinge — 61 HRC für lange Schärfe
- Handgeschliffene Klinge mit flacher japanischer Geometrie
- Griff aus echtem Birkenholz — jedes Messer ist ein Unikat
- Dreilagige Konstruktion für optimale Schnitteigenschaften
- Hergestellt in Seki/Japan
- Ideal für Gemüse, Fisch und Fleisch
- Handwäsche empfohlen

Die Birchwood-Serie vereint die Präzision japanischer Messerkunst mit der Wärme natürlicher Materialien.`,
    price: 169.99,
    oldPrice: 199.99,
    brand: 'Miyabi',
    material: 'SG2 MicroCarbide Stahl',
    dimensions: '18 cm',
    weightKg: 0.17,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Seki/Japan', 'Birkenholz-Griff', '61 HRC'],
    rating: 4.7,
    reviewCount: 0,
    metaTitle: 'Miyabi Birchwood Santoku 18 cm — SG2 Stahl mit Birkenholz | NOVA INDUKT',
    metaDescription: 'Miyabi Birchwood Santoku 18 cm mit SG2 MicroCarbide-Stahl und Birkenholz-Griff. 61 HRC, Made in Seki/Japan. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Miyabi Birchwood — Santoku 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // BOB KRAMER MEIJI SERIE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'bob-kramer-meiji-chefmesser-20cm',
    supplierSku: 'BKR-MEI-CM20',
    nameDe: 'Bob Kramer Meiji Kochmesser 20 cm',
    shortDescription: 'Premium-Kochmesser nach Bob Kramer Design — SG2 Stahl, Made in Seki/Japan',
    descriptionDe: `Das Bob Kramer Meiji Kochmesser 20 cm ist das Ergebnis der Zusammenarbeit zwischen dem renommierten Messermacher Bob Kramer und der japanischen Manufaktur Miyabi. Die SG2-Stahlklinge bietet eine außergewöhnliche Schnitthaltigkeit, während das charakteristische Kramer-Design für höchsten Komfort sorgt.

**Merkmale:**
- SG2 MicroCarbide Stahlklinge — höchste Schnitthaltigkeit
- Nach Bob Kramer Design gefertigt — ikonische Klingengeometrie
- Ergonomischer Griff mit 3 Micro-Bolzen für sicheren Halt
- Handgeschliffene Klinge mit 10-12° Schärfe pro Seite
- Hergestellt in Seki/Japan durch Miyabi
- Perfekt für anspruchsvolle Profis und ambitionierte Hobbyköche
- Nicht spülmaschinenfest

Bob Kramer ist einer der renommiertesten Messermacher der Welt — sein Meiji-Kochmesser ist eine Investition in höchste Küchenqualität.`,
    price: 349.99,
    oldPrice: 399.99,
    brand: 'Bob Kramer',
    material: 'SG2 Stahl',
    dimensions: '20 cm',
    weightKg: 0.22,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['By Bob Kramer', 'SG2 Stahl', 'Premium'],
    rating: 4.9,
    reviewCount: 0,
    metaTitle: 'Bob Kramer Meiji Kochmesser 20 cm — Premium SG2 Stahl | NOVA INDUKT',
    metaDescription: 'Bob Kramer Meiji Kochmesser 20 cm mit SG2-Stahl, handgeschliffen. Nach Bob Kramer Design, Made in Seki/Japan. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Bob Kramer Meiji — Kochmesser 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'bob-kramer-meiji-santoku-18cm',
    supplierSku: 'BKR-MEI-SN18',
    nameDe: 'Bob Kramer Meiji Santoku 18 cm',
    shortDescription: 'Premium-Santoku nach Bob Kramer Design — SG2 Stahl, Made in Seki/Japan',
    descriptionDe: `Das Bob Kramer Meiji Santoku 18 cm vereint die japanische Messertradition mit dem einzigartigen Design von Bob Kramer. Die SG2-Stahlklinge bietet eine außergewöhnliche Schärfe und Langlebigkeit, während die flache Klinge ideal für das japanische Schneidetechnik geeignet ist.

**Merkmale:**
- SG2 MicroCarbide Stahlklinge — höchste Schnitthaltigkeit
- Flache japanische Klingengeometrie für Push-Cut-Technik
- Ergonomischer Griff mit 3 Micro-Bolzen
- Handgeschliffene Klinge mit 10-12° Schärfe pro Seite
- Hergestellt in Seki/Japan durch Miyabi
- Ideal für Gemüse, Fisch und Fleisch
- Nicht spülmaschinenfest

Das Meiji Santoku ist die perfekte Wahl für alle, die westliches Design mit japanischer Präzision suchen.`,
    price: 299.99,
    oldPrice: 349.99,
    brand: 'Bob Kramer',
    material: 'SG2 Stahl',
    dimensions: '18 cm',
    weightKg: 0.19,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['By Bob Kramer', 'SG2 Stahl', 'Santoku'],
    rating: 4.8,
    reviewCount: 0,
    metaTitle: 'Bob Kramer Meiji Santoku 18 cm — Premium SG2 Stahl | NOVA INDUKT',
    metaDescription: 'Bob Kramer Meiji Santoku 18 cm mit SG2-Stahl, handgeschliffen. Nach Bob Kramer Design, Made in Seki/Japan. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Bob Kramer Meiji — Santoku 18 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // VICTORINOX SERIE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'victorinox-swiss-classic-kochmesser-20cm',
    supplierSku: 'VIX-SWCL-CM20',
    nameDe: 'Victorinox Swiss Classic Kochmesser 20 cm',
    shortDescription: 'Schweizer Bestseller — leichtes, spülmaschinenfestes Kochmesser zum Topp-Preis',
    descriptionDe: `Das Victorinox Swiss Classic Kochmesser 20 cm ist weltweit eines der meistverkauften Küchenmesser. Die hochwertige Edelstahlklinge bietet erstaunliche Schärfe und Schnitthaltigkeit zum unschlagbaren Preis-Leistungs-Verhältnis. Der leichte polymergefüllte Griff sorgt für Komfort bei längerem Einsatz.

**Merkmale:**
- Hochwertige Edelstahlklinge — überraschend scharf und langlebig
- Leichter polymergefüllter Griff für ermüdungsfreies Arbeiten
- Spülmaschinenfest — perfekt für den Alltag
- Klassisches Schweizer Design seit über 130 Jahren
- Hergestellt in der Schweiz
- Ideal für Einsteiger und preisbewusste Köche
- Garantie auf Material und Verarbeitung

Victorinox steht für schweizer Qualität zum fairen Preis — ein Küchenmesser für alle.`,
    price: 29.99,
    oldPrice: 39.99,
    brand: 'Victorinox',
    material: 'Edelstahl',
    dimensions: '20 cm',
    weightKg: 0.15,
    dishwasherSafe: true,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Schweizer Qualität', 'Spülmaschinenfest', 'Bestseller'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Victorinox Swiss Classic Kochmesser 20 cm — Schweizer Bestseller | NOVA INDUKT',
    metaDescription: 'Victorinox Swiss Classic Kochmesser 20 cm — spülmaschinenfest, schweizer Qualität. Bestseller zum fairen Preis. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Victorinox Swiss Classic — Kochmesser 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'victorinox-swiss-classic-brotmesser-26cm',
    supplierSku: 'VIX-SWCL-BM26',
    nameDe: 'Victorinox Swiss Classic Brotmesser 26 cm',
    shortDescription: 'Sägeklingen-Brotmesser — ideal für Brot, Brötchen und hartes Gebäck',
    descriptionDe: `Das Victorinox Swiss Classic Brotmesser 26 cm ist mit seiner gezackten Sägeklinge perfekt für das Schneiden von Brot, Brötchen und hartem Gebäck geeignet. Die speziell geschliffenen Zähne durchdringen spröde Brotkrusten, ohne das weiche Innere zu zerdrücken.

**Merkmale:**
- 26 cm gezackte Sägeklinge — ideal für Brot und Gebäck
- Spezielle Zähne durchdringen harte Brotkrusten
- Leichter polymergefüllter Griff für sicheren Halt
- Spülmaschinenfest — einfach zu reinigen
- Hergestellt in der Schweiz
- Perfekt für Brotback-Enthusiasten
- Klassisches Victorinox-Design

Ein unverzichtbares Messer für alle, die gerne frisches Brot backen und servieren.`,
    price: 34.99,
    oldPrice: 44.99,
    brand: 'Victorinox',
    material: 'Edelstahl',
    dimensions: '26 cm',
    weightKg: 0.17,
    dishwasherSafe: true,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Schweizer Qualität', 'Brotmesser', 'Sägeklinge'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'Victorinox Swiss Classic Brotmesser 26 cm — Sägeklinge | NOVA INDUKT',
    metaDescription: 'Victorinox Swiss Classic Brotmesser 26 cm mit Sägeklinge. Schweizer Qualität, spülmaschinenfest. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Victorinox Swiss Classic — Brotmesser 26 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'victorinox-fibrox-pro-chefmesser-20cm',
    supplierSku: 'VIX-FIBX-CM20',
    nameDe: 'Victorinox Fibrox Pro Kochmesser 20 cm',
    shortDescription: 'Professionelles Kochmesser mit Fibrox-Griff — Wahl der Profiköche',
    descriptionDe: `Das Victorinox Fibrox Pro Kochmesser 20 cm ist die Wahl von professionellen Köchen weltweit. Der rutschfeste Fibrox-Griff bietet selbst bei nassen Händen sicheren Halt, während die hochwertige Edelstahlklinge hervorragende Schneideigenschaften bietet. Das Verhältnis aus Preis und Leistung ist unschlagbar.

**Merkmale:**
- Hochwertige Edelstahlklinge — professionelle Schärfe
- Rutschfester Fibrox-Griff — sicher selbst bei Nässe
- Ergonomisches Design für ermüdungsfreies Arbeiten
- Ideal für den Profieinsatz in Gastronomie und Großküchen
- Spülmaschinenfest — einfach zu reinigen
- Hergestellt in der Schweiz
- Preis-Leistungs-Sieger im Profi-Segment

Das Fibrox Pro ist das am weitesten verbreitete Profi-Kochmesser der Welt — zu Recht.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Victorinox',
    material: 'Edelstahl',
    dimensions: '20 cm',
    weightKg: 0.18,
    dishwasherSafe: true,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Schweizer Qualität', 'Fibrox-Griff', 'Professionell'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Victorinox Fibrox Pro Kochmesser 20 cm — Profi-Kochmesser | NOVA INDUKT',
    metaDescription: 'Victorinox Fibrox Pro Kochmesser 20 cm mit Fibrox-Griff. Wahl der Profiköche, Schweizer Qualität. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Victorinox Fibrox Pro — Kochmesser 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // SETS UND ZUBEHÖR
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'zwilling-spirit-messerset-3-teilig',
    supplierSku: 'ZWI-SPIR-MS3',
    nameDe: 'Zwilling Spirit Messerset 3-teilig',
    shortDescription: 'Hochwertiges 3-teiliges Messerset mit Kochmesser, Universalmesser und Schärfmesser',
    descriptionDe: `Das Zwilling Spirit Messerset 3-teilig ist die ideale Grundausstattung für jede Küche. Es enthält die drei wichtigsten Messer: ein Kochmesser (20 cm) für große Schneidearbeiten, ein Universalmesser (13 cm) für mittelgroße Aufgaben und ein Schärfmesser (9 cm) für präzise Arbeiten. Alle Messer aus der Spirit-Serie bieten bewährte Zwilling-Qualität.

**Merkmale:**
- Kochmesser 20 cm — für Gemüse, Fleisch und Kräuter
- Universalmesser 13 cm — vielseitig für Obst und Gemüse
- Schärfmesser 9 cm — für Details und Schälarbeiten
- Friodur® Edelstahlklingen — langlebig und korrosionsbeständig
- Ergonomische Griffe für sicheren Halt
- Hergestellt in Deutschland
- Praktische Geschenkbox

Das Spirit Messerset ist das perfekte Geschenk für alle, die eine hochwertige Messerausstattung suchen.`,
    price: 149.99,
    oldPrice: 199.99,
    brand: 'Zwilling',
    material: 'Friodur® Edelstahl',
    dimensions: '3-teilig (Kochmesser 20cm, Universalmesser 13cm, Schärfmesser 9cm)',
    weightKg: 0.6,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', '3-teilig', 'Geschenkbox'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Zwilling Spirit Messerset 3-teilig — Kochmesser Set | NOVA INDUKT',
    metaDescription: 'Zwilling Spirit Messerset 3-teilig mit Kochmesser, Universalmesser und Schärfmesser. Made in Germany, Friodur®-Klingen. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Spirit — Messerset 3-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'miyabi-5000mcd-messerblock-7-teilig',
    supplierSku: 'MIY-5KCD-MB7',
    nameDe: 'Miyabi 5000MCD Messerblock 7-teilig',
    shortDescription: 'Premium 7-teiliges Messerset mit elegantem Messerblock — Made in Seki/Japan',
    descriptionDe: `Das Miyabi 5000MCD Messerblock 7-teilig ist die ultimative Messerausstattung für anspruchsvolle Küchen. Es enthält sieben hochwertige Messer aus MicroCarbide MC63-Stahl (63 HRC), die in einem eleganten Messerblock aus Ahornholz aufbewahrt werden. Jedes Messer ist handgeschliffen und bietet höchste Schnitthaltigkeit.

**Merkmale:**
- 7 hochwertige Messer aus MicroCarbide MC63-Stahl (63 HRC)
- Elegant Messerblock aus Ahornholz inklusive
- Kochmesser, Santoku, Brotmesser, Universalmesser, Schärfmesser und mehr
- Handgeschliffene Klingenen mit Honbazuke-Verfahren
- Dreilagige Konstruktion für optimale Schnitteigenschaften
- Hergestellt in Seki/Japan
- Perfektes Geschenk für anspruchsvolle Köche

Das Miyabi Messerblock ist eine Investition in höchste Küchenqualität und elegantes Design.`,
    price: 499.99,
    oldPrice: 599.99,
    brand: 'Miyabi',
    material: 'MicroCarbide MC63 Stahl',
    dimensions: '7-teilig mit Block',
    weightKg: 3.5,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Seki/Japan', '7-teilig', 'Messerblock inklusive'],
    rating: 4.9,
    reviewCount: 0,
    metaTitle: 'Miyabi 5000MCD Messerblock 7-teilig — Premium Messerset | NOVA INDUKT',
    metaDescription: 'Miyabi 5000MCD Messerblock 7-teilig mit MicroCarbide MC63-Stahl und Ahornholz-Block. 63 HRC, Made in Seki/Japan. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Miyabi 5000MCD — Messerblock 7-teilig',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-magnetic-messerschiene',
    supplierSku: 'ZWI-MAG-MS',
    nameDe: 'Zwilling Magnetic Messerschiene',
    shortDescription: 'Magnetische Messerschiene aus Edelstahl — für sichere und platzsparende Aufbewahrung',
    descriptionDe: `Die Zwilling Magnetic Messerschiene ist die elegante und platzsparende Lösung zur Aufbewahrung von Küchenmessern. Die starke Magnetschiene aus Edelstahl hält Messer sicher an der Wand und macht sie gleichzeitig schnell griffbereit. Die Montage ist einfach und platzsparend.

**Merkmale:**
- Starke Magnetschiene für sichere Messeraufbewahrung
- Hochwertiger Edelstahl — langlebig und pflegeleicht
- Einfache Wandmontage — inkl. Montagezubehör
- Platzsparend — ideal für kleine Küchen
- Messer sind schnell griffbereit
- Hergestellt in Deutschland
- Passend für alle gängigen Messergrößen

Die magnetische Messerschiene ist die moderne Alternative zum Messerblock — hygienisch, platzsparend und elegant.`,
    price: 79.99,
    oldPrice: 99.99,
    brand: 'Zwilling',
    material: 'Edelstahl/Magnet',
    dimensions: '45 cm',
    weightKg: 0.8,
    dishwasherSafe: false,
    inductionSafe: false,
    vatRatePercent: 19,
    priceIncludesVat: true,
    badges: ['Made in Germany', 'Magnetisch', 'Wandmontage'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Zwilling Magnetic Messerschiene 45 cm — Magnetische Aufbewahrung | NOVA INDUKT',
    metaDescription: 'Zwilling Magnetic Messerschiene 45 cm aus Edelstahl. Magnetisch, platzsparend, einfach zu montieren. Hergestellt in Deutschland. Jetzt bei NOVA INDUKT.',
    categorySlug: 'messer',
    folder: 'Zwilling Magnetic — Messerschiene 45 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Messer : Kochmesser (15 Produkte)')
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
    console.log('\n🎉 Seed Messer terminé avec succès !')
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
