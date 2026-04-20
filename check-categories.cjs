const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  
  console.log(`Checking ${categories.length} categories...`);
  for (const cat of categories) {
    const fullPath = path.join(process.cwd(), 'public', cat.image);
    if (!fs.existsSync(fullPath)) {
      console.log(` - Category: ${cat.slug} -> Image missing: ${cat.image}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
