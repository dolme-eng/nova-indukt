/**
 * Rattache un EAN fabricant aux fiches du catalogue, par correspondance de
 * dénomination avec le cache officiel.
 *
 *   npx tsx scripts/ean-depuis-cache.ts WMF          # rapport
 *   npx tsx scripts/ean-depuis-cache.ts WMF --apply
 *
 * Pourquoi c'est la pièce manquante
 * --------------------------------
 * Rechercher un prix par nom de produit dans un comparateur allemand donne
 * des rapprochements douteux : deux procédures à 40 € d'écart, quatre ustensiles
 * sur le même numéro d'article. Rechercher par EAN ne laisse aucune ambiguïté.
 *
 * Nos fiches ne portaient que 21 EAN sur 316. Les caches manufacturers en
 * contiennent un par article — 3 000 pages Fissler, WMF, Zwilling, Demeyere,
 * Tefal. Les rattacher rend chaque relevé de prix ultérieur exact au lieu
 * d'être une correspondance de texte.
 *
 * Garde-fous : la taille doit coïncider, et un EAN déjà posé n'est jamais
 * écrasé — un EAN faux est pire qu'un EAN absent, il contamine les comparateurs.
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
const BRAND = argN('--brand')
const APPLY = process.argv.includes('--apply')
/**
 * Seuil de confiance, lowered depuis 0.8 : les dénominations allemandes
 * compounding empêchent les correspondances exactes. Sous 0.7 on ne pose
 * rien — un EAN erroné contamine les comparateurs, il est plus nuisible
 * qu'un EAN absent.
 */
const SEUIL = Number(argN('--seuil', '0.75'))

/** Cache à interroger : marque de nos fiches -> dossier(s) qui la publications. */
const CACHES: Record<string, string[]> = {
  Fissler: ['fissler'],
  WMF: ['wmf'],
  Zwilling: ['zwilling'],
  Demeyere: ['zwilling'],
  Tefal: ['tefal'],
}

type Page = { nom: string; prix: number | null; ean: string | null }

function charger(dossier: string): Page[] {
  const dir = path.join(root, '.cache', dossier)
  if (!existsSync(dir)) return []
  const out: Page[] = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue
    try {
      const j = JSON.parse(readFileSync(path.join(dir, f), 'utf8'))
      // Format tableau (variantes) ou objet (page unique) selon le cache.
      if (Array.isArray(j)) {
        for (const v of j) {
          out.push({
            nom: `${f.replace('.json', '')} ${v.title ?? ''}`,
            prix: v.price ?? null,
            ean: v.ean ?? null,
          })
        }
      } else {
        out.push({
          nom: `${j.name ?? f.replace('.json', '')}`,
          prix: j.price ?? null,
          ean: j.ean ?? null,
        })
      }
    } catch {
      /* page illisible : ignorée */
    }
  }
  return out
}

const MOTS_IGNORES = new Set([
  'fissler',
  'wmf',
  'zwilling',
  'demeyere',
  'tefal',
  'mit',
  'und',
  'der',
  'die',
  'das',
  'cm',
  'tlg',
  'stueck',
  'set',
  'deckel',
  'guss',
  'profi',
  'plus',
  'fuer',
  'aus',
  'stahl',
  'edelstahl',
])

/**
 * Synonymes de dénomination, comme dans fix-images.ts.
 *
 * Fissler écrit « Pfanne » là où notre catalogue écrit « Bratpfanne » : sans
 * cette table, deux mots pour le même produit ne se rejoignent jamais et la
 * fiche reste sans EAN alors que la page du fabricant est sous nos yeux.
 */
const SYNONYMES: Record<string, string> = {
  pfanne: 'bratpfanne',
  stielpfanne: 'bratpfanne',
  sautepfanne: 'sauteuse',
  servierpfanne: 'sauteuse',
  gemiusepfanne: 'gratinpfanne',
  gussgratin: 'gratinpfanne',
  topf: 'kochtopf',
  stieltopf: 'stielkasserolle',
  kasserolle: 'stielkasserolle',
}

