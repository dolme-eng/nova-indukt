/**
 * Remplacement des images produit.
 *
 *   npx tsx scripts/fix-images.ts --brand Fissler
 *   npx tsx scripts/fix-images.ts --brand WMF --apply
 *
 * Les visuels actuels sont des images de remplissage qui ne montrent pas le
 * produit. On les remplace par le visuel du FABRICANT, trouvé dans les pages
 * déjà téléchargées (`.cache/<marque>/`). Le nom de fichier du visuel porte
 * l'EAN chez Fissler : le rapprochement est donc direct quand l'EAN est connu.
 *
 * Règles :
 *   · on vise 3 images, on accepte 1 si c'est tout ce qu'il y a ;
 *   · jamais d'image si le type d'article ne correspond pas ;
 *   · chaque remplacement est écrit dans ProductImage et tracé en AuditLog.
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

const arg = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const BRAND = arg('--brand', 'Fissler')
const APPLY = process.argv.includes('--apply')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36'

// ── Vocabulaire ───────────────────────────────────────────────────────────
const TYPE_WORDS = [
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
  'gießer',
  'mikrowelle',
  'contactgrill',
  'waffeleisen',
  'sandwich',
  'multikocher',
  'gusseisen',
  // Vocabulaire du thème Fissler courant. Les pages s'appellent
  // « Pfanne », « Servierpfanne », « Sautépfanne » ou « Stielpfanne » selon la
  // ligne ; sans ces entrées, typeOf() ne reconnaissait pas le candidat et la
  // fiche était rejetée alors que la page est exactement le bon produit.
  'servierpfanne',
  'stielpfanne',
  'sautepfanne',
  'schaumkelle',
  'schoepfkelle',
  'pfannenwender',
  'kartoffelstock',
  'kuechenzange',
  'kuchengabel',
  'gussgratin',
  'gratinpfanne',
  'dampfgarer',
  'multifunktionspfanne',
  'gemiusepfanne',
]
const ACCESSORY = [
  'deckel',
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'griff',
  'untersetzer',
  'sieb',
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
  'profi',
  'plus',
  'edition',
  'classic',
  'germania',
])
const ALIASES: Record<string, string[]> = { opc: ['original', 'profi', 'collection'] }

function toks(s: string): string[] {
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
/**
 * Synonymes de dénomination.
 *
 * Fissler nomme ses poêles « Pfanne » là où notre catalogue écrit
 * « Bratpfanne ». Même produit, même ligne, même corps — mais deux mots
 * différents, donc deux types différents, donc un rejet. Idem « Sautépfanne »
 * que le thème écrit sans accent, et « Servierpfanne » que nous appelons
 * « Sauteuse ».
 *
 * Sans cette table, la ligne la plus vendue du catalogue (Adamant Comfort)
 * restait sans image alors que la page fabricant est disponible et correcte.
 */
const SYNONYMES: Record<string, string> = {
  pfanne: 'bratpfanne',
  stielpfanne: 'bratpfanne',
  sautepfanne: 'sauteuse',
  servierpfanne: 'sauteuse',
  gemiusepfanne: 'gratinpfanne',
  gussgratin: 'gratinpfanne',
  schmortopf: 'schmortopf',
  topf: 'kochtopf',
  stieltopf: 'stielkasserolle',
  kasserolle: 'stielkasserolle',
}

function typeOf(s: string): string | null {
  const t = s.toLowerCase()
  const hits = TYPE_WORDS.filter((w) => t.includes(w))
  if (!hits.length) return null
  const long = hits.sort((a, b) => b.length - a.length)[0]
  return SYNONYMES[long] ?? long
}
function sizesIn(s: string): string[] {
  return [...new Set([...s.matchAll(/(\d{2})\s*[-–]?\s*(?:cm|l\b|liter)/gi)].map((m) => m[1]))]
}

// ── Chargement du cache fabricant ─────────────────────────────────────────
type Their = {
  slug: string
  name?: string
  variants?: { ean: string | null; title: string; price: number | null; image: string | null }[]
  ean?: string | null
  price?: number | null
  image?: string | null
}

/** Marques distribuées par Zwilling en Allemagne — même cache, même source d'images. */
const DISTRIBUE_PAR: Record<string, string> = { Demeyere: 'Zwilling' }

