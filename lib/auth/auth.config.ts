import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt-ts"

// WebCrypto API based hash function (Edge Runtime compatible)
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify password - supports both legacy bcrypt and new salt:hash format
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Check if it's the new salt:hash format
    if (hashedPassword.includes(':')) {
      const [salt, storedHash] = hashedPassword.split(':')
      
      if (!salt || !storedHash) {
        return false
      }
      
      // Compute hash with the same salt using WebCrypto
      const computedHash = await sha256(password + salt)
      
      // Timing-safe comparison
      if (computedHash.length !== storedHash.length) {
        return false
      }
      
      // Constant-time comparison
      let result = 0
      for (let i = 0; i < computedHash.length; i++) {
        result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i)
      }
      return result === 0
    }
    // Legacy bcrypt format
    if (hashedPassword.startsWith('$2')) {
      return await compare(password, hashedPassword)
    }
    
    return false
  } catch {
    return false
  }
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
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  }
}
