"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import type { PlatformBranding } from "@/app/page"

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Para quem", href: "#para-quem" },
  { label: "FAQ", href: "#faq" },
]

export default function LandingNavbar({ branding }: { branding: PlatformBranding }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-50/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {branding.logo && (
            <Image src={branding.logo} alt={branding.name} width={28} height={28} className="w-7 h-7 rounded-lg object-contain" />
          )}
          <span className="text-lg font-bold tracking-tight">
            {branding.name === "Cur10usX" ? (
              <>Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span></>
            ) : (
              branding.name
            )}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="hidden sm:inline-block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            Criar conta
          </Link>
          <Link
            href="/signin"
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
          >
            Entrar
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition py-1"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="block text-sm text-indigo-600 dark:text-indigo-400 font-medium py-1"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="block text-sm text-zinc-600 dark:text-zinc-400 font-medium py-1"
          >
            Criar conta
          </Link>
        </div>
      )}
    </nav>
  )
}
