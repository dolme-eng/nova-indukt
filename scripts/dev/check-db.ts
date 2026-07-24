import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    }
  })
  
  const categories = await prisma.category.findMany()

  console.log(JSON.stringify({ categories, products }, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
