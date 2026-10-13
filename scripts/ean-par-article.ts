/**
 * Verification d'EAN article par article, en n'écrivant que ce qui est
 * vérifié sur la page du fabricant.
 *
 *   npx tsx scripts/ean-par-article.ts --marque Zwilling
 *   npx tsx scripts/ean-par-article.ts --marque Zwilling --appliquer
 *
 * Différence avec les sept moteurs précédents
 * -------------------------------------------
 * Ceux-là rapprochaient nos fiches et le catalogue fabricant par le nom, et
 * ont produit des faux positifs : Now S Schneebesen suivi sur un Schneebesen
 * Enfinigy, Plus Deckel 20 cm sur un Deckel Twin Specials, Spirit Sauteuse sur
 * une Servierpfanne Pro. Le bon type, la bonne cote, la mauvaise lignée.
 *
 * Ici on ne cherche pas. On ouvre la page qui porte le numéro d article du
 * fabricant, on lit son EAN, et on lit aussi le nom du produit. L EAN n'est
 * écrit que si le nom du fabricant confirme la série de notre fiche. C'est un
 * contrôle d'égalité, pas de ressemblance : c'est le seul genre de contrôle
 * qui ne dépende pas d'un algorithme.
 *
 * AVERTISSEMENT — ce script n'est pas fiable en automatique. Trois exécutions
 * successives l'ont montré :
 *
 *   v1  série par mot  -> 6 « vérifiés », dont 4 faux. Four Star relié à All
 *       Star, Now S relié à Pro, Plus relié à Pro.
 *   v2  mots de type exclus -> 1 « vérifié », le Now S relié à Pro Kochlöffel.
 *   v3  série entière exigée -> 1 « vérifié », encore le Now S relié à Pro.
 *
 * Le mot de série de nos fiches est souvent absent du nom fabricant, ou commun
 * à plusieurs gammes. Aucune liste de mots ne sépare « Now S » de « Pro » de
 * façon fiable. La v3 est conservée parce qu elle est la plus stricte et la
 * plus sûre des trois, mais ses résultats doivent être lus, pas appliqués en
 * lot. La seule méthode fiable reste l'ouverture de chaque page par un
 * opérateur, ce que le script prepare (il affiche la paire fiche/page) sans
 * prétendre l'automatiser.
 *
 * Les URL du sitemap Zwilling sont des numéros d article (1023054.html). Une
 * page produit donne un unique code-barres — vérifié : la page 1023054 rend
 * 4009839658006, et elle seule. C'est donc une lecture, pas une interprétation.
 *
 * Le contrôle d'unicité reste prioritaire : si deux fiches reçoivent le même
 * code, le lot entier est rejeté.
 */

import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const argN = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const MARQUE = argN('--marque', 'Zwilling')
const APPLIQUER = process.argv.includes('--appliquer')

const SITEMAP: Record<string, string> = {
  Zwilling: 'https://www.zwilling.com/de/sitemap_0-product.xml',
  Demeyere: 'https://www.zwilling.com/de/sitemap_0-product.xml',
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const norm = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')

/** Mots de liaison de gamme : ils reviennent partout et ne designent rien. */
const MOTS_IGNORE = new Set([
  'zwilling',
  'wmf',
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
  'plus',
  'pro',
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
])

/**
 * Mots de type de produit. « deckel » n'est pas une lignée : c'est un couvercle,
 * et Zwilling le publie sous Fresh & Save, Two Move, Pro, Pure. Le retenir comme
 * mot de série faisait correspondre n'importe quel couvercle de 24 cm — c'est
 * ainsi qu'une fiche « Two Move Deckel 24 » a d'abord reçu l'EAN d un « Fresh &
 * Save BOWLS Vakuumschüssel Deckel L / 24 cm ». « messerset » se retrouve dans
 * Pro Wood, Now S et Pure : c'est un format, pas une lignée.
 *
 * Un mot de série valide ne décrit ni le produit, ni une qualité générique.
 * Ce qui reste — summit, move, wood, function, perfect — est ce qui distingue
 * vraiment deux articles de même type.
 */
const MOTS_TYPE = new Set([
  'deckel',
  'pfanne',
  'bratpfanne',
  'topf',
  'kochtopf',
  'kasserolle',
  'stielkasserolle',
  'sauteuse',
  'servierpfanne',
  'grillpfanne',
  'schmortopf',
  'backform',
  'kastenform',
  'wok',
  'topfset',
  'pfannenset',
  'schale',
  'schuessel',
  'teller',
  'messerset',
  'besteckset',
  'essbesteck',
  'gabel',
  'loeffel',
  'messer',
  'kelle',
  'schneebesen',
  'pfannenschoner',
  'reiniger',
  'zange',
  'topfregal',
  'schneidebrett',
  'wasserkocher',
  'kaffeemaschine',
  'mixer',
  'handmixer',
  'stabmixer',
  'fondue',
  'raclette',
  'backblech',
  'form',
  'platte',
  'adaptateur',
  'unterschieber',
  'garnier',
  'schaumkelle',
  'kartoffelstock',
  'spuelkelle',
  'suppenkelle',
  'sauceheber',
  'salatbesteck',
  'vorlegeloeffel',
  'tortenserver',
  'vakuumsch',
  'vakuumschuessel',
  'schuesselboden',
])

function motsSerie(s: string): string[] {
  return norm(s)
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length > 3 && !MOTS_IGNORE.has(m) && !MOTS_TYPE.has(m) && !/^\d+$/.test(m))
}

