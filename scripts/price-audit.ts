/**
 * Audit de prix — comparaison au tarif fabricant.
 *
 *   npx tsx scripts/price-audit.ts                     # tous les produits
 *   npx tsx scripts/price-audit.ts --brand Fissler
 *   npx tsx scripts/price-audit.ts --above             # seulement au-dessus
 *
 * Le prix fabricant est un repère fort et surtout uneborne : si nous vendons
 * PLUS CHER que le fabricant, l'acheteur a un motif objectives de commander
 * chez lui. Aucun autre critère n'est nécessaire pour le constater. C'est ce
 * que ce script mesure.
 *
 * Pour « légèrement sous la concurrence », il faut ensuite le prix des
 * revendeurs, que ce script ne relève pas : il affiche le écart au
 * fabricant et signale les fiches à aller vérifier sur le marché.
 *
 * Le rapprochement不像 le rapprochement d'un import d'EAN : ici il ne
 * s'agit pas d'attribuer une identité à un produit, mais de situer un prix.
 * Un rapprochement incertain est donc affiché avec son score et son motif,
 * jamais écrit en base.
 */

import { config as loadEnv } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const file of ['.env.local', '.env']) {
  loadEnv({ path: path.join(root, file) })
}

const prisma = new PrismaClient()

const CACHE = path.join(root, '.cache')

type Variant = { ean: string | null; sku: string; title: string; price: number | null }

type TheirProduct = { slug: string; variants: Variant[] }

/** Charge les variantes d'une marque depuis le cache des imports. */
function loadTheirs(brand: string): TheirProduct[] {
  const dir = path.join(CACHE, brand.toLowerCase())
  if (!fs.existsSync(dir)) return []
  const out: TheirProduct[] = []
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    const variants = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Variant[]
    if (Array.isArray(variants) && variants.length) {
      out.push({ slug: f.replace('.json', ''), variants })
    }
  }
  return out
}

// ── Normalisation ─────────────────────────────────────────────────────────

/**
 * Mots sans valeur discriminante. « original », « profi » et « collection »
 * en font partie à FORT : ce sont les mots de SÉRIE chez Fissler
 * (Original-Profi Collection). Les retirer donnait un recouvrement de 100 %
 * entre n'importe quel kochtopf et `bonn-kochtopf`.
 */
const STOP = new Set([
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
  'fissler',
  'wmf',
  'zwilling',
  'tefal',
  'demeyere',
])

/**
 * Nos slugs abrègent, ceux du fabricant non : « opc-… » doit rejoindre
 * « original-profi-collection-… ». Sans ce dépliage, aucune fiche Original
 * Profi ne trouvait son prix.
 */
const ALIASES: Record<string, string[]> = {
  opc: ['original', 'profi', 'collection'],
  profi: ['profi'],
  plus: [],
}

function tokens(s: string): string[] {
  const out: string[] = []
  for (const t of s
    .toLowerCase()
    .replace(/\d+/g, ' ')
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)) {
    if (!t || STOP.has(t)) continue
    out.push(...(ALIASES[t] ?? [t]))
  }
  return [...new Set(out)]
}

function sizesIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/(\d{1,2})\s*[-–]?\s*(?:cm|l\b|liter)/gi)) out.push(m[1])
  return [...new Set(out)]
}

const TYPE_WORDS = [
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'adapterplatte',
  'daempfeinsatz',
  'kochtopf',
  'schmortopf',
  'bratentopf',
  'stielkasserolle',
  'sauteuse',
  'bratpfanne',
  'grillpfanne',
  'topfset',
  'kasserolle',
  'auflaufform',
  'deckel',
  'pfanne',
  'topf',
  'wok',
  'schale',
]

function typeOf(s: string): string | null {
  const t = s.toLowerCase()
  const hits = TYPE_WORDS.filter((w) => t.includes(w))
  return hits.length ? hits.sort((a, b) => b.length - a.length)[0] : null
}

type Match = { product: TheirProduct; variant: Variant; score: number; note: string }

/**
 * Trouve le prix fabricant le plus plausible pour une fiche.
 *
 * Contraintes dures : même type d'article, même dimension si les deux en
 * portent une. Le score mesure le recouvrement des mots, pas le nom — mais
 * le nom reste affiché, et un score faible est signalé plutôt que retenu.
 */
