import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { prisma } from "@/lib/prisma"

const { handlers, auth } = NextAuth(authConfig)

export { handlers, auth }

// Alias for backward compatibility in tests
export { auth as getServerSession }

export async function getCurrentUser() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
      wishlist: {
        include: {
          product: true
        }
      }
    }
  })

  return user
}

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  
  return session
}
