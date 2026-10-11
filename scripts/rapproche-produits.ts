/**
 * DIAGNOSTIC — ne pas utiliser pour désactiver ni renommer en masse.
 *
 * Trois versions successives de ce moteur ont produit trois réponses
 * différentes, toutes inutilisables :
 *
 *   v1  score par proportion de mots communs → « à renommer » : 10
 *       Dont KAISER Inspiration pour une fiche WMF, un Demeyere Atlantis pour
 *       une Zwilling Plus, et Pro S rapproché de Pro Wood. Les mots « pro »,
 *       « plus », « collection » et « edition » ne désignent aucune lignée :
 *       ils reviennent partout.
 *   v2  exigence de tous les mots distinctifs → « à renommer » : 0
 *       Trop strict. Plus aucune fiche ne Renseigne quoi que ce soit.
 *   v3  repli sur « le fabricant occupe ce type et cette taille » → 46
 *       Le type seul ne veut rien dire : un couvercle est un couvercle. Cela
 *       proposait un WMF Lono Tischgrill à 149,99 EUR pour un couvercle
 *       Diadem Plus, et une poêle en fonte Zwilling Forge pour une Summit+.
 *
 * Conclusion : le rapprochement par nom ne peut pas trancher. UnAccessoire
 * n'a pas de nom propre — « Topfdeckel 24 cm » est le nom d'uneseñrie de
 * produits différents, et nommer un couvercle d'après son diamètre revient à
 * dire qu'il est interchangeable avec n'importe quel autre.
 *
 * Ce qui manque n'est pas un algorithme mais une donnée. Sur les 291 fiches
 * actives : 259 n'ont ni EAN ni référence fabricant. Le champ `supplierSku`
 * existe pour les 291, mais il est rempli avec une clé dérivée du slug
 * (`FIS-CENIT-G28`, `STB-40511-26`), donc invented, donc inexploitable.
 *
 * Avec un EAN ou une référence fabricant, le rapprochement devient une
 * égalité exacte et ce script n'a plus lieu d'être. Sans ça, il ne peut que
 * proposer des associations et se tromper.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()

const argN = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const MARQUE = argN('--marque')
const JSON_OUT = process.argv.includes('--json')

const CACHES: Record<string, string[]> = {
  Fissler: ['fissler'],
  WMF: ['wmf'],
  Zwilling: ['zwilling'],
  Demeyere: ['zwilling'],
  Tefal: ['tefal'],
}

/** Table de types, identique à fix-images.ts et ean-depuis-cache.ts. */
const TYPES = [
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'adapterplatte',
  'daempfeinsatz',
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
  'schneidebrett',
  'besteckset',
  'essbesteck',
  'messerset',
  'teller',
  'schluessel',
  'gussgratin',
  'gratinpfanne',
  'servierpfanne',
  'stielpfanne',
  'sautepfanne',
  'kelle',
  'loeffel',
  'pfannenwender',
  'kartoffelstock',
  'kuechenzange',
  'schuessel',
  'multikocher',
  'gusseisen',
]

const SYNONYMES: Record<string, string> = {
  pfanne: 'bratpfanne',
  stielpfanne: 'bratpfanne',
  sautepfanne: 'sauteuse',
  servierpfanne: 'sauteuse',
  gemiusepfanne: 'gratinpfanne',
  gussgratin: 'gratinpfanne',
  topf: 'kochtopf',
  stieltopf: 'stielkasserolle',
  kasserolle: 'stielkasserolle',
  pfannenschutz: 'pfannenschoner',
}

/**
 * Mots qui ne portent aucune identité de série. « Pro », « plus », « edition »
 * et « collection » reviennent dans presque toutes les gammes du commerce, et
 * « messerset », « teilig » ou « pot » décrivent un format, pas une lignée.
 *
 * Les compter comme du series fit produce des correspondances entre marques et
 * entre gammes sans rapport : WMF Perfect Plus renvoyait sur Perfect One Pot,
 * Zwilling Pro S sur Pro Wood, et KAISER Inspiration était proposé pour une
 * fiche WMF. Ces trois « réponses » ne tenaient qu'à ces mots-là.
 */
