/**
 * Import de reference Fissler.
 *
 *   npx tsx scripts/fissler-sync.ts match   # 1 requete : rapproche nos fiches du sitemap
 *   npx tsx scripts/fissler-sync.ts fetch   # telecharge les pages des correspondances figees
 *   npx tsx scripts/fissler-sync.ts report  # EAN / prix fabricant / images par fiche
 *
 * fissler.com est un site Shopify dont les pages produit exposent un tableau
 * `variants` contenant, par variante : sku, titre, prix et une image dont le
 * NOM DE FICHIER COMMENCE PAR L'EAN. C'est ce qui rend l'import fiable :
 * l'image est rattachee a sa variante par le fabricant lui-meme, sans
 * reconnaissance visuelle.
 *
 * Ce script n'ecrit RIEN en base. Il produit un rapport et un fichier de
 * reference ; l'ecriture passe par prisma/fixups/.
 *
 * Source : https://fissler.com/sitemap_products_1.xml
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

const CACHE = path.join(root, '.cache', 'fissler')
const SITEMAP = 'https://fissler.com/sitemap_products_1.xml?from=15213007667549&to=16518478463325'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const DELAY_MS = 1500

async function get(url: string, cacheFile: string): Promise<string> {
  await fs.mkdir(CACHE, { recursive: true })
  const full = path.join(CACHE, cacheFile)
  try {
    return await fs.readFile(full, 'utf8')
  } catch {
    // pas en cache, on telecharge
  }
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`)
  const body = await res.text()
  await fs.writeFile(full, body, 'utf8')
  return body
}

type Theirs = { slug: string; url: string }

async function loadTheirProducts(): Promise<Theirs[]> {
  const xml = await get(SITEMAP, '_sitemap_products.xml')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/&amp;/g, '&'))
    .filter((u) => u.includes('/products/'))
    .map((u) => ({ slug: u.replace(/^https?:\/\/[^/]+\/products\//, ''), url: u }))
}

type Ours = {
  slug: string
  nameDe: string
  ean: string | null
  price: unknown
  oldPrice: unknown
  images: string[]
}

async function loadOurProducts(): Promise<Ours[]> {
  const rows = await prisma.product.findMany({
    where: { brand: 'Fissler' },
    select: {
      slug: true,
      nameDe: true,
      ean: true,
      price: true,
      oldPrice: true,
      images: { select: { url: true } },
    },
    orderBy: { slug: 'asc' },
  })
  return rows.map((r) => ({ ...r, images: r.images.map((i) => i.url) }))
}

// ── Rapprochement ─────────────────────────────────────────────────────────

/**
 * Dimensions en cm, tolérantes au format.
 *
 * Le sitemap Fissler écrit « 16-cm » avec un tiret, nos slugs « 18cm » sans.
 * La version d'origine ne reconnaissait que la seconde forme : elle renvoyait
 * une liste VIDE sur toutes leurs pages, ce qui désactivait en silence le
 * garde-fou dimension et laissait passer « 18 cm » sur une page 16 cm, et le
 * kochtopf 24 cm sur la variante « hoher » de 9,1 L.
 */
function sizesIn(text: string): string[] {
  const out: string[] = []
  // Forme NxM : « 28x28-cm », « 26×18 cm »
  for (const m of text.matchAll(/(\d{1,2})\s*[x×]\s*(\d{1,2})\s*[-–]?\s*(?:cm|zoll|inch)/gi)) {
    out.push(m[1], m[2])
  }
  // Forme simple, tiret optionnel : « 16-cm », « 16 cm », « 18cm »
  for (const m of text.matchAll(/(\d{1,2})\s*[-–]?\s*(?:cm|zoll|inch)/gi)) out.push(m[1])
  return [...new Set(out)]
}

/** Nombre de pièces d'un set : « 5-tlg », « 5 teilig », « topfset-5-tlg ». */
function piecesIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/(\d)\s*[-\s]?(?:tlg|teilig|stueck)/gi)) out.push(m[1])
  for (const m of text.matchAll(/(?:tlg|teilig)[-\s]?(\d)/gi)) out.push(m[1])
  return [...new Set(out)]
}

/**
 * Type d'article. Deux fiches ne peuvent être confondues que si ces mots
 * diffèrent : c'est ce qui séparait « opc-deckel-20cm » (un couvercle) de
 * « sauteuse-ohne-deckel-20-cm » (une sauteuse SANS couvercle), où le seul
 * token commun est « deckel ».
 */
/**
 * Mots de série : ce qui distingue deux gam��s d'un meme type. « Retro » est
 * une série Fissler distincte d'Original-Profi Collection, malgre une
 * appellation voisine. Sans ce controle, notre Topfset OPC se faisait
 * attribuer le set Retro.
 */
const SERIES_WORDS = new Set([
  'original',
  'profi',
  'collection',
  'retro',
  'adamant',
  'intensa',
  'cenit',
  'crispy',
  'steelux',
  'pure',
  'vitavit',
  'happchen',
  'family',
  'line',
  'viseo',
  'francisco',
  'munich',
  'hamburg',
  'kunming',
  'nanjing',
  'wuhan',
  'basic',
  'premium',
  'professional',
  'edition',
  'plus',
  // Fissler commercialise aussi des lignes sans « collection » dans le nom ;
  // sans elles, une référence isolée n'a aucune série à comparer.
  'stieltopf',
  'comfort',
  'spirit',
  'silver',
  'prime',
  'select',
  'chef',
])

