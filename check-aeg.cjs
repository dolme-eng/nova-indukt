const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.product.findUnique({
    where: { slug: 'aeg-ccb56400bw-induktionsherd-weiss' },
    include: { images: true }
  });
  console.log(JSON.stringify(p, null, 2));
}
main().finally(() => prisma.$disconnect());
