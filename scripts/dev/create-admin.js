const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcrypt-ts')

const prisma = new PrismaClient()

async function main() {
  const passwordInput = process.env.ADMIN_PASSWORD
  if (!passwordInput || passwordInput.length < 8) {
    console.error('Error: Set ADMIN_PASSWORD env var (min 8 chars). Example:')
    console.error('  ADMIN_PASSWORD=MySecure123! npx tsx scripts/dev/create-admin.js')
    process.exit(1)
  }

  const password = await hash(passwordInput, 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nova-indukt.de' },
    update: {
      password,
      role: 'ADMIN',
      name: 'Admin',
    },
    create: {
      email: 'admin@nova-indukt.de',
      password,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('Admin created:', admin.email)
}

main().finally(() => prisma.$disconnect())