/**
 * Série identifiée, ou null si le texte n'en nomme aucune.
 *
 * Un mot générique (« Zubehör », « Ersatzteil ») n'identifie pas une série :
 * sinon le comparatif de séries le faisait sniper des pages « Zubehör » au
 * hasard pour une référence isolée.
 */
function seriesTokens(s: string): Set<string> {
  const hits = tokens(s).filter((t) => SERIES_WORDS.has(t) && !FISSLER_GENERIC.has(t))
  return new Set(hits)
}

const TYPE_WORDS = [
  'deckel',
  'griff',
  'kochtopf',
  'schmortopf',
  'bratentopf',
  'stielkasserolle',
  'sauteuse',
  'bratpfanne',
  'grillpfanne',
  'pfanne',
  'topfset',
  'topf',
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'adapterplatte',
  'daempfeinsatz',
  'auflaufform',
  'crepe',
  'wok',
  'mixer',
  'fondue',
  'wasserkocher',
  'kessel',
  'wasserkocher',
  'sieb',
  'gießer',
  'giebetaube',
  'untersetzer',
  'platte',
]

/** Le mot de type présent, le plus long pour éviter « topf » contre « kochtopf ». */
function typeOf(s: string): string | null {
  const t = s.toLowerCase()
  const hits = TYPE_WORDS.filter((w) => t.includes(w))
  if (!hits.length) return null
  return hits.sort((a, b) => b.length - a.length)[0]
}

const FILLER = new Set([
  'fissler',
  'der',
  'die',
  'das',
  'mit',
  'und',
  'von',
  'the',
  'cm',
  'stueck',
  'tlg',
  'set',
  'fuer',
  'aus',
  'neu',
  'nbsp',
  'zubehor',
])

/**
 * Nos slugs sont abreges, les theirs sont complets : « opc-… » doit rejoindre
 * « original-profi-collection-… ». On deplie nos abreviations avant de comparer.
 *
 * 'original', 'profi' et 'collection' restent des tokens plein texte : les
 * retirer comme mots vides annulait l'expansion de l'alias 'opc' et faisait
 * tomber la couverture a 40 %.
 */
const ALIASES: Record<string, string[]> = {
  opc: ['original', 'profi', 'collection'],
  plus: [],
  premium: [],
  pro: [],
}

/**
 * Les chiffres sont retires avant tokenisation : d'un cote on a « 16cm », de
 * l'autre « 16 cm », qui ne se rejoignent jamais. Les dimensions sont
 * comparees a part, par sizesIn().
 */
function tokens(s: string): string[] {
  const raw = s
    .toLowerCase()
    .replace(/\d+/g, ' ')
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !FILLER.has(t))
  const out: string[] = []
  for (const t of raw) out.push(...(ALIASES[t] ?? [t]))
  return [...new Set(out)]
}

const LID_WORDS = ['glasdeckel', 'metalldeckel']

/** Accessoires vendus seuls, par opposition aux pièces d'un appareil. */
const TYPE_ACCESSORY = [
  'deckel',
  'griff',
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'adapterplatte',
  'daempfeinsatz',
  'untersetzer',
  'sieb',
  'gießer',
  'giebetaube',
]

/** Variante de couvercle, ou null si le texte n'en dit rien. */
function lidOf(s: string): string | null {
  const t = s.toLowerCase()
  for (const w of LID_WORDS) if (t.includes(w)) return w
  return null
}

type Candidate = {
  theirs: Theirs
  recall: number
  verdict: 'accepte' | 'incertain' | 'refuse'
  note: string
}

/**
 * Rapproche sur la COUVERTURE de nos tokens, jamais sur un chevauchement.
 *
 * Un score de Jaccard ramenait « vitavit-edition-30l » (une bouilloire) sur
 * « vitavit-edition-deckelgriff » (une poignee de couvercle) : deux mots
 * communs sur trois suffisaient. On exige l'inverse, nos mots doivent tous
 * se retrouver chez eux. Dimension et couvercle sont des contraintes dures.
 */
