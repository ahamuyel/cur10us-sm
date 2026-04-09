"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

/**
 * SessionGuard handles:
 * 1. Single session enforcement — if another login happened, this session is invalidated
 * 2. Auto-logout on browser close — uses sessionStorage flag (cleared when browser closes)
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()

  // Auto-logout on browser close
  useEffect(() => {
    if (status !== "authenticated") return

    const SESSION_KEY = "cur10usx_session_alive"
    const isReturning = sessionStorage.getItem(SESSION_KEY)

    if (!isReturning) {
      // First load in this browser session — mark as alive
      sessionStorage.setItem(SESSION_KEY, "1")
    }

    // On page visibility change, check if we need to clean up
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

  // Periodic check for session validity (every 60s)
  useEffect(() => {
    if (status !== "authenticated") return

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()
        if (data?.invalidSession) {
          signOut({ callbackUrl: "/signin?reason=session_expired" })
        }
      } catch {
        // Network error, ignore
      }
    }, 60_000)

    return () => clearInterval(interval)
  }, [status])

  return <>{children}</>
}

export default SessionGuard
