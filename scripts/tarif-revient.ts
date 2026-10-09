/**
 * Tarification à partir du prix de revient — sans recherche web.
 *
 *   npx tsx scripts/tarif-revient.ts --csv <fichier>   # rapport
 *   npx tsx scripts/tarif-revient.ts --csv <fichier> --apply
 *
 * Entrée : un CSV de prix d'achat, deux colonnes minimum.
 *
 *   slug,costPrice
 *   fissler-adamant-wok-32cm,89.00
 *
 *   slug;costPrice ;-separated et colonnes positionnelles (slug, coût) aussi
 *   acceptés. La colonne coût peut porter une virgule décimale.
 *
 * Règle : prix de vente = coût / (1 - marge), arrondi au supérieur à l'unité.
 * Marge par défaut 5 % (coût = 95 % du prix de vente). Surchargeable par
 * marque ou globalement :
 *
 *   npx tsx scripts/tarif-revient.ts --csv p.csv --marge 12
 *   npx tsx scripts/tarif-revient.ts --csv p.csv --marge Fissler:8
 *
 * Pourquoi cette voie quand un prix de marché existe
 * --------------------------------------------------
 * Le prix de marché donne ce que paie le client. Le prix de revient donne ce
 * que nous gagnons. Les deux se contredisent : un article à 53 € de marché et
 * à 61 € de revient n'est pas une affaire, c'est une perte. Aucun relevé de
 * marché ne peut détecter ce cas, et 190 accessoires du catalogue n'ont de toute
 * façon aucun plancher identifié. Le prix de revient est la seule donnée qui
 * fonctionne sur l'ensemble du catalogue.
 *
 * Tout prix proposé passe sous le prix de revient actuel est refusé : on ne
 * remplace pas un prix par un prix qui perd de l'argent.
 */

import { config as loadEnv } from 'dotenv'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()

const arg = (n: string, def?: string) => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : def
}
const CSV = arg('--csv')
const APPLY = process.argv.includes('--apply')
const MARGE_DEFAUT = Number(arg('--marge', '5')) / 100
const ARRONDIR = Number(arg('--arrondi', '1'))

/**
 * Marge applicable : `--marge Fissler:8` l'emporte sur `--marge 5`.
 * Une marque sans surcharge hérite de la marge globale.
 */
function marge(marque: string | null): number {
  const sur = arg('--marge')
  if (sur?.includes(':')) {
    const [m, pct] = sur.split(':')
    if (m === marque) return Number(pct) / 100
    return MARGE_DEFAUT
  }
  return MARGE_DEFAUT
}

function parseCsv(contenu: string): { slug: string; cout: number }[] {
  const sep = contenu.includes(';') ? ';' : ','
  const lignes = contenu
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const entete = lignes[0].toLowerCase()
  const aEntete = entete.includes('slug') || entete.includes('cout') || entete.includes('cost')
  const corps = aEntete ? lignes.slice(1) : lignes

  return corps.map((l) => {
    const c = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, ''))
    const slug = c[0]
    // Index de la colonne coût : celui dont l'en-tête le désigne, sinon la
    // deuxième colonne. findIndex renvoie -1 quand rien ne correspond.
    let i = aEntete ? c.findIndex((x) => /cout|cost|prix|achat/i.test(x)) : -1
    if (i < 0) i = 1
    const cout = Number((c[i] ?? '').replace(/\s/g, '').replace(/€/g, '').replace(',', '.'))
    if (!slug || !Number.isFinite(cout) || cout <= 0) throw new Error(`Ligne illisible : «${l}»`)
    return { slug, cout }
  })
}

/** Prix = coût / (1 - marge), arrondi au supérieur par pas de `ARRONDIR`. */
function prixVente(cout: number, m: number): number {
  const brut = cout / (1 - m)
  return Math.ceil(brut / ARRONDIR) * ARRONDIR
}

async function main() {
  if (!CSV) {
    console.error(
      '\nUsage : npx tsx scripts/tarif-revient.ts --csv <fichier.csv> [--apply]\n' +
        'Colonnes attendues : slug, costPrice (séparateur , ou ;)\n' +
        'Options : --marge 5 (ou --marge Fissler:8) --arrondi 1\n'
    )
    process.exitCode = 1
    return
  }

  const lignes = parseCsv(readFileSync(CSV, 'utf8'))
  console.log(
    `\nTarif de revient — ${lignes.length} lignes, marge ${(MARGE_DEFAUT * 100).toFixed(0)} %\n`
  )

  let ecrits = 0
  let refuses = 0
  const manquants: string[] = []

  for (const l of lignes) {
    const p = await prisma.product.findUnique({
      where: { slug: l.slug },
      select: { slug: true, brand: true, price: true, costPrice: true, nameDe: true },
    })
    if (!p) {
      manquants.push(l.slug)
      continue
    }

    const m = marge(p.brand)
    const propose = prixVente(l.cout, m)
    const actuel = Number(p.price)

    // Garde-fou : on ne remplace jamais un prix rentable par un prix perdant.
    if (propose < l.cout) {
      console.log(`  ⛔ ${l.slug} — prix proposé ${propose} € sous le coût ${l.cout} €`)
      refuses++
      continue
    }

    const margeEu = propose - l.cout
    const delta = ((propose - actuel) / actuel) * 100
    console.log(
      `  ${p.slug.padEnd(44)} coût ${l.cout.toFixed(2).padStart(7)} → ${propose.toFixed(2).padStart(7)} ` +
        `marge ${margeEu.toFixed(2)} € (${delta >= 0 ? '+' : ''}${delta.toFixed(0)} %)  actuel ${actuel.toFixed(2)}`
    )

    if (Math.abs(propose - actuel) < 0.01) {
      console.log('      = déjà conforme')
      continue
    }
    if (!APPLY) {
      console.log('      → à écrire au --apply')
      continue
    }
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { slug: p.slug },
        data: {
          price: propose,
          costPrice: l.cout,
          ...(propose > actuel ? { oldPrice: actuel } : {}),
        },
      })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: p.slug,
          action: 'PRIX_REVIENT',
          oldValues: { price: actuel.toString(), costPrice: String(p.costPrice) },
          newValues: {
            price: propose,
            costPrice: l.cout,
            margeEur: Number(margeEu.toFixed(2)),
            margePct: Number((m * 100).toFixed(1)),
            source: `relevé de revient, fichier ${path.basename(CSV)}`,
          },
        },
      })
    })
    console.log('      ✓ écrit')
    ecrits++
  }

  console.log(`\nécrits : ${ecrits}   refusés : ${refuses}   introuvables : ${manquants.length}`)
  if (manquants.length) {
    console.log('\nSlugs introuvables en base :')
    manquants.forEach((s) => console.log(`  ${s}`))
  }
  if (!APPLY) console.log('\nRien n est écrit. Relisez, puis relancez avec --apply.')
}

main()
  .catch((e) => {
    console.error('✖', e.message ?? e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
