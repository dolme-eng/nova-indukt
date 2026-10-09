/**
 * Applique les corrections de l'audit produit sans passer par le seed complet.
 *
 * Le site en ligne lit PostgreSQL ; modifier `prisma/seed-*.ts` n'a aucun effet
 * tant que la base n'est pas mise à jour. Ce script applique les mêmes
 * corrections que le seed, de façon idempotente et transactionnelle.
 *
 *   npx tsx prisma/fixups/001-fissler-opc-kochtopf-24cm.ts
 *   npx tsx prisma/fixups/001-fissler-opc-kochtopf-24cm.ts --dry-run
 *
 * Le SQL brut correspondant est dans prisma/fixups/001-fissler-opc-kochtopf-24cm.sql
 * (utile pour un `psql` ou un rollback transactionnel).
 */

import { PrismaClient } from '@prisma/client'
import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Prisma/tsx ne chargent pas les fichiers .env : sans cela le script échoue
// avec "Environment variable not found: DATABASE_URL". `.env.local` est chargé
// en premier et dotenv n'écrase pas les variables déjà définies, ce qui
// reproduit la précédence de Next.js.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
for (const file of ['.env.local', '.env']) {
  loadEnv({ path: path.join(root, file) })
}

const prisma = new PrismaClient()

const SLUG = 'fissler-original-profi-collection-kochtopf-24cm'

/**
 * EAN 4009209379890 = *hoher* Kochtopf 24 cm / 9,1 L, tarif fabricant 239,00 €.
 * Lu dans le nom du fichier image officiel et confirmé par le tableau
 * `variants` sur fissler.com.
 *
 * La variante 6,3 L porte l'EAN 4009209379937 pour 149,00 € : c'est un autre
 * article, ce n'est pas celui-ci.
 */
const EAN = '4009209379890'

const DRY_RUN = process.argv.includes('--dry-run')

/**
 * Le prix reste à 199,00 €. Un premier passage retenait 129,00 €, calculé sur
 * le marché de la variante 6,3 L ; l'appliquer ici'aurait été une remise de
 * 46 % sur un article plus grand, sans `costPrice` pour le justifier.
 */
const FIX = {
  ean: EAN,
  nameDe: 'Fissler Original Profi Collection hoher Kochtopf 24 cm',
  shortDescription: 'Hoher Profikochtopf aus massivem Edelstahl mit CookStar® Allherdboden - 9,1 L',
  dimensions: 'Ø 24 cm, Höhe 21,5 cm, 9,1 Liter',
  weightKg: 3.54,
  price: 199.0,
  oldPrice: 239.0,
  metaDescription:
    'Fissler Original Profi Collection hoher Kochtopf 24 cm (9,1 L, Metalldeckel). Inox 18/10, CookStar-Boden, induktionsgeeignet. Hergestellt in Deutschland.',
  descriptionDe: `Der Fissler Original Profi Collection Kochtopf (24 cm) ist die absolute Referenz in deutschen Profiküchen. Hergestellt aus extrem dickwandigem, mattiertem Edelstahl 18/10, ist dieser Topf extrem robust, langlebig und perfekt auf moderne Induktionskochfelder abgestimmt.

**Merkmale:**
- CookStar® Allherdboden (7,2 mm) für perfekte Planstabilität und maximale Energieeffizienz auf Induktion
- Hochwertiger, schwerer Edelstahl 18/10 (mattiert) - kratz- und wasserfleckenresistent
- Kaltmetallgriffe: bleiben auf dem Herd spürbar kühler
- Kondensat-Plus-Funktion im Metalldeckel für saftigeres Kochgut
- Messskala an der Topfinnenseite & extra breiter Schüttrand
- Backofengeeignet bis 230 °C
- Hergestellt in Deutschland (Made in Germany)

Indestructible, lourd et thermiquement parfait - l'excellence absolue de Fissler.`,
}

/** Champs scalaires comparés avant/après — les textes longs ne sont pas relus. */
const COMPARED_FIELDS = [
  'ean',
  'nameDe',
  'shortDescription',
  'dimensions',
  'weightKg',
  'price',
  'oldPrice',
] as const

async function main() {
  const before = await prisma.product.findUnique({
    where: { slug: SLUG },
    select: {
      id: true,
      ean: true,
      nameDe: true,
      shortDescription: true,
      dimensions: true,
      weightKg: true,
      price: true,
      oldPrice: true,
    },
  })

  if (!before) {
    console.error(`✖ Produit "${SLUG}" introuvable. Lancez d'abord le seed.`)
    process.exitCode = 1
    return
  }

  // L'EAN est @unique : s'il est déjà pris par un autre produit, l'UPDATE
  // échouerait sur la contrainte avec une erreur peu lisible.
  const clash = await prisma.product.findFirst({
    where: { ean: EAN, NOT: { slug: SLUG } },
    select: { slug: true },
  })
  if (clash) {
    console.error(`✖ EAN ${EAN} déjà attribué à "${clash.slug}" — arrêt.`)
    process.exitCode = 1
    return
  }

  console.log(`\nFiche: ${before.nameDe}`)
  console.log(`EAN   : ${before.ean ?? '(aucun)'}  →  ${EAN}`)
  console.log(`Nom   : ${before.nameDe}`)
  console.log(`Prix  : ${before.price} €  →  ${FIX.price} €  (fabricant 239,00 €)`)
  console.log(`Dim.  : ${before.dimensions ?? '(vide)'}  →  ${FIX.dimensions}`)
  console.log(`Poids : ${before.weightKg ?? '(vide)'} kg  →  ${FIX.weightKg} kg\n`)

  /** Prisma renvoie Decimal pour price/weightKg : comparaison sur la valeur. */
  const same = (a: unknown, b: unknown) => a === b || String(a ?? '') === String(b ?? '')

  const alreadyApplied = COMPARED_FIELDS.every((field) => same(before[field], FIX[field]))

  if (alreadyApplied) {
    console.log('✓ Aucune correction à appliquer (déjà à jour).')
    return
  }

  if (DRY_RUN) {
    console.log('--dry-run : aucune écriture effectuée.')
    return
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({ where: { slug: SLUG }, data: FIX })

    await tx.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Product',
        entityId: before.id,
        newValues: { ...FIX, source: 'product-audit-001' },
        oldValues: {
          ean: before.ean,
          nameDe: before.nameDe,
          dimensions: before.dimensions,
          weightKg: before.weightKg?.toString() ?? null,
          price: before.price.toString(),
          oldPrice: before.oldPrice?.toString() ?? null,
        },
      },
    })
  })

  const images = await prisma.productImage.findMany({
    where: { product: { slug: SLUG } },
    orderBy: { sortOrder: 'asc' },
    select: { url: true, isMain: true },
  })

  console.log(`✓ Fiche corrigée (${Object.keys(FIX).length} champs) + AuditLog écrit.`)
  console.log(`  ${images.length} image(s) associée(s) :`)
  for (const img of images) {
    console.log(`    ${img.isMain ? '[principale] ' : '            '}${img.url}`)
  }
  console.log(
    '\nℹ Les images ont été remplacées par le visuel officiel du fabricant\n' +
      '  (scripts/fissler-sync.ts import). Si aucune image Cloudinary\n' +
      "  n'est listée ci-dessus, relancer cet import."
  )
}

main()
  .catch((error) => {
    console.error('✖ Échec de la correction :', error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
