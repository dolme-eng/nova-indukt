/**
 * Repérage des produits hors catalogue fabricant.
 *
 *   npx tsx scripts/out-of-catalog.ts            # rapport
 *   npx tsx scripts/out-of-catalog.ts --apply    # désactive (isActive = false)
 *
 * On désactive, on ne supprime pas : la fiche reste en base avec son EAN,
 * ses images et son historique de commandes. Réversible en une requête si un
 * réapprovisionnement réapparaît.
 *
 * Preuve retenue : AUCUNE page du catalogue fabricant ne partage la série ET
 * le type de l'article. C'est un critère fort — si la série a disparu du
 * catalogue, l'article n'est plus fourni.
 *
 * Un simple échec de rapprochement par la taille ne suffit pas : une
 * skillet 24 cm peut être rangee sous un autre libelle par le fabricant.
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

const brandArg = process.argv.indexOf('--brand')
const BRAND = brandArg > -1 ? process.argv[brandArg + 1] : 'Fissler'

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
])

const ALIASES: Record<string, string[]> = {
  opc: ['original', 'profi', 'collection'],
  plus: [],
}

const TYPE_WORDS = [
  'pfannenschoner',
  'schneebesen',
  'reiniger',
  'adapterplatte',
  'daempfeinsatz',
  'kochtopf',
  'schmortopf',
  'bratentopf',
  'stielkasserolle',
  'sauteuse',
  'bratpfanne',
  'grillpfanne',
  'topfset',
  'kasserolle',
  'auflaufform',
  'deckel',
  'pfanne',
  'topf',
  'wok',
  'schale',
  'fondue',
  'topfregal',
  'wasserkocher',
  'mixer',
  'pfannen',
  'stieltopf',
  'fondue',
]

function tokens(s: string): string[] {
  const out: string[] = []
  for (const t of s
    .toLowerCase()
    .replace(/\d+/g, ' ')
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)) {
    if (!t || STOP.has(t) || BRAND.toLowerCase() === t) continue
    out.push(...(ALIASES[t] ?? [t]))
  }
  return [...new Set(out)]
}

function typeOf(s: string): string | null {
  const t = s.toLowerCase()
  const hits = TYPE_WORDS.filter((w) => t.includes(w))
  return hits.length ? hits.sort((a, b) => b.length - a.length)[0] : null
}

/**
 * Fiches dont l'absence du catalogue est ÉTABLIE, pas déduite.
 *
 * Le détecteur automatique sur-déclare : il signalait
 * `opc-schmortopf-28cm` comme absent alors que son EAN est confirmé. Fissler
 * le nomme « runder Bräter mit Hochraumdeckel » — un simple changement de
 * mot suffit à faire disparaître le type. On ne désactive donc que ce qu'on
 * a vérifié page par page.
 */
const CONFIRME_HORS_CATALOGUE: Record<string, string> = {
  'fissler-opc-sauteuse-24cm':
    'aucune sauteuse 24 cm au catalogue ; la série n’existe qu’en 20 cm (149,00 €)',
  'fissler-opc-sauteuse-28cm':
    'aucune sauteuse 28 cm au catalogue ; la série n’existe qu’en 20 cm (149,00 €)',
  'fissler-crispy-steelux-premium-24cm': 'série Crispy Steelux absente des 384 pages du catalogue',
  'fissler-pfannenschoner-26cm':
    'aucun « pfannenschoner » ni « topfschoner » dans les 384 pages ; Fissler ne vend pas de protection de poêle',
  'fissler-pfannenschoner-28cm': 'idem',
  'fissler-pfannenschoner-30cm': 'idem',
  'fissler-adapterplatte-16cm': 'aucune « adapterplatte » au catalogue ; Fissler n’en vend pas',
  'fissler-antihaft-reiniger-250ml':
    'seul « edelstahl-reiniger » existe ; la variante « antihaft » n’est plus distribuée',
  'fissler-topfregal-edelstahl-4fach':
    'aucun « topfregal » ni « ablage » ; Fissler ne vend pas de rangement de全家',
  'fissler-fondue-set-18l': 'aucun « fondue » dans les 384 pages',
  'fissler-heat-memory-wasserkocher': 'aucun « wasserkocher » dans les 384 pages',
  'fissler-multi-mixer-handmixer': 'aucun « mixer » dans les 384 pages',
  'fissler-cenit-auflaufform-26x18cm':
    'la série Cenit existe (11 pages) mais uniquement en poêles et woks ; Fissler ne fabrique aucune « auflaufform »',
  'fissler-cenit-auflaufform-28x20cm': 'idem',
  'fissler-cenit-auflaufform-33x23cm': 'idem',
  'fissler-vitavit-deckel-22cm':
    'Fissler ne vend qu’un seul couvercle vitavit, en 26 cm (EAN 4009209307732)',
}

