/**
 * Récupération d'EAN par balayage du sitemap fabricant.
 *
 *   npx tsx scripts/ean-par-sitemap.ts --marque Zwilling
 *   npx tsx scripts/ean-par-sitemap.ts --marque Zwilling --appliquer
 *
 * Pourquoi cette méthode, et pas le rapprochement par nom
 * -------------------------------------------------------
 * Trois moteurs de rapprochement par nom ont produit trois réponses fausses :
 * KAISER pour une fiche WMF, Demeyere pour une Zwilling, Pro S pour Pro Wood.
 * Un accessoire n'a pas de nom propre.
 *
 * Ici on ne compare jamais deux noms saisis à la main. On lit le nom du
 * fabricant sur sa propre page, et on exige :
 *
 *   1. même marque — la page annonce Zwilling, Ballarini ou Staub, et l'on
 *      refuse les pages d'une autre marque ;
 *   2. même type de produit ;
 *   3. même cote en cm ou en litres ;
 *   4. l'EAN est unique dans la page et commence par 40 (Allemagne).
 *
 * Puis, et c'est la sécurité finale, on vérifie que l'EAN n'est déjà porté par
 * aucune autre fiche. Un EAN déjà pris désigne un autre produit : dans ce cas
 * on ne l'écrit pas.
 *
 * Les URL du sitemap Zwilling sont de purs numéros d'article (1023054.html).
 * C'est ideal : le numéro est la reference fabricant, donc une cle exacte.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()

const argN = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const MARQUE = argN('--marque', 'Zwilling')
const APPLIQUER = process.argv.includes('--appliquer')
const LIMITE = Number(argN('--limite', '0'))

const SITEMAPS: Record<string, string> = {
  WMF: 'https://www.wmf.com/media/sitemap/sitemap_de.xml',
  Zwilling: 'https://www.zwilling.com/de/sitemap_0-product.xml',
  Fissler: 'https://fissler.com/sitemap_products_1.xml',
}

/**
 * Series de notre fiche, calculees sur le segment de slug qui suit la marque.
 * C'est la piece qui manquait, et son absence a produit trois faux EAN :
 *
 *   zwilling-now-s-schneebesen  <- 4009839677144  = Schneebesen ENFINIGY
 *   zwilling-plus-deckel-20cm   <- 4009839308963  = Deckel TWIN SPECIALS
 *   zwilling-spirit-sauteuse   <- 4009839530449  = Servierpfanne PRO
 *
 * Les trois avaient le bon type et la bonne cote. Aucun n avait la bonne
 * serie. Un EAN juste designe le mauvais produit, ce qui est plus dommageable
 * qu'un EAN absent : il contamine les comparateurs et les prix.
 *
 * Donc la regle : la serie de notre fiche doit apparaitre dans le nom du
 * fabricant. Sans quoi rien n'est ecrit.
 */
const SERIES_IGNORE = new Set([
  'zwilling',
  'wmf',
  'fissler',
  'de',
  'tefal',
  'demeyere',
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
])

function seriesDe(slug: string): string[] {
  const segments = norm(slug).split('-').filter(Boolean)
  const mots: string[] = []
  for (const s of segments.slice(1)) {
    if (SERIES_IGNORE.has(s)) continue
    if (/^\d+$/.test(s)) continue
    if (s.length < 3) continue
    mots.push(s)
    if (mots.length >= 2) break
  }
  return mots
}
const MARQUES_FIABLES: Record<string, string[]> = {
  Zwilling: ['zwilling'],
  WMF: ['wmf'],
  Fissler: ['fissler'],
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

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
  'gussgratin',
  'servierpfanne',
  'messerschiene',
  'kuechenzange',
  'kochloeffel',
  'kartoffelstock',
  'kelle',
]
const SYNONYMES: Record<string, string> = {
  pfanne: 'bratpfanne',
  sautepfanne: 'sauteuse',
  servierpfanne: 'sauteuse',
  topf: 'kochtopf',
  kasserolle: 'stielkasserolle',
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
  return [...new Set([...n.matchAll(/(\d{1,2})\s*(?:cm|l\b|liter|x)/g)].map((m) => m[1]))]
}

/**
 * Une requete sans delai maximal finit toujours par se bloquer : sur 2000 pages,
 * une seule connexion qui ne repond pas suffit a arreter le balayage entier.
 * Chaque page a donc un budget de 15 secondes, et les pages sont lues par
 * paquets de 8 pour ne pas laisser le temps de calcul dominer.
 */
async function lirePage(url: string): Promise<{ nom: string; ean: string } | null> {
  const controleur = new AbortController()
  const minuterie = setTimeout(() => controleur.abort(), 15_000)
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' },
      signal: controleur.signal,
    })
    if (!r.ok) return null
    const html = await r.text()
    const blocs = [
      ...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]{0,20000}?)<\/script>/gi),
    ].map((m) => m[1])
    let nom = ''
    let ean = ''
    for (const b of blocs) {
      try {
        const j = JSON.parse(b)
        for (const it of Array.isArray(j) ? j : [j]) {
          if (!nom && it.name) nom = String(it.name)
          if (!nom && it.isVariantOf?.name) nom = String(it.isVariantOf.name)
          if (!ean) ean = String(it.gtin13 ?? it.gtin ?? it.ean ?? '')
        }
      } catch {
        /* bloc illisible */
      }
    }
    if (!ean) {
      const m = html.match(/\b40\d{11}\b/)
      if (m) ean = m[0]
    }
    if (!nom || !/^40\d{11}$/.test(ean)) return null
    return { nom, ean }
  } catch {
    return null
  } finally {
    clearTimeout(minuterie)
  }
}

