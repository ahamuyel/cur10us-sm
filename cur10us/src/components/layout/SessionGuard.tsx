"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

/**
 * SessionGuard handles:
 * 1. Single session enforcement — if another login happened, this session is invalidated
 * 2. Auto-logout on browser close — uses sessionStorage flag (cleared when browser closes)
 * 3. Session state routing — redirects based on session state (mustChangePassword, emailVerified, etc.)
 *
 * Session polling is handled by SessionProvider's refetchInterval (60s).
 * This guard reacts to session state changes from that polling.
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Auto-logout on browser close
  useEffect(() => {
    if (status !== "authenticated") return

    const SESSION_KEY = "cur10usx_session_alive"
    const isReturning = sessionStorage.getItem(SESSION_KEY)

    if (!isReturning) {
      sessionStorage.setItem(SESSION_KEY, "1")
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        sessionStorage.setItem(SESSION_KEY, "1")
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [status])

  // Check if session was invalidated (another login happened)
  useEffect(() => {
    if (status !== "authenticated" || !session) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session as any).invalidSession) {
      signOut({ callbackUrl: "/signin?reason=session_expired" })
    }
  }, [session, status])

  // Route based on session state
  useEffect(() => {
    if (status !== "authenticated" || !session) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = session as any

    // Force password change if required
    if (s?.mustChangePassword && pathname !== "/change-password") {
      router.push("/change-password")
      return
    }

    // Redirect unverified users to verify email
    if (!s?.emailVerified && pathname !== "/verify-email") {
      router.push("/verify-email")
      return
    }

    // Redirect inactive/unenrolled users to minha-area (except super_admin and school_admin)
    const isSuperAdmin = s?.role === "super_admin"
    const isSchoolAdmin = s?.role === "school_admin"
    const isActive = s?.isActive
    const hasSchool = !!s?.schoolId
    const needsEnrollment = !isSuperAdmin && !isSchoolAdmin && (!isActive || !hasSchool)

    if (needsEnrollment && pathname !== "/minha-area" && pathname !== "/change-password") {
      router.push("/minha-area")
    }
  }, [session, status, pathname, router])

  return <>{children}</>
}

export default SessionGuard
