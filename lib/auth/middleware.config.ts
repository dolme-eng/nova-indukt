import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { Role } from '@prisma/client'
import { getRedis } from '@/lib/redis'

/**
 * Lightweight auth config for Edge middleware.
 * Uses Redis for tokenVersion validation (no Prisma in Edge).
 */
export const middlewareAuthConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize() {
        return null
      },
    }),
  ],
  pages: {
    signIn: '/anmelden',
    signOut: '/',
    error: '/anmelden',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role
        token.id = user.id
        token.tokenVersion = (user as unknown as { tokenVersion: number }).tokenVersion ?? 0

        // Store tokenVersion in Redis so middleware can validate without Prisma
        const redis = getRedis()
        if (redis && user.id) {
          try {
            await redis.set(`nova:tv:${user.id}`, String(token.tokenVersion), { ex: 30 * 24 * 3600 })
          } catch {
            // Redis write failure must not break login — revocation degrades
            // to DB check in auth.config.ts (fail-closed in production there)
          }
        }
      }

      // Validate tokenVersion against Redis on every request
      if (token.id && !user) {
        const redis = getRedis()
        if (redis) {
          try {
            const storedVersion = await redis.get(`nova:tv:${token.id}`)
            if (storedVersion !== null) {
              if (Number(storedVersion) !== (token.tokenVersion ?? 0)) {
                // tokenVersion mismatch — token has been revoked (e.g. password reset)
                return null
              }
            } else if (process.env.NODE_ENV === 'production') {
              // No baseline in Redis: fail closed, except for freshly minted
              // tokens (grace window covers a failed write on login above).
              const iat = typeof token.iat === 'number' ? token.iat * 1000 : 0
              if (Date.now() - iat > 5 * 60 * 1000) return null
            }
          } catch {
            // Redis read failure in production — fail closed (DB check in
            // auth.config.ts remains as second layer)
            if (process.env.NODE_ENV === 'production') return null
          }
        } else if (process.env.NODE_ENV === 'production') {
          // Redis must be configured in production for revocation to work — fail closed
          return null
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  basePath: '/api/auth',
  trustHost: process.env.TRUST_HOST === 'true',
}
