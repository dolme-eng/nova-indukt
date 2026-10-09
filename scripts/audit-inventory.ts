/**
 * Inventaire pré-audit catalogue.
 *
 *   npx tsx scripts/audit-inventory.ts
 *   npx tsx scripts/audit-inventory.ts --json > inventory.json
 *
 * Produit une liste de travail triée par priorité. Ne modifie rien.
 *
 * Constat au 06/10/2026 : les 316 produits sont à 100 % sans EAN, alors que
 * le champ `Product.ean` existe et porte une contrainte d'unicité. Sans EAN,
 * aucun rapprochement automatique avec un tarif fournisseur n'est possible —
 * c'est le prérequis du contrôle des prix.
 *
 * Les détecteurs ci-dessous automatisent la recherche du défaut le plus
 * coûteux rencontré sur le catalogue : des articles réels distincts fusionnés
 * dans une seule fiche (variantes « hoch » / standard, « mit Glasdeckel » /
 * « mit Metalldeckel »), dont on ne peut vendre qu'une partie du stock.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient, Prisma } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const file of ['.env.local', '.env']) {
  loadEnv({ path: path.join(root, file) })
}

const prisma = new PrismaClient()
const asJson = process.argv.includes('--json')

/** Un EAN-13 : 13 chiffres,EAN valide. */
const EAN13 = /^\d{13}$/
const EAN8 = /^\d{8}$/

function eanChecksumIsValid(ean: string): boolean {
  if (!EAN13.test(ean)) return false
  const digits = ean.split('').map(Number)
  const check = digits.pop()!
  let sum = 0
  digits.forEach((d, i) => (sum += i % 2 === 0 ? d : d * 3))
  return (10 - (sum % 10)) % 10 === check
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[n]
}

/**
 * Retire les tokens qui distinguent une variante d'une autre.
 *
 * Les dimensions (24cm, 28cm…) sont CONSERVÉES : deux articles de la même
 * gamme en 24 et 28 cm sont légitimes et distincts. Les retirer produisait
 * 150 faux positifs.
 */
const VARIANT_TOKENS = [
  'hoch',
  'flach',
  'hoher',
  'tiefe',
  'gross',
  'klein',
  'mit',
  'glas',
  'glasdeckel',
  'metalldeckel',
  'gusseisen',
  'beschichtet',
  'unbeschichtet',
  'induktions',
  'induktion',
  'tlg',
  'liter',
]

function normalizeForMatching(name: string): string {
  return name
    .toLowerCase()
    .replace(/[®™]/g, '')
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !VARIANT_TOKENS.includes(t))
    .join(' ')
    .trim()
}

function maskDigits(s: string): string {
  return s.replace(/\d+/g, '#')
}

function digitsOf(s: string): string {
  return (s.match(/\d+/g) ?? []).join('-')
}

/** Contenances citées dans un texte, en litres (accepte « 6,3 L », « 6.3 Liter »). */
function capacitiesIn(text: string): number[] {
  const out: number[] = []
  const re = /(\d{1,2})[,.](\d)\s*(?:l\b|liter|litre)/gi
  for (const m of text.matchAll(re)) out.push(Number(`${m[1]}.${m[2]}`))
  const re2 = /(\d{1,2})\s*(?:l\b|liter|litre)/gi
  for (const m of text.matchAll(re2)) out.push(Number(m[1]))
  return [...new Set(out)].sort((a, b) => a - b)
}

