const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt-ts');

const prisma = new PrismaClient();

async function main() {
  const password = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nova-indukt.de' },
    update: {
      password,
      role: 'ADMIN',
      name: 'Admin'
    },
    create: {
      email: 'admin@nova-indukt.de',
      password,
      name: 'Admin',
      role: 'ADMIN'
    }
  });
  console.log('Admin created:', admin.email);
}

main().finally(() => prisma.$disconnect());
