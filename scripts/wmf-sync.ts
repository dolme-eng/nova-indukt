/**
 * Import de référence WMF.

 *   npx tsx scripts/wmf-sync.ts match     # rapproche nos 73 fiches
 *   npx tsx scripts/wmf-sync.ts import --apply
 *
 * wmf.com n'expose ni JSON-LD `gtin` ni Shopify : le EAN est dans un tableau
 * de caractéristiques, une ligne `data-th="EAN"`. Le CMMF (référence
 * fabricant) est sur la ligne précédente et sert d'ancre.
 *
 * Les pages produit s'atteignent par le lien
 * `/de/de/<libelle>-<cmmf>.html`. Le sitemap ne liste que des CATEGORIES :
 * il faut passer par une page de catégorie pour découvrir les produits.
 *
 * Ce script n'écrit RIEN en base hors `--apply`.
 */

import { config as loadEnv } from 'dotenv'
import fs from 'node:fs/promises'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const file of ['.env.local', '.env']) {
  loadEnv({ path: path.join(root, file) })
}

const prisma = new PrismaClient()

const CACHE = path.join(root, '.cache', 'wmf')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const DELAY_MS = 1500

/** Catégories de départ : les pages qui listent des produits. */
/**
 * Catégories de départ : les pages qui listent des produits.
 *
 * wmf.com ne publie dans son sitemap que des CATEGORIES, pas de fiches
 * produit. Chaque catégorie liste en revanche les produits qu'elle contient,
 * et c'est de là qu'on tire les URL `/de/de/<libelle>-<cmmf>.html`.
 */
/**
 * Catégories de départ : les pages qui listent des produits.
 *
 * wmf.com ne publie dans son sitemap que des CATEGORIES, pas de fiches
 * produit. Chaque catégorie liste en revanche les produits qu'elle contient,
 * et c'est de là qu'on tire les URL `/de/de/<libelle>-<cmmf>.html`.
 *
 * ⚠ Ces catégories doivent suivre les noms EXACTS du sitemap. inventer
 * « schnellekochtopfe » au lieu de « schnellkochtoepfe », ou viser
 * « kuechenhelfer » alors que la page réelle est «
 * kuechenhelfer/kuechenutensilien », renvoie une page d'erreur qui n'a aucun
 * lien produit : la découverte alors silencieusement ratée.
 */
const SEED_CATEGORIES = [
  'produkte',
  'produkte/toepfe',
  'produkte/toepfe/kochtoepfe',
  'produkte/toepfe/bratentoepfe',
  'produkte/toepfe/braeter-schmortoepfe',
  'produkte/toepfe/stielkasserollen',
  'produkte/toepfe/induktionstoepfe',
  'produkte/toepfe/schnellkochtoepfe',
  'produkte/toepfe/topfsets',
  'produkte/toepfe/milchtoepfe',
  'produkte/toepfe/suppen-gemuesetoepfe',
  'produkte/toepfe/zubehoer-toepfe',
  'produkte/toepfe/dampfgarer',
  'produkte/toepfe/fondues',
  'produkte/pfannen',
  'produkte/pfannen/bratpfannen',
  'produkte/pfannen/induktionspfannen',
  'produkte/pfannen/grillpfannen',
  'produkte/pfannen/schmorpfannen',
  'produkte/pfannen/servierpfannen',
  'produkte/pfannen/pfannendeckel',
  'produkte/pfannen/pfannen-sets',
  'produkte/pfannen/pfannen-mit-deckel',
  'produkte/pfannen/woks',
  'produkte/pfannen/zubehoer-fuer-pfannen',
  'produkte/backzubehoer',
  'produkte/kuechenhelfer',
  'produkte/kuechenhelfer/kuechenutensilien',
  'produkte/aufbewahrung',
]