function scoreCandidate(oursSlug: string, theirs: Theirs): Candidate {
  const ourTokens = tokens(oursSlug.replace(/^fissler-/, ''))
  const theirTokens = new Set(tokens(theirs.slug))
  if (!ourTokens.length) {
    return { theirs, recall: 0, verdict: 'refuse', note: 'aucun token' }
  }

  const recall = ourTokens.filter((t) => theirTokens.has(t)).length / ourTokens.length

  const ourSizes = sizesIn(oursSlug)
  const theirSizes = sizesIn(theirs.slug)
  if (ourSizes.length && theirSizes.length && !ourSizes.some((s) => theirSizes.includes(s))) {
    return {
      theirs,
      recall,
      verdict: 'refuse',
      note: `dimension differente (nous ${ourSizes.join('/')} cm, eux ${theirSizes.join('/')} cm)`,
    }
  }
  // Un côté annonce une dimension, l'autre aucune : rapprochement fragile.
  if (Boolean(ourSizes.length) !== Boolean(theirSizes.length)) {
    return { theirs, recall, verdict: 'refuse', note: "dimension presente d'un seul cote" }
  }

  const ourPieces = piecesIn(oursSlug)
  const theirPieces = piecesIn(theirs.slug)
  if (ourPieces.length && theirPieces.length && !ourPieces.some((p) => theirPieces.includes(p))) {
    return {
      theirs,
      recall,
      verdict: 'refuse',
      note: `set de ${theirPieces.join('/')} pieces contre ${ourPieces.join('/')} chez nous`,
    }
  }

  // Le type d'article doit concorder.
  const ourType = typeOf(oursSlug)
  const theirType = typeOf(theirs.slug)
  if (ourType && theirType && ourType !== theirType) {
    return {
      theirs,
      recall,
      verdict: 'refuse',
      note: `type different (${ourType} vs ${theirType})`,
    }
  }
  // Notre fiche est un accessoire, la leur un appareil assemblé, ou l'inverse.
  const oursStandalone = Boolean(ourType) && TYPE_ACCESSORY.includes(ourType!)
  const theirsStandalone = Boolean(theirType) && TYPE_ACCESSORY.includes(theirType!)
  if (oursStandalone !== theirsStandalone) {
    return {
      theirs,
      recall,
      verdict: 'refuse',
      note: `accessoire contre appareil (${ourType ?? '?'} vs ${theirType ?? '?'})`,
    }
  }

  const ourLid = lidOf(oursSlug)
  const theirLid = lidOf(theirs.slug)
  if (ourLid && theirLid && ourLid !== theirLid) {
    return {
      theirs,
      recall,
      verdict: 'refuse',
      note: `couvercle different (${ourLid} vs ${theirLid})`,
    }
  }

  const pct = (recall * 100).toFixed(0)
  if (recall >= 0.85 && !(ourLid && !theirLid)) {
    return { theirs, recall, verdict: 'accepte', note: `couverture ${pct} %` }
  }
  if (recall >= 0.7) {
    return {
      theirs,
      recall,
      verdict: 'incertain',
      note: `couverture ${pct} %` + (ourLid && !theirLid ? ', couvercle non precise' : ''),
    }
  }
  return { theirs, recall, verdict: 'refuse', note: `couverture ${pct} % trop faible` }
}

type Match = { ours: Ours; candidates: Candidate[]; best: Candidate | null }

function matchOne(ours: Ours, pool: Theirs[]): Match {
  const candidates = pool
    .map((t) => scoreCandidate(ours.slug, t))
    .sort((a, b) => b.recall - a.recall)
    .slice(0, 3)
  return { ours, candidates, best: candidates.find((c) => c.verdict !== 'refuse') ?? null }
}

// ── Extraction des variantes ──────────────────────────────────────────────

/** EAN en tete du nom de fichier CDN : « 4009209379937-original-profi-…jpg ». */
function eanFromImage(url: string): string | null {
  const file = decodeURIComponent(url.split('/').pop()?.split('?')[0] ?? '')
  const m = file.match(/^(\d{13})-/)
  return m ? m[1] : null
}

function eanChecksumIsValid(ean: string): boolean {
  const digits = ean.split('').map(Number)
  const check = digits.pop()!
  let sum = 0
  digits.forEach((d, i) => (sum += i % 2 === 0 ? d : d * 3))
  return (10 - (sum % 10)) % 10 === check
}

type TheirVariant = {
  ean: string | null
  sku: string
  title: string
  price: number | null
  image: string | null
}

/**
 * Variantes lues dans le HTML de la page produit.
 *
 * L'EAN est déduit du NOM DE FICHIER de l'image. Cette méthode ne fonctionne
 * que pour les produits dont le fabricant nomme ses visuels par EAN.
 */
function parseVariants(html: string): TheirVariant[] {
  const at = html.indexOf('"variants":[')
  const parsed = at < 0 ? null : extractJsonArray(html, at, '"variants":')
  const variants = Array.isArray(parsed) ? normaliserVariants(parsed) : []
  // Format JSON absent ou vide : on tente le bloc de thème, seul format qui
  // porte les images par variante sur les pages récentes.
  if (variants.some((v) => v.image)) return variants
  return parseVariantsScript(html)
}

/**
 * Variantes dans un bloc `<script>` de thème Shopify.
 *
 * Le thème actuel n'expose plus `"variants":[` en JSON : il émet un objet
 * JavaScript littéral, `variants: [{...}]`, sans guillemets autour de la clé.
 * Chercher la forme avec guillemets renvoyait zéro variante, et donc zéro
 * image, pour toutes les pages du thème récent — dont Adamant Comfort, la
 * ligne la plus vendue du catalogue.
 */
function parseVariantsScript(html: string): TheirVariant[] {
  const at = html.indexOf('variants: [')
  if (at < 0) return []
  const parsed = extractJsonArray(html, at, 'variants: ')
  if (!Array.isArray(parsed)) return []
  return normaliserVariants(parsed)
}

