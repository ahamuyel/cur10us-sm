"use client"

import { useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

/**
 * SessionGuard handles:
 * 1. Single session enforcement — if another login happened, this session is invalidated
 * 2. Auto-logout on browser close — uses sessionStorage flag (cleared when browser closes)
 *
 * Note: Session polling is handled by SessionProvider's refetchInterval.
 * This guard only checks for invalidSession flag on the session object.
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const checkedRef = useRef(false)

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
  // Only check once when session first becomes available
  useEffect(() => {
    if (status !== "authenticated" || !session || checkedRef.current) return
    checkedRef.current = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session as any).invalidSession) {
      signOut({ callbackUrl: "/signin?reason=session_expired" })
    }
  }, [session, status])

  return <>{children}</>
}

export default SessionGuard