async function get(url: string, cacheFile: string): Promise<string> {
  await fs.mkdir(CACHE, { recursive: true })
  const full = path.join(CACHE, cacheFile)
  try {
    return await fs.readFile(full, 'utf8')
  } catch {
    // pas en cache
  }
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`)
  const body = await res.text()
  await fs.writeFile(full, body, 'utf8')
  return body
}

type TheirProduct = {
  cmmf: string
  slug: string
  url: string
  name: string
  ean: string | null
  price: number | null
  image: string | null
  specs: Record<string, string>
}

/** Décode les entités HTML numériques des libellés de caractéristiques. */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&szlig;/g, 'ß')
    .replace(/&auml;/g, 'ä')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&Uuml;/g, 'Ü')
}

/** Tableau de caractéristiques : `data-th="EAN" >4000530717917`. */
function parseSpecs(html: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of html.matchAll(/data-th="([^"]+)"[^>]*>([^<]{1,120})</g)) {
    out[decodeEntities(m[1]).trim()] = decodeEntities(m[2]).trim()
  }
  return out
}

function parseProduct(html: string, url: string, cmmf: string, slug: string): TheirProduct {
  const specs = parseSpecs(html)

  const ldName = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,3000}?"name"\s*:\s*"([^"]+)"/)
  const h1 = html.match(/<h1[^>]*>([^<]{3,160})</)

  const priceMatch = html.match(/"@type"\s*:\s*"Offer"[\s\S]{0,900}?"price"\s*:\s*"?([\d.]+)/)
  const img = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,3000}?"image"\s*:\s*"([^"]+)"/)

  const ean = specs.EAN && /^\d{13}$/.test(specs.EAN) ? specs.EAN : null

  return {
    cmmf,
    slug,
    url,
    name: decodeEntities((ldName?.[1] ?? h1?.[1] ?? '').trim()),
    ean,
    price: priceMatch ? Number(priceMatch[1]) : null,
    image: img ? decodeEntities(img[1]).replace(/\\\//g, '/') : null,
    specs,
  }
}

function eanChecksumIsValid(ean: string): boolean {
  const digits = ean.split('').map(Number)
  const check = digits.pop()!
  let sum = 0
  digits.forEach((d, i) => (sum += i % 2 === 0 ? d : d * 3))
  return (10 - (sum % 10)) % 10 === check
}

// ── Découverte ────────────────────────────────────────────────────────────

/** Sitemap officiel : la liste exhaustive des catégories. */
const SITEMAP = 'https://www.wmf.com/media/sitemap/sitemap_de.xml'

/** Récupère toutes les catégories du sitemap plutôt qu'une liste à la main. */
async function categoriesFromSitemap(): Promise<string[]> {
  const xml = await get(SITEMAP, '_sitemap_de.xml')
  return [
    ...new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((m) => m[1].replace('https://www.wmf.com/de/de/', '').replace(/\.html$/, ''))
        .filter((u) => u.startsWith('produkte'))
    ),
  ]
}

async function discoverFromCategories(): Promise<{ cmmf: string; slug: string }[]> {
  const found = new Map<string, string>()

  // Le sitemap fait foi : une liste de départ écrite à la main oubliait des
  // branches entières, et un nom de catégorie erroné renvoyait une page
  // d'erreur vide sans le signaler.
  const sitemapCats = await categoriesFromSitemap()
  const categories = [...new Set([...SEED_CATEGORIES, ...sitemapCats])].sort()
  console.log(
    `${categories.length} catégories (${SEED_CATEGORIES.length} seeds + ${sitemapCats.length} au sitemap)\n`
  )

  for (const cat of categories) {
    const html = await get(
      `https://www.wmf.com/de/de/${cat}.html`,
      `cat_${cat.replace(/\//g, '_')}.html`
    ).catch(() => null)
    if (!html) continue
    // Les liens produits sont en URL ABSOLUE sur wmf.com. Une ancre régulière
    // sur `/de/de/…` ne renvoyait rien : le premier fetch n'a découvert que
    // 125 produits au lieu de plusieurs centaines.
    for (const m of html.matchAll(
      /href="https:\/\/www\.wmf\.com\/de\/de\/([a-z0-9-]+?)(\d{7,10})\.html"/g
    )) {
      const slug = `${m[1]}${m[2]}`
      found.set(m[2], slug)
    }
    process.stdout.write(`\r  ${cat} → ${found.size} produits cumulés   `)
  }
  console.log('')
  return [...found].map(([cmmf, slug]) => ({ cmmf, slug }))
}

