import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const authPages = ["/signin", "/signup", "/forgot-password", "/reset-password", "/registar-escola"]
const publicPaths = ["/", "/aplicacao", "/aplicacao/status", "/maintenance"]

// Paths accessible even during maintenance (login so super_admin can authenticate)
const maintenanceExemptPaths = ["/maintenance", "/signin", "/api/platform/status", "/api/auth"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // === Maintenance Mode Gate ===
  const isMaintenanceExempt = maintenanceExemptPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )

  if (!isMaintenanceExempt) {
    // Decode JWT (fast, no DB call) — null if not logged in
    const jwt = await getToken({ req, secret: process.env.AUTH_SECRET })

    // Only check maintenance for non-super_admin users
    if (jwt?.role !== "super_admin") {
      try {
        const statusUrl = new URL("/api/platform/status", req.url)
        const statusRes = await fetch(statusUrl, { cache: "no-store" })
        const { maintenanceMode } = await statusRes.json()

        if (maintenanceMode) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { error: "Plataforma em manutenção" },
              { status: 503 }
            )
          }
          return NextResponse.redirect(new URL("/maintenance", req.url))
        }
      } catch {
        // If status check fails, allow through gracefully
      }
    }
  }

  // === Normal Auth Logic ===
  // Public paths — always accessible
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Check for session token cookie (set by Auth.js)
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value

  const isLoggedIn = !!sessionCookie

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
