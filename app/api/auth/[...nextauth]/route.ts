import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/auth.config"

const { handlers, auth } = NextAuth(authConfig)

// Next.js App Router requires named exports for each HTTP method
export const { GET, POST } = handlers
