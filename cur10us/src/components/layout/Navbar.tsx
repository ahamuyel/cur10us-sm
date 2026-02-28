"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Search,
  MessageCircle,
  Megaphone,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ThemeToggle from "@/components/ui/ThemeToggle"

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  school_admin: "Administrador",
  teacher: "Professor",
  student: "Aluno",
  parent: "Responsável",
}

const NavBar = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: session } = useSession()

  const userName = session?.user?.name || "Usuário"
  const userRole = session?.user?.role || ""

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md gap-2">

      {/* MOBILE SEARCH OVERLAY */}
      {searchOpen && (
        <div className="md:hidden absolute inset-0 z-50 flex items-center px-3 bg-white dark:bg-zinc-950">
          <Search size={16} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar..."
            autoFocus
            className="flex-1 px-3 py-2 bg-transparent outline-none text-sm text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X size={18} className="text-zinc-500" />
          </button>
        </div>
      )}

      {/* DESKTOP SEARCH */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 focus-within:border-indigo-500 transition flex-shrink-0">
        <Search size={14} />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-[180px] lg:w-[240px] bg-transparent outline-none text-sm placeholder:text-zinc-400 text-zinc-700 dark:text-zinc-200"
        />
      </div>

      {/* MOBILE LOGO */}
      <Link href="/" className="md:hidden flex items-center gap-1.5 shrink-0">
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span>
        </span>
      </Link>

      {/* MOBILE SEARCH TRIGGER */}
      <button
        onClick={() => setSearchOpen(true)}
        className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      >
        <Search size={18} />
      </button>

      {/* ACTIONS */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">

        {/* Messages */}
        <button className="relative p-2 rounded-lg text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
          <MessageCircle size={18} />
        </button>

        {/* Announcements */}
        <button className="relative p-2 rounded-lg text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
          <Megaphone size={18} />
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
            1
          </span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* DIVIDER */}
        <div className="hidden sm:block w-px h-6 bg-zinc-200 dark:bg-zinc-700" />

        {/* USER INFO + AVATAR — link to profile */}
        <Link href="/profile" className="flex items-center gap-3 group cursor-pointer">
          <div className="hidden sm:flex flex-col leading-tight text-right">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {userName}
            </span>
            <span className="text-[10px] text-zinc-500">
              {roleLabels[userRole] || userRole}
            </span>
          </div>

          <Image
            src="/avatar.png"
            alt="User Avatar"
            width={34}
            height={34}
            className="rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shrink-0 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-colors"
          />
        </Link>
      </div>
    </header>
  )
}

export default NavBar