const IGNORES = new Set([
  'fissler',
  'wmf',
  'zwilling',
  'demeyere',
  'tefal',
  'kaiser',
  'nesto',
  'roell',
  'woll',
  'mit',
  'und',
  'oder',
  'der',
  'die',
  'das',
  'cm',
  'tlg',
  'stueck',
  'set',
  'guss',
  'profi',
  'pro',
  'plus',
  'premium',
  'edition',
  'collection',
  'classic',
  'line',
  'original',
  'wood',
  'one',
  'pot',
  'messerset',
  'besteckset',
  'essbesteck',
  'fuer',
  'aus',
  'stahl',
  'edelstahl',
  'von',
  'neu',
  'cromargan',
  'protect',
  'gerades',
  'teller',
  'schale',
  'schuessel',
  'form',
  'topf',
  'pfanne',
  'set',
  'stiel',
  'kasserolle',
  'deckel',
  'braten',
  'saute',
  'grill',
  'back',
  'adapteur',
  'reiniger',
  'halter',
  'pfannen',
  'schutz',
  'zubehoer',
  'zubehör',
])

/** Marque déclarée par la page du cache, pour interdire les rapprochements croisés. */
function marquePage(nom: string): string {
  const b = nom.toLowerCase()
  if (b.includes('demeyere')) return 'Demeyere'
  if (b.includes('zwilling') || b.includes('zWILLING'.toLowerCase())) return 'Zwilling'
  if (b.includes('wmf')) return 'WMF'
  if (b.includes('fissler')) return 'Fissler'
  if (b.includes('tefal')) return 'Tefal'
  return 'autre'
}

type Page = { nom: string; slug: string; ean: string | null; prix: number | null }

function charger(dossier: string): Page[] {
  const dir = path.join(root, '.cache', dossier)
  if (!existsSync(dir)) return []
  const out: Page[] = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    try {
      const j = JSON.parse(readFileSync(path.join(dir, f), 'utf8'))
      const slug = f.replace('.json', '')
      if (Array.isArray(j)) {
        for (const v of j) {
          if (!v.ean) continue
          out.push({ nom: `${slug} ${v.title ?? ''}`, slug, ean: v.ean, prix: v.price ?? null })
        }
      } else if (j.ean) {
        out.push({ nom: String(j.name ?? slug), slug, ean: j.ean, prix: j.price ?? null })
      }
    } catch {
      /* page illisible */
    }
  }
  return out
}

function typeDe(s: string): string | null {
  const bas = s.toLowerCase()
  const hits = TYPES.filter((w) => bas.includes(w))
  if (!hits.length) return null
  const long = hits.sort((a, b) => b.length - a.length)[0]
  return SYNONYMES[long] ?? long
}

function jetons(s: string): string[] {
  const out: string[] = []
  for (const t of s
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s-]/g, ' ')
    .split(/[\s-]+/)) {
    if (!t || IGNORES.has(t)) continue
    out.push(SYNONYMES[t] ?? t)
  }
  return [...new Set(out)]
}

function cotes(s: string): string[] {
  return [
    ...new Set([...s.toLowerCase().matchAll(/(\d{1,2})\s*(?:cm|l\b|liter|x)/g)].map((m) => m[1])),
  ]
}

type Verdict = {
  slug: string
  nom: string
  prix: number
  issue: string
  candidat: string
  ean: string | null
}

