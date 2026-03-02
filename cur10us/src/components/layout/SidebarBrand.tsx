"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

function hexToHSL(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function applySchoolColor(color: string) {
  const doc = document.documentElement
  doc.style.setProperty("--school-primary", color)
  try {
    const { h, s } = hexToHSL(color)
    doc.style.setProperty("--school-primary-light", `hsl(${h}, ${s}%, 95%)`)
    doc.style.setProperty("--school-primary-dark", `hsl(${h}, ${s}%, 25%)`)
  } catch { /* ignore */ }
}

const SidebarBrand = () => {
  const { data: session } = useSession()
  const [logo, setLogo] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.schoolId) {
      fetch("/api/school-settings")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (d?.logo) setLogo(d.logo)
          if (d?.name) setSchoolName(d.name)
          if (d?.primaryColor) applySchoolColor(d.primaryColor)
        })
        .catch(() => {})
    }
  }, [session])

  return (
    <div className="p-4">
      <Link href="/dashboard" className="flex items-center justify-center lg:justify-start gap-2">
        {logo ? (
          <Image src={logo} alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-contain shrink-0" />
        ) : (
          <span className="font-bold text-zinc-900 dark:text-zinc-100 lg:hidden text-lg">
            C<span style={{ color: "var(--school-primary)" }}>X</span>
          </span>
        )}
        <span className="font-bold text-zinc-900 dark:text-zinc-100 hidden lg:inline text-sm leading-tight truncate">
          {schoolName || <>Cur10us<span style={{ color: "var(--school-primary)" }}>X</span></>}
        </span>
      </Link>
    </div>
  )
}

export default SidebarBrand
