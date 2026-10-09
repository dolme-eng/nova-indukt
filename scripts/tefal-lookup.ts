/**
 * Recherche d'EAN par référence fabricant, via les revendeurs.
 *
 *   npx tsx scripts/tefal-lookup.ts            # rapport, rien n'est écrit
 *   npx tsx scripts/tefal-lookup.ts --apply    # écrit l'EAN + l'image
 *
 * tefal.de n'expose AUCUN EAN : ni JSON-LD gtin, ni microdata, ni table de
 * caractéristiques. Le site ne publie que le code article (2100117781) et le
 * MPN fabricant (G2690632).
 *
 * On procède donc par référence fabricant : nos fiches en contiennent une
 * pour une partie seulement (E49706, G2690632…), et les revendeurs
 * especificaciones la recopient à côté de l'EAN. C'est une donnée
 * d'IDENTIFICATION — un code-barres qui désigne l'article, au même titre
 * qu'un ISBN — et non une création protégée : le relever n'est pas du
 * vol de propriété intellectuelle, contrairement aux visuels.
 *
 * Chaque EAN retenu est validé par trois contrôles indépendants :
 *   1. clé de contrôle GS1,
 *   2. la référence fabricant relevée sur la page du revendeur doit
 *      correspondre à celle de notre fiche,
 *   3. l'EAN ne doit pas déjà appartenir à un autre produit du catalogue.
 *
 * Ce script n'écrit RIEN en base hors `--apply`.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
// Prisma et tsx ne chargent pas les .env ; sans cela DATABASE_URL manque.
for (const file of ['.env.local', '.env']) {
  loadEnv({ path: path.join(root, file) })
}

const prisma = new PrismaClient()

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

/** Clé de contrôle GS1 (module 10, poids 3/1 alternés depuis la droite). */
export function eanChecksumIsValid(ean: string): boolean {
  if (!/^\d{13}$/.test(ean)) return false
  const digits = ean.split('').map(Number)
  const check = digits.pop()!
  let sum = 0
  digits.forEach((d, i) => (sum += i % 2 === 0 ? d : d * 3))
  return (10 - (sum % 10)) % 10 === check
}

/**
 * Relevés obtenus sur les revendeurs.
 *
 * `ref` est la référence fabricant relevée SUR LA PAGE DU REVENDEUR, à côté
 * de l'EAN. C'est ce qui autorise le rapprochement : sans cette
 * co-occurrence, un EAN trouvé par mots-clés ne prouverait rien.
 */
type Finding = {
  slug: string
  ean: string
  ref: string
  source: string
  sourceTitle: string
  note?: string
}

const FINDINGS: Finding[] = [
  {
    slug: 'tefal-eternal-mesh-e49706-28cm',
    ean: '3168430304642',
    ref: 'E49706',
    source: 'https://www.alternate.de/Tefal/Pfanne-Eternal-Mesh-%C3%98-28cm/html/product/1816026',
    sourceTitle: 'Alternate',
    note: '« Hersteller-Nr. E49706 », « EAN 3168430304642 », Ø 28 cm — concordance confirmée par Rexel, Venova, Merkandi et net-s.pl qui donnent le même EAN pour E49706.',
  },
  {
    slug: 'tefal-excellence-g2690632-28cm',
    ean: '3168430309722',
    ref: 'G26906',
    source: 'https://merkandi.de/products/excellence-pfanne-28cm/931476',
    sourceTitle: 'Merkandi',
    note: '« Inhalt: G26906 », SKU 2100117781 = code article de la page tefal.de que nous avons vérifiée, EAN 3168430309722.',
  },
]

async function main() {
  const apply = process.argv.includes('--apply')

  const products = await prisma.product.findMany({
    where: { slug: { in: FINDINGS.map((f) => f.slug) } },
    select: { slug: true, nameDe: true, ean: true, images: { select: { url: true } } },
  })

  const bySlug = new Map(products.map((p) => [p.slug, p]))
  const takenRows = await prisma.product.findMany({
    where: { ean: { not: null } },
    select: { slug: true, ean: true },
  })
  const taken = new Map(takenRows.map((p) => [p.ean!, p.slug]))

  console.log(`\nRecherche d'EAN Tefal — ${FINDINGS.length} fiches examinées\n`)
  console.log('fiche                                    EAN           réf.    source')
  console.log('─'.repeat(96))

  let written = 0
  const rejected: string[] = []

  for (const f of FINDINGS) {
    const product = bySlug.get(f.slug)
    if (!product) {
      rejected.push(`${f.slug} — introuvable en base`)
      continue
    }

    const label = `${f.slug} ${product.nameDe}`

    if (!eanChecksumIsValid(f.ean)) {
      rejected.push(`${f.slug} — ${f.ean} échoue à la clé GS1`)
      continue
    }

    // La référence fabricant doit figurer dans le libellé ou le SKU : sans ce
    // recoupement, un EAN chopé au hasard sur un comparateur pourrait être
    // celui d'une poêle de 24 cm.
    const hasRef =
      product.nameDe.toUpperCase().includes(f.ref.toUpperCase()) ||
      f.slug.toUpperCase().includes(f.ref.toUpperCase())
    if (!hasRef) {
      rejected.push(`${f.slug} — référence ${f.ref} absente de notre fiche`)
      continue
    }

    const holder = taken.get(f.ean)
    if (holder && holder !== f.slug) {
      rejected.push(`${f.slug} — EAN ${f.ean} déjà attribué à ${holder}`)
      continue
    }

    console.log(`${f.slug.slice(0, 38).padEnd(38)} ${f.ean}  ${f.ref.padEnd(7)} ${f.sourceTitle}`)
    taken.set(f.ean, f.slug)
    written++

    if (!apply) continue

    // Le visuel reste celui d'origine : ce travail porte sur l'EAN, et
    // remplacer une photo sans l'avoir vérifiée comme pour Fissler serait
    // une erreur de plus.
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: f.slug }, data: { ean: f.ean } })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: f.slug,
          action: 'LOOKUP_EAN',
          oldValues: { ean: product.ean },
          newValues: {
            ean: f.ean,
            referenceFabricant: f.ref,
            source: f.source,
            methode: 'revendeur — tefal.de n’expose aucun EAN',
            note: f.note,
          },
        },
      })
    })
  }

  console.log('─'.repeat(96))
  console.log(`\n${apply ? 'Écrit' : 'Validé'} : ${written}   écartés : ${rejected.length}`)

  if (rejected.length) {
    console.log('\nÉcartés :')
    rejected.forEach((r) => console.log(`  ${r}`))
  }

  if (!apply && written) console.log('\nRelisez le tableau, puis relancez avec --apply.')
  if (apply) console.log('Aucune image touchée : seule l’identification est écrite.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
