import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const slugsToRemove = [
    'caso-igph-2300w-induktions-adapterplatte',
    'silit-induktions-adapterplatte-18cm',
    'ibili-induktions-adapterplatte-14-18cm',
    'bra-vitesse-adapterplatte-24cm',
    'caso-protect-mat-induktionsschutzmatte',
    'leifheit-kochfeld-silikon-schutzmatte',
    'wmf-cromargan-reinigungsset',
    'cerama-bryte-glaskeramik-reiniger-473ml',
    'komin-induktionstopf-diffusor-22cm',
    'ikea-365-induktions-herdschutzgitter',
    'wmf-function-4-topfset-5teilig',
    'fissler-intensa-topfset-5teilig'
  ];

  await prisma.product.deleteMany({
    where: { slug: { in: slugsToRemove } }
  });

  console.log('Deleted 12 products.');
  const count = await prisma.product.count();
  console.log('Products left in DB:', count);
}

main().finally(() => prisma.$disconnect());
