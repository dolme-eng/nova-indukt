const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const slugs = [
    'philips-hd9654-99-airfryer-xxl',
    'roesle-silicone-kuechenhelfer-set-5-teilig',
    'global-g2-kochmesser-20cm-cromova',
    'silit-stielkasserolle-16cm-silargan'
  ];
  for (const slug of slugs) {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { images: true }
    });
    console.log(`Product: ${slug}`);
    console.log(JSON.stringify(p, null, 2));
  }
}
main().finally(() => prisma.$disconnect());
