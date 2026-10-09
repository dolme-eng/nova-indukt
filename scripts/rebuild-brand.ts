/**
 * Reconstruction d'une marque depuis le catalogue fabricant.
 *
 *   npx tsx scripts/rebuild-brand.ts --brand WMF
 *   npx tsx scripts/rebuild-brand.ts --brand WMF --apply
 *
 * Principe
 * --------
 * Rebuild fiche par fiche en partant de nos noms est voué à l'échec : nos
 * libellés portent des noms de série fantômes (WMF « Monde », « Perfect Plus »,
 * Fissler « vitavit edition »), et aucun rapprochement par le texte ne
 * survit à ça.
 *
 * On inverse donc la confiance. Ce qui est fiable chez un fabricant, c'est le
 * TYPE d'article et la TAILLE ; le nom de série ne l'est pas. Une fiche qui
 * s'accorde en type et en taille avec un article du catalogue, mais porte un
 * nom de série différent, n'est presque jamais un autre produit : c'est un
 * libellé erroné de notre côté.
 *
 * Chaque proposition porte donc un verdict explicite, et rien n'est écrit
 * sans `--apply` :
 *
 *   CONFIRMÉ   type + taille + série concordent, et le EAN est valide
 *   SÉRIE      type + taille concordent, série différente → renommer
 *   AMBIGU     plusieurs candidats type + taille → décision humaine
 *   ABSENT     aucun type + taille dans le catalogue → hors catalogue
 *
 * Une fois l'EAN attribué, le reste du travail est mécanique : le nom
 * commercial, les dimensions et le visuel viennent de la page fabricant.
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

const arg = (n: string, d: string) => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}

const BRAND = arg('--brand', 'Fissler')
const APPLY = process.argv.includes('--apply')

type Theirs = {
  articleNr: string
  slug: string
  url: string
  name: string
  ean: string | null
  price: number | null
  image: string | null
  specs: Record<string, string>
}

// ── Vocabulaire ───────────────────────────────────────────────────────────

/** Type d'article : le mot le plus long l'emporte (kochtopf avant topf). */
const TYPE_WORDS = [
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'adapterplatte',
  'daempfeinsatz',
  'multifunktionsschale',
  'auflaufform',
  'backform',
  'kastenform',
  'tarteform',
  'schmortopf',
  'bratentopf',
  'stielkasserolle',
  'stieltopf',
  'sauteuse',
  'kochtopf',
  'grillpfanne',
  'bratpfanne',
  'topfset',
  'pfannenset',
  'kasserolle',
  'deckel',
  'pfanne',
  'topf',
  'wok',
  'schale',
  'fondue',
  'topfregal',
  'wasserkocher',
  'handmixer',
  'stabmixer',
  'mixer',
  'kaffeemaschine',
  'schneidebrett',
  'besteckset',
  'essbesteck',
  'messerset',
  'besteckset',
  'garnier',
  'teller',
  'schale',
  'schuss',
  'kellner',
  'gießer',
  'loeffel',
]

/** Accessoires vendus seuls, à distinguer d'un appareil complet. */
const ACCESSORY_WORDS = [
  'deckel',
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'griff',
  'untersetzer',
]

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
  'germania',
  'profi',
  'plus',
  'edition',
  'classic',
])

/** Les abréviations de nos slugs dépliées vers la graphie du fabricant. */
const ALIASES: Record<string, string[]> = {
  opc: ['original', 'profi', 'collection'],
}

function tokenize(s: string): string[] {
  const out: string[] = []
  for (const t of s
    .toLowerCase()
    .replace(/\d+/g, ' ')
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)) {
    if (!t || STOP.has(t) || t === BRAND.toLowerCase()) continue
    out.push(...(ALIASES[t] ?? [t]))
  }
  return [...new Set(out)]
}

function typeOf(s: string): string | null {
  const t = s.toLowerCase()
  const hits = TYPE_WORDS.filter((w) => t.includes(w))
  return hits.length ? hits.sort((a, b) => b.length - a.length)[0] : null
}

