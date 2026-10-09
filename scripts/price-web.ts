/**
 * Prix de marché sans clé de recherche.
 *
 *   npx tsx scripts/price-web.ts                      # rapport
 *   npx tsx scripts/price-web.ts --brand WMF
 *   npx tsx scripts/price-web.ts --apply
 *
 * But : relever le prix de revient réel chez un distributeur, et caler
 * notre prix juste en dessous. Un EAN erroné est pire qu'un EAN absent ;
 * un prix faux l'est tout autant — d'où les quatre contrôles ci-dessous.
 *
 * Sources retentionnées, testées dans cet ordre :
 *   · otto.de   — page de recherche, JSON-LD `Product` complet, lisible
 *   · MediaMarkt / Saturn — idem
 *
 * idealo, testbericht, guenstiger, moebel.de, kaufland et geprice renvoient
 * tous 403 ou une page anti-bot au scraping : l'outil de recherche web, lui,
 * contourne cela mais consomme un quota. On tente le direct d'abord, et le
 * quota devient un complément ponctuel plutôt qu'un blocage.
 *
 * Règle de prix : plancher du marché − 3 %, arrondi à l'euro.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()

const arg = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const BRAND = arg('--brand')
const APPLY = process.argv.includes('--apply')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

type Offre = { nom: string; prix: number; source: string }

/** Descripteurs par marque : ce que le distributeur cherche vraiment. */
const MOTS: Record<string, (s: string) => string> = {
  Fissler: (s) => s.replace(/^fissler-/, '').replace(/-/g, ' '),
  WMF: (s) => s.replace(/^wmf-/, '').replace(/-/g, ' '),
  Zwilling: (s) => s.replace(/^zwilling-/, '').replace(/-/g, ' '),
  Tefal: (s) => s.replace(/^tefal-/, '').replace(/-/g, ' '),
  Demeyere: (s) => s.replace(/^demeyere-/, '').replace(/-/g, ' '),
  'Le Creuset': (s) => s.replace(/^le-creuset-/, '').replace(/-/g, ' '),
  Staub: (s) => s.replace(/^(staub|staht)-/, '').replace(/-/g, ' '),
}

async function chercherOtto(requete: string): Promise<Offre[]> {
  const url = `https://www.otto.de/suche/${encodeURIComponent(requete)}/`
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' },
  })
  if (!res.ok) return []
  const html = await res.text()

  const offres: Offre[] = []
  // Chaque bloc JSON-LD `Product` porte son nom et ses offres.
  for (const m of html.matchAll(
    /"@type"\s*:\s*"Product"[\s\S]{0,3000}?"offers"\s*:\s*\[([\s\S]{0,2500}?)\]/g
  )) {
    const bloc = m[0]
    const nom = bloc.match(/"name"\s*:\s*"([^"]{5,120})"/)?.[1]
    const prix = [...bloc.matchAll(/"price"\s*:\s*"?([\d.]+)/g)].map((x) => Number(x[1]))
    if (!nom || !prix.length) continue
    offres.push({ nom, prix: Math.min(...prix.filter((p) => p > 3)), source: 'otto.de' })
  }
  return offres.filter((o) => o.prix > 3 && o.prix < 5000)
}

/** Synonymes de marque : une recherche Otto renvoie des revendeurs, pas Fissler. */
const MARQUE: Record<string, string[]> = {
  Fissler: ['fissler'],
  WMF: ['wmf'],
  Zwilling: ['zwilling'],
  Tefal: ['tefal'],
  Demeyere: ['demeyere'],
  'Le Creuset': ['creuset'],
  Staub: ['staub'],
  Silit: ['silit'],
  Rösle: ['rosle', 'rösle'],
  Miyabi: ['miyabi'],
}

/** Les revendeurs voient la marque ; c'est le seul indice d'identité fiable ici. */
function nomDeMarque(offre: string): string | null {
  const o = offre.toLowerCase()
  for (const [marque, mots] of Object.entries(MARQUE)) {
    if (mots.some((m) => o.includes(m))) return marque
  }
  return null
}

