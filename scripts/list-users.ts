import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        name: true
      }
    })
    console.log('--- USERS IN DATABASE ---')
    console.table(users)
    console.log('-------------------------')

    const products = await prisma.product.findMany({
      take: 5,
      select: {
        nameDe: true,
        images: {
          select: {
            url: true
          }
        }
      }
    })
    console.log('--- PRODUCT IMAGES (First 5) ---')
    products.forEach(p => {
      console.log(`Product: ${p.nameDe}`)
      console.log(`Images: ${p.images.map(img => img.url).join(', ')}`)
    })
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
