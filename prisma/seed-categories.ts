const { PrismaClient } = require('@prisma/client')
import { categoriesConfig } from '../lib/data/categories'

const prisma = new PrismaClient()

// Single source of truth: lib/data/categories.ts (categoriesConfig).
// A previous hardcoded copy here was missing `induktionstoepfe` and
// `induktions-zubehoer`, so 55 of the 317 product seeds failed with
// "Catégorie introuvable" and `db:seed:all` exited 1.
const newCategories = categoriesConfig.map((c) => ({
  slug: c.slug,
  nameDe: c.nameDe,
  description: c.descriptionDe,
  image: c.image,
  sortOrder: c.sortOrder,
  isActive: c.isActive,
}))

async function main() {
  let created = 0
  let updated = 0
  let skipped = 0

  for (const cat of newCategories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })

    if (existing) {
      const changed =
        existing.nameDe !== cat.nameDe ||
        existing.description !== cat.description ||
        existing.image !== cat.image ||
        existing.sortOrder !== cat.sortOrder ||
        existing.isActive !== cat.isActive

      if (!changed) {
        console.log(`  = Déjà à jour : ${cat.slug}`)
        skipped++
        continue
      }

      await prisma.category.update({
        where: { slug: cat.slug },
        data: {
          nameDe: cat.nameDe,
          description: cat.description,
          image: cat.image,
          sortOrder: cat.sortOrder,
          isActive: cat.isActive,
        },
      })
      console.log(`  ~ Mis à jour : ${cat.slug}`)
      updated++
      continue
    }

    await prisma.category.create({ data: cat })
    created++
    console.log(`  + Créé : ${cat.slug} (${cat.nameDe}) [sortOrder ${cat.sortOrder}]`)
  }

  console.log(`\n📊 ${created} créées, ${updated} mises à jour, ${skipped} déjà à jour`)

  // Guard: every product seed resolves its category by slug. Fail loudly here
  // rather than letting 40 seed scripts each print "Catégorie introuvable".
  const slugs = new Set(newCategories.map((c) => c.slug))
  console.log(
    `   ${slugs.size} catégories disponibles : ${[...slugs].sort().join(', ')}`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