/** Lit un tableau JSON à partir d'un décalage, par équilibre de crochets. */
function extractJsonArray(html: string, at: number, prefix: string): unknown {
  let depth = 0
  let start = -1
  let end = -1
  for (let i = at + prefix.length; i < html.length; i++) {
    const c = html[i]
    if (c === '[') {
      if (depth === 0) start = i
      depth++
    } else if (c === ']') {
      depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }
  if (start < 0 || end < 0) return null
  try {
    return JSON.parse(html.slice(start, end))
  } catch {
    return null
  }
}

/**
 * Le bloc de thème porte les vraies images par variante (`image.src`), là où
 * le format JSON historique ne les donnait qu'au niveau produit.
 */
function normaliserVariants(parsed: unknown[]): TheirVariant[] {
  return parsed.flatMap((v) => {
    const rec = v as Record<string, unknown>
    const image =
      (rec.image as { src?: string } | null)?.src ??
      (rec.images as { src?: string }[] | undefined)?.[0]?.src ??
      null
    const prix = (rec.price as { amount?: number } | undefined)?.amount
    return [
      {
        ean: image ? eanFromImage(image) : null,
        sku: String(rec.sku ?? ''),
        title: String(rec.title ?? ''),
        price: typeof prix === 'number' ? prix : null,
        image: image ? `https:${image.replace(/^https?:/, '')}` : null,
      },
    ]
  })
}

// ── Commandes ─────────────────────────────────────────────────────────────

async function cmdMatch() {
  const [theirs, ours] = await Promise.all([loadTheirProducts(), loadOurProducts()])
  console.log(`\nFissler : ${theirs.length} produits au sitemap, ${ours.length} fiches chez nous\n`)

  const matches = ours.map((o) => matchOne(o, theirs))
  const accepted = matches.filter((m) => m.best?.verdict === 'accepte')
  const uncertain = matches.filter((m) => m.best?.verdict === 'incertain')
  const none = matches.filter((m) => !m.best)

  for (const m of accepted) {
    console.log(`  [accepte]   ${m.ours.slug}`)
    console.log(`               -> ${m.best!.theirs.slug}   (${m.best!.note})`)
  }
  for (const m of uncertain) {
    console.log(`  [incertain] ${m.ours.slug}`)
    console.log(`               -> ${m.best!.theirs.slug}   (${m.best!.note})`)
    for (const c of m.candidates.filter((c) => c !== m.best).slice(0, 2)) {
      console.log(`                 autre: ${c.theirs.slug} (${c.note})`)
    }
  }

  console.log(
    `\nAccepte ${accepted.length}   incertain ${uncertain.length}   sans candidat ${none.length}`
  )
  if (none.length) {
    console.log('\nSans candidat (a traiter a la main) :')
    none.forEach((m) => console.log(`  - ${m.ours.slug}   (${m.ours.nameDe})`))
  }

  await fs.mkdir(CACHE, { recursive: true })
  await fs.writeFile(
    path.join(CACHE, '_matches.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        accepte: accepted.map((m) => ({
          ours: m.ours.slug,
          theirs: m.best!.theirs.slug,
          note: m.best!.note,
        })),
        incertain: uncertain.map((m) => ({
          ours: m.ours.slug,
          theirs: m.best!.theirs.slug,
          note: m.best!.note,
        })),
      },
      null,
      2
    ),
    'utf8'
  )

  console.log(
    '\nAucune ecriture en base. Relire ce rapprochement avant `fetch` :\n' +
      "un EAN errone est pire qu'un EAN absent."
  )
}

