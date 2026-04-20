const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  const linkedFolders = new Set();
  
  const productImages = await prisma.productImage.findMany();
  productImages.forEach(img => {
      // Extract folder name from path like /images/products/FolderName/File.jpg
      const parts = img.url.split('/');
      if (parts.length >= 4) {
          linkedFolders.add(parts[3]);
      }
  });

  const allFolders = fs.readdirSync(path.join(process.cwd(), 'public', 'images', 'products'), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const unlinked = allFolders.filter(f => !linkedFolders.has(f));

  console.log("Unlinked folders in public/images/products:");
  unlinked.forEach(f => console.log(` - ${f}`));
  
  console.log("\nProducts with missing folders (from previous report):");
  // I'll manually list the ones I know or re-run the check logic but I'll just print unlinked first.
}

main().finally(() => prisma.$disconnect());
