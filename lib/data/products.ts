import { stockImagePair } from './product-media'

function stockPair(category: string, seed: number): string[] {
  const [a, b] = stockImagePair(category, seed)
  return [a, b]
}

export interface Product {
  id: string
  slug: string
  name: { de: string }
  category: string
  /** Brutto-Endpreis für Endkunden (Standard), sofern `priceIncludesVat !== false`. */
  price: number
  oldPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  badges?: ('premium' | 'bestseller' | 'new')[]
  description: { de: string }
  shortDescription: { de: string }
  specs: {
    material: string
    dimensions: string
    weight: string
    dishwasher: boolean
    induction: boolean
  }
  /** GTIN-13 / EAN – nur echte Lieferanten-Codes. */
  ean?: string
  /** Markenname laut Lieferant. */
  brand?: string
  /** Lieferanten-Artikelnummer / Hersteller-SKU. */
  supplierSku?: string
  /** `true` (Standard): `price` ist inkl. MwSt. */
  priceIncludesVat?: boolean
  /** z. B. 19 für DE */
  vatRatePercent?: number
  /** Freitext: Lieferzeit etc. */
  deliveryNote?: string
}

export interface Category {
  id: string
  name: { de: string }
  image: string
  count: number
}

export interface BlogPost {
  id: string
  slug: string
  title: { de: string }
  excerpt: { de: string }
  image: string
  date: string
  readTime: string
  category: string
  author: string
}

