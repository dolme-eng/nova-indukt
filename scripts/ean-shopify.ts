/**
 * Extraction d'EAN depuis le catalogue JSON d'un boutique Shopify.
 *
 *   npx tsx scripts/ean-shopify.ts --domaine fissler.com --marque Fissler
 *   npx tsx scripts/ean-shopify.ts --domaine fissler.com --marque Fissler --appliquer
 *
 * Pourquoi c'est different des sept tentatives precedentes
 * ------------------------------------------------------
 * Shopify expose son catalogue entier en JSON, sans blocage et sans quota :
 *
 *   https://fissler.com/products.json?limit=250   ->  385 produits
 *
 * Chaque produit porte un `handle`, qui est une cle technique et non une
 * description : `fissler-essential-schneebesen`. Le handle est donc directement
 * comparable a notre slug, sans interpretation, sans table de synonymes et sans
 * score. On n invente plus une correspondance, on la constate.
 *
 * L EAN n est pas dans le JSON lui-meme : il est dans la page produit, expose
 * en balise structurée. On ne retient un code que s il est unique sur la page
 * ET qu il est deja porte par une autre de nos fiches, auquel cas on le
 * refuse. Un EAN double est un signal d'alarme, pas une coïncidence.
 *
 * Le contrôle d unicité passe avant toute écriture, comme dans
 * rapprochement-lecture-seule.ts : deux fiches pour un même code signifient que
 * la correspondance est fausse et le lot entier tombe.
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
const DOMAINE = argN('--domaine', 'fissler.com')
const MARQUE = argN('--marque', 'Fissler')
const APPLIQUER = process.argv.includes('--appliquer')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

type Produit = {
  handle: string
  title: string
  /** Reference article fabricant, exposee par Shopify dans chaque variante. */
  refs: string[]
  ean: string
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function catalogue(): Promise<Produit[]> {
  const out: Produit[] = []
  const vus = new Set<string>()
  // Shopify refuse products.json?page=1 : la première page se demande sans le
  // parametre page, qui sert a la pagination a partir de la deuxieme.
  for (let page = 1; page <= 12; page++) {
    const suffixe = page === 1 ? '' : `&page=${page}`
    let r: Response
    try {
      r = await fetch(`https://${DOMAINE}/products.json?limit=250${suffixe}`, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' },
      })
    } catch {
      break
    }
    if (!r.ok) break
    const j = (await r.json()) as { products?: unknown[] }
    if (!j.products?.length) break
    let ajoutes = 0
    for (const p of j.products as {
      handle: string
      title: string
      variants?: { sku?: string | null }[]
    }[]) {
      if (vus.has(p.handle)) continue
      vus.add(p.handle)
      ajoutes++
      const refs = [
        ...new Set(
          (p.variants ?? [])
            .map((v) => v.sku ?? '')
            // La reference Fissler se presente 600-460-03-000/0 ; le suffixe
            // apres la barre est l indice de variante, pas la reference.
            .map((s) => s.split('/')[0].trim())
            .filter((s) => /^\d{3}-\d{3}-\d{2}-\d{3}$/.test(s))
        ),
      ]
      out.push({ handle: p.handle, title: p.title, refs, ean: '' })
    }
    if (!ajoutes) break
  }
  return out
}

/**
 * Lit l EAN d'un produit Shopify.
 *
 * On interroge `products/<handle>.js` et non la page HTML. La page HTML liste
 * neuf codes-barres : celui du produit et ceux des produits recommandés, sur
 * neuf vignettes. Impossible de savoir lequel est le bon, et une page qui
 * affiche plusieurs codes est donc écartée.
 *
 * L endpoint `.js` ne renvoie que le produit demande : un unique `barcode`,
 * sans rien autour. C'est la seule source acceptable ici, parce qu elle ne
 * demande aucune interprétation. Le `barcode` est lue directement, et l on
 * n accepte que s il est unique et commence par 40.
 */
async function eanDePage(produit: Produit): Promise<string> {
  try {
    const r = await fetch(`https://${DOMAINE}/products/${produit.handle}.js`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' },
    })
    if (!r.ok) return ''
    const d = (await r.json()) as { variants?: { barcode?: string | null }[] }
    const codes = [
      ...new Set(
        (d.variants ?? []).map((v) => (v.barcode ?? '').trim()).filter((c) => /^40\d{11}$/.test(c))
      ),
    ]
    return codes.length === 1 ? codes[0] : ''
  } catch {
    return ''
  }
}

