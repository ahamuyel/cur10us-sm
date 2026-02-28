import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const authPages = ["/signin", "/signup", "/forgot-password", "/reset-password"]
const publicPaths = ["/", "/aplicacao", "/aplicacao/status", "/complete-profile"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public paths — always accessible
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Check for session token cookie (set by Auth.js)
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value

  const isLoggedIn = !!token

  // Auth pages — redirect to dashboard if already logged in
  if (authPages.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  // Dashboard pages — redirect to signin if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
