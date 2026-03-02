import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const authPages = ["/signin", "/signup", "/forgot-password", "/reset-password", "/registar-escola"]
const publicPaths = ["/", "/aplicacao", "/aplicacao/status"]

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Public paths — always accessible
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const isLoggedIn = !!req.auth

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
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
