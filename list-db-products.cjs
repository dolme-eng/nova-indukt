const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({
    select: { slug: true, nameDe: true }
  });
  products.forEach(p => console.log(`${p.slug} | ${p.nameDe}`));
}
main().finally(() => prisma.$disconnect());
