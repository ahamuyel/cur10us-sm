import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

const PERMISSION_KEYS = [
  "canManageApplications", "canManageTeachers", "canManageStudents", "canManageParents",
  "canManageClasses", "canManageCourses", "canManageSubjects", "canManageLessons",
  "canManageExams", "canManageResults", "canManageAttendance", "canManageMessages",
  "canManageAnnouncements", "canManageAdmins",
] as const

function extractPermissions(perm: Record<string, unknown> | null): string[] {
  if (!perm) return []
  return PERMISSION_KEYS.filter((key) => perm[key] === true)
}

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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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

          // Block inactive users (except super_admin and school_admin who see PendingAccountGate)
          if (!user.isActive && user.role !== "super_admin" && user.role !== "school_admin") return null

          // Google-only user trying to login with password
          if (!user.hashedPassword) return null

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
            profileComplete: user.profileComplete,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email!
        const existing = await prisma.user.findUnique({
          where: { email },
          include: { school: { select: { slug: true } } },
        })

        if (existing) {
          // Link Google provider if not already linked
          if (!existing.provider) {
            await prisma.user.update({
              where: { id: existing.id },
              data: { provider: "google", providerId: account.providerAccountId, image: user.image ?? existing.image },
            })
          }
          // Block inactive users (except super_admin and school_admin)
          if (!existing.isActive && existing.role !== "super_admin" && existing.role !== "school_admin") {
            // Allow Google users with incomplete profile to sign in (they need to complete it)
            if (!existing.profileComplete) return true
            return false
          }
          return true
        }

        // New Google user — create inactive user with incomplete profile
        await prisma.user.create({
          data: {
            name: user.name ?? email.split("@")[0],
            email,
            provider: "google",
            providerId: account.providerAccountId,
            image: user.image,
            isActive: false,
            profileComplete: false,
            role: "student", // default, will be updated during profile completion
          },
        })
        return true
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        // Credentials login — user object already has all fields
        token.role = (user as { role: string }).role
        token.id = user.id!
        token.schoolId = (user as { schoolId?: string | null }).schoolId ?? null
        token.schoolSlug = (user as { schoolSlug?: string | null }).schoolSlug ?? null
        token.isActive = (user as { isActive: boolean }).isActive
        token.profileComplete = (user as { profileComplete: boolean }).profileComplete ?? true
      }

      // For Google sign-ins, the user object from signIn doesn't have our custom fields
      // Also refresh on session update trigger
      if ((token.role === undefined || trigger === "signIn" || trigger === "update") && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: { school: { select: { slug: true } }, adminPermission: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.schoolId = dbUser.schoolId ?? null
          token.schoolSlug = dbUser.school?.slug ?? null
          token.isActive = dbUser.isActive
          token.profileComplete = dbUser.profileComplete
          token.adminLevel = dbUser.adminPermission?.level ?? null
          token.permissions = extractPermissions(dbUser.adminPermission as unknown as Record<string, unknown>)
        }
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
        session.user.profileComplete = token.profileComplete as boolean
        session.user.adminLevel = (token.adminLevel as string) ?? null
        session.user.permissions = (token.permissions as string[]) ?? []
      }
      return session
    },
  },
})
