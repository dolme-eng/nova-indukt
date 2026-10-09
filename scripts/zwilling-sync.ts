/**
 * Import de référence Zwilling.
 *
 *   npx tsx scripts/zwilling-sync.ts fetch     # télécharge les pages produit
 *   npx tsx scripts/zwilling-sync.ts match     # rapproche nos 44 fiches
 *   npx tsx scripts/zwilling-sync.ts import --apply
 *
 * zwilling.com est une boutique Salesforce Commerce Cloud. Son sitemap
 * `sitemap_0-product.xml` liste les 1 984 fiches avec leur URL, ce qui évite
 * tout parcours de catégories. Le JSON-LD est le plus simple des trois
 * sources rencontrées : `gtin`, `sku` et `mpn` y sont explicites, et le
 * `sku` est le numéro d'article fabricant (1010283), pas un identifiant
 * interne.
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

const CACHE = path.join(root, '.cache', 'zwilling')
const SITEMAP = 'https://www.zwilling.com/de/sitemap_0-product.xml'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const DELAY_MS = 1200

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
  articleNr: string
  slug: string
  url: string
  name: string
  ean: string | null
  price: number | null
  image: string | null
}

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

function parseProduct(html: string, url: string, articleNr: string): TheirProduct {
  const name = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,2000}?"name"\s*:\s*"([^"]+)"/)?.[1] ?? ''
  const gtin = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,2000}?"gtin"\s*:\s*"?(\d{13})/)?.[1]
  const sku = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,2000}?"sku"\s*:\s*"([^"]+)"/)?.[1] ?? ''
  const price = html.match(/"@type"\s*:\s*"Offer"[\s\S]{0,900}?"price"\s*:\s*"?([\d.]+)/)?.[1]
  const image = html.match(
    /"@type"\s*:\s*"Product"[\s\S]{0,3000}?"image"\s*:\s*\[\s*"([^"]+)"/
  )?.[1]

  // Deux formats d'URL : `/…/1023533.html` et `/…/40850-164-0.html`. Le nom
  // de dossier du second est le libellé commercial, mais la comparaison
  // multipart terminait sur `\/\d+\.html`, qui ne matchait pas « -0.html » :
  // le slug conservait le numéro d'article et toute correspondance échouait.
  const cleaned = decodeEntities(url)
    .replace(/^https?:\/\/[^/]+\/de\//, '')
    .replace(/\/[^/]+\.html$/, '')

  return {
    articleNr: sku || articleNr,
    slug: decodeURIComponent(cleaned),
    url,
    name: decodeEntities(name).trim(),
    ean: gtin ?? null,
    price: price ? Number(price) : null,
    image: image ? decodeEntities(image).replace(/\\\//g, '/') : null,
  }
}

function eanChecksumIsValid(ean: string): boolean {
  const digits = ean.split('').map(Number)
  const check = digits.pop()!
  let sum = 0
  digits.forEach((d, i) => (sum += i % 2 === 0 ? d : d * 3))
  return (10 - (sum % 10)) % 10 === check
}

async function discoverProducts(): Promise<{ url: string; id: string }[]> {
  const xml = await get(SITEMAP, '_sitemap_product.xml')
  const list = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  console.log(`${list.length} fiches produits au sitemap Zwilling.\n`)
  // Deux formats d'URL coexistent : `/…/1023533.html` pour les articles
  // récents, `/…/02125-801-0.html` pour les articles à numéro à tirets. Le nom
  // de fichier doit être dérivé de l'URL, sinon les deux se marchent dessus
  // dans le cache.
  return list.map((url) => {
    const last = url.match(/\/([^/]+)\.html$/)?.[1] ?? url
    return { url, id: last }
  })
}

async function cmdFetch() {
  const list = await discoverProducts()
  console.log(`Téléchargement avec ${DELAY_MS} ms d'intervalle. Ctrl+C conserve le cache.\n`)
  let done = 0
  let withEan = 0
  for (const p of list) {
    try {
      const html = await get(p.url, `${p.id}.html`)
      const prod = parseProduct(html, p.url, p.id)
      await fs.writeFile(path.join(CACHE, `${p.id}.json`), JSON.stringify(prod, null, 2), 'utf8')
      if (prod.ean) withEan++
    } catch {
      // ignoré
    }
    process.stdout.write(`\r  ${++done}/${list.length}  avec EAN: ${withEan}          `)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
  console.log(`\n\nTerminé. ${done} pages, ${withEan} avec EAN.`)
}

async function loadCatalogue(): Promise<TheirProduct[]> {
  const files = await fs.readdir(CACHE).catch(() => [])
  const out: TheirProduct[] = []
  for (const f of files) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    try {
      out.push(JSON.parse(await fs.readFile(path.join(CACHE, f), 'utf8')) as TheirProduct)
    } catch {
      // illisible
    }
  }
  return out
}

// ── Rapprochement ─────────────────────────────────────────────────────────

const FILLER = new Set([
  'zwilling',
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
  'zw',
  'aluminium',
  'edelstahl',
  // Vocabulaire matière et finition : présent dans presque tous les slugs
  // Zwilling, donc porteur d'aucun signal de rapprochement.
  'silikon',
  'natur',
  'titan',
  'stahl',
  'antihaft',
  'beschichtet',
  'keramik',
  'unbeschichtet',
  'schwarz',
  'silber',
  'rot',
  'blau',
  'gruen',
  'polyamid',
  'gusseisen',
  'cmy',
  'kolben',
])

/**
 * Traductions entre la graphie du site et la nôtre.
 *
 * Le site écrit « Kochlöffel » quand notre fiche dit « kochloeffel », et
 * « 16 cm » avec une espace quand notre slug dit « 16cm ». Sans cela la
 * couverture de tokens tombait sous le seuil et des références existantes
 * étaient refusées.
 */