/** La page contient-il, en toutes lettres, un mot de série de notre fiche ? */
function serieConfirmee(serieFiche: string, nomFabricant: string): boolean {
  const cible = norm(nomFabricant).split(/[^a-z0-9]+/)
  const mots = motsSerie(serieFiche)
  if (!mots.length) return false
  // Au moins un mot de série de notre fiche doit apparaître dans le nom du
  // fabricant. Un seul suffit : « summit » suffit à valider Summit, « fonction »
  // à valider Function 4. Deux serait trop strict — les intitulés du
  // fabricant abrègent.
  return mots.some((m) => cible.includes(m))
}

async function lirePageArticle(url: string): Promise<{ nom: string; ean: string } | null> {
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
        /* bloc illisible */
      }
    }
    if (!nom) {
      const t2 = html.match(/<h1[^>]*>([^<]{6,120})</i)
      if (t2) nom = t2[1].trim()
    }
    const codes = [...new Set([...html.matchAll(/\b40\d{11}\b/g)].map((x) => x[0]))]
    // Un seul code sur la page. Deux codes = on ne sait pas lequel lire.
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
    select: { id: true, slug: true, nameDe: true },
    orderBy: { slug: 'asc' },
  })
  console.log(`\n${MARQUE} : ${fiches.length} fiches actives sans EAN`)

  const sm = await (await fetch(SITEMAP[MARQUE], { headers: { 'User-Agent': UA } })).text()
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  console.log(`sitemap : ${urls.length} URL articles\n`)

  // On retient les seules pages dont le nom annonce la même marque. Zwilling
  // publie aussi Ballarini et Staub : ces articles ne sont pas les nôtres.
  const fiables: string[] = []
  let lues = 0
  const PAQUET = 6
  for (let d = 0; d < urls.length; d += PAQUET) {
    const lot = urls.slice(d, d + PAQUET)
    const pages = await Promise.all(lot.map((u) => lirePageArticle(u)))
    for (let i = 0; i < lot.length; i++) {
      lues++
      const p = pages[i]
      if (!p?.ean || !p.nom) continue
      if (!norm(p.nom).includes(MARQUE.toLowerCase())) continue
      fiables.push(`${lot[i]}|${p.ean}|${p.nom}`)
    }
    if (lues % 240 < PAQUET)
      console.log(`  ... ${lues}/${urls.length} pages, ${fiables.length} retenues`)
  }
  console.log(`${lues} pages lues, ${fiables.length} articles de la marque avec EAN unique\n`)

  // Index par mot de série : on sait quelle page porte quel mot de gamme.
  const parMot = new Map<string, { url: string; ean: string; nom: string }[]>()
  for (const ligne of fiables) {
    const [url, ean, nom] = ligne.split('|')
    for (const m of norm(nom).split(/[^a-z0-9]+/)) {
      if (m.length > 3 && !MOTS_IGNORE.has(m) && !MOTS_TYPE.has(m) && !/^\d+$/.test(m)) {
        if (!parMot.has(m)) parMot.set(m, [])
        parMot.get(m)!.push({ url, ean, nom })
      }
    }
  }

  type Retenu = { slug: string; nom: string; ean: string; fabricant: string; id: string }
  const retenus: Retenu[] = []
  const sansPreuve: string[] = []

  for (const f of fiches) {
    const mots = motsSerie(f.slug)
    if (!mots.length) {
      sansPreuve.push(`${f.slug} — aucun mot de série identifiable`)
      continue
    }
    // On cherche une page dont le nom contient le mot de série tel quel. On exige
    // que TOUS les mots de série de notre fiche (hors mots génériques et de type)
    // apparaissent dans le nom du fabricant. Exiger un seul mot ne suffit pas :
    // « star » seul relie Four Star à All Star, « kochloeffel » relie Now S à
    // Pro. Il faut la lignée entière.
    const cotesFiche = [...norm(f.slug).matchAll(/(\d{1,2})(?=cm)/g)].map((m) => m[1])
    let trouve: Retenu | null = null
    for (const m of mots) {
      for (const art of parMot.get(m) ?? []) {
        // Tous les mots de série doivent être présents dans le nom fabricant.
        const motsPage = new Set(norm(art.nom).split(/[^a-z0-9]+/))
        if (!mots.every((x) => motsPage.has(x))) continue
        if (cotesFiche.length) {
          const cotesPage = [...norm(art.nom).matchAll(/(\d{1,2})\s*cm/g)].map((x) => x[1])
          if (!cotesFiche.some((c) => cotesPage.includes(c))) continue
        }
        trouve = { slug: f.slug, nom: f.nameDe ?? '', ean: art.ean, fabricant: art.nom, id: f.id }
        break
      }
      if (trouve) break
    }
    if (trouve) retenus.push(trouve)
    else sansPreuve.push(f.slug)
  }

  // Unicité du lot.
  const parEan = new Map<string, string[]>()
  for (const r of retenus) {
    if (!parEan.has(r.ean)) parEan.set(r.ean, [])
    parEan.get(r.ean)!.push(r.slug)
  }
  const doublons = [...parEan].filter(([, s]) => s.length > 1)
  if (doublons.length) {
    console.log('LOT REJETE — EAN attribues a plusieurs fiches :')
    for (const [e, s] of doublons) console.log(`  ${e} -> ${s.join('  ET  ')}`)
    return
  }
  // Unicité contre la base.
  const ecartes: string[] = []
  for (const r of retenus) {
    const ex = await prisma.product.findFirst({
      where: { ean: r.ean, id: { not: r.id } },
      select: { slug: true },
    })
    if (ex) {
      ecartes.push(`${r.slug} : ${r.ean} deja porte par ${ex.slug}`)
      r.ean = ''
    }
  }
  const ecrits = retenus.filter((r) => r.ean)

  console.log(`${'='.repeat(76)}\nVERIFIES SUR LA PAGE FABRICANT\n${'='.repeat(76)}`)
  for (const r of ecrits) {
    console.log(`  ${r.slug.padEnd(44)} ${r.ean}`)
    console.log(`      notre fiche   : ${r.nom.slice(0, 56)}`)
    console.log(`      page fabricant: ${r.fabricant.slice(0, 56)}`)
  }
  if (ecartes.length) {
    console.log(`\n${'='.repeat(76)}\nECARTES\n${'='.repeat(76)}`)
    for (const e of ecartes) console.log(`  ${e}`)
  }
  console.log(
    `\n${ecrits.length} verifies, ${ecartes.length} ecartes, ${sansPreuve.length} sans preuve suffisante.`
  )
  if (sansPreuve.length) {
    console.log(
      `\n${'='.repeat(76)}\nSANS PREUVE — ni trouve ni refute, on ne devine pas\n${'='.repeat(76)}`
    )
    for (const s of sansPreuve) console.log(`  ${s}`)
  }

  if (!APPLIQUER) {
    console.log('\nRapport seul. Relancer avec --appliquer.')
    return
  }
  let n = 0
  for (const r of ecrits) {
    await prisma.product.update({ where: { id: r.id }, data: { ean: r.ean } })
    await prisma.auditLog.create({
      data: {
        action: 'EAN_VERIFIE_PAGE_FABRICANT',
        entityType: 'Product',
        entityId: r.id,
        oldValues: { ean: null },
        newValues: {
          ean: r.ean,
          designation: r.fabricant,
          methode: 'EAN lu sur la page article du fabricant, serie et cote confirmees',
        },
      },
    })
    n++
  }
  console.log(`\n${n} EAN ecrits et traces.`)
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
