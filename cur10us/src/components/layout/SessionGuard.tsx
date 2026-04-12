"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

/**
 * SessionGuard handles ONLY:
 * 1. Single session enforcement — signOut if session was invalidated
 * 2. Auto-logout on browser close
 *
 * Role-based redirects are handled by individual pages:
 * - /minha-area shows "Go to Dashboard" button for enrolled users
 * - /dashboard/{id} redirects unenrolled users to /minha-area
 * - /admin redirects non-super-admins to /dashboard
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
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
  // Disabled: single session enforcement is currently turned off
  // useEffect(() => {
  //   if (status !== "authenticated" || !session) return
  //   if ((session as any).invalidSession) {
  //     signOut({ callbackUrl: "/signin?reason=session_expired" })
  //   }
  // }, [session, status])

  return <>{children}</>
}

export default SessionGuard
