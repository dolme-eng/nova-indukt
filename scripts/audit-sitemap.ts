/**
 * Contrôle des sitemaps officiels : nos fiches désignent-elles encore un
 * article publié par le fabricant ?
 *
 *   npx tsx scripts/audit-sitemap.ts              # rapport
 *   npx tsx scripts/audit-sitemap.ts --json       # sortie exploitable
 *
 * Le sitemap est la liste de ce que le fabricant vend aujourd'hui. Une fiche
 * absente de cette liste n'est pas « pas encore researched » : le produit a
 * été retiré du catalogue. La nuance est importante pour l'arbitrage :
 *
 *   · wmf.com ne liste plus AUCUN article Diadem Plus (3 pages survivantes
 *     sur 1 013 en cache). Ce n'est pas un trou de scraping, c'est une gamme
 *     retirée. Le constat a demandé des dizaines de relevés Price-Comparison ;
 *     il tient en une lecture de sitemap.
 *
 * Sortie : les fiches présentes au sitemap (produits vivants) et les absentes
 * (produits retirés). Rien n'est écrit ici — la décision appartient à
 * supprimer-produits-obsoletes.ts, qui exige une preuve par fiche.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()
const JSON_OUT = process.argv.includes('--json')

/** Marque -> fichier de sitemap dans le cache local. */
const SITEMAPS: Record<string, string[]> = {
  Fissler: ['fissler/_sitemap_products.xml'],
  WMF: ['wmf/_sitemap_de.xml'],
  Zwilling: ['zwilling/_sitemap_product.xml'],
}

/** Fichiers de cache dont la page correspond à une ligne de notre catalogue. */
const CACHES: Record<string, string> = {
  Fissler: 'fissler',
  WMF: 'wmf',
  Zwilling: 'zwilling',
}

type Etat = { slug: string; nom: string; prix: number; verdict: 'vivant' | 'absent' }

function lireSitemap(marque: string): Set<string> {
  const set = new Set<string>()
  for (const f of SITEMAPS[marque] ?? []) {
    const p = path.join(root, '.cache', f)
    if (!existsSync(p)) continue
    const txt = readFileSync(p, 'utf8')
    for (const m of txt.matchAll(/<loc>([^<]+)<\/loc>/g)) set.add(m[1].toLowerCase())
  }
  return set
}

const MOTS_IGNORES = new Set([
  'fissler',
  'wmf',
  'zwilling',
  'demeyere',
  'tefal',
  'mit',
  'und',
  'der',
  'die',
  'das',
  'cm',
  'tlg',
  'stueck',
  'set',
  'deckel',
  'guss',
  'profi',
  'plus',
  'fuer',
  'aus',
  'stahl',
  'edelstahl',
  'von',
])

const SYNONYMES: Record<string, string> = {
  pfanne: 'bratpfanne',
  stielpfanne: 'bratpfanne',
  sautepfanne: 'sauteuse',
  servierpfanne: 'sauteuse',
  topf: 'kochtopf',
  stieltopf: 'stielkasserolle',
  kasserolle: 'stielkasserolle',
}

function tokens(s: string): Set<string> {
  const out = new Set<string>()
  for (const t of s
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s-]/g, ' ')
    .split(/[\s-]+/)) {
    if (!t || MOTS_IGNORES.has(t)) continue
    out.add(SYNONYMES[t] ?? t)
  }
  return out
}

function cotes(s: string): string[] {
  return [
    ...new Set([...s.toLowerCase().matchAll(/(\d{1,2})\s*(?:cm|l\b|liter)/g)].map((m) => m[1])),
  ]
}

/** Le cache est la liste réelle des pages publiées : plus fiable que le sitemap. */
function lireCache(dossier: string): { nom: string; slug: string }[] {
  const dir = path.join(root, '.cache', dossier)
  if (!existsSync(dir)) return []
  const out: { nom: string; slug: string }[] = []
  for (const f of require('node:fs').readdirSync(dir) as string[]) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    try {
      const j = JSON.parse(readFileSync(path.join(dir, f), 'utf8'))
      if (Array.isArray(j)) {
        for (const v of j)
          out.push({
            nom: `${f.replace('.json', '')} ${v.title ?? ''}`,
            slug: f.replace('.json', ''),
          })
      } else {
        out.push({ nom: String(j.name ?? f.replace('.json', '')), slug: f.replace('.json', '') })
      }
    } catch {
      /* page illisible */
    }
  }
  return out
}

async function main() {
  const marques = Object.keys(CACHES)
  const tous: Etat[] = []

  for (const marque of marques) {
    const sitemap = lireSitemap(marque)
    const pages = lireCache(CACHES[marque])
    const siens = await prisma.product.findMany({
      where: { isActive: true, brand: marque },
      select: { slug: true, nameDe: true, price: true },
      orderBy: { slug: 'asc' },
    })

    const etats: Etat[] = []
    for (const p of siens) {
      const nom = `${p.slug} ${p.nameDe ?? ''}`
      const a = tokens(nom)
      const ca = cotes(nom)
      let vivant = false
      for (const page of pages) {
        const b = tokens(page.nom)
        if (!b.size) continue
        let communs = 0
        for (const t of a) if (b.has(t)) communs++
        if (communs / a.size < 0.75) continue
        const cb = cotes(page.nom)
        if (ca.length && cb.length && !ca.some((c) => cb.includes(c))) continue
        vivant = true
        break
      }
      etats.push({
        slug: p.slug,
        nom: p.nameDe ?? '',
        prix: Number(p.price),
        verdict: vivant ? 'vivant' : 'absent',
      })
    }
    tous.push(...etats)

    const absents = etats.filter((e) => e.verdict === 'absent')
    if (!JSON_OUT) {
      console.log(`\n${'='.repeat(72)}\n${marque} — ${etats.length} fiches actives`)
      console.log(
        `vivantes ${etats.length - absents.length}   absentes du catalogue fabricant ${absents.length}`
      )
      console.log(`sitemap : ${sitemap.size} URLs`)
      if (absents.length) {
        console.log(`\n  absentes :`)
        absents.forEach((e) =>
          console.log(
            `    ${e.slug.padEnd(46)} ${e.prix.toFixed(2).padStart(8)}  ${e.nom.slice(0, 40)}`
          )
        )
      }
    }
  }

  if (JSON_OUT) {
    console.log(JSON.stringify(tous))
    return
  }

  const absents = tous.filter((e) => e.verdict === 'absent')
  console.log(`\n${'='.repeat(72)}`)
  console.log(
    `TOTAL — ${tous.length} fiches actives   vivantes ${tous.length - absents.length}   ` +
      `absentes ${absents.length}`
  )
  console.log('='.repeat(72))
  console.log(
    '\n« absente » = aucune page du site fabricant ne correspond. Le produit a été\n' +
      'retiré du catalogue : ni le marché ni le fabricant ne le Selling plus.'
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
