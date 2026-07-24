const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const cats = await prisma.category.findMany({ select: { slug: true, image: true } })
  cats.forEach(c => console.log(c.slug + ': ' + c.image))
  await prisma.$disconnect()
}
main()
