/**
 * Chemins publics encodés + visuels génériques par catégorie (fichiers locaux + banques d’images libres de droits).
 */

export function localProductImg(...segments: string[]): string {
  return '/' + segments.map(encodeURIComponent).join('/')
}

const KB = 'Kochen & Braten'
const pizzaFolder = 'Profi-Pizza Set 4-teilig – Stein, Roller, Schneider, Schaufel'
const pizzaBase = 'Profi-Pizza Set 4-teilig – Stein, Roller, Schneider, Schaufel'
const panFolder = 'Induktions-Bratpfanne 28 cm – Keramikbeschichtung'
const panBase = 'Induktions-Bratpfanne 28 cm – Keramikbeschichtung'
const dampfFolder = 'Edelstahl-Dampfgarer 24 cm – 3 Einsätze'
const dampfBase = 'Edelstahl-Dampfgarer 24 cm – 3 Einsätze'
const topfFolder = 'Premium-Topfset-5-teilig'
const topfBase = 'premium-topfset'

export const novaLocalImages = {
  premiumTopfset5: [
    localProductImg('images', 'products', topfFolder, `${topfBase}1.jpg`),
    localProductImg('images', 'products', topfFolder, `${topfBase}2.jpg`),
  ],
  bratpfanne28: [
    localProductImg('images', 'products', KB, panFolder, `${panBase}1.png`),
    localProductImg('images', 'products', KB, panFolder, `${panBase}2.png`),
    localProductImg('images', 'products', KB, panFolder, `${panBase}3.png`),
  ],
  dampfgarer24: [
    localProductImg('images', 'products', KB, dampfFolder, `${dampfBase}.png`),
    localProductImg('images', 'products', KB, dampfFolder, `${dampfBase}.png`),
  ],
  pizzaSet4: [
    localProductImg('images', 'products', KB, pizzaFolder, `${pizzaBase}.png`),
    localProductImg('images', 'products', KB, pizzaFolder, `${pizzaBase}1.png`),
    localProductImg('images', 'products', KB, pizzaFolder, `${pizzaBase}2.png`),
    localProductImg('images', 'products', KB, pizzaFolder, `${pizzaBase}3.png`),
    localProductImg('images', 'products', KB, pizzaFolder, `${pizzaBase}4.png`),
  ],
} as const

const u = (id: string) => `https://images.unsplash.com/${id}?fm=jpg&q=80&w=900`

/** IDs vérifiés (réponses HTTP OK) — cuisines, aliments, ustensiles, café, etc. */
const STOCK_POOL = [
  'photo-1556910103-1c02745aae4d',
  'photo-1586201375761-83865001e31c',
  'photo-1504674900247-0877df9cc836',
  'photo-1512058564366-18510be2db19',
  'photo-1466978913421-dad2ebd01d17',
  'photo-1581578731548-c64695cc6952',
  'photo-1559339352-11d035aa65de',
  'photo-1600891964092-4316c288032e',
  'photo-1570197788417-0e82375c9371',
  'photo-1556911220-bff31c812dba',
  'photo-1540189549336-e6e99c3679fe',
  'photo-1510812431401-41d2bd2722f3',
  'photo-1544025162-d76694265947',
  'photo-1621303837174-89787a7d4729',
  'photo-1495474472287-4d71bcdd2085',
  'photo-1442512595331-e89e73853f31',
  'photo-1551218808-94e220e084d2',
] as const

function categoryOffset(categoryId: string): number {
  let h = 0
  for (let i = 0; i < categoryId.length; i++) h = (h + categoryId.charCodeAt(i) * (i + 1)) % STOCK_POOL.length
  return h
}

// Les 13 catégories harmonisées basées sur les images existantes
export const categorySlugs = [
  'kochen-braten',
  'vorbereitung',
  'kuechenzubehoer',
  'tisch-servier',
  'spezial',
  'sets',
  'herde',
  'kuehlschraenke',
  'geschirrspueler',
  'kuechenmaschinen',
  'waschmaschinen',
  'trockner',
  'staubsauger',
] as const

export type CategorySlug = typeof categorySlugs[number]

export const stockImagesByCategory: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {}
  for (const k of categorySlugs) {
    const off = categoryOffset(k)
    out[k] = [0, 1, 2, 3].map((j) => u(STOCK_POOL[(off + j) % STOCK_POOL.length]))
  }
  return out
})()

export function stockImagePair(categoryId: string, seed: number): [string, string] {
  const pool = stockImagesByCategory[categoryId] ?? stockImagesByCategory.kochen
  const i = Math.abs(seed) % pool.length
  const j = (i + 1 + (Math.abs(seed) % (pool.length - 1 || 1))) % pool.length
  return [pool[i], pool[j]]
}