/** Contenance en litres, y compris « 1,8 l », « 3 L ». */
function capacitiesIn(s: string): number[] {
  const out: number[] = []
  for (const m of s.matchAll(/(\d{1,2})[,.](\d)\s*[-–]?\s*(?:l\b|liter|litre)/gi)) {
    out.push(Number(`${m[1]}.${m[2]}`))
  }
  for (const m of s.matchAll(/(?:^|[^\d,])(\d{1,2})\s*[-–]?\s*(?:l\b|liter|litre)/gi)) {
    out.push(Number(m[1]))
  }
  return [...new Set(out)]
}

function eanOk(ean: string): boolean {
  if (!/^\d{13}$/.test(ean)) return false
  const d = ean.split('').map(Number)
  const check = d.pop()!
  let sum = 0
  d.forEach((x, i) => (sum += i % 2 === 0 ? x : x * 3))
  return (10 - (sum % 10)) % 10 === check
}

function loadTheirs(): Theirs[] {
  const dir = path.join(root, '.cache', BRAND.toLowerCase())
  if (!fs.existsSync(dir))
    throw new Error(
      `Cache absent pour ${BRAND} — lance d'abord le script de fetch de cette marque.`
    )
  const out: Theirs[] = []
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    try {
      out.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Theirs)
    } catch {
      // fichier illisible
    }
  }
  return out
}

type Verdict = 'CONFIRME' | 'SERIE' | 'AMBIGU' | 'ABSENT'

type Ligne = {
  slug: string
  nomActuel: string
  prixActuel: number
  eanActuel: string | null
  verdict: Verdict
  candidat: Theirs | null
  alternatives: Theirs[]
  raison: string
}

function rebuild(our: Ours, pool: Theirs[]): Ligne {
  const base = {
    slug: our.slug,
    nomActuel: our.nameDe,
    prixActuel: Number(our.price),
    eanActuel: our.ean,
  }

  const ourText = `${our.slug} ${our.nameDe}`
  const ourType = typeOf(ourText)
  const ourCaps = capacitiesIn(ourText)
  const ourSizes = [...ourText.matchAll(/(\d{2})\s*cm/g)].map((m) => m[1])
  const ourTokens = new Set(tokenize(our.slug))

  const pool2 = pool.map((t) => {
    const label = `${t.slug} ${t.name}`
    const theirCaps = capacitiesIn(label)
    const theirSizes = [...label.matchAll(/(\d{2})\s*cm/g)].map((m) => m[1])
    const theirTokens = new Set(tokenize(t.slug))
    const theirType = typeOf(label)

    const typeOk = Boolean(ourType) && Boolean(theirType) && ourType === theirType
    const capOk = !ourCaps.length || !theirCaps.length || ourCaps.some((c) => theirCaps.includes(c))
    const sizeOk =
      !ourSizes.length || !theirSizes.length || ourSizes.some((s) => theirSizes.includes(s))
    const serieShared = [...ourTokens].filter((t2) => theirTokens.has(t2))
    return { t, typeOk, capOk, sizeOk, serieShared, theirType }
  })

  // Type + contenance : le critère fiable. La série ne sert qu'à départager.
  const forts = pool2.filter((c) => c.typeOk && c.capOk && c.sizeOk)

  if (!forts.length) {
    const parType = pool2.filter((c) => c.typeOk)
    return {
      ...base,
      verdict: 'ABSENT',
      candidat: null,
      alternatives: [],
      raison: ourType
        ? parType.length
          ? `type « ${ourType} » présent mais aucune taille en commun`
          : `type « ${ourType} » absent du catalogue`
        : 'type non déterminable',
    }
  }

  // Même série que le nôtre, à taille près : confirmation.
  const avecSerie = forts.filter((c) => c.serieShared.length)
  if (avecSerie.length === 1) {
    const c = avecSerie[0]
    return {
      ...base,
      verdict: c.t.ean && eanOk(c.t.ean) ? 'CONFIRME' : 'SERIE',
      candidat: c.t,
      alternatives: [],
      raison: `type + taille + série (${c.serieShared.join(' ')})`,
    }
  }

  // Plusieurs candidats de même type et taille : seule la série départage, et
  // c'est justement la donnée fiable de notre fiche qu'on ne peut pas croire.
  if (avecSerie.length > 1) {
    return {
      ...base,
      verdict: 'AMBIGU',
      candidat: avecSerie[0].t,
      alternatives: avecSerie.slice(1, 4).map((c) => c.t),
      raison: `${avecSerie.length} articles de même type et même taille : ${avecSerie
        .map((c) => c.t.slug)
        .slice(0, 3)
        .join(', ')}`,
    }
  }

  // Aucun candidat ne porte notre série : c'est là que se logent les noms de
  // série fantômes. On retient le moins cher comme piste, sans trancher.
  const premier = forts[0].t
  return {
    ...base,
    verdict: 'SERIE',
    candidat: premier,
    alternatives: [],
    raison: `type ${ourType} + taille identiques, mais aucune série en commun — libellé probablement erroné (piste : ${premier.slug})`,
  }
}