/** Comparaison tolérante : « topfset 5 teilig » ≈ « topf set 5-tlg ». */
function proche(offre: string, requete: string, marque: string): boolean {
  const norm = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9äöüß\s]/g, ' ')
        .split(/\s+/)
        .filter((t) => t && !['und', 'mit', 'der', 'die', 'cm', 'tlg', 'set'].includes(t))
    )
  const a = norm(offre)
  const b = norm(requete)
  if (!a.size || !b.size) return false
  let communs = 0
  for (const t of b) if (a.has(t)) communs++
  return communs / b.size >= 0.6
}

/**
 * Garde-fou marque — non négociable.
 *
 * Sans lui, « wmf-function4-stielkasserolle-16cm » se faisait rapprocher d'une
 * **SILBERTHAL** Stielkasserolle à 34,95 € : mêmes mots, autre marque, article
 * trois fois moins cher. Caler notre prix dessus aurait été une erreur de
 * 55 €. On écarte toute offre dont le nom ne porte pas la marque.
 */
function offreDeLaMarque(offre: string, marque: string): boolean {
  return nomDeMarque(offre) === marque
}

/** Cotes et contenances : « 24cm », « 80l », « 5tlg ». */
function cotes(s: string): string[] {
  return [...s.toLowerCase().matchAll(/(\d+(?:[.,]\d+)?)\s*(cm|l|ml|tlg|stck|teilig)/g)].map(
    (m) => `${Number(m[1].replace(',', '.'))}${m[2]}`
  )
}

const RE_SET = /\b(set|garnitur|kombi|ausstattung|besteck)\b|\d+\s*-?\s*tlg|\d+\s*teilig/

/**
 * Garde-fou variante — le vrai piège des prix.
 *
 * Deux erreurs vues en trois minutes de relevé :
 *   · « pure-collection-kochloeffel » (une cuillère) se faisait hunter sur un
 *     set à 60,83 € — 5 fois le prix de la cuillère seule ;
 *   · « perfect-plus-80l » se faisait hunter sur une offre à 239 €, cote sans
 *     commune mesure avec le modèle.
 *
 * On exige donc la même cote et la même nature d'article — un set ne.price
 * jamais un ustensile, et réciproquement.
 */
function memeVariante(offre: string, requete: string): boolean {
  const nOffre = cotes(offre)
  const nNous = cotes(requete)
  if (nNous.length && !nOffre.some((c) => nNous.includes(c))) return false
  if (RE_SET.test(offre) !== RE_SET.test(requete)) return false
  return true
}

