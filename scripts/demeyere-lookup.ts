/**
 * Import de référence Demeyere.
 *
 *   npx tsx scripts/demeyere-lookup.ts            # rapport, rien n'est écrit
 *   npx tsx scripts/demeyere-lookup.ts --apply    # écrit EAN + image
 *
 * Demeyere est distribué en Allemagne par Zwilling : les pages produit portent
 * un JSON-LD complet avec `gtin` explicite. Il n'y a donc pas lieu de passer
 * par les revendeurs, contrairement à Tefal.
 *
 * Deux particulars de ce catalogue, qui expliquent les décomptes :
 *   · les deux kochtopf Atlantis 7 font la MÊME taille que nos deux autres
 *     fiches Atlantic, et distinguent par la capacité (2,5 L contre 4 L) ;
 *   · le fabricant ne publie que le couvercle 18 cm d'Atlantis, pas 24/28.
 * Ces cas sont refusés, pas devinés.
 *
 * Ce script n'écrit RIEN en base hors `--apply`.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const file of ['.env.local', '.env']) {
  loadEnv({ path: path.join(root, file) })
}

const prisma = new PrismaClient()

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const SITEMAP = 'https://www.zwilling.com/de/sitemap_0-product.xml'

/**
 * Correspondances retenues, référence fabricant par référence fabricant.
 *
 * Chaque ligne a été lue sur la page du fabricant, pas déduite d'une
 * similarité de libellé : nos slugs et les noms Zwilling ne partagent pas le
 * même vocabulaire, et c'est précisément ce qui a fait échouer les
 * rapprochements automatiques chez WMF.
 */
const PAIRS = [
  { slug: 'demeyere-atlantis-7-kochtopf-20cm', ref: '40850-144-0' },
  { slug: 'demeyere-proline-7-28cm', ref: '40850-938-0' },
] as const

/**
 * Fiches refusées, avec le motif. Les garder dans le script empêche de les
 * reconsidérer à chaque exécution sans justification.
 */
const REFUSES: Record<string, string> = {
  'demeyere-atlantis-7-deckel-24cm': 'le fabricant ne propose que le couvercle 18 cm',
  'demeyere-atlantis-7-deckel-28cm': 'aucun couvercle 28 cm au catalogue',
  'demeyere-atlantis-7-stielkasserolle-20cm':
    'stieltopf 20 cm sans couvercle, notre fiche dit « avec »',
  'demeyere-industry-5-sauteuse-24cm': 'aucune sauteuse Industry 5 à ce diamètre',
  'demeyere-industry-5-sauteuse-28cm': 'aucune sauteuse Industry 5 à ce diamètre',
  'demeyere-essential-5-set-5-teilig': 'série Essential 5 absente du catalogue',
  'demeyere-essential-5-sauteuse-24cm': 'série Essential 5 absente du catalogue',
  'demeyere-essential-5-sauteuse-28cm': 'série Essential 5 absente du catalogue',
  'demeyere-essential-5-stielkasserolle-18cm':
    'série Essential 5 absente du catalogue ; la Stielkasserolle Industry 5 fait 22 cm',
  'demeyere-inducity-deckel-24cm': 'série Inducity absente du catalogue',
  'demeyere-atlantis-7-basis-set-5tlg': 'aucun set de base Atlantis 7 publié',
}

function eanChecksumIsValid(ean: string): boolean {
  if (!/^\d{13}$/.test(ean)) return false
  const digits = ean.split('').map(Number)
  const check = digits.pop()!
  let sum = 0
  digits.forEach((d, i) => (sum += i % 2 === 0 ? d : d * 3))
  return (10 - (sum % 10)) % 10 === check
}

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&')
}

