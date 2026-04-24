import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcrypt-ts"
import { Role } from "@prisma/client"

// Verify password - supports both legacy bcrypt and new bcrypt-ts format
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Legacy bcrypt format (starts with $2a$, $2b$, $2y$)
    if (hashedPassword.startsWith('$2')) {
      return await compare(password, hashedPassword)
    }
    
    // Unsupported format
    return false
  } catch {
    return false
  }
}

// Hash password using bcrypt-ts (Edge Runtime compatible)
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12) // 12 rounds = bon équilibre sécurité/performance
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await verifyPassword(
            credentials.password as string,
            user.password
          )

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/anmelden",
    signOut: "/",
    error: "/anmelden"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  trustHost: true // Required for Netlify and other serverless platforms
}
