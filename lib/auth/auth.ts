import NextAuth from "next-auth"
import { authConfig, verifyPassword } from "./auth.config"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { isLockedOut, recordFailedLogin, recordSuccessfulLogin } from "./login-lockout"

const { handlers, auth, signOut, signIn } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string

        try {
          // Check brute-force lockout
          if (await isLockedOut(email)) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.password) {
            await recordFailedLogin(email)
            return null
          }

          const isValid = await verifyPassword(
            credentials.password as string,
            user.password
          )

          if (!isValid) {
            await recordFailedLogin(email)
            return null
          }

          // Check if email is verified
          if (!user.emailVerified) {
            return null
          }

          await recordSuccessfulLogin(email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error("Auth error in authorize:", error)
          return null
        }
      }
    })
  ]
})

export { handlers, auth, signOut, signIn }

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