async function cmdFetch() {
  const list = await discoverFromCategories()
  console.log(`\n${list.length} produits découverts sur ${SEED_CATEGORIES.length} catégories.\n`)

  let done = 0
  let ok = 0
  for (const p of list) {
    try {
      const html = await get(`https://www.wmf.com/de/de/${p.slug}.html`, `${p.cmmf}.html`)
      const prod = parseProduct(html, `https://www.wmf.com/de/de/${p.slug}.html`, p.cmmf, p.slug)
      await fs.writeFile(path.join(CACHE, `${p.cmmf}.json`), JSON.stringify(prod, null, 2), 'utf8')
      if (prod.ean) ok++
    } catch {
      // ignoré, compté plus bas
    }
    process.stdout.write(`\r  ${++done}/${list.length}  avec EAN: ${ok}          `)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
  console.log(`\n\nTerminé. ${done} pages, ${ok} avec EAN.`)
}

async function loadCatalogue(): Promise<TheirProduct[]> {
  const files = await fs.readdir(CACHE).catch(() => [])
  const out: TheirProduct[] = []
  for (const f of files) {
    if (!f.endsWith('.json')) continue
    try {
      out.push(JSON.parse(await fs.readFile(path.join(CACHE, f), 'utf8')) as TheirProduct)
    } catch {
      // fichier illisible
    }
  }
  return out
}

// ── Rapprochement ─────────────────────────────────────────────────────────

const FILLER = new Set([
  'wmf',
  'der',
  'die',
  'das',
  'mit',
  'und',
  'von',
  'cm',
  'stueck',
  'tlg',
  'set',
  'fuer',
  'aus',
  'neu',
  'nbsp',
  'germania',
  'de',
  'devil',
])

const SERIES_WORDS = new Set([
  'devil',
  'profi',
  'plus',
  'function',
  'advanced',
  'fusiontec',
  'gourmet',
  'starlight',
  'perfect',
  'chef',
  'master',
  'premium',
  'basic',
  'intenso',
  'schwarzwald',
  'ideal',
  'gold',
  'profi',
  'reinigung',
  'pfannen',
])

const TYPE_WORDS = [
  'pfanne',
  'topf',
  'kochtopf',
  'schmorpfanne',
  'servierpfanne',
  'deckel',
  'topfset',
  'bratpfanne',
  'grillpfanne',
  'backform',
  'auflaufform',
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'gratinpfanne',
  'gusseisen',
  'kasserolle',
  'suppenkessel',
  'wok',
  'pfannen',
  'pfannendeckel',
]

const VESSEL_WORDS = [
  'pfanne',
  'topf',
  'schmorpfanne',
  'servierpfanne',
  'bratpfanne',
  'grillpfanne',
  'backform',
  'auflaufform',
  'gusseisen',
  'kasserolle',
  'suppenkessel',
  'wok',
]

const ACCESSORY_WORDS = [
  'deckel',
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'griff',
  'untersetzer',
]

function normalize(s: string): string[] {
  return [
    ...new Set(
      s
        .toLowerCase()
        .replace(/\d+/g, ' ')
        .replace(/[^a-z0-9äöüß\s]/g, ' ')
        .split(/\s+/)
        .filter((t) => t && !FILLER.has(t))
    ),
  ]
}

function sizesIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/(\d{1,2})\s*[x×]\s*(\d{1,2})\s*cm/gi)) out.push(m[1], m[2])
  for (const m of text.matchAll(/(\d{1,2})\s*[-–]?\s*cm/gi)) out.push(m[1])
  return [...new Set(out)]
}

function piecesIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/(\d)\s*[-\s]?(?:tlg|teilig|stueck|teilige)/gi)) out.push(m[1])
  for (const m of text.matchAll(/(?:tlg|teilig|teilige)[-\s]?(\d)/gi)) out.push(m[1])
  return [...new Set(out)]
}

