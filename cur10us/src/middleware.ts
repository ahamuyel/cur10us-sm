import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const authPages = ["/signin", "/signup", "/forgot-password", "/reset-password", "/registar-escola", "/verify-email"]
const publicPaths = ["/", "/aplicacao", "/aplicacao/status", "/maintenance"]

export const middleware = auth(async function middleware(req) {
  const { pathname } = req.nextUrl
  const session = req.auth

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = session as any

  // Public paths — always accessible
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const isLoggedIn = !!session

  // Auth pages — redirect to minha-area if already logged in
  if (authPages.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/minha-area", req.url))
    }
    return NextResponse.next()
  }

  // Not logged in — redirect to signin
  if (!isLoggedIn) {
    const signinUrl = new URL("/signin", req.url)
    signinUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signinUrl)
  }

  // Session validation — check for invalidated sessions
  if (s?.invalidSession) {
    const signinUrl = new URL("/signin", req.url)
    signinUrl.searchParams.set("reason", "session_expired")
    return NextResponse.redirect(signinUrl)
  }

  // Force password change if required
  if (s?.mustChangePassword && pathname !== "/change-password") {
    return NextResponse.redirect(new URL("/change-password", req.url))
  }

  // Redirect unverified users to verify email
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(s as any)?.emailVerified && pathname !== "/verify-email") {
    return NextResponse.redirect(new URL("/verify-email", req.url))
  }

  // Redirect inactive/unenrolled users to minha-area (except super_admin and school_admin)
  const isSuperAdmin = s?.role === "super_admin"
  const isSchoolAdmin = s?.role === "school_admin"
  const isActive = s?.isActive
  const hasSchool = !!s?.schoolId
  const needsEnrollment = !isSuperAdmin && !isSchoolAdmin && (!isActive || !hasSchool)

  if (needsEnrollment && pathname !== "/minha-area" && pathname !== "/change-password") {
    return NextResponse.redirect(new URL("/minha-area", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
