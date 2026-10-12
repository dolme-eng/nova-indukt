/**
 * Rapprochement WMF en lecture seule, sur l'export des seeds.
 *
 *   npx tsx scripts/rapprochement-lecture-seule.ts --marque WMF
 *
 * Aucune connexion a la base. Rien n est ecrit. Sortie : un rapport, et un
 * fichier JSON que l on rejouera avec --appliquer quand Neon répondra.
 *
 * Pourquoi la lecture seule
 * ------------------------
 * Neon refuse toute connexion. L export vient des seeds du depot, qui
 * portent les memes slugs et les memes noms, mais dans un etat anterieur aux
 * 34 retraits et aux 17 renommages. Les resultats sont donc un pre-triage :
 * ils indiquent ce qui meritera d etre verifie en base, pas ce qui est vrai.
 *
 * La regle de serie, celle qui compte
 * -----------------------------------
 * Un premier essai avait ecrit trois faux EAN : Now S Schneebesen suivi sur un
 * Schneebesen Enfinigy, Plus Deckel 20 cm sur un Deckel Twin Specials, Spirit
 * Sauteuse sur une Servierpfanne Pro. Les trois avaient le bon type et la bonne
 * cote. Aucun n avait la bonne serie.
 *
 * Ici un EAN n est propose que si le nom du fabricant contient le mot de serie
 * de notre slug. Et si un seul candidat survit, il est propose ; au-dela on
 * refuse, car deviner un EAN fausse est plus grave que de n en avoir aucun.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { lireSeeds, type Fiche } from './export-catalogue-local'

const root = path.resolve(__dirname, '..')

const argN = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const MARQUE = argN('--marque', 'WMF').toLowerCase()

/** Fiches retirees ou renommees : le prefixe de slug est la cle fiable. */
const RETIREES = [
  'wmf-monde-',
  'wmf-mondo-',
  'wmf-kitchenmaxx-',
  'wmf-function-4-topfset-5teilig',
  'wmf-function-4-besteckenset-68',
  'wmf-antihaft-reiniger',
  'wmf-replacement-griff-set',
]
const RENOMMEES = new Set([
  'wm-kitchenline-handmixer',
  'wm-professional-s-plus-stabmixer',
  'wm-zeppelin-handmixer',
  'wm-zeppelin-stabmixer',
  'wm-kitchenline-wasserkocher',
])

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
  'servierpfanne',
  'kelle',
  'kochloeffel',
  'schoepfkelle',
  'saucenheber',
  'nudelkelle',
  'kartoffelstock',
  'kuechenzange',
  'sieb',
  'wender',
  'grillzange',
]
const SYNONYMES: Record<string, string> = {
  pfanne: 'bratpfanne',
  sautepfanne: 'sauteuse',
  servierpfanne: 'sauteuse',
  topf: 'kochtopf',
  kasserolle: 'stielkasserolle',
  schoepfkelle: 'kelle',
}

const norm = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')

function typeDe(s: string): string | null {
  const b = norm(s)
  const hits = TYPES.filter((w) => b.includes(w))
  if (!hits.length) return null
  const long = hits.sort((a, b) => b.length - a.length)[0]
  return SYNONYMES[long] ?? long
}

function cotesDe(s: string): string[] {
  const n = norm(s)
  return [...new Set([...n.matchAll(/(\d{1,2})\s*(?:cm|l\b|liter|x)/g)].map((m) => m[1]))].sort()
}

const MOTS_IGNORE = new Set([
  'wmf',
  'wm',
  'de',
  'cm',
  'tlg',
  'stueck',
  'set',
  'mit',
  'und',
  'der',
  'die',
  'das',
  'fuer',
  'aus',
  'induktion',
  'stahl',
  'edelstahl',
  'glas',
  'guss',
  // Mots de liaison de gamme, jamais distinctifs. « Plus » est le pire :
  // Diadem Plus, Gourmet Plus, Provence Plus, Perfect Plus et Profi Plus
  // portent tous ce mot, qui ne designe aucune lignee.
  'plus',
  'pro',
  'premium',
  'edition',
  'classic',
  'line',
  'basic',
  'select',
  'select',
  'advance',
  'original',
  'collection',
  'element',
  'essential',
  'profi',
])

function seriesDe(slug: string): string[] {
  return norm(slug)
    .split('-')
    .filter(Boolean)
    .slice(1)
    .filter((s) => !MOTS_IGNORE.has(s) && !/^\d+$/.test(s) && s.length >= 3)
    .slice(0, 2)
}

type PageCache = { nom: string; ean: string }
function chargerCache(dossier: string): PageCache[] {
  const dir = path.join(root, '.cache', dossier)
  if (!existsSync(dir)) return []
  const out: PageCache[] = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    try {
      const j = JSON.parse(readFileSync(path.join(dir, f), 'utf8'))
      const nom = j.name ?? j.nom
      const ean = j.ean
      if (nom && ean && /^40\d{11}$/.test(ean)) out.push({ nom: String(nom), ean: String(ean) })
    } catch {
      /* page illisible */
    }
  }
  return out
}