type Finding = {
  slug: string
  name: string
  code: string
  detail: string
  weight: number
}

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      nameDe: true,
      shortDescription: true,
      descriptionDe: true,
      dimensions: true,
      ean: true,
      supplierSku: true,
      price: true,
      costPrice: true,
      isActive: true,
      brand: true,
      category: { select: { slug: true } },
      images: { select: { url: true }, take: 5 },
    },
    orderBy: { slug: 'asc' },
  })

  const findings: Finding[] = []

  // ── 1. EAN ────────────────────────────────────────────────────────────────
  for (const p of products) {
    if (!p.ean) {
      findings.push({
        slug: p.slug,
        name: p.nameDe,
        code: 'EAN_MANQUANT',
        detail: 'Pas d’EAN — rapprochement tarifaire fournisseur impossible',
        weight: 100,
      })
    } else if (EAN13.test(p.ean) && !eanChecksumIsValid(p.ean)) {
      findings.push({
        slug: p.slug,
        name: p.nameDe,
        code: 'EAN_INVALIDE',
        detail: `EAN ${p.ean} échoue à la clé de contrôle`,
        weight: 100,
      })
    }
  }

  // ── 2. Variantes fusionnées : contradiction dans la fiche ─────────────────
  for (const p of products) {
    const text = [p.nameDe, p.shortDescription, p.dimensions].filter(Boolean).join(' ')
    const nameCaps = capacitiesIn(p.nameDe)
    const dimCaps = capacitiesIn(p.dimensions ?? '')
    const descCaps = capacitiesIn(p.descriptionDe ?? '')

    // Le nom annonce une contenance, les dimensions en annoncent une autre.
    if (nameCaps.length && dimCaps.length) {
      const missing = nameCaps.filter((c) => !dimCaps.includes(c))
      if (missing.length) {
        findings.push({
          slug: p.slug,
          name: p.nameDe,
          code: 'CAPACITE_CONTRADICTOIRE',
          detail: `Nom annonce ${missing.join(', ')} L mais dimensions annoncent ${dimCaps.join(', ')} L`,
          weight: 95,
        })
      }
    }

    // Mention de variante dans le nom sans trace dans le reste de la fiche.
    const variantWords = ['hoch', 'flach', 'glasdeckel', 'metalldeckel']
    const inName = variantWords.filter((w) => p.nameDe.toLowerCase().includes(w))
    const elsewhere = text.toLowerCase() + (p.descriptionDe ?? '').toLowerCase()
    const unsupported = inName.filter(
      (w) =>
        (w === 'glasdeckel' || w === 'metalldeckel' ? elsewhere.includes(w) : false) === false &&
        w !== 'hoch' &&
        w !== 'flach'
    )
    if (unsupported.length) {
      findings.push({
        slug: p.slug,
        name: p.nameDe,
        code: 'VARIANTE_NON_ETAYEE',
        detail: `Nom mentionne « ${unsupported.join(' », « ')} » sans détail dans la description`,
        weight: 70,
      })
    }

    // Un set multi-pièces (Topfset 5-tlg) annonce légitimement plusieurs
    // contenances, une par pièce : on ne contrôle que les articles simples.
    if (descCaps.length === 1 && !dimCaps.length) {
      findings.push({
        slug: p.slug,
        name: p.nameDe,
        code: 'DIMENSIONS_INCOMPLETES',
        detail: `Contenance ${descCaps[0]} L dans la description mais pas dans les dimensions`,
        weight: 55,
      })
    }
  }

  // ── 3. Doublons et quasi-doublons ─────────────────────────────────────────
  const groups = new Map<string, typeof products>()
  for (const p of products) {
    const key = normalizeForMatching(p.nameDe)
    if (!key) continue
    const list = groups.get(key) ?? []
    list.push(p)
    groups.set(key, list)
  }
  for (const list of groups.values()) {
    if (list.length > 1) {
      for (const p of list) {
        findings.push({
          slug: p.slug,
          name: p.nameDe,
          code: 'DOUBLON_EXACT',
          detail: `Même base nominale que ${list.length - 1} autre(s) : ${list
            .filter((o) => o.id !== p.id)
            .map((o) => o.slug)
            .join(', ')}`,
          weight: 90,
        })
      }
    }
  }

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      // Les chiffres sont masqués AVANT comparaison : « 24cm » et « 28cm » ne
      // diffèrent que d'un caractère et donnaient une distance de 1, alors
      // que ce sont deux articles légitimes distincts. Ce qu'on cherche, c'est
      // une différence dans les MOTS : faute de frappe (« cocotte » /
      // « cocette ») ou variante fusionnée.
      const rawA = normalizeForMatching(products[i].nameDe)
      const rawB = normalizeForMatching(products[j].nameDe)
      const a = maskDigits(rawA)
      const b = maskDigits(rawB)
      if (!a || !b) continue
      // Les chiffres masqués doivent être IDENTIQUES : sinon la différence
      // vient d'un numéro de modèle ou d'une dimension, deux articles
      // réellement distincts (Siemens EX645LYC1E vs EX975LXC1E, 24cm vs 28cm).
      if (digitsOf(rawA) !== digitsOf(rawB)) continue
      if (Math.abs(a.length - b.length) > 3) continue
      const d = levenshtein(a, b)
      if (d >= 1 && d <= 2) {
        for (const [x, y] of [
          [products[i], products[j]],
          [products[j], products[i]],
        ] as const) {
          findings.push({
            slug: x.slug,
            name: x.nameDe,
            code: 'QUASI_DOUBLON',
            detail: `Distance ${d} avec ${y.slug} — faute probable ou variante fusionnée`,
            weight: 80,
          })
        }
      }
    }
  }

  // ── 4. Images ─────────────────────────────────────────────────────────────
  const imageOwners = new Map<string, string[]>()
  for (const p of products) {
    for (const img of p.images) {
      const key = img.url.split('/').slice(-2).join('/')
      imageOwners.set(key, [...(imageOwners.get(key) ?? []), p.slug])
    }
  }
  for (const p of products) {
    if (p.images.length === 0) {
      findings.push({
        slug: p.slug,
        name: p.nameDe,
        code: 'AUCUNE_IMAGE',
        detail: 'Produit sans image',
        weight: 90,
      })
    }

    // Même image référencée deux fois dans la même fiche : la galerie affiche
    // deux fois la même photo.
    const seen = new Set<string>()
    for (const img of p.images) {
      const key = img.url.split('/').slice(-2).join('/')
      if (seen.has(key)) {
        findings.push({
          slug: p.slug,
          name: p.nameDe,
          code: 'IMAGE_REPETEE',
          detail: `L'image ${key} est référencée plusieurs fois dans la même fiche`,
          weight: 72,
        })
      }
      seen.add(key)

      // Image utilisée par un autre produit : photos de produits différents.
      const others = [...new Set(imageOwners.get(key) ?? [])].filter((o) => o !== p.slug)
      if (others.length) {
        findings.push({
          slug: p.slug,
          name: p.nameDe,
          code: 'IMAGE_PARTAGEE',
          detail: `Image ${key} aussi utilisée par ${others.join(', ')}`,
          weight: 75,
        })
      }
    }
  }

  // ── 5. Prix sans coût d'achat ─────────────────────────────────────────────
  for (const p of products) {
    if (p.costPrice === null) {
      findings.push({
        slug: p.slug,
        name: p.nameDe,
        code: 'COUT_ACHAT_MANQUANT',
        detail: 'Aucun costPrice — la marge ne peut pas être vérifiée avant un recalage de prix',
        weight: 60,
      })
    }
  }

  // ── 6. Langue ─────────────────────────────────────────────────────────────
  for (const p of products) {
    const d = p.descriptionDe ?? ''
    // Phrase non allemande en fin de description (souvent copiée d'un site FR).
    const tail = d
      .split(/[.!?]\s+/)
      .slice(-3)
      .join(' ')
    if (/(l'excellence|parfait(?:e)?\s+pour|robuste et|légère|indestructible)/i.test(tail)) {
      findings.push({
        slug: p.slug,
        name: p.nameDe,
        code: 'TEXTE_NON_ALLEMAND',
        detail: `Fin de description en français : « ${tail.trim().slice(0, 80)} »`,
        weight: 50,
      })
    }
  }

  // ── Rapport ───────────────────────────────────────────────────────────────
  findings.sort((a, b) => b.weight - a.weight || a.slug.localeCompare(b.slug))

  const byCode = new Map<string, number>()
  for (const f of findings) byCode.set(f.code, (byCode.get(f.code) ?? 0) + 1)

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          totalProducts: products.length,
          summary: Object.fromEntries(byCode),
          findings,
        },
        null,
        2
      )
    )
    return
  }

  console.log(`\nInventaire catalogue — ${products.length} produits\n`)
  console.log('Couverture EAN :')
  const withEan = products.filter((p) => p.ean).length
  console.log(
    `  ${withEan}/${products.length} renseignés (${((withEan / products.length) * 100).toFixed(0)} %)\n`
  )

  console.log('Constats par type :')
  for (const [code, count] of [...byCode].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${code.padEnd(24)} ${count}`)
  }

  console.log(`\nTotal constats : ${findings.length}\n`)

  const grouped = new Map<string, Finding[]>()
  for (const f of findings) {
    if (f.weight < 60) continue
    grouped.set(f.code, [...(grouped.get(f.code) ?? []), f])
  }

  for (const [code, list] of grouped) {
    console.log(`\n━━━ ${code} (${list.length}) ━━━`)
    for (const f of list.slice(0, 12)) {
      console.log(`  ${f.slug}`)
      console.log(`      ${f.detail}`)
    }
    if (list.length > 12) console.log(`  … et ${list.length - 12} de plus`)
  }

  console.log(
    '\nCe rapport ne modifie rien. Pour corriger un produit, écrire un script\n' +
      'dans prisma/fixups/ — voir docs/AUDIT-PRODUITS.md.\n'
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
