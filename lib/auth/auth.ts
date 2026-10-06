import NextAuth from 'next-auth'
import { authConfig, verifyPassword } from './auth.config'
import { prisma } from '@/lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import { isIpLockedOut, isLockedOut, recordFailedLogin, recordSuccessfulLogin } from './login-lockout'
import { logError } from '@/lib/logger'
import { loginSchema } from '@/lib/validations/auth'
import { getIP } from '@/lib/rate-limit'

/**
 * A valid bcrypt hash of a value nobody knows. Comparing against it on the
 * "account does not exist" path keeps the timing identical to a real
 * verification, so response time cannot be used to enumerate accounts.
 * Never matches, because the submitted password cannot be empty here (zod
 * requires min length) and this hash was produced for a fixed dummy string.
 */
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.7bYhZ0Z8k4r8bQ0m4z1KqF8Z1cO7J6'

const { handlers, auth, signOut, signIn } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, request) {
        // Zod gate: rejects malformed input AND caps password length
        // (bcrypt CPU-DoS) before any DB/crypto work
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        })
        if (!parsed.success) return null

        const email = parsed.data.email.toLowerCase()
        // Second lockout axis: without it, 5 wrong passwords from anyone were
        // enough to lock an arbitrary customer out of their own account.
        const ip = request ? getIP(request) : undefined

        try {
          // Check brute-force lockout (per-account AND per-address)
          if (await isLockedOut(email, ip) || (ip && (await isIpLockedOut(ip)))) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            // Compare against a dummy hash so the response time does not
            // reveal whether the account exists (user enumeration).
            await verifyPassword(parsed.data.password, DUMMY_HASH)
            await recordFailedLogin(email, ip)
            return null
          }

          const isValid = await verifyPassword(parsed.data.password, user.password)

          if (!isValid) {
            await recordFailedLogin(email, ip)
            return null
          }

          // Check if email is verified
          if (!user.emailVerified) {
            await recordFailedLogin(email, ip)
            return null
          }

          await recordSuccessfulLogin(email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tokenVersion: user.tokenVersion,
          }
        } catch (error) {
          logError('Auth error in authorize:', error)
          return null
        }
      },
    }),
  ],
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
          product: true,
        },
      },
    },
  })

  return user
}

export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  return session
}
