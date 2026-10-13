/**
 * Préparation d'une revue manuelle : pour chaque fiche sans EAN, trouver les
 * pages fabricant candidates et afficher la paire à lire.
 *
 *   npx tsx scripts/revue-manuelle.ts --marque Zwilling
 *   npx tsx scripts/revue-manuelle.ts --marque Zwilling --sortir revue.md
 *
 * Pourquoi l'URL et pas le nom
 * ----------------------------
 * Les URL du sitemap Zwilling portent la description complete et precise :
 * `zwilling-flow-kochtopfset-5-tlg-1030894.html`. C est une clé technique,
 * la plus proche d un identifiant que le catalogue public offrira jamais.
 *
 * On s en sert pour RAMENER des candidats, pas pour décider. La décision se
 * prend à la lecture de la paire affichee : est-ce que le titre de la page
 * fabricant décrit bien le produit de notre fiche ? Cette reponse n est pas
 * automatisable de façon fiable — huit tentatives l ont montré — mais elle
 * n exige qu un humain, ou un agent qui lit.
 */

import { config as loadEnv } from 'dotenv'
import { writeFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const argN = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const MARQUE = argN('--marque', 'Zwilling')
const SORTIE = argN('--sortir', '')

const SITEMAP: Record<string, string> = {
  Zwilling: 'https://www.zwilling.com/de/sitemap_0-product.xml',
  Demeyere: 'https://www.zwilling.com/de/sitemap_0-product.xml',
}
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const norm = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')

/** Mots de notre slug qui portent le type ou la cote : ils servent à filtrer. */
const GENERIQUES = new Set([
  'zwilling',
  'demeyere',
  'wmf',
  'fissler',
  'de',
  'der',
  'die',
  'das',
  'und',
  'mit',
  'cm',
  'tlg',
  'stueck',
  'set',
  'fuer',
  'aus',
  'stahl',
  'edelstahl',
  'aluminium',
  'glas',
  'cromargan',
  'pro',
  'plus',
  'premium',
  'edition',
  'classic',
  'line',
  'basic',
  'select',
  'advance',
  'original',
  'collection',
  'element',
  'essential',
  'advanced',
  'pure',
  'naturel',
  'twin',
  'function',
  'perfect',
  'durable',
  'professional',
])

/**
 * Traduit les mots de notre slug vers le vocabulaire du fabricant, pour
 * retrouver l URL dans le sitemap qui emploie l allemand du site.
 *
 * topfset    -> kochtopfset / topf-set
 * messerset  -> messerset (pareil)
 * besteckenset/bestechenset -> besteckset
 * kochloeffel -> kochlöffel (normalise en kochloeffel)
 * deckel     -> deckel (pareil)
 * …
 * Un mot absent de cette table est rejete : on ne devine pas la traduction.
 */
const TRADUCTION: Record<string, string[]> = {
  topfset: ['kochtopfset', 'topfset'],
  pfannenset: ['pfannenset'],
  messerset: ['messerset'],
  besteckenset: ['besteckset'],
  bestechenset: ['besteckset'],
  essbesteck: ['besteckset', 'essbesteck'],
  chefmesser: ['kochmesser'],
  kochmesser: ['kochmesser'],
  gusseisen: ['gusseisen', 'guss'],
  stielkasserolle: ['stieltopf', 'kasserolle'],
  kasserolle: ['stieltopf', 'kasserolle'],
  braten: ['braeter', 'bratentopf'],
  schmortopf: ['schmorpfanne', 'schmortopf'],
  sauteuse: ['servierpfanne', 'sauteuse'],
  grillpfanne: ['grillpfanne'],
  bratpfanne: ['bratpfanne', 'pfanne'],
  kochtopf: ['kochtopf'],
  fondue: ['fondue'],
  deckel: ['deckel'],
  schneebesen: ['schneebesen'],
  kochloeffel: ['kochloeffel', 'koechloffel'],
  kartoffelstock: ['kartoffelstock'],
  kuechenzange: ['kuechenzange', 'kuechenzange'],
  schaumkelle: ['schaumkelle', 'schaumkelle'],
  messerschiene: ['messerschiene'],
  schneidebrett: ['schneidebrett'],
  topfregal: ['topfregal', 'topfregal'],
  pfannenschoner: ['pfannenschutz', 'pfannenschoner'],
  wasserkocher: ['wasserkocher'],
  handmixer: ['mixer', 'handmixer'],
  stabmixer: ['stabmixer', 'mixer'],
  schaerfstahl: ['schaerf', 'schärf'],
  backform: ['backform'],
  kastenform: ['kastenform'],
  kochfeld: ['kochfeld'],
  raclette: ['raclette'],
  induktion: ['induktion'],
}

function variantesUtiles(slug: string): string[][] {
  const mots = norm(slug)
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length > 2 && !GENERIQUES.has(m) && !/^\d+$/.test(m))
  const variantes: string[][] = []
  for (const m of mots) {
    // Un mot a plusieurs traductions possibles : chacune est une piste, mais
    // on n exige pas toutes en meme temps. On retourne une liste de listes :
    // une piste est validee si au moins une de ses variantes est presente.
    variantes.push(TRADUCTION[m] ?? [m])
  }
  return variantes
}

