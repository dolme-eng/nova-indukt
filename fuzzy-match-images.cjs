const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true }
  });
  
  const productsDir = path.join(process.cwd(), 'public', 'images', 'products');
  if (!fs.existsSync(productsDir)) {
      console.log("Products directory not found");
      return;
  }
  
  const folders = fs.readdirSync(productsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const results = [];

  for (const product of products) {
    let bestMatch = null;
    let foundImages = [];
    
    // Check existing linked images
    for (const img of product.images) {
        if (fs.existsSync(path.join(process.cwd(), 'public', img.url))) {
            foundImages.push(img.url);
        }
    }

    if (foundImages.length === 0) {
        // Try to finding a folder by name
        // Strip special chars for comparison
        const cleanName = (n) => n.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = cleanName(product.nameDe);
        const targetId = cleanName(product.slug);
        
        bestMatch = folders.find(f => {
            const cf = cleanName(f);
            return cf.includes(target) || target.includes(cf) || cf.includes(targetId);
        });
        
        if (bestMatch) {
            const folderPath = path.join(productsDir, bestMatch);
            const files = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
            foundImages = files.map(f => `/images/products/${bestMatch}/${f}`);
        }
    }

    results.push({
      slug: product.slug,
      name: product.nameDe,
      currentCount: product.images.length,
      validCount: foundImages.length,
      bestMatchFolder: bestMatch,
      suggestedUrls: foundImages
    });
  }

  const broken = results.filter(r => r.validCount === 0);
  console.log(`Total Products: ${products.length}`);
  console.log(`Products with NO valid images: ${broken.length}`);
  
  if (broken.length > 0) {
      console.log("\nBroken Products:");
      broken.forEach(b => {
          console.log(` - ${b.slug} | ${b.name}`);
      });
  }

  const fixable = results.filter(r => r.validCount > 0 && r.currentCount !== r.validCount);
  console.log(`\nFixable Products (mismatch in count or broken path): ${fixable.length}`);
  fixable.forEach(f => {
      console.log(` - ${f.slug}: Found ${f.validCount} images in folder "${f.bestMatchFolder || 'existing'}"`);
  });
  
  // Save detailed fix plan
  fs.writeFileSync('fix-plan.json', JSON.stringify(results, null, 2));
}

main().finally(() => prisma.$disconnect());
