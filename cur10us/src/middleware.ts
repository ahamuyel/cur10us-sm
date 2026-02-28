import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const authPages = ["/signin", "/signup", "/forgot-password", "/reset-password"]
const publicPaths = ["/", "/api/"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public paths — always accessible
  if (publicPaths.some((p) => pathname === p || pathname.startsWith("/api/"))) {
    return NextResponse.next()
  }

  // Auth pages — redirect to dashboard if already logged in
  if (authPages.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.next()
  }

  // Dashboard pages — redirect to signin if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
