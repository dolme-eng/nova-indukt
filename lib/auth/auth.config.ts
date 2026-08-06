import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare, hash } from 'bcrypt-ts'
import type { Role } from '@prisma/client'
import type { JWT } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

// Verify password - supports both legacy bcrypt and new bcrypt-ts format
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    if (hashedPassword.startsWith('$2')) {
      return await compare(password, hashedPassword)
    }
    return false
  } catch {
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize() {
        // Cette partie sera surchargée dans auth.ts
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
        // `user` ici est l'objet retourné par `authorize()` dans auth.ts
        // Il est correctement typé grâce à l'augmentation dans types/next-auth.d.ts
        token.role = (user as { role: Role }).role
        token.id = user.id
        token.tokenVersion = (user as unknown as { tokenVersion: number }).tokenVersion ?? 0
      }

      // Validate tokenVersion against DB (reject stale JWTs after password reset)
      if (token.id && token.tokenVersion !== undefined) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { tokenVersion: true },
          })
          if (dbUser && dbUser.tokenVersion !== token.tokenVersion) {
            // Token has been invalidated (password was reset)
            return {} as JWT
          }
        } catch {
          // Fail CLOSED in production: reject token if DB is unreachable
          if (process.env.NODE_ENV === 'production') {
            return {} as JWT
          }
          // In development, allow the token for availability
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Cast explicite nécessaire : NextAuth v5 beta type `token` comme JWT
        // mais n'infère pas toujours les champs augmentés (declare module)
        const typedToken = token as JWT
        session.user.id = typedToken.id
        session.user.role = typedToken.role
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
