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
          await redis.set(`nova:tv:${user.id}`, String(token.tokenVersion), { ex: 30 * 24 * 3600 })
        }
      }

      // Validate tokenVersion against Redis on every request
      if (token.id && !user) {
        const redis = getRedis()
        if (redis) {
          const storedVersion = await redis.get(`nova:tv:${token.id}`)
          if (storedVersion !== null && Number(storedVersion) !== (token.tokenVersion ?? 0)) {
            // tokenVersion mismatch — token has been revoked (e.g. password reset)
            return null
          }
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
