import { LucideIcon } from 'lucide-react'

import { extendedCategoriesList, generateMassiveCatalog } from './extended-catalog'

export interface Product {
  id: string
  slug: string
  name: { de: string }
  category: string
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

const IMG = {
  kitchen1: '/images/products/pot-set-5.jpg',
  kitchen2: '/images/products/pan-pro-28.jpg',
  kitchen3: '/images/products/casserole-24.jpg',
  kitchen4: '/images/products/wok-32.jpg',
  kitchen5: '/images/products/grill-pan.jpg',
  kitchen6: '/images/products/knife-set-6.jpg',
  kitchen7: '/images/products/board-oak.jpg',
  kitchen8: '/images/products/board-walnut.jpg',
}

const baseProducts: Product[] = [
  {
    id: 'nova-ps-500',
    slug: 'premium-topfset-5-teilig-induktion',
    name: { de: 'Premium Induktions-Topfset 5-teilig – Edelstahl 18/10' },
    category: 'kochen',
    price: 520,
    oldPrice: 680,
    images: [IMG.kitchen1, IMG.kitchen2],
    rating: 4.9,
    reviewCount: 127,
    stock: 5,
    badges: ['premium', 'bestseller'],
    description: { de: 'Hochwertiges 5-teiliges Topfset aus 18/10 Edelstahl, speziell konzipiert für Induktionskochfelder. Sandwichboden für optimale Wärmeverteilung, ergonomische Edelstahlgriffe, backofengeeignet bis 250 °C. Enthält: 16 cm, 20 cm, 24 cm Kochtopf, 28 cm Bratpfanne und 24 cm Sauteuse mit Deckel.' },
    shortDescription: { de: 'Professionelles 5-teiliges Kochset für höchste Ansprüche' },
    specs: { material: '18/10 Edelstahl', dimensions: '16–28 cm', weight: '4,5 kg', dishwasher: true, induction: true }
  },
  {
    id: 'nova-do-450',
    slug: 'gusseisen-braeter-emailliert-26cm',
    name: { de: 'Gusseisen-Bräter emailliert – 26 cm, 5,2 Liter' },
    category: 'kochen',
    price: 480,
    oldPrice: 560,
    images: [IMG.kitchen2, IMG.kitchen3],
    rating: 4.9,
    reviewCount: 248,
    stock: 8,
    badges: ['premium', 'bestseller'],
    description: { de: 'Robuster Gusseisen-Bräter mit hochwertiger Emaillierung für alle Herdarten. Perfekt für Schmorgerichte, Brotbacken und Eintöpfe. Die gleichmäßige Wärmeverteilung des Gusseisens garantiert beste Kochergebnisse. Ofengeeignet bis 260 °C.' },
    shortDescription: { de: 'Vielseitiger Allrounder für Schmorgerichte und Brot' },
    specs: { material: 'Emailliertes Gusseisen', dimensions: '26 cm Ø, 5,2 Liter', weight: '6,2 kg', dishwasher: false, induction: true }
  },
  {
    id: 'nova-kp-320',
    slug: 'induktions-bratpfanne-28cm-keramik',
    name: { de: 'Induktions-Bratpfanne 28 cm – Keramikbeschichtung' },
    category: 'kochen',
    price: 129,
    oldPrice: 179,
    images: [IMG.kitchen3, IMG.kitchen1],
    rating: 4.7,
    reviewCount: 89,
    stock: 22,
    badges: ['new'],
    description: { de: 'Hochwertige Bratpfanne mit 3-lagiger PFOA-freier Keramikbeschichtung. Antihaft-Eigenschaften ohne schädliche Chemikalien. Induktionstauglich durch verstärkten Magnetboden. Spülmaschinengeeignet.' },
    shortDescription: { de: 'Gesund braten ohne Fett – 100% PFOA-frei' },
    specs: { material: 'Aluminium mit Keramikbeschichtung', dimensions: '28 cm Ø', weight: '1,1 kg', dishwasher: true, induction: true }
  },
  {
    id: 'nova-gp-450',
    slug: 'gusseisen-grillpfanne-28x28cm',
    name: { de: 'Gusseisen-Grillpfanne 28 × 28 cm – Streifenmuster' },
    category: 'kochen',
    price: 89,
    oldPrice: 119,
    images: [IMG.kitchen1, IMG.kitchen4],
    rating: 4.6,
    reviewCount: 156,
    stock: 14,
    badges: ['bestseller'],
    description: { de: 'Schwere Grillpfanne aus Gusseisen mit tiefen Rippen für authentische Grillstreifen. Perfekt für Steaks, Hähnchen, Gemüse und Fisch. Wird mit der Zeit besser – die eingebrannten Fettrückstände bilden eine natürliche Antihaftschicht.' },
    shortDescription: { de: 'Authentisches Grillerlebnis auf dem Induktionsherd' },
    specs: { material: 'Gusseisen', dimensions: '28 × 28 cm', weight: '3,4 kg', dishwasher: false, induction: true }
  },
  {
    id: 'nova-sp-490',
    slug: 'edelstahl-dampfgarer-24cm-3-etagen',
    name: { de: 'Edelstahl-Dampfgarer 24 cm – 3 Einsätze' },
    category: 'kochen',
    price: 149,
    images: [IMG.kitchen3, IMG.kitchen2],
    rating: 4.6,
    reviewCount: 42,
    stock: 11,
    badges: ['new'],
    description: { de: 'Dreilagiger Induktions-Dampfgarer aus gebürstetem Edelstahl. Gesundes Garen auf bis zu 3 Ebenen gleichzeitig – ideal für Gemüse, Fisch, Geflügel und Dim Sum. Mit Glasdeckel und Wasserpegelmessung.' },
    shortDescription: { de: 'Vitaminschonend auf 3 Ebenen gleichzeitig garen' },
    specs: { material: 'Edelstahl 18/10', dimensions: '24 cm Ø, 3 Einsätze', weight: '3,2 kg', dishwasher: true, induction: true }
  },
  {
    id: 'nova-wp-280',
    slug: 'wok-pfanne-32cm-antihaft',
    name: { de: 'Induktions-Wok 32 cm – Antihaft Carbonstahlbeschichtung' },
    category: 'kochen',
    price: 95,
    oldPrice: 130,
    images: [IMG.kitchen1, IMG.kitchen3],
    rating: 4.5,
    reviewCount: 73,
    stock: 18,
    badges: ['bestseller'],
    description: { de: 'Professioneller Induktionswok aus Carbonstahl mit 32 cm Durchmesser. Hervorragende Wärmeleitung und -speicherung für authentisches Wok-Kochen. Mit Holzgriff und Glasdeckel.' },
    shortDescription: { de: 'Authentisches Wok-Kochen auf dem Induktionsherd' },
    specs: { material: 'Carbonstahl', dimensions: '32 cm Ø', weight: '2,1 kg', dishwasher: false, induction: true }
  },
  {
    id: 'nova-ks-550',
    slug: 'profi-messerset-6-teilig-japanischer-stahl',
    name: { de: 'Profi-Messerset 6-teilig – Japanischer X50CrMoV15 Stahl' },
    category: 'vorbereitung',
    price: 389,
    oldPrice: 499,
    images: [IMG.kitchen4, IMG.kitchen5],
    rating: 4.8,
    reviewCount: 94,
    stock: 9,
    badges: ['premium'],
    description: { de: 'Professionelles 6-teiliges Messerset aus japanischem X50CrMoV15 Edelstahl. Enthält: Kochmesser 20 cm, Santoku 17 cm, Gemüsemesser 14 cm, Brotmesser 20 cm, Schälmesser 9 cm und Wetzstahl. Ergonomische Pakkaholzgriffe, inkl. Holzblock.' },
    shortDescription: { de: 'Japanische Präzision für die perfekte Schneidetechnik' },
    specs: { material: 'X50CrMoV15 Japanstahl', dimensions: '9–20 cm Klingen', weight: '2,1 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-km-180',
    slug: 'kochmesser-santoku-17cm',
    name: { de: 'Santoku-Messer 17 cm – Damaszener Stahl 67 Lagen' },
    category: 'vorbereitung',
    price: 149,
    oldPrice: 199,
    images: [IMG.kitchen4, IMG.kitchen5],
    rating: 4.9,
    reviewCount: 213,
    stock: 16,
    badges: ['premium', 'bestseller'],
    description: { de: 'Handgefertigtes Santoku-Messer aus 67 Lagen Damaszener Stahl mit einem Kern aus VG-10 Stahl. Außerordentliche Schärfe und Schnitthaltigkeit. Ergonomischer G10-Griff, gehämmerte Klinge für optimale Antihafteigenschaften.' },
    shortDescription: { de: 'Damastmesser für professionelle Koch-Ergebnisse' },
    specs: { material: '67-lagiger Damaszener Stahl, VG-10 Kern', dimensions: '17 cm Klinge', weight: '198 g', dishwasher: false, induction: false }
  },
  {
    id: 'nova-sb-220',
    slug: 'bambus-schneidebrett-set-3-teilig',
    name: { de: 'Bambus-Schneidebrett Set 3-teilig – Antibakteriell' },
    category: 'vorbereitung',
    price: 59,
    images: [IMG.kitchen5, IMG.kitchen4],
    rating: 4.5,
    reviewCount: 67,
    stock: 31,
    badges: ['new'],
    description: { de: 'Nachhaltiges 3-teiliges Schneidebrettset aus zertifiziertem Bambus. Von Natur aus antibakteriell und messerschonend. Mit Auffangnut für Fleischsäfte. Größen: 25×35 cm, 30×40 cm, 35×45 cm.' },
    shortDescription: { de: 'Nachhaltig, hygienisch und messerschonend' },
    specs: { material: 'Bambus, FSC-zertifiziert', dimensions: '25–45 cm', weight: '1,8 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-bl-420',
    slug: 'hochleistungs-standmixer-2200w',
    name: { de: 'Hochleistungs-Standmixer 2200 W – 7 Automatikprogramme' },
    category: 'vorbereitung',
    price: 349,
    oldPrice: 459,
    images: [IMG.kitchen5, IMG.kitchen6],
    rating: 4.7,
    reviewCount: 138,
    stock: 7,
    badges: ['new'],
    description: { de: 'Professioneller Standmixer mit 2200-Watt-Motor und 7 vorprogrammierten Automatikfunktionen. Ideal für Smoothies, Suppen, Saucen und Nussbutter. Mit Selbstreinigungsprogramm und BPA-freiem 2-Liter-Behälter.' },
    shortDescription: { de: 'Profi-Power für cremige Ergebnisse in Sekunden' },
    specs: { material: 'Edelstahl & BPA-freier Tritan', dimensions: '45 × 20 × 20 cm', weight: '4,8 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-rm-580',
    slug: 'kuechenmaschine-multifunktion-1400w',
    name: { de: 'Küchenmaschine 1400 W – 12 Funktionen, 6,5 L Schüssel' },
    category: 'vorbereitung',
    price: 499,
    oldPrice: 649,
    images: [IMG.kitchen6, IMG.kitchen5],
    rating: 4.8,
    reviewCount: 194,
    stock: 9,
    badges: ['premium', 'bestseller'],
    description: { de: 'Leistungsstarke Küchenmaschine mit 1400-Watt-Motor und 12 Aufsätzen: Knethaken, Rührbesen, Schneebesen, Spiralschneider, Gemüsereiber, Fleischwolf und mehr. Edelstahlschüssel 6,5 Liter, 10 Geschwindigkeitsstufen.' },
    shortDescription: { de: 'Die Allzweckwaffe für ambitionierte Hobbyköche' },
    specs: { material: 'Metall-Gehäuse, Edelstahlschüssel', dimensions: '40 × 26 × 38 cm', weight: '6,2 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-rw-195',
    slug: 'mandoline-gemüsehobel-profi',
    name: { de: 'Profi-Mandoline Gemüsehobel – 5 Schnittarten, Edelstahl' },
    category: 'vorbereitung',
    price: 79,
    oldPrice: 99,
    images: [IMG.kitchen5, IMG.kitchen4],
    rating: 4.4,
    reviewCount: 52,
    stock: 20,
    badges: ['new'],
    description: { de: 'Professionelle Edelstahl-Mandoline mit 5 auswechselbaren Edelstahlklingen. Julienne, Waffel-, Brunoise-, Scheiben- und Dickschnitt von 1–8 mm einstellbar. Mit eingebautem Schnittstärkeeinstellrad und Handschutz.' },
    shortDescription: { de: 'Präzisionsschnitte wie ein Profikoch' },
    specs: { material: 'Edelstahl 18/10', dimensions: '35 × 16 cm', weight: '1,4 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-us-380',
    slug: 'edelstahl-küchenutensilien-set-10-teilig',
    name: { de: 'Edelstahl Küchenutensilien Set 10-teilig – Inkl. Ständer' },
    category: 'zubehoer',
    price: 89,
    oldPrice: 119,
    images: [IMG.kitchen7, IMG.kitchen1],
    rating: 4.7,
    reviewCount: 231,
    stock: 27,
    badges: ['bestseller'],
    description: { de: 'Komplettes 10-teiliges Küchenutensilien-Set aus hochwertigem 18/10 Edelstahl. Enthält: Schöpflöffel, Pfannenwender, Suppenkelle, Schaumlöffel, Nudelzange, Spaghettilöffel, Fleischgabel, Saucenlöffel, Schneebesen und Dreher. Mit elegantem Edelstahlständer.' },
    shortDescription: { de: 'Alles, was der ambitionierte Hobbykoch braucht' },
    specs: { material: 'Edelstahl 18/10', dimensions: 'Verschiedene Größen, 28–35 cm', weight: '1,8 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-mx-240',
    slug: 'multifunktions-schaeler-3-in-1',
    name: { de: 'Induktions-Starterset Wok & Zubehör – 8-teilig' },
    category: 'zubehoer',
    price: 149,
    oldPrice: 199,
    images: [IMG.kitchen7, IMG.kitchen3],
    rating: 4.5,
    reviewCount: 41,
    stock: 13,
    badges: ['new'],
    description: { de: 'Komplettes Wok-Starterset für die Induktionsküche. Enthält: 32 cm Carbonstahl-Wok, Bambusspatel, Schöpflöffel, Wok-Ständer, Bambus-Dampfkorb, Glasdeckel, Reinigungsbürste und Anleitung. Perfekter Einstieg in die asiatische Küche.' },
    shortDescription: { de: 'Alles für die perfekte asiatische Küche' },
    specs: { material: 'Carbonstahl, Bambus, Glas', dimensions: '32 cm Ø', weight: '3,5 kg', dishwasher: false, induction: true }
  },
  {
    id: 'nova-kf-165',
    slug: 'kaffeemuehle-elektrisch-einstellbar',
    name: { de: 'Elektrische Kaffeemühle mit 18 Mahlgradstufen – Kegelmahlwerk' },
    category: 'zubehoer',
    price: 129,
    oldPrice: 169,
    images: [IMG.kitchen6, IMG.kitchen5],
    rating: 4.6,
    reviewCount: 88,
    stock: 19,
    badges: ['new'],
    description: { de: 'Professionelle Kaffeemühle mit Edelstahl-Kegelmahlwerk. 18 präzise Mahlgradstufen von fein (Espresso) bis grob (French Press). Zeitgeber-Funktion, 250 g Bohnenbehälter. Für alle Kaffeearten geeignet.' },
    shortDescription: { de: 'Frisch gemahlener Kaffee auf Knopfdruck' },
    specs: { material: 'Edelstahl-Kegelmahlwerk', dimensions: '17 × 12 × 26 cm', weight: '2,2 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-wg-320',
    slug: 'digitale-kuechenwaage-edelstahl',
    name: { de: 'Digitale Küchenwaage 5 kg – Edelstahl, 1-g-Genauigkeit' },
    category: 'zubehoer',
    price: 39,
    images: [IMG.kitchen7, IMG.kitchen8],
    rating: 4.4,
    reviewCount: 312,
    stock: 45,
    badges: ['bestseller'],
    description: { de: 'Precise Edelstahl-Küchenwaage mit 1-g-Genauigkeit bis 5 kg. Tara-Funktion, Einheitenwechsel (g, kg, oz, lb), LCD-Display. Ideal für Backen, Kochen und Diät. Inkl. 2 Batterien, spülmaschinenfestes Wiegeblech.' },
    shortDescription: { de: 'Gramm-genaue Präzision für perfekte Rezepte' },
    specs: { material: 'Edelstahl-Wiegeblech', dimensions: '22 × 17 × 2,5 cm', weight: '0,6 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-sg-280',
    slug: 'porzellan-servierplatten-set-3-teilig',
    name: { de: 'Porzellan Servierplatten Set 3-teilig – Fine Bone China' },
    category: 'tischaccessoires',
    price: 119,
    oldPrice: 159,
    images: [IMG.kitchen8, IMG.kitchen7],
    rating: 4.7,
    reviewCount: 54,
    stock: 14,
    badges: ['new'],
    description: { de: 'Elegantes 3-teiliges Servierplatten-Set aus Fine Bone China Porzellan. Hauchzartes, dennoch stabiles Material. Perfekt für Käse, Wurstwaren, Vorspeisen und Desserts. Spülmaschinen- und mikrowellengeeignet. Größen: 25 cm, 32 cm, 40 cm.' },
    shortDescription: { de: 'Elegantes Servieren wie im Sternerestaurant' },
    specs: { material: 'Fine Bone China Porzellan', dimensions: '25–40 cm', weight: '1,9 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-sv-190',
    slug: 'vakuumierer-profi-automatisch',
    name: { de: 'Vakuumierer Profi Automatik – Inkl. 30 Beutel & Behälter' },
    category: 'zubehoer',
    price: 199,
    oldPrice: 249,
    images: [IMG.kitchen6, IMG.kitchen5],
    rating: 4.6,
    reviewCount: 76,
    stock: 11,
    badges: ['new'],
    description: { de: 'Professionelles Vakuumiergerät mit vollautomatischer Beutelversiegelung. Lebensmittel bis zu 5× länger frisch. Inkl. 30 Folienbeutel (20 × 28 cm), Vakuumbehälter 1,5 L und Schlauchaufsatz. Für Sous-vide-Garen geeignet.' },
    shortDescription: { de: 'Frische verlängern & Sous-vide perfektionieren' },
    specs: { material: 'ABS-Kunststoff, Edelstahlleiste', dimensions: '38 × 14 × 8 cm', weight: '1,9 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-tp-145',
    slug: 'teeservice-porzellan-6-teilig',
    name: { de: 'Teeservice 6-teilig aus Porzellan – Skandinavisches Design' },
    category: 'tischaccessoires',
    price: 89,
    images: [IMG.kitchen8, IMG.kitchen7],
    rating: 4.5,
    reviewCount: 38,
    stock: 21,
    badges: ['new'],
    description: { de: 'Zeitloses 6-teiliges Teeservice aus hochwertigem Porzellan. Enthält 6 Tassen (200 ml), 6 Untertassen und 1 Teekanne (1,2 L). Minimalistisches skandinavisches Design, spülmaschinenfest.' },
    shortDescription: { de: 'Teezeit mit elegantem Stil genießen' },
    specs: { material: 'Premium-Porzellan', dimensions: 'Tassen: 8 cm Ø, Kanne: 22 cm', weight: '2,4 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-gs-410',
    slug: 'gewuerzregal-mit-12-glaesern',
    name: { de: 'Drehbarer Gewürzständer 24 Gläser – Edelstahl, befüllt' },
    category: 'tischaccessoires',
    price: 69,
    oldPrice: 89,
    images: [IMG.kitchen8, IMG.kitchen6],
    rating: 4.4,
    reviewCount: 119,
    stock: 26,
    badges: ['bestseller'],
    description: { de: 'Eleganter 360° drehbarer Edelstahl-Gewürzständer mit 24 befüllten Gewürzgläsern. Gläser mit Siebaufsatz und Korkverschluss. Kompakt und platzsparend, Standfläche nur 26 cm Ø. Inkl. 24 Etiketten zum Beschriften.' },
    shortDescription: { de: 'Gewürze griffbereit und elegant präsentiert' },
    specs: { material: 'Edelstahl, Borosilikatglas', dimensions: '26 cm Ø, 38 cm hoch', weight: '3,1 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-tk-290',
    slug: 'thermos-teekanne-doppelwandig-1l',
    name: { de: 'Thermoskanne Edelstahl 1 L – Doppelwandig, 12 Stunden warm' },
    category: 'tischaccessoires',
    price: 59,
    oldPrice: 79,
    images: [IMG.kitchen8, IMG.kitchen6],
    rating: 4.6,
    reviewCount: 204,
    stock: 33,
    badges: ['bestseller'],
    description: { de: 'Hochwertige doppelwandige Edelstahl-Thermoskanne mit Vakuumisolierung. Hält Getränke 12 Stunden heiß und 24 Stunden kalt. 360°-Öffnung, auslaufsicher, BPA-frei. Dishwasher safe.' },
    shortDescription: { de: 'Heiß oder kalt – 12 Stunden perfekte Temperatur' },
    specs: { material: 'Edelstahl 18/8 doppelwandig', dimensions: '8,5 cm Ø, 28 cm hoch', weight: '0,5 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-bb-175',
    slug: 'brotbackform-antihaft-2er-set',
    name: { de: 'Brotbackform Antihaft Set 2× – 30 cm, Kohlenstoffstahl' },
    category: 'kochen',
    price: 49,
    images: [IMG.kitchen7, IMG.kitchen2],
    rating: 4.3,
    reviewCount: 87,
    stock: 38,
    badges: [],
    description: { de: 'Stabiles 2er-Set Brotbackformen aus Kohlenstoffstahl mit 3-lagiger Antihaftbeschichtung. Kein Einfetten nötig. Maße: 30 × 11 × 8 cm. Backofengeeignet bis 220 °C, leicht zu reinigen.' },
    shortDescription: { de: 'Perfektes Brot & Kuchen ohne Anbacken' },
    specs: { material: 'Kohlenstoffstahl mit Antihast', dimensions: '30 × 11 × 8 cm', weight: '0,9 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-mp-230',
    slug: 'moerser-granit-18cm-premium',
    name: { de: 'Mörser & Stößel 18 cm Granit – 350 ml, Naturstein' },
    category: 'vorbereitung',
    price: 69,
    images: [IMG.kitchen4, IMG.kitchen5],
    rating: 4.8,
    reviewCount: 61,
    stock: 17,
    badges: ['new'],
    description: { de: 'Schwerer Mörser aus massivem Granit – unbehandelt und natürlich. 18 cm Innendurchmesser, 350 ml Fassungsvermögen. Ideal für Gewürze, Kräuter, Nüsse und Pasten. Durch das Eigengewicht von 3,8 kg immer sicher auf der Arbeitsfläche.' },
    shortDescription: { de: 'Natürlicher Granit für aromatische Gewürze' },
    specs: { material: 'Naturgranit', dimensions: '18 cm Ø innen, 12 cm Stößellänge', weight: '3,8 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-sc-310',
    slug: 'salz-pfeffer-muehlen-set',
    name: { de: 'Design Salz- & Pfeffermühlen Set – Edelstahl-Keramikmahlwerk' },
    category: 'tischaccessoires',
    price: 59,
    oldPrice: 79,
    images: [IMG.kitchen8, IMG.kitchen7],
    rating: 4.5,
    reviewCount: 93,
    stock: 29,
    badges: [],
    description: { de: 'Edles Salz- und Pfeffermühlenset mit stufenlos einstellbarem Keramikmahlwerk. Acrylglas-Korpus mit Edelstahlkappen. Einfaches Befüllen von oben. Mahlgrad von fein bis grob einstellbar. Batterien inklusive.' },
    shortDescription: { de: 'Aromatisch mahlen mit Keramikpräzision' },
    specs: { material: 'Acrylglas, Edelstahl, Keramik', dimensions: '6 cm Ø, 20 cm hoch', weight: '0,5 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-kd-420',
    slug: 'kuechenthermometer-digital',
    name: { de: 'Hitzeschutz-Küchenhandschuhe bis 500°C – 1 Paar' },
    category: 'zubehoer',
    price: 34,
    images: [IMG.kitchen7, IMG.kitchen1],
    rating: 4.6,
    reviewCount: 187,
    stock: 42,
    badges: ['bestseller'],
    description: { de: 'Professionelle Ofenhandschuhe aus Silikonaußenhülle und Aramid-Innengewebe. Wasserdicht, rutschfest, bis 500 °C geeignet. Lang geschnitten für Unterarmschutz. Maschinenwaschbar. Perfekt für Grill, Backofen und Induktionskochfeld.' },
    shortDescription: { de: 'Maximaler Schutz – auch bei Extremtemperaturen' },
    specs: { material: 'Silikon außen, Aramidfaser innen', dimensions: 'Länge 38 cm, universal', weight: '0,28 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-sp-155',
    slug: 'spaghetti-topf-mit-sieb-8l',
    name: { de: 'Spaghetti-Kochtopf 8 L mit integriertem Siebeinsatz – Edelstahl' },
    category: 'kochen',
    price: 89,
    oldPrice: 119,
    images: [IMG.kitchen2, IMG.kitchen1],
    rating: 4.7,
    reviewCount: 146,
    stock: 12,
    badges: ['bestseller'],
    description: { de: 'Großer 8-Liter Kochtopf aus 18/10 Edelstahl mit herausnehmbarem Siebeinsatz. Perfekt für Pasta, Gemüse und mehr. Maßangaben innen graviert, doppelwandiger Sandwichboden, induktionsgeeignet. Siebeinsatz spülmaschinenfest.' },
    shortDescription: { de: 'Pasta abgießen leicht gemacht – ohne Abtropfsieb' },
    specs: { material: '18/10 Edelstahl', dimensions: '24 cm Ø, 8 Liter', weight: '2,8 kg', dishwasher: true, induction: true }
  },
  {
    id: 'nova-ef-290',
    slug: 'elektrischer-eierschneider-avocadoschneider',
    name: { de: 'Multifunktions-Küchenschneider 3-in-1 – Ei, Avocado, Mango' },
    category: 'zubehoer',
    price: 29,
    images: [IMG.kitchen4, IMG.kitchen7],
    rating: 4.2,
    reviewCount: 245,
    stock: 54,
    badges: [],
    description: { de: 'Vielseitige 3-in-1 Küchenhelfer: schneidet Eier in Scheiben oder Achtel, halbiert Avocados und entkernt Mangos sicher. Kompakte Bauweise aus lebensmittelechtem Kunststoff. Spülmaschinenfest.' },
    shortDescription: { de: 'Küchenschneider für Eier, Avocados & Mangos' },
    specs: { material: 'Lebensmittelechter ABS-Kunststoff', dimensions: '24 × 7 × 4 cm', weight: '0,2 kg', dishwasher: true, induction: false }
  },
  {
    id: 'nova-ps-340',
    slug: 'pizza-set-4-teilig-edelstahl',
    name: { de: 'Profi-Pizza Set 4-teilig – Stein, Roller, Schneider, Schaufel' },
    category: 'kochen',
    price: 79,
    oldPrice: 99,
    images: [IMG.kitchen2, IMG.kitchen7],
    rating: 4.5,
    reviewCount: 79,
    stock: 22,
    badges: ['new'],
    description: { de: 'Komplettes Pizzazubehör-Set: Schamottstein 38×30 cm für knusprigen Boden, drehbarer Pizzaroller, runder Pizzaschneider und Holzschaufel. Pizzastein für Backofen und Gasgrill geeignet, bis 300 °C.' },
    shortDescription: { de: 'Italienische Pizzaperfektion im eigenen Zuhause' },
    specs: { material: 'Schamottstein, Edelstahl, Holz', dimensions: '38 × 30 cm Stein', weight: '4,5 kg', dishwasher: false, induction: false }
  },
  {
    id: 'nova-kr-510',
    slug: 'induktions-schnellkochtopf-6l',
    name: { de: 'Induktions-Schnellkochtopf 6 L – 3 Druckstufen, Sicherheitsventil' },
    category: 'kochen',
    price: 199,
    oldPrice: 269,
    images: [IMG.kitchen1, IMG.kitchen3],
    rating: 4.8,
    reviewCount: 163,
    stock: 8,
    badges: ['premium'],
    description: { de: 'Hochwertiger 6-Liter Induktions-Schnellkochtopf aus 18/10 Edelstahl. 3 Druckstufen: Porridge, mittel und hoch (bis 1,5 bar). Reduziert Kochzeit um bis zu 70%. Sicherheitssystem mit 5 Sicherheitsfunktionen. Inkl. Dampfgareinsatz.' },
    shortDescription: { de: 'Bis zu 70% schneller kochen – sicher und energiesparend' },
    specs: { material: '18/10 Edelstahl', dimensions: '24 cm Ø, 6 Liter', weight: '3,8 kg', dishwasher: true, induction: true }
  },
]

export const products: Product[] = [...baseProducts, ...(generateMassiveCatalog() as Product[])]

const baseCategories: Category[] = [
  {
    id: 'kochen',
    name: { de: 'Kochen & Braten' },
    image: '/images/category-pots.jpg',
    count: 12
  },
  {
    id: 'vorbereitung',
    name: { de: 'Vorbereitung' },
    image: '/images/category-boards.jpg',
    count: 9
  },
  {
    id: 'tischaccessoires',
    name: { de: 'Tisch & Servier' },
    image: '/images/category-pans.jpg',
    count: 8
  },
  {
    id: 'zubehoer',
    name: { de: 'Küchenzubehör' },
    image: '/images/category-accessories.jpg',
    count: 11
  }
]

export const categories: Category[] = [...baseCategories, ...extendedCategoriesList]

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'pfanne-kaufratgeber-induktion',
    title: { de: 'Die richtige Pfanne für Induktion: Der ultimative Kaufratgeber 2026' },
    excerpt: { de: 'Worauf Sie beim Kauf einer Induktionspfanne unbedingt achten sollten – Materialien, Bodenaufbau, Beschichtungen und Pflegehinweise im Überblick.' },
    image: '/images/hero-kitchen.jpg',
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
    image: '/images/technology.jpg',
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
    image: '/images/hero-kitchen.jpg',
    date: '5. März 2026',
    readTime: '5 Min. Lesezeit',
    category: 'Pflege & Tipps',
    author: 'NOVA INDUKT Redaktion'
  }
]
