/**
 * Audit de présence des SERIES dans le cache fabricant.
 *
 * Pourquoi une analyse par série et non par produit
 * -------------------------------------------------
 * Le rapprochement produit par produit a échoué trois fois : un accessoire
 * n'a pas de nom propre, et « Topfdeckel 24 cm » désigne des centaines de
 * références différentes.
 *
 * Un nom de série, lui, est fiable. « Summit » existe ou n'existe pas ; c'est
 * une décision binaire du fabricant, pas une question de ressemblance. Sur un
 * cache de 1000 à 2000 pages réelles, une série absente de toutes les pages est
 * une série que le fabricant ne publie pas.
 *
 *   npx tsx scripts/audit-series.ts
 *   npx tsx scripts/audit-series.ts --marque WMF
 *
 * Ne compare jamais deux produits par leur nom. Compare une série à un
 * catalogue, et un EAN à un EAN.
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

const CACHES: Record<string, string[]> = {
  Fissler: ['fissler'],
  WMF: ['wmf'],
  Zwilling: ['zwilling'],
  Demeyere: ['zwilling'],
  Tefal: ['tefal'],
  Staub: ['zwilling'],
  Lodge: ['zwilling'],
}

/**
 * Séries dont on sait déjà, preuve à l'appui, qu'elles n'existent pas chez le
 * fabricant. Aucune d'elles ne doit être cherchée dans le cache : ce serait
 * perdre du temps à chercher ce qui est déjà tranché.
 */
const SERIES_INCONNUES: Record<string, string[]> = {
  Fissler: ['adamant-plus'],
  Tefal: ['masterclass'],
  Zwilling: ['summit-plus'],
  WMF: ['küchenmaxx', 'kitchenmaxx', 'kuchenmaxx'],
}

const BRAND_TOKENS = [
  'fissler',
  'wmf',
  'zwilling',
  'demeyere',
  'tefal',
  'staub',
  'lodge',
  'rosenstein',
  'siemens',
  'bora',
  'ikea',
  'miele',
  'rösle',
  'roesle',
  'amzchef',
]

function normaliser(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
}

/** Charge tous les noms de pages du cache, marque déduite du contenu. */
function nomsCache(dossier: string): string[] {
  const dir = path.join(root, '.cache', dossier)
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    try {
      const j = JSON.parse(readFileSync(path.join(dir, f), 'utf8'))
      out.push(normaliser(f.replace('.json', ' ')))
      if (Array.isArray(j)) {
        for (const v of j) if (v.title) out.push(normaliser(String(v.title)))
      } else if (j.name) {
        out.push(normaliser(String(j.name)))
      }
    } catch {
      /* page illisible */
    }
  }
  return out
}

type Ligne = {
  marque: string
  serie: string
  fiches: number
  pages: number
  avecEan: number
  produits: { slug: string; nom: string; ean: string | null }[]
}

async function main() {
  const marques = MARQUE ? [MARQUE] : Object.keys(CACHES)
  const produits = await prisma.product.findMany({
    where: MARQUE ? { isActive: true, brand: MARQUE } : { isActive: true },
    select: { slug: true, nameDe: true, brand: true, ean: true },
    orderBy: { slug: 'asc' },
  })

  const lignes: Ligne[] = []

  for (const marque of marques) {
    const noms = (CACHES[marque] ?? []).flatMap(nomsCache)
    const siens = produits.filter((p) => p.brand === marque)
    if (!siens.length) continue

    // Regroupement par série : le premier segment du slug qui n'est pas une
    // marque et pas un terme de format.
    const parSerie = new Map<string, typeof siens>()
    for (const p of siens) {
      const seg = p.slug
        .replace(/^zwilling-/, '')
        .replace(/^wmf-/, '')
        .replace(/^fissler-/, '')
        .replace(/^demeyere-/, '')
        .replace(/^tefal-/, '')
      const serie = normaliser(seg.split('-').slice(0, 2).join('-'))
      if (!parSerie.has(serie)) parSerie.set(serie, [])
      parSerie.get(serie)!.push(p)
    }

    for (const [serie, fiches] of parSerie) {
      if (fiches.length < 2 && !MARQUE) continue
      const recherche = normaliser(serie.replace(/-/g, ' '))
      const sansTirets = recherche.replace(/ /g, '')
      const pages = noms.filter(
        (n) =>
          n.includes(recherche) ||
          (sansTirets.length > 5 && n.replace(/ /g, '').includes(sansTirets))
      ).length
      lignes.push({
        marque,
        serie,
        fiches: fiches.length,
        pages,
        avecEan: fiches.filter((p) => p.ean).length,
        produits: fiches.map((p) => ({ slug: p.slug, nom: p.nameDe ?? '', ean: p.ean })),
      })
    }
  }

  const inconnues = lignes.filter(
    (l) =>
      l.pages === 0 &&
      SERIES_INCONNUES[l.marque]?.some((s) => normaliser(l.serie).includes(normaliser(s)))
  )
  const absentes = lignes.filter((l) => l.pages === 0 && !inconnues.includes(l))
  const presentes = lignes.filter((l) => l.pages > 0)

  console.log(`\n${'='.repeat(76)}`)
  console.log(`SÉRIE INEXISTANTE — preuve directe, ${inconnues.length} séries`)
  console.log('='.repeat(76))
  for (const l of inconnues) {
    console.log(`\n  ${l.marque} « ${l.serie} » — ${l.fiches} fiches`)
    for (const p of l.produits) console.log(`      ${p.slug.padEnd(46)} ${p.nom.slice(0, 40)}`)
  }

  console.log(`\n${'='.repeat(76)}`)
  console.log(`SÉRIE ABSENTE DU CACHE — à vérifier, ${absentes.length} séries`)
  console.log('='.repeat(76))
  for (const l of absentes) {
    console.log(
      `\n  ${l.marque} « ${l.serie} » — ${l.fiches} fiches, ${l.avecEan} avec EAN` +
        (l.avecEan ? '   <- un EAN prime sur l absence' : '')
    )
    for (const p of l.produits.slice(0, 6))
      console.log(`      ${p.slug.padEnd(46)} ${p.nom.slice(0, 40)}`)
    if (l.produits.length > 6) console.log(`      … ${l.produits.length - 6} autres`)
  }

  console.log(`\n${'='.repeat(76)}`)
  console.log(
    `SÉRIE PRÉSENTE DANS LE CACHE — ${presentes.length} séries, ${presentes.reduce((a, l) => a + l.fiches, 0)} fiches`
  )
  console.log('='.repeat(76))
  for (const l of presentes.sort((a, b) => b.fiches - a.fiches)) {
    console.log(
      `  ${l.marque.padEnd(9)} ${l.serie.padEnd(30)} ${String(l.fiches).padStart(3)} fiches  ${String(l.pages).padStart(5)} pages`
    )
  }

  console.log(
    `\nUne série absente du cache n'est PAS une preuve d'absence : le cache est un` +
      `\néchantillon. Seule une série sans EAN, sans page et sans correspondance sur` +
      `\nle site du fabricant est retirable. C'est le cas des ${inconnues.length} premières.`
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