function capacitiesIn(text: string): number[] {
  const out: number[] = []
  for (const m of text.matchAll(/(\d{1,2})[,.](\d)\s*(?:l\b|liter|litre)/gi)) {
    out.push(Number(`${m[1]}.${m[2]}`))
  }
  for (const m of text.matchAll(/(\d{1,2})\s*(?:l\b|liter|litre)/gi)) out.push(Number(m[1]))
  return [...new Set(out)]
}

/**
 * Dimension réelle d'une fiche WMF, lue dans ses caractéristiques.
 *
 * Le nom du produit ne suffit pas : « Fusiontec Mineral Schmorpfanne mit
 * Glasdeckel » ne dit pas 24 ou 28 cm, seul le tableau `Durchmesser` le
 * donne. Pire, un set annonce toutes ses tailles à la fois (« 20, 24 und
 * 28 cm ») : comparer ce nom à notre slug rejetait à tort, et sans cette
 * source on aurait pu fusionner deux tailles.
 */
function theirDiameter(p: TheirProduct): string[] {
  const out: string[] = []
  for (const [key, value] of Object.entries(p.specs)) {
    if (!/durchmesser|breite|länge/i.test(key)) continue
    // On ignore la mesure de la face de contact avec la plaque, exprimée en mm.
    if (/unterseite/i.test(key)) continue
    out.push(...sizesIn(value))
  }
  return [...new Set(out)]
}

/** Nombre de pièces fiable : le nom d'un set WMF liste ses tailles, pas son effectif. */
function theirPieces(p: TheirProduct): string[] {
  const direct = piecesIn(p.name)
  if (direct.length) return direct
  for (const [key, value] of Object.entries(p.specs)) {
    if (/anzahl|teile|stück|stueck/i.test(key)) {
      const m = value.match(/\d+/)
      if (m) return [m[0]]
    }
  }
  return []
}

/** Mot de type le plus long présent dans le texte. */
function typeOf(s: string): string | null {
  const t = s.toLowerCase()
  const hits = TYPE_WORDS.filter((w) => t.includes(w))
  return hits.length ? hits.sort((a, b) => b.length - a.length)[0] : null
}

function seriesOf(s: string): Set<string> {
  return new Set(normalize(s).filter((t) => SERIES_WORDS.has(t)))
}

type Verdict = { ok: boolean; note: string; score: number }