const p = (folder: string, file: string, category?: string, productName?: string) => {
  // If we have a category and product name, try to find the real image in Products folder
  if (category && productName) {
    const categoryMap: Record<string, string> = {
      'kochen': 'Kochen & Braten',
      'vorbereitung': 'Vorbereitung',
      'zubehoer': 'Küchenzubehör',
      'tischaccessoires': 'Tisch & Servier'
    }
    const realCategory = categoryMap[category]
    if (realCategory) {
      const safeProductName = productName
        .replace(/\s\/\s/g, '  ')
        .replace(/[<>:"/\\|?*]/g, ' ')
        .trim()
      // In a real environment we would check if file exists, but here we'll assume 
      // if we're calling with these params, we want to try the real path first.
      // The user has added real images to these folders.
      return `/images/products/Products/${realCategory}/${safeProductName}/${file}`
    }
  }

  // Fallback if images don't exist yet - using Unsplash for missing assets
  if (file === 'main.jpg') return `https://images.unsplash.com/photo-1556910103-1c02745aae4d?fm=jpg&q=80&w=900`
  if (file === 'detail.jpg') return `https://images.unsplash.com/photo-1586201375761-83865001e31c?fm=jpg&q=80&w=900`
  if (file === 'lifestyle.jpg') return `https://images.unsplash.com/photo-1504674900247-0877df9cc836?fm=jpg&q=80&w=900`
  return `/images/products/${folder}/${file}`
}

const baseProducts: Product[] = [
  // 1 — WMF Premium One Topfset 5-teilig
  {
    id: 'wmf-ps-500', slug: 'wmf-premium-one-topfset-5-teilig',
    name: { de: 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl' },
    category: 'kochen', price: 449, oldPrice: 579,
    images: [
      p('wmf-topfset-5teilig', '71UtVphhaOL._AC_SY300_SX300_QL70_ML2_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl'),
      p('wmf-topfset-5teilig', '61pwL2eCmiL._AC_SX522_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl'),
      p('wmf-topfset-5teilig', '71oQfJ2C9ZL._AC_SX522_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl'),
      p('wmf-topfset-5teilig', '71TLUVMXrkL._AC_SX522_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl')
    ],
    rating: 4.8, reviewCount: 1247, stock: 12, badges: ['premium', 'bestseller'],
    description: { de: 'Das WMF Premium One Topfset 5-teilig aus Cromargan® Edelstahl 18/10 mit patentiertem TransTherm®-Allherdboden für alle Herdarten inkl. Induktion. Enthält: Stielkasserolle 16 cm, Kochtopf 20 cm, Kochtopf 24 cm, Kochtopf 28 cm und Bratenstopf 24 cm mit Glasdeckel. Cool+ Griff-Technologie verhindert Wärmeübertragung.' },
    shortDescription: { de: 'Cromargan® 18/10 + Cool+-Griffe – für alle Herdarten inkl. Induktion' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '16–28 cm, 5-teilig', weight: '5,2 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530607907', supplierSku: 'WMF-07-2918-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 2 — Le Creuset Signature Braeter 26 cm
  {
    id: 'lc-do-260', slug: 'le-creuset-braeter-gusseisen-26cm',
    name: { de: 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L' },
    category: 'kochen', price: 199, oldPrice: 269,
    images: [
      p('le-creuset-braeter-26cm', '51hEr8D8ZAL._AC_SX569_.jpg', 'kochen', 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L'),
      p('le-creuset-braeter-26cm', '61Sm8j-GDsL._AC_SX569_.jpg', 'kochen', 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L'),
      p('le-creuset-braeter-26cm', '61ddNXF4mcL._AC_SX569_.jpg', 'kochen', 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L'),
      p('le-creuset-braeter-26cm', '61nAWYmlEzL._AC_SX569_.jpg', 'kochen', 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L'),
      p('le-creuset-braeter-26cm', '711C1CXdyZL._AC_SX569_.jpg', 'kochen', 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L')
    ],
    rating: 4.9, reviewCount: 3821, stock: 8, badges: ['premium', 'bestseller'],
    description: { de: 'Der Le Creuset Signature Bräter aus emailliertem Gusseisen – das ikonische Kochgeschirr für Schmorgerichte, Suppen und Brot. Gleichmäßige Wärmeverteilung durch massives Gusseisen, ofengeeignet bis 260 °C, induktionsgeeignet. Farbe Marseille.' },
    shortDescription: { de: 'Das ikonische Gusseisen-Original für perfekte Schmorgerichte' },
    specs: { material: 'Emailliertes Gusseisen', dimensions: '26 cm Ø, 5,3 L', weight: '6,5 kg', dishwasher: false, induction: true },
    brand: 'Le Creuset', ean: '0024147194566', supplierSku: 'LC-LS2501-2667', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 3 — Tefal Jamie Oliver Bratpfanne 28 cm
  {
    id: 'tf-kp-280', slug: 'tefal-jamie-oliver-bratpfanne-keramik-28cm',
    name: { de: 'Tefal Jamie Oliver Bratpfanne 28 cm – Mineralkeramik, Induktion' },
    category: 'kochen', price: 39, oldPrice: 54,
    images: [
      p('tefal-pfanne-keramik-28cm', '71Tg6Uu0lFL._AC_SX569_.jpg', 'kochen', 'Tefal Jamie Oliver Bratpfanne 28 cm – Mineralkeramik, Induktion'),
      p('tefal-pfanne-keramik-28cm', '61L+LztOXqL._AC_SX569_.jpg', 'kochen', 'Tefal Jamie Oliver Bratpfanne 28 cm – Mineralkeramik, Induktion')
    ],
    rating: 4.6, reviewCount: 892, stock: 28, badges: ['new'],
    description: { de: '3-lagige PFOA-freie Mineralkeramik-Antihaftbeschichtung. Thermo-Signal zeigt optimale Aufheiztemperatur. Verstärkter Induktionsboden, backofengeeignet bis 175 °C, spülmaschinenfest. Offizielle Jamie Oliver Kollektion.' },
    shortDescription: { de: 'Jamie Oliver Edition – PFOA-frei, Thermo-Signal, Induktion' },
    specs: { material: 'Aluminium + Mineralkeramik 3-lagig', dimensions: '28 cm Ø', weight: '1,2 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430298412', supplierSku: 'TF-H9120644', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 4 — Lodge Gusseisen-Grillpfanne 26 cm
  {
    id: 'lo-gp-260', slug: 'lodge-gusseisen-grillpfanne-26cm',
    name: { de: 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA' },
    category: 'kochen', price: 39, oldPrice: 49,
    images: [
      p('lodge-grillpfanne-26cm', '5171PN2riwL._AC_SX300_SY300_QL70_ML2_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA'),
      p('lodge-grillpfanne-26cm', '716k++TB6GL._AC_SX569_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA'),
      p('lodge-grillpfanne-26cm', '71dwlCyCmzL._AC_SX569_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA'),
      p('lodge-grillpfanne-26cm', '71kjKYi1dOL._AC_SX569_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA')
    ],
    rating: 4.7, reviewCount: 5634, stock: 19, badges: ['bestseller'],
    description: { de: 'Das Original aus den USA seit 1896. Pre-Seasoned mit 100% Pflanzenöl. Tiefe Rippen für authentische Grillstreifen. Für alle Herdarten, Lagerfeuer und Backofen.' },
    shortDescription: { de: 'Das Original seit 1896 – Pre-Seasoned, für alle Herdarten' },
    specs: { material: 'Gusseisen, eingebrannt', dimensions: '26 cm Ø', weight: '2,7 kg', dishwasher: false, induction: true },
    brand: 'Lodge', ean: '0076501003408', supplierSku: 'LODGE-L8GP3', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 5 — WMF Edelstahl-Dampfgarer 24 cm
  {
    id: 'wmf-sp-240', slug: 'wmf-edelstahl-dampfgarer-24cm-3-einsaetze',
    name: { de: 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion' },
    category: 'kochen', price: 129, oldPrice: 159,
    images: [
      p('wmf-dampfgarer-3etagen', '1.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '2.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '51ND+e2RzwL._AC_SL1000_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '618YUxkUrZL._AC_SX569_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '61B1qrxtuPL._AC_SL1500_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '61MqhhlHcPL._AC_SL1500_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '71HEtQXgiEL._AC_SX569_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '71W0MGP55lL._AC_SX569_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '81-dZbmhlCL._AC_SX569_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '813T1oqVECL._AC_SX569_.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion'),
      p('wmf-dampfgarer-3etagen', '87.jpg', 'kochen', 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion')
    ],
    rating: 4.6, reviewCount: 327, stock: 11, badges: ['new'],
    description: { de: 'Auf bis zu 3 Ebenen gleichzeitig gesund garen. WMF TransTherm®-Boden für alle Herdarten inkl. Induktion. Glasdeckel, Wasserpegelmessung. Ideal für Gemüse, Fisch, Reis und Dim Sum.' },
    shortDescription: { de: 'Vitaminschonendes Dampfgaren auf 3 Ebenen – WMF TransTherm®' },
    specs: { material: 'Edelstahl 18/10, Glas', dimensions: '24 cm Ø, 3 Einsätze', weight: '3,4 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530729821', supplierSku: 'WMF-07-2826-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 6 — Ken Hom Performance Wok 32 cm
  {
    id: 'kh-wok-320', slug: 'ken-hom-performance-wok-32cm-carbonstahl',
    name: { de: 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion' },
    category: 'kochen', price: 45, oldPrice: 59,
    images: [
      p('ken-hom-wok-32cm', '61E2NQ6G0VL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '61bRWcK2QZL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '71XdmMC8NOL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '81+vMZ+TGzL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '81nLQSZtWcS._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion')
    ],
    rating: 4.5, reviewCount: 1189, stock: 22, badges: ['bestseller'],
    description: { de: 'Empfohlen von TV-Koch Ken Hom. Carbonstahl für schnelle, gleichmäßige Wärmeverteilung. Hartverchromter Phenolharzgriff mit Edelstahlstütze. Für alle Herdarten inkl. Induktion.' },
    shortDescription: { de: 'Von TV-Koch Ken Hom empfohlen – authentisches Wok-Erlebnis' },
    specs: { material: 'Carbonstahl', dimensions: '32 cm Ø', weight: '1,8 kg', dishwasher: false, induction: true },
    brand: 'Ken Hom', ean: '5028921961625', supplierSku: 'KH-KH416032', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 7 — ZWILLING Pro Messerset 6-teilig
  {
    id: 'zw-ks-600', slug: 'zwilling-pro-messerset-6-teilig',
    name: { de: 'ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock' },
    category: 'vorbereitung', price: 289, oldPrice: 389,
    images: [p('zwilling-pro-messerset-6tlg','71aiw8iN3kL._AC_SX569_.jpg','vorbereitung','ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock'), p('zwilling-pro-messerset-6tlg','811SXk6HlHL._AC_SX569_.jpg','vorbereitung','ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock'), p('zwilling-pro-messerset-6tlg','81QEQWeqrXL._AC_SX569_.jpg','vorbereitung','ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock')],
    rating: 4.8, reviewCount: 2156, stock: 7, badges: ['premium'],
    description: { de: '6 Profi-Messer aus eisgehärtetem Friodur®-Stahl, hergestellt in Solingen. Kochmesser 20 cm, Santoku 18 cm, Brotmesser 20 cm, Fleischmesser 20 cm, Gemüsemesser 13 cm, Schälmesser 10 cm. Inkl. Bambusblock.' },
    shortDescription: { de: 'Made in Solingen – Friodur® Präzision für Profi-Köche' },
    specs: { material: 'Friodur® Spezialstahl, 57 HRC', dimensions: '10–20 cm Klingen', weight: '2,4 kg', dishwasher: false, induction: false },
    brand: 'ZWILLING', ean: '4009839417146', supplierSku: 'ZWILLING-38430-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 8 — Miyabi 5000MCD Santoku 17 cm
  {
    id: 'my-km-170', slug: 'miyabi-5000mcd-santoku-17cm-damast',
    name: { de: 'Miyabi 5000MCD Santoku 17 cm – 63 Lagen Damast, VG-10 Kern' },
    category: 'vorbereitung', price: 249, oldPrice: 329,
    images: [p('miyabi-santoku-17cm','71AkQtKc6LL._AC_SX569_.jpg','vorbereitung','Miyabi 5000MCD Santoku 17 cm – 63 Lagen Damast, VG-10 Kern'), p('miyabi-santoku-17cm','71oPsOVt6RL._AC_SX569_.jpg','vorbereitung','Miyabi 5000MCD Santoku 17 cm – 63 Lagen Damast, VG-10 Kern')],
    rating: 4.9, reviewCount: 743, stock: 14, badges: ['premium', 'bestseller'],
    description: { de: '63 Lagen Damaszener Stahl mit VG-10 Kern (63 HRC). Handgeschärft nach Honbazuke-Verfahren auf 9,5–12°. Hammerschlag-Oberfläche (Tsuchime) für optimale Antihafteigenschaften. Packka-Holzgriff mit Messingnieten.' },
    shortDescription: { de: '63 Lagen Damast, VG-10 Kern – handgeschärft auf 9,5°' },
    specs: { material: '63-Lagen Damast, VG-10 Kern (63 HRC)', dimensions: '17 cm Klinge', weight: '185 g', dishwasher: false, induction: false },
    brand: 'Miyabi', ean: '4009839402068', supplierSku: 'MIYABI-34373-171', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 9 — Totally Bamboo Schneidebrett Set 3-teilig
  {
    id: 'tb-sb-300', slug: 'bambus-schneidebrett-set-3-teilig',
    name: { de: 'Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell' },
    category: 'vorbereitung', price: 29, oldPrice: 39,
    images: [p('bambus-schneidebrett-3er','51OE+ZepKfL._AC_SX569_.jpg','vorbereitung','Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell'), p('bambus-schneidebrett-3er','61oH8fQTVBL._AC_SX569_.jpg','vorbereitung','Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell'), p('bambus-schneidebrett-3er','61tn8dUzphL._AC_SL1080_.jpg','vorbereitung','Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell')],
    rating: 4.5, reviewCount: 2841, stock: 38, badges: ['new'],
    description: { de: 'FSC-zertifizierter Bambus – von Natur aus antibakteriell und messerschonend. Auffangnut für Fleischsäfte. 3 Größen: 25x35 cm, 30x40 cm, 35x45 cm. Handwäsche empfohlen.' },
    shortDescription: { de: 'FSC-Bambus, antibakteriell – nachhaltig und messerschonend' },
    specs: { material: 'Bambus FSC-zertifiziert', dimensions: '25–45 cm', weight: '1,6 kg', dishwasher: false, induction: false },
    brand: 'Totally Bamboo', ean: '0061169025003', supplierSku: 'TB-30-7832A', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 10 — Vitamix A2500i Standmixer
  {
    id: 'vm-bl-a25', slug: 'vitamix-a2500i-ascent-standmixer',
    name: { de: 'Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie' },
    category: 'vorbereitung', price: 599, oldPrice: 749,
    images: [p('vitamix-a2500i','714aszo7lSL._AC_SX569_.jpg','vorbereitung','Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie'), p('vitamix-a2500i','71JKAA9Vu1L._AC_SX569_.jpg','vorbereitung','Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie'), p('vitamix-a2500i','71NWuc7D3CL._AC_SX569_.jpg','vorbereitung','Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie')],
    rating: 4.8, reviewCount: 1892, stock: 6, badges: ['premium'],
    description: { de: 'Der Vitamix A2500i Ascent mit 2200 W Motor und 5 Automatikprogrammen: Smoothie, Heiße Suppe, Gefrorene Desserts, Dips, Selbstreinigung. BPA-freier 2,0-L-Behälter. 10 Jahre Garantie.' },
    shortDescription: { de: '2200 W Ascent-Mixer mit 10 Jahren Garantie' },
    specs: { material: 'Edelstahl, BPA-freier Tritan', dimensions: '50x22x22 cm', weight: '5,7 kg', dishwasher: true, induction: false },
    brand: 'Vitamix', ean: '7423001571003', supplierSku: 'VITAMIX-001711', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 11 — KitchenAid Artisan 4,8 L
  {
    id: 'ka-rm-48', slug: 'kitchenaid-artisan-kuechenmaschine-4-8l',
    name: { de: 'KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen' },
    category: 'vorbereitung', price: 399, oldPrice: 529,
    images: [p('kitchenaid-artisan-5ksm125','618NL1xtnkL._AC_SX569_.jpg','vorbereitung','KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen'), p('kitchenaid-artisan-5ksm125','61X85blM33L._AC_SX569_.jpg','vorbereitung','KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen'), p('kitchenaid-artisan-5ksm125','71+kzET3TIL._AC_SL1500_.jpg','vorbereitung','KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen')],
    rating: 4.8, reviewCount: 8743, stock: 9, badges: ['premium', 'bestseller'],
    description: { de: 'Kippbarer Motorkopf, 4,8-L-Edelstahlschüssel, 10 Stufen, 300 W. Enthält Flachrührer, Knethaken und Drahtbesen. Zubehöranschluss für über 15 optionale Aufsätze. Küchenklassiker seit 1937.' },
    shortDescription: { de: 'Seit 1937 der Küchenklassiker – über 15 Zubehörteile verfügbar' },
    specs: { material: 'Metall-Gehäuse, Edelstahlschüssel 4,8 L', dimensions: '36x22x36 cm', weight: '11,3 kg', dishwasher: true, induction: false },
    brand: 'KitchenAid', ean: '0050946817002', supplierSku: 'KA-5KSM125EER', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 12 — Börner V6 Gemüsehobel 5-teilig
  {
    id: 'bo-rw-250', slug: 'boerner-v6-gemuesehobel-5-teilig',
    name: { de: 'Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany' },
    category: 'vorbereitung', price: 75, oldPrice: 95,
    images: [p('borner-mandoline-5tlg','71AWmpYJ5aL._AC_SL1500_.jpg','vorbereitung','Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany'), p('borner-mandoline-5tlg','81b-HdQGvDL._AC_SX569_.jpg','vorbereitung','Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany'), p('borner-mandoline-5tlg','91kYq-NclkL._AC_SL1500_.jpg','vorbereitung','Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany')],
    rating: 4.5, reviewCount: 4127, stock: 24, badges: ['bestseller'],
    description: { de: 'Deutschlands meistverkaufter Gemüsehobel. Made in Germany. Patentiertes Klingenhalter-System. 5 Aufsätze: Hobel grob/fein, Julienne, Würfel, Sicherheitshalter. Rostfreie Spezialstahlklingen.' },
    shortDescription: { de: 'Meistverkaufter Gemüsehobel Deutschlands – Made in Germany' },
    specs: { material: 'Spezialstahlklingen, ABS', dimensions: '35x13 cm', weight: '0,8 kg', dishwasher: true, induction: false },
    brand: 'Börner', ean: '4000513130108', supplierSku: 'BOERNER-V6-DEU', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 13 — WMF Profi Plus Küchenhelfer 10-teilig
  {
    id: 'wmf-us-100', slug: 'wmf-profi-kuechen-utensilien-set-7-teilig',
    name: { de: 'WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer' },
    category: 'zubehoer', price: 75, oldPrice: 99,
    images: [p('wmf-utensilien-10tlg','513ysTEFAiL._AC_SX569_.jpg','zubehoer','WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer'), p('wmf-utensilien-10tlg','51h8CrQSREL._AC_SX569_.jpg','zubehoer','WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer'), p('wmf-utensilien-10tlg','51kYTxhUHFL._AC_SX569_.jpg','zubehoer','WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer')],
    rating: 4.7, reviewCount: 1876, stock: 31, badges: ['bestseller'],
    description: { de: 'Cromargan® 18/10 Edelstahl-Set mit 7 Teilen: Schaumlöffel, Schöpflöffel, Wokwender, Bratenwender, Schneebesen, Gemüseschäler und ein Edelstahlständer.' },
    shortDescription: { de: '7-teiliges Küchenhelfer-Set aus Cromargan® inkl. Ständer' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '28–35 cm', weight: '1,9 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530607921', supplierSku: 'WMF-18-7964-6030', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 14 — Ken Hom Wok-Starterset 8-teilig
  {
    id: 'kh-mx-280', slug: 'ken-hom-wok-starterset-8-teilig',
    name: { de: 'Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör' },
    category: 'zubehoer', price: 79, oldPrice: 109,
    images: [p('wok-starterset-8tlg','716qeZ7TbSL._AC_SX569_.jpg','zubehoer','Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör'), p('wok-starterset-8tlg','71bbgoB6NRL._AC_SX569_.jpg','zubehoer','Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör'), p('wok-starterset-8tlg','81h2LCNcU2L._AC_SX569_.jpg','zubehoer','Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör')],
    rating: 4.5, reviewCount: 612, stock: 15, badges: ['new'],
    description: { de: '32 cm Carbonstahl-Wok, Bambus-Spatel, Schöpflöffel, Wok-Ständer, Bambus-Dampfkorb 25 cm, Glasdeckel, Rezeptbuch und Pflegeöl. Für alle Herdarten inkl. Induktion.' },
    shortDescription: { de: '8-teiliges Komplett-Set – der beste Einstieg ins Wok-Kochen' },
    specs: { material: 'Carbonstahl, Bambus, Glas', dimensions: '32 cm Ø Wok', weight: '3,2 kg', dishwasher: false, induction: true },
    brand: 'Ken Hom', ean: '5028921960970', supplierSku: 'KH-KH322010', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 15 — Graef CM800 Kaffeemühle
  {
    id: 'gf-kf-800', slug: 'graef-cm800-kaffeemuhle-kegelmahlwerk',
    name: { de: 'Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany' },
    category: 'zubehoer', price: 149, oldPrice: 189,
    images: [p('graef-kaffeemuhle-cm800','21VIpOnCa4L._AC_.jpg','zubehoer','Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany'), p('graef-kaffeemuhle-cm800','519wCwPTAcL._AC_SY300_SX300_QL70_ML2_.jpg','zubehoer','Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany'), p('graef-kaffeemuhle-cm800','51WYGTkyvqL._AC_SX569_.jpg','zubehoer','Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany')],
    rating: 4.6, reviewCount: 2341, stock: 17, badges: ['new'],
    description: { de: 'Stahl-Kegelmahlwerk mit 40 Gradstufen vom Espresso bis French Press. Zeitschaltuhr 2–12 s, 250 g Bohnenbehälter, 35 g Pulverbehälter, LCD-Anzeige. Made in Germany.' },
    shortDescription: { de: 'Made in Germany – 40 Mahlstufen für perfekten Kaffee' },
    specs: { material: 'Edelstahl-Kegelmahlwerk', dimensions: '16x11x29 cm', weight: '2,1 kg', dishwasher: false, induction: false },
    brand: 'Graef', ean: '4001712101379', supplierSku: 'GRAEF-CM800EU', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 16 — Soehnle Page Compact Küchenwaage
  {
    id: 'so-wg-200', slug: 'soehnle-page-compact-kuechenwaage-5kg',
    name: { de: 'Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit' },
    category: 'zubehoer', price: 12, oldPrice: 16,
    images: [p('soehnle-page-compact-waage','51g2shZHh6L._AC_SX522_.jpg','zubehoer','Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit'), p('soehnle-page-compact-waage','71-KPUmtfvL._AC_SX522_.jpg','zubehoer','Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit'), p('soehnle-page-compact-waage','71PH+S-T12L._AC_SX522_.jpg','zubehoer','Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit')],
    rating: 4.4, reviewCount: 6821, stock: 52, badges: ['bestseller'],
    description: { de: 'Deutschlands meistverkaufte Küchenwaage. 1-g-Genauigkeit bis 5 kg, Tara-Funktion, Einheitenwechsel g/kg/oz/lb/ml, LCD. Edelstahl-Wiegeblech, spülmaschinenfest. Inkl. Batterien.' },
    shortDescription: { de: 'Meistverkaufte Küchenwaage – 1 g Präzision bis 5 kg' },
    specs: { material: 'ABS, Edelstahl-Wiegeblech', dimensions: '21x16x2 cm', weight: '0,5 kg', dishwasher: false, induction: false },
    brand: 'Soehnle', ean: '4006501659234', supplierSku: 'SOEHNLE-65929', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 17 — Villeroy & Boch Flow Servierplatten
  {
    id: 'vb-sg-300', slug: 'villeroy-boch-flow-servierplatten-3-teilig',
    name: { de: 'Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan' },
    category: 'tischaccessoires', price: 99, oldPrice: 129,
    images: [p('villeroy-boch-servierplatten','61Gq1JDiRaL._AC_SX569_.jpg','tischaccessoires','Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan'), p('villeroy-boch-servierplatten','61o9LrnKnLL._AC_SX569_.jpg','tischaccessoires','Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan'), p('villeroy-boch-servierplatten','71YyhukmldL._AC_SX569_.jpg','tischaccessoires','Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan')],
    rating: 4.7, reviewCount: 487, stock: 13, badges: ['new'],
    description: { de: 'V&B Flow Kollektion in Premium-Porzellan. Minimalistisches Design für stilvolle Tischpräsentation. Mikrowellen- und spülmaschinenfest. 3 Größen als Set: 26 cm, 33 cm und 40 cm.' },
    shortDescription: { de: 'V&B Premium-Porzellan – für stilvolles Servieren' },
    specs: { material: 'Premium-Porzellan', dimensions: '26–40 cm', weight: '2,1 kg', dishwasher: true, induction: false },
    brand: 'Villeroy & Boch', ean: '4003686268944', supplierSku: 'VB-1042691020', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 18 — FoodSaver V2860 Vakuumierer
  {
    id: 'fs-sv-286', slug: 'foodsaver-v2860-vakuumierer-automatik',
    name: { de: 'FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter' },
    category: 'zubehoer', price: 169, oldPrice: 210,
    images: [p('foodsaver-vakuumierer-v2860','7101Vbfil2L._AC_SL1500_.jpg','zubehoer','FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter'), p('foodsaver-vakuumierer-v2860','718g3tlQYXL._AC_SX569_.jpg','zubehoer','FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter'), p('foodsaver-vakuumierer-v2860','91ba1Sp8UqL._AC_SL1500_.jpg','zubehoer','FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter')],
    rating: 4.5, reviewCount: 3241, stock: 11, badges: ['new'],
    description: { de: 'Vollautomatischer Vakuumierer – Beutel einlegen, Deckel schließen, fertig. Lebensmittel bis zu 5x länger frisch. Inkl. 20 Folienbeutel und Vakuumbehälter 1,0 L. Sous-vide-geeignet.' },
    shortDescription: { de: 'Automatisch vakuumieren – bis 5x länger frisch' },
    specs: { material: 'ABS/PC, Edelstahlversiegelungsleiste', dimensions: '40x17x11 cm', weight: '2,1 kg', dishwasher: false, induction: false },
    brand: 'FoodSaver', ean: '0037823155520', supplierSku: 'FS-V2860', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 19 — Rosenthal TAC Teeservice 6-teilig
  {
    id: 'ro-tp-600', slug: 'rosenthal-tac-teeservice-6-teilig',
    name: { de: 'Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest' },
    category: 'tischaccessoires', price: 69, oldPrice: 95,
    images: [p('rosenthal-teeservice-6tlg','51yCFofAACL._AC_SX569_.jpg','tischaccessoires','Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest'), p('rosenthal-teeservice-6tlg','712xDnqQ63L._AC_SX569_.jpg','tischaccessoires','Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest'), p('rosenthal-teeservice-6tlg','81LeJp6a1WL._AC_SX569_.jpg','tischaccessoires','Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest')],
    rating: 4.6, reviewCount: 312, stock: 18, badges: ['new'],
    description: { de: 'Rosenthal TAC-Kollektion in Weißporzellan. 6-teilig: 6 Teeobertassen 190 ml, 6 Untertassen, 1 Teekanne 1,35 L. Spülmaschinen- und mikrowellengeeignet. Zeitloses Design.' },
    shortDescription: { de: 'Rosenthal Weißporzellan – puristisches Tee-Design' },
    specs: { material: 'Weißporzellan', dimensions: 'Tassen 9 cm, Kanne 24 cm', weight: '2,6 kg', dishwasher: true, induction: false },
    brand: 'Rosenthal', ean: '4012438127354', supplierSku: 'RO-TAC-TEA6', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 20 — WMF Gewürzständer 24 Gläser
  {
    id: 'wmf-gs-240', slug: 'wmf-gewuerzstaender-24-glaeser-edelstahl',
    name: { de: 'WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl' },
    category: 'tischaccessoires', price: 59, oldPrice: 79,
    images: [p('wmf-gewuerzstaender-24glas','613p83GwDxL._AC_SL1500_.jpg','tischaccessoires','WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl'), p('wmf-gewuerzstaender-24glas','71x8CazTxNL._AC_SY300_SX300_QL70_ML2_.jpg','tischaccessoires','WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl'), p('wmf-gewuerzstaender-24glas','81b7gI9lyHL._AC_SX569_.jpg','tischaccessoires','WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl')],
    rating: 4.4, reviewCount: 1124, stock: 23, badges: ['bestseller'],
    description: { de: '360°-Gewürzständer aus Cromargan® mit 24 befüllten Borosilikatglas-Gläsern (Siebaufsatz + Korkverschluss). Standfläche nur 20 cm Ø. 24 beschriftbare Etiketten inklusive.' },
    shortDescription: { de: '360° drehbar – 24 befüllte Gläser auf 20 cm Stellfläche' },
    specs: { material: 'Cromargan® Edelstahl, Borosilikatglas', dimensions: '20 cm Ø, 36 cm hoch', weight: '3,0 kg', dishwasher: false, induction: false },
    brand: 'WMF', ean: '4000530022131', supplierSku: 'WMF-06-0858-6030', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 21 — Thermos Stainless King 1 L
  {
    id: 'th-tk-100', slug: 'thermos-edelstahl-thermoskanne-1l-doppelwandig',
    name: { de: 'Thermos Stainless King Thermoskanne 1 L – 12 h heiß, 24 h kalt' },
    category: 'tischaccessoires', price: 29, oldPrice: 39,
    images: [p('thermos-stainless-1l','518Kjr-WxxL._AC_SX569_.jpg','tischaccessoires','Thermos Stainless King Thermoskanne 1 L – 12 h heiß, 24 h kalt'), p('thermos-stainless-1l','71i9iVUZw5L._AC_SX569_.jpg','tischaccessoires','Thermos Stainless King Thermoskanne 1 L – 12 h heiß, 24 h kalt')],
    rating: 4.7, reviewCount: 4512, stock: 35, badges: ['bestseller'],
    description: { de: 'Patentierte Vacuum-Isolierung aus doppelwandigem 18/8-Edelstahl. 12 h heiß, 24 h kalt. 360°-Trinkdeckel, auslaufsicherer Schraubverschluss, BPA-frei. Das Original seit über 120 Jahren.' },
    shortDescription: { de: 'Thermos Original – 12h heiß / 24h kalt, BPA-frei' },
    specs: { material: 'Edelstahl 18/8 doppelwandig', dimensions: '9 cm Ø, 30 cm hoch', weight: '0,6 kg', dishwasher: false, induction: false },
    brand: 'Thermos', ean: '5010576837218', supplierSku: 'THERMOS-SK1000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 22 — Zenker Brotbackform 2er-Set
  {
    id: 'ze-bb-300', slug: 'zenker-brotbackform-antihaft-2er-set-30cm',
    name: { de: 'Zenker Brotbackform 30 cm Antihaft 2er-Set – Made in Germany' },
    category: 'kochen', price: 22, oldPrice: 29,
    images: [
      p('zenker-brotbackform-2er', '51zkpb53ejL._AC_SY300_SX300_QL70_ML2_.jpg', 'kochen', 'Zenker Brotbackform 30 cm Antihaft 2er-Set – Made in Germany'),
      p('zenker-brotbackform-2er', '51REZ7DuTNL._AC_SX569_.jpg', 'kochen', 'Zenker Brotbackform 30 cm Antihaft 2er-Set – Made in Germany')
    ],
    rating: 4.4, reviewCount: 2187, stock: 41, badges: [],
    description: { de: 'Kohlenstoffstahl mit 3-lagiger Antihaft-Beschichtung – kein Einfetten nötig. Je Form 30x11x8 cm, bis 230 °C backofengeeignet. Spülmaschinengeeignet. Made in Germany.' },
    shortDescription: { de: 'Made in Germany – 3-lagige Antihaft für Brot und Kuchen' },
    specs: { material: 'Kohlenstoffstahl, Antihaft 3-lagig', dimensions: '30x11x8 cm', weight: '1,0 kg', dishwasher: true, induction: false },
    brand: 'Zenker', ean: '4006769126009', supplierSku: 'ZE-3100', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 23 — Kesper Mörser Granit 14 cm
  {
    id: 'ke-mp-140', slug: 'kesper-morser-granit-14cm-naturstein',
    name: { de: 'Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml' },
    category: 'vorbereitung', price: 28, oldPrice: 39,
    images: [p('kesper-morser-granit','41vAvcra91L._AC_.jpg','vorbereitung','Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml'), p('kesper-morser-granit','71ybNrWITrL._AC_SY300_SX300_QL70_ML2_.jpg','vorbereitung','Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml'), p('kesper-morser-granit','81k6iseXnSL._AC_SX522_.jpg','vorbereitung','Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml')],
    rating: 4.7, reviewCount: 1893, stock: 22, badges: ['new'],
    description: { de: 'Naturgranit unbehandelt, ohne chemische Zusätze. Raue Innenfläche zerkleinert Gewürze, Kräuter und Nüsse effektiv. 14 cm Innendurchmesser, 280 ml, Gesamtgewicht 2,5 kg.' },
    shortDescription: { de: 'Naturgranit unbehandelt – intensive Aromen garantiert' },
    specs: { material: 'Naturgranit, unbehandelt', dimensions: '14 cm Ø innen', weight: '2,5 kg', dishwasher: false, induction: false },
    brand: 'Kesper', ean: '4000270581412', supplierSku: 'KESPER-58141', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 24 — Peugeot Paris u'Select Mühlen-Set 18 cm
  {
    id: 'pe-sc-180', slug: 'peugeot-paris-uselect-salz-pfeffermuehlen-18cm',
    name: { de: "Peugeot Paris u'Select Salz- und Pfeffermühlen-Set 18 cm" },
    category: 'tischaccessoires', price: 55, oldPrice: 75,
    images: [p('peugeot-paris-muhlen-set','41y8awS9zmL._AC_US100_.jpg','tischaccessoires','Peugeot Paris u\'Select Salz- und Pfeffermühlen-Set 18 cm'), p('peugeot-paris-muhlen-set','51VFuhbo6dL._AC_SX569_.jpg','tischaccessoires','Peugeot Paris u\'Select Salz- und Pfeffermühlen-Set 18 cm'), p('peugeot-paris-muhlen-set','71+dhefHJUL._AC_SX569_.jpg','tischaccessoires','Peugeot Paris u\'Select Salz- und Pfeffermühlen-Set 18 cm')],
    rating: 4.8, reviewCount: 3214, stock: 26, badges: [],
    description: { de: "Legendäres Peugeot-Stahlmahlwerk seit 1842. 6 stufenlos einstellbare Mahlgradstufen. Buchenholz, 18 cm Höhe. Salzmühle mit Chromstahlmahlwerk für Feuchtigkeit. Made in France." },
    shortDescription: { de: 'Original-Peugeot-Mahlwerk seit 1842 – Made in France' },
    specs: { material: 'Buchenholz, Stahlmahlwerk', dimensions: '5 cm Ø, 18 cm hoch', weight: '0,6 kg', dishwasher: false, induction: false },
    brand: 'Peugeot', ean: '3129510032100', supplierSku: 'PG-32100', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 25 — GEFU Arolo Küchenhandschuhe
  {
    id: 'gf-kd-500', slug: 'gefu-arolo-kuechen-ofenhandschuhe-500grad',
    name: { de: 'GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar' },
    category: 'zubehoer', price: 23, oldPrice: 32,
    images: [p('gefu-handschuhe-500grad','61P60zZgwEL._AC_SL1001_.jpg','zubehoer','GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar'), p('gefu-handschuhe-500grad','71ONyzBILCL._AC_SY300_SX300_QL70_ML2_.jpg','zubehoer','GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar'), p('gefu-handschuhe-500grad','81-mMTXiK8L._AC_SL1500_.jpg','zubehoer','GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar')],
    rating: 4.6, reviewCount: 2847, stock: 44, badges: ['bestseller'],
    description: { de: 'Rutschfestes Silikon mit Aramidfaser-Innengewebe. Schutz bis 500 °C, wasserdicht, maschinenwaschbar bis 60 °C. Extra langer Unterarmschutz 38 cm. Designpreis-prämiert.' },
    shortDescription: { de: 'Designpreis-prämiert – 500 °C, wasserdicht, maschinenwaschbar' },
    specs: { material: 'Silikon außen, Aramidfaser innen', dimensions: '38 cm Länge', weight: '0,3 kg', dishwasher: false, induction: false },
    brand: 'GEFU', ean: '4006664122063', supplierSku: 'GEFU-12206', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 26 — WMF Spaghetti-Kochtopf 8 L
  {
    id: 'wmf-sp-800', slug: 'wmf-spaghetti-kochtopf-8l-siebeinsatz',
    name: { de: 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion' },
    category: 'kochen', price: 69, oldPrice: 95,
    images: [
      p('wmf-spaghettitopf-8l', '61NV5VT2MUL._AC_SX569_.jpg', 'kochen', 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion'),
      p('wmf-spaghettitopf-8l', '513E+LEvWmL._AC_SX569_.jpg', 'kochen', 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion'),
      p('wmf-spaghettitopf-8l', '51qlHBF1BWL._AC_SX569_.jpg', 'kochen', 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion')
    ],
    rating: 4.7, reviewCount: 1432, stock: 16, badges: ['bestseller'],
    description: { de: 'Cromargan® 18/10 mit herausnehmbarem Siebeinsatz – kein extra Abgießsieb nötig. TransTherm®-Allherdboden, Maßgravierung innen, Glasdeckel mit Dampföffnung. 8 L, spülmaschinenfest.' },
    shortDescription: { de: 'Pasta ohne Abgießsieb – integrierter Siebeinsatz' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '24 cm Ø, 8 L', weight: '3,0 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530607938', supplierSku: 'WMF-07-4804-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 27 — Emile Henry Pizza-Set 4-teilig
  {
    id: 'eh-ps-400', slug: 'emile-henry-pizza-set-4-teilig',
    name: { de: 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France' },
    category: 'kochen', price: 89, oldPrice: 119,
    images: [
      p('emile-henry-pizza-4tlg', '81W6XkeicdL._AC_SX569_.jpg', 'kochen', 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France'),
      p('emile-henry-pizza-4tlg', '91L2NZ8H8RL._AC_SX569_.jpg', 'kochen', 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France'),
      p('emile-henry-pizza-4tlg', '91SD9tKAk5L._AC_SX569_.jpg', 'kochen', 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France')
    ],
    rating: 4.6, reviewCount: 892, stock: 19, badges: ['new'],
    description: { de: 'Burgunder Ton für knusprige Böden wie im Steinofen. 38 cm Pizzastein bis 270 °C, Pizzaroller, Edelstahl-Pizzaschneider, Servierplatte. Made in France seit 1850.' },
    shortDescription: { de: 'Made in France – Steinofenpizza zuhause bis 270 °C' },
    specs: { material: 'Burgunder Ton, Edelstahl', dimensions: '38 cm Ø Stein', weight: '4,8 kg', dishwasher: false, induction: false },
    brand: 'Emile Henry', ean: '0020200000001', supplierSku: 'EH-797514', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 28 — WMF Perfect Pro Schnellkochtopf 6 L
  {
    id: 'wmf-kr-600', slug: 'wmf-perfect-pro-schnellkochtopf-6l',
    name: { de: 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion' },
    category: 'kochen', price: 169, oldPrice: 229,
    images: [
      p('wmf-perfect-schnellkochtopf-6l', '61SRedAnuyL._AC_SY300_SX300_QL70_ML2_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion'),
      p('wmf-perfect-schnellkochtopf-6l', '610mhKEp-iL._AC_SX569_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion'),
      p('wmf-perfect-schnellkochtopf-6l', '61yLaee+uxL._AC_SX569_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion'),
      p('wmf-perfect-schnellkochtopf-6l', '61ZsPO3BdmL._AC_SX569_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion')
    ],
    rating: 4.8, reviewCount: 2187, stock: 9, badges: ['premium'],
    description: { de: 'Garzeiten bis zu 70% kürzer. 3 Druckstufen: Schonkochen, Normaldruck, Hochdruck (0,9 bar). 5-faches Sicherheitssystem. Cromargan® 18/10, TransTherm®-Allherdboden. Inkl. Dampfgar- und Teigeinsatz.' },
    shortDescription: { de: 'Bis zu 70% schneller – WMF-Sicherheitssystem mit 5 Funktionen' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '24 cm Ø, 6 L', weight: '4,1 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530028102', supplierSku: 'WMF-07-9225-9901', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 29 — Zwilling Four Star Santokumesser 18cm
  {
    id: 'zw-ss-180', slug: 'zwilling-four-star-santokumesser-18cm',
    name: { de: 'ZWILLING Four Star Santokumesser 18 cm – Eisgehärtet' },
    category: 'vorbereitung', price: 59, oldPrice: 89,
    images: [p('zwilling-four-star-santoku','51Vd1ZELZiL._AC_SX569_.jpg','vorbereitung','Zwilling Four Star Santokumesser 18 cm – Eisgehärtet')],
    rating: 4.8, reviewCount: 1420, stock: 24, badges: ['bestseller'],
    description: { de: 'Der Klassiker aus Solingen. Eisgehärtete FRIODUR® Klinge, nahtloser Kunststoffgriff. Ideal für Fleisch, Fisch und Gemüse, inkl. Kullenschliff.' },
    shortDescription: { de: 'Klassiker aus Solingen – FRIODUR® eisgehärtet' },
    specs: { material: 'Spezialstahl, Kunststoff', dimensions: '18 cm Klinge', weight: '180 g', dishwasher: false, induction: false },
    brand: 'ZWILLING', ean: '4009839072970', supplierSku: 'ZW-31077-181', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 30 — Le Creuset Gusseisen Pfanne 26cm
  {
    id: 'lc-pf-260', slug: 'le-creuset-gusseisen-pfanne-26cm',
    name: { de: 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert' },
    category: 'kochen', price: 139, oldPrice: 169,
    images: [
      p('le-creuset-pfanne-26cm', '51oAwTNP2qL._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61EfsKj9n0L._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61GN4-9Wq-L._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61MDMAzQoPL._AC_SX300_SY300_QL70_ML2_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61abqZLjMRL._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert')
    ],
    rating: 4.8, reviewCount: 890, stock: 12, badges: ['premium'],
    description: { de: 'Gusseiserne Bratpfanne mit mattschwarzer Emaillierung. Extrem hitzebeständig, perfekt zum scharfen Anbraten. Für alle Herdarten, inkl. Induktion.' },
    shortDescription: { de: 'Perfektes Anbraten auf allen Herdarten inkl. Induktion' },
    specs: { material: 'Emailliertes Gusseisen', dimensions: '26 cm Ø', weight: '2,6 kg', dishwasher: false, induction: true },
    brand: 'Le Creuset', ean: '0024147259029', supplierSku: 'LC-201822600', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 31 — WMF KÜCHENminis Reiskocher
  {
    id: 'wmf-rk-100', slug: 'wmf-kuechenminis-reiskocher',
    name: { de: 'WMF KÜCHENminis Reiskocher – Chromargan, 1 Liter' },
    category: 'vorbereitung', price: 69, oldPrice: 89,
    images: [p('wmf-kuechenminis-reiskocher','71CBOnCsIPL._AC_SX569_.jpg','vorbereitung','WMF KÜCHENminis Reiskocher – Chromargan, 1 Liter')],
    rating: 4.6, reviewCount: 1105, stock: 15, badges: [],
    description: { de: 'Kompakter Reiskocher mit Dampfgar-Einsatz und Doppel-Antihaftbeschichtung. Inklusive To-Go-Deckel. Cromargan® Gehäuse, 220 Watt.' },
    shortDescription: { de: 'Kompakt und vielseitig – für Reis, Quinoa und Gemüse' },
    specs: { material: 'Cromargan® Edelstahl', dimensions: '1,0 L Kapazität', weight: '1,4 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530685936', supplierSku: 'WMF-04-1526-0011', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 32 — Staub Cocotte 24cm Rund, Kirschrot
  {
    id: 'st-co-240', slug: 'staub-cocotte-rund-24cm-kirschrot',
    name: { de: 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen' },
    category: 'kochen', price: 189, oldPrice: 249,
    images: [
      p('staub-cocotte-24cm', '71BkfO8qOmL._AC_SX300_SY300_QL70_ML2_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen'),
      p('staub-cocotte-24cm', '71kSOh2XmwL._AC_SX522_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen'),
      p('staub-cocotte-24cm', '81CVsdr-fmL._AC_SX522_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen'),
      p('staub-cocotte-24cm', '81qxkyimtFL._AC_SX522_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen')
    ],
    rating: 4.9, reviewCount: 2011, stock: 8, badges: ['premium'],
    description: { de: 'Französische Cocotte aus emailliertem Gusseisen. Der spezielle Deckel mit Chistera-Tropfenstruktur sorgt für saftiges Garen. Induktions- und ofengeeignet.' },
    shortDescription: { de: 'Das Original aus dem Elsass – perfekt für Schmorgerichte' },
    specs: { material: 'Emailliertes Gusseisen', dimensions: '24 cm Ø, 3,8 L', weight: '4,6 kg', dishwasher: false, induction: true },
    brand: 'Staub', ean: '3272341024063', supplierSku: 'ST-1102406', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 33 — Peugeot Balkis Pfeffermühle
  {
    id: 'pe-bk-01', slug: 'peugeot-balkis-pfeffermuehle-natur',
    name: { de: 'Peugeot Balkis Pfeffermühle Natur – Holz' },
    category: 'tischaccessoires', price: 35, oldPrice: 49,
    images: [p('peugeot-balkis','41+hU-8ZkqL._AC_SX569_.jpg','tischaccessoires','Peugeot Balkis Pfeffermühle Natur – Holz'), p('peugeot-balkis','41fzZfsN56L._AC_SY741_.jpg','tischaccessoires','Peugeot Balkis Pfeffermühle Natur – Holz'), p('peugeot-balkis','71VLzA4K-ZL._AC_SX569_.jpg','tischaccessoires','Peugeot Balkis Pfeffermühle Natur – Holz')],
    rating: 4.6, reviewCount: 432, stock: 29, badges: [],
    description: { de: 'Klassisches Peugeot-Design aus Buchenholz mit dem unübertroffenen Stahlmahlwerk. Für optimales Mahlen von Pfefferkörnern.' },
    shortDescription: { de: 'Langlebiges Mahlwerk mit lebenslanger Garantie' },
    specs: { material: 'Buchenholz, Stahlmahlwerk', dimensions: 'Variable Höhe', weight: '0,3 kg', dishwasher: false, induction: false },
    brand: 'Peugeot', ean: '3129510008549', supplierSku: 'PE-08549', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 34 — Rösle Knoblauchpresse mit Abstreifer
  {
    id: 'ro-kp-01', slug: 'roesle-knoblauchpresse-abstreifer',
    name: { de: 'Rösle Knoblauchpresse mit Abstreifer – Edelstahl 18/10' },
    category: 'zubehoer', price: 35, oldPrice: 45,
    images: [
      p('roesle-knoblauchpresse', '61rYATrQZYL._AC_SX569_.jpg', 'zubehoer', 'Rösle Knoblauchpresse mit Abstreifer – Edelstahl 18/10'),
      p('roesle-knoblauchpresse', '61VhTywxg9L._AC_SY741_.jpg', 'zubehoer', 'Rösle Knoblauchpresse mit Abstreifer – Edelstahl 18/10')
    ],
    rating: 4.8, reviewCount: 3120, stock: 18, badges: ['bestseller'],
    description: { de: 'Hochwertige Knoblauchpresse aus 18/10 Edelstahl mit patentiertem 44-Loch-Sieb und praktischem Abstreifer. Sehr leichtgängig und spülmaschinenfest.' },
    shortDescription: { de: 'Geringer Kraftaufwand, leicht zu reinigen' },
    specs: { material: 'Edelstahl 18/10', dimensions: '20 cm Länge', weight: '360 g', dishwasher: true, induction: false },
    brand: 'Rösle', ean: '4004293128956', supplierSku: 'RO-12895', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 35 — KitchenAid Artisan Handrührer
  {
    id: 'ka-hm-01', slug: 'kitchenaid-artisan-handruehrer-9-stufen',
    name: { de: 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot' },
    category: 'vorbereitung', price: 119, oldPrice: 149,
    images: [
      p('kitchenaid-handruehrer', '41Ps1Tr4XjL._AC_SX569_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot'),
      p('kitchenaid-handruehrer', '319sQVMAmAL._AC_SX569_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot'),
      p('kitchenaid-handruehrer', '31uSuWhSWKL._AC_SX569_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot'),
      p('kitchenaid-handruehrer', '31+6FcCV-NL._AC_SY300_SX300_QL70_ML2_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot')
    ],
    rating: 4.7, reviewCount: 1650, stock: 10, badges: ['premium'],
    description: { de: 'Kraftvoller DC-Motor mit 9 Geschwindigkeitsstufen und Sanftanlauf. Inklusive Turbobesen, Pürierstab, Knethaken und Schneebesen.' },
    shortDescription: { de: 'Genaue Kontrolle für luftige Ergebnisse, inkl. 4 Zubehörteilen' },
    specs: { material: 'Kunststoff/Edelstahl', dimensions: '15 x 8 x 20 cm', weight: '1,1 kg', dishwasher: false, induction: false },
    brand: 'KitchenAid', ean: '5413184123519', supplierSku: 'KA-5KHM9212EER', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 36 — Tefal Ingenio Expertise
  {
    id: 'tf-ie-300', slug: 'tefal-ingenio-expertise-pfannenset-3-tlg',
    name: { de: 'Tefal Ingenio Expertise Pfannenset 3-tlg – abnehmbarer Griff' },
    category: 'kochen', price: 89, oldPrice: 129,
    images: [
      p('tefal-ingenio-expertise', '61JMhm3qjXL._AC_SX569_.jpg', 'kochen', 'Tefal Ingenio Expertise Pfannenset 3-tlg – abnehmbarer Griff'),
      p('tefal-ingenio-expertise', '71Ptr9KStKL._AC_SX569_.jpg', 'kochen', 'Tefal Ingenio Expertise Pfannenset 3-tlg – abnehmbarer Griff')
    ],
    rating: 4.7, reviewCount: 2450, stock: 14, badges: ['bestseller'],
    description: { de: 'Platzsparendes Pfannenset mit patentiertem abnehmbarem Griff. Titanium Excellence Antihaftbeschichtung, Thermo-Spot Temperaturanzeiger. Für alle Herdarten inkl. Induktion. Ofenfest bis 250°C (ohne Griff).' },
    shortDescription: { de: 'Platzsparend stapelbar – abnehmbarer Griff für maximale Flexibilität' },
    specs: { material: 'Aluminium, Titanium Excellence', dimensions: '22/26 cm, 3-tlg', weight: '2,1 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430262147', supplierSku: 'TF-L65091', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 37 — Fissler original-profi collection Kochtopf 20 cm
  {
    id: 'fi-kt-200', slug: 'fissler-original-profi-kochtopf-20cm',
    name: { de: 'Fissler original-profi collection Kochtopf 20 cm – mit Metall-Deckel' },
    category: 'kochen', price: 169, oldPrice: 199,
    images: [
      p('fissler-kochtopf-20cm', '61YAttnne1L._AC_SX569_.jpg', 'kochen', 'Fissler original-profi collection Kochtopf 20 cm – mit Metall-Deckel'),
      p('fissler-kochtopf-20cm', '718yVkKnSDL._AC_SX569_.jpg', 'kochen', 'Fissler original-profi collection Kochtopf 20 cm – mit Metall-Deckel'),
      p('fissler-kochtopf-20cm', '71caLomq7BL._AC_SX569_.jpg', 'kochen', 'Fissler original-profi collection Kochtopf 20 cm – mit Metall-Deckel'),
      p('fissler-kochtopf-20cm', '71dkkHuWwpL._AC_SX569_.jpg', 'kochen', 'Fissler original-profi collection Kochtopf 20 cm – mit Metall-Deckel')
    ],
    rating: 4.9, reviewCount: 845, stock: 15, badges: ['premium'],
    description: { de: 'Der Fissler original-profi collection Kochtopf aus robustem Edelstahl 18/10. Mit Cookstar Allherdboden für perfekte Wärmeverteilung, Kaltmetallgriffen und Messskala. Made in Germany.' },
    shortDescription: { de: 'Profi-Qualität Made in Germany – extrem robust und induktionsgeeignet' },
    specs: { material: 'Edelstahl 18/10', dimensions: '20 cm Ø, 3,9 L', weight: '2,8 kg', dishwasher: true, induction: true },
    brand: 'Fissler', ean: '4009209343105', supplierSku: 'FI-084-123-20-000', vatRatePercent: 19, priceIncludesVat: true,
  },

]


export const CATALOG_TARGET_SIZE = 200

export const products: Product[] = baseProducts;

const baseCategories: Category[] = [
  {
    id: 'kochen',
    name: { de: 'Kochen & Braten' },
    image: '/images/Kategorien/Kochen & Braten copie.webp',
    count: 12
  },
  {
    id: 'vorbereitung',
    name: { de: 'Vorbereitung' },
    image: '/images/Kategorien/Vorbereitung copie.webp',
    count: 9
  },
  {
    id: 'tischaccessoires',
    name: { de: 'Tisch & Servier' },
    image: '/images/Kategorien/Tisch & Servier copie.webp',
    count: 8
  },
  {
    id: 'zubehoer',
    name: { de: 'Küchenzubehör' },
    image: '/images/Kategorien/Küchenzubehör copie.webp',
    count: 11
  }
]

export const categories: Category[] = baseCategories.map((c) => ({
  ...c,
  count: products.filter((item) => item.category === c.id).length,
}))

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'pfanne-kaufratgeber-induktion',
    title: { de: 'Die richtige Pfanne für Induktion: Der ultimative Kaufratgeber 2026' },
    excerpt: { de: 'Worauf Sie beim Kauf einer Induktionspfanne unbedingt achten sollten – Materialien, Bodenaufbau, Beschichtungen und Pflegehinweise im Überblick.' },
    image: '/images/blog/Die richtige Pfanne für Induktion Der ultimative Kaufratgeber 2026.jpg',
    date: '15. März 2026',
    readTime: '8 Min. Lesezeit',
    category: 'Kaufberatung',
    author: 'NOVA INDUKT Redaktion'
  },
  {
    id: 'blog-2',
    slug: 'induktion-vs-gas-energievergleich',
    title: { de: 'Induktion vs. Gas: Der große Energiekostenvergleich 2026' },
    excerpt: { de: 'Wie effizient ist Induktion wirklich im Vergleich zu Gas? Wir vergleichen Verbrauch, Kosten, Umweltauswirkungen und Kochqualität.' },
    image: '/images/blog/Induktion vs. Gas Der große Energiekostenvergleich 2026.jpg',
    date: '10. März 2026',
    readTime: '6 Min. Lesezeit',
    category: 'Technik & Energie',
    author: 'NOVA INDUKT Redaktion'
  },
  {
    id: 'blog-3',
    slug: 'edelstahlpfannen-pflege',
    title: { de: 'Edelstahlpfannen richtig reinigen & pflegen – ohne Kratzer und Flecken' },
    excerpt: { de: 'Die besten Tipps für die tägliche und gründliche Reinigung Ihrer Edelstahlpfannen sowie typische Fehler, die Sie unbedingt vermeiden sollten.' },
    image: '/images/blog/Edelstahlpfannen richtig reinigen & pflegen – ohne Kratzer und Flecken.jpg',
    date: '5. März 2026',
    readTime: '5 Min. Lesezeit',
    category: 'Pflege & Tipps',
    author: 'NOVA INDUKT Redaktion'
  }
]
