import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

const PERMISSION_KEYS = [
  "canManageApplications", "canManageTeachers", "canManageStudents", "canManageParents",
  "canManageClasses", "canManageCourses", "canManageSubjects", "canManageLessons",
  "canManageExams", "canManageAssignments", "canManageResults", "canManageAttendance", "canManageMessages",
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
  session: { strategy: "jwt", updateAge: 60 },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  cookies: {
    sessionToken: {
      name: 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
      },
    },
    callbackUrl: {
      name: 'next-auth-callback-url',
      options: {
        httpOnly: false, // Needs to be accessible client-side
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
      },
    },
  },
  providers: [
    ...(process.env.GOOGLE_AUTH_ENABLED === "true"
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })]
      : []),
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
            mustChangePassword: user.mustChangePassword,
            profileComplete: user.profileComplete,
            emailVerified: user.emailVerified ? new Date() : null,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email!
        const existing = await prisma.user.findUnique({
          where: { email },
          include: { school: { select: { slug: true } } },
        })

        if (existing) {
          // Link Google provider if not already linked
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              ...(!existing.provider ? { provider: "google", providerId: account.providerAccountId, image: user.image ?? existing.image } : {}),
            },
          })
          return true
        }

        // New Google user — create inactive user with incomplete profile
        // Google users are considered email verified since Google verifies their emails
        await prisma.user.create({
          data: {
            name: user.name ?? email.split("@")[0],
            email,
            provider: "google",
            providerId: account.providerAccountId,
            image: user.image,
            isActive: false,
            profileComplete: false,
            emailVerified: true,
            role: "student", // default, will be updated during profile completion
          },
        })
        return true
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role
        token.id = user.id!
        token.schoolId = (user as { schoolId?: string | null }).schoolId ?? null
        token.schoolSlug = (user as { schoolSlug?: string | null }).schoolSlug ?? null
        token.isActive = (user as { isActive: boolean }).isActive
        token.mustChangePassword = (user as { mustChangePassword?: boolean }).mustChangePassword ?? false
        token.profileComplete = (user as { profileComplete: boolean }).profileComplete ?? true
        token.emailVerified = (user as { emailVerified?: boolean }).emailVerified ? new Date() : null
      }

      // Refresh from DB on every JWT rotation to pick up changes
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: { school: { select: { slug: true, features: true } }, adminPermission: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.schoolId = dbUser.schoolId ?? null
          token.schoolSlug = dbUser.school?.slug ?? null
          token.isActive = dbUser.isActive
          token.mustChangePassword = dbUser.mustChangePassword
          token.profileComplete = dbUser.profileComplete
          token.emailVerified = dbUser.emailVerified ? new Date() : null
          token.adminLevel = dbUser.adminPermission?.level ?? null
          token.permissions = extractPermissions(dbUser.adminPermission as unknown as Record<string, unknown>)
          token.schoolFeatures = (dbUser.school?.features as Record<string, boolean>) ?? null
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
        session.user.mustChangePassword = (token.mustChangePassword as boolean) ?? false
        session.user.profileComplete = token.profileComplete as boolean
        session.user.emailVerified = (token.emailVerified as Date | null) ?? null
        session.user.adminLevel = (token.adminLevel as string) ?? null
        session.user.permissions = (token.permissions as string[]) ?? []
        session.user.schoolFeatures = (token.schoolFeatures as Record<string, boolean>) ?? null
      }
      return session
    },
  },
})