function judge(ourSlug: string, ourName: string, theirs: TheirProduct): Verdict {
  const label = `${theirs.slug.replace(/-\d{7,10}$/, '')} ${theirs.name}`
  // Le nom sert à lire la série, les caractéristiques à lire les dimensions.
  const theirSizes = theirDiameter(theirs).length ? theirDiameter(theirs) : sizesIn(theirs.name)

  const ourSizes = sizesIn(`${ourSlug} ${ourName}`)
  if (ourSizes.length && theirSizes.length) {
    if (!ourSizes.some((s) => theirSizes.includes(s))) {
      return {
        ok: false,
        note: `dimension ${theirSizes.join('/')} vs ${ourSizes.join('/')}`,
        score: 0,
      }
    }
    // Notre fiche cite une taille, la leur en cite plusieurs : c'est un set
    // multi-tailles, on accepte seulement si NOTRE taille en fait partie.
    if (theirSizes.length > 1 && ourSizes.length === 1) {
      // cas normal : ensemble de tailles, notre article en est un
    }
  } else if (ourSizes.length && !theirSizes.length) {
    return { ok: false, note: 'dimension inconnue chez eux', score: 0 }
  }

  const ourType = typeOf(ourSlug)
  const theirType = typeOf(label)
  if (ourType && theirType && ourType !== theirType) {
    return { ok: false, note: `type ${ourType} vs ${theirType}`, score: 0 }
  }
  if (ourType && !theirType) {
    return { ok: false, note: 'type non identifiable chez eux', score: 0 }
  }

  const ourPieces = piecesIn(`${ourSlug} ${ourName}`)
  const theirPcs = theirPieces(theirs)
  if (ourPieces.length && theirPcs.length && !ourPieces.some((p) => theirPcs.includes(p))) {
    return {
      ok: false,
      note: `set ${theirPcs.join('/')} pieces vs ${ourPieces.join('/')}`,
      score: 0,
    }
  }
  // Set chez nous, article simple chez eux.
  if (ourPieces.length && !theirPcs.length && !theirSizes.length) {
    return { ok: false, note: 'set chez nous, article simple sans taille', score: 0 }
  }

  // Accessoire chez nous, appareil chez eux : un couvercle n'est pas une poêle.
  // On regarde le TYPE, plus fiable que la présence d'un mot : « Schmorpfanne
  // mit Glasdeckel » contient « deckel » sans être un couvercle.
  if (
    ourType &&
    theirType &&
    ACCESSORY_WORDS.includes(ourType) !== ACCESSORY_WORDS.includes(theirType)
  ) {
    const [ours, theirs2] = ACCESSORY_WORDS.includes(ourType)
      ? ['accessoire', 'appareil']
      : ['appareil', 'accessoire']
    return { ok: false, note: `${ours} chez nous, ${theirs2} chez eux`, score: 0 }
  }

  const ourSeries = seriesOf(ourSlug)
  const theirSeries = seriesOf(label)
  if (ourSeries.size && theirSeries.size) {
    if (![...ourSeries].some((t) => theirSeries.has(t))) {
      return { ok: false, note: 'série différente', score: 0 }
    }
  }

  const ourTokens = normalize(ourSlug)
  const theirTokens = new Set(normalize(label))
  const coverage = ourTokens.filter((t) => theirTokens.has(t)).length / (ourTokens.length || 1)
  if (coverage < 0.7)
    return { ok: false, note: `série couverte ${(coverage * 100).toFixed(0)} %`, score: 0 }

  return { ok: true, note: `série couverte ${(coverage * 100).toFixed(0)} %`, score: coverage }
}

// ── Commandes ─────────────────────────────────────────────────────────────

type Ours = {
  slug: string
  nameDe: string
  ean: string | null
  price: unknown
  images: string[]
}

async function loadOurs(): Promise<Ours[]> {
  const rows = await prisma.product.findMany({
    where: { brand: 'WMF' },
    select: { slug: true, nameDe: true, ean: true, price: true, images: { select: { url: true } } },
    orderBy: { slug: 'asc' },
  })
  return rows.map((r) => ({ ...r, images: r.images.map((i) => i.url) }))
}

function scoreAll(ours: Ours, pool: TheirProduct[]) {
  const ourSlug = ours.slug.replace(/^wmf-/, '')
  return pool
    .map((t) => ({ t, v: judge(ourSlug, ours.nameDe, t) }))
    .sort((a, b) => b.v.score - a.v.score)
}

async function cmdMatch() {
  const [pool, ours] = await Promise.all([loadCatalogue(), loadOurs()])
  console.log(`\nWMF — ${pool.length} produits en cache, ${ours.length} fiches chez nous\n`)

  let accepted = 0
  let ambiguous = 0
  for (const o of ours) {
    const ranked = scoreAll(o, pool)
    const best = ranked.find((r) => r.v.ok)
    if (!best) continue
    const rival = ranked.find((r) => r.t !== best.t && r.v.ok && r.v.score >= best.v.score)
    if (rival) {
      ambiguous++
      console.log(`  [ambigu]    ${o.slug}`)
      console.log(`               ${best.t.cmmf}  ${best.t.name}`)
      console.log(`               ${rival.t.cmmf}  ${rival.t.name}`)
    } else {
      accepted++
      console.log(`  [accepte]   ${o.slug}`)
      console.log(`               → ${best.t.cmmf}  ${best.t.name}`)
      console.log(`                 EAN ${best.t.ean ?? '—'}  ${best.v.note}`)
    }
  }
  console.log(
    `\nAccepté ${accepted}   ambigu ${ambiguous}   sans correspondance ${ours.length - accepted - ambiguous}`
  )
}