async function cmdFetch() {
  const all = process.argv.includes('--all')
  let unique: { theirs: string }[]

  if (all) {
    const theirs = await loadTheirProducts()
    unique = theirs.map((t) => ({ theirs: t.slug }))
    console.log(`\nTelechargement des ${unique.length} pages du catalogue Fissler…`)
  } else {
    const raw = await fs.readFile(path.join(CACHE, '_matches.json'), 'utf8').catch(() => {
      throw new Error("Aucun rapprochement. Lance d'abord `match`.")
    })
    const parsed = JSON.parse(raw) as {
      accepte: { theirs: string }[]
      incertain: { theirs: string }[]
    }
    const withIncertain = process.argv.includes('--with-uncertain')
    unique = [...parsed.accepte, ...(withIncertain ? parsed.incertain : [])]
    console.log(`\nTelechargement de ${unique.length} pages Fissler…`)
  }
  unique = [...new Map(unique.map((t) => [t.theirs, t])).values()]

  console.log(
    `Delai ${DELAY_MS} ms entre requetes. Ctrl+C pour interrompre, le cache est conserve.\n`
  )
  let done = 0
  let failed = 0
  for (const t of unique) {
    try {
      await get(`https://fissler.com/products/${t.theirs}`, `${t.theirs}.html`)
    } catch {
      failed++
    }
    process.stdout.write(
      `\r  ${++done}/${unique.length}  echecs:${failed}  ${t.theirs.slice(0, 46).padEnd(46)}`
    )
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
  console.log(`\n\nTermine. ${done} pages, ${failed} echecs.`)
}

async function cmdReport() {
  const [theirs, ours] = await Promise.all([loadTheirProducts(), loadOurProducts()])
  const matches = ours.map((o) => matchOne(o, theirs))

  let ok = 0
  let noEan = 0
  let invalid = 0
  const missing: string[] = []

  console.log(
    '\nFiche                                        variante       EAN            prix  img'
  )
  console.log('─'.repeat(96))

  for (const m of matches) {
    if (!m.best || m.best.verdict !== 'accepte') continue
    const slug = m.best.theirs.slug
    const html = await fs.readFile(path.join(CACHE, `${slug}.html`), 'utf8').catch(() => null)
    if (!html) {
      missing.push(slug)
      console.log(
        `${m.ours.slug.slice(0, 44).padEnd(44)} ${slug.slice(0, 14).padEnd(14)} (page non telechargee)`
      )
      continue
    }

    const variants = parseVariants(html)
    // Retenir la variante dont le EAN correspond a la dimension de notre slug.
    const wantSizes = sizesIn(m.ours.slug)
    const fit =
      variants.find((v) => {
        if (!v.ean) return false
        const m2 = v.image!.match(/(\d{2})\s*cm/i)
        return !wantSizes.length || (m2 ? wantSizes.includes(m2[1]) : false)
      }) ?? variants[0]

    if (!fit?.ean) {
      noEan++
      console.log(
        `${m.ours.slug.slice(0, 44).padEnd(44)} ${String(fit?.title ?? '-')
          .slice(0, 14)
          .padEnd(14)} —`
      )
      continue
    }
    const valid = eanChecksumIsValid(fit.ean)
    if (!valid) invalid++
    if (valid) ok++
    console.log(
      `${m.ours.slug.slice(0, 44).padEnd(44)} ${fit.title.slice(0, 14).padEnd(14)} ` +
        `${fit.ean} ${valid ? '  ' : ' !'} ` +
        `${fit.price !== null ? fit.price.toFixed(2).padStart(7) : '      -'} ` +
        `${fit.image ? 'oui' : 'non'}`
    )
  }

  console.log('─'.repeat(96))
  console.log(
    `\nEAN exploits : ${ok}  EAN illisible : ${noEan}   cle de controle KO : ${invalid}   pages manquantes : ${missing.length}`
  )
  if (missing.length) {
    console.log('Pages a telecharger :')
    missing.forEach((s) => console.log(`  ${s}`))
  }
}

/** Contenances en litres : « 6,3 l », « 1.8 Liter », « 5-tlg » exclu. */
function capacitiesIn(text: string): number[] {
  const out: number[] = []
  for (const m of text.matchAll(/(\d{1,2})[,.](\d)\s*[-–]?\s*(?:l\b|liter|litre)/gi)) {
    out.push(Number(`${m[1]}.${m[2]}`))
  }
  for (const m of text.matchAll(/(\d{1,2})\s*[-–]?\s*(?:l\b|liter|litre)/gi)) out.push(Number(m[1]))
  return [...new Set(out)]
}

/** Nom commercial complet du produit, lu dans le JSON-LD. */
function productName(html: string): string | null {
  const m = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,4000}?"name"\s*:\s*"([^"]+)"/)
  if (m) return m[1]
  const og = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)
  return og ? og[1] : null
}

/** Dimensions citées dans les titres de variantes : « 24 cm », « 28x28 cm ». */
function sizesInTitles(titles: string[]): string[] {
  return [...new Set(titles.flatMap((t) => sizesIn(t)))]
}

type TheirsFull = Theirs & { variants: TheirVariant[]; name: string | null; eans: string[] }

/**
 * Variantes lues dans `/products/<slug>.js`, l'API de la boutique Shopify.
 *
 * Cette source est bien meilleure que le HTML : elle expose un champ
 * `barcode` EXPLICITE par variante. Sur le HTML seul, la page « glasdeckel »
 * (24 lids, 8 variantes) ne donnait qu'un seul EAN, celui de la première
 * variante — les autres images sont nommées par SKU, pas par EAN. Les
 * accessoires, précisément la catégorie prioritaire, sont massivement dans ce
 * cas. Avec `.js`, on obtient l'EAN de chaque taille.
 */
async function parseVariantsJs(slug: string): Promise<TheirVariant[] | null> {
  const url = `https://fissler.com/products/${slug}.js`
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) return null
  const json = JSON.parse(await res.text()) as {
    variants?: {
      title?: string
      sku?: string
      barcode?: string
      price?: number
      featured_image?: { src?: string }
    }[]
  }
  if (!Array.isArray(json.variants)) return null
  return json.variants.map((v) => ({
    ean: v.barcode && /^\d{13}$/.test(v.barcode) ? v.barcode : null,
    sku: v.sku ?? '',
    title: v.title ?? '',
    price: typeof v.price === 'number' ? v.price / 100 : null,
    image: v.featured_image?.src
      ? v.featured_image.src.startsWith('//')
        ? `https:${v.featured_image.src}`
        : v.featured_image.src
      : null,
  }))
}

async function loadFullCatalogue(opts: { useJs: boolean }): Promise<TheirsFull[]> {
  const base = await loadTheirProducts()
  const out: TheirsFull[] = []
  for (const t of base) {
    const html = await fs.readFile(path.join(CACHE, `${t.slug}.html`), 'utf8').catch(() => null)
    if (!html) continue

    let variants = parseVariants(html)
    if (opts.useJs) {
      const fromJs = await parseVariantsJs(t.slug).catch(() => null)
      if (fromJs && fromJs.length) {
        variants = fromJs
        await fs.writeFile(
          path.join(CACHE, `${t.slug}.json`),
          JSON.stringify(fromJs, null, 2),
          'utf8'
        )
      }
    }

    out.push({
      ...t,
      variants,
      name: productName(html),
      eans: variants.map((v) => v.ean).filter((e): e is string => Boolean(e)),
    })
  }
  return out
}

