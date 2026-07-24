const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany({ select: { slug: true, image: true } })
  cats.forEach(c => console.log(`${c.slug}: ${c.image}`))
  
  // Update all categories to use correct image paths from categoriesConfig
  const { categoriesConfig } = require('../lib/data/categories')
  
  for (const cfg of categoriesConfig) {
    const existing = await prisma.category.findUnique({ where: { slug: cfg.slug } })
    if (existing && existing.image !== cfg.image) {
      await prisma.category.update({
        where: { slug: cfg.slug },
        data: { image: cfg.image }
      })
      console.log(`UPDATED ${cfg.slug}: ${existing.image} -> ${cfg.image}`)
    }
  }
  
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