function cacheName(brand: string): string {
  return DISTRIBUE_PAR[brand] ?? brand
}

function loadCache(brand: string): Their[] {
  const dir = path.join(root, '.cache', cacheName(brand).toLowerCase())
  if (!fs.existsSync(dir)) throw new Error(`Pas de cache pour ${brand}. Lance le fetch.`)
  const out: Their[] = []
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    const slug = f.replace('.json', '')
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
      if (Array.isArray(data)) out.push({ slug, variants: data })
      else out.push({ ...data, slug })
    } catch {}
  }
  return out
}

async function upload(slug: string, url: string): Promise<string | null> {
  try {
    const abs = url.startsWith('//') ? `https:${url}` : url
    const res = await fetch(abs, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 3000) return null
    const { uploadImage } = await import('../lib/cloudinary')
    const up = await uploadImage(buf, 'nova-indukt/products', {
      public_id: `${slug}-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
    })
    return up.secure_url
  } catch {
    return null
  }
}

async function main() {
  const cache = loadCache(BRAND)
  // Index par EAN pour un rapprochement direct quand on le connaît.
  const parEan = new Map<string, Their>()
  // `libelle` porte le texte descriptif : chez Zwilling/Demeyere le slug est
  // réduit au numéro d'article, `name` est le seul libellé exploitable.
  const liste: { slug: string; url: string; libelle: string }[] = []
  for (const t of cache) {
    const libelle = `${t.slug} ${t.name ?? ''}`
    if (t.variants) {
      for (const v of t.variants) {
        if (v.ean) {
          parEan.set(v.ean, t)
          if (v.image) liste.push({ slug: t.slug, url: v.image, libelle })
        }
      }
    } else if (t.image) {
      if (t.ean) parEan.set(t.ean, t)
      liste.push({ slug: t.slug, url: t.image, libelle })
    }
  }

  const ours = await prisma.product.findMany({
    where: { brand: BRAND, isActive: true },
    select: { slug: true, nameDe: true, ean: true, images: { select: { url: true } } },
    orderBy: { slug: 'asc' },
  })

  console.log(
    `\nImages ${BRAND} — ${cache.length} pages, ${liste.length} visuels, ${ours.length} fiches\n`
  )

  let ok = 0,
    sans = 0,
    ecrit = 0

  for (const o of ours) {
    const ourType = typeOf(`${o.slug} ${o.nameDe}`)
    const ourSizes = sizesIn(`${o.slug} ${o.nameDe}`)

    // 1) EAN connu : lien certain.
    type Cand = { slug: string; url: string; libelle: string }
    let candidats: Cand[] = []
    // 1) EAN connu : lien certain.
    if (o.ean && parEan.has(o.ean)) {
      const t = parEan.get(o.ean)!
      const urls = new Set<string>()
      if (t.image) urls.add(t.image)
      t.variants?.forEach((v) => {
        if (v.image) urls.add(v.image)
      })
      candidats = [...urls]
        .slice(0, 3)
        .map((url) => ({ slug: t.slug, url, libelle: `${t.slug} ${t.name ?? ''}` }))
    } else {
      // 2) sinon type + taille, série en bonus.
      const target = toks(o.slug.replace(new RegExp(`^${BRAND.toLowerCase()}-`), ''))
      const scored = liste
        .map((c) => {
          // Le cache Zwilling porte des slugs réduits au numéro d'article
          // (« 40850-144-0 ») : le seul texte descriptif est `name`.
          const libelle = c.libelle
          const theirType = typeOf(libelle)
          const theirSizes = sizesIn(libelle)
          if (ourType && !theirType) return null
          if (ourType && theirType !== ourType) return null
          // Notre fiche n'a pas de type reconnu (« grillzange », « kochloeffel »)
          // mais le candidat est un appareil : on ne sait pas, donc on refuse.
          if (!ourType && theirType) return null
          // Type inconnu des deux côtés : le score ne repose plus que sur la
          // série, et quatre ustensiles différents se regroupent alors sur le
          // même article (observé sur Now S : 53026-201-0 pour kochloeffel,
          // kartoffelstock, kuechenzange ET schaumkelle). Sans type connu on
          // n'affirme rien — l'identité se prouve, elle ne se devine pas.
          if (!ourType && !theirType) return null
          // Taille inconnue côté candidat : deux cotes différentes se
          // partageraient la même photo (lids Plus 16 et 20 cm → 1034175).
          //
          // Une page dont le titre ne porte AUCUNE cote est différente : le
          // thème Fissler mutualise la page pour toutes les diameters
          // (« adamant-comfort-pfanne », variantes 20 à 32 cm) et chaque
          // variante a sa photo. Rejeter ces pages écartait la ligne la plus
          // vendue du catalogue alors que les images sont précisément
          // disponibles. On les accepte, et la sélection se fait par EAN.
          if (
            ourSizes.length &&
            theirSizes.length &&
            !theirSizes.some((s) => ourSizes.includes(s))
          ) {
            return null
          }
          const tt = new Set(toks(libelle))
          const serie = target.filter((t) => tt.has(t)).length / (target.length || 1)
          return { c, serie }
        })
        .filter(Boolean) as { c: { slug: string; url: string; libelle: string }; serie: number }[]
      scored.sort((a, b) => b.serie - a.serie)
      const best = scored.find((s) => s.serie >= 0.6 && s.serie === (scored[0]?.serie ?? 0))
      if (best) {
        const urls = [
          ...new Set(liste.filter((x) => x.slug === best.c.slug).map((x) => x.url)),
        ].slice(0, 3)
        candidats = urls.map((url) => ({ slug: best.c.slug, url, libelle: best.c.libelle }))
      }
    }

    if (!candidats.length) {
      sans++
      console.log(`  [—] ${o.slug}`)
      continue
    }
    // Un set ou un lot ne peut pas illustrer un ustensile isolé : les
    // ustensiles Fissler n'existent que dans une page de set.
    if (/\d+[-.]?teilig|\bset\b/i.test(candidats[0].slug) && !typeOf(o.slug)) {
      sans++
      console.log(`  [— set] ${o.slug}`)
      continue
    }
    // Garde-fou : la page fabricant retenue doit porter le même type que
    // notre fiche. « pure-collection-grillzange » (type : aucun) ne doit pas
    // récupérer les visuels d'une kasserolle.
    const leurType = typeOf(candidats[0].libelle)
    if (ourType && !leurType) {
      sans++
      console.log(`  [✗ type] ${o.slug} → ${candidats[0].slug}`)
      continue
    }
    if (ourType && leurType && ACCESSORY.includes(ourType) !== ACCESSORY.includes(leurType)) {
      sans++
      console.log(`  [✗ accessoire/appareil] ${o.slug} → ${candidats[0].slug}`)
      continue
    }
    ok++
    console.log(`  [${candidats.length}] ${o.slug}  ← ${candidats[0].slug}`)

    if (!APPLY) continue

    const newUrls: string[] = []
    for (const c of candidats) {
      const u = await upload(o.slug, c.url)
      if (u) newUrls.push(u)
    }
    if (!newUrls.length) {
      console.log('      téléchargement échoué')
      continue
    }

    // Les uploads Cloudinary se font AVANT la transaction : sans cela le
    // délai d'upload épuise le timeout interactif de 5 s de Prisma.
    await prisma.$transaction(
      async (tx) => {
        await tx.productImage.deleteMany({ where: { product: { slug: o.slug } } })
        for (let i = 0; i < newUrls.length; i++) {
          await tx.productImage.create({
            data: {
              product: { connect: { slug: o.slug } },
              url: newUrls[i],
              alt: o.nameDe,
              sortOrder: i,
              isMain: i === 0,
            },
          })
        }
        await tx.auditLog.create({
          data: {
            entityType: 'Product',
            entityId: o.slug,
            action: 'IMAGES_OFFICIELLES',
            oldValues: { images: o.images.map((i) => i.url) },
            newValues: { images: newUrls, source: candidats[0].slug },
          },
        })
      },
      { timeout: 40000 }
    )
    ecrit++
    console.log(`      ${newUrls.length} image(s) posée(s)`)
  }

  console.log(`\nRapprochés : ${ok}   sans visuel fiable : ${sans}`)
  if (APPLY) console.log(`Fiches mises à jour : ${ecrit}`)
  else console.log('Rien n’est écrit. Relisez, puis relancez avec --apply.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