const TOKEN_ALIASES: Record<string, string> = {
  koch: 'koch',
  löffel: 'kochloeffel',
  loeffel: 'kochloeffel',
  schäumer: 'schaumkelle',
  schaumer: 'schaumkelle',
  schaumkelle: 'schaumkelle',
  vier: 'fourstar',
  sterne: 'fourstar',
  star: 'fourstar',
  now: 'nows',
  schneide: 'schneide',
  klinge: 'klinge',
}

function normalize(s: string): string[] {
  const cleaned = s
    .toLowerCase()
    .replace(/\d+/g, ' ')
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !FILLER.has(t))
  const out: string[] = []
  for (const t of cleaned) out.push(TOKEN_ALIASES[t] ?? t)
  return [...new Set(out)]
}

/**
 * Séries Zwilling / Ballarini, telles qu'elles s'écrivent sur le site.
 *
 * L'ancien jeu de mots ne contenait ni « fourstar » ni « nows » : nos
 * fiches « zwilling-four-star-chefmesser » se retrouvaient avec 0 % de
 * couverture de série et étaient refusées alors que la référence existe.
 * On stemmed « four star » → « fourstar », « now s » → « nows ».
 */
const SERIES_WORDS = new Set([
  'profi',
  'plus',
  'original',
  'basic',
  'prime',
  'comfort',
  'fortissimo',
  'select',
  'fine',
  'duo',
  'sign',
  'hyper',
  'fusiontec',
  'ballarini',
  'latina',
  'starlight',
  'allstar',
  'demeyere',
  'smith',
  'sabatier',
  'fourstar',
  'nows',
  'kunio',
  'magnetic',
  'flow',
  'core',
  'madura',
  'inox',
  'twin',
  'reinigung',
  'pro',
  'more',
  'pure',
  'terreno',
  'unlock',
  'simplify',
  'arno',
  'amasio',
  'microplane',
  'wood',
  'spectrum',
])