async function main() {
  const apply = process.argv.includes('--apply')

  const xml = await (await fetch(SITEMAP, { headers: { 'User-Agent': UA } })).text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    decodeURIComponent(m[1].replace(/&amp;/g, '&'))
  )
  const demeyere = urls.filter((u) => /demeyere/.test(u))

  console.log(
    `\nImport Demeyere — ${demeyere.length} pages au catalogue Zwilling, ${PAIRS.length} paires retenues\n`
  )

  const ours = await prisma.product.findMany({
    where: { slug: { in: PAIRS.map((p) => p.slug) } },
    select: { slug: true, nameDe: true, price: true, ean: true },
  })
  const oursBy = new Map(ours.map((p) => [p.slug, p]))

  const takenRows = await prisma.product.findMany({
    where: { ean: { not: null } },
    select: { slug: true, ean: true },
  })
  const taken = new Map(takenRows.map((p) => [p.ean!, p.slug]))

  console.log(
    'fiche                                    EAN           réf.        notre prix  fabricant'
  )
  console.log('─'.repeat(94))

  const applied: (typeof PAIRS)[number][] = []

  for (const pair of PAIRS) {
    const url = demeyere.find((u) => u.includes(pair.ref))
    if (!url) {
      console.log(`${pair.slug.padEnd(40)} — page ${pair.ref} introuvable`)
      continue
    }

    const html = await (await fetch(url, { headers: { 'User-Agent': UA } })).text()
    const gtin = html.match(/"gtin"\s*:\s*"?(\d{13})/)?.[1] ?? null
    const sku = html.match(/"sku"\s*:\s*"([^"]+)"/)?.[1] ?? null
    const name = decode(html.match(/"@type":"Product"[\s\S]{0,300}?"name":"([^"]+)"/)?.[1] ?? '')
    const priceMatch = html.match(/"@type":"Offer"[\s\S]{0,600}?"price"\s*:\s*"?([\d.]+)/)?.[1]
    const prixFab = priceMatch ? Number(priceMatch) : null
    const image = decode(
      html.match(/"@type":"Product"[\s\S]{0,3000}?"image"\s*:\s*\[\s*"([^"]+)"/)?.[1] ?? ''
    ).replace(/\\\//g, '/')

    const product = oursBy.get(pair.slug)
    if (!product) {
      console.log(`${pair.slug.padEnd(40)} — fiche absente de la base`)
      continue
    }
    if (!gtin || !eanChecksumIsValid(gtin)) {
      console.log(`${pair.slug.padEnd(40)} ${gtin ?? '—'}  clé GS1 invalide`)
      continue
    }
    const holder = taken.get(gtin)
    if (holder && holder !== pair.slug) {
      console.log(`${pair.slug.padEnd(40)} ${gtin}  déjà attribué à ${holder}`)
      continue
    }

    taken.set(gtin, pair.slug)
    applied.push(pair)

    console.log(
      `${pair.slug.padEnd(40)} ${gtin}  ${pair.ref.padEnd(11)} ` +
        `${Number(product.price).toFixed(2).padStart(10)}  ${(prixFab ?? 0).toFixed(2).padStart(9)}`
    )
    console.log(`      fabricant : ${name}  (sku ${sku})`)

    if (!apply) continue

    let imageUrl: string | null = null
    if (image) {
      try {
        const { uploadImage } = await import('../lib/cloudinary')
        const res = await fetch(image, { headers: { 'User-Agent': UA } })
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer())
          if (buf.length > 2000) {
            const up = await uploadImage(buf, 'nova-indukt/products', {
              public_id: `${pair.slug}-${Date.now()}`,
            })
            imageUrl = up.secure_url
          }
        }
      } catch {
        // l'EAN prime sur le visuel
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: pair.slug }, data: { ean: gtin } })
      if (imageUrl) {
        await tx.productImage.deleteMany({ where: { product: { slug: pair.slug } } })
        await tx.productImage.create({
          data: {
            product: { connect: { slug: pair.slug } },
            url: imageUrl,
            alt: product.nameDe,
            sortOrder: 0,
            isMain: true,
          },
        })
      }
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: pair.slug,
          action: 'IMPORT_DEMEYERE',
          oldValues: { ean: product.ean },
          newValues: {
            ean: gtin,
            referenceFabricant: pair.ref,
            sku,
            prixFabricant: prixFab,
            image: imageUrl ?? 'inchangee',
            source: url,
          },
        },
      })
    })
  }

  console.log('─'.repeat(94))
  console.log(
    `\n${apply ? 'Écrit' : 'Validé'} : ${applied.length}   refusés : ${Object.keys(REFUSES).length}`
  )

  console.log('\nFiches refusées et motif :')
  for (const [slug, motif] of Object.entries(REFUSES)) {
    console.log(`  ${slug.padEnd(40)} ${motif}`)
  }
  if (!apply) console.log('\nRelisez le tableau, puis relancez avec --apply.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