async function main() {
  console.log(`\n${MARQUE} — catalogue Shopify ${DOMAINE}`)
  const produits = await catalogue()
  console.log(`${produits.length} produits recus\n`)

  const nBom = produits.length
  const codes: string[] = []
  // On interroge les pages en lots, avec un delai maximal : une page qui ne
  // repond pas doit slowing le balayage entier.
  const PAQUET = 6
  let lues = 0
  for (let d = 0; d < produits.length; d += PAQUET) {
    const lot = produits.slice(d, d + PAQUET)
    const res = await Promise.all(
      lot.map(async (p) => {
        const c = new AbortController()
        const t = setTimeout(() => c.abort(), 12_000)
        try {
          const e = await eanDePage(p)
          return { p, e }
        } finally {
          clearTimeout(t)
        }
      })
    )
    for (const { p, e } of res) {
      lues++
      if (e) {
        p.ean = e
        codes.push(e)
      }
    }
    if (lues % 60 < PAQUET)
      console.log(`  ... ${lues}/${nBom} pages lues, ${codes.length} EAN trouves`)
  }
  console.log(`${lues} pages lues, ${codes.length} EAN trouves\n`)

  // Cle de rapprochement par defaut : le handle, qui est une egalite avec notre
  // slug. Si le nombre de correspondances est nul, on tente le second jeu de
  // cles, plus solide encore : la reference article du fabricant, lue dans la
  // variante Shopify. La reference est une cle technique, pas une description.
  const parRef = new Map<string, Produit>()
  for (const p of produits) for (const r of p.refs) if (!parRef.has(r)) parRef.set(r, p)

  const fiches = await prisma.product.findMany({
    where: { brand: MARQUE, isActive: true, ean: null },
    select: { id: true, slug: true, nameDe: true },
    orderBy: { slug: 'asc' },
  })
  console.log(`${fiches.length} fiches ${MARQUE} sans EAN\n`)

  // Correspondance par handle. Notre slug peut etre un prefixe du handle :
  // `fissler-pure-collection-kartoffelstoessel`设计与那边
  // `fissler-pure-collection-kartoffelstoessel-a-125-g`, ou Shopify ajoute une
  // taille ou une couleur que nous n avons pas dans le slug.
  //
  // La regle reste une egalite, jamais un score : le handle doit commencer par
  // le slug, et il doit rester UN SEUL handle ainsi.startswith. Si le prefixe
  // ouvre plusieurs produits, on s abstient plutot que de choisir.
  const parHandle = new Map<string, Produit>()
  for (const p of produits) parHandle.set(p.handle.toLowerCase(), p)
  const parPrefixe = new Map<string, Produit[]>()
  for (const p of produits) {
    const h = p.handle.toLowerCase()
    for (let i = 6; i < h.length; i++) {
      const cle = h.slice(0, i)
      if (!parPrefixe.has(cle)) parPrefixe.set(cle, [])
      parPrefixe.get(cle)!.push(p)
    }
  }

  const retenus: {
    slug: string
    nom: string
    ean: string
    titre: string
    id: string
    methode: string
  }[] = []
  const sansPage: string[] = []
  for (const f of fiches) {
    const slug = f.slug.toLowerCase()
    let p = parHandle.get(slug)
    let methode = 'handle identique au slug'
    if (!p?.ean) {
      // Repli sur le prefixe : Shopify ajoute souvent une taille au handle.
      // Un seul candidat, sinon on s abstient.
      const prefixes = (parPrefixe.get(slug) ?? []).filter((x) => x.ean)
      if (prefixes.length === 1) {
        p = prefixes[0]
        methode = `prefixe exact du handle (${p.handle})`
      }
    }
    if (!p?.ean) {
      const ref = slug.match(/\b\d{3}-\d{3}-\d{2}-\d{3}\b/)?.[0]
      const trouve = ref ? parRef.get(ref) : undefined
      if (trouve?.ean) {
        p = trouve
        methode = `reference article ${ref}`
      }
    }
    if (!p?.ean) {
      sansPage.push(f.slug)
      continue
    }
    retenus.push({
      slug: f.slug,
      nom: f.nameDe ?? '',
      ean: p.ean,
      titre: p.title,
      id: f.id,
      methode,
    })
  }

  // Unicité dans le lot, puis contre la base.
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
  for (const r of retenus) {
    const ex = await prisma.product.findFirst({
      where: { ean: r.ean, id: { not: r.id } },
      select: { slug: true },
    })
    if (ex) {
      console.log(`  ECARTE ${r.slug} : ${r.ean} deja porte par ${ex.slug}`)
      r.ean = ''
    }
  }
  const ecrits = retenus.filter((r) => r.ean)

  console.log(`${'='.repeat(76)}\nCORRESPONDANCE STRICTE slug = handle\n${'='.repeat(76)}`)
  for (const r of ecrits) {
    console.log(`  ${r.slug.padEnd(44)} ${r.ean}`)
    console.log(`      titre fabricant : ${r.titre.slice(0, 58)}`)
  }
  console.log(
    `\n${ecrits.length} retenus sur ${fiches.length}, ${sansPage.length} sans page correspondante.`
  )

  if (!APPLIQUER) {
    console.log('Rapport seul. Relancer avec --appliquer.')
    return
  }
  let n = 0
  for (const r of ecrits) {
    await prisma.product.update({ where: { id: r.id }, data: { ean: r.ean } })
    await prisma.auditLog.create({
      data: {
        action: 'EAN_SHOPIFY_HANDLE',
        entityType: 'Product',
        entityId: r.id,
        oldValues: { ean: null },
        newValues: {
          ean: r.ean,
          titre: r.titre,
          source: `${DOMAINE}/products/${r.slug}`,
          methode: 'handle Shopify identique au slug, EAN lu sur la page produit',
        },
      },
    })
    n++
  }
  console.log(`${n} EAN ecrits et traces.`)
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