async function main() {
  const marques = MARQUE ? [MARQUE] : Object.keys(CACHES)
  const where = MARQUE ? { isActive: true, brand: MARQUE } : { isActive: true }
  const produits = await prisma.product.findMany({
    where,
    select: { slug: true, nameDe: true, brand: true, price: true, ean: true },
    orderBy: { slug: 'asc' },
  })

  const verdicts: Verdict[] = []

  for (const marque of marques) {
    const pages = (CACHES[marque] ?? []).flatMap(charger)
    const parEan = new Map(pages.filter((p) => p.ean).map((p) => [p.ean!, p]))
    const siens = produits.filter((p) => p.brand === marque)

    for (const p of siens) {
      const nom = `${p.slug} ${p.nameDe ?? ''}`
      const nType = typeDe(nom)
      const nCotes = cotes(nom)
      const nJetons = jetons(nom)

      // 1. EAN connu : preuve absolue, aucun scoring nécessaire.
      if (p.ean) {
        const page = parEan.get(p.ean)
        verdicts.push({
          slug: p.slug,
          nom: p.nameDe ?? '',
          prix: Number(p.price),
          issue: page ? 'vivante' : 'ean-inconnu',
          candidat: page ? `${page.nom.slice(0, 60)} (${page.prix ?? '—'} EUR)` : '',
          ean: p.ean,
        })
        continue
      }

      let meilleur = { p: null as Page | null, serie: 0 }
      let candidatSlot: Page | null = null
      for (const page of pages) {
        // 0. Même marque obligatoire. Le cache Zwilling contient aussi des pages
        //    Demeyere et le cache WMF des pages KAISER : sans ce filtre, une
        //    fiche Zwilling se faisait rapprocher par un Demeyere.
        if (marquePage(page.nom) !== marque) continue

        // 1. Le type doit être connu des deux côtés et identique. C'est ce garde-fou
        //    qui manquait et qui produisait 135 fausses absences.
        const pType = typeDe(page.nom)
        const memeType = nType !== null && pType !== null && nType === pType
        if (!memeType) continue

        // 2. La taille doit coïncider quand les deux pages en portent une.
        const pCotes = cotes(page.nom)
        if (nCotes.length && pCotes.length && !nCotes.some((c) => pCotes.includes(c))) continue

        // 3. Deux issues possibles selon la concordance des mots distinctifs.
        //    « Notre nom est-il exact » ne suffit pas : la question utile est
        //    « le fabricant occupe-t-il ce type et cette taille, sous un autre
        //    nom de gamme ». C'est le cas des Summit Plus, Masterclass et
        //    Küchenmaxx — la place existe, notre libellé ment sur la lignée.
        const jetonsPage = new Set(jetons(page.nom))
        if (!nJetons.length) continue

        if (nJetons.every((t) => jetonsPage.has(t))) {
          if (nJetons.length > meilleur.serie) meilleur = { p: page, serie: nJetons.length }
        } else if (!candidatSlot && jetonsPage.size) {
          const seriesPage = [...jetonsPage][0]
          if (seriesPage !== nJetons[0]) candidatSlot = page
        }
      }

      if (meilleur.p) {
        verdicts.push({
          slug: p.slug,
          nom: p.nameDe ?? '',
          prix: Number(p.price),
          issue: 'vivante',
          candidat: `${meilleur.p.nom.slice(0, 62)} — ${meilleur.p.prix ?? '—'} EUR`,
          ean: p.ean,
        })
      } else if (candidatSlot) {
        verdicts.push({
          slug: p.slug,
          nom: p.nameDe ?? '',
          prix: Number(p.price),
          issue: 'slot-occupe',
          candidat: `${candidatSlot.nom.slice(0, 62)} — ${candidatSlot.prix ?? '—'} EUR`,
          ean: candidatSlot.ean,
        })
      } else {
        verdicts.push({
          slug: p.slug,
          nom: p.nameDe ?? '',
          prix: Number(p.price),
          issue: 'sans-equivalent',
          candidat: '',
          ean: null,
        })
      }
    }
  }

  if (JSON_OUT) {
    console.log(JSON.stringify(verdicts))
    return
  }

  const par = (i: string) => verdicts.filter((v) => v.issue === i)
  for (const [titre, cle] of [
    ['VIVANTES — type, taille et série concordent', 'vivante'],
    ['SLOT OCCUPÉ — même type et même taille, autre nom de gamme', 'slot-occupe'],
    ['SANS ÉQUIVALENT — aucun article fabricant ne correspond', 'sans-equivalent'],
    ['EAN INCONNU — code posé absent du cache', 'ean-inconnu'],
  ] as const) {
    const liste = par(cle)
    console.log(`\n${'='.repeat(74)}\n${titre} — ${liste.length}\n${'='.repeat(74)}`)
    for (const v of liste) {
      console.log(`  ${v.slug.padEnd(46)} ${v.prix.toFixed(2).padStart(8)}`)
      console.log(`      ${v.nom.slice(0, 66)}`)
      if (v.candidat) console.log(`      → ${v.candidat}`)
    }
  }
  console.log(
    `\nTOTAL ${verdicts.length} fiches actives.\n` +
      `« slot occupé » = le fabricant vend ce type et cette taille sous une autre gamme :` +
      ` notre libellé de série est faux, le produit est vivant.\n` +
      `« sans équivalent » = ni le nom ni le type ni la taille ne se retrouvent.` +
      ` À confirmer avant toute désactivation.`
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
