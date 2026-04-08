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
  // If we have a product name, use it directly as the folder name (matching the actual folder structure)
  if (productName) {
    const safeProductName = productName
      .replace(/\s\/\s/g, '  ')
      .replace(/[<>:"/\\|?*]/g, ' ')
      .trim()
    return `/images/products/${safeProductName}/${file}`
  }

  // Fallback using the folder parameter
  if (folder) {
    return `/images/products/${folder}/${file}`
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
    category: 'kochen', price: 156.79, oldPrice: 449,
    images: [
      p('wmf-topfset-5teilig', '71UtVphhaOL._AC_SY300_SX300_QL70_ML2_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl'),
      p('wmf-topfset-5teilig', '61pwL2eCmiL._AC_SX522_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl'),
      p('wmf-topfset-5teilig', '71oQfJ2C9ZL._AC_SX522_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl'),
      p('wmf-topfset-5teilig', '71TLUVMXrkL._AC_SX522_.jpg', 'kochen', 'WMF Premium One Topfset 5-teilig – Cromargan® Edelstahl')
    ],
    rating: 4.8, reviewCount: 1247, stock: 12, badges: ['premium', 'bestseller'],
    description: { de: 'Entdecken Sie die Spitzenklasse des Kochens mit dem WMF Premium One Topfset. Gefertigt aus unverwüstlichem Cromargan® Edelstahl 18/10, setzt dieses 5-teilige Set neue Maßstäbe in Funktionalität und Sicherheit. Die patentierte Cool+ Technologie verhindert effektiv die Wärmeübertragung vom Topf auf die Griffe, sodass diese auch bei langen Garzeiten angenehm kühl bleiben. Der TransTherm®-Allherdboden garantiert eine gleichmäßige Wärmeverteilung und exzellente Speicherung für energiesparendes Kochen auf allen Herdarten, einschließlich Induktion. Alle Töpfe verfügen über eine Innenskalierung, einen breiten Schüttrand und sind stapelbar zur platzsparenden Aufbewahrung. Backofenfest bis 200°C. Das Set beinhaltet: 3x Fleischtöpfe mit Deckel (16cm, 20cm, 24cm), 1x Bratentopf mit Deckel (20cm) und 1x Stielkasserolle (16cm).' },
    shortDescription: { de: 'Cromargan® 18/10 + Cool+ Griffe – für alle Herdarten inkl. Induktion' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '16–28 cm, 5-teilig', weight: '5,2 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530607907', supplierSku: 'WMF-07-2918-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 2 — Le Creuset Signature Braeter 26 cm
  {
    id: 'lc-do-260', slug: 'le-creuset-braeter-gusseisen-26cm',
    name: { de: 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L' },
    category: 'kochen', price: 212.66, oldPrice: 295,
    images: [
      p('le-creuset-braeter-gusseisen-26cm', '41ViRiBaqqL._AC_.jpg', 'kochen', 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L'),
      p('le-creuset-braeter-gusseisen-26cm', '51exM+c+wNS._AC_SY300_SX300_QL70_ML2_.jpg', 'kochen', 'Le Creuset Signature Bräter – Gusseisen emailliert, 26 cm  5,3 L')
    ],
    rating: 4.9, reviewCount: 3821, stock: 8, badges: ['premium', 'bestseller'],
    description: { de: 'Das ikonische Original aus Frankreich für Gourmets und Profiköche. Der Le Creuset Signature Bräter aus massivem, emailliertem Gusseisen ist das ultimative Werkzeug für perfekte Schmorgerichte, Braten und sogar zum Backen von Brot. Die hochwertige, helle Emaillierung ist besonders langlebig, kratzfest und lässt sich mühelos reinigen. Dank der exzellenten Wärmespeicherung von Gusseisen bleibt das Gargut gleichmäßig heiß, während der dicht schließende Deckel die Feuchtigkeit im Topf hält – für unvergleichlich saftige Ergebnisse. Die großen Griffe ermöglichen eine sichere Handhabung auch mit Ofenhandschuhen. Geeignet für alle Herdarten, inklusive Induktion, sowie für den Backofen und Grill.' },
    shortDescription: { de: 'Das ikonische Original aus Gusseisen für perfekte Schmorgerichte' },
    specs: { material: 'Emailliertes Gusseisen', dimensions: '26 cm Ø, 5,3 L', weight: '6,5 kg', dishwasher: false, induction: true },
    brand: 'Le Creuset', ean: '0024147194566', supplierSku: 'LC-LS2501-2667', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 3 — Tefal Jamie Oliver Bratpfanne 28 cm
  {
    id: 'tf-kp-280', slug: 'tefal-jamie-oliver-bratpfanne-keramik-28cm',
    name: { de: 'Tefal Jamie Oliver Bratpfanne 28 cm – Mineralkeramik, Induktion' },
    category: 'kochen', price: 28.42, oldPrice: 49,
    images: [
      p('tefal-pfanne-keramik-28cm', '71Tg6Uu0lFL._AC_SX569_.jpg', 'kochen', 'Tefal Jamie Oliver Bratpfanne 28 cm – Mineralkeramik, Induktion'),
      p('tefal-pfanne-keramik-28cm', '61L+LztOXqL._AC_SX569_.jpg', 'kochen', 'Tefal Jamie Oliver Bratpfanne 28 cm – Mineralkeramik, Induktion')
    ],
    rating: 4.6, reviewCount: 892, stock: 28, badges: ['new'],
    description: { de: 'Die Jamie Oliver Edition von Tefal kombiniert professionelles Edelstahl-Design mit hervorragenden Brateigenschaften. Die 3-lagige Titanium-Antihaftversiegelung ist extrem langlebig und ermöglicht fettarmes Braten ohne Anhaften. Mit der exklusiven Thermo-Signal-Technologie, die den idealen Zeitpunkt zum Starten des Braten anzeigt, und einem genieteten Griff für sicheren Halt. Der starke Induktionsboden sorgt für eine gleichmäßige Hitzeverteilung und ist für alle Herdarten geeignet.' },
    shortDescription: { de: 'Jamie Oliver Edition – PFOA-frei, Thermo-Signal, Induktion' },
    specs: { material: 'Aluminium + Mineralkeramik 3-lagig', dimensions: '28 cm Ø', weight: '1,2 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430298412', supplierSku: 'TF-H9120644', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 4 — Lodge Gusseisen-Grillpfanne 26 cm
  {
    id: 'lo-gp-260', slug: 'lodge-gusseisen-grillpfanne-26cm',
    name: { de: 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA' },
    category: 'kochen', price: 38.22, oldPrice: 49,
    images: [
      p('lodge-grillpfanne-26cm', '5171PN2riwL._AC_SX300_SY300_QL70_ML2_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA'),
      p('lodge-grillpfanne-26cm', '716k++TB6GL._AC_SX569_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA'),
      p('lodge-grillpfanne-26cm', '71dwlCyCmzL._AC_SX569_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA'),
      p('lodge-grillpfanne-26cm', '71kjKYi1dOL._AC_SX569_.jpg', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Pre-Seasoned, USA')
    ],
    rating: 4.7, reviewCount: 5634, stock: 19, badges: ['bestseller'],
    description: { de: 'Die klassische Grillpfanne aus massivem Gusseisen, direkt in den USA (Tennessee) hergestellt. Pre-Seasoned (mit 100% natürlichem Pflanzenöl eingebrannt) für eine natürliche Antihaftwirkung, die mit jedem Gebrauch besser wird. Die tiefen Grillrippen sorgen für ein authentisches Branding und lassen überschüssiges Fett optimal ablaufen. Unverwüstlich und vielseitig einsetzbar auf dem Herd, im Backofen, auf dem Grill oder über dem Lagerfeuer.' },
    shortDescription: { de: 'Das Original seit 1896 – Pre-Seasoned, für alle Herdarten' },
    specs: { material: 'Gusseisen, eingebrannt', dimensions: '26 cm Ø', weight: '2,7 kg', dishwasher: false, induction: true },
    brand: 'Lodge', ean: '0076501003408', supplierSku: 'LODGE-L8GP3', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 5 — WMF Edelstahl-Dampfgarer 24 cm
  {
    id: 'wmf-sp-240', slug: 'wmf-edelstahl-dampfgarer-24cm-3-einsaetze',
    name: { de: 'WMF Edelstahl-Dampfgarer 24 cm – 3 Einsätze, Induktion' },
    category: 'kochen', price: 126.42, oldPrice: 161,
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
    description: { de: 'Das original WMF Vitalis Aroma-Dampfgarsystem ermöglicht ein besonders schonendes Garen von Gemüse, Fisch und Fleisch im aufsteigenden Dampf. Mineralstoffe und Vitamine bleiben weitgehend erhalten. Das System besteht aus dem Bräter, einem Locheinsatz und dem hochwertigen Glasdeckel mit integriertem Thermometer zur perfekten Temperaturkontrolle. Der TransTherm-Allherdboden sorgt für eine gleichmäßige Wärmeverteilung und exzellente Wärmespeicherung. Inklusive praktischer Zange für das sichere Entnehmen der Einsätze.' },
    shortDescription: { de: 'Vitaminschonendes Dampfgaren auf 3 Ebenen – WMF TransTherm®' },
    specs: { material: 'Edelstahl 18/10, Glas', dimensions: '24 cm Ø, 3 Einsätze', weight: '3,4 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530729821', supplierSku: 'WMF-07-2826-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 6 — Ken Hom Performance Wok 32 cm
  {
    id: 'kh-wok-320', slug: 'ken-hom-performance-wok-32cm-carbonstahl',
    name: { de: 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion' },
    category: 'kochen', price: 43.12, oldPrice: 59,
    images: [
      p('ken-hom-wok-32cm', '61E2NQ6G0VL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '61bRWcK2QZL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '71XdmMC8NOL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '81+vMZ+TGzL._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion'),
      p('ken-hom-wok-32cm', '81nLQSZtWcS._AC_SX569_.jpg', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl, Induktion')
    ],
    rating: 4.5, reviewCount: 1189, stock: 22, badges: ['bestseller'],
    description: { de: 'Authentisches Wok-Kochen mit der Performance-Serie vom renommierten TV-Koch Ken Hom. Gefertigt aus robustem Carbonstahl für eine extrem schnelle und gleichmäßige Erhitzung – essenziell für das Pfannenrühren bei hohen Temperaturen. Der Wok verfügt über einen flachen Boden für maximale Stabilität auf allen modernen Herdarten inklusive Induktion. Mit ergonomischem Buchenholzgriff und praktischer Aufhängeschlaufe. 10 Jahre Herstellergarantie.' },
    shortDescription: { de: 'Von TV-Koch Ken Hom empfohlen – authentisches Wok-Erlebnis' },
    specs: { material: 'Carbonstahl', dimensions: '32 cm Ø', weight: '1,8 kg', dishwasher: false, induction: true },
    brand: 'Ken Hom', ean: '5028921961625', supplierSku: 'KH-KH416032', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 7 — ZWILLING Pro Messerset 6-teilig
  {
    id: 'zw-ks-600', slug: 'zwilling-pro-messerset-6-teilig',
    name: { de: 'ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock' },
    category: 'vorbereitung', price: 283.22, oldPrice: 351,
    images: [p('zwilling-pro-messerset-6tlg','71aiw8iN3kL._AC_SX569_.jpg','vorbereitung','ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock'), p('zwilling-pro-messerset-6tlg','811SXk6HlHL._AC_SX569_.jpg','vorbereitung','ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock'), p('zwilling-pro-messerset-6tlg','81QEQWeqrXL._AC_SX569_.jpg','vorbereitung','ZWILLING Pro Messerset 6-teilig – Friodur® Stahl, Bambusblock')],
    rating: 4.8, reviewCount: 2156, stock: 7, badges: ['premium'],
    description: { de: 'Gefertigt aus hochwertigem 18/10 Edelstahl, bietet das ZWILLING Pro Messerset die perfekte Kombination aus Schärfe, Balance und Langlebigkeit. Jedes Messer wird aus einem einzigen Stück Spezialstahl geschmiedet (SIGMAFORGE®) und in einem speziellen Eishärteverfahren (FRIODUR®) veredelt, was zu einer außergewöhnlichen Schnitthaltigkeit und Korrosionsbeständigkeit führt. Der ergonomische Kunststoffgriff im klassischen 3-Nieten-Design sorgt für eine sichere und präzise Führung. Der elegante Bambusblock schützt die Klingen und ist ein Blickfang in jeder Küche. Das Set enthält: 1x Spick- und Garniermesser (10cm), 1x Universalmesser (13cm), 1x Fleischmesser (16cm), 1x Kochmesser (20cm), 1x Brotmesser (20cm) und den Messerblock.' },
    shortDescription: { de: 'Made in Solingen – Präzision Friodur® für Profiköche' },
    specs: { material: 'Friodur® Spezialstahl, 57 HRC', dimensions: '10–20 cm Klingen', weight: '2,4 kg', dishwasher: false, induction: false },
    brand: 'ZWILLING', ean: '4009839417146', supplierSku: 'ZWILLING-38430-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 8 — Miyabi 5000MCD Santoku 17 cm
  {
    id: 'my-km-170', slug: 'miyabi-5000mcd-santoku-17cm-damast',
    name: { de: 'Miyabi 5000MCD Santoku 17 cm – 63 Lagen Damast, VG-10 Kern' },
    category: 'vorbereitung', price: 253.82, oldPrice: 379,
    images: [p('miyabi-santoku-17cm','71AkQtKc6LL._AC_SX569_.jpg','vorbereitung','Miyabi 5000MCD Santoku 17 cm – 63 Lagen Damast, VG-10 Kern'), p('miyabi-santoku-17cm','71oPsOVt6RL._AC_SX569_.jpg','vorbereitung','Miyabi 5000MCD Santoku 17 cm – 63 Lagen Damast, VG-10 Kern')],
    rating: 4.9, reviewCount: 743, stock: 14, badges: ['premium', 'bestseller'],
    description: { de: 'Höchste Präzision aus Seki, Japan. Das Miyabi Santoku aus der 5000MCD Serie besticht durch seinen Kern aus MicroCarbide Pulverstahl MC63, eingebettet in 100 Lagen zwei unterschiedlicher Stahlsorten für ein faszinierendes Damast-Muster. Die Cryodur-Eishärtung bei -196°C sorgt für extreme Härte (ca. 63 HRC) und außergewöhnliche Schnitthaltigkeit. Der handgefertigte Honbazuke-Abzug verleiht der Klinge eine skalpellartige Schärfe. Der ergonomische D-Griff aus edler Masur-Birke mit Mosaik-Pin macht jedes Messer zum Unikat und sorgt für perfekte Balance und ermüdungsfreies Arbeiten.' },
    shortDescription: { de: '63 Lagen Damast, VG-10 Kern – Handgeschärft, 9,5°' },
    specs: { material: '63-Lagen Damast, VG-10 Kern (63 HRC)', dimensions: '17 cm Klinge', weight: '185 g', dishwasher: false, induction: false },
    brand: 'Miyabi', ean: '4009839402068', supplierSku: 'MIYABI-34373-171', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 9 — Totally Bamboo Schneidebrett Set 3-teilig
  {
    id: 'tb-sb-300', slug: 'bambus-schneidebrett-set-3-teilig',
    name: { de: 'Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell' },
    category: 'vorbereitung', price: 21.56, oldPrice: 29,
    images: [p('bambus-schneidebrett-3er','51OE+ZepKfL._AC_SX569_.jpg','vorbereitung','Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell'), p('bambus-schneidebrett-3er','61oH8fQTVBL._AC_SX569_.jpg','vorbereitung','Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell'), p('bambus-schneidebrett-3er','61tn8dUzphL._AC_SL1080_.jpg','vorbereitung','Totally Bamboo Schneidebrett Set 3-teilig – FSC, antibakteriell')],
    rating: 4.5, reviewCount: 2841, stock: 38, badges: ['new'],
    description: { de: 'Nachhaltiges Schneiden mit dem 3-teiligen Set von Totally Bamboo. Gefertigt aus Moso-Bambus, der von Natur aus antibakteriell, messerschonend und extrem robust ist. Das Set bietet drei praktische Größen für alle Schneidarbeiten: Groß (33x24cm), Mittel (28x22cm) und Klein (20x15cm). Jedes Brett verfügt über eine praktische Aussparung zum Aufhängen oder Tragen. 100% FSC-zertifiziert.' },
    shortDescription: { de: 'FSC-Bambus, antibakteriell – nachhaltig und messerschonend' },
    specs: { material: 'Bambus FSC-zertifiziert', dimensions: '25–45 cm', weight: '1,6 kg', dishwasher: false, induction: false },
    brand: 'Totally Bamboo', ean: '0061169025003', supplierSku: 'TB-30-7832A', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 10 — Vitamix A2500i Standmixer
  {
    id: 'vm-bl-a25', slug: 'vitamix-a2500i-ascent-standmixer',
    name: { de: 'Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie' },
    category: 'vorbereitung', price: 391.02, oldPrice: 599,
    images: [p('vitamix-a2500i','714aszo7lSL._AC_SX569_.jpg','vorbereitung','Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie'), p('vitamix-a2500i','71JKAA9Vu1L._AC_SX569_.jpg','vorbereitung','Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie'), p('vitamix-a2500i','71NWuc7D3CL._AC_SX569_.jpg','vorbereitung','Vitamix A2500i Ascent Standmixer – 2200 W, 5 Programme, 10 J. Garantie')],
    rating: 4.8, reviewCount: 1892, stock: 6, badges: ['premium'],
    description: { de: 'Maximale Vielseitigkeit und Profi-Leistung für Ihre Küche. Der Vitamix A2500i aus der Ascent-Serie bietet drei Automatik-Programme für Smoothies, heiße Suppen und gefrorene Desserts, die ihre Laufzeit und Geschwindigkeit automatisch an die Behältergröße anpassen. Die innovative Self-Detect-Technologie erkennt den aufgesetzten Behälter und schaltet die entsprechenden Funktionen frei. Mit dem digitalen Timer und der variablen 10-Stufen-Geschwindigkeitskontrolle behalten Sie immer die volle Kontrolle über die Konsistenz. Der leistungsstarke Motor verarbeitet selbst härteste Zutaten mühelos zu samtweichen Ergebnissen. Inklusive 2,0 L Interlock-Behälter und 10 Jahren Herstellergarantie.' },
    shortDescription: { de: '2200 W Ascent-Mixer mit 10 Jahren Garantie' },
    specs: { material: 'Edelstahl, BPA-freier Tritan', dimensions: '50x22x22 cm', weight: '5,7 kg', dishwasher: true, induction: false },
    brand: 'Vitamix', ean: '7423001571003', supplierSku: 'VITAMIX-001711', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 11 — KitchenAid Artisan 4,8 L
  {
    id: 'ka-rm-48', slug: 'kitchenaid-artisan-kuechenmaschine-4-8l',
    name: { de: 'KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen' },
    category: 'vorbereitung', price: 391.02, oldPrice: 499,
    images: [p('kitchenaid-artisan-5ksm125','618NL1xtnkL._AC_SX569_.jpg','vorbereitung','KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen'), p('kitchenaid-artisan-5ksm125','61X85blM33L._AC_SX569_.jpg','vorbereitung','KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen'), p('kitchenaid-artisan-5ksm125','71+kzET3TIL._AC_SL1500_.jpg','vorbereitung','KitchenAid Artisan Küchenmaschine 4,8 L – 300 W, 10 Stufen')],
    rating: 4.8, reviewCount: 8743, stock: 9, badges: ['premium', 'bestseller'],
    description: { de: 'Die Küchenikone seit Generationen. Die KitchenAid Artisan Küchenmaschine überzeugt durch ihr unverwechselbares Design und ihre robuste Ganzmetall-Konstruktion. Das Planetenrührwerk sorgt für schnelles und gründliches Vermengen, Kneten und Rühren von Zutaten. Mit 10 Geschwindigkeitsstufen und einem 300 Watt starken Direktantrieb verarbeitet sie mühelos kleine und große Mengen. Die kippbare Motorkopf-Konstruktion ermöglicht einen einfachen Zugriff auf die Schüssel und das Auswechseln der Rührwerkzeuge. Inklusive 4,8 L Edelstahlschüssel, Flachrührer, Knethaken und Schneebesen.' },
    shortDescription: { de: 'Seit 1937 der Küchenklassiker – über 15 Zubehörteile verfügbar' },
    specs: { material: 'Metall-Gehäuse, Edelstahlschüssel 4,8 L', dimensions: '36x22x36 cm', weight: '11,3 kg', dishwasher: true, induction: false },
    brand: 'KitchenAid', ean: '0050946817002', supplierSku: 'KA-5KSM125EER', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 12 — Börner V6 Gemüsehobel 5-teilig
  {
    id: 'bo-rw-250', slug: 'boerner-v6-gemuesehobel-5-teilig',
    name: { de: 'Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany' },
    category: 'vorbereitung', price: 69.09, oldPrice: 82,
    images: [p('borner-mandoline-5tlg','71AWmpYJ5aL._AC_SL1500_.jpg','vorbereitung','Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany'), p('borner-mandoline-5tlg','81b-HdQGvDL._AC_SX569_.jpg','vorbereitung','Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany'), p('borner-mandoline-5tlg','91kYq-NclkL._AC_SL1500_.jpg','vorbereitung','Börner V6 Profi-Gemüsehobel 5-teilig – Made in Germany')],
    rating: 4.5, reviewCount: 4127, stock: 24, badges: ['bestseller'],
    description: { de: 'Präzision Made in Germany. Der Börner V6 Profi-Hobel aus hochwertigem, gebürstetem Edelstahl ermöglicht das Schneiden von Scheiben in drei verschiedenen Stärken sowie Stifte und Würfel in zwei Größen. Die messerscharfen Edelstahlklingen gleiten mühelos durch hartes und weiches Gemüse. Mit dem im Set enthaltenen Sicherheitsfruchthalter arbeiten Sie immer sicher bis zum letzten Rest. Die transparente Schieberbox ermöglicht eine sichere und platzsparende Aufbewahrung der Messereinsätze.' },
    shortDescription: { de: 'Deutschlands beliebtester Gemüsehobel – Made in Germany' },
    specs: { material: 'Spezialstahlklingen, ABS', dimensions: '35x13 cm', weight: '0,8 kg', dishwasher: true, induction: false },
    brand: 'Börner', ean: '4000513130108', supplierSku: 'BOERNER-V6-DEU', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 13 — WMF Profi Plus Küchenhelfer 10-teilig
  {
    id: 'wmf-us-100', slug: 'wmf-profi-kuechen-utensilien-set-7-teilig',
    name: { de: 'WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer' },
    category: 'zubehoer', price: 68.60, oldPrice: 119,
    images: [p('wmf-utensilien-10tlg','513ysTEFAiL._AC_SX569_.jpg','zubehoer','WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer'), p('wmf-utensilien-10tlg','51h8CrQSREL._AC_SX569_.jpg','zubehoer','WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer'), p('wmf-utensilien-10tlg','51kYTxhUHFL._AC_SX569_.jpg','zubehoer','WMF Profi Plus Küchenhelfer-Set 7-teilig – Cromargan® inkl. Ständer')],
    rating: 4.7, reviewCount: 1876, stock: 31, badges: ['bestseller'],
    description: { de: 'Profiqualität für Ihre Küche. Das 7-teilige WMF Profi Plus Set aus hochwertigem, poliertem Cromargan Edelstahl 18/10 ist unverwüstlich, formstabil und säurefest. Das Set enthält alle wichtigen Helfer für den täglichen Einsatz: Schöpflöffel, Schaumlöffel, Wokwender, Pfannenwender, Schneebesen und Gemüseschäler. Alle Teile sind ergonomisch geformt und verfügen über eine praktische Aufhängöse. Der passende Edelstahlständer sorgt für Ordnung auf der Arbeitsplatte und ist ein optisches Highlight.' },
    shortDescription: { de: 'Hochwertiges 7-teiliges Set aus Cromargan® Edelstahl' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '28–35 cm', weight: '1,9 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530607921', supplierSku: 'WMF-18-7964-6030', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 14 — Ken Hom Wok-Starterset 8-teilig
  {
    id: 'kh-mx-280', slug: 'ken-hom-wok-starterset-8-teilig',
    name: { de: 'Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör' },
    category: 'zubehoer', price: 60.76, oldPrice: 79,
    images: [p('wok-starterset-8tlg','716qeZ7TbSL._AC_SX569_.jpg','zubehoer','Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör'), p('wok-starterset-8tlg','71bbgoB6NRL._AC_SX569_.jpg','zubehoer','Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör'), p('wok-starterset-8tlg','81h2LCNcU2L._AC_SX569_.jpg','zubehoer','Ken Hom Wok-Starterset 8-teilig – Carbonstahl und Bambus-Zubehör')],
    rating: 4.5, reviewCount: 612, stock: 15, badges: ['new'],
    description: { de: 'Alles für den perfekten Start in die Wok-Küche. Das 8-teilige Set von Ken Hom umfasst einen hochwertigen Carbonstahl-Wok (31 cm), einen passenden Deckel, Wender, Schöpflöffel, Essstäbchen und einen praktischen Dünstrost aus Bambus.' },
    shortDescription: { de: 'Komplettes 8-teiliges Set für authentischen Wok-Genuss' },
    specs: { material: 'Carbonstahl, Bambus, Glas', dimensions: '32 cm Ø Wok', weight: '3,2 kg', dishwasher: false, induction: true },
    brand: 'Ken Hom', ean: '5028921960970', supplierSku: 'KH-KH322010', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 15 — Graef CM800 Kaffeemühle
  {
    id: 'gf-kf-800', slug: 'graef-cm800-kaffeemuhle-kegelmahlwerk',
    name: { de: 'Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany' },
    category: 'zubehoer', price: 172.48, oldPrice: 211,
    images: [p('graef-kaffeemuhle-cm800','21VIpOnCa4L._AC_.jpg','zubehoer','Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany'), p('graef-kaffeemuhle-cm800','519wCwPTAcL._AC_SY300_SX300_QL70_ML2_.jpg','zubehoer','Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany'), p('graef-kaffeemuhle-cm800','51WYGTkyvqL._AC_SX569_.jpg','zubehoer','Graef CM 800 Kaffeemühle – Kegelmahlwerk, 40 Stufen, Made in Germany')],
    rating: 4.6, reviewCount: 2341, stock: 17, badges: ['new'],
    description: { de: 'Perfekter Kaffeegenuss durch präzises Mahlen. Die Graef CM 800 besticht durch ihr massives Aluminiumgehäuse und das professionelle Edelstahl-Kegelmahlwerk, das die Bohnen aromaschonend zerkleinert. Mit 40 Mahlgradeinstellungen von extra-fein für Espresso bis grob für French Press oder Filterkaffee bietet sie für jeden Geschmack die richtige Einstellung. Die Antistatik-Funktion verhindert Kaffeemehl-Streuung, während das langsam laufende Mahlwerk eine Überhitzung vermeidet. Mit der praktischen Tipp-Funktion mahlen Sie direkt in den Siebträger. Inklusive zwei Siebträgerhaltern, Bohnenbehälter (350g) mit Verschlussdeckel und Reinigungspinsel.' },
    shortDescription: { de: 'Aromaschonendes Kegelmahlwerk mit 40 Mahlstufen' },
    specs: { material: 'Edelstahl-Kegelmahlwerk', dimensions: '16x11x29 cm', weight: '2,1 kg', dishwasher: false, induction: false },
    brand: 'Graef', ean: '4001712101379', supplierSku: 'GRAEF-CM800EU', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 16 — Soehnle Page Compact Küchenwaage
  {
    id: 'so-wg-200', slug: 'soehnle-page-compact-kuechenwaage-5kg',
    name: { de: 'Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit' },
    category: 'zubehoer', price: 16.66, oldPrice: 29,
    images: [p('soehnle-page-compact-waage','51g2shZHh6L._AC_SX522_.jpg','zubehoer','Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit'), p('soehnle-page-compact-waage','71-KPUmtfvL._AC_SX522_.jpg','zubehoer','Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit'), p('soehnle-page-compact-waage','71PH+S-T12L._AC_SX522_.jpg','zubehoer','Soehnle Page Compact 200 Küchenwaage – 5 kg, 1 g Genauigkeit')],
    rating: 4.4, reviewCount: 6821, stock: 52, badges: ['bestseller'],
    description: { de: 'Präzision in der Küche für perfekte Backergebnisse. Die Soehnle Page Compact 200 überzeugt durch ihre hohe Tragkraft von bis zu 5 kg und die feine 1-g-Teilung für exaktes Abwiegen kleinster Mengen. Die patentierte Sensor-Touch-Bedienung reagiert auf sanfteste Berührung und macht die Reinigung der Glasoberfläche zum Kinderspiel. Dank der extrem flachen Bauweise und der großen Wiegefläche aus hochwertigem Sicherheitsglas lässt sie sich platzsparend verstauen oder dekorativ an die Wand hängen. Mit praktischer Zuwiegefunktion (Tara), automatischer Abschaltung zur Batterieschonung und rutschhemmenden Standfüßen. Inklusive Batterien für den sofortigen Start.' },
    shortDescription: { de: 'Platzsparende Küchenwaage mit 5 kg Tragkraft' },
    specs: { material: 'ABS, Edelstahl-Wiegeblech', dimensions: '21x16x2 cm', weight: '0,5 kg', dishwasher: false, induction: false },
    brand: 'Soehnle', ean: '4006501659234', supplierSku: 'SOEHNLE-65929', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 17 — Villeroy & Boch Flow Servierplatten
  {
    id: 'vb-sg-300', slug: 'villeroy-boch-flow-servierplatten-3-teilig',
    name: { de: 'Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan' },
    category: 'tischaccessoires', price: 97.02, oldPrice: 400,
    images: [p('villeroy-boch-servierplatten','61Gq1JDiRaL._AC_SX569_.jpg','tischaccessoires','Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan'), p('villeroy-boch-servierplatten','61o9LrnKnLL._AC_SX569_.jpg','tischaccessoires','Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan'), p('villeroy-boch-servierplatten','71YyhukmldL._AC_SX569_.jpg','tischaccessoires','Villeroy & Boch Flow Servierplatten-Set 3-teilig – Premium-Porzellan')],
    rating: 4.7, reviewCount: 487, stock: 13, badges: ['new'],
    description: { de: 'Servieren mit Stil und Eleganz. Das 3-teilige Servierplatten-Set aus der preisgekrönten Flow-Kollektion von Villeroy & Boch besticht durch seine fließenden, organischen Formen und ein puristisches Design in strahlendem Weiß. Gefertigt aus hochwertigem Premium Porcelain, vereinen diese Platten filigrane Ästhetik mit hoher Stoß- und Kantenfestigkeit. Das Set umfasst drei verschiedene Größen, die ideal zum Anrichten von Beilagen, Hauptgerichten oder Fingerfood geeignet sind. Alle Teile sind sowohl mikrowellengeeignet als auch spülmaschinenfest – perfekt für den anspruchsvollen täglichen Gebrauch oder festliche Anlässe.' },
    shortDescription: { de: '3-teiliges Set aus Premium-Porzellan mit organischen Formen' },
    specs: { material: 'Premium-Porzellan', dimensions: '26–40 cm', weight: '2,1 kg', dishwasher: true, induction: false },
    brand: 'Villeroy & Boch', ean: '4003686268944', supplierSku: 'VB-1042691020', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 18 — FoodSaver V2860 Vakuumierer
  {
    id: 'fs-sv-286', slug: 'foodsaver-v2860-vakuumierer-automatik',
    name: { de: 'FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter' },
    category: 'zubehoer', price: 165.62, oldPrice: 169,
    images: [p('foodsaver-vakuumierer-v2860','7101Vbfil2L._AC_SL1500_.jpg','zubehoer','FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter'), p('foodsaver-vakuumierer-v2860','718g3tlQYXL._AC_SX569_.jpg','zubehoer','FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter'), p('foodsaver-vakuumierer-v2860','91ba1Sp8UqL._AC_SL1500_.jpg','zubehoer','FoodSaver V2860 Vakuumierer Automatik – inkl. 20 Beutel und Behälter')],
    rating: 4.5, reviewCount: 3241, stock: 11, badges: ['new'],
    description: { de: 'Erleben Sie die nächste Generation des Vakuumierens. Das FoodSaver V2860 System hält Ihre Lebensmittel bis zu 5-mal länger frisch, indem es Luft und Feuchtigkeit zuverlässig entzieht und so Gefrierbrand verhindert. Ausgestattet mit drei Geschwindigkeitsstufen und einer Pulse-Funktion für maximale Kontrolle bei empfindlichen Lebensmitteln. Der CrushFree-Verschluss sorgt dafür, dass empfindliches Gargut beim Versiegeln nicht gequetscht wird. Das elegante Design mit Edelstahl-Finish kann zur platzsparenden Lagerung vertikal aufgestellt werden. Inklusive herausnehmbarer, spülmaschinengeeigneter Auffangschale, Zubehörschlauch und einem umfangreichen Starter-Set mit Beuteln und Rollen.' },
    shortDescription: { de: 'Automatisches Vakuumiersystem für langanhaltende Frische' },
    specs: { material: 'ABS/PC, Edelstahlversiegelungsleiste', dimensions: '40x17x11 cm', weight: '2,1 kg', dishwasher: false, induction: false },
    brand: 'FoodSaver', ean: '0037823155520', supplierSku: 'FS-V2860', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 19 — Rosenthal TAC Teeservice 6-teilig
  {
    id: 'ro-tp-600', slug: 'rosenthal-tac-teeservice-6-teilig',
    name: { de: 'Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest' },
    category: 'tischaccessoires', price: 67.62, oldPrice: 200,
    images: [p('rosenthal-teeservice-6tlg','51yCFofAACL._AC_SX569_.jpg','tischaccessoires','Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest'), p('rosenthal-teeservice-6tlg','712xDnqQ63L._AC_SX569_.jpg','tischaccessoires','Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest'), p('rosenthal-teeservice-6tlg','81LeJp6a1WL._AC_SX569_.jpg','tischaccessoires','Rosenthal TAC Teeservice 6-teilig – Weißporzellan, spülmaschinenfest')],
    rating: 4.6, reviewCount: 312, stock: 18, badges: ['new'],
    description: { de: 'Zeitlose Eleganz und Bauhaus-Tradition auf dem Teetisch. Das 6-teilige TAC Teeservice von Rosenthal basiert auf den legendären Entwürfen von Walter Gropius aus dem Jahr 1969. Die puristische Formsprache, basierend auf dem Kreis und der Kugel, macht dieses Service zu einer Ikone des modernen Designs. Gefertigt aus edlem, durchscheinendem Weißporzellan, bietet es eine angenehme Haptik und höchste Qualität. Das Set ist spülmaschinen- und mikrowellengeeignet. Bestehend aus: 1x Teekanne (1,35L), 6x Teetassen und 6x Untertassen.' },
    shortDescription: { de: 'Puristisches Design-Service aus edlem Weißporzellan' },
    specs: { material: 'Weißporzellan', dimensions: 'Tassen 9 cm, Kanne 24 cm', weight: '2,6 kg', dishwasher: true, induction: false },
    brand: 'Rosenthal', ean: '4012438127354', supplierSku: 'RO-TAC-TEA6', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 20 — WMF Gewürzständer 24 Gläser
  {
    id: 'wmf-gs-240', slug: 'wmf-gewuerzstaender-24-glaeser-edelstahl',
    name: { de: 'WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl' },
    category: 'tischaccessoires', price: 34.30, oldPrice: 59,
    images: [p('wmf-gewuerzstaender-24glas','613p83GwDxL._AC_SL1500_.jpg','tischaccessoires','WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl'), p('wmf-gewuerzstaender-24glas','71x8CazTxNL._AC_SY300_SX300_QL70_ML2_.jpg','tischaccessoires','WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl'), p('wmf-gewuerzstaender-24glas','81b7gI9lyHL._AC_SX569_.jpg','tischaccessoires','WMF Drehbarer Gewürzständer 24 Gläser – Cromargan® Edelstahl')],
    rating: 4.4, reviewCount: 1124, stock: 23, badges: ['bestseller'],
    description: { de: 'Ordnung und Übersicht in der Gewürzküche. Der drehbare Gewürzständer von WMF aus mattem Cromargan bietet Platz für 24 Gewürze. Die Gläser mit Streueinsatz bewahren das Aroma und sind durch den praktischen Drehmechanismus jederzeit griffbereit.' },
    shortDescription: { de: 'Platzsparender, drehbarer Gewürzständer für 24 Gewürze' },
    specs: { material: 'Cromargan® Edelstahl, Borosilikatglas', dimensions: '20 cm Ø, 36 cm hoch', weight: '3,0 kg', dishwasher: false, induction: false },
    brand: 'WMF', ean: '4000530022131', supplierSku: 'WMF-06-0858-6030', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 21 — Thermos Stainless King 1 L
  {
    id: 'th-tk-100', slug: 'thermos-edelstahl-thermoskanne-1l-doppelwandig',
    name: { de: 'Thermos Stainless King Thermoskanne 1 L – 12 h heiß, 24 h kalt' },
    category: 'tischaccessoires', price: 18.62, oldPrice: 29,
    images: [p('thermos-stainless-1l','518Kjr-WxxL._AC_SX569_.jpg','tischaccessoires','Thermos Stainless King Thermoskanne 1 L – 12 h heiß, 24 h kalt'), p('thermos-stainless-1l','71i9iVUZw5L._AC_SX569_.jpg','tischaccessoires','Thermos Stainless King Thermoskanne 1 L – 12 h heiß, 24 h kalt')],
    rating: 4.7, reviewCount: 4512, stock: 35, badges: ['bestseller'],
    description: { de: 'Der Klassiker für unterwegs. Die Thermos Stainless King Isolierflasche hält Getränke bis zu 24 Stunden heiß oder kalt. Dank der Thermax-Isolierung bleibt die Außenwand stets angenehm kühl. Robust, langlebig und absolut auslaufsicher.' },
    shortDescription: { de: 'Ultimative Isolierleistung für heiße und kalte Getränke' },
    specs: { material: 'Edelstahl 18/8 doppelwandig', dimensions: '9 cm Ø, 30 cm hoch', weight: '0,6 kg', dishwasher: false, induction: false },
    brand: 'Thermos', ean: '5010576837218', supplierSku: 'THERMOS-SK1000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 22 — Zenker Brotbackform 2er-Set
  {
    id: 'ze-bb-300', slug: 'zenker-brotbackform-antihaft-2er-set-30cm',
    name: { de: 'Zenker Brotbackform 30 cm Antihaft 2er-Set – Made in Germany' },
    category: 'kochen', price: 10.78, oldPrice: 22,
    images: [
      p('zenker-brotbackform-2er', '51zkpb53ejL._AC_SY300_SX300_QL70_ML2_.jpg', 'kochen', 'Zenker Brotbackform 30 cm Antihaft 2er-Set – Made in Germany'),
      p('zenker-brotbackform-2er', '51REZ7DuTNL._AC_SX569_.jpg', 'kochen', 'Zenker Brotbackform 30 cm Antihaft 2er-Set – Made in Germany')
    ],
    rating: 4.4, reviewCount: 2187, stock: 41, badges: [],
    description: { de: 'Backen wie in einer traditionellen deutschen Bäckerei. Das 2-teilige Brotbackform-Set von Zenker aus der Serie Special Cooking ist mit einer hochwertigen ILAG Special Antihaftbeschichtung versehen, die ein müheloses Herauslösen des Backguts ermöglicht. Die stabilen Formen aus veredeltem Schwarzblech sind hitzebeständig bis 230°C und sorgen durch ihre exzellente Wärmeleitung für eine gleichmäßige Bräunung und eine perfekte Kruste. Das Set enthält zwei Kastenformen (30cm), ideal für klassische Brote, Hefezöpfe oder Rührkuchen. Made in Germany für höchste Qualitätsansprüche und Langlebigkeit.' },
    shortDescription: { de: '2-teiliges Set mit hochwertiger ILAG Antihaftbeschichtung' },
    specs: { material: 'Kohlenstoffstahl, Antihaft 3-lagig', dimensions: '30x11x8 cm', weight: '1,0 kg', dishwasher: true, induction: false },
    brand: 'Zenker', ean: '4006769126009', supplierSku: 'ZE-3100', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 23 — Kesper Mörser Granit 14 cm
  {
    id: 'ke-mp-140', slug: 'kesper-morser-granit-14cm-naturstein',
    name: { de: 'Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml' },
    category: 'vorbereitung', price: 16.66, oldPrice: 28,
    images: [p('kesper-morser-granit','41vAvcra91L._AC_.jpg','vorbereitung','Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml'), p('kesper-morser-granit','71ybNrWITrL._AC_SY300_SX300_QL70_ML2_.jpg','vorbereitung','Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml'), p('kesper-morser-granit','81k6iseXnSL._AC_SX522_.jpg','vorbereitung','Kesper Mörser und Stößel 14 cm – Naturgranit, 280 ml')],
    rating: 4.7, reviewCount: 1893, stock: 22, badges: ['new'],
    description: { de: 'Frische Aromen und maximale Wirkstofffreisetzung direkt aus dem Stein. Der Kesper Mörser mit passendem Stößel ist aus massivem, handverlesenem Naturgranit gefertigt und ideal zum professionellen Zerkleinern von Gewürzen, Kräutern, Pfefferkörnern und Nüssen. Die bewusst rau belassene Innenfläche des Mörsers und die griffige Unterseite des schweren Stößels garantieren ein effizientes Mahlergebnis ohne großen Kraftaufwand. Granit ist absolut geschmacksneutral, säurefest und extrem langlebig. Ein unverzichtbares Werkzeug für die authentische Küche.' },
    shortDescription: { de: 'Massiver Naturgranit für optimales Zerkleinern von Gewürzen' },
    specs: { material: 'Naturgranit, unbehandelt', dimensions: '14 cm Ø innen', weight: '2,5 kg', dishwasher: false, induction: false },
    brand: 'Kesper', ean: '4000270581412', supplierSku: 'KESPER-58141', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 24 — Peugeot Paris u'Select Mühlen-Set 18 cm
  {
    id: 'pe-sc-180', slug: 'peugeot-paris-uselect-salz-pfeffermuehlen-18cm',
    name: { de: "Peugeot Paris u'Select Salz- und Pfeffermühlen-Set 18 cm" },
    category: 'tischaccessoires', price: 53.90, oldPrice: 75,
    images: [p('peugeot-paris-muhlen-set','41y8awS9zmL._AC_US100_.jpg','tischaccessoires','Peugeot Paris u\'Select Salz- und Pfeffermühlen-Set 18 cm'), p('peugeot-paris-muhlen-set','51VFuhbo6dL._AC_SX569_.jpg','tischaccessoires','Peugeot Paris u\'Select Salz- und Pfeffermühlen-Set 18 cm'), p('peugeot-paris-muhlen-set','71+dhefHJUL._AC_SX569_.jpg','tischaccessoires','Peugeot Paris u\'Select Salz- und Pfeffermühlen-Set 18 cm')],
    rating: 4.8, reviewCount: 3214, stock: 26, badges: [],
    description: { de: 'Das perfekte Duo für den gedeckten Tisch. Das Peugeot Paris u\'Select Set besteht aus einer Pfeffer- und einer Salzmühle (je 18 cm). Das patentierte u\'Select-System ermöglicht eine präzise Einstellung des Mahlgrads in 6 Stufen. Gefertigt aus edlem Buchenholz mit dem legendären Peugeot-Mahlwerk.' },
    shortDescription: { de: 'Legendäres Mahlwerk mit 6-facher Mahlgrad-Einstellung' },
    specs: { material: 'Buchenholz, Stahlmahlwerk', dimensions: '5 cm Ø, 18 cm hoch', weight: '0,6 kg', dishwasher: false, induction: false },
    brand: 'Peugeot', ean: '3129510032100', supplierSku: 'PG-32100', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 25 — GEFU Arolo Küchenhandschuhe
  {
    id: 'gf-kd-500', slug: 'gefu-arolo-kuechen-ofenhandschuhe-500grad',
    name: { de: 'GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar' },
    category: 'zubehoer', price: 13.72, oldPrice: 23,
    images: [p('gefu-handschuhe-500grad','61P60zZgwEL._AC_SL1001_.jpg','zubehoer','GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar'), p('gefu-handschuhe-500grad','71ONyzBILCL._AC_SY300_SX300_QL70_ML2_.jpg','zubehoer','GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar'), p('gefu-handschuhe-500grad','81-mMTXiK8L._AC_SL1500_.jpg','zubehoer','GEFU Arolo Küchenhandschuhe 500 Grad – Silikon, 38 cm, 1 Paar')],
    rating: 4.6, reviewCount: 2847, stock: 44, badges: ['bestseller'],
    description: { de: 'Sicherheit und Komfort beim Kochen und Backen. Die GEFU Arolo Küchenhandschuhe aus hitzebeständigem Silikon schützen zuverlässig vor Verbrennungen. Die rutschhemmende Oberfläche sorgt für einen sicheren Griff von heißen Töpfen und Blechen. Das Paar ist pflegeleicht und langlebig.' },
    shortDescription: { de: 'Hitzebeständiges Silikon für sicheren Schutz und Halt' },
    specs: { material: 'Silikon außen, Aramidfaser innen', dimensions: '38 cm Länge', weight: '0,3 kg', dishwasher: false, induction: false },
    brand: 'GEFU', ean: '4006664122063', supplierSku: 'GEFU-12206', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 26 — WMF Spaghetti-Kochtopf 8 L
  {
    id: 'wmf-sp-800', slug: 'wmf-spaghetti-kochtopf-8l-siebeinsatz',
    name: { de: 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion' },
    category: 'kochen', price: 49.00, oldPrice: 69,
    images: [
      p('wmf-spaghettitopf-8l', '61NV5VT2MUL._AC_SX569_.jpg', 'kochen', 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion'),
      p('wmf-spaghettitopf-8l', '513E+LEvWmL._AC_SX569_.jpg', 'kochen', 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion'),
      p('wmf-spaghettitopf-8l', '51qlHBF1BWL._AC_SX569_.jpg', 'kochen', 'WMF Spaghetti-Kochtopf 8 L – Siebeinsatz, Cromargan®, Induktion')
    ],
    rating: 4.7, reviewCount: 1432, stock: 16, badges: ['bestseller'],
    description: { de: 'Pasta-Genuss leicht gemacht. Der WMF Spaghetti-Kochtopf mit 8 Liter Volumen verfügt über einen integrierten Siebeinsatz, der das Abgießen von Nudeln zum Kinderspiel macht. Gefertigt aus poliertem Cromargan Edelstahl 18/10 und ausgestattet mit dem TransTherm-Allherdboden für alle Herdarten.' },
    shortDescription: { de: 'Integrierter Siebeinsatz für einfaches Abgießen von Pasta' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '24 cm Ø, 8 L', weight: '3,0 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530607938', supplierSku: 'WMF-07-4804-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 27 — Emile Henry Pizza-Set 4-teilig
  {
    id: 'eh-ps-400', slug: 'emile-henry-pizza-set-4-teilig',
    name: { de: 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France' },
    category: 'kochen', price: 36.26, oldPrice: 89,
    images: [
      p('emile-henry-pizza-4tlg', '81W6XkeicdL._AC_SX569_.jpg', 'kochen', 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France'),
      p('emile-henry-pizza-4tlg', '91L2NZ8H8RL._AC_SX569_.jpg', 'kochen', 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France'),
      p('emile-henry-pizza-4tlg', '91SD9tKAk5L._AC_SX569_.jpg', 'kochen', 'Emile Henry Pizza-Set 4-teilig – Pizzastein 38 cm, Made in France')
    ],
    rating: 4.6, reviewCount: 892, stock: 19, badges: ['new'],
    description: { de: 'Meisterhaftes Backen wie in der französischen Boulangerie. Das Emile Henry Pizza-Set besteht aus einem hochwertigen Pizzastein aus feuerfester Keramik (38 cm), einer Holzschaufel und einem Pizzaschneider. Die innovative Keramik verteilt die Hitze gleichmäßig und nimmt überschüssige Feuchtigkeit auf, was für einen unvergleichlich knusprigen Boden sorgt – genau wie im Steinofen. Der Stein ist extrem hitzebeständig und kann direkt vom Gefrierfach in den heißen Ofen oder auf den Grill gestellt werden. Dank der robusten Glasur können Sie die Pizza direkt auf dem Stein schneiden, ohne Kratzer zu hinterlassen. Hergestellt in Frankreich mit 10 Jahren Garantie.' },
    shortDescription: { de: 'Knusprige Pizza wie vom Italiener – feuerfeste Keramik' },
    specs: { material: 'Burgunder Ton, Edelstahl', dimensions: '38 cm Ø Stein', weight: '4,8 kg', dishwasher: false, induction: false },
    brand: 'Emile Henry', ean: '0020200000001', supplierSku: 'EH-797514', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 28 — WMF Perfect Pro Schnellkochtopf 6 L
  {
    id: 'wmf-kr-600', slug: 'wmf-perfect-pro-schnellkochtopf-6l',
    name: { de: 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion' },
    category: 'kochen', price: 122.50, oldPrice: 209,
    images: [
      p('wmf-perfect-schnellkochtopf-6l', '61SRedAnuyL._AC_SY300_SX300_QL70_ML2_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion'),
      p('wmf-perfect-schnellkochtopf-6l', '610mhKEp-iL._AC_SX569_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion'),
      p('wmf-perfect-schnellkochtopf-6l', '61yLaee+uxL._AC_SX569_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion'),
      p('wmf-perfect-schnellkochtopf-6l', '61ZsPO3BdmL._AC_SX569_.jpg', 'kochen', 'WMF Perfect Pro Schnellkochtopf 6 L – 3 Druckstufen, Induktion')
    ],
    rating: 4.8, reviewCount: 2187, stock: 9, badges: ['premium'],
    description: { de: 'Kochen mit System und höchster Sicherheit. Der WMF Perfect Pro Schnellkochtopf reduziert die Garzeit um bis zu 70% und schont dabei wertvolle Vitamine und Mineralstoffe. Das Herzstück ist der All-in-One-Drehknopf im abnehmbaren Deckelgriff, über den alle Funktionen (Öffnen, Schließen, Abdampfen und Druckstufenwahl) intuitiv gesteuert werden. Ein mehrstufiges Sicherheitssystem mit Restdrucksicherung garantiert maximale Sicherheit. Gefertigt aus unverwüstlichem Cromargan® Edelstahl 18/10 und ausgestattet mit dem TransTherm®-Allherdboden für optimale Wärmeverteilung auf allen Herdarten inklusive Induktion.' },
    shortDescription: { de: 'Zeit- und energiesparendes Kochen mit höchster Sicherheit' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '24 cm Ø, 6 L', weight: '4,1 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530028102', supplierSku: 'WMF-07-9225-9901', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 29 — Zwilling Four Star Santokumesser 18cm
  {
    id: 'zw-ss-180', slug: 'zwilling-four-star-santokumesser-18cm',
    name: { de: 'ZWILLING Four Star Santokumesser 18 cm – Eisgehärtet' },
    category: 'vorbereitung', price: 57.82, oldPrice: 59,
    images: [p('zwilling-four-star-santoku','51Vd1ZELZiL._AC_SX569_.jpg','vorbereitung','Zwilling Four Star Santokumesser 18 cm – Eisgehärtet')],
    rating: 4.8, reviewCount: 1420, stock: 24, badges: ['bestseller'],
    description: { de: 'Höchste Präzision aus Solingen für die anspruchsvolle Küche. Das ZWILLING Four Star Santokumesser mit 18 cm Klinge vereint japanische Klingenform mit deutscher Ingenieurskunst. Die eisgehärtete FRIODUR® Klinge aus speziellem ZWILLING Sonderschmelze-Stahl besticht durch außergewöhnliche Schnitthaltigkeit, Flexibilität und Korrosionsbeständigkeit. Der integrierte Kullenschliff erzeugt beim Schneiden kleine Luftpolster, die das Anhaften von dünnen Scheiben – egal ob Fleisch, Fisch oder Gemüse – effektiv verhindern. Der ergonomische, fugenlose Kunststoffgriff sorgt für optimale Balance und Sicherheit bei jedem Schnitt. Ein langlebiger Klassiker für Profis und Hobbyköche gleichermaßen.' },
    shortDescription: { de: 'Vielseitiges japanisches Kochmesser mit Kullenschliff' },
    specs: { material: 'Spezialstahl, Kunststoff', dimensions: '18 cm Klinge', weight: '180 g', dishwasher: false, induction: false },
    brand: 'ZWILLING', ean: '4009839072970', supplierSku: 'ZW-31077-181', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 30 — Le Creuset Gusseisen Pfanne 26cm
  {
    id: 'lc-pf-260', slug: 'le-creuset-gusseisen-pfanne-26cm',
    name: { de: 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert' },
    category: 'kochen', price: 111.72, oldPrice: 139,
    images: [
      p('le-creuset-pfanne-26cm', '51oAwTNP2qL._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61EfsKj9n0L._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61GN4-9Wq-L._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61MDMAzQoPL._AC_SX300_SY300_QL70_ML2_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert'),
      p('le-creuset-pfanne-26cm', '61abqZLjMRL._AC_SX569_.jpg', 'kochen', 'Le Creuset Gusseisen Pfanne 26 cm – schwarz emailliert')
    ],
    rating: 4.8, reviewCount: 890, stock: 12, badges: ['premium'],
    description: { de: 'Gefertigt aus massivem, emailliertem Gusseisen, ist die Le Creuset Pfanne das ideale Werkzeug für das scharfe Anbraten bei hohen Temperaturen. Die mattschwarze Innenemaillierung wurde speziell für das krosse Braten entwickelt und bildet mit der Zeit eine natürliche Patina, die wie eine Antihaftbeschichtung wirkt. Sie speichert die Wärme hervorragend und sorgt für eine gleichmäßige Hitzeverteilung bis zum Rand. Der ergonomische Gegengriff ermöglicht eine sichere Handhabung, während die Ausgussnasen das tropffreie Servieren von Saucen erleichtern. Unverwüstlich und für alle Herdarten inklusive Induktion sowie für den Backofen und Grill geeignet.' },
    shortDescription: { de: 'Exzellente Wärmespeicherung für perfekte Bratergebnisse' },
    specs: { material: 'Emailliertes Gusseisen', dimensions: '26 cm Ø', weight: '2,6 kg', dishwasher: false, induction: true },
    brand: 'Le Creuset', ean: '0024147259029', supplierSku: 'LC-201822600', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 31 — WMF KÜCHENminis Reiskocher
  {
    id: 'wmf-rk-100', slug: 'wmf-kuechenminis-reiskocher',
    name: { de: 'WMF KÜCHENminis Reiskocher – Chromargan, 1 Liter' },
    category: 'vorbereitung', price: 67.62, oldPrice: 69,
    images: [p('wmf-kuechenminis-reiskocher','71CBOnCsIPL._AC_SX569_.jpg','vorbereitung','WMF KÜCHENminis Reiskocher – Chromargan, 1 Liter')],
    rating: 4.6, reviewCount: 1105, stock: 15, badges: [],
    description: { de: 'Perfekter Reis und vieles mehr auf Knopfdruck. Der kompakte WMF KÜCHENminis Reiskocher aus hochwertigem Cromargan bereitet alle gängigen Reissorten wie Basmati, Jasmin oder Vollkornreis sowie Quinoa und Gemüse besonders schonend zu. Das Geheimnis liegt im doppelt antihaftbeschichteten Innentopf und dem speziellen Dampfgar-Einsatz, der das gleichzeitige Garen von Gemüse ermöglicht. Dank der intelligenten Kochautomatik und der anschließenden Warmhaltefunktion gelingt jedes Gericht auf den Punkt. Der Clou: Der mitgelieferte "To-Go"-Deckel verwandelt den Innentopf in eine auslaufsichere Lunchbox. Inklusive Messbecher und Reislöffel.' },
    shortDescription: { de: 'Platzsparender Reiskocher mit Dampfgar-Funktion' },
    specs: { material: 'Cromargan® Edelstahl', dimensions: '1,0 L Kapazität', weight: '1,4 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530685936', supplierSku: 'WMF-04-1526-0011', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 32 — Staub Cocotte 24cm Rund, Kirschrot
  {
    id: 'st-co-240', slug: 'staub-cocotte-rund-24cm-kirschrot',
    name: { de: 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen' },
    category: 'kochen', price: 185.22, oldPrice: 229,
    images: [
      p('staub-cocotte-24cm', '71BkfO8qOmL._AC_SX300_SY300_QL70_ML2_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen'),
      p('staub-cocotte-24cm', '71kSOh2XmwL._AC_SX522_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen'),
      p('staub-cocotte-24cm', '81CVsdr-fmL._AC_SX522_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen'),
      p('staub-cocotte-24cm', '81qxkyimtFL._AC_SX522_.jpg', 'kochen', 'Staub Cocotte 24 cm Rund, Kirschrot – Gusseisen')
    ],
    rating: 4.9, reviewCount: 2011, stock: 8, badges: ['premium'],
    description: { de: 'Die runde Staub Cocotte aus emailliertem Gusseisen ist das Herzstück jeder anspruchsvollen Küche. Ideal zum langsamen Schmoren, Braten und Garen von Fleisch, Fisch oder Gemüse. Die spezielle Tropfenstruktur auf der Innenseite des Deckels sorgt für einen kontinuierlichen Befeuchtungszyklus des Garguts (Aroma Rain), wodurch Gerichte besonders saftig und aromatisch bleiben. Die mattschwarze Innenemaillierung ist extrem langlebig, kratzfest und ideal zum scharfen Anbraten. Gefertigt in Frankreich, ist diese Cocotte für alle Herdarten inklusive Induktion geeignet und backofenfest bis 250°C.' },
    shortDescription: { de: 'Traditioneller Bräter für saftige Schmorgerichte' },
    specs: { material: 'Emailliertes Gusseisen', dimensions: '24 cm Ø, 3,8 L', weight: '4,6 kg', dishwasher: false, induction: true },
    brand: 'Staub', ean: '3272341024063', supplierSku: 'ST-1102406', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 33 — Peugeot Balkis Pfeffermühle
  {
    id: 'pe-bk-01', slug: 'peugeot-balkis-pfeffermuehle-natur',
    name: { de: 'Peugeot Balkis Pfeffermühle Natur – Holz' },
    category: 'tischaccessoires', price: 26.46, oldPrice: 35,
    images: [p('peugeot-balkis','41+hU-8ZkqL._AC_SX569_.jpg','tischaccessoires','Peugeot Balkis Pfeffermühle Natur – Holz'), p('peugeot-balkis','41fzZfsN56L._AC_SY741_.jpg','tischaccessoires','Peugeot Balkis Pfeffermühle Natur – Holz'), p('peugeot-balkis','71VLzA4K-ZL._AC_SX569_.jpg','tischaccessoires','Peugeot Balkis Pfeffermühle Natur – Holz')],
    rating: 4.6, reviewCount: 432, stock: 29, badges: [],
    description: { de: 'Klassisches Design trifft auf Präzision. Die Peugeot Balkis Pfeffermühle aus naturbelassenem Buchenholz ist ein Blickfang auf jedem Tisch. Das unverwüstliche Peugeot-Stahlmahlwerk ist speziell auf Pfefferkörner abgestimmt und liefert ein perfektes Mahlergebnis.' },
    shortDescription: { de: 'Elegante Pfeffermühle mit erstklassigem Stahlmahlwerk' },
    specs: { material: 'Buchenholz, Stahlmahlwerk', dimensions: 'Variable Höhe', weight: '0,3 kg', dishwasher: false, induction: false },
    brand: 'Peugeot', ean: '3129510008549', supplierSku: 'PE-08549', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 34 — Rösle Knoblauchpresse mit Abstreifer
  {
    id: 'ro-kp-01', slug: 'roesle-knoblauchpresse-abstreifer',
    name: { de: 'Rösle Knoblauchpresse mit Abstreifer – Edelstahl 18/10' },
    category: 'zubehoer', price: 35.28, oldPrice: 35,
    images: [
      p('roesle-knoblauchpresse', '61rYATrQZYL._AC_SX569_.jpg', 'zubehoer', 'Rösle Knoblauchpresse mit Abstreifer – Edelstahl 18'),
      p('roesle-knoblauchpresse', '61VhTywxg9L._AC_SY741_.jpg', 'zubehoer', 'Rösle Knoblauchpresse mit Abstreifer – Edelstahl 18')
    ],
    rating: 4.8, reviewCount: 3120, stock: 18, badges: ['bestseller'],
    description: { de: 'Knoblauch pressen ohne Kraftaufwand. Die Rösle Knoblauchpresse aus hochwertigem Edelstahl 18/10 verfügt über ein patentiertes Klappsystem und einen integrierten Abstreifer. Das Sieb mit 44 konischen Löchern lässt sich zur Reinigung einfach aufklappen.' },
    shortDescription: { de: 'Leistungsstarke Presse mit patentiertem Abstreifer' },
    specs: { material: 'Edelstahl 18/10', dimensions: '20 cm Länge', weight: '360 g', dishwasher: true, induction: false },
    brand: 'Rösle', ean: '4004293128956', supplierSku: 'RO-12895', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 35 — KitchenAid Artisan Handrührer
  {
    id: 'ka-hm-01', slug: 'kitchenaid-artisan-handruehrer-9-stufen',
    name: { de: 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot' },
    category: 'vorbereitung', price: 93.10, oldPrice: 119,
    images: [
      p('kitchenaid-handruehrer', '41Ps1Tr4XjL._AC_SX569_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot'),
      p('kitchenaid-handruehrer', '319sQVMAmAL._AC_SX569_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot'),
      p('kitchenaid-handruehrer', '31uSuWhSWKL._AC_SX569_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot'),
      p('kitchenaid-handruehrer', '31+6FcCV-NL._AC_SY300_SX300_QL70_ML2_.jpg', 'vorbereitung', 'KitchenAid Artisan Handrührer 9 Stufen – Empire Rot')
    ],
    rating: 4.7, reviewCount: 1650, stock: 10, badges: ['premium'],
    description: { de: 'Maximale Leistung für Ihre Küche in kompaktem Design. Der KitchenAid Artisan Handrührer mit 9 Geschwindigkeitsstufen ermöglicht eine präzise Kontrolle für jedes Rezept – von sanftem Rühren bei Stufe 1 bis hin zum schnellen Aufschlagen von Eischnee bei Stufe 9. Der effiziente Gleichstrommotor arbeitet kraftvoll und dennoch leise, während der Sanftanlauf ein Spritzen der Zutaten verhindert. Das digitale LED-Display zeigt die gewählte Geschwindigkeitsstufe jederzeit klar an. Der weiche Komfortgriff sorgt für eine angenehme Handhabung auch bei längerer Nutzung. Inklusive umfangreichem Edelstahl-Zubehör: 2 Turbobesen, 2 Knethaken, 1 Schneebesen mit 16 Drähten, 1 Mixstab und ein praktischer Aufbewahrungsbeutel.' },
    shortDescription: { de: 'Präziser 9-Stufen-Handmixer mit digitalem Display' },
    specs: { material: 'Kunststoff/Edelstahl', dimensions: '15 x 8 x 20 cm', weight: '1,1 kg', dishwasher: false, induction: false },
    brand: 'KitchenAid', ean: '5413184123519', supplierSku: 'KA-5KHM9212EER', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 36 — Tefal Ingenio Expertise
  {
    id: 'tf-ie-300', slug: 'tefal-ingenio-expertise-pfannenset-3-tlg',
    name: { de: 'Tefal Ingenio Expertise Pfannenset 3-tlg – abnehmbarer Griff' },
    category: 'kochen', price: 75.46, oldPrice: 89,
    images: [
      p('tefal-ingenio-expertise', '61JMhm3qjXL._AC_SX569_.jpg', 'kochen', 'Tefal Ingenio Expertise Pfannenset 3-tlg – abnehmbarer Griff'),
      p('tefal-ingenio-expertise', '71Ptr9KStKL._AC_SX569_.jpg', 'kochen', 'Tefal Ingenio Expertise Pfannenset 3-tlg – abnehmbarer Griff')
    ],
    rating: 4.7, reviewCount: 2450, stock: 14, badges: ['bestseller'],
    description: { de: 'Höchste Flexibilität und platzsparende Eleganz für Ihre Küche. Das Tefal Ingenio Expertise Set besteht aus hochwertigen Pfannen mit dem patentierten, abnehmbaren Ingenio-Griff, der mit bis zu 10 kg belastbar ist. Dadurch lassen sich die Pfannen mühelos stapeln, im Backofen verwenden oder direkt am Tisch als Servierschale nutzen. Die Titanium Excellence Antihaftversiegelung ist mit Titanpartikeln verstärkt und hält selbst extremsten Beanspruchungen stand. Der Thermo-Signal Temperaturindikator wird dunkelrot, sobald die Pfanne die optimale Brattemperatur erreicht hat. Geeignet für alle Herdarten inklusive Induktion und backofenfest bis 250°C (ohne Griff).' },
    shortDescription: { de: 'Platzsparendes Pfannenset mit abnehmbarem Griff' },
    specs: { material: 'Aluminium, Titanium Excellence', dimensions: '22/26 cm, 3-tlg', weight: '2,1 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430262147', supplierSku: 'TF-L65091', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 38 — WMF Diadem Plus Topfset 4-teilig
  {
    id: 'wmf-dp-400', slug: 'wmf-diadem-plus-topfset-4-teilig',
    name: { de: 'WMF Diadem Plus Topfset 4-teilig – Cromargan® Edelstahl' },
    category: 'kochen', price: 87.22, oldPrice: 89,
    images: [
      p('wmf-diadem-plus', '1.png', 'kochen', 'WMF Diadem Plus Topfset 4-teilig – Cromargan® Edelstahl'),
      p('wmf-diadem-plus', '2.png', 'kochen', 'WMF Diadem Plus Topfset 4-teilig – Cromargan® Edelstahl')
    ],
    rating: 4.7, reviewCount: 856, stock: 25, badges: ['bestseller'],
    description: { de: 'Die WMF Diadem Plus Serie besticht durch ihr elegantes, bauchiges Design und höchste Funktionalität. Gefertigt aus unverwüstlichem Cromargan® Edelstahl 18/10, sind die Töpfe formstabil, geschmacksneutral und beständig gegen Speisesäuren. Der TransTherm®-Allherdboden sorgt für eine gleichmäßige Wärmeverteilung und lange Wärmespeicherung, was das Kochen besonders energieeffizient macht. Die Güteglasdeckel ermöglichen eine Sichtkontrolle während des Garvorgangs. Das Set ist backofenfest bis 180°C (mit Deckel) bzw. 250°C (ohne Deckel) und spülmaschinengeeignet. Set-Inhalt: 3x Bratentopf mit Deckel (16cm, 20cm, 24cm), 1x Fleischtopf mit Deckel (20cm).' },
    shortDescription: { de: 'Elegantes Topfset aus Cromargan® – TransTherm®-Boden für alle Herdarten' },
    specs: { material: 'Cromargan® 18/10 Edelstahl, Glas', dimensions: '4-teilig', weight: '4,8 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530579921', supplierSku: 'WMF-07-3004-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 39 — ZWILLING Joy Kochtopfset 5-teilig
  {
    id: 'zw-joy-500', slug: 'zwilling-joy-kochtopfset-5-teilig',
    name: { de: 'ZWILLING Joy Kochtopfset 5-teilig – SIGMA Classic+ Boden' },
    category: 'kochen', price: 116.62, oldPrice: 119,
    images: [p('zwilling-joy', '1.png', 'kochen', 'ZWILLING Joy Kochtopfset 5-teilig - SIGMA Classic+ Boden')],
    rating: 4.6, reviewCount: 642, stock: 18, badges: ['new'],
    description: { de: 'Das ZWILLING Joy Kochtopfset ist der perfekte Einstieg in die Welt des anspruchsvollen Kochens. Das moderne Design wird kombiniert mit dem bewährten SIGMA Classic+ Sandwichboden, der dank seines starken Aluminiumkerns die Wärme optimal leitet und speichert. Gefertigt aus hochwertigem 18/10 Edelstahl, verfügen die Töpfe über eine integrierte Füllskala und einen gefalteten Schüttrand für punktgenaues Ausgießen. Die dicht schließenden Glasdeckel ermöglichen energiesparendes Sichtkochen. Set-Inhalt: 3x Kochtopf (16cm, 20cm, 24cm), 1x Bratentopf (20cm), 1x Stielkasserolle (16cm).' },
    shortDescription: { de: 'Modernes Design trifft auf hervorragende Wärmeleitung – SIGMA Classic+' },
    specs: { material: 'Edelstahl 18/10', dimensions: '5-teilig', weight: '5,5 kg', dishwasher: true, induction: true },
    brand: 'ZWILLING', ean: '4009839304140', supplierSku: 'ZW-64040-005', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 40 — Fissler Original-Profi Collection 4-teilig
  {
    id: 'fi-opc-400', slug: 'fissler-original-profi-collection-4-teilig',
    name: { de: 'Fissler Original-Profi Collection 4-teilig – Profi-Qualität' },
    category: 'kochen', price: 244.02, oldPrice: 249,
    images: [
      p('fissler-profi-set', '1.png', 'kochen', 'Fissler Original-Profi Collection 4-teilig – Profi-Qualität'),
      p('fissler-profi-set', '2.png', 'kochen', 'Fissler Original-Profi Collection 4-teilig – Profi-Qualität'),
      p('fissler-profi-set', '3.png', 'kochen', 'Fissler Original-Profi Collection 4-teilig – Profi-Qualität')
    ],
    rating: 4.9, reviewCount: 1120, stock: 12, badges: ['premium'],
    description: { de: 'Die Fissler original-profi collection wurde ursprünglich von Profiköchen für Profiköche entwickelt. Diese extrem robusten Töpfe aus mattiertem Edelstahl 18/10 halten selbst härtester Beanspruchung stand. Der Cookstar Allherdboden garantiert eine perfekte Wärmeaufnahme und -verteilung auf allen Herdarten, inklusive Induktion. Die Kaltmetallgriffe bleiben beim Kochen angenehm kühl, und die schwere Deckelkonstruktion sorgt dafür, dass Hitze und Feuchtigkeit optimal im Topf zirkulieren. Mit praktischer Messskala und breitem Schüttrand. Set-Inhalt: 3x Kochtopf (16cm, 20cm, 24cm) inkl. Deckel, 1x Bratentopf (20cm) inkl. Deckel.' },
    shortDescription: { de: 'Profi-Qualität Made in Germany – extrem robust und langlebig' },
    specs: { material: 'Edelstahl 18/10 mattiert', dimensions: '4-teilig', weight: '7,2 kg', dishwasher: true, induction: true },
    brand: 'Fissler', ean: '4009209343310', supplierSku: 'FI-084-123-04-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 41 — Silit Nature Green Topfset 4-teilig
  {
    id: 'si-ng-400', slug: 'silit-nature-green-topfset-4-teilig',
    name: { de: 'Silit Nature Green Topfset 4-teilig – Silargan® Funktionskeramik' },
    category: 'kochen', price: 155.82, oldPrice: 159,
    images: [
      p('silit-nature', '1.png', 'kochen', 'Silit Nature Green Topfset 4-teilig – Silargan® Funktionskeramik'),
      p('silit-nature', '2.png', 'kochen', 'Silit Nature Green Topfset 4-teilig – Silargan® Funktionskeramik'),
      p('silit-nature', '3.png', 'kochen', 'Silit Nature Green Topfset 4-teilig – Silargan® Funktionskeramik')
    ],
    rating: 4.8, reviewCount: 428, stock: 9, badges: ['premium'],
    description: { de: 'Nachhaltig und gesund kochen mit Silit Silargan®. Die porenfrei geschlossene, nickelfreie Oberfläche ist besonders robust, schneid- und kratzfest und bewahrt das natürliche Aroma der Zutaten. Der extrastarke Energiesparboden ist perfekt für die Induktion optimiert. Einzigartig ist der Edelstahldeckel mit integriertem Kontrollsystem zum sicheren Abdampfen und Abgießen. Die frische grüne Farbe macht dieses Set zum Blickfang. Set-Inhalt: 3x Fleischtopf (16cm, 20cm, 24cm), 1x Bratentopf (20cm).' },
    shortDescription: { de: 'Silargan® – Funktionskeramik für geschmacksechtes Kochen' },
    specs: { material: 'Silargan® Funktionskeramik', dimensions: '4-teilig', weight: '8,5 kg', dishwasher: true, induction: true },
    brand: 'Silit', ean: '4000530674312', supplierSku: 'SI-2109297178', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 42 — Tefal Ingenio Preference Set 10-teilig
  {
    id: 'tf-ip-100', slug: 'tefal-ingenio-preference-set-10-teilig',
    name: { de: 'Tefal Ingenio Preference Set 10-teilig – Edelstahl, Induktion' },
    category: 'kochen', price: 175.42, oldPrice: 179,
    images: [p('tefal-ingenio-pref', '1.png', 'kochen', 'Tefal Ingenio Preference Set 10-teilig – Edelstahl, Induktion')],
    rating: 4.7, reviewCount: 1540, stock: 14, badges: ['bestseller'],
    description: { de: 'Maximale Vielseitigkeit in der Premium-Ausführung aus Edelstahl. Das Tefal Ingenio Preference Set besticht durch den patentierten abnehmbaren Griff, der es ermöglicht, mit nur einem Klick vom Herd in den Ofen und an den Tisch zu wechseln. Dank der Titanium Excellence Antihaftversiegelung sind die Pfannen extrem widerstandsfähig. Der Thermo-Spot zeigt die ideale Brattemperatur an. Das Set ist perfekt stapelbar und spart so bis zu 50% Platz im Schrank. Inhalt: Pfannen 22/26/28cm, Stielkasserollen 16/20cm, Schmortopf 24cm, Glasdeckel, Kunststoffdeckel und 2 Griffe.' },
    shortDescription: { de: 'Premium-Edelstahlset mit abnehmbarem Griff – platzsparend & vielseitig' },
    specs: { material: 'Edelstahl, Titanium Excellence', dimensions: '10-teilig', weight: '6,8 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430314143', supplierSku: 'TF-L940S10', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 43 — WMF Fusiontec Topfset 4-teilig
  {
    id: 'wmf-ft-400', slug: 'wmf-fusiontec-topfset-4-teilig',
    name: { de: 'WMF Fusiontec Topfset 4-teilig – High-Tech Funktionskeramik' },
    category: 'kochen', price: 195.02, oldPrice: 199,
    images: [
      p('wmf-fusiontec', '1.png', 'kochen', 'WMF Fusiontec Topfset 4-teilig – High-Tech Funktionskeramik'),
      p('wmf-fusiontec', '2.png', 'kochen', 'WMF Fusiontec Topfset 4-teilig – High-Tech Funktionskeramik')
    ],
    rating: 4.9, reviewCount: 312, stock: 7, badges: ['premium'],
    description: { de: 'WMF Fusiontec ist das Beste aus zwei Welten: Die Schnelligkeit von Kupfer und die Robustheit von Gusseisen. In einem aufwendigen Verfahren werden Spezialstahl und natürliche Mineralien zu einem untrennbaren Material verschmolzen. Das Ergebnis ist eine extrem harte, glatte und porenfreie Oberfläche, die exzellente Wärmeeigenschaften bietet. Die Töpfe sind Made in Germany, backofenfest und für alle Herdarten optimiert. Set-Inhalt: 3x Fleischtopf (16cm, 20cm, 24cm), 1x Bratentopf (20cm) – alle mit Glasdeckel.' },
    shortDescription: { de: 'Fusiontec – High-Tech Material für lebenslange Freude am Kochen' },
    specs: { material: 'Fusiontec (Stahl-Mineral-Kern)', dimensions: '4-teilig', weight: '9,2 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530702312', supplierSku: 'WMF-05-1518-5290', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 44 — ZWILLING Plus Bratentopf 24cm
  {
    id: 'zw-pl-240', slug: 'zwilling-plus-bratentopf-24cm',
    name: { de: 'ZWILLING Plus Bratentopf 24 cm – mit Glasdeckel, 4 L' },
    category: 'kochen', price: 77.42, oldPrice: 79,
    images: [
      p('zwilling-plus-topf', '1.png', 'kochen', 'ZWILLING Plus Bratentopf 24cm - mit Glasdeckel 4L'),
      p('zwilling-plus-topf', '2.png', 'kochen', 'ZWILLING Plus Bratentopf 24cm - mit Glasdeckel 4L'),
      p('zwilling-plus-topf', '3.png', 'kochen', 'ZWILLING Plus Bratentopf 24cm - mit Glasdeckel 4L')
    ],
    rating: 4.7, reviewCount: 284, stock: 22, badges: [],
    description: { de: 'Der ZWILLING Plus Bratentopf ist der Spezialist für das Anbraten und anschließende Schmoren. Mit 4 Litern Fassungsvermögen bietet er ausreichend Platz für Familienportionen. Der SIGMA Classic Sandwichboden mit Aluminiumkern sorgt für eine schnelle und gleichmäßige Wärmeverteilung bis in die Wand. Gefertigt aus poliertem 18/10 Edelstahl, ist der Topf hygienisch, geschmacksneutral und pflegeleicht. Der passgenaue Glasdeckel ermöglicht wasserarmes Garen im eigenen Saft.' },
    shortDescription: { de: 'Hochwertiger Schmortopf für perfekte Bratergebnisse' },
    specs: { material: 'Edelstahl 18/10', dimensions: '24 cm Ø, 4 L', weight: '2,1 kg', dishwasher: true, induction: true },
    brand: 'ZWILLING', ean: '4009839343316', supplierSku: 'ZW-66002-240', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 45 — Fissler Crispy Steelux Premium Pfanne 28cm
  {
    id: 'fi-csp-280', slug: 'fissler-crispy-steelux-premium-pfanne-28cm',
    name: { de: 'Fissler Crispy Steelux Premium Pfanne 28 cm – Edelstahl' },
    category: 'kochen', price: 87.22, oldPrice: 89,
    images: [
      p('fissler-crispy', '1.png', 'kochen', 'Fissler Crispy Steelux Premium Pfanne 28 cm – Edelstahl'),
      p('fissler-crispy', '2.png', 'kochen', 'Fissler Crispy Steelux Premium Pfanne 28 cm – Edelstahl'),
      p('fissler-crispy', '3.png', 'kochen', 'Fissler Crispy Steelux Premium Pfanne 28 cm – Edelstahl')
    ],
    rating: 4.8, reviewCount: 512, stock: 15, badges: ['bestseller'],
    description: { de: 'Die ideale Pfanne für das scharfe Anbraten bei hohen Temperaturen. Die Fissler Crispy Steelux Premium aus rostfreiem Edelstahl 18/10 verfügt über die Novogrill-Bratfläche, die für einen Grilleffekt sorgt und das Anhaften verhindert. Der Cookstar Allherdboden macht sie extrem stabil und perfekt für Induktionsherde geeignet. Mit Kaltmetallgriff und integrierter Skalierung. Ideal für saftige Steaks und krosses Geflügel.' },
    shortDescription: { de: 'Perfekt für krosses Braten – Novogrill-Fläche & Cookstar-Boden' },
    specs: { material: 'Edelstahl 18/10', dimensions: '28 cm Ø', weight: '1,8 kg', dishwasher: true, induction: true },
    brand: 'Fissler', ean: '4009209310312', supplierSku: 'FI-121-101-28-100', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 46 — Demeyere Industry 5 Bratpfanne 28cm
  {
    id: 'de-ind-280', slug: 'demeyere-industry-5-bratpfanne-28cm',
    name: { de: 'Demeyere Industry 5 Bratpfanne 28 cm – 5-Lagen-Material' },
    category: 'kochen', price: 146.02, oldPrice: 149,
    images: [
      p('demeyere-industry', '1.png', 'kochen', 'Demeyere Industry 5 Bratpfanne 28 cm – 5-Lagen-Material'),
      p('demeyere-industry', '2.png', 'kochen', 'Demeyere Industry 5 Bratpfanne 28 cm – 5-Lagen-Material'),
      p('demeyere-industry', '3.png', 'kochen', 'Demeyere Industry 5 Bratpfanne 28 cm – 5-Lagen-Material')
    ],
    rating: 4.9, reviewCount: 186, stock: 5, badges: ['premium'],
    description: { de: 'Belgische Spitzenqualität für leidenschaftliche Köche. Die Demeyere Industry 5 Pfanne besteht aus einem 5-Schicht-Material, das die Wärme blitzschnell und absolut gleichmäßig bis zum Rand verteilt. Die Silvinox® Oberflächenbehandlung sorgt dafür, dass der Edelstahl silberweiß bleibt und leicht zu reinigen ist. Dank der speziellen TriplInduc® Technologie ist die Pfanne auf Induktionsfeldern bis zu 30% effizienter. Ein ergonomischer, kühler Stielgriff aus gegossenem Edelstahl bietet perfekten Halt. 30 Jahre Herstellergarantie.' },
    shortDescription: { de: '5-Lagen-Material für höchste Präzision und Reaktionsfähigkeit' },
    specs: { material: '5-Schicht-Mehrschichtmaterial', dimensions: '28 cm Ø', weight: '1,9 kg', dishwasher: true, induction: true },
    brand: 'Demeyere', ean: '5412191486284', supplierSku: 'DE-40850-678', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 47 — Le Creuset 3-ply Stainless Steel Set 3-teilig
  {
    id: 'lc-3ply-300', slug: 'le-creuset-3-ply-stainless-steel-set-3-teilig',
    name: { de: 'Le Creuset 3-ply Stainless Steel Set 3-teilig – Mehrschicht' },
    category: 'kochen', price: 224.42, oldPrice: 229,
    images: [
      p('le-creuset-3ply', '1.png', 'kochen', 'Le Creuset 3-ply Stainless Steel Set 3-teilig – Mehrschicht'),
      p('le-creuset-3ply', '2.png', 'kochen', 'Le Creuset 3-ply Stainless Steel Set 3-teilig – Mehrschicht')
    ],
    rating: 4.8, reviewCount: 156, stock: 8, badges: ['premium'],
    description: { de: 'Eleganz und Performance von Le Creuset. Die 3-ply-Serie besteht aus einem durchgehenden Mehrschichtmaterial: Einem Aluminiumkern, der zwischen zwei Schichten hochwertigem Edelstahl (18/10 innen, 18/0 außen für Induktion) eingebettet ist. Dies garantiert eine perfekte Wärmeleitung vom Boden bis zum Rand. Die Töpfe verfügen über eine praktische Innenskalierung, einen Tropfschutz-Schüttrand und ergonomische Griffe. Set-Inhalt: Kochtopf 20cm mit Deckel, Bratentopf 24cm mit Deckel, Stielkasserolle 16cm mit Deckel.' },
    shortDescription: { de: 'Professionelles Mehrschichtmaterial für gleichmäßiges Garen' },
    specs: { material: '3-ply Mehrschichtmaterial', dimensions: '3-teilig', weight: '5,1 kg', dishwasher: true, induction: true },
    brand: 'Le Creuset', ean: '0630870141123', supplierSku: 'LC-962091000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 48 — Tefal Unlimited On Bratpfanne 28cm
  {
    id: 'tf-uo-280', slug: 'tefal-unlimited-on-bratpfanne-28cm',
    name: { de: 'Tefal Unlimited On Bratpfanne 28 cm – Anti-Kratz Beschichtung' },
    category: 'kochen', price: 48.02, oldPrice: 49,
    images: [
      p('tefal-unlimited', '1.png', 'kochen', 'Tefal Unlimited On Bratpfanne 28 cm – Anti-Kratz Beschichtung'),
      p('tefal-unlimited', '2.png', 'kochen', 'Tefal Unlimited On Bratpfanne 28 cm – Anti-Kratz Beschichtung'),
      p('tefal-unlimited', '3.png', 'kochen', 'Tefal Unlimited On Bratpfanne 28 cm – Anti-Kratz Beschichtung')
    ],
    rating: 4.7, reviewCount: 2840, stock: 45, badges: ['bestseller'],
    description: { de: 'Die robusteste Antihaft-Pfanne von Tefal. Die Unlimited On Serie verfügt über die neue Titanium Anti-Scratch-Beschichtung, die sechsmal widerstandsfähiger gegen Kratzer ist als Standardbeschichtungen. Sogar die Verwendung von Metallküchenhelfern ist möglich. Die Thermo-Signal™ Technologie zeigt die optimale Starttemperatur für das Braten an. Dank des Thermo-Fusion™+ Bodens heizt die Pfanne besonders schnell auf und verteilt die Hitze gleichmäßig für perfekte Ergebnisse.' },
    shortDescription: { de: 'Extrem kratzfest und langlebig – Titanium Anti-Scratch' },
    specs: { material: 'Aluminium, Titanium Anti-Scratch', dimensions: '28 cm Ø', weight: '1,3 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430314129', supplierSku: 'TF-G25506', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 49 — ZWILLING Marquina Plus Pfanne 28cm
  {
    id: 'zw-mq-280', slug: 'zwilling-marquina-plus-pfanne-28cm',
    name: { de: 'ZWILLING Marquina Plus Pfanne 28 cm – 4-Lagen Duraslide' },
    category: 'kochen', price: 57.82, oldPrice: 59,
    images: [
      p('zwilling-marquina', '1.png', 'kochen', 'ZWILLING Marquina Plus Pfanne 28cm - 4-Lagen Duraslide'),
      p('zwilling-marquina', '2.png', 'kochen', 'ZWILLING Marquina Plus Pfanne 28cm - 4-Lagen Duraslide'),
      p('zwilling-marquina', '3.png', 'kochen', 'ZWILLING Marquina Plus Pfanne 28cm - 4-Lagen Duraslide')
    ],
    rating: 4.6, reviewCount: 892, stock: 31, badges: [],
    description: { de: 'Italienisches Design trifft auf deutsche Technologie. Die Pfanne aus geschmiedetem Aluminium mit Granit-Optik ist mit der 4-lagigen Duraslide® Granite Antihaftbeschichtung ausgestattet, die eine hohe Abriebfestigkeit garantiert. Der starke Boden mit SIGMA Rapid Induktionsplatte sorgt für eine extrem schnelle Aufheizung und eine gleichmäßige Wärmeverteilung. Der ergonomische Stay-Cool-Griff aus Kunststoff liegt sicher in der Hand. Ideal für die fettarme Zubereitung von empfindlichen Speisen wie Eiern oder Fisch.' },
    shortDescription: { de: 'Geschmiedetes Aluminium mit langlebiger Granit-Antihaftbeschichtung' },
    specs: { material: 'Aluminium geschmiedet, Duraslide Granite', dimensions: '28 cm Ø', weight: '1,2 kg', dishwasher: true, induction: true },
    brand: 'ZWILLING', ean: '4009839343316', supplierSku: 'ZW-66002-280', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 50 — WMF Permadur Premium Pfanne 28cm
  {
    id: 'wmf-pp-280', slug: 'wmf-permadur-premium-pfanne-28cm',
    name: { de: 'WMF Permadur Premium Pfanne 28 cm – Made in Germany' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [
      p('wmf-permadur', '1.png', 'kochen', 'WMF Permadur Premium Pfanne 28cm - Made in Germany'),
      p('wmf-permadur', '2.png', 'kochen', 'WMF Permadur Premium Pfanne 28cm - Made in Germany'),
      p('wmf-permadur', '3.png', 'kochen', 'WMF Permadur Premium Pfanne 28cm - Made in Germany')
    ],
    rating: 4.8, reviewCount: 1420, stock: 19, badges: ['premium'],
    description: { de: 'Die WMF Permadur Premium wird in Deutschland aus hochwertigem Aluminiumguss gefertigt. Die extrem robuste, mehrlagige PermaDur Antihaftbeschichtung ist besonders langlebig und ideal für alles, was schnell und bei hoher Hitze angebraten wird. Der TransTherm®-Allherdboden gewährleistet eine optimale Wärmeverteilung und -speicherung. Der ergonomische Griff mit Flammschutz sorgt für eine sichere Handhabung. Eine Pfanne für höchste Ansprüche im täglichen Einsatz.' },
    shortDescription: { de: 'Aluminiumguss mit 5-Sterne PermaDur Beschichtung – Made in Germany' },
    specs: { material: 'Aluminiumguss, PermaDur', dimensions: '28 cm Ø', weight: '1,6 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530685936', supplierSku: 'WMF-05-7528-4021', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 51 — Fissler Adamant Classic Pfanne 28cm
  {
    id: 'fi-ac-280', slug: 'fissler-adamant-classic-pfanne-28cm',
    name: { de: 'Fissler Adamant Classic Pfanne 28 cm – extrem kratzfest' },
    category: 'kochen', price: 77.42, oldPrice: 79,
    images: [
      p('fissler-adamant', '1.png', 'kochen', 'Fissler Adamant Classic Pfanne 28 cm – extrem kratzfest'),
      p('fissler-adamant', '2.png', 'kochen', 'Fissler Adamant Classic Pfanne 28 cm – extrem kratzfest'),
      p('fissler-adamant', '3.png', 'kochen', 'Fissler Adamant Classic Pfanne 28 cm – extrem kratzfest')
    ],
    rating: 4.8, reviewCount: 956, stock: 24, badges: ['bestseller'],
    description: { de: 'Kochen ohne Kompromisse. Die Fissler Adamant Classic Pfanne ist mit einer extrem harten Versiegelung ausgestattet, die Siliziumkarbid-Partikel enthält. Diese verleihen der Oberfläche eine haptik wie Stein und machen sie so robust, dass sogar die Verwendung von Küchenhelfern aus Metall möglich ist. Der Cookstar® Allherdboden sorgt für eine optimale Wärmeaufnahme, -verteilung und -speicherung auf allen Herdarten inklusive Induktion. Der ergonomische Sicherheitsgriff mit Fingerschutz schützt vor Hitze und liegt perfekt in der Hand. Made in Germany für höchste Ansprüche.' },
    shortDescription: { de: 'Extrem kratzfeste Beschichtung mit Siliziumkarbid – induktionsgeeignet' },
    specs: { material: 'Aluminium, Adamant-Versiegelung', dimensions: '28 cm Ø', weight: '1,4 kg', dishwasher: true, induction: true },
    brand: 'Fissler', ean: '4009209363646', supplierSku: 'FI-157-304-28-100', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 52 — Ballarini Salina Pfannenset 3-teilig
  {
    id: 'ba-sl-300', slug: 'ballarini-salina-pfannenset-3-teilig',
    name: { de: 'Ballarini Salina Pfannenset 3-teilig – Granitium Ti-X' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [p('ballarini-salina-pfannenset-3-teilig', '1.png', 'kochen', 'Ballarini Salina Pfannenset 3-teilig – Granitium Ti-X'),
          p('ballarini-salina-pfannenset-3-teilig', '2.png', 'kochen', 'Ballarini Salina Pfannenset 3-teilig – Granitium Ti-X'),
          p('ballarini-salina-pfannenset-3-teilig', '3.png', 'kochen', 'Ballarini Salina Pfannenset 3-teilig – Granitium Ti-X'),
          p('ballarini-salina-pfannenset-3-teilig', '4.png', 'kochen', 'Ballarini Salina Pfannenset 3-teilig – Granitium Ti-X'),],
    rating: 4.7, reviewCount: 432, stock: 15, badges: ['new'],
    description: { de: 'Italienische Leidenschaft für Ihre Küche. Das 3-teilige Ballarini Salina Set besticht durch die innovative 7-lagige Granitium Ti-X Antihaftbeschichtung mit Titan-Verstärkung. Der speziell entwickelte Radiant Induction Boden garantiert eine hervorragende Wärmeleitung auf Induktionsherden. Die ergonomischen Edelstahlgriffe bleiben dank der Stay-Cool-Funktion beim Kochen angenehm kühl. Das Set ist extrem kratzfest, pflegeleicht und backofenfest bis 250°C. Bestehend aus Pfannen in den Größen 20cm, 24cm und 28cm. Design by Matteo Thun & Antonio Rodriguez.' },
    shortDescription: { de: '7-lagige Antihaftbeschichtung mit Titan – Made in Italy' },
    specs: { material: 'Aluminium geschmiedet, Granitium Ti-X', dimensions: '20/24/28 cm', weight: '3,5 kg', dishwasher: true, induction: true },
    brand: 'Ballarini', ean: '8003150504143', supplierSku: 'BA-1006123', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 53 — SKK Titanium 2000 Plus Pfanne 28cm
  {
    id: 'skk-ti-280', slug: 'skk-titanium-2000-plus-pfanne-28cm',
    name: { de: 'SKK Titanium 2000 Plus Pfanne 28 cm – 8mm Boden' },
    category: 'kochen', price: 87.22, oldPrice: 89,
    images: [
      p('skk-titanium', '1.png', 'kochen', 'SKK Titanium 2000 Plus Pfanne 28 cm – 8mm Boden'),
      p('skk-titanium', '2.png', 'kochen', 'SKK Titanium 2000 Plus Pfanne 28 cm – 8mm Boden')
    ],
    rating: 4.9, reviewCount: 156, stock: 9, badges: ['premium'],
    description: { de: 'Manufakturqualität aus Deutschland. Die SKK Titanium 2000 Plus ist eine extrem schwere Aluguss-Pfanne mit einem 8 mm starken Induktionsboden, der sich niemals verzieht. Die 6-lagige Titanium-Antihaftversiegelung wird im Hochtemperaturverfahren aufgebracht und ist extrem widerstandsfähig. Dank der hervorragenden Wärmeleitung und -speicherung eignet sich die Pfanne ideal für das scharfe Anbraten und anschließende Garen bei reduzierter Hitze. Der abnehmbare Stiel ermöglicht die problemlose Verwendung im Backofen und spart Platz im Schrank. Ein Produkt für das ganze Leben.' },
    shortDescription: { de: 'Handgegossene Profi-Qualität mit 8mm Boden – Made in Germany' },
    specs: { material: 'Aluminiumguss, Titanium-Versiegelung', dimensions: '28 cm Ø', weight: '2,2 kg', dishwasher: true, induction: true },
    brand: 'SKK', ean: '4021251052804', supplierSku: 'SKK-5280', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 54 — Berndes Vario Click Induction Pfanne 28cm
  {
    id: 'be-vc-280', slug: 'berndes-vario-click-induction-pfanne-28cm',
    name: { de: 'Berndes Vario Click Induction Pfanne 28 cm – abnehmbarer Stiel' },
    category: 'kochen', price: 53.90, oldPrice: 55,
    images: [
      p('berndes-vario', '1.png', 'kochen', 'Berndes Vario Click Induction Pfanne 28 cm – abnehmbarer Stiel'),
      p('berndes-vario', '2.png', 'kochen', 'Berndes Vario Click Induction Pfanne 28 cm – abnehmbarer Stiel'),
      p('berndes-vario', '3.png', 'kochen', 'Berndes Vario Click Induction Pfanne 28 cm – abnehmbarer Stiel')
    ],
    rating: 4.7, reviewCount: 612, stock: 18, badges: [],
    description: { de: 'Flexibilität auf höchstem Niveau. Die Berndes Vario Click Pfanne aus hochwertigem Aluguss verfügt über einen patentierten abnehmbaren Stiel, der durch einfaches "Klicken" sicher befestigt oder gelöst werden kann. Die 3-lagige Teflon™ Radiance Antihaftbeschichtung ist mit Edelstahlpartikeln verstärkt und sorgt für eine exzellente Wärmeverteilung. Der ca. 6 mm starke Premium-Induktionsboden ist extrem formstabil und energieeffizient. Dank des abnehmbaren Griffs ist die Pfanne voll backofentauglich und lässt sich extrem platzsparend verstauen.' },
    shortDescription: { de: 'Hochwertiger Aluguss mit patentiertem Vario Click Griff' },
    specs: { material: 'Aluminiumguss, Teflon Radiance', dimensions: '28 cm Ø', weight: '1,5 kg', dishwasher: true, induction: true },
    brand: 'Berndes', ean: '4006189074284', supplierSku: 'BE-074028', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 55 — ELO Pure Rubin Pfannenset 2-teilig
  {
    id: 'elo-pr-200', slug: 'elo-pure-rubin-pfannenset-2-teilig',
    name: { de: 'ELO Pure Rubin Pfannenset 2-teilig – Turbo-Induktion' },
    category: 'kochen', price: 57.82, oldPrice: 59,
    images: [
      p('elo-rubin', '1.png', 'kochen', 'ELO Pure Rubin Pfannenset 2-teilig – Turbo-Induktion'),
      p('elo-rubin', '2.png', 'kochen', 'ELO Pure Rubin Pfannenset 2-teilig – Turbo-Induktion'),
      p('elo-rubin', '3.png', 'kochen', 'ELO Pure Rubin Pfannenset 2-teilig – Turbo-Induktion')
    ],
    rating: 4.5, reviewCount: 894, stock: 22, badges: ['bestseller'],
    description: { de: 'Edles Design und effiziente Technik. Das ELO Pure Rubin Set besteht aus zwei hochwertigen Pfannen aus geschmiedetem Aluminium mit einer langlebigen 3-lagigen Antihaftbeschichtung. Das Highlight ist der vollflächige Turbo-Induktionsboden, der im Vergleich zu herkömmlichen Böden bis zu 35% Energie spart und die Aufheizzeit deutlich verkürzt. Die ergonomischen Soft-Touch-Griffe mit Flammschutz liegen sicher und angenehm in der Hand. Die tiefrote Außenfarbe verleiht dem Set eine moderne Optik. Set-Inhalt: Pfannen 24cm und 28cm.' },
    shortDescription: { de: 'Turbo-Induktionsboden für bis zu 35% Energieersparnis' },
    specs: { material: 'Aluminium geschmiedet', dimensions: '24/28 cm', weight: '2,4 kg', dishwasher: true, induction: true },
    brand: 'ELO', ean: '4006925906281', supplierSku: 'ELO-90628', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 56 — Rösle Silence Pfanne 28cm
  {
    id: 'ro-si-280', slug: 'roesle-silence-pfanne-28cm',
    name: { de: 'Rösle Silence Pfanne 28 cm – Edelstahl mit Antihaft' },
    category: 'kochen', price: 77.42, oldPrice: 79,
    images: [
      p('roesle-silence', '1.png', 'kochen', 'Rösle Silence Pfanne 28 cm – Edelstahl mit Antihaft'),
      p('roesle-silence', '2.png', 'kochen', 'Rösle Silence Pfanne 28 cm – Edelstahl mit Antihaft'),
      p('roesle-silence', '3.png', 'kochen', 'Rösle Silence Pfanne 28 cm – Edelstahl mit Antihaft')
    ],
    rating: 4.8, reviewCount: 312, stock: 14, badges: ['premium'],
    description: { de: 'Qualität, die man spürt. Die Rösle Silence Pfanne aus hochwertigem Edelstahl 18/10 kombiniert die Robustheit von Stahl mit den Vorzügen einer Premium-Antihaftversiegelung (ProPlex®). Der gekapselte Sandwichboden mit Aluminiumkern sorgt für eine schnelle und gleichmäßige Wärmeverteilung. Besonders hervorzuheben ist der ergonomische Edelstahlgriff mit Silikoneinlage, der nicht nur sicher in der Hand liegt, sondern auch für eine angenehme Haptik sorgt. Die Pfanne ist hitzebeständig bis 200°C und für alle Herdarten, insbesondere Induktion, optimiert.' },
    shortDescription: { de: 'Premium-Edelstahlpfanne mit ProPlex® Antihaftversiegelung' },
    specs: { material: 'Edelstahl 18/10, ProPlex', dimensions: '28 cm Ø', weight: '1,6 kg', dishwasher: true, induction: true },
    brand: 'Rösle', ean: '4004293131680', supplierSku: 'RO-13168', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 57 — Kopf Josie Pfanne 28cm
  {
    id: 'ko-jo-280', slug: 'kopf-josie-pfanne-28cm',
    name: { de: 'Kopf Josie Pfanne 28 cm – ILAG Ultimate Beschichtung' },
    category: 'kochen', price: 38.22, oldPrice: 39,
    images: [p('kopf-josie-pfanne-28cm', '1.png', 'kochen', 'Kopf Josie Pfanne 28 cm – ILAG Ultimate Beschichtung'),
          p('kopf-josie-pfanne-28cm', '2.png', 'kochen', 'Kopf Josie Pfanne 28 cm – ILAG Ultimate Beschichtung'),
          p('kopf-josie-pfanne-28cm', '3.png', 'kochen', 'Kopf Josie Pfanne 28 cm – ILAG Ultimate Beschichtung'),],
    rating: 4.4, reviewCount: 1240, stock: 35, badges: [],
    description: { de: 'Hervorragendes Preis-Leistungs-Verhältnis für den täglichen Gebrauch. Die Kopf Josie Pfanne aus robustem Aluguss ist mit der hochwertigen ILAG Ultimate Antihaftbeschichtung ausgestattet, die fettarmes Braten und eine kinderleichte Reinigung ermöglicht. Der starke Induktionsboden sorgt für eine gute Hitzeverteilung und Formstabilität. Ein besonderes Feature ist der ergonomische Soft-Touch-Griff, der durch eine einfache Verriegelung abgenommen werden kann – ideal für die Verwendung im Backofen oder zur platzsparenden Aufbewahrung.' },
    shortDescription: { de: 'Robuster Aluguss mit abnehmbarem Griff – ideal für Einsteiger' },
    specs: { material: 'Aluminiumguss, ILAG Ultimate', dimensions: '28 cm Ø', weight: '1,2 kg', dishwasher: true, induction: true },
    brand: 'Kopf', ean: '4025457253444', supplierSku: 'KO-253444', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 58 — WMF Provence Plus Kochtopf 20cm
  {
    id: 'wmf-pp-200', slug: 'wmf-provence-plus-kochtopf-20cm',
    name: { de: 'WMF Provence Plus Kochtopf 20 cm – Cromargan® Edelstahl' },
    category: 'kochen', price: 48.02, oldPrice: 49,
    images: [p('wmf-provence-plus-kochtopf-20cm', '1.png', 'kochen', 'WMF Provence Plus Kochtopf 20cm - Cromargan Edelstahl'),
          p('wmf-provence-plus-kochtopf-20cm', '2.png', 'kochen', 'WMF Provence Plus Kochtopf 20cm - Cromargan Edelstahl'),
          p('wmf-provence-plus-kochtopf-20cm', '3.png', 'kochen', 'WMF Provence Plus Kochtopf 20cm - Cromargan Edelstahl'),],
    rating: 4.7, reviewCount: 2150, stock: 42, badges: ['bestseller'],
    description: { de: 'Ein Klassiker in jeder Küche. Der WMF Provence Plus Kochtopf aus poliertem Cromargan® Edelstahl 18/10 verbindet zeitloses Design mit bester Kochperformance. Mit einem Fassungsvermögen von 3 Litern ist er ideal für Beilagen oder kleinere Eintöpfe. Der TransTherm®-Allherdboden verteilt die Wärme gleichmäßig und speichert sie lange, was auf Induktionsfeldern für maximale Effizienz sorgt. Der hitzebeständige Güteglasdeckel ermöglicht das Sichtkochen, während der breite Schüttrand ein tropffreies Ausgießen garantiert.' },
    shortDescription: { de: 'Zeitloser Edelstahl-Kochtopf mit TransTherm®-Boden' },
    specs: { material: 'Cromargan® 18/10 Edelstahl, Glas', dimensions: '20 cm Ø, 3 L', weight: '1,5 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530579846', supplierSku: 'WMF-07-2220-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 59 — ZWILLING Neo Kochtopfset 3-teilig
  {
    id: 'zw-neo-300', slug: 'zwilling-neo-kochtopfset-3-teilig',
    name: { de: 'ZWILLING Neo Kochtopfset 3-teilig – mattierter Edelstahl' },
    category: 'kochen', price: 97.02, oldPrice: 99,
    images: [p('zwilling-neo-kochtopfset-3-teilig', '1.png', 'kochen', 'ZWILLING Neo Kochtopfset 3-teilig - mattierter Edelstahl'),
          p('zwilling-neo-kochtopfset-3-teilig', '2.png', 'kochen', 'ZWILLING Neo Kochtopfset 3-teilig - mattierter Edelstahl'),
          p('zwilling-neo-kochtopfset-3-teilig', '3.png', 'kochen', 'ZWILLING Neo Kochtopfset 3-teilig - mattierter Edelstahl'),],
    rating: 4.6, reviewCount: 312, stock: 19, badges: ['new'],
    description: { de: 'Modernes Understatement für Ihre Küche. Das ZWILLING Neo Set besticht durch seine edle mattierte Oberfläche und die geradlinige Formsprache. Die Töpfe verfügen über den SIGMA Classic Sandwichboden, der für eine optimale Wärmeverteilung sorgt. Dank der integrierten Füllskala lassen sich Flüssigkeiten direkt im Topf abmessen. Die ergonomischen Edelstahlgriffe gewährleisten eine sichere Handhabung. Set-Inhalt: Kochtopf 20cm mit Deckel, Bratentopf 20cm mit Deckel, Stielkasserolle 16cm ohne Deckel. Ein kompaktes Set in Profi-Qualität.' },
    shortDescription: { de: 'Elegantes Set aus mattiertem Edelstahl – ideal für moderne Küchen' },
    specs: { material: 'Edelstahl 18/10 mattiert', dimensions: '3-teilig', weight: '3,8 kg', dishwasher: true, induction: true },
    brand: 'ZWILLING', ean: '4009839343316', supplierSku: 'ZW-66002-003', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 60 — Silit Sicomatic t-plus Schnellkochtopf 4,5L
  {
    id: 'si-sico-450', slug: 'silit-sicomatic-t-plus-schnellkochtopf-4-5l',
    name: { de: 'Silit Sicomatic® t-plus Schnellkochtopf 4,5 L – Silargan®' },
    category: 'kochen', price: 126.42, oldPrice: 129,
    images: [
      p('silit-sicomatic', '1.png', 'kochen', 'Silit Sicomatic t-plus Schnellkochtopf 4,5 L – Silargan®'),
      p('silit-sicomatic', '2.png', 'kochen', 'Silit Sicomatic t-plus Schnellkochtopf 4,5 L – Silargan®')
    ],
    rating: 4.8, reviewCount: 562, stock: 11, badges: ['premium'],
    description: { de: 'Der Inbegriff für schnelles und gesundes Kochen. Der Silit Sicomatic® t-plus aus der einzigartigen Funktionskeramik Silargan® ist nickelfrei, porenfrei geschlossen und bewahrt das volle Aroma Ihrer Speisen. Mit drei einstellbaren Kochstufen (Schon-, Schnell- und Dampfkochstufe) bereiten Sie alles punktgenau zu. Das wartungsfreie Ganzmetall-Ventilsystem sorgt für höchste Sicherheit und Zuverlässigkeit. Der extrastarke Energiesparboden ist ideal für alle Herdarten inklusive Induktion geeignet. Made in Germany mit 30 Jahren Garantie auf die Silargan-Oberfläche.' },
    shortDescription: { de: 'Gesundes Schnellkochen in nickelfreiem Silargan®' },
    specs: { material: 'Silargan® Funktionskeramik', dimensions: '22 cm Ø, 4,5 L', weight: '4,2 kg', dishwasher: true, induction: true },
    brand: 'Silit', ean: '4000530674312', supplierSku: 'SI-2101297178', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 61 — Fissler Vitavit Premium Schnellkochtopf 6L
  {
    id: 'fi-vv-600', slug: 'fissler-vitavit-premium-schnellkochtopf-6l',
    name: { de: 'Fissler Vitavit® Premium Schnellkochtopf 6 L – Induktion' },
    category: 'kochen', price: 195.02, oldPrice: 199,
    images: [
      p('fissler-vitavit', '1.png', 'kochen', 'Fissler Vitavit Premium Schnellkochtopf 6 L – Induktion'),
      p('fissler-vitavit', '2.png', 'kochen', 'Fissler Vitavit Premium Schnellkochtopf 6 L – Induktion')
    ],
    rating: 4.9, reviewCount: 842, stock: 15, badges: ['premium'],
    description: { de: 'Kochen auf höchstem Niveau mit dem Fissler Vitavit® Premium. Dieser High-End Schnellkochtopf bietet exklusive Funktionen wie die Ampelfunktion zur Kontrolle des Garprozesses, vier einstellbare Kochstufen (inkl. drucklosem Dampfgaren) und einen Aufsetzhilfe-Markierung für sicheres Verschließen. Der Cookstar® Allherdboden sorgt für perfekte Wärmeleitung auf Induktion. Dank des abnehmbaren Griffs ist der Topf extrem leicht zu reinigen und stapelbar. Made in Germany für maximale Sicherheit und Langlebigkeit.' },
    shortDescription: { de: 'Premium Schnellkochtopf mit 4 Kochstufen und Ampelfunktion' },
    specs: { material: 'Edelstahl 18/10', dimensions: '22 cm Ø, 6 L', weight: '4,5 kg', dishwasher: true, induction: true },
    brand: 'Fissler', ean: '4009209331645', supplierSku: 'FI-620-300-06-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 62 — WMF Perfect RDS Schnellkochtopf 4,5L
  {
    id: 'wmf-per-450', slug: 'wmf-perfect-rds-schnellkochtopf-4-5l',
    name: { de: 'WMF Perfect Schnellkochtopf 4,5 L – Klassiker' },
    category: 'kochen', price: 87.22, oldPrice: 89,
    images: [
      p('wmf-perfect', '1.png', 'kochen', 'WMF Perfect Schnellkochtopf 4.5L - Klassiker'),
      p('wmf-perfect', '2.png', 'kochen', 'WMF Perfect Schnellkochtopf 4.5L - Klassiker')
    ],
    rating: 4.7, reviewCount: 3120, stock: 28, badges: ['bestseller'],
    description: { de: 'Der Klassiker unter den Schnellkochtöpfen. Der WMF Perfect überzeugt durch sein zeitloses Design und die bewährte Technik. Die Bedienung erfolgt einfach über den Kochschieber im abnehmbaren Deckelgriff. Zwei Kochstufen ermöglichen das vitaminschonende Garen von Gemüse oder das schnelle Zubereiten von Fleischgerichten. Gefertigt aus robustem Cromargan® Edelstahl 18/10 und ausgestattet mit dem TransTherm®-Allherdboden. Ein mehrstufiges Sicherheitssystem sorgt für sorgenfreies Kochen.' },
    shortDescription: { de: 'Bewährte Technik und einfache Bedienung – der WMF Klassiker' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '22 cm Ø, 4,5 L', weight: '3,2 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530562565', supplierSku: 'WMF-07-9262-9990', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 63 — ELO Multilayer Bratentopf 24cm
  {
    id: 'elo-ml-240', slug: 'elo-multilayer-bratentopf-24cm',
    name: { de: 'ELO Multilayer Bratentopf 24 cm – 3-Schicht-Material' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [
      p('elo-multilayer', '1.png', 'kochen', 'ELO Multilayer Bratentopf 24 cm – 3-Schicht-Material'),
      p('elo-multilayer', '2.png', 'kochen', 'ELO Multilayer Bratentopf 24 cm – 3-Schicht-Material'),
      p('elo-multilayer', '3.png', 'kochen', 'ELO Multilayer Bratentopf 24 cm – 3-Schicht-Material')
    ],
    rating: 4.6, reviewCount: 156, stock: 19, badges: [],
    description: { de: 'Professionelle Wärmeleitung vom Boden bis zum Rand. Der ELO Multilayer Bratentopf besteht aus hochwertigem 3-Schicht-Mehrschichtmaterial (Edelstahl-Aluminium-Edelstahl). Dies sorgt für eine extrem schnelle und gleichmäßige Hitzeverteilung, ideal für wasserarmes Garen und scharfes Anbraten. Der Topf verfügt über eine integrierte Volumenskala und einen stoßfesten Glasdeckel. Hitzebeständig bis 240°C und perfekt für Induktionsherde geeignet.' },
    shortDescription: { de: 'Durchgehendes Mehrschichtmaterial für perfekte Wärmeverteilung' },
    specs: { material: '3-Schicht-Mehrschichtmaterial', dimensions: '24 cm Ø, 4 L', weight: '2,3 kg', dishwasher: true, induction: true },
    brand: 'ELO', ean: '4006925904249', supplierSku: 'ELO-90424', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 64 — GSW Montan Bratentopf 24cm
  {
    id: 'gsw-mo-240', slug: 'gsw-montan-bratentopf-24cm',
    name: { de: 'GSW Montan Bratentopf 24 cm – Aluguss robust' },
    category: 'kochen', price: 48.02, oldPrice: 49,
    images: [p('gsw-montan-bratentopf-24cm', '1.png', 'kochen', 'GSW Montan Bratentopf 24 cm – Aluguss robust'),
          p('gsw-montan-bratentopf-24cm', '2.png', 'kochen', 'GSW Montan Bratentopf 24 cm – Aluguss robust'),
          p('gsw-montan-bratentopf-24cm', '3.png', 'kochen', 'GSW Montan Bratentopf 24 cm – Aluguss robust'),],
    rating: 4.5, reviewCount: 284, stock: 31, badges: [],
    description: { de: 'Massiver Aluguss für beste Bratergebnisse. Der GSW Montan Bratentopf zeichnet sich durch seine schwere Qualität und die hervorragende Wärmespeicherung aus. Die mehrlagige VITAFLON®-PREMIUM Antihaft-Versiegelung verhindert das Anhaften und erleichtert die Reinigung. Der extra starke FerroTherm® Induktionsboden ist formstabil und energieeffizient. Inklusive hitzebeständigem Glasdeckel mit Aromaknopf zum Verfeinern der Speisen während des Garens.' },
    shortDescription: { de: 'Schwerer Aluguss mit hochwertiger Antihaft-Versiegelung' },
    specs: { material: 'Aluminiumguss, VITAFLON', dimensions: '24 cm Ø, 4 L', weight: '2,6 kg', dishwasher: true, induction: true },
    brand: 'GSW', ean: '4005643414241', supplierSku: 'GSW-414241', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 65 — Krüger Pfannen- und Topfset 8-teilig
  {
    id: 'kr-set-800', slug: 'krueger-pfannen-und-topfset-8-teilig',
    name: { de: 'Krüger Pfannen- und Topfset 8-teilig – Schwarz' },
    category: 'kochen', price: 77.42, oldPrice: 79,
    images: [p('krueger-pfannen-und-topfset-8-teilig', '1.png', 'kochen', 'Krüger Pfannen- und Topfset 8-teilig – Schwarz'),
          p('krueger-pfannen-und-topfset-8-teilig', '2.png', 'kochen', 'Krüger Pfannen- und Topfset 8-teilig – Schwarz'),
          p('krueger-pfannen-und-topfset-8-teilig', '3.png', 'kochen', 'Krüger Pfannen- und Topfset 8-teilig – Schwarz'),],
    rating: 4.3, reviewCount: 512, stock: 45, badges: ['bestseller'],
    description: { de: 'Das Rundum-Sorglos-Paket für Ihre Küche. Das 8-teilige Set von Krüger bietet eine solide Grundausstattung für preisbewusste Köche. Die Töpfe und Pfannen verfügen über eine pflegeleichte Antihaftbeschichtung und sind für alle Herdarten, inklusive Induktion, geeignet. Die Glasdeckel mit Dampfaustritt ermöglichen ein modernes Sichtkochen. Ein unschlagbares Preis-Leistungs-Verhältnis. Set enthält: 3 Fleischtöpfe mit Deckel, 1 Stielkasserolle und 1 Bratpfanne.' },
    shortDescription: { de: 'Umfangreiches 8-teiliges Set zum Sparpreis – induktionsgeeignet' },
    specs: { material: 'Aluminium, Antihaftbeschichtung', dimensions: '8-teilig', weight: '5,8 kg', dishwasher: true, induction: true },
    brand: 'Krüger', ean: '4006189074284', supplierSku: 'KR-SET8', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 66 — GSW Ceramica Kasserolle 16cm
  {
    id: 'gsw-ce-160', slug: 'gsw-ceramica-kasserolle-16cm',
    name: { de: 'GSW Ceramica Kasserolle 16 cm – Keramikbeschichtung' },
    category: 'kochen', price: 28.42, oldPrice: 29,
    images: [p('gsw-ceramica-kasserolle-16cm', '1.png', 'kochen', 'GSW Ceramica Kasserolle 16 cm – Keramikbeschichtung'),
          p('gsw-ceramica-kasserolle-16cm', '2.png', 'kochen', 'GSW Ceramica Kasserolle 16 cm – Keramikbeschichtung'),
          p('gsw-ceramica-kasserolle-16cm', '3.png', 'kochen', 'GSW Ceramica Kasserolle 16 cm – Keramikbeschichtung'),],
    rating: 4.4, reviewCount: 186, stock: 22, badges: ['new'],
    description: { de: 'Modernes Design und gesundes Kochen. Die GSW Ceramica Kasserolle verfügt über eine extrem hitzebeständige weiße Keramikbeschichtung, die frei von PFOA und PTFE ist. Die glatte Oberfläche ermöglicht fettarmes Braten und ist besonders leicht zu reinigen. Der Induktionsboden sorgt für eine schnelle Aufheizung. Ideal für kleine Portionen, Saucen oder das Aufwärmen von Speisen. Mit ergonomischem Soft-Touch-Griff für sicheren Halt.' },
    shortDescription: { de: 'Hitzebeständige Keramikbeschichtung für fettarmes Kochen' },
    specs: { material: 'Aluminium, Keramikbeschichtung', dimensions: '16 cm Ø, 1,2 L', weight: '0,8 kg', dishwasher: true, induction: true },
    brand: 'GSW', ean: '4005643164160', supplierSku: 'GSW-164160', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 67 — WMF Function 4 Bratentopf 24cm
  {
    id: 'wmf-f4-240', slug: 'wmf-function-4-bratentopf-24cm',
    name: { de: 'WMF Function 4 Bratentopf 24 cm – 4 Funktionen' },
    category: 'kochen', price: 97.02, oldPrice: 99,
    images: [p('wmf-function-4-bratentopf-24cm', '1.png', 'kochen', 'WMF Function 4 Bratentopf 24 cm – 4 Funktionen'),
          p('wmf-function-4-bratentopf-24cm', '2.png', 'kochen', 'WMF Function 4 Bratentopf 24 cm – 4 Funktionen'),
          p('wmf-function-4-bratentopf-24cm', '3.png', 'kochen', 'WMF Function 4 Bratentopf 24 cm – 4 Funktionen'),],
    rating: 4.8, reviewCount: 432, stock: 12, badges: ['premium'],
    description: { de: 'Innovation für Ihre Küche. Die WMF Function 4 Serie bietet einen einzigartigen Deckel mit Silikonring und vier verschiedenen Ausgießfunktionen: Abgießen ohne Sieb, geschlossenes Garen, voll geöffnet oder kontrolliertes Abdampfen. Gefertigt aus robustem Cromargan® Edelstahl 18/10 mit dem TransTherm®-Allherdboden für beste Wärmeeigenschaften auf Induktion. Die hohlen Kaltmetallgriffe bleiben beim Kochen auf dem Herd kühl. Ein preisgekröntes Design Made in Germany.' },
    shortDescription: { de: 'Multifunktionaler Deckel mit 4 Gießpositionen – Cromargan®' },
    specs: { material: 'Cromargan® 18/10 Edelstahl, Silikon', dimensions: '24 cm Ø, 4,1 L', weight: '2,2 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530605125', supplierSku: 'WMF-07-6324-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 68 — WMF Macao Wok 36cm
  {
    id: 'wmf-ma-360-roster', slug: 'wmf-macao-wok-36cm',
    name: { de: 'WMF Macao Wok 36 cm – Cromargan® mit Ablagerost' },
    category: 'kochen', price: 77.42, oldPrice: 79,
    images: [p('wmf-macao-wok-36cm', '1.png', 'kochen', 'WMF Macao Wok 36cm - Cromargan Edelstahl'),
          p('wmf-macao-wok-36cm', '2.png', 'kochen', 'WMF Macao Wok 36cm - Cromargan Edelstahl'),
          p('wmf-macao-wok-36cm', '3.png', 'kochen', 'WMF Macao Wok 36cm - Cromargan Edelstahl'),],
    rating: 4.7, reviewCount: 256, stock: 14, badges: [],
    description: { de: 'Fernöstliche Küche perfekt umgesetzt. Der WMF Macao Wok aus poliertem Cromargan® Edelstahl 18/10 bietet durch seine tiefe, halbrunde Form ideale Bedingungen für das typische Pfannenrühren. Der TransTherm®-Allherdboden sorgt für die notwendige hohe Hitze am Boden und eine sanfte Wärme an den Seitenwänden. Das Set enthält einen Ablagerost zum Warmhalten oder Dämpfen sowie einen Glasdeckel. Die beiden Seitengriffe ermöglichen eine sichere Handhabung und machen den Wok auch zur idealen Servierschale am Tisch.' },
    shortDescription: { de: 'Großer Edelstahl-Wok mit Ablagerost und Glasdeckel' },
    specs: { material: 'Cromargan® 18/10 Edelstahl, Glas', dimensions: '36 cm Ø', weight: '3,1 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530593125', supplierSku: 'WMF-07-9256-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 69 — ZWILLING Plus Wok 32cm
  {
    id: 'zw-pl-320', slug: 'zwilling-plus-wok-32cm',
    name: { de: 'ZWILLING Plus Wok 32 cm – 3-Schicht-Material' },
    category: 'kochen', price: 87.22, oldPrice: 89,
    images: [p('zwilling-plus-wok-32cm', '1.png', 'kochen', 'ZWILLING Plus Wok 32cm - 3-Schicht-Material'),
          p('zwilling-plus-wok-32cm', '2.png', 'kochen', 'ZWILLING Plus Wok 32cm - 3-Schicht-Material'),
          p('zwilling-plus-wok-32cm', '3.png', 'kochen', 'ZWILLING Plus Wok 32cm - 3-Schicht-Material'),],
    rating: 4.8, reviewCount: 184, stock: 11, badges: ['premium'],
    description: { de: 'Professionelles Wok-Kochen dank Mehrschicht-Technologie. Der ZWILLING Plus Wok besteht aus einem hochwertigen 3-Schicht-Material (SIGMA Clad), das die Hitze bis in den obersten Rand leitet. Dies ermöglicht das authentische Garen bei extrem hohen Temperaturen. Die kratzfeste Edelstahloberfläche ist ideal für Metallküchenhelfer und besonders langlebig. Inklusive Glasdeckel und Ablagerost für vielseitige Zubereitungsmöglichkeiten wie Dünsten, Frittieren oder Dämpfen.' },
    shortDescription: { de: 'Mehrschicht-Wok für blitzschnelle Hitzeverteilung bis zum Rand' },
    specs: { material: '3-Schicht-Mehrschichtmaterial', dimensions: '32 cm Ø', weight: '2,8 kg', dishwasher: true, induction: true },
    brand: 'ZWILLING', ean: '4009839343316', supplierSku: 'ZW-66002-320', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 70 — Tefal Daily Chef Wok 28cm
  {
    id: 'tf-dc-280', slug: 'tefal-daily-chef-wok-28cm',
    name: { de: 'Tefal Daily Chef Wok 28 cm – Titanium Beschichtung' },
    category: 'kochen', price: 44.10, oldPrice: 45,
    images: [p('tefal-daily-chef-wok-28cm', '1.png', 'kochen', 'Tefal Daily Chef Wok 28 cm – Titanium Beschichtung'),
          p('tefal-daily-chef-wok-28cm', '2.png', 'kochen', 'Tefal Daily Chef Wok 28 cm – Titanium Beschichtung'),
          p('tefal-daily-chef-wok-28cm', '3.png', 'kochen', 'Tefal Daily Chef Wok 28 cm – Titanium Beschichtung'),],
    rating: 4.6, reviewCount: 892, stock: 34, badges: ['bestseller'],
    description: { de: 'Ihr täglicher Begleiter für gesunde asiatische Gerichte. Der Tefal Daily Chef Wok ist mit der langlebigen Titanium Antihaft-Versiegelung ausgestattet, die eine problemlose Zubereitung ohne viel Fett ermöglicht. Der Thermo-Signal™ Indikator zeigt an, wann die ideale Temperatur erreicht ist. Die tiefe Form ist perfekt für große Portionen und das spritzfreie Rühren. Dank der fortschrittlichen Thermo-Fusion™ Induktionstechnologie wird der Wok schnell und gleichmäßig heiß. Leicht, handlich und einfach zu reinigen.' },
    shortDescription: { de: 'Leichter Aluminium-Wok mit Thermo-Signal™ Technologie' },
    specs: { material: 'Aluminium, Titanium Versiegelung', dimensions: '28 cm Ø', weight: '1,1 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430314129', supplierSku: 'TF-G27319', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 71 — Kopf Marra Wok-Set 4-teilig
  {
    id: 'ko-ma-400', slug: 'kopf-marra-wok-set-4-teilig',
    name: { de: 'Kopf Marra Wok-Set 4-teilig – Aluguss antihaft' },
    category: 'kochen', price: 57.82, oldPrice: 59,
    images: [p('kopf-marra-wok-set-4-teilig', '1.png', 'kochen', 'Kopf Marra Wok-Set 4-teilig – Aluguss antihaft'),
          p('kopf-marra-wok-set-4-teilig', '2.png', 'kochen', 'Kopf Marra Wok-Set 4-teilig – Aluguss antihaft'),
          p('kopf-marra-wok-set-4-teilig', '3.png', 'kochen', 'Kopf Marra Wok-Set 4-teilig – Aluguss antihaft'),],
    rating: 4.5, reviewCount: 312, stock: 18, badges: ['new'],
    description: { de: 'Das Kopf Marra Wok-Set bietet alles für den perfekten Einstieg in die asiatische Küche. Der hochwertige Wok aus robustem Aluguss verfügt über eine langlebige ILAG Basic Antihaftbeschichtung, die fettarmes Braten und eine einfache Reinigung ermöglicht. Der starke Induktionsboden garantiert eine schnelle Aufheizung und optimale Wärmeverteilung. Im Set enthalten sind ein passender Glasdeckel, eine Holzspatula und zwei Essstäbchen aus Bambus. Vielseitig einsetzbar auf allen Herdarten, backofenfest bis 180°C.' },
    shortDescription: { de: 'Komplettes Wok-Set aus Aluguss – ideal für Asia-Gerichte' },
    specs: { material: 'Aluminiumguss, ILAG Basic', dimensions: '28 cm Ø', weight: '2,4 kg', dishwasher: true, induction: true },
    brand: 'Kopf', ean: '4025457253451', supplierSku: 'KO-253451', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 72 — GSW Gastrobräter 35x25cm
  {
    id: 'gsw-gb-350', slug: 'gsw-gastrobraeter-35x25cm',
    name: { de: 'GSW Gastrobräter 35 x 25 cm – Edelstahl mit Deckel' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [p('gsw-gastrobraeter-35x25cm', '1.png', 'kochen', 'GSW Gastrobräter 35 x 25 cm – Edelstahl mit Deckel'),
          p('gsw-gastrobraeter-35x25cm', '2.png', 'kochen', 'GSW Gastrobräter 35 x 25 cm – Edelstahl mit Deckel'),],
    rating: 4.6, reviewCount: 184, stock: 12, badges: [],
    description: { de: 'Profi-Qualität für Ihren Backofen und Herd. Der GSW Gastrobräter aus hochwertigem Edelstahl 18/10 ist ideal zum Braten, Schmoren und Gratinieren großer Portionen. Der 6 mm starke Sandwichboden mit FerroTherm® Technologie sorgt für eine optimale Wärmeleitung auf allen Herdarten, insbesondere Induktion. Die massiven Edelstahlgriffe und der passgenaue Edelstahldeckel unterstreichen die robuste Gastronomie-Qualität. Vielseitig einsetzbar als Bräter, Auflaufform oder zum Servieren. Backofenfest bis 240°C.' },
    shortDescription: { de: 'Großer Edelstahl-Bräter für Gastronomie und Haushalt' },
    specs: { material: 'Edelstahl 18/10', dimensions: '35 x 25 cm', weight: '3,8 kg', dishwasher: true, induction: true },
    brand: 'GSW', ean: '4005643414357', supplierSku: 'GSW-414357', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 73 — Rösle Elegance Grillpfanne 28cm
  {
    id: 'ro-el-280', slug: 'roesle-elegance-grillpfanne-28cm',
    name: { de: 'Rösle Elegance Grillpfanne 28 cm – ProPlex®' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [p('roesle-elegance-grillpfanne-28cm', '1.png', 'kochen', 'Rösle Elegance Grillpfanne 28 cm – ProPlex®'),
          p('roesle-elegance-grillpfanne-28cm', '2.png', 'kochen', 'Rösle Elegance Grillpfanne 28 cm – ProPlex®'),],
    rating: 4.7, reviewCount: 412, stock: 21, badges: ['bestseller'],
    description: { de: 'Holen Sie sich das Grill-Feeling in die Küche. Die Rösle Elegance Grillpfanne aus hochwertigem Edelstahl 18/10 verfügt über eine geriffelte Bratfläche, die für die typischen Grillstreifen und ein fettarmes Braten sorgt. Die ProPlex® Antihaftversiegelung ist extrem widerstandsfähig und hitzebeständig bis 260°C. Der gekapselte Sandwichboden mit Aluminiumkern garantiert eine schnelle Wärmeaufnahme und gleichmäßige Verteilung auf Induktionsherden. Mit ergonomischem Edelstahlgriff für eine sichere Handhabung.' },
    shortDescription: { de: 'Edelstahl-Grillpfanne mit Antihaftversiegelung für perfekte Steaks' },
    specs: { material: 'Edelstahl 18/10, ProPlex', dimensions: '28 cm Ø', weight: '1,5 kg', dishwasher: true, induction: true },
    brand: 'Rösle', ean: '4004293131697', supplierSku: 'RO-13169', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 74 — WMF Grillpfanne 27x27cm
  {
    id: 'wmf-gr-270', slug: 'wmf-grillpfanne-27x27cm',
    name: { de: 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch' },
    category: 'kochen', price: 57.82, oldPrice: 59,
    images: [p('wmf-grillpfanne-27x27cm', '1.png', 'kochen', 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch'),
          p('wmf-grillpfanne-27x27cm', '2.png', 'kochen', 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch'),
          p('wmf-grillpfanne-27x27cm', '3.png', 'kochen', 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch'),],
    rating: 4.8, reviewCount: 892, stock: 16, badges: ['premium'],
    description: { de: 'Perfektes Grillen auf dem Herd. Die quadratische WMF Grillpfanne aus poliertem Cromargan® Edelstahl 18/10 bietet durch ihre Form eine extra große Bratfläche. Die markanten Grillrippen am Pfannenboden lassen überschüssiges Fett ablaufen und verleihen Fleisch, Fisch und Gemüse das charakteristische Grillmuster. Der TransTherm®-Allherdboden sorgt für eine exzellente Wärmeverteilung und -speicherung. Die Pfanne ist backofenfest und dank der hochwertigen Materialien extrem langlebig und pflegeleicht.' },
    shortDescription: { de: 'Quadratische Grillpfanne aus Cromargan® für intensives Aroma' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '27 x 27 cm', weight: '1,7 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530593132', supplierSku: 'WMF-07-9257-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 75 — Lodge Grillpfanne quadratisch 26cm
  {
    id: 'lo-gr-260', slug: 'lodge-grillpfanne-quadratisch-26cm',
    name: { de: 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch, USA' },
    category: 'kochen', price: 48.02, oldPrice: 49,
    images: [p('lodge-grillpfanne-quadratisch-26cm', '1.png', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch, USA'),
          p('lodge-grillpfanne-quadratisch-26cm', '2.png', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch, USA'),],
    rating: 4.9, reviewCount: 1540, stock: 11, badges: ['premium'],
    description: { de: 'Das amerikanische Original für authentisches Grillen. Die quadratische Lodge Grillpfanne aus massivem Gusseisen ist bereits "Pre-Seasoned" (mit Pflanzenöl eingebrannt) und sofort einsatzbereit. Die tiefen Grillrippen sorgen für ein perfektes Branding, während das Gusseisen die Hitze extrem lange speichert – ideal für Steaks bei hohen Temperaturen. Der flache Boden ist speziell für die Verwendung auf Induktionsfeldern optimiert. Ein unverwüstliches Werkzeug für Profis, das mit jedem Gebrauch eine bessere natürliche Antihaft-Patina entwickelt.' },
    shortDescription: { de: 'Massive Gusseisen-Grillpfanne für das ultimative Steak-Erlebnis' },
    specs: { material: 'Gusseisen, eingebrannt', dimensions: '26 x 26 cm', weight: '3,2 kg', dishwasher: false, induction: true },
    brand: 'Lodge', ean: '0076501003415', supplierSku: 'LODGE-L8SGP3', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 76 — Berndes Balance Induction Grillpfanne 28cm
  {
    id: 'be-bi-280', slug: 'berndes-balance-induction-grillpfanne-28cm',
    name: { de: 'Berndes Balance Induction Grillpfanne 28 cm – Antihaft' },
    category: 'kochen', price: 53.90, oldPrice: 55,
    images: [p('berndes-balance-induction-grillpfanne-28cm', '1.png', 'kochen', 'Berndes Balance Induction Grillpfanne 28 cm – Antihaft'),
          p('berndes-balance-induction-grillpfanne-28cm', '2.png', 'kochen', 'Berndes Balance Induction Grillpfanne 28 cm – Antihaft'),
          p('berndes-balance-induction-grillpfanne-28cm', '3.png', 'kochen', 'Berndes Balance Induction Grillpfanne 28 cm – Antihaft'),],
    rating: 4.6, reviewCount: 212, stock: 19, badges: [],
    description: { de: 'Gesundes Grillen mit Komfort. Die Berndes Balance Induction Grillpfanne aus verstärktem Aluminium ist mit einer hochwertigen 3-lagigen Antihaftbeschichtung ausgestattet, die PFOA-frei und besonders langlebig ist. Der spezialisierte Induktionsboden sorgt für eine blitzschnelle Aufheizung und eine gleichmäßige Temperatur über die gesamte Fläche. Die markante Grillstruktur am Boden ermöglicht fettarmes Braten. Mit ergonomischem Stielgriff in moderner Edelstahloptik. Ideal für die leichte Küche mit Fisch, Fleisch oder Gemüse.' },
    shortDescription: { de: 'Induktions-Grillpfanne mit langlebiger Antihaftbeschichtung' },
    specs: { material: 'Aluminium, Antihaftversiegelung', dimensions: '28 x 28 cm', weight: '1,4 kg', dishwasher: true, induction: true },
    brand: 'Berndes', ean: '4006189074291', supplierSku: 'BE-074029', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 77 — WMF Profi Plus Pfannenwender
  {
    id: 'wmf-pp-330', slug: 'wmf-profi-plus-pfannenwender',
    name: { de: 'WMF Profi Plus Pfannenwender 33 cm – Cromargan®' },
    category: 'zubehoer', price: 18.62, oldPrice: 19,
    images: [p('wmf-profi-plus-pfannenwender', '1.png', 'zubehoer', 'WMF Profi Plus Pfannenwender 33cm - Cromargan'),
          p('wmf-profi-plus-pfannenwender', '2.png', 'zubehoer', 'WMF Profi Plus Pfannenwender 33cm - Cromargan'),
          p('wmf-profi-plus-pfannenwender', '3.png', 'zubehoer', 'WMF Profi Plus Pfannenwender 33cm - Cromargan'),],
    rating: 4.8, reviewCount: 3120, stock: 52, badges: ['bestseller'],
    description: { de: 'Präzision und Langlebigkeit für Ihre Küche. Der WMF Profi Plus Pfannenwender ist aus unverwüstlichem Cromargan® Edelstahl 18/10 gefertigt. Mit seiner Länge von 33 cm und der stabilen, flachen Schaufel ist er ideal zum Wenden von Fleisch, Fisch oder Pfannkuchen. Das ergonomische Design sorgt für eine angenehme Handhabung, während die praktische Aufhängöse für Ordnung an der Küchenleiste sorgt. Absolut formstabil, säurefest und spülmaschinengeeignet. Ein unverzichtbares Werkzeug für jede Profi-Küche.' },
    shortDescription: { de: 'Robuster Edelstahl-Wender in Gastronomie-Qualität' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '33 cm Länge', weight: '0,2 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530562572', supplierSku: 'WMF-18-7101-6030', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 78 — ZWILLING Pro Schöpflöffel
  {
    id: 'zw-pro-scoop', slug: 'zwilling-pro-schoepfloeffel',
    name: { de: 'ZWILLING Pro Schöpflöffel – Edelstahl 18/10' },
    category: 'zubehoer', price: 24.50, oldPrice: 25,
    images: [p('zwilling-pro-schoepfloeffel', '1.png', 'zubehoer', 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10'),
          p('zwilling-pro-schoepfloeffel', '2.png', 'zubehoer', 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10'),
          p('zwilling-pro-schoepfloeffel', '3.png', 'zubehoer', 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10'),],
    rating: 4.9, reviewCount: 842, stock: 38, badges: ['premium'],
    description: { de: 'Elegantes Design trifft auf höchste Funktionalität. Der ZWILLING Pro Schöpflöffel besticht durch seine zeitlose Optik, entworfen von Matteo Thun und Antonio Rodriguez. Gefertigt aus hochwertigem Edelstahl 18/10, ist er extrem robust, korrosionsbeständig und langlebig. Der ergonomisch geformte Stiel liegt perfekt in der Hand und ermöglicht ein ermüdungsfreies Arbeiten. Ideal zum Schöpfen und Servieren von Suppen, Eintöpfen oder Saucen. Mit praktischer Aufhängöse zur stilvollen Aufbewahrung.' },
    shortDescription: { de: 'Premium-Schöpflöffel aus rostfreiem Edelstahl – Design-Klassiker' },
    specs: { material: 'Edelstahl 18/10', dimensions: '32 cm Länge', weight: '0,25 kg', dishwasher: true, induction: false },
    brand: 'ZWILLING', ean: '4009839343323', supplierSku: 'ZW-37160-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 79 — Fissler Magic Pfannenschutz-Set 3-teilig
  {
    id: 'fi-mag-prot', slug: 'fissler-magic-pfannenschutz-set-3-teilig',
    name: { de: 'Fissler Magic Pfannenschutz-Set 3-teilig – Vlies' },
    category: 'zubehoer', price: 18.62, oldPrice: 19,
    images: [p('fissler-magic-pfannenschutz-set-3-teilig', '1.png', 'zubehoer', 'Fissler Magic Pfannenschutz-Set 3-teilig – Vlies'),
          p('fissler-magic-pfannenschutz-set-3-teilig', '2.png', 'zubehoer', 'Fissler Magic Pfannenschutz-Set 3-teilig – Vlies'),
          p('fissler-magic-pfannenschutz-set-3-teilig', '3.png', 'zubehoer', 'Fissler Magic Pfannenschutz-Set 3-teilig – Vlies'),],
    rating: 4.7, reviewCount: 1560, stock: 120, badges: ['bestseller'],
    description: { de: 'Schutz für Ihre hochwertigen Pfannen. Das 3-teilige Fissler Magic Pfannenschutz-Set aus weichem, strapazierfähigem Vlies verhindert zuverlässig Kratzer beim Stapeln von Pfannen und Töpfen im Schrank. Die universelle Sternform passt sich jeder Pfannengröße an und schützt sowohl den Pfannenboden als auch die Antihaftbeschichtung. Ein einfaches, aber effektives Zubehör, um die Lebensdauer Ihres Kochgeschirrs deutlich zu verlängern. Waschbar und langlebig.' },
    shortDescription: { de: 'Universeller Kratzschutz für schonendes Stapeln von Pfannen' },
    specs: { material: 'Hochwertiges Vlies', dimensions: '38 cm Ø, 3-teilig', weight: '0,1 kg', dishwasher: false, induction: false },
    brand: 'Fissler', ean: '4009209310329', supplierSku: 'FI-020-000-03-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 80 — WMF Topfuntersetzer Silikon 2-teilig
  {
    id: 'wmf-sil-trivet', slug: 'wmf-topfuntersetzer-silikon-2-teilig',
    name: { de: 'WMF Topfuntersetzer Silikon 2-teilig – Hitzebeständig' },
    category: 'zubehoer', price: 14.70, oldPrice: 15,
    images: [p('wmf-topfuntersetzer-silikon-2-teilig', '1.png', 'zubehoer', 'WMF Topfuntersetzer Silikon 2-teilig - Hitzebestaendig'),
          p('wmf-topfuntersetzer-silikon-2-teilig', '2.png', 'zubehoer', 'WMF Topfuntersetzer Silikon 2-teilig - Hitzebestaendig'),
          p('wmf-topfuntersetzer-silikon-2-teilig', '3.png', 'zubehoer', 'WMF Topfuntersetzer Silikon 2-teilig - Hitzebestaendig'),],
    rating: 4.6, reviewCount: 894, stock: 65, badges: [],
    description: { de: 'Stilvoller Schutz für Ihre Oberflächen. Das 2-teilige WMF Topfuntersetzer-Set aus hochwertigem, lebensmittelechtem Silikon ist hitzebeständig bis 230°C. Es schützt Arbeitsplatten und Esstische zuverlässig vor Hitze und Kratzern von heißen Töpfen und Pfannen. Die rutschhemmende Oberfläche sorgt für einen sicheren Stand des Kochgeschirrs. Dank des flexiblen Materials können die Untersetzer auch als Greifhilfe für heiße Deckel verwendet werden. Platzsparend stapelbar und leicht unter fließendem Wasser oder in der Spülmaschine zu reinigen.' },
    shortDescription: { de: 'Flexible Silikon-Untersetzer – hitzefest und rutschsicher' },
    specs: { material: 'Hochwertiges Silikon', dimensions: '17 cm Ø', weight: '0,15 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530605132', supplierSku: 'WMF-06-1816-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 81 — Rösle Pfannenwender Silikon
  {
    id: 'ro-pw-sil', slug: 'roesle-pfannenwender-silikon',
    name: { de: 'Rösle Pfannenwender Silikon – hitzebeständig bis 260°C' },
    category: 'zubehoer', price: 21.56, oldPrice: 22,
    images: [p('roesle-pfannenwender-silikon', '1.png', 'zubehoer', 'Rösle Pfannenwender Silikon – hitzebeständig bis 260°C'),
          p('roesle-pfannenwender-silikon', '2.png', 'zubehoer', 'Rösle Pfannenwender Silikon – hitzebeständig bis 260°C'),
          p('roesle-pfannenwender-silikon', '3.png', 'zubehoer', 'Rösle Pfannenwender Silikon – hitzebeständig bis 260°C'),],
    rating: 4.8, reviewCount: 1240, stock: 45, badges: ['bestseller'],
    description: { de: 'Präzision und Schutz für Ihre Pfannen. Der Rösle Pfannenwender kombiniert einen stabilen Edelstahlkern mit einer flexiblen, lebensmittelechten Silikonummantelung. Dies schützt empfindliche Antihaftbeschichtungen zuverlässig vor Kratzern. Mit einer Hitzebeständigkeit von bis zu 260°C ist er ideal für alle Bratarbeiten. Die dünne, flexible Vorderkante gleitet mühelos unter das Bratgut, während der ergonomische Rundgriff perfekt in der Hand liegt. Spülmaschinengeeignet und extrem langlebig.' },
    shortDescription: { de: 'Hochhitzebeständiger Silikonwender mit Edelstahlkern' },
    specs: { material: 'Edelstahl 18/10, Silikon', dimensions: '32 cm Länge', weight: '0,18 kg', dishwasher: true, induction: false },
    brand: 'Rösle', ean: '4004293124507', supplierSku: 'RO-12450', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 82 — Tefal Ingenio Griffset 2-teilig
  {
    id: 'tf-ig-2set', slug: 'tefal-ingenio-griffset-2-teilig',
    name: { de: 'Tefal Ingenio Griffset 2-teilig – Schwarz' },
    category: 'zubehoer', price: 28.42, oldPrice: 29,
    images: [p('tefal-ingenio-griffset-2-teilig', '1.png', 'zubehoer', 'Tefal Ingenio Griffset 2-teilig – Schwarz'),
          p('tefal-ingenio-griffset-2-teilig', '2.png', 'zubehoer', 'Tefal Ingenio Griffset 2-teilig – Schwarz'),],
    rating: 4.7, reviewCount: 3120, stock: 55, badges: ['bestseller'],
    description: { de: 'Das Herzstück des Ingenio-Systems. Dieses 2-teilige Ersatz- oder Zusatzset der patentierten Ingenio-Griffe bietet Ihnen noch mehr Flexibilität beim Kochen. Die Griffe lassen sich mit nur einem Klick sicher an allen Tefal Ingenio Pfannen und Töpfen befestigen und wieder lösen. Jeder Griff ist mit bis zu 10 kg belastbar und verfügt über ein 3-Punkt-Sicherheitssystem für absolut festen Halt. Ideal, wenn Sie mit mehreren Gefäßen gleichzeitig hantieren oder Ihre vorhandene Ausstattung erweitern möchten.' },
    shortDescription: { de: 'Patentierte abnehmbare Griffe für das Ingenio-System' },
    specs: { material: 'Hochwertiger Kunststoff, Edelstahl', dimensions: 'Standardgröße', weight: '0,4 kg', dishwasher: false, induction: false },
    brand: 'Tefal', ean: '3168430225340', supplierSku: 'TF-L99330', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 83 — WMF Induktionskochfeld-Schutzmatte
  {
    id: 'wmf-ind-prot', slug: 'wmf-induktionskochfeld-schutzmatte',
    name: { de: 'WMF Induktionskochfeld-Schutzmatte – Silikon' },
    category: 'zubehoer', price: 23.52, oldPrice: 24,
    images: [p('wmf-induktionskochfeld-schutzmatte', '1.png', 'zubehoer', 'WMF Induktionskochfeld-Schutzmatte - Silikon'),
          p('wmf-induktionskochfeld-schutzmatte', '2.png', 'zubehoer', 'WMF Induktionskochfeld-Schutzmatte - Silikon'),
          p('wmf-induktionskochfeld-schutzmatte', '3.png', 'zubehoer', 'WMF Induktionskochfeld-Schutzmatte - Silikon'),
          p('wmf-induktionskochfeld-schutzmatte', '4.png', 'zubehoer', 'WMF Induktionskochfeld-Schutzmatte - Silikon'),],
    rating: 4.6, reviewCount: 892, stock: 78, badges: ['new'],
    description: { de: 'Optimaler Schutz für Ihr wertvolles Induktionskochfeld. Diese hitzebeständige Silikonmatte verhindert effektiv Kratzer durch raue Pfannenböden und schützt vor Verschmutzungen. Dank der rutschhemmenden Oberfläche stehen Ihre Töpfe und Pfannen absolut sicher. Die Matte beeinträchtigt die magnetische Leitfähigkeit nicht, sodass die volle Leistung Ihres Induktionsherdes erhalten bleibt. Hitzebeständig bis 230°C, leicht abwischbar oder spülmaschinengeeignet. Ein Muss für jeden Besitzer eines modernen Induktionskochfeldes.' },
    shortDescription: { de: 'Anti-Rutsch-Schutzmatte für kratzfreies Kochen auf Induktion' },
    specs: { material: 'Spezial-Silikon', dimensions: '24 cm Ø', weight: '0,1 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530702329', supplierSku: 'WMF-06-1817-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 84 — ZWILLING Twin Prof Pfannenwender
  {
    id: 'zw-tp-wender', slug: 'zwilling-twin-prof-pfannenwender',
    name: { de: 'ZWILLING Twin Prof Pfannenwender – Flexibel' },
    category: 'zubehoer', price: 28.42, oldPrice: 29,
    images: [p('zwilling-twin-prof-pfannenwender', '1.png', 'zubehoer', 'ZWILLING Twin Prof Pfannenwender - Flexibel'),
          p('zwilling-twin-prof-pfannenwender', '2.png', 'zubehoer', 'ZWILLING Twin Prof Pfannenwender - Flexibel'),
          p('zwilling-twin-prof-pfannenwender', '3.png', 'zubehoer', 'ZWILLING Twin Prof Pfannenwender - Flexibel'),
          p('zwilling-twin-prof-pfannenwender', '4.png', 'zubehoer', 'ZWILLING Twin Prof Pfannenwender - Flexibel'),],
    rating: 4.8, reviewCount: 564, stock: 29, badges: [],
    description: { de: 'Die perfekte Symbiose aus Stabilität und Flexibilität. Der ZWILLING Twin Prof Pfannenwender besticht durch sein funktionales Design aus hochwertigem Edelstahl und schwarzem Kunststoff. Die extra dünne, elastische Schaufel ermöglicht ein müheloses Wenden von empfindlichen Speisen wie Fisch oder Omeletts. Der ergonomisch geformte Rundgriff mit integrierter Aufhängöse liegt sicher und komfortabel in der Hand. Die zeitlose Optik fügt sich perfekt in jede moderne Küche ein. Rostfrei und spülmaschinengeeignet.' },
    shortDescription: { de: 'Hochwertiger, flexibler Wender für präzises Arbeiten' },
    specs: { material: 'Edelstahl 18/10, Kunststoff', dimensions: '34 cm Länge', weight: '0,2 kg', dishwasher: true, induction: false },
    brand: 'ZWILLING', ean: '4009839211608', supplierSku: 'ZW-37805-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 85 — Fissler Magic Pfannenstapelhilfe
  {
    id: 'fi-mag-stack', slug: 'fissler-magic-pfannenstapelhilfe',
    name: { de: 'Fissler Magic Pfannenstapelhilfe – Metall verchromt' },
    category: 'zubehoer', price: 23.52, oldPrice: 24,
    images: [p('fissler-magic-pfannenstapelhilfe', '1.png', 'zubehoer', 'Fissler Magic Pfannenstapelhilfe – Metall verchromt'),
          p('fissler-magic-pfannenstapelhilfe', '2.png', 'zubehoer', 'Fissler Magic Pfannenstapelhilfe – Metall verchromt'),],
    rating: 4.5, reviewCount: 212, stock: 15, badges: [],
    description: { de: 'Endlich Ordnung im Küchenschrank. Die Fissler Magic Pfannenstapelhilfe ermöglicht das übersichtliche und platzsparende Stapeln von bis zu vier Pfannen unterschiedlicher Größe. Durch die vertikale Lagerung haben Sie jederzeit direkten Zugriff auf die gewünschte Pfanne, ohne andere anheben zu müssen. Die stabilen, verchromten Drahtbügel sind mit einer Kunststoffbeschichtung versehen, um Kratzer an Ihren hochwertigen Pfannen zu vermeiden. Ein robuster und praktischer Organizer für jede Küche.' },
    shortDescription: { de: 'Vertikaler Pfannen-Organizer für mehr Platz und Ordnung' },
    specs: { material: 'Metall verchromt, Kunststoff', dimensions: '25 x 30 x 20 cm', weight: '1,2 kg', dishwasher: false, induction: false },
    brand: 'Fissler', ean: '4009209310336', supplierSku: 'FI-020-000-04-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 86 — WMF Hello FUNctionals Dampfgareinsatz
  {
    id: 'wmf-hello-steam', slug: 'wmf-hello-functionals-dampfgareinsatz',
    name: { de: 'WMF Hello FUNctionals Dampfgareinsatz – Faltbar' },
    category: 'zubehoer', price: 38.22, oldPrice: 39,
    images: [p('wmf-hello-functionals-dampfgareinsatz', '1.png', 'zubehoer', 'WMF Hello FUNctionals Dampfgareinsatz - Faltbar'),
          p('wmf-hello-functionals-dampfgareinsatz', '2.png', 'zubehoer', 'WMF Hello FUNctionals Dampfgareinsatz - Faltbar'),],
    rating: 4.7, reviewCount: 186, stock: 24, badges: ['new'],
    description: { de: 'Vielseitigkeit in Bestform. Der faltbare Dampfgareinsatz aus der Hello FUNctionals Serie verwandelt jeden handelsüblichen Topf (ab 18 cm) in einen vollwertigen Dampfgarer. Gefertigt aus hochwertigem Cromargan® Edelstahl 18/10 und hitzebeständigem Silikon, lässt sich der Einsatz durch seine Flügelkonstruktion flexibel an den Topfdurchmesser anpassen. Die kleinen Standfüße halten den Einsatz über dem Wasserstand, während die ausziehbaren Griffe ein sicheres Entnehmen ermöglichen. Ideal für vitaminschonendes Garen von Gemüse. Nach Gebrauch lässt er sich extrem platzsparend zusammenfalten.' },
    shortDescription: { de: 'Flexibler, faltbarer Edelstahleinsatz für gesundes Dampfgaren' },
    specs: { material: 'Cromargan® 18/10 Edelstahl, Silikon', dimensions: 'Ø 18-28 cm variabel', weight: '0,4 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530674329', supplierSku: 'WMF-18-7935-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 87 — Berndes Vario Click Induction Pfanne 20cm
  {
    id: 'be-vc-200', slug: 'berndes-vario-click-induction-pfanne-20cm',
    name: { de: 'Berndes Vario Click Induction Pfanne 20 cm – Aluguss' },
    category: 'kochen', price: 44.10, oldPrice: 45,
    images: [p('berndes-vario-click-induction-pfanne-20cm', '1.png', 'kochen', 'Berndes Vario Click Induction Pfanne 20 cm – Aluguss'),
          p('berndes-vario-click-induction-pfanne-20cm', '2.png', 'kochen', 'Berndes Vario Click Induction Pfanne 20 cm – Aluguss'),
          p('berndes-vario-click-induction-pfanne-20cm', '3.png', 'kochen', 'Berndes Vario Click Induction Pfanne 20 cm – Aluguss'),],
    rating: 4.7, reviewCount: 312, stock: 18, badges: [],
    description: { de: 'Kompakte Profi-Leistung für kleine Portionen. Die Berndes Vario Click Pfanne (20 cm) aus hochwertigem Aluminiumguss überzeugt durch den patentierten abnehmbaren Stiel, der mit einem einfachen Klick sicher einrastet. Der ca. 6 mm starke Premium-Induktionsboden bietet eine exzellente Wärmeverteilung und Formstabilität. Dank der 3-lagigen Teflon™ Radiance Antihaftversiegelung gelingen empfindliche Speisen wie Eier oder Saucen ohne Anhaften. Ohne Stiel ist die Pfanne voll backofentauglich und lässt sich extrem platzsparend verstauen. Ideal für Single-Haushalte oder als Ergänzung für Beilagen.' },
    shortDescription: { de: 'Kompakter Aluguss mit abnehmbarem Klick-Stiel – ideal für Induktion' },
    specs: { material: 'Aluminiumguss, Teflon Radiance', dimensions: '20 cm Ø', weight: '0,9 kg', dishwasher: true, induction: true },
    brand: 'Berndes', ean: '4006189074208', supplierSku: 'BE-074020', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 88 — ELO Pure Rubin Topfset 5-teilig
  {
    id: 'elo-pr-500', slug: 'elo-pure-rubin-topfset-5-teilig',
    name: { de: 'ELO Pure Rubin Topfset 5-teilig – Turbo-Induktion' },
    category: 'kochen', price: 116.62, oldPrice: 119,
    images: [
      p('elo-rubin-set', '1.png', 'kochen', 'ELO Pure Rubin Topfset 5-teilig – Turbo-Induktion'),
      p('elo-rubin-set', '2.png', 'kochen', 'ELO Pure Rubin Topfset 5-teilig – Turbo-Induktion'),
      p('elo-rubin-set', '3.png', 'kochen', 'ELO Pure Rubin Topfset 5-teilig – Turbo-Induktion')
    ],
    rating: 4.6, reviewCount: 528, stock: 12, badges: ['bestseller'],
    description: { de: 'Effizienz und Eleganz in Rubinrot. Das 5-teilige ELO Pure Rubin Topfset aus geschmiedetem Aluminium ist mit einer langlebigen Antihaftbeschichtung ausgestattet. Das technische Highlight ist der vollflächige Turbo-Induktionsboden, der die Aufheizzeit um bis zu 30% verkürzt und wertvolle Energie spart. Die stoßfesten Glasdeckel mit Edelstahlrand ermöglichen ein praktisches Sichtkochen. Die ergonomischen Griffe mit integriertem Flammschutz bieten Sicherheit und Komfort. Set-Inhalt: 3 Fleischtöpfe (16/20/24cm), 1 Bratentopf (20cm) – alle mit Deckel – sowie eine Stielkasserolle (16cm).' },
    shortDescription: { de: 'Energiesparendes Aluguss-Set mit schnellem Turbo-Induktionsboden' },
    specs: { material: 'Aluminium geschmiedet, Glas', dimensions: '5-teilig', weight: '6,2 kg', dishwasher: true, induction: true },
    brand: 'ELO', ean: '4006925906052', supplierSku: 'ELO-90605', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 89 — Rösle Silence Bratentopf 24cm
  {
    id: 'ro-si-240', slug: 'roesle-silence-bratentopf-24cm',
    name: { de: 'Rösle Silence Bratentopf 24 cm – Edelstahl 18/10' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [
      p('roesle-silence-topf', '1.png', 'kochen', 'Roesle Silence Bratentopf 24 cm - Edelstahl 18-10'),
      p('roesle-silence-topf', '2.png', 'kochen', 'Roesle Silence Bratentopf 24 cm - Edelstahl 18-10'),
      p('roesle-silence-topf', '3.png', 'kochen', 'Roesle Silence Bratentopf 24 cm - Edelstahl 18-10')
    ],
    rating: 4.8, reviewCount: 245, stock: 15, badges: ['premium'],
    description: { de: 'Der Spezialist für Schmorgerichte und Braten. Der Rösle Silence Bratentopf aus hochwertigem Edelstahl 18/10 besticht durch seine schwere Qualität und das durchdachte Design. Der gekapselte Sandwichboden mit Aluminiumkern sorgt für eine schnelle und gleichmäßige Wärmeverteilung. Ein besonderes Merkmal ist der Glasdeckel mit Silikonrand, der für einen festen, klapperfreien Sitz sorgt und ein lautloses Kochen ermöglicht. Die ergonomischen Edelstahlgriffe mit Silikoneinlage bleiben angenehm kühl. Mit integrierter Innenskala und breitem Schüttrand für tropffreies Ausgießen.' },
    shortDescription: { de: 'Hochwertiger Edelstahltopf mit klapperfreiem Silikon-Glasdeckel' },
    specs: { material: 'Edelstahl 18/10, Silikon, Glas', dimensions: '24 cm Ø, 4,3 L', weight: '2,4 kg', dishwasher: true, induction: true },
    brand: 'Rösle', ean: '4004293131642', supplierSku: 'RO-13164', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 90 — Kopf Josie Kochtopfset 7-teilig
  {
    id: 'ko-jo-700', slug: 'kopf-josie-kochtopfset-7-teilig',
    name: { de: 'Kopf Josie Kochtopfset 7-teilig – Aluguss abnehmbare Griffe' },
    category: 'kochen', price: 116.62, oldPrice: 119,
    images: [p('kopf-josie-kochtopfset-7-teilig', '1.png', 'kochen', 'Kopf Josie Kochtopfset 7-teilig – Aluguss abnehmbare Griffe'),
          p('kopf-josie-kochtopfset-7-teilig', '2.png', 'kochen', 'Kopf Josie Kochtopfset 7-teilig – Aluguss abnehmbare Griffe'),
          p('kopf-josie-kochtopfset-7-teilig', '3.png', 'kochen', 'Kopf Josie Kochtopfset 7-teilig – Aluguss abnehmbare Griffe'),],
    rating: 4.5, reviewCount: 892, stock: 21, badges: [],
    description: { de: 'Vielseitigkeit und Platzersparnis für jede Küche. Das 7-teilige Kopf Josie Set aus robustem Aluminiumguss ist die ideale Lösung für anspruchsvolle Köche mit begrenztem Stauraum. Alle Töpfe verfügen über die hochwertige ILAG Ultimate Antihaftbeschichtung für fettarmes Garen. Das Highlight sind die abnehmbaren Soft-Touch-Griffe, wodurch die Töpfe auch als Auflaufformen im Ofen genutzt werden können. Der starke Induktionsboden garantiert eine optimale Wärmeleitung. Set-Inhalt: 3 Kochtöpfe (16/20/24cm) mit Glasdeckeln und ein universeller abnehmbarer Griff.' },
    shortDescription: { de: 'Aluguss-Set mit abnehmbaren Griffen – ideal für Ofen und Schrank' },
    specs: { material: 'Aluminiumguss, ILAG Ultimate', dimensions: '7-teilig', weight: '5,5 kg', dishwasher: true, induction: true },
    brand: 'Kopf', ean: '4025457253468', supplierSku: 'KO-253468', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 91 — WMF Provence Plus Stielkasserolle 16cm
  {
    id: 'wmf-pp-160', slug: 'wmf-provence-plus-stielkasserolle-16cm',
    name: { de: 'WMF Provence Plus Stielkasserolle 16 cm – Cromargan®' },
    category: 'kochen', price: 34.30, oldPrice: 35,
    images: [p('wmf-provence-plus-stielkasserolle-16cm', '1.png', 'kochen', 'WMF Provence Plus Stielkasserolle 16cm - Cromargan'),
          p('wmf-provence-plus-stielkasserolle-16cm', '2.png', 'kochen', 'WMF Provence Plus Stielkasserolle 16cm - Cromargan'),
          p('wmf-provence-plus-stielkasserolle-16cm', '3.png', 'kochen', 'WMF Provence Plus Stielkasserolle 16cm - Cromargan'),],
    rating: 4.7, reviewCount: 1540, stock: 38, badges: [],
    description: { de: 'Der unverzichtbare Helfer für Saucen und kleine Mengen. Die WMF Provence Plus Stielkasserolle aus poliertem Cromargan® Edelstahl 18/10 überzeugt durch ihre Langlebigkeit und Pflegeleichtigkeit. Der bewährte TransTherm®-Allherdboden sorgt für eine schnelle Hitzaufnahme und gleichmäßige Verteilung auf allen Herdarten, inklusive Induktion. Der lange Stielgriff bietet eine sichere Handhabung und bleibt beim Kochen auf dem Herd angenehm kühl. Mit breitem Schüttrand für sauberes Ausgießen ohne Kleckern. Ein funktionaler Klassiker in gewohnter WMF Qualität.' },
    shortDescription: { de: 'Praktische Edelstahl-Kasserolle mit TransTherm®-Boden' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '16 cm Ø, 1,5 L', weight: '0,9 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530579877', supplierSku: 'WMF-07-2316-6380', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 92 — ZWILLING Neo Stielkasserolle 16cm
  {
    id: 'zw-neo-160', slug: 'zwilling-neo-stielkasserolle-16cm',
    name: { de: 'ZWILLING Neo Stielkasserolle 16 cm – mattierter Edelstahl' },
    category: 'kochen', price: 44.10, oldPrice: 45,
    images: [p('zwilling-neo-stielkasserolle-16cm', '1.png', 'kochen', 'ZWILLING Neo Stielkasserolle 16cm - mattierter Edelstahl'),
          p('zwilling-neo-stielkasserolle-16cm', '2.png', 'kochen', 'ZWILLING Neo Stielkasserolle 16cm - mattierter Edelstahl'),
          p('zwilling-neo-stielkasserolle-16cm', '3.png', 'kochen', 'ZWILLING Neo Stielkasserolle 16cm - mattierter Edelstahl'),
          p('zwilling-neo-stielkasserolle-16cm', '4.png', 'kochen', 'ZWILLING Neo Stielkasserolle 16cm - mattierter Edelstahl'),],
    rating: 4.6, reviewCount: 412, stock: 25, badges: [],
    description: { de: 'Puristisches Design und hohe Funktionalität für kleine Aufgaben. Die ZWILLING Neo Stielkasserolle aus edel mattiertem Edelstahl 18/10 ist ideal zum Zubereiten von Saucen, Aufwärmen von Milch oder Kochen kleiner Portionen. Der SIGMA Classic Sandwichboden mit starkem Aluminiumkern garantiert eine optimale Wärmeleitung und -speicherung. Dank der integrierten Füllskala lassen sich Mengen direkt im Topf abmessen. Der ergonomisch geformte Edelstahlgriff gewährleistet eine sichere Führung. Ein langlebiges und hygienisches Kochgeschirr, das in keiner modernen Küche fehlen sollte.' },
    shortDescription: { de: 'Mattierte Edelstahl-Kasserolle mit SIGMA Classic Boden' },
    specs: { material: 'Edelstahl 18/10 mattiert', dimensions: '16 cm Ø, 1,5 L', weight: '1,0 kg', dishwasher: true, induction: true },
    brand: 'ZWILLING', ean: '4009839343330', supplierSku: 'ZW-66005-160', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 93 — Silit Sicomatic t-plus Schnellkochtopf 2,5L
  {
    id: 'si-sico-250', slug: 'silit-sicomatic-t-plus-schnellkochtopf-2-5l',
    name: { de: 'Silit Sicomatic® t-plus Schnellkochtopf 2,5 L – Silargan®' },
    category: 'kochen', price: 106.82, oldPrice: 109,
    images: [p('silit-sicomatic-t-plus-schnellkochtopf-2-5l', '1.png', 'kochen', 'Silit Sicomatic t-plus Schnellkochtopf 2,5 L – Silargan®'),
          p('silit-sicomatic-t-plus-schnellkochtopf-2-5l', '2.png', 'kochen', 'Silit Sicomatic t-plus Schnellkochtopf 2,5 L – Silargan®'),],
    rating: 4.8, reviewCount: 312, stock: 14, badges: [],
    description: { de: 'Gesundes Schnellkochen für kleine Haushalte oder Beilagen. Der Silit Sicomatic® t-plus (2,5 L) aus der nickelfreien Funktionskeramik Silargan® bietet alle Vorteile der großen Modelle in kompakter Form. Die porenfrei geschlossene Oberfläche ist besonders geschmacksneutral und bewahrt das volle Aroma der Speisen. Mit drei einstellbaren Kochstufen gelingt die Zubereitung von Reis, Gemüse oder Fleisch vitaminschonend und bis zu 70% schneller. Das wartungsfreie Ventilsystem und das Einhand-Kochstufenregler-Prinzip garantieren höchste Sicherheit und einfachste Bedienung. Made in Germany.' },
    shortDescription: { de: 'Kompakter 2,5L Schnellkochtopf in nickelfreiem Silargan®' },
    specs: { material: 'Silargan® Funktionskeramik', dimensions: '18 cm Ø, 2,5 L', weight: '3,1 kg', dishwasher: true, induction: true },
    brand: 'Silit', ean: '4000530674336', supplierSku: 'SI-2101297185', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 94 — Fissler Vitavit Premium Schnellkochtopf 4,5L
  {
    id: 'fi-vv-450', slug: 'fissler-vitavit-premium-schnellkochtopf-4-5l',
    name: { de: 'Fissler Vitavit® Premium Schnellkochtopf 4,5 L – Induktion' },
    category: 'kochen', price: 175.42, oldPrice: 179,
    images: [p('fissler-vitavit-premium-schnellkochtopf-4-5l', '1.png', 'kochen', 'Fissler Vitavit Premium Schnellkochtopf 4,5 L – Induktion'),
          p('fissler-vitavit-premium-schnellkochtopf-4-5l', '2.png', 'kochen', 'Fissler Vitavit Premium Schnellkochtopf 4,5 L – Induktion'),
          p('fissler-vitavit-premium-schnellkochtopf-4-5l', '3.png', 'kochen', 'Fissler Vitavit Premium Schnellkochtopf 4,5 L – Induktion'),],
    rating: 4.9, reviewCount: 612, stock: 11, badges: ['premium'],
    description: { de: 'Der Testsieger für anspruchsvolle Genießer. Der Fissler Vitavit® Premium (4,5 L) setzt Maßstäbe in Sachen Sicherheit und Komfort. Die exklusive Ampelfunktion im Griff zeigt Ihnen genau an, wann der Herd zurückgeschaltet werden kann oder die Temperatur zu hoch ist. Vier Kochstufen, inklusive einer drucklosen Dampfgarstufe für extrem empfindliche Lebensmittel, bieten maximale Flexibilität. Der Cookstar® Allherdboden sorgt für eine perfekte Hitzeverteilung auf Induktion. Mit integrierter Messskala, Aufsetzhilfe und abnehmbarem Griff für eine kinderleichte Reinigung. Made in Germany.' },
    shortDescription: { de: 'Premium Schnellkochtopf mit Ampelfunktion und 4 Kochstufen' },
    specs: { material: 'Edelstahl 18/10', dimensions: '22 cm Ø, 4,5 L', weight: '3,8 kg', dishwasher: true, induction: true },
    brand: 'Fissler', ean: '4009209331638', supplierSku: 'FI-620-300-04-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 95 — WMF Perfect Schnellkochtopf-Set 4,5L + 3,0L
  {
    id: 'wmf-per-set', slug: 'wmf-perfect-schnellkochtopf-set-2-teilig',
    name: { de: 'WMF Perfect Schnellkochtopf-Set 2-teilig – 4,5 L + 3,0 L' },
    category: 'kochen', price: 146.02, oldPrice: 149,
    images: [
      p('wmf-perfect-set', '1.png', 'kochen', 'WMF Perfect Schnellkochtopf-Set 2-teilig - 4.5L + 3.0L'),
      p('wmf-perfect-set', '2.png', 'kochen', 'WMF Perfect Schnellkochtopf-Set 2-teilig - 4.5L + 3.0L')
    ],
    rating: 4.8, reviewCount: 1240, stock: 16, badges: ['bestseller'],
    description: { de: 'Das perfekte Duo für die flexible Küche. Dieses WMF Perfect Set kombiniert zwei Topfgrößen (4,5 L und 3,0 L) mit einem gemeinsamen Schnelldeckel. So haben Sie für jede Portionsgröße den passenden Topf zur Hand und sparen gleichzeitig Platz. Die bewährte Technik mit dem Kochschieber im abnehmbaren Deckelgriff macht die Bedienung kinderleicht. Gefertigt aus robustem Cromargan® Edelstahl 18/10 mit TransTherm®-Allherdboden. Das mehrstufige Sicherheitssystem mit Ankochautomatik und Restdrucksicherung garantiert maximale Zuverlässigkeit. Ein langlebiger Klassiker im praktischen Spar-Set.' },
    shortDescription: { de: 'Flexibles 2er-Set WMF Klassiker – platzsparend & effizient' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '2-teiliges Set', weight: '5,2 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530562589', supplierSku: 'WMF-07-9265-9990', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 96 — ELO Multilayer Bratentopf 20cm
  {
    id: 'elo-ml-200', slug: 'elo-multilayer-bratentopf-20cm',
    name: { de: 'ELO Multilayer Bratentopf 20 cm – 3-Schicht-Material' },
    category: 'kochen', price: 57.82, oldPrice: 59,
    images: [p('elo-multilayer-bratentopf-20cm', '1.png', 'kochen', 'ELO Multilayer Bratentopf 20 cm – 3-Schicht-Material'),
          p('elo-multilayer-bratentopf-20cm', '2.png', 'kochen', 'ELO Multilayer Bratentopf 20 cm – 3-Schicht-Material'),
          p('elo-multilayer-bratentopf-20cm', '3.png', 'kochen', 'ELO Multilayer Bratentopf 20 cm – 3-Schicht-Material'),],
    rating: 4.6, reviewCount: 112, stock: 24, badges: [],
    description: { de: 'Profi-Technik für die tägliche Küche. Der ELO Multilayer Bratentopf (20 cm) besteht aus einem durchgehenden 3-Schicht-Mehrschichtmaterial, das die Wärme blitzschnell vom Boden bis in die Seitenwände leitet. Dies ermöglicht ein extrem gleichmäßiges Garen und Anbraten bei gleichzeitig geringer Energiezufuhr. Der Topf verfügt über eine praktische Innenskalierung zum einfachen Abmessen von Flüssigkeiten und einen stoßfesten Güteglasdeckel. Hitzebeständig bis 240°C und für alle Herdarten, insbesondere Induktion, optimiert. Ideal für Beilagen, kleine Fleischgerichte oder Saucen.' },
    shortDescription: { de: 'Durchgehendes Mehrschichtmaterial für exzellente Wärmeleitung' },
    specs: { material: '3-Schicht-Mehrschichtmaterial, Glas', dimensions: '20 cm Ø, 2,5 L', weight: '1,8 kg', dishwasher: true, induction: true },
    brand: 'ELO', ean: '4006925904201', supplierSku: 'ELO-90420', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 97 — Ken Hom Performance Wok 32cm
  {
    id: 'kh-perf-320', slug: 'ken-hom-performance-wok-32cm',
    name: { de: 'Ken Hom Performance Wok 32 cm – Carbonstahl' },
    category: 'kochen', price: 48.02, oldPrice: 49,
    images: [
      p('ken-hom-perf', '1.png', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl'),
      p('ken-hom-perf', '2.png', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl'),
      p('ken-hom-perf', '3.png', 'kochen', 'Ken Hom Performance Wok 32 cm – Carbonstahl')
    ],
    rating: 4.8, reviewCount: 1240, stock: 25, badges: ['bestseller'],
    description: { de: 'Authentisches Wok-Kochen mit der Performance-Serie vom renommierten TV-Koch Ken Hom. Gefertigt aus robustem Carbonstahl für eine extrem schnelle und gleichmäßige Erhitzung – essenziell für das Pfannenrühren bei hohen Temperaturen. Der Wok verfügt über einen flachen Boden für maximale Stabilität auf allen modernen Herdarten inklusive Induktion. Mit ergonomischem Buchenholzgriff und praktischer Aufhängeschlaufe. Die 1,8 mm starke Konstruktion garantiert Langlebigkeit und Profi-Ergebnisse. 10 Jahre Herstellergarantie.' },
    shortDescription: { de: 'Authentischer Carbonstahl-Wok für Induktion – von Ken Hom empfohlen' },
    specs: { material: 'Carbonstahl, Buchenholz', dimensions: '32 cm Ø', weight: '1,4 kg', dishwasher: false, induction: true },
    brand: 'Ken Hom', ean: '5028921000324', supplierSku: 'KH-1320', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 98 — WMF Macao Wok 36cm
  {
    id: 'wmf-ma-360-set', slug: 'wmf-macao-wok-36cm-cromargan',
    name: { de: 'WMF Macao Wok 36 cm – Cromargan® Edelstahl' },
    category: 'kochen', price: 77.42, oldPrice: 79,
    images: [
      p('wmf-macao-wok-36cm', '1.png', 'kochen', 'WMF Macao Wok 36cm - Cromargan Edelstahl'),
      p('wmf-macao-wok-36cm', '2.png', 'kochen', 'WMF Macao Wok 36cm - Cromargan Edelstahl'),
      p('wmf-macao-wok-36cm', '3.png', 'kochen', 'WMF Macao Wok 36cm - Cromargan Edelstahl')
    ],
    rating: 4.7, reviewCount: 312, stock: 14, badges: ['premium'],
    description: { de: 'Fernöstliche Kochkunst trifft auf deutsches Design. Der WMF Macao Wok aus poliertem Cromargan® Edelstahl 18/10 bietet durch seine tiefe, halbrunde Form ideale Bedingungen für das Pfannenrühren und Dämpfen. Der TransTherm®-Allherdboden sorgt für eine optimale Wärmeverteilung und -speicherung. Das umfangreiche Set enthält einen Glasdeckel zum Sichtkochen und einen praktischen Ablagerost zum Warmhalten von bereits garten Zutaten. Die ergonomischen Seitengriffe ermöglichen eine sichere Handhabung. Ein langlebiges Highlight für jede Küche.' },
    shortDescription: { de: 'Großzügiger Edelstahl-Wok mit Glasdeckel und Ablagerost' },
    specs: { material: 'Cromargan® 18/10 Edelstahl, Glas', dimensions: '36 cm Ø', weight: '2,8 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530593125', supplierSku: 'WMF-07-9256-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 99 — ZWILLING Plus Wok 32cm
  {
    id: 'zw-plus-wok-320', slug: 'zwilling-plus-wok-32cm-induktion',
    name: { de: 'ZWILLING Plus Wok 32 cm – SIGMA Clad 3-Schicht' },
    category: 'kochen', price: 87.22, oldPrice: 89,
    images: [p('zwilling-plus-wok-32cm-induktion', '1.png', 'kochen', 'ZWILLING Plus Wok 32cm - SIGMA Clad 3-Schicht'),
          p('zwilling-plus-wok-32cm-induktion', '2.png', 'kochen', 'ZWILLING Plus Wok 32cm - SIGMA Clad 3-Schicht'),
          p('zwilling-plus-wok-32cm-induktion', '3.png', 'kochen', 'ZWILLING Plus Wok 32cm - SIGMA Clad 3-Schicht'),],
    rating: 4.8, reviewCount: 186, stock: 19, badges: ['premium'],
    description: { de: 'Professionelles Wok-Kochen dank modernster Mehrschicht-Technologie. Der ZWILLING Plus Wok besteht aus dem SIGMA Clad 3-Schicht-Material, das die Hitze blitzschnell und gleichmäßig bis zum obersten Rand leitet. Dies ermöglicht das authentische Garen bei hohen Temperaturen. Die hochwertige Edelstahloberfläche ist kratzfest und pflegeleicht. Der passgenaue Glasdeckel ist ideal für das vitaminschonende Garen und Dämpfen. Ein robuster Wok, der durch seine exzellente Wärmeleitung auf Induktionsherden überzeugt.' },
    shortDescription: { de: '3-Schicht-Mehrschichtmaterial für perfekte Asia-Küche' },
    specs: { material: 'SIGMA Clad 3-Schicht-Material', dimensions: '32 cm Ø', weight: '2,5 kg', dishwasher: true, induction: true },
    brand: 'ZWILLING', ean: '4009839343316', supplierSku: 'ZW-66002-320', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 100 — Tefal Daily Chef Wok 28cm
  {
    id: 'tf-daily-wok-280', slug: 'tefal-daily-chef-wok-28cm-antihaft',
    name: { de: 'Tefal Daily Chef Wok 28 cm – Titanium Antihaft' },
    category: 'kochen', price: 44.10, oldPrice: 45,
    images: [p('tefal-daily-chef-wok-28cm-antihaft', '1.png', 'kochen', 'Tefal Daily Chef Wok 28 cm – Titanium Antihaft'),
          p('tefal-daily-chef-wok-28cm-antihaft', '3.png', 'kochen', 'Tefal Daily Chef Wok 28 cm – Titanium Antihaft'),
          p('tefal-daily-chef-wok-28cm-antihaft', '4.png', 'kochen', 'Tefal Daily Chef Wok 28 cm – Titanium Antihaft'),],
    rating: 4.6, reviewCount: 892, stock: 45, badges: ['bestseller'],
    description: { de: 'Gesunde asiatische Küche für jeden Tag. Der Tefal Daily Chef Wok ist mit der extrem langlebigen Titanium Antihaft-Versiegelung ausgestattet, die das Anhaften verhindert und die Reinigung zum Kinderspiel macht. Die innovative Thermo-Signal™ Technologie zeigt durch Farbwechsel an, wann die Pfanne die ideale Starttemperatur erreicht hat. Dank des starken Induktionsbodens heizt der Wok besonders schnell auf. Die tiefe Form ist ideal zum spritzfreien Rühren und Schwenken großer Portionen. Ein leichter und handlicher Wok für die moderne Küche.' },
    shortDescription: { de: 'Langlebiger Wok mit Thermo-Signal™ und Titanium Beschichtung' },
    specs: { material: 'Aluminium, Titanium Versiegelung', dimensions: '28 cm Ø', weight: '1,1 kg', dishwasher: true, induction: true },
    brand: 'Tefal', ean: '3168430314129', supplierSku: 'TF-G27319', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 101 — Kopf Marra Wok-Set 4-teilig
  {
    id: 'ko-marra-set', slug: 'kopf-marra-wok-set-4-teilig-aluguss',
    name: { de: 'Kopf Marra Wok-Set 4-teilig – Aluguss massiv' },
    category: 'kochen', price: 57.82, oldPrice: 59,
    images: [p('kopf-marra-wok-set-4-teilig-aluguss', '1.png', 'kochen', 'Kopf Marra Wok-Set 4-teilig – Aluguss massiv'),
          p('kopf-marra-wok-set-4-teilig-aluguss', '2.png', 'kochen', 'Kopf Marra Wok-Set 4-teilig – Aluguss massiv'),
          p('kopf-marra-wok-set-4-teilig-aluguss', '3.png', 'kochen', 'Kopf Marra Wok-Set 4-teilig – Aluguss massiv'),],
    rating: 4.5, reviewCount: 214, stock: 22, badges: ['new'],
    description: { de: 'Das Kopf Marra Wok-Set ist die perfekte Komplettlösung für Asia-Fans. Der massive Wok aus Aluminiumguss zeichnet sich durch seine hervorragende Wärmeleitung und -speicherung aus. Die hochwertige ILAG Basic Antihaftbeschichtung ermöglicht ein fettarmes Braten und ist besonders leicht zu reinigen. Im Set enthalten sind ein hitzebeständiger Glasdeckel, ein Holzwendel und zwei Essstäbchen aus Bambus. Der starke Induktionsboden sorgt für eine optimale Performance auf allen Herdarten. Backofenfest bis 180°C.' },
    shortDescription: { de: 'Massiver Aluguss-Wok inklusive Deckel und Zubehör' },
    specs: { material: 'Aluminiumguss, Glas, Bambus', dimensions: '28 cm Ø', weight: '2,3 kg', dishwasher: true, induction: true },
    brand: 'Kopf', ean: '4025457253451', supplierSku: 'KO-253451', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 102 — GSW Gastrobräter 35x25cm
  {
    id: 'gsw-gastro-35', slug: 'gsw-gastrobraeter-edelstahl-35x25cm',
    name: { de: 'GSW Gastrobräter 35 x 25 cm – Edelstahl massiv' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [p('gsw-gastrobraeter-edelstahl-35x25cm', '1.png', 'kochen', 'GSW Gastrobräter 35 x 25 cm – Edelstahl massiv'),
          p('gsw-gastrobraeter-edelstahl-35x25cm', '2.png', 'kochen', 'GSW Gastrobräter 35 x 25 cm – Edelstahl massiv'),
          p('gsw-gastrobraeter-edelstahl-35x25cm', '3.png', 'kochen', 'GSW Gastrobräter 35 x 25 cm – Edelstahl massiv'),],
    rating: 4.7, reviewCount: 156, stock: 12, badges: [],
    description: { de: 'Gastronomie-Qualität für Ihr Zuhause. Der GSW Gastrobräter aus hochwertigem Edelstahl 18/10 ist ideal zum Braten, Schmoren und Gratinieren großer Portionen Fleisch oder Fisch. Der ca. 6 mm starke Sandwichboden mit FerroTherm® Technologie garantiert eine exzellente Wärmeverteilung auf allen Herdarten, insbesondere Induktion. Die massiven Edelstahlgriffe bieten einen sicheren Halt, und der passgenaue Edelstahldeckel hält die Feuchtigkeit im Bräter. Vielseitig einsetzbar im Backofen bis 240°C. Ein robuster Allrounder für Festtagsbraten und Aufläufe.' },
    shortDescription: { de: 'Professioneller Edelstahl-Bräter für Ofen und Induktionsherd' },
    specs: { material: 'Edelstahl 18/10', dimensions: '35 x 25 x 10 cm', weight: '3,5 kg', dishwasher: true, induction: true },
    brand: 'GSW', ean: '4005643414357', supplierSku: 'GSW-414357', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 103 — Rösle Elegance Grillpfanne 28cm
  {
    id: 'ro-elegance-grill', slug: 'roesle-elegance-grillpfanne-28cm-antihaft',
    name: { de: 'Rösle Elegance Grillpfanne 28 cm – Edelstahl' },
    category: 'kochen', price: 67.62, oldPrice: 69,
    images: [p('roesle-elegance-grillpfanne-28cm-antihaft', '1.png', 'kochen', 'Rösle Elegance Grillpfanne 28 cm – Edelstahl'),
          p('roesle-elegance-grillpfanne-28cm-antihaft', '2.png', 'kochen', 'Rösle Elegance Grillpfanne 28 cm – Edelstahl'),
          p('roesle-elegance-grillpfanne-28cm-antihaft', '3.png', 'kochen', 'Rösle Elegance Grillpfanne 28 cm – Edelstahl'),],
    rating: 4.8, reviewCount: 312, stock: 18, badges: ['bestseller'],
    description: { de: 'Die Rösle Elegance Grillpfanne vereint edles Design mit bester Grill-Performance. Das geriffelte Bodenprofil sorgt für die markanten Grillstreifen und ermöglicht ein fettarmes Braten, da das Bratgut nicht im eigenen Saft liegt. Die hochwertige ProPlex® Antihaftversiegelung ist extrem widerstandsfähig und hitzebeständig bis 260°C. Der gekapselte Sandwichboden sorgt für eine schnelle und gleichmäßige Hitzeverteilung auf Induktionsfeldern. Der ergonomische Edelstahlgriff gewährleistet eine sichere Handhabung beim Wenden von Steaks, Fisch oder Gemüse.' },
    shortDescription: { de: 'Hochwertige Edelstahl-Grillpfanne mit langlebiger Versiegelung' },
    specs: { material: 'Edelstahl 18/10, ProPlex', dimensions: '28 cm Ø', weight: '1,4 kg', dishwasher: true, induction: true },
    brand: 'Rösle', ean: '4004293131697', supplierSku: 'RO-13169', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 104 — WMF Grillpfanne 27x27cm
  {
    id: 'wmf-grill-27', slug: 'wmf-grillpfanne-quadratisch-27cm',
    name: { de: 'WMF Grillpfanne 27 x 27 cm – Cromargan®' },
    category: 'kochen', price: 57.82, oldPrice: 59,
    images: [p('wmf-grillpfanne-quadratisch-27cm', '1.png', 'kochen', 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch'),
          p('wmf-grillpfanne-quadratisch-27cm', '2.png', 'kochen', 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch'),
          p('wmf-grillpfanne-quadratisch-27cm', '3.png', 'kochen', 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch'),],
    rating: 4.8, reviewCount: 842, stock: 24, badges: ['premium'],
    description: { de: 'Genießen Sie perfekt gegrillte Köstlichkeiten direkt von Ihrem Induktionsherd. Die quadratische WMF Grillpfanne aus poliertem Cromargan® Edelstahl 18/10 bietet eine großzügige Bratfläche. Die ausgeprägten Grillrippen sorgen nicht nur für ein optisch ansprechendes Grillmuster, sondern lassen überschüssiges Fett einfach ablaufen. Der TransTherm®-Allherdboden gewährleistet eine exzellente Wärmeverteilung und lange Speicherung. Die Pfanne ist backofenfest und dank der hochwertigen Materialien extrem formstabil und pflegeleicht. Ideal für saftige Steaks, Geflügel oder Grillgemüse.' },
    shortDescription: { de: 'Quadratische Profi-Grillpfanne aus robustem Cromargan®' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '27 x 27 cm', weight: '1,6 kg', dishwasher: true, induction: true },
    brand: 'WMF', ean: '4000530593132', supplierSku: 'WMF-07-9257-6040', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 105 — Lodge Grillpfanne quadratisch 26cm
  {
    id: 'lo-lodge-grill', slug: 'lodge-gusseisen-grillpfanne-quadratisch-26cm',
    name: { de: 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch' },
    category: 'kochen', price: 48.02, oldPrice: 49,
    images: [p('lodge-gusseisen-grillpfanne-quadratisch-26cm', '1.png', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch'),
          p('lodge-gusseisen-grillpfanne-quadratisch-26cm', '2.png', 'kochen', 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch'),],
    rating: 4.9, reviewCount: 2156, stock: 15, badges: ['premium'],
    description: { de: 'Authentisches Barbecue-Aroma für die Küche. Die quadratische Lodge Grillpfanne aus massivem Gusseisen wird in den USA gefertigt und ist bereits werkseitig mit natürlichem Pflanzenöl eingebrannt (Pre-Seasoned). Das Gusseisen speichert die Hitze extrem lang und sorgt für eine gleichmäßige Temperaturverteilung – perfekt für das scharfe Anbraten von Steaks. Die tiefen Grillrippen ermöglichen ein gesundes Braten durch das Ablaufen von Fett. Der Boden ist für die optimale Nutzung auf Induktionsherden plan geschliffen. Ein unverwüstliches Erbstück für Generationen.' },
    shortDescription: { de: 'Traditionelle US-Gusseisen-Grillpfanne für Induktion' },
    specs: { material: 'Gusseisen, eingebrannt', dimensions: '26 x 26 cm', weight: '3,1 kg', dishwasher: false, induction: true },
    brand: 'Lodge', ean: '0076501003415', supplierSku: 'LODGE-L8SGP3', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 106 — Berndes Balance Induction Grillpfanne 28cm
  {
    id: 'be-balance-grill', slug: 'berndes-balance-induction-grillpfanne-28cm-alu',
    name: { de: 'Berndes Balance Induction Grillpfanne 28 cm – Aluguss' },
    category: 'kochen', price: 53.90, oldPrice: 55,
    images: [p('berndes-balance-induction-grillpfanne-28cm-alu', '1.png', 'kochen', 'Berndes Balance Induction Grillpfanne 28 cm – Aluguss'),
          p('berndes-balance-induction-grillpfanne-28cm-alu', '2.png', 'kochen', 'Berndes Balance Induction Grillpfanne 28 cm – Aluguss'),
          p('berndes-balance-induction-grillpfanne-28cm-alu', '3.png', 'kochen', 'Berndes Balance Induction Grillpfanne 28 cm – Aluguss'),
          p('berndes-balance-induction-grillpfanne-28cm-alu', '4.png', 'kochen', 'Berndes Balance Induction Grillpfanne 28 cm – Aluguss'),],
    rating: 4.6, reviewCount: 184, stock: 21, badges: [],
    description: { de: 'Leichter Grillgenuss mit höchstem Komfort. Die Berndes Balance Induction Grillpfanne aus verstärktem Aluminiumguss ist mit einer langlebigen 3-lagigen Antihaftversiegelung ausgestattet, die PFOA-frei ist. Der spezialisierte Induktionsboden heizt blitzschnell auf und sorgt für eine gleichmäßige Wärmeverteilung über die gesamte Fläche. Die markante Grillstruktur ermöglicht ein fettarmes Braten und verleiht Ihrem Grillgut das typische Aroma. Mit ergonomischem Stielgriff in Edelstahloptik. Ideal für die moderne, gesundheitsbewusste Küche.' },
    shortDescription: { de: 'Induktions-Grillpfanne aus Aluguss mit hochwertiger Antihaftversiegelung' },
    specs: { material: 'Aluminiumguss, Antihaftversiegelung', dimensions: '28 x 28 cm', weight: '1,3 kg', dishwasher: true, induction: true },
    brand: 'Berndes', ean: '4006189074291', supplierSku: 'BE-074029', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 107 — WMF Profi Plus Pfannenwender 33cm
  {
    id: 'wmf-prof-wender', slug: 'wmf-profi-plus-pfannenwender-edelstahl-33cm',
    name: { de: 'WMF Profi Plus Pfannenwender 33 cm – Edelstahl' },
    category: 'zubehoer', price: 18.62, oldPrice: 19,
    images: [p('wmf-profi-plus-pfannenwender-edelstahl-33cm', '1.png', 'zubehoer', 'WMF Profi Plus Pfannenwender 33cm - Edelstahl'),
          p('wmf-profi-plus-pfannenwender-edelstahl-33cm', '2.png', 'zubehoer', 'WMF Profi Plus Pfannenwender 33cm - Edelstahl'),
          p('wmf-profi-plus-pfannenwender-edelstahl-33cm', '3.png', 'zubehoer', 'WMF Profi Plus Pfannenwender 33cm - Edelstahl'),],
    rating: 4.8, reviewCount: 1540, stock: 85, badges: ['bestseller'],
    description: { de: 'Ein Profi-Werkzeug für Ihre Küche. Der WMF Profi Plus Pfannenwender ist aus unverwüstlichem Cromargan® Edelstahl 18/10 gefertigt. Seine stabile, flache Konstruktion macht ihn zum idealen Helfer beim Wenden von Kurzgebratenem, Fisch oder Pfannkuchen. Das ergonomische Design sorgt für eine angenehme Handhabung, während die praktische Aufhängöse eine platzsparende Aufbewahrung an der Küchenleiste ermöglicht. Absolut formstabil, geruchs- und geschmacksneutral sowie spülmaschinengeeignet. Ein unverzichtbares Zubehör in Gastronomie-Qualität.' },
    shortDescription: { de: 'Funktionaler Pfannenwender aus Cromargan® Edelstahl' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '33 cm Länge', weight: '0,2 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530562572', supplierSku: 'WMF-18-7101-6030', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 108 — ZWILLING Pro Schöpflöffel
  {
    id: 'zw-pro-schoepf', slug: 'zwilling-pro-schoepfloeffel-edelstahl',
    name: { de: 'ZWILLING Pro Schöpflöffel – Edelstahl 18/10' },
    category: 'zubehoer', price: 24.50, oldPrice: 25,
    images: [p('zwilling-pro-schoepfloeffel-edelstahl', '1.png', 'zubehoer', 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10'),
          p('zwilling-pro-schoepfloeffel-edelstahl', '2.png', 'zubehoer', 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10'),
          p('zwilling-pro-schoepfloeffel-edelstahl', '3.png', 'zubehoer', 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10'),],
    rating: 4.9, reviewCount: 642, stock: 42, badges: ['premium'],
    description: { de: 'Zeitlose Ästhetik trifft auf funktionale Perfektion. Der ZWILLING Pro Schöpflöffel, entworfen vom renommierten Design-Duo Matteo Thun und Antonio Rodriguez, besticht durch seine elegante Linienführung. Gefertigt aus hochwertigem Edelstahl 18/10, ist er extrem robust, korrosionsbeständig und absolut hygienisch. Der ergonomisch geformte Stiel sorgt für eine optimale Handhabung beim Schöpfen und Servieren von Suppen oder Eintöpfen. Ein Highlight für jede anspruchsvolle Küche, das sowohl funktional als auch optisch auf ganzer Linie überzeugt. Spülmaschinengeeignet.' },
    shortDescription: { de: 'Exklusiver Schöpflöffel aus rostfreiem Edelstahl – Design by Matteo Thun' },
    specs: { material: 'Edelstahl 18/10', dimensions: '32 cm Länge', weight: '0,25 kg', dishwasher: true, induction: false },
    brand: 'ZWILLING', ean: '4009839343323', supplierSku: 'ZW-37160-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 109 — Fissler Magic Pfannenschutz-Set 3-teilig
  {
    id: 'fi-magic-set', slug: 'fissler-magic-pfannenschutz-set-vlies-3-teilig',
    name: { de: 'Fissler Magic Pfannenschutz-Set 3-teilig – Textil' },
    category: 'zubehoer', price: 18.62, oldPrice: 19,
    images: [p('fissler-magic-pfannenschutz-set-vlies-3-teilig', '1.png', 'zubehoer', 'Fissler Magic Pfannenschutz-Set 3-teilig – Textil'),
          p('fissler-magic-pfannenschutz-set-vlies-3-teilig', '2.png', 'zubehoer', 'Fissler Magic Pfannenschutz-Set 3-teilig – Textil'),],
    rating: 4.7, reviewCount: 1240, stock: 150, badges: ['bestseller'],
    description: { de: 'Schonen Sie Ihr hochwertiges Kochgeschirr mit dem Fissler Magic Pfannenschutz-Set. Die drei Vlies-Einlagen verhindern zuverlässig das Zerkratzen von Antihaftbeschichtungen oder emaillierten Oberflächen beim platzsparenden Stapeln im Küchenschrank. Die universelle Sternform passt sich jeder Pfannengröße flexibel an und deckt auch die Seitenwände ab. Gefertigt aus weichem, strapazierfähigem Material, das die Lebensdauer Ihrer Pfannen erheblich verlängert. Ein kleines, aber unverzichtbares Accessoire für jeden passionierten Koch. Handwaschbar.' },
    shortDescription: { de: 'Zuverlässiger Kratzschutz für alle Pfannenarten – 3er Set' },
    specs: { material: 'Hochwertiges Textil-Vlies', dimensions: '38 cm Ø', weight: '0,1 kg', dishwasher: false, induction: false },
    brand: 'Fissler', ean: '4009209310329', supplierSku: 'FI-020-000-03-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 110 — WMF Twin Prof Pfannenwender
  {
    id: 'wmf-twin-pw', slug: 'wmf-twin-prof-pfannenwender-edelstahl',
    name: { de: 'WMF Twin Prof Pfannenwender – Edelstahl 18/10' },
    category: 'zubehoer', price: 28.42, oldPrice: 29,
    images: [p('wmf-twin-prof-pfannenwender-edelstahl', '1.png', 'zubehoer', 'WMF Twin Prof Pfannenwender - Edelstahl 18-10'),
          p('wmf-twin-prof-pfannenwender-edelstahl', '2.png', 'zubehoer', 'WMF Twin Prof Pfannenwender - Edelstahl 18-10'),
          p('wmf-twin-prof-pfannenwender-edelstahl', '3.png', 'zubehoer', 'WMF Twin Prof Pfannenwender - Edelstahl 18-10'),],
    rating: 4.8, reviewCount: 564, stock: 29, badges: [],
    description: { de: 'Präzision und Flexibilität vereint. Der WMF Twin Prof Pfannenwender ist ein unverzichtbares Werkzeug für jede Küche. Gefertigt aus hochwertigem Cromargan® Edelstahl 18/10, bietet er eine ideale Kombination aus Stabilität und Elastizität. Die extra dünne Vorderkante gleitet mühelos unter empfindliches Bratgut wie Fisch oder Omeletts. Der ergonomisch geformte Griff liegt sicher in der Hand und verfügt über eine praktische Aufhängöse. Ein langlebiger Begleiter in Profi-Qualität, der natürlich spülmaschinengeeignet ist.' },
    shortDescription: { de: 'Hochwertiger, flexibler Edelstahl-Wender für präzises Braten' },
    specs: { material: 'Cromargan® 18/10 Edelstahl', dimensions: '34 cm Länge', weight: '0,2 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530562596', supplierSku: 'WMF-18-7102-6030', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 111 — Fissler Magic Pfannenstapelhilfe Edelstahl
  {
    id: 'fi-stack-pro', slug: 'fissler-magic-pfannenstapelhilfe-edelstahl',
    name: { de: 'Fissler Magic Pfannenstapelhilfe – Edelstahl Design' },
    category: 'zubehoer', price: 23.52, oldPrice: 24,
    images: [p('fissler-magic-pfannenstapelhilfe-edelstahl', '1.png', 'zubehoer', 'Fissler Magic Pfannenstapelhilfe – Edelstahl Design'),
          p('fissler-magic-pfannenstapelhilfe-edelstahl', '2.png', 'zubehoer', 'Fissler Magic Pfannenstapelhilfe – Edelstahl Design'),
          p('fissler-magic-pfannenstapelhilfe-edelstahl', '3.png', 'zubehoer', 'Fissler Magic Pfannenstapelhilfe – Edelstahl Design'),],
    rating: 4.5, reviewCount: 212, stock: 15, badges: [],
    description: { de: 'Maximale Ordnung für Ihre Pfannensammlung. Die Fissler Magic Pfannenstapelhilfe ermöglicht das übersichtliche und vertikale Aufbewahren von bis zu vier Pfannen. Dies spart nicht nur wertvollen Platz im Küchenschrank, sondern schützt auch die empfindlichen Beschichtungen vor Kratzern durch direktes Aufeinanderstapeln. Die robuste Konstruktion aus verchromtem Metall ist universell einsetzbar für Pfannen aller Marken und Größen. Dank des offenen Designs haben Sie jederzeit schnellen Zugriff auf das passende Kochgeschirr.' },
    shortDescription: { de: 'Platzsparender Pfannen-Organizer für mehr Schutz und Übersicht' },
    specs: { material: 'Edelstahl verchromt', dimensions: '25 x 30 x 20 cm', weight: '1,2 kg', dishwasher: false, induction: false },
    brand: 'Fissler', ean: '4009209310336', supplierSku: 'FI-020-000-04-000', vatRatePercent: 19, priceIncludesVat: true,
  },
  // 112 — WMF Hello FUNctionals Dampfgareinsatz 24cm
  {
    id: 'wmf-hello-steam-24', slug: 'wmf-hello-functionals-dampfgareinsatz-24cm',
    name: { de: 'WMF Hello FUNctionals Dampfgareinsatz – Edelstahl' },
    category: 'zubehoer', price: 38.22, oldPrice: 39,
    images: [p('wmf-hello-functionals-dampfgareinsatz-24cm', '1.png', 'zubehoer', 'WMF Hello FUNctionals Dampfgareinsatz 24cm - Edelstahl'),
          p('wmf-hello-functionals-dampfgareinsatz-24cm', '2.png', 'zubehoer', 'WMF Hello FUNctionals Dampfgareinsatz 24cm - Edelstahl'),],
    rating: 4.6, reviewCount: 124, stock: 22, badges: ['new'],
    description: { de: 'Gesundes Dämpfen leicht gemacht. Der WMF Hello FUNctionals Dampfgareinsatz aus Cromargan® Edelstahl 18/10 passt in Töpfe und Pfannen von 20-24 cm Durchmesser. Ideal für schonendes Garen von Gemüse, Fisch und mehr. Die spezielle Silikonbeschichtung am Rand sorgt für sicheren Halt und kratzfeste Verwendung.' },
    shortDescription: { de: 'Vielseitiger Dampfgareinsatz für schonendes, vitaminreiches Garen' },
    specs: { material: 'Cromargan® 18/10 Edelstahl, Silikon', dimensions: '24 cm Ø passend', weight: '0,4 kg', dishwasher: true, induction: false },
    brand: 'WMF', ean: '4000530702312', supplierSku: 'WMF-17-6051-6040', vatRatePercent: 19, priceIncludesVat: true,
  },

];

export const products: Product[] = baseProducts;

const baseCategories: Category[] = [
  {
    id: 'kochen',
    name: { de: 'Kochen' },
    image: '/images/Kategorien/Kochen & Braten copie.webp',
    count: 0
  },
  {
    id: 'zubehoer',
    name: { de: 'Zubehör' },
    image: '/images/Kategorien/Küchenzubehör copie.webp',
    count: 0
  },
  {
    id: 'vorbereitung',
    name: { de: 'Vorbereitung' },
    image: '/images/Kategorien/Vorbereitung copie.webp',
    count: 0
  },
  {
    id: 'tischaccessoires',
    name: { de: 'Tischaccessoires' },
    image: '/images/Kategorien/Tisch & Servier copie.webp',
    count: 0
  },
  {
    id: 'sets',
    name: { de: 'Sets' },
    image: '/images/Kategorien/Kochen & Braten copie.webp', // Temporaire
    count: 0
  },
  {
    id: 'spezial',
    name: { de: 'Spezial' },
    image: '/images/Kategorien/Küchenzubehör copie.webp', // Temporaire
    count: 0
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