/**
 * Fiches que le détecteur signalait à tort : elles EXISTENT, sous un autre
 * libellé ou dans une autre série.
 */
const FAUX_POSITIFS: Record<string, string> = {
  'fissler-vitavit-deckel-26cm':
    'EXISTE — vitavit Zubehör Metalldeckel 26 cm, EAN 4009209307732, fabricant 67,99 €. Vendu 37,99 € : à recaler',
  'fissler-opc-schmortopf-24cm':
    'EXISTE — commercialisé « Original-Profi Collection Bratentopf 24 cm » (renommage par le fabricant)',
  'fissler-opc-schmortopf-28cm':
    'EXISTE — commercialisé « runder Bräter mit Hochraumdeckel 28 cm » / 4,8 L, EAN 4009209379999',
}

/**
 * Signalés par le détecteur mais NON désactivés : la preuve manque.
 * Un type peut être renommé par le fabricant sans que l'article disparaisse.
 */
const A_VERIFIER: Record<string, string> = {}

async function main() {
  const apply = process.argv.includes('--apply')
  const dir = path.join(root, '.cache', BRAND.toLowerCase())
  if (!fs.existsSync(dir)) {
    console.error(`Aucun cache pour ${BRAND}.`)
    process.exitCode = 1
    return
  }

  const produits = await prisma.product.findMany({
    where: {
      brand: BRAND,
      slug: { in: [...Object.keys(CONFIRME_HORS_CATALOGUE), ...Object.keys(FAUX_POSITIFS)] },
    },
    select: { slug: true, price: true, isActive: true },
    orderBy: { slug: 'asc' },
  })
  const by = new Map(produits.map((p) => [p.slug, p]))

  console.log(
    `\nProduits ${BRAND} hors catalogue — ${CONFIRME_HORS_CATALOGUE.length} à désactiver, ${FAUX_POSITIFS.length} faux positifs\n`
  )

  console.log('─── désactivation justifiée ───')
  let total = 0
  for (const [slug, motif] of Object.entries(CONFIRME_HORS_CATALOGUE)) {
    const p = by.get(slug)
    if (p) total += Number(p.price)
    console.log(
      `${slug.padEnd(44)} ${(p ? Number(p.price) : 0).toFixed(2).padStart(7)}  actif=${p?.isActive}\n    ${motif}`
    )
  }
  console.log(`    valeur de stock retirée de la boutique : ${total.toFixed(2)} € au prix de vente`)

  console.log('\n─── signalés à tort, conservés ───')
  for (const [slug, motif] of Object.entries(FAUX_POSITIFS)) {
    const p = by.get(slug)
    console.log(`${slug.padEnd(44)} ${(p ? Number(p.price) : 0).toFixed(2).padStart(7)}  ${motif}`)
  }

  if (Object.keys(A_VERIFIER).length) {
    console.log('\n─── à vérifier ───')
    for (const [slug, motif] of Object.entries(A_VERIFIER))
      console.log(`${slug.padEnd(44)} ${motif}`)
  }

  if (!apply) {
    console.log('\nRelisez, puis relancez avec --apply.')
    return
  }

  let n = 0
  for (const slug of Object.keys(CONFIRME_HORS_CATALOGUE)) {
    const p = by.get(slug)
    if (!p || !p.isActive) continue
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug }, data: { isActive: false } })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: slug,
          action: 'DESACTIVE_HORS_CATALOGUE',
          oldValues: { isActive: true, price: p.price.toString() },
          newValues: {
            isActive: false,
            motif: CONFIRME_HORS_CATALOGUE[slug],
            source: `${BRAND} — catalogue fabricant, 384 pages`,
          },
        },
      })
    })
    n++
  }
  console.log(`\nDésactivés : ${n}  (isActive = false, fiches conservées)`)
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
