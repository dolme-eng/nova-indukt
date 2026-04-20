import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// WebCrypto API based hash function (Edge Runtime compatible)
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function createAdmin() {
  const email = 'admin@nova-indukt.de'
  const password = 'AdminPassword2024!' // Changez-le après la première connexion
  const salt = uuidv4()
  const hash = await sha256(password + salt)
  const hashedPassword = `${salt}:${hash}`

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Administrator'
      },
      create: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Administrator'
      }
    })
    console.log('--- ADMIN ACCOUNT ---')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('Role: ADMIN')
    console.log('---------------------')
    console.log('Successfully created/updated admin account.')
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