/** Normalise les graphies de série avant comparaison. */
function canonicalSeries(t: string): string {
  return t.replace(/^four/, 'fourstar').replace(/^now$/, 'nows')
}

/**
 * Types d'article. L'ordre ne compte pas : c'est le mot le LONG qui l'emporte,
 * sinon « kochtopf » se fait écraser par « topf » et « messerset » par
 * « besteck ».
 */
const TYPE_WORDS = [
  'pfannenschoner',
  'schneebesen',
  'multifunktionsschüssel',
  'auflaufform',
  'backform',
  'suppenkessel',
  'schmorpfanne',
  'servierpfanne',
  'kasserolle',
  'stielkasserolle',
  'bratpfanne',
  'grillpfanne',
  'kochtopf',
  'topfset',
  'topf',
  'pfanne',
  'deckel',
  'reiniger',
  'gusseisen',
  'wok',
  'schale',
  'messer',
  'besteck',
  'schneide',
  'schuss',
  'gießer',
  'fondue',
  'set',
]

const ACCESSORY_WORDS = ['deckel', 'pfannenschoner', 'schneebesen', 'reiniger', 'griff', 'schaber']

function sizesIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/(\d{1,2})\s*[x×]\s*(\d{1,2})\s*cm/gi)) out.push(m[1], m[2])
  for (const m of text.matchAll(/(\d{1,2})\s*[-–]?\s*cm/gi)) out.push(m[1])
  return [...new Set(out)]
}

function piecesIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/(\d)\s*[-\s]?(?:tlg|teilig|stueck)/gi)) out.push(m[1])
  for (const m of text.matchAll(/(?:tlg|teilig|stueck)[-\s]?(\d)/gi)) out.push(m[1])
  return [...new Set(out)]
}

function typeOf(s: string): string | null {
  const t = s.toLowerCase()
  const hits = TYPE_WORDS.filter((w) => t.includes(w))
  return hits.length ? hits.sort((a, b) => b.length - a.length)[0] : null
}

/**
 * Traduit les graphies allemandes du site vers celles de nos slugs.
 *
 * Le site dit « vier sterne » là où notre fiche dit « four star », et
 * « now s » là où nous écrivons « now-s ». Sans ces equivalences, la
 * couverture de serie tombait a 0 % sur des references qui existent
 * pourtant dans le catalogue du fabricant.
 */
const SERIES_ALIASES: Record<string, string> = {
  vier: 'fourstar',
  sterne: 'fourstar',
  now: 'nows',
  s: 'nows',
  profi: 'profi',
  koch: '',
  löffel: 'kochloeffel',
  loeffel: 'kochloeffel',
}

/** Tokens de série, après traduction dans notre graphie. */
function seriesOf(s: string): Set<string> {
  const out = new Set<string>()
  const raw = normalize(s)
  // « now-s » se tokenise en « now » puis « s » : on recombine les deux.
  const joined = raw.join(' ')
  const compact = joined.replace(/\bnow\b\s+\bs\b/g, 'nows')
  for (let t of compact.split(/\s+/)) {
    t = canonicalSeries(t)
    const alias = SERIES_ALIASES[t]
    if (alias === undefined) {
      if (SERIES_WORDS.has(t)) out.add(t)
    } else if (alias) {
      out.add(alias)
    }
  }
  return out
}

type Verdict = { ok: boolean; note: string; score: number }

