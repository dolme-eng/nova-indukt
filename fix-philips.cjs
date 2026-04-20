const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Fixing Philips Airfryer image link...");
  
  // Find the product
  const product = await prisma.product.findUnique({
    where: { slug: 'philips-hd9654-99-airfryer-xxl' },
    include: { images: true }
  });

  if (product) {
      // Delete old broken images
      await prisma.productImage.deleteMany({
          where: { productId: product.id }
      });

      // Add the valid one
      await prisma.productImage.create({
          data: {
              productId: product.id,
              url: '/images/products/PHILIPS HD965499 Airfryer XXL - Heißluftfritteuse/0.png',
              sortOrder: 0,
              isMain: true,
              alt: product.nameDe
          }
      });
      console.log("Updated Philips Airfryer image.");
  } else {
      console.log("Philips Airfryer not found.");
  }
}

main().finally(() => prisma.$disconnect());