function findPrice(ourSlug: string, ourName: string, pool: TheirProduct[]): Match | null {
  const ourSizes = sizesIn(`${ourSlug} ${ourName}`)
  const ourType = typeOf(ourSlug)
  const ourTokens = tokens(ourSlug)

  let best: Match | null = null
  for (const p of pool) {
    const label = p.slug
    const theirSizes = [...new Set(p.variants.flatMap((v) => sizesIn(v.title)))]
    const theirType = typeOf(label)

    // Le type doit être connu ET identique des deux côtés. Sans cette règle,
    // une bouilloire 30 L se faisait comparer à une poignée de couvercle
    // (aucun mot de type côté fabricant) et remontait un écart de +85 %.
    if (!ourType || !theirType || ourType !== theirType) continue

    if (ourSizes.length && theirSizes.length && !ourSizes.some((s) => theirSizes.includes(s))) {
      continue
    }

    const variant =
      p.variants.find((v) => {
        const s = sizesIn(v.title)
        return ourSizes.length === 0 || s.some((x) => ourSizes.includes(x))
      }) ?? p.variants.find((v) => v.price !== null)
    if (!variant || variant.price === null) continue

    const labelTokens = new Set(tokens(label))
    const score = ourTokens.filter((t) => labelTokens.has(t)).length / (ourTokens.length || 1)
    // Un recouvrement faible signifie des homonymes, pas le même article.
    if (score < 0.6) continue
    if (!best || score > best.score) {
      best = { product: p, variant, score, note: `${ourType} ${ourSizes.join('/') || '—'}` }
    }
  }
  return best
}

async function main() {
  const brandArg = process.argv.indexOf('--brand')
  const onlyAbove = process.argv.includes('--above')
  const brand = brandArg > -1 ? process.argv[brandArg + 1] : 'Fissler'

  const pool = loadTheirs(brand)
  if (!pool.length) {
    console.error(
      `Aucun cache pour « ${brand} ». Lance d'abord scripts/${brand.toLowerCase()}-sync.ts fetch`
    )
    process.exitCode = 1
    return
  }

  const ours = await prisma.product.findMany({
    where: { brand },
    select: { slug: true, nameDe: true, price: true, oldPrice: true },
    orderBy: { slug: 'asc' },
  })

  console.log(`\nAudit de prix ${brand} — ${ours.length} fiches, ${pool.length} pages fabricant\n`)

  const rows: {
    slug: string
    name: string
    price: number
    fab: number | null
    score: number
    label: string
  }[] = []

  for (const o of ours) {
    const m = findPrice(o.slug, o.nameDe, pool)
    rows.push({
      slug: o.slug,
      name: o.nameDe,
      price: Number(o.price),
      fab: m ? m.variant.price : null,
      score: m ? m.score : 0,
      label: m ? m.product.slug : '—',
    })
  }

  const matched = rows.filter((r) => r.fab !== null)
  const above = matched.filter((r) => r.price > r.fab!)
  const equal = matched.filter((r) => Math.abs(r.price - r.fab!) < 0.01)
  const below = matched.filter((r) => r.price < r.fab!)

  console.log(`prix fabricant trouvé : ${matched.length}/${rows.length}`)
  console.log(
    `  au-dessus du fabricant : ${above.length}   à égalité : ${equal.length}   en dessous : ${below.length}\n`
  )

  if (above.length) {
    console.log('─── NOUS SOMMES PLUS CHERS QUE LE FABRICANT ───')
    for (const r of above.sort((a, b) => b.price - b.fab! - (a.price - a.fab!))) {
      const delta = r.price - r.fab!
      const pct = (delta / r.fab!) * 100
      console.log(`  ${r.slug}`)
      console.log(
        `      nous ${r.price.toFixed(2)}  fabricant ${r.fab!.toFixed(2)}   +${delta.toFixed(2)} € (+${pct.toFixed(0)} %)`
      )
      console.log(`      fabricant : ${r.label}  (score ${r.score.toFixed(2)})`)
    }
    console.log('')
  }

  if (!onlyAbove && below.length) {
    console.log('─── sous le tarif fabricant (à contrôler sur le marché) ───')
    for (const r of below.sort((a, b) => b.fab! - b.price - (a.fab! - b.price)).slice(0, 20)) {
      console.log(
        `  ${r.slug.slice(0, 46).padEnd(46)} nous ${r.price.toFixed(2).padStart(8)}  fab ${r.fab!.toFixed(2).padStart(8)}  −${(r.fab! - r.price).toFixed(2).padStart(7)} €`
      )
    }
    if (below.length > 20) console.log(`  … et ${below.length - 20} de plus`)
    console.log('')
  }

  const unmatched = rows.filter((r) => r.fab === null)
  if (unmatched.length) {
    console.log(`─── sans prix fabricant (${unmatched.length}) ───`)
    unmatched.forEach((r) => console.log(`  ${r.slug}`))
  }

  console.log('\nCe script ne modifie rien. Il indique où chercher le marché.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
