import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const authPages = ["/signin", "/signup", "/forgot-password", "/reset-password", "/registar-escola", "/verify-email"]
const publicPaths = ["/", "/aplicacao", "/aplicacao/status", "/maintenance"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public paths — always accessible
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Check for session cookie existence (not the full session, to avoid Edge + Prisma issue)
  const hasSessionCookie = req.cookies.has("authjs.session-token")

  // Auth pages — redirect to minha-area if already logged in
  if (authPages.some((p) => pathname.startsWith(p))) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/minha-area", req.url))
    }
    return NextResponse.next()
  }

  // Not logged in — redirect to signin
  if (!hasSessionCookie) {
    const signinUrl = new URL("/signin", req.url)
    signinUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signinUrl)
  }

  // For authenticated users, let server-side handling take over
  // (session validation happens in API routes and page components)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
