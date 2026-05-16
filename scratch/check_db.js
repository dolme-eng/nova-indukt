const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const productCount = await prisma.product.count()
  const activeProductCount = await prisma.product.count({ where: { isActive: true } })
  const categoryCount = await prisma.category.count()
  
  console.log('--- Database Status ---')
  console.log(`Total Products: ${productCount}`)
  console.log(`Active Products: ${activeProductCount}`)
  console.log(`Total Categories: ${categoryCount}`)
  
  if (productCount > 0) {
    const sample = await prisma.product.findFirst({
      select: { nameDe: true, isActive: true, categoryId: true }
    })
    console.log('Sample Product:', sample)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
