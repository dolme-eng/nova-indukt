import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare, hash } from "bcrypt-ts"
import type { Role } from "@prisma/client"
import type { JWT } from "next-auth/jwt"

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
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize() {
        // Cette partie sera surchargée dans auth.ts
        return null
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
        // `user` ici est l'objet retourné par `authorize()` dans auth.ts
        // Il est correctement typé grâce à l'augmentation dans types/next-auth.d.ts
        token.role = (user as { role: Role }).role
        token.id = user.id
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
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  basePath: "/api/auth",
  trustHost: true
}
