const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true }
  });

  let missing = [];
  let noImages = [];
  let totalImages = 0;

  for (const product of products) {
    if (product.images.length === 0) {
      noImages.push(product.slug);
      continue;
    }
    for (const image of product.images) {
      totalImages++;
      // image.url is like "/images/products/..." or "https://..."
      if (image.url.startsWith('/')) {
        const fullPath = path.join(process.cwd(), 'public', image.url);
        if (!fs.existsSync(fullPath)) {
          missing.push({ product: product.slug, url: image.url });
        }
      }
    }
  }

  console.log(`Checked ${totalImages} images for ${products.length} products.`);
  if (missing.length > 0) {
    console.log(`Found ${missing.length} missing local images:`);
    missing.forEach(m => console.log(` - Product: ${m.product} -> Image: ${m.url}`));
  }
  if (noImages.length > 0) {
    console.log(`Found ${noImages.length} products with NO images:`);
    noImages.forEach(slug => console.log(` - Product: ${slug}`));
  }
  if (missing.length === 0 && noImages.length === 0) {
    console.log("All products have valid image links!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect() && process.exit(0));
