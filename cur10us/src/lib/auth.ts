import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const email = credentials.email as string
          const password = credentials.password as string

          if (!email || !password) return null

          const user = await prisma.user.findUnique({
            where: { email },
            include: { school: { select: { slug: true } } },
          })
          if (!user) return null

          // Block inactive users (except super_admin who is always active)
          if (!user.isActive && user.role !== "super_admin") return null

          const isValid = await compare(password, user.hashedPassword)
          if (!isValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            schoolId: user.schoolId,
            schoolSlug: user.school?.slug ?? null,
            isActive: user.isActive,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role
        token.id = user.id!
        token.schoolId = (user as { schoolId?: string | null }).schoolId ?? null
        token.schoolSlug = (user as { schoolSlug?: string | null }).schoolSlug ?? null
        token.isActive = (user as { isActive: boolean }).isActive
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        session.user.schoolId = (token.schoolId as string) ?? null
        session.user.schoolSlug = (token.schoolSlug as string) ?? null
        session.user.isActive = token.isActive as boolean
      }
      return session
    },
  },
})