type Ours = { slug: string; nameDe: string; price: unknown; ean: string | null }

async function main() {
  const pool = loadTheirs()
  const ours = await prisma.product.findMany({
    where: { brand: BRAND, isActive: true },
    select: { slug: true, nameDe: true, price: true, ean: true },
    orderBy: { slug: 'asc' },
  })

  console.log(
    `\nReconstruction ${BRAND} — ${pool.length} articles fabricant, ${ours.length} fiches actives\n`
  )

  const lignes = ours.map((o) => rebuild(o, pool))
  const par = (v: Verdict) => lignes.filter((l) => l.verdict === v)

  for (const v of ['CONFIRME', 'SERIE', 'AMBIGU', 'ABSENT'] as Verdict[]) {
    const l = par(v)
    const part = l.length ? ((l.length / lignes.length) * 100).toFixed(0) : '0'
    console.log(`  ${v.padEnd(9)} ${String(l.length).padStart(3)}  (${part} %)`)
  }
  console.log('')

  for (const v of ['CONFIRME', 'SERIE', 'AMBIGU'] as Verdict[]) {
    const l = par(v)
    if (!l.length) continue
    console.log(`─── ${v} (${l.length}) ───`)
    for (const x of l.slice(0, 14)) {
      console.log(`  ${x.slug}`)
      console.log(`      ${x.nomActuel.slice(0, 62)}`)
      console.log(`      → ${x.candidat!.name.slice(0, 62)}`)
      console.log(
        `        ean ${x.candidat!.ean ?? '—'} · fabricant ${x.candidat!.price ?? '—'} € · nous ${x.prixActuel.toFixed(2)} €`
      )
      console.log(`        ${x.raison}`)
      if (x.alternatives.length) {
        x.alternatives.forEach((a) => console.log(`        autre : ${a.slug}`))
      }
    }
    if (l.length > 14) console.log(`  … et ${l.length - 14} de plus`)
    console.log('')
  }

  const absents = par('ABSENT')
  if (absents.length) {
    console.log(`─── ABSENT du catalogue (${absents.length}) ───`)
    absents.forEach((x) => console.log(`  ${x.slug.padEnd(46)} ${x.raison}`))
  }

  if (!APPLY) {
    console.log('\nRien n’est écrit. Relisez, puis relancez avec --apply.')
    return
  }

  // Écriture limitée aux confirmations franches : un EAN sur une référence
  // dont on hésite ne vaut pas mieux qu'un EAN absent.
  let n = 0
  for (const x of par('CONFIRME')) {
    const c = x.candidat!
    if (!c.ean || !eanOk(c.ean)) continue
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: x.slug }, data: { ean: c.ean } })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: x.slug,
          action: 'RECONSTRUCTION',
          oldValues: { ean: x.eanActuel, name: x.nomActuel },
          newValues: {
            ean: c.ean,
            nomFabricant: c.name,
            referenceFabricant: c.articleNr,
            prixFabricant: c.price,
            motif: x.raison,
            source: c.url,
          },
        },
      })
    })
    n++
  }
  console.log(`\nEAN écrits : ${n} (uniquement les CONFIRMÉ).`)
  console.log('Les SÉRIE et AMBIGU attendent une décision humaine : renommer, ou laisser.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
