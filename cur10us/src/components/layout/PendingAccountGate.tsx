"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Clock } from "lucide-react"

export default function PendingAccountGate({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()

  // Redirect Google users with incomplete profiles
  useEffect(() => {
    if (session?.user && !session.user.profileComplete) {
      router.replace("/complete-profile")
    }
  }, [session, router])

  if (session?.user && !session.user.profileComplete) {
    return null
  }

  // Show pending account screen for inactive users
  if (session?.user && !session.user.isActive && session.user.role !== "super_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Conta pendente</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            A sua conta ainda não foi activada. Para aceder à plataforma, envie uma solicitação de matrícula para uma escola.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/aplicacao"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition"
            >
              Solicitar matrícula
            </Link>
            <Link
              href="/aplicacao/status"
              className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Acompanhar solicitação
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