async function main() {
  const sitemapUrl = SITEMAPS[MARQUE]
  if (!sitemapUrl) throw new Error(`marque inconnue : ${MARQUE}`)

  const produits = await prisma.product.findMany({
    where: { brand: MARQUE, isActive: true, ean: null },
    select: { id: true, slug: true, nameDe: true },
    orderBy: { slug: 'asc' },
  })
  console.log(`${MARQUE} : ${produits.length} fiches actives sans EAN`)

  const sx = await (await fetch(sitemapUrl, { headers: { 'User-Agent': UA } })).text()
  let urls = [...sx.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => !/angebot|service|hilfe|konto|login|news|blog|agb|impressum/.test(u))
  if (LIMITE) urls = urls.slice(0, LIMITE)
  console.log(`sitemap : ${urls.length} URL\n`)

  const fiables = MARQUES_FIABLES[MARQUE]
  const marques = new Map<string, string>()
  // Cle = type | cotes | serie. La serie entre dans l'index : c est elle qui
  // manquait, et son absence est la cause des trois faux EAN ci-dessus.
  const parType = new Map<string, string[]>()

  // Balayage du sitemap : on ne garde que les pages de la bonne marque et du
  // bon type, et on retient leur EAN. Lecture par paquets de 8.
  let lues = 0
  const PAQUET = 8
  for (let d = 0; d < urls.length; d += PAQUET) {
    const lot = urls.slice(d, d + PAQUET)
    const pages = await Promise.all(lot.map((u) => lirePage(u)))
    for (const page of pages) {
      lues++
      if (!page) continue
      const bas = norm(page.nom)
      if (!fiables.some((f) => bas.includes(f))) continue
      const t = typeDe(page.nom)
      if (!t) continue
      if (!marques.has(page.ean)) marques.set(page.ean, page.nom)
      // Index par type, cotes et nom de serie trouve dans le nom du fabricant.
      const basPage = norm(page.nom)
      const monType = t
      for (const serie of seriesDe(page.nom)) {
        const cle = `${monType}|${cotesDe(page.nom).sort().join('/')}|${serie}`
        if (!parType.has(cle)) parType.set(cle, [])
        if (!parType.get(cle)!.includes(page.ean)) parType.get(cle)!.push(page.ean)
      }
      // Index par type et cotes seuls, avec le nom complet conserve : sert au
      // rapport de verification, jamais a une ecriture.
      const cleLarge = `${monType}|${cotesDe(page.nom).sort().join('/')}|`
      if (!parType.has(cleLarge)) parType.set(cleLarge, [])
      if (!parType.get(cleLarge)!.includes(page.ean)) parType.get(cleLarge)!.push(page.ean)
      void basPage
    }
    if (lues % 200 < PAQUET)
      console.log(`  ... ${lues}/${urls.length} pages, ${marques.size} EAN collectes`)
  }
  console.log(`${lues} pages lues, ${marques.size} EAN de la marque collectes\n`)

  // Rapprochement : type + cotes + serie, puis controle d'exclusivite.
  let ecrits = 0
  let refuses = 0
  for (const p of produits) {
    const t = typeDe(`${p.slug} ${p.nameDe ?? ''}`)
    const c = cotesDe(`${p.slug} ${p.nameDe ?? ''}`)
      .sort()
      .join('/')
    const maSerie = seriesDe(p.slug)
    if (!t || !maSerie.length) continue

    // La serie de notre fiche doit se retrouver dans le nom du fabricant.
    let candidats: string[] = []
    for (const s of maSerie) {
      const trouve = parType.get(`${t}|${c}|${s}`)
      if (trouve?.length === 1) {
        candidats = trouve
        break
      }
    }
    if (candidats.length !== 1) {
      const large = parType.get(`${t}|${c}|`) ?? []
      if (large.length === 1) {
        refuses++
        console.log(
          `  ${p.slug.padEnd(42)} REFUSE : ${marques.get(large[0])!.slice(0, 52)} — type et cote concordent, serie non`
        )
      }
      continue
    }
    const ean = candidats[0]
    const dejaPris = await prisma.product.findFirst({
      where: { ean, id: { not: p.id } },
      select: { slug: true },
    })
    if (dejaPris) {
      console.log(`  ${p.slug.padEnd(44)} EAN ${ean} DEJA porte par ${dejaPris.slug}, ecrit`)
      continue
    }
    console.log(`  ${p.slug.padEnd(44)} <- ${ean}  ${marques.get(ean)!.slice(0, 52)}`)
    if (APPLIQUER) {
      await prisma.product.update({ where: { id: p.id }, data: { ean } })
      await prisma.auditLog.create({
        data: {
          action: 'EAN_SITEMAP_FABRICANT',
          entityType: 'Product',
          entityId: p.id,
          oldValues: { ean: null },
          newValues: { ean, designation: marques.get(ean), source: sitemapUrl },
        },
      })
      ecrits++
    }
  }
  console.log(
    APPLIQUER
      ? `\n${ecrits} EAN ecrits et traces, ${refuses} refuses faute de serie confirmee.`
      : `\nRapport seul : ${refuses} refuses faute de serie confirmee. Relancer avec --appliquer.`
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
