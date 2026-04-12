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
  // Auth.js v5 uses "authjs.session-token" by default
  // Fallback to legacy "next-auth.session-token" if needed
  const hasSessionCookie = 
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("next-auth.session-token") ||
    // Fallback: check if ANY cookie contains "session" 
    Array.from(req.cookies.getAll()).some(c => c.name.includes("session"))

  // Auth pages — redirect to minha-area if already logged in
  if (authPages.some((p) => pathname.startsWith(p))) {
    if (hasSessionCookie) {
      // Check if there's a stored callback URL from OAuth flow (priority over default redirect)
      const storedCallbackUrl = req.cookies.get("next-auth-callback-url")?.value
      if (storedCallbackUrl && storedCallbackUrl.startsWith("/")) {
        const response = NextResponse.redirect(new URL(storedCallbackUrl, req.url))
        // Clear the cookie after using it
        response.cookies.set("next-auth-callback-url", "", { maxAge: 0, path: "/" })
        return response
      }
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

// Update matcher to ensure middleware doesn't interfere with Next.js internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|_next/font|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