/**
 * Rapprochement sur les donnees structurées plutot que sur les slugs.
 *
 * Maintenant que les 384 pages sont en cache, on dispose du nom commercial
 * (JSON-LD) et des titres de variantes, qui portent la dimension et la
 * contenance reelles. Le type d'article doit concorder ET la dimension doit
 * concorder : deux egalites dures, la ou avant on comparait des suites de
 * mots qui se recoupaient par hasard.
 */
type Strict = {
  theirs: TheirsFull
  verdict: 'accepte' | 'refuse'
  note: string
  variant: TheirVariant | null
}

function matchStrict(ours: Ours, pool: TheirsFull[]): Strict {
  const ourSlug = ours.slug.replace(/^fissler-/, '')
  const ourSizes = sizesIn(`${ours.slug} ${ours.nameDe}`)
  const ourType = typeOf(ourSlug)
  const ourTokens = tokens(ourSlug)
  const ourCaps = capacitiesIn(`${ours.slug} ${ours.nameDe}`)
  const ourLid = lidOf(`${ours.slug} ${ours.nameDe}`)

  const pick = (c: TheirsFull): TheirVariant | null => {
    // 1. variante de meme dimension
    const bySize = c.variants.find((v) => {
      const s = sizesIn(v.title)
      return v.ean && s.some((x) => ourSizes.includes(x))
    })
    if (bySize) return bySize
    // 2. variante de meme contenance — les deux kochtopf 24 cm (6,3 L et
    //    9,1 L) font le meme diametre, seule la contenance les separe.
    if (ourCaps.length) {
      const byCap = c.variants.find((v) => {
        const cap = capacitiesIn(v.title)
        return v.ean && cap.some((x) => ourCaps.includes(x))
      })
      if (byCap) return byCap
    }
    // 3. produit a variante unique, et une seule. Sans cette precision, deux
    //    fiches de tailles differentes (couvercles 24 et 28 cm) recevaient le
    //    meme EAN, celui de l'unique variante imagee.
    return c.variants.length === 1 && c.variants[0].ean ? c.variants[0] : null
  }

  // Un set se décrit par son nombre de pièces, pas par une dimension en cm :
  // « Topfset 5-tlg » n'a pas de « cm » dans son slug et partait donc sur la
  // branche « ni dimension ni slug fiable ». On compare les deux sources :
  // 5 pièces chez nous, 5 pièces chez eux.
  const ourPieces = piecesIn(`${ours.slug} ${ours.nameDe}`)

  // Fiches sans dimension en cm : sets, accessoires, bouilloires. On repasse par
  // le rapprochement de slug, qui a ses propres garde-fous.
  if (!ourSizes.length) {
    const byPieces = pool
      .map((c) => {
        const label = `${c.slug} ${c.name ?? ''}`
        const theirPieces = piecesIn(label)
        const ourType2 = typeOf(ourSlug)
        const theirType2 = typeOf(label)
        if (ourType2 && theirType2 && ourType2 !== theirType2) return null
        if (ourPieces.length && !theirPieces.some((p) => ourPieces.includes(p))) return null
        if (isDiscontinuedLine(label) !== isDiscontinuedLine(ourSlug)) return null
        const ourSeries2 = seriesTokens(ourSlug)
        const theirSeries2 = seriesTokens(label)
        if (ourSeries2.size && theirSeries2.size) {
          const shared = [...ourSeries2].filter((t) => theirSeries2.has(t))
          if (!shared.length) return null
        }
        const labelTokens = new Set(tokens(label))
        const coverage =
          ourTokens.filter((t) => labelTokens.has(t)).length / (ourTokens.length || 1)
        if (coverage < 0.7) return null
        return { c, coverage, theirPieces }
      })
      .filter((x): x is { c: TheirsFull; coverage: number; theirPieces: string[] } => x !== null)
      .sort((a, b) => b.coverage - a.coverage)

    const top = byPieces[0]
    const rival = byPieces.find((x) => x.c !== top?.c && x.coverage >= top.coverage)
    if (!top) {
      const alt = pool
        .map((c) => scoreCandidate(ours.slug, c))
        .filter((s) => s.verdict === 'accepte')
        .sort((a, b) => b.recall - a.recall)[0]
      if (!alt)
        return {
          theirs: pool[0],
          verdict: 'refuse',
          note: 'ni dimension ni slug fiable',
          variant: null,
        }
      const variant = pick(alt.theirs as TheirsFull)
      return {
        theirs: alt.theirs as TheirsFull,
        verdict: 'accepte',
        note: `slug ${alt.note}`,
        variant,
      }
    }
    if (rival) {
      return {
        theirs: top.c,
        verdict: 'refuse',
        note: `ambigu entre deux sets de ${ourPieces.join('/')} pièces`,
        variant: null,
      }
    }
    const variant = pick(top.c)
    return {
      theirs: top.c,
      verdict: 'accepte',
      note:
        `référence unique${ourPieces.length ? ` (${ourPieces.join('/')} pièces)` : ''}, ` +
        `série couverte ${(top.coverage * 100).toFixed(0)} %`,
      variant,
    }
  }

  /** Mots qui designent un appareil complet, par opposition a un accessoire. */
  const VESSEL_WORDS = [
    'pfanne',
    'topf',
    'kessel',
    'wok',
    'schmortopf',
    'sauteuse',
    'gießer',
    'kasserolle',
    'bratpfanne',
    'servierpfanne',
    'suppenkessel',
    'wasserkocher',
    'braeter',
    'grillpfanne',
    'backform',
    'auflaufform',
    'stieltopf',
  ]

  const scored = pool
    .map((c) => {
      const label = `${c.slug} ${c.name ?? ''}`
      const theirSizes = sizesInTitles([...c.variants.map((v) => v.title), c.slug])
      const theirType = typeOf(label)

      if (ourType && theirType && ourType !== theirType) {
        return { c, ok: false, note: `type ${ourType} vs ${theirType}`, score: 0 }
      }
      if (ourType && !theirType) {
        return { c, ok: false, note: 'type non identifiable chez eux', score: 0 }
      }
      if (!theirSizes.some((s) => ourSizes.includes(s))) {
        return {
          c,
          ok: false,
          note: `dimensions ${theirSizes.join('/')} vs ${ourSizes.join('/')}`,
          score: 0,
        }
      }

      // Notre fiche est un accessoire vendu seul ; la leur est un appareil avec
      // son couvercle integre. C'est ce qui faisait remonter le couvercle verre
      // 24 cm sur « Servierpfanne mit Hochraumdeckel ».
      if (ourType && TYPE_ACCESSORY.includes(ourType)) {
        const vessel = VESSEL_WORDS.find((w) => label.toLowerCase().includes(w))
        // « mit-hochraumdeckel », « mit-glasdeckel » : le couvercle fait partie
        // de l'appareil, il n'est pas vendu seul comme notre fiche.
        const integratedLid = /mit-[\w-]*deckel/.test(label.toLowerCase())
        if (vessel || integratedLid) {
          return {
            c,
            ok: false,
            note: `accessoire chez nous, appareil chez eux (${vessel ?? 'couvercle integre'})`,
            score: 0,
          }
        }
      }

      // Le type de couvercle doit concorder : un couvercle verre ne peut pas
      // se substituer a un couvercle metal.
      const theirLid = lidOf(label)
      if (ourLid && theirLid && ourLid !== theirLid) {
        return { c, ok: false, note: `couvercle ${ourLid} vs ${theirLid}`, score: 0 }
      }
      // Notre fiche cite un couvercle, la leur n'en mentionne pas : le type
      // est alors indéterminé et on ne tranche pas. Sans cette règle, un
      // couvercle verre 24 cm se faisait attribuer un Hochraumdeckel.
      if (ourLid && !theirLid) {
        return { c, ok: false, note: `couvercle ${ourLid} non précisé chez eux`, score: 0 }
      }

      // Notre fiche cite un couvercle, la leur n'en mentionne pas : on ne peut pas
      // trancher le type. Sans cette règle, le couvercle verre 24 cm se faisait
      // attribuer un Hochraumdeckel (metal) a 69,99 €.
      if (ourLid && !lidOf(label)) {
        return { c, ok: false, note: `couvercle ${ourLid} non precise chez eux`, score: 0 }
      }

      // Fissler a « Retro », une seconde ligne d'un même nom de série. Sans ce
      // contrôle, notre Topfset OPC se faisait attribuer le set Retro.
      const ourSeries = seriesTokens(ourSlug)
      const theirSeries = seriesTokens(label)
      if (ourSeries.size && theirSeries.size) {
        const shared = [...ourSeries].filter((t) => theirSeries.has(t))
        if (!shared.length) {
          return { c, ok: false, note: 'série différente', score: 0 }
        }
      }

      // « Retro » et « Shadowline » sont des lignes anciennes : on ne vend pas
      // sous la même référence ce que le fabricant a sorti du catalogue actif.
      if (isDiscontinuedLine(label) !== isDiscontinuedLine(ourSlug)) {
        return {
          c,
          ok: false,
          note: isDiscontinuedLine(label)
            ? 'ligne retirée du catalogue (Retro/Shadowline)'
            : 'ligne archivée',
          score: 0,
        }
      }

      const found =
        ourTokens.filter((t) => tokens(label).includes(t)).length / (ourTokens.length || 1)
      return {
        c,
        ok: found >= 0.7,
        note: `série couverte ${(found * 100).toFixed(0)} %`,
        score: found,
      }
    })
    .filter((x) => x.ok)
    .sort((a, b) => b.score - a.score)

  const best = scored[0]
  if (!best)
    return {
      theirs: pool[0],
      verdict: 'refuse',
      note: 'aucun candidat type+dimension',
      variant: null,
    }

  // Deux pages qui passent tous les garde-fous : le choix est arbitraire et
  // l'EAN peut être faux. Signalé plutôt que tranché d'office.
  const rival = scored.find((x) => x.c !== best.c && x.score >= best.score && pick(x.c)?.ean)
  if (rival) {
    return {
      theirs: best.c,
      verdict: 'refuse',
      note: `ambigu avec ${rival.c.slug} (${best.note} vs ${rival.note})`,
      variant: null,
    }
  }

  const variant = pick(best.c)
  return {
    theirs: best.c,
    verdict: 'accepte',
    note: `${best.note}, variante ${variant ? `"${variant.title}"` : 'introuvable'}`,
    variant,
  }
}

