import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { Role } from '@prisma/client'

/**
 * Lightweight auth config for Edge middleware.
 * NO prisma, NO bcrypt — only JWT validation and role checks.
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
