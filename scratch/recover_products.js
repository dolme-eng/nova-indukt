const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const productsDir = path.join(process.cwd(), 'public/images/products');

async function main() {
  console.log('🚀 Starting Product Recovery from Images...');

  // 1. Get categories to map them
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(c => {
    categoryMap[c.slug] = c.id;
  });

  const folders = fs.readdirSync(productsDir);
  console.log(`📂 Found ${folders.length} product folders.`);

  let count = 0;

  for (const folderName of folders) {
    const folderPath = path.join(productsDir, folderName);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    // Determine category based on name
    let categorySlug = 'kuechenhelfer-zubehoer';
    const nameLower = folderName.toLowerCase();
    
    if (nameLower.match(/pfanne|topf|herd|induktion|wok|bräter|schnellkochtopf|casserolle|cooker|stove|oven|herd/)) {
      categorySlug = 'kochen-braten';
    } else if (nameLower.match(/messer|schneidebrett|hobel|santoku|block|brett|klinge|knife/)) {
      categorySlug = 'messer-vorbereitung';
    }

    const categoryId = categoryMap[categorySlug];
    if (!categoryId) {
      console.warn(`⚠️  Category ${categorySlug} not found for ${folderName}`);
      continue;
    }

    // Generate slug
    const slug = folderName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Get images
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

    try {
      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          nameDe: folderName,
          slug,
          descriptionDe: `Hochwertiges Produkt: ${folderName}. Ideal für Ihre moderne Küche.`,
          shortDescription: `${folderName} - Premium Qualität von NOVA INDUKT.`,
          price: 99.99, // Placeholder
          stock: 50,
          initialStock: 100,
          isActive: true,
          categoryId,
          images: {
            create: imageFiles.map((file, index) => ({
              url: `/images/products/${encodeURIComponent(folderName)}/${file}`,
              alt: `${folderName} - Image ${index + 1}`,
              isMain: index === 0,
              sortOrder: index
            }))
          }
        }
      });
      count++;
      if (count % 10 === 0) console.log(`✅ Recovered ${count}/${folders.length}...`);
    } catch (err) {
      console.error(`❌ Error recovering ${folderName}:`, err.message);
    }
  }

  console.log(`\n🎉 Recovery Complete! ${count} products restored to database.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