/** Mots-clés Fissler : un catalogue général n'est pas une série. */
const FISSLER_GENERIC = new Set([
  'zubehor',
  'ersatzteil',
  'zubehoer',
  'edelstahl',
  'antihaft',
  'reiniger',
  'pflanzlich',
  'bio',
])

/** Le nom commercial mentionne-t-il « Retro » ou « Shadowline » ? */
function isDiscontinuedLine(s: string): boolean {
  return /retro|shadowline/.test(s.toLowerCase())
}

async function cmdImport() {
  const apply = process.argv.includes('--apply')
  const only = process.argv.includes('--ean')
  const images = apply && !only

  const [catalogue, ours] = await Promise.all([
    loadFullCatalogue({ useJs: true }),
    loadOurProducts(),
  ])
  const eanCount = catalogue.reduce((n, c) => n + c.eans.length, 0)
  console.log(
    `\nImport Fissler — ${catalogue.length} pages, ${eanCount} EAN extraits, ${ours.length} fiches, mode ${apply ? 'ECRITURE' : 'lecture seule'}\n`
  )
  if (!apply) console.log('Ajoutez --apply pour ecrire. --ean pour跳过 les images.\n')

  let written = 0
  let skipped = 0
  let noMatch = 0
  const unresolved: string[] = []
  // Un EAN ne peut servir qu'une fiche : le champ est @unique en base, et deux
  // produits qui se le partagent signalent un rapprochement errone.
  const taken = new Map<string, string>()

  console.log(
    'fiche                                       EAN          prix fab.  notre prix  image'
  )
  console.log('─'.repeat(92))

  for (const o of ours) {
    const m = matchStrict(o, catalogue)
    if (m.verdict === 'refuse' || !m.variant?.ean) {
      noMatch++
      unresolved.push(`${o.slug} — ${m.note}`)
      continue
    }
    const ean = m.variant.ean
    const valid = eanChecksumIsValid(ean)
    const fab = m.variant.price
    const oursPrice = Number(o.price)
    const flag = valid ? '' : ' CLE-KO'
    const marge = fab !== null && oursPrice > fab ? '  ^au-dessus du fabricant' : ''

    const holder = taken.get(ean)
    if (holder && holder !== o.slug) {
      noMatch++
      unresolved.push(`${o.slug} — EAN ${ean} déjà attribué à ${holder}, refus`)
      continue
    }
    taken.set(ean, o.slug)

    console.log(
      `${o.slug.slice(0, 40).padEnd(40)} ${ean}${flag.padEnd(8)} ` +
        `${fab !== null ? fab.toFixed(2).padStart(8) : '       -'} ` +
        `${oursPrice.toFixed(2).padStart(9)}  ` +
        `${m.variant.title} / ${m.theirs.slug}${marge}`
    )
    console.log(`${' '.repeat(40)} ${m.note}`)

    if (!valid) continue

    if (!apply) {
      written++
      continue
    }

    const url = images && m.variant.image ? await importImage(o.slug, m.variant.image) : null

    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: o.slug }, data: { ean } })
      if (url) {
        await tx.productImage.deleteMany({ where: { product: { slug: o.slug } } })
        await tx.productImage.create({
          data: {
            product: { connect: { slug: o.slug } },
            url,
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
          action: 'IMPORT_FISSLER',
          oldValues: { ean: o.ean, images: o.images },
          newValues: {
            ean,
            prixFabricant: fab,
            image: url ?? 'inchangee',
            source: m.theirs.url,
          },
        },
      })
    })
    written++
  }

  console.log('─'.repeat(92))
  console.log(
    `\n${apply ? 'Ecrit' : 'Verifie'} : ${written}   sans correspondance : ${noMatch}   ecritures : ${written}`
  )
  if (apply) {
    console.log("Relis la table ci-dessus : un EAN errone est pire qu'un EAN absent.")
  }
  if (unresolved.length) {
    console.log(`\nNon resolus (${unresolved.length}) :`)
    unresolved.forEach((u) => console.log(`  ${u}`))
  }
}

/** Normalise une URL de CDN Shopify : parfois « //domaine/… », parfois complete. */
function absoluteImageUrl(url: string): string {
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return `https://fissler.com${url}`
  return url
}

/** Telecharge le visuel officiel et le pousse sur Cloudinary. */
async function importImage(slug: string, rawUrl: string): Promise<string | null> {
  const url = absoluteImageUrl(rawUrl)
  const withWidth = url.includes('?') ? `${url}&width=1200` : `${url}?width=1200`
  const res = await fetch(withWidth, { headers: { 'User-Agent': UA } })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 2000) return null

  const { uploadImage } = await import('../lib/cloudinary')
  const up = await uploadImage(buf, 'nova-indukt/products', { public_id: `${slug}-${Date.now()}` })
  return up.secure_url
}

async function main() {
  const cmd = process.argv[2] ?? 'match'
  if (cmd === 'match') return cmdMatch()
  if (cmd === 'fetch') return cmdFetch()
  if (cmd === 'report') return cmdReport()
  if (cmd === 'import') return cmdImport()
  console.error(`Commande inconnue : ${cmd}. Attendu : match | fetch | report | import`)
  process.exitCode = 1
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
