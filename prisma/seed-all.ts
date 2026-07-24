/**
 * Unified seed orchestrator.
 * Runs all seed files sequentially with a single Prisma connection.
 *
 * Usage: npx tsx prisma/seed-all.ts
 */
import { execSync } from 'child_process'

const seedFiles = [
  // Categories first
  'prisma/seed-categories.ts',
  // Products — all categories
  'prisma/seed-products-batch1.ts',
  'prisma/seed-products-batch2.ts',
  'prisma/seed-products-grillpfannen.ts',
  'prisma/seed-products-pfannen-extra.ts',
  'prisma/seed-products-toepfe.ts',
  'prisma/seed-products-toepfe-extra.ts',
  'prisma/seed-products-kasserollen.ts',
  'prisma/seed-products-schmortoepfe.ts',
  'prisma/seed-products-schnellkochtopfe.ts',
  'prisma/seed-products-schnellkochtopfe-extra.ts',
  'prisma/seed-products-sets.ts',
  'prisma/seed-products-sets-extra.ts',
  'prisma/seed-products-kochfelder.ts',
  'prisma/seed-products-kochfelder-2.ts',
  'prisma/seed-products-kochfelder-extra.ts',
  'prisma/seed-products-messer.ts',
  'prisma/seed-products-messer-extra.ts',
  'prisma/seed-products-ustensiles.ts',
  'prisma/seed-products-ustensiles-extra.ts',
  'prisma/seed-products-sauteusen.ts',
  'prisma/seed-products-sauteusen-extra.ts',
  'prisma/seed-products-crepe-pfannen.ts',
  'prisma/seed-products-crepe-extra.ts',
  'prisma/seed-products-formes-de-cuisson.ts',
  'prisma/seed-products-formes-extra.ts',
  'prisma/seed-products-fondues-raclette.ts',
  'prisma/seed-products-fondues-extra.ts',
  'prisma/seed-products-deckel-griffe.ts',
  'prisma/seed-products-deckel-extra.ts',
  'prisma/seed-products-pfannenschoner-topfregale.ts',
  'prisma/seed-products-pfannenschoner-extra.ts',
  'prisma/seed-products-elektrogeraete.ts',
  'prisma/seed-products-elektro-extra.ts',
  'prisma/seed-products-bestecke.ts',
  'prisma/seed-products-bestecke-extra.ts',
  'prisma/seed-products-reinigung-pflege.ts',
  'prisma/seed-products-reinigung-extra.ts',
  'prisma/seed-products-zubehoer.ts',
  'prisma/seed-products-zubehoer-extra.ts',
  'prisma/seed-products-dampfgarer.ts',
  'prisma/seed-products-thermometers.ts',
  // Blog
  'prisma/seed-blog-comprehensive.ts',
]

console.log(`\n🌱 Running ${seedFiles.length} seed files...\n`)

let success = 0
let failed = 0

for (const file of seedFiles) {
  try {
    console.log(`▶ ${file}`)
    execSync(`npx tsx ${file}`, { stdio: 'pipe', timeout: 60_000 })
    success++
  } catch (e: any) {
    console.error(`  ✗ FAILED: ${file}`)
    if (e.stderr) console.error(e.stderr.toString().slice(0, 200))
    failed++
  }
}

console.log(`\n✅ Done: ${success} succeeded, ${failed} failed out of ${seedFiles.length}\n`)
process.exit(failed > 0 ? 1 : 0)
