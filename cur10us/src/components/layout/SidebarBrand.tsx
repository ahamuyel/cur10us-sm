"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const SidebarBrand = () => {
  const { data: session } = useSession()
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.role === "school_admin" || session?.user?.role === "teacher" || session?.user?.role === "student" || session?.user?.role === "parent") {
      fetch("/api/school-settings")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (d?.logo) setLogo(d.logo)
          if (d?.primaryColor) {
            document.documentElement.style.setProperty("--school-primary", d.primaryColor)
          }
        })
        .catch(() => {})
    }
  }, [session])

  return (
    <div className="p-4">
      <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
        {logo ? (
          <Image src={logo} alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-contain" />
        ) : null}
        <span className="font-bold text-zinc-900 dark:text-zinc-100 hidden lg:inline">
          Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span>
        </span>
        {!logo && (
          <span className="font-bold text-zinc-900 dark:text-zinc-100 lg:hidden">
            C<span className="text-indigo-600 dark:text-indigo-400">X</span>
          </span>
        )}
      </Link>
    </div>
  )
}

export default SidebarBrand
