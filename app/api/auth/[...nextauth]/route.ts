import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/auth.config"

const { handlers, auth } = NextAuth(authConfig)

export { handlers as default, auth }
export const { GET, POST } = handlers