function judge(ourSlug: string, ourName: string, theirs: TheirProduct): Verdict {
  const label = `${theirs.slug} ${theirs.name}`

  const ourSizes = sizesIn(`${ourSlug} ${ourName}`)
  const theirSizes = sizesIn(label)
  if (ourSizes.length && theirSizes.length) {
    if (!ourSizes.some((s) => theirSizes.includes(s))) {
      return {
        ok: false,
        note: `dimension ${theirSizes.join('/')} vs ${ourSizes.join('/')}`,
        score: 0,
      }
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
  const theirPieces = piecesIn(label)
  if (ourPieces.length && theirPieces.length && !ourPieces.some((p) => theirPieces.includes(p))) {
    return {
      ok: false,
      note: `set ${theirPieces.join('/')} pieces vs ${ourPieces.join('/')}`,
      score: 0,
    }
  }

  // Un accessoire n'est pas un appareil : « Schmorpfanne mit Glasdeckel »
  // mentionne un couvercle sans en être un.
  if (
    ourType &&
    theirType &&
    ACCESSORY_WORDS.includes(ourType) !== ACCESSORY_WORDS.includes(theirType)
  ) {
    const [a, b] = ACCESSORY_WORDS.includes(ourType)
      ? ['accessoire', 'appareil']
      : ['appareil', 'accessoire']
    return { ok: false, note: `${a} chez nous, ${b} chez eux`, score: 0 }
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

type Ours = { slug: string; nameDe: string; ean: string | null; price: unknown; images: string[] }

async function loadOurs(): Promise<Ours[]> {
  const rows = await prisma.product.findMany({
    where: { brand: 'Zwilling' },
    select: { slug: true, nameDe: true, ean: true, price: true, images: { select: { url: true } } },
    orderBy: { slug: 'asc' },
  })
  return rows.map((r) => ({ ...r, images: r.images.map((i) => i.url) }))
}

function scoreAll(ours: Ours, pool: TheirProduct[]) {
  const ourSlug = ours.slug.replace(/^zwilling-/, '')
  return pool
    .map((t) => ({ t, v: judge(ourSlug, ours.nameDe, t) }))
    .sort((a, b) => b.v.score - a.v.score)
}

async function cmdMatch() {
  const [pool, ours] = await Promise.all([loadCatalogue(), loadOurs()])
  console.log(`\nZwilling — ${pool.length} produits en cache, ${ours.length} fiches chez nous\n`)
  let accepted = 0
  let ambiguous = 0
  for (const o of ours) {
    const ranked = scoreAll(o, pool)
    const best = ranked.find((r) => r.v.ok)
    if (!best) continue
    const rival = ranked.find((r) => r.t !== best.t && r.v.ok && r.v.score >= best.v.score)
    if (rival) {
      ambiguous++
      console.log(
        `  [ambigu]    ${o.slug}\n               ${best.t.name}\n               ${rival.t.name}`
      )
    } else {
      accepted++
      console.log(
        `  [accepte]   ${o.slug}\n               → ${best.t.articleNr}  ${best.t.name}\n                 EAN ${best.t.ean ?? '—'}  ${best.v.note}`
      )
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
    `\nImport Zwilling — ${pool.length} produits en cache, ${ours.length} fiches, mode ${apply ? 'ECRITURE' : 'lecture seule'}\n`
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
      unresolved.push(`${o.slug} — ambigu ${best.t.articleNr} / ${rival.t.articleNr}`)
      continue
    }
    const ean = best.t.ean
    if (!ean || !eanChecksumIsValid(ean)) {
      unresolved.push(`${o.slug} — EAN absent ou invalide sur ${best.t.articleNr}`)
      continue
    }
    const holder = taken.get(ean)
    if (holder && holder !== o.slug) {
      unresolved.push(`${o.slug} — EAN ${ean} déjà attribué à ${holder}`)
      continue
    }
    taken.set(ean, o.slug)

    console.log(
      `${o.slug.slice(0, 40).padEnd(40)} ${ean.padEnd(12)} ` +
        `${best.t.price !== null ? best.t.price.toFixed(2).padStart(8) : '       -'} ` +
        `${Number(o.price).toFixed(2).padStart(9)}  ${best.t.articleNr} ${best.t.name.slice(0, 32)}`
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
        // le EAN compte davantage que le visuel
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
          action: 'IMPORT_ZWILLING',
          oldValues: { ean: o.ean, images: o.images },
          newValues: {
            ean,
            prixFabricant: best.t.price,
            articleNr: best.t.articleNr,
            source: best.t.url,
          },
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