async function cmdImport() {
  const apply = process.argv.includes('--apply')
  const [pool, ours] = await Promise.all([loadCatalogue(), loadOurs()])
  console.log(
    `\nImport WMF — ${pool.length} produits en cache, ${ours.length} fiches, mode ${apply ? 'ECRITURE' : 'lecture seule'}\n`
  )

  const taken = new Map<string, string>()
  let written = 0
  const unresolved: string[] = []

  console.log(
    'fiche                                       EAN          prix fab.  notre prix  image'
  )
  console.log('─'.repeat(92))

  for (const o of ours) {
    const ranked = scoreAll(o, pool)
    const best = ranked.find((r) => r.v.ok)
    if (!best) {
      unresolved.push(`${o.slug} — ${ranked[0]?.v.note ?? 'aucun candidat'}`)
      continue
    }
    const rival = ranked.find((r) => r.t !== best.t && r.v.ok && r.v.score >= best.v.score)
    if (rival) {
      unresolved.push(`${o.slug} — ambigu ${best.t.cmmf} / ${rival.t.cmmf}`)
      continue
    }
    const ean = best.t.ean
    if (!ean || !eanChecksumIsValid(ean)) {
      unresolved.push(`${o.slug} — EAN absent ou invalide sur ${best.t.cmmf}`)
      continue
    }
    const holder = taken.get(ean)
    if (holder && holder !== o.slug) {
      unresolved.push(`${o.slug} — EAN ${ean} déjà attribué à ${holder}`)
      continue
    }
    taken.set(ean, o.slug)

    const oursPrice = Number(o.price)
    console.log(
      `${o.slug.slice(0, 40).padEnd(40)} ${ean.padEnd(12)} ` +
        `${best.t.price !== null ? best.t.price.toFixed(2).padStart(8) : '       -'} ` +
        `${oursPrice.toFixed(2).padStart(9)}  ${best.t.cmmf} ${best.t.name.slice(0, 34)}`
    )

    if (!apply) {
      written++
      continue
    }

    let imageUrl: string | null = null
    if (best.t.image) {
      try {
        const { uploadImage } = await import('../lib/cloudinary')
        const res = await fetch(best.t.image, { headers: { 'User-Agent': UA } })
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer())
          if (buf.length > 2000) {
            const up = await uploadImage(buf, 'nova-indukt/products', {
              public_id: `${o.slug}-${Date.now()}`,
            })
            imageUrl = up.secure_url
          }
        }
      } catch {
        // le EAN et le prix comptent davantage que le visuel
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: o.slug }, data: { ean } })
      if (imageUrl) {
        await tx.productImage.deleteMany({ where: { product: { slug: o.slug } } })
        await tx.productImage.create({
          data: {
            product: { connect: { slug: o.slug } },
            url: imageUrl,
            alt: o.nameDe,
            sortOrder: 0,
            isMain: true,
          },
        })
      }
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: o.slug,
          action: 'IMPORT_WMF',
          oldValues: { ean: o.ean, images: o.images },
          newValues: { ean, prixFabricant: best.t.price, cmmf: best.t.cmmf, source: best.t.url },
        },
      })
    })
    written++
  }

  console.log('─'.repeat(92))
  console.log(
    `\n${apply ? 'Écrit' : 'Vérifié'} : ${written}   sans correspondance : ${unresolved.length}`
  )
  if (unresolved.length) {
    console.log(`\nNon résolus (${unresolved.length}) :`)
    unresolved.slice(0, 25).forEach((u) => console.log(`  ${u}`))
    if (unresolved.length > 25) console.log(`  … et ${unresolved.length - 25} de plus`)
  }
}

async function main() {
  const cmd = process.argv[2] ?? 'match'
  if (cmd === 'fetch') return cmdFetch()
  if (cmd === 'match') return cmdMatch()
  if (cmd === 'import') return cmdImport()
  console.error(`Commande inconnue : ${cmd}. Attendu : fetch | match | import`)
  process.exitCode = 1
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
