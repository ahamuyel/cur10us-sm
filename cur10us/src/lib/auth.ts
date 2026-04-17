import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { comparePassword } from "@/lib/password"
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
  session: { strategy: "jwt", updateAge: 60, maxAge: 24 * 60 * 60 },
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
      },
    },
    callbackUrl: {
      name: 'next-auth-callback-url',
      options: {
        httpOnly: false, // Needs to be accessible client-side
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
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

          const isValid = await comparePassword(password, user.hashedPassword)
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

        // New Google user — create active user with incomplete profile
        // Google users are considered email verified since Google verifies their emails
        // isActive: true because Google already verified the email
        await prisma.user.create({
          data: {
            name: user.name ?? email.split("@")[0],
            email,
            provider: "google",
            providerId: account.providerAccountId,
            image: user.image,
            isActive: true,
            profileComplete: false,
            emailVerified: true,
            role: "student", // default, will be updated during profile completion
          },
        })
        return true
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      // Never store picture/image in JWT — it can be a huge base64 string
      delete token.picture

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

      // Refresh from DB only on session update (every updateAge seconds), not every request
      if (trigger === "update" || !token.id) {
        if (token.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: {
              id: true, role: true, schoolId: true, isActive: true,
              mustChangePassword: true, profileComplete: true, emailVerified: true,
              school: { select: { slug: true, features: true } },
              adminPermission: { select: { level: true, ...Object.fromEntries(PERMISSION_KEYS.map(k => [k, true])) } },
            },
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
      }

      // Debug: log token size to find the bloat source
      const tokenStr = JSON.stringify(token)
      if (tokenStr.length > 2000) {
        const sizes = Object.entries(token).map(([k, v]) => [k, JSON.stringify(v).length]).sort((a, b) => (b[1] as number) - (a[1] as number))
        console.warn(`[AUTH DEBUG] JWT token is ${tokenStr.length} chars. Top fields by size:`, sizes.slice(0, 10))
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