function tokens(s: string): Set<string> {
  const out = new Set<string>()
  for (const t of s
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)) {
    if (!t || MOTS_IGNORES.has(t)) continue
    out.add(SYNONYMES[t] ?? t)
  }
  return out
}

/** La taille est le premier discriminant d'un comparateur : elle doit coïncider. */
function cotes(s: string): string[] {
  return [
    ...new Set([...s.toLowerCase().matchAll(/(\d{1,2})\s*(?:cm|l\b|liter)/g)].map((m) => m[1])),
  ]
}

function scorer(lesNôtres: string, page: Page): number {
  const a = tokens(lesNôtres)
  const b = tokens(page.nom)
  if (!a.size || !b.size) return 0
  let communs = 0
  for (const t of a) if (b.has(t)) communs++
  const ratio = communs / a.size

  const ca = cotes(lesNôtres)
  const cb = cotes(page.nom)
  if (ca.length && cb.length && !ca.some((c) => cb.includes(c))) return 0
  // Un candidat sans cote ne peut pas être la bonne variante si la nôtre en a une.
  if (ca.length && !cb.length) return ratio * 0.5
  return ratio
}

async function main() {
  const marques = BRAND ? [BRAND] : Object.keys(CACHES)
  const where = BRAND ? { isActive: true, brand: BRAND } : { isActive: true }
  const produits = await prisma.product.findMany({
    where,
    select: { slug: true, nameDe: true, brand: true, ean: true, price: true },
    orderBy: { slug: 'asc' },
  })

  let poses = 0
  let sans = 0

  for (const marque of marques) {
    const pages = (CACHES[marque] ?? []).flatMap(charger)
    if (!pages.length) {
      console.log(`\n${marque} — aucun cache exploitable`)
      continue
    }
    const avecEan = pages.filter((p) => p.ean)

    console.log(
      `\n${'='.repeat(72)}\n${marque} — ${avecEan.length} articles en cache\n${'='.repeat(72)}`
    )

    const siens = produits.filter((p) => p.brand === marque)
    for (const p of siens) {
      if (p.ean) {
        console.log(`  · ${p.slug} — EAN déjà posé ${p.ean}`)
        continue
      }
      const nom = `${p.slug} ${p.nameDe ?? ''}`
      let meilleur = { p: null as Page | null, score: 0 }
      for (const page of avecEan) {
        const s = scorer(nom, page)
        if (s > meilleur.score) meilleur = { p: page, score: s }
      }
      if (!meilleur.p || meilleur.score < SEUIL) {
        sans++
        console.log(
          `  ✗ ${p.slug} — ${meilleur.score >= 0.5 ? `candidate à ${meilleur.score.toFixed(2)}` : 'aucune correspondance'}`
        )
        continue
      }
      console.log(`  ✓ ${p.slug}`)
      console.log(`      ${meilleur.p.nom.slice(0, 68)}`)
      console.log(
        `      EAN ${meilleur.p.ean}   prix fabricant ${meilleur.p.prix ?? '—'} EUR   score ${meilleur.score.toFixed(2)}`
      )

      if (!APPLY) continue
      await prisma.$transaction(async (tx) => {
        await tx.product.update({ where: { slug: p.slug }, data: { ean: meilleur.p!.ean } })
        await tx.auditLog.create({
          data: {
            entityType: 'Product',
            entityId: p.slug,
            action: 'EAN_CACHE',
            oldValues: { ean: null },
            newValues: {
              ean: meilleur.p!.ean,
              pageFabricant: meilleur.p!.nom,
              prixFabricant: meilleur.p!.prix,
              score: Number(meilleur.score.toFixed(2)),
            },
          },
        })
      })
      poses++
    }
  }

  console.log(`\nEAN posés : ${poses}   non rattachés : ${sans}`)
  if (!APPLY) console.log('Rien n’est écrit. Relisez, puis relancez avec --apply.')
  console.log(
    '\nChaque EAN posé rend le prochain relevé de prix exact : une recherche par code\n' +
      'barres ne peut pas confondre deux variantes, là où une recherche par nom le fait.'
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