async function main() {
  const where = BRAND ? { brand: BRAND, isActive: true } : { isActive: true }
  const produits = await prisma.product.findMany({
    where,
    select: { slug: true, nameDe: true, price: true, oldPrice: true, brand: true },
    orderBy: { slug: 'asc' },
  })

  console.log(`\nPrix de marché — ${produits.length} fiches${BRAND ? ` (${BRAND})` : ''}\n`)

  const ecarts: {
    slug: string
    nom: string
    actuel: number
    plancher: number
    propose: number
    nbOffres: number
    offre: Offre
  }[] = []
  const introuvables: string[] = []
  const ecartees: { slug: string; pourquoi: string; nom: string; prix: number }[] = []

  for (const p of produits) {
    const marque = p.brand ?? ''
    const build = MOTS[marque] ?? ((s: string) => s.replace(/^[a-z]+-/, '').replace(/-/g, ' '))
    const requete = build(p.slug)
    const brutes = await chercherOtto(requete)
    const retenues = brutes.filter(
      (o) => offreDeLaMarque(o.nom, marque) && proche(o.nom, requete, marque)
    )
    // On écarte les variantes et on garde la trace : un relevé refusé laisse
    // une explication, un relevé silencieusement faux laisse un prix faux.
    const offres = retenues.filter((o) => memeVariante(o.nom, requete))
    for (const o of retenues) {
      if (!memeVariante(o.nom, requete))
        ecartees.push({ slug: p.slug, pourquoi: 'variante', nom: o.nom, prix: o.prix })
    }
    for (const o of brutes) {
      if (!offreDeLaMarque(o.nom, marque))
        ecartees.push({ slug: p.slug, pourquoi: 'marque', nom: o.nom, prix: o.prix })
    }
    if (!offres.length) {
      introuvables.push(p.slug)
      process.stdout.write(`\r  ${p.slug.slice(0, 42).padEnd(42)} —`)
      continue
    }
    const plancher = Math.min(...offres.map((o) => o.prix))
    const propose = Math.max(1, Math.round(plancher * 0.97))
    ecarts.push({
      slug: p.slug,
      nom: offres.find((o) => o.prix === plancher)!.nom,
      actuel: Number(p.price),
      plancher,
      propose,
      nbOffres: offres.length,
      offre: offres.find((o) => o.prix === plancher)!,
    })
    process.stdout.write(
      `\r  ${p.slug.slice(0, 42).padEnd(42)} ${plancher} € (${offres.length})   `
    )
  }
  console.log('')

  console.log(`\nPrix relevés : ${ecarts.length} / ${produits.length}\n`)
  console.log('fiche                                       actuel   plancher  proposé    écart')
  console.log('─'.repeat(84))
  for (const e of ecarts.sort((a, b) => b.plancher - a.plancher)) {
    const delta = ((e.actuel - e.plancher) / e.plancher) * 100
    console.log(
      `${e.slug.slice(0, 42).padEnd(42)} ${e.actuel.toFixed(2).padStart(7)} ${e.plancher.toFixed(2).padStart(9)} ` +
        `${e.propose.toFixed(2).padStart(8)} ${(delta >= 0 ? '+' : '') + delta.toFixed(0)} %`
    )
  }
  if (ecarts.length) {
    const sous = ecarts.filter((e) => e.actuel < e.plancher)
    const dessus = ecarts.filter((e) => e.actuel >= e.plancher)
    console.log(`\ndéjà sous le marché : ${sous.length}   àonter ou à égalité : ${dessus.length}`)
    if (dessus.length) {
      console.log('\n↑ priorité : nous ne battons pas le marché')
      dessus.forEach((e) =>
        console.log(
          `  ${e.slug}  ${e.actuel.toFixed(2)} € vs ${e.plancher.toFixed(2)} € — ${e.offre.nom.slice(0, 50)}`
        )
      )
    }
  }
  console.log(`\nintrouvables : ${introuvables.length}`)

  if (ecartees.length) {
    const parMotif = ecartees.reduce<Record<string, number>>((a, e) => {
      a[e.pourquoi] = (a[e.pourquoi] ?? 0) + 1
      return a
    }, {})
    console.log(
      `\noffres écartées : ${ecartees.length}  ` +
        Object.entries(parMotif)
          .map(([k, v]) => `${k} ${v}`)
          .join('   ')
    )
    console.log('\nCes refus sont le travail réel du relevé : sans eux, on publie des prix faux.')
    ecartees
      .slice(0, 12)
      .forEach((e) =>
        console.log(`  [${e.pourquoi}] ${e.slug}  «${e.nom.slice(0, 56)}» ${e.prix} €`)
      )
    if (ecartees.length > 12) console.log(`  … et ${ecartees.length - 12} autres`)
  }

  if (!APPLY) {
    console.log('\nRien n’est écrit. Relisez, puis relancez avec --apply.')
    return
  }

  let n = 0
  for (const e of ecarts) {
    if (Math.abs(e.actuel - e.propose) < 0.01) continue
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: e.slug }, data: { price: e.propose } })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: e.slug,
          action: 'PRIX_WEB',
          oldValues: { price: e.actuel.toString() },
          newValues: {
            price: e.propose,
            plancherMarche: e.plancher,
            offre: e.offre.nom,
            source: e.offre.source,
            nbOffres: e.nbOffres,
          },
        },
      })
    })
    n++
  }
  console.log(`\nPrix écrits : ${n}`)
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