function main() {
  const toutes: Fiche[] = lireSeeds()
  const deMarque = toutes.filter((f) => f.slug.startsWith(MARQUE + '-') || f.slug.startsWith('wm-'))
  const actives = deMarque.filter((f) => !RETIREES.some((r) => f.slug.startsWith(r)))
  console.log(`export local : ${toutes.length} fiches`)
  console.log(
    `${MARQUE.toUpperCase()} : ${deMarque.length} fiches, ${actives.length} apres retrait des ${deMarque.length - actives.length} deja desactivees ou renommees\n`
  )

  const pages = chargerCache(MARQUE === 'wmf' ? 'wmf' : MARQUE)
  console.log(`cache ${MARQUE} : ${pages.length} pages avec EAN\n`)

  // Index : mot de serie -> liste d EAN. La cle exige le type et la cote.
  const index = new Map<string, { ean: string; nom: string }[]>()
  const ajouter = (cle: string, ean: string, nom: string) => {
    if (!index.has(cle)) index.set(cle, [])
    const l = index.get(cle)!
    if (!l.some((x) => x.ean === ean)) l.push({ ean, nom })
  }
  for (const p of pages) {
    const t = typeDe(p.nom)
    if (!t) continue
    const c = cotesDe(p.nom)
    const mots = norm(p.nom)
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
    for (const mot of mots) {
      if (mot.length < 4 || MOTS_IGNORE.has(mot) || /^\d+$/.test(mot)) continue
      ajouter(`${t}|${c.join('/')}|${mot}`, p.ean, p.nom)
    }
  }
  console.log(`index : ${index.size} cles\n`)

  const proposes: { slug: string; nom: string; ean: string; designation: string }[] = []
  const refuses: { slug: string; motif: string }[] = []
  const sansType: string[] = []

  for (const f of actives) {
    const ident = `${f.slug} ${f.name}`
    const t = typeDe(ident)
    if (!t) {
      sansType.push(f.slug)
      continue
    }
    const c = cotesDe(ident)
    const series = RENOMMEES.has(f.slug) ? [f.slug.split('-')[1]] : seriesDe(f.slug)
    if (!series.length) {
      sansType.push(f.slug)
      continue
    }

    let candidats = new Map<string, string>()
    for (const s of series) {
      const l = index.get(`${t}|${c.join('/')}|${s}`)
      if (l?.length === 1) candidats = new Map(l.map((x) => [x.ean, x.nom]))
      if (candidats.size === 1) break
    }
    if (candidats.size === 1) {
      const [ean, designation] = [...candidats][0]
      proposes.push({ slug: f.slug, nom: f.name, ean, designation })
    } else {
      // Diagnostic : existe-t-il un candidat au type et a la cote, dont la serie differe ?
      const sansSerie = new Map<string, string>()
      for (const cle of index.keys()) {
        const [tt, cc] = cle.split('|')
        if (tt !== t || cc !== c.join('/')) continue
        for (const x of index.get(cle)!) sansSerie.set(x.ean, x.nom)
      }
      if (sansSerie.size === 1) {
        refuses.push({
          slug: f.slug,
          motif: `seul ${[...sansSerie][0][0]} correspond au type et a la cote, mais c est ${[...sansSerie][0][1].slice(0, 46)}`,
        })
      }
    }
  }

  console.log(`${'='.repeat(76)}\nPROPOSES — type, cote et serie concordent\n${'='.repeat(76)}`)

  // Garde-fou final, et le plus important : un EAN designe un seul produit.
  // Si deux fiches reçoivent le même code, c'est que le rapprochement est
  // faux, et tout le lot doit tomber. C'est exactement ce qui s est passé au
  // premier essai : Durado et Performance grillpfanne, deux articles
  // différents, avaient reçu 4000530762849.
  const parEan = new Map<string, string[]>()
  for (const p of proposes) {
    if (!parEan.has(p.ean)) parEan.set(p.ean, [])
    parEan.get(p.ean)!.push(p.slug)
  }
  const doublons = [...parEan].filter(([, slugs]) => slugs.length > 1)
  if (doublons.length) {
    console.log(`\n  LOT REJETE — ${doublons.length} EAN attribues a plusieurs fiches :`)
    for (const [ean, slugs] of doublons) console.log(`    ${ean} -> ${slugs.join('  ET  ')}`)
    console.log(
      '\n  Un EAN designe un seul produit. Le rapprochement par nom est faux, ' +
        'tout le lot est ecarte et rien ne sera propose.'
    )
    return
  }

  for (const p of proposes) {
    console.log(`  ${p.slug.padEnd(44)} ${p.ean}`)
    console.log(`      notre libelle : ${p.nom.slice(0, 58)}`)
    console.log(`      fabricant     : ${p.designation.slice(0, 58)}`)
  }

  console.log(
    `\n${'='.repeat(76)}\nREFUSES — type et cote concordent, serie non\n${'='.repeat(76)}`
  )
  for (const r of refuses) console.log(`  ${r.slug.padEnd(44)} ${r.motif}`)

  console.log(
    `\n${'='.repeat(76)}\nSANS TYPE — ni le type ni la serie ne sont determinants\n${'='.repeat(76)}`
  )
  for (const s of sansType) console.log(`  ${s}`)

  console.log(
    `\n${proposes.length} EAN proposes, ${refuses.length} refuses, ${sansType.length} sans type.` +
      `\n\nLecture seule : rien n est ecrit. A rejouer contre la base une fois Neon retabli.`
  )
  const sortie = path.join(root, 'docs', `ean-proposes-${MARQUE}.json`)
  try {
    require('fs').writeFileSync(sortie, JSON.stringify(proposes, null, 2))
    console.log(`candidats ecrits dans ${sortie.replace(root + '\\', '')}`)
  } catch (e) {
    console.log(`(ecriture du JSON impossible : ${String(e).slice(0, 80)})`)
  }
}

main()
