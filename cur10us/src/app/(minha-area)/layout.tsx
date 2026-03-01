"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"
import ThemeToggle from "@/components/ui/ThemeToggle"

export default function MinhaAreaLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-zinc-950">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span>
          </span>

          <div className="flex items-center gap-2">
            {session?.user?.name && (
              <span className="text-sm text-zinc-600 dark:text-zinc-400 hidden sm:block">
                {session.user.name}
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="p-2 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