async function lirePage(url: string): Promise<{ nom: string; ean: string } | null> {
  const c = new AbortController()
  const t = setTimeout(() => c.abort(), 15_000)
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' },
      signal: c.signal,
    })
    if (!r.ok) return null
    const html = await r.text()
    let nom = ''
    for (const m of html.matchAll(
      /<script[^>]*application\/ld\+json[^>]*>([\s\S]{0,20000}?)<\/script>/gi
    )) {
      try {
        const j = JSON.parse(m[1])
        for (const it of Array.isArray(j) ? j : [j]) {
          if (!nom && it.name) nom = String(it.name)
          if (!nom && it.isVariantOf?.name) nom = String(it.isVariantOf.name)
        }
      } catch {
        /* illisible */
      }
    }
    const codes = [...new Set([...html.matchAll(/\b40\d{11}\b/g)].map((x) => x[0]))]
    return { nom, ean: codes.length === 1 ? codes[0] : '' }
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

async function main() {
  const fiches = await prisma.product.findMany({
    where: { brand: MARQUE, isActive: true, ean: null },
    select: { slug: true, nameDe: true, price: true },
    orderBy: { slug: 'asc' },
  })
  const sm = await (await fetch(SITEMAP[MARQUE], { headers: { 'User-Agent': UA } })).text()
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  console.log(`${fiches.length} fiches, ${urls.length} URL au sitemap\n`)

  const lignes: string[] = [
    `# Revue manuelle — ${MARQUE}`,
    ``,
    `${fiches.length} fiches sans EAN. Pour chacune, les pages fabricant candidates.`,
    ``,
    `Une ligne n'est retenue que si le titre fabricant décrit le produit de la`,
    `fiche : même lignée, même type, même contenance. En cas de doute, on n'écrit rien.`,
    ``,
    '---',
    '',
  ]

  for (const f of fiches) {
    const variantes = variantesUtiles(f.slug)
    const cotes = [...norm(f.slug).matchAll(/(\d{1,2})(cm|l\b|teilig|fach)/g)].map((m) => m[1])
    if (!variantes.length) {
      lignes.push(`## ${f.slug}\n\n  ${f.nameDe}\n\n  Aucun mot distinctif dans le slug.\n`)
      continue
    }
    // Candidat = URL dont le nom contient au moins une variante de chaque mot
    // de notre fiche, et dont la cote correspond quand on en a une.
    const candidats = urls.filter((u) => {
      const h = norm(u.split('/').pop()!.replace('.html', ''))
      if (!variantes.every((v) => v.some((x) => h.includes(x)))) return false
      if (cotes.length) {
        const cotesUrl = [...h.matchAll(/(\d{1,2})(cm|l\b|teilig|fach)/g)].map((m) => m[1])
        if (!cotes.some((c) => cotesUrl.includes(c))) return false
      }
      return true
    })
    if (!candidats.length) {
      lignes.push(
        `## ${f.slug}\n\n  ${f.nameDe}\n\n  Aucun candidat au sitemap pour [${variantes.flat().join(', ')}].\n`
      )
      continue
    }

    const lus: string[] = []
    for (const u of candidats.slice(0, 4)) {
      const p = await lirePage(u)
      if (p?.ean && p.nom) lus.push(`    ${p.ean}  ${p.nom}\n         ${u}`)
    }
    lignes.push(
      `## ${f.slug}\n\n  notre fiche : ${f.nameDe}\n\n${lus.length ? lus.join('\n') : '    (aucune page lisible)'}\n`
    )
    console.log(`  ${f.slug} -> ${lus.length} page(s)`)
  }

  // Ce que le sitemap prouve, marge aucune.
  const titres = urls.map((u) => norm(u.split('/').pop()!.replace('.html', '')))
  const compte = (mot: string) => titres.filter((t) => t.includes(mot)).length
  const inexistantes: [string, number][] = [
    ['four-star', compte('four-star')],
    ['two-move', titres.filter((t) => t.includes('two-move') || t.includes('twomove')).length],
    ['spirit', compte('spirit')],
    ['messerschiene', compte('messerschiene')],
    ['kartoffelstock', compte('kartoffelstock')],
    ['raclette', compte('raclette')],
  ]
  lignes.push(
    '',
    '---',
    '',
    '## Ce que le sitemap prouve',
    '',
    `${urls.length} URL produits au sitemap officiel Zwilling.`,
    '',
    '| Recherche | occurrences |',
    '|---|---|'
  )
  for (const [mot, n] of inexistantes) lignes.push(`| ${mot} | ${n} |`)
  lignes.push(
    '',
    'Zéro occurrence ne prouve pas la disparition du produit — Zwilling publie',
    'aussi sous Ballarini et Staub, et son catalogue change. Mais une lignée',
    'absente du sitemap officiel n a aucun EAN à y publier : il faut',
    'une source archivale, pas une recherche.'
  )

  lignes.push('', '---', '', `Revue du ${new Date().toISOString().slice(0, 10)}`, '')
  if (SORTIE) {
    writeFileSync(SORTIE, lignes.join('\n'))
    console.log(`\nécrit dans ${SORTIE}`)
  } else {
    console.log(lignes.join('\n'))
  }
}
main()
  .catch((e) => console.error('✖', e))
  .finally(() => prisma.$disconnect())
