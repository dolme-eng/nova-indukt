const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const total = await prisma.product.count()
  console.log('Total products:', total)
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' }
  })
  console.log('\nProducts per category:')
  let sum = 0
  for (const c of categories) {
    const n = c._count.products
    sum += n
    console.log(`  ${c.slug}: ${n}`)
  }
  console.log(`\nSum: ${sum}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
