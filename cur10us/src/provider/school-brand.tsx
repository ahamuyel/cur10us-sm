"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { generatePalette } from "@/lib/colors"

interface SchoolBrand {
  name: string
  abbreviation: string
  logo: string | null
  primaryColor: string | null
  secondaryColor: string | null
  sidebarColor: string | null
  loading: boolean
  updateBrand: (partial: Partial<Omit<SchoolBrand, "loading" | "updateBrand">>) => void
}

const SchoolBrandContext = createContext<SchoolBrand>({
  name: "Cur10usX",
  abbreviation: "CX",
  logo: null,
  primaryColor: null,
  secondaryColor: null,
  sidebarColor: null,
  loading: true,
  updateBrand: () => {},
})

/** Generate abbreviation from school name (ignoring words with <= 2 chars) */
function generateAbbreviation(name: string): string {
  if (!name) return "CX"
  const words = name.split(/\s+/).filter((w) => w.length > 2)
  if (words.length === 0) return name.slice(0, 2).toUpperCase()
  return words
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 5)
}

/** Default indigo palette — matches @theme in globals.css */
const DEFAULT_PRIMARY: Record<string, string> = {
  "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc",
  "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca",
  "800": "#3730a3", "900": "#312e81", "950": "#1e1b4b",
}

/** Default cyan palette */
const DEFAULT_SECONDARY: Record<string, string> = {
  "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9",
  "400": "#22d3ee", "500": "#06B6D4", "600": "#0891b2", "700": "#0e7490",
  "800": "#155e75", "900": "#164e63", "950": "#083344",
}

/** Apply brand CSS variables to document root — directly overrides Tailwind's --color-* vars */
function applyBrandToDOM(primaryColor: string | null, secondaryColor: string | null, sidebarColor: string | null) {
  const root = document.documentElement

  // Primary
  const primaryPalette = primaryColor ? generatePalette(primaryColor) : DEFAULT_PRIMARY
  for (const [shade, hex] of Object.entries(primaryPalette)) {
    root.style.setProperty(`--color-primary-${shade}`, hex)
  }
  root.style.setProperty("--color-primary", primaryPalette["500"])
  root.style.setProperty("--color-primary-dark", primaryPalette["700"])
  root.style.setProperty("--color-accent", primaryPalette["500"])

  // Secondary
  const secondaryPalette = secondaryColor ? generatePalette(secondaryColor) : DEFAULT_SECONDARY
  for (const [shade, hex] of Object.entries(secondaryPalette)) {
    root.style.setProperty(`--color-secondary-${shade}`, hex)
  }
  root.style.setProperty("--color-secondary", secondaryPalette["500"])

  // Sidebar background
  if (sidebarColor) {
    root.style.setProperty("--brand-sidebar", sidebarColor)
  } else {
    root.style.removeProperty("--brand-sidebar")
  }
}

/** Set dynamic favicon from logo URL/data URI */
function setFavicon(logoUrl: string | null) {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (!logoUrl) {
    if (link) link.href = "/favicon.ico"
    return
  }
  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    document.head.appendChild(link)
  }
  link.href = logoUrl
}

export function SchoolBrandProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [brand, setBrand] = useState<Omit<SchoolBrand, "loading" | "updateBrand">>({
    name: "Cur10usX",
    abbreviation: "CX",
    logo: null,
    primaryColor: null,
    secondaryColor: null,
    sidebarColor: null,
  })
  const [loading, setLoading] = useState(true)

  const isSuperAdmin = session?.user?.role === "super_admin"
  const isSchoolUser = ["school_admin", "teacher", "student", "parent"].includes(session?.user?.role || "")

  useEffect(() => {
    if (status === "loading") return

    // Super admin always uses Cur10usX defaults
    if (isSuperAdmin || !isSchoolUser) {
      setLoading(false)
      return
    }

    fetch("/api/school-settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        const abbr = d.abbreviation || generateAbbreviation(d.name || "")
        const newBrand = {
          name: d.name || "Cur10usX",
          abbreviation: abbr,
          logo: d.logo || null,
          primaryColor: d.primaryColor || null,
          secondaryColor: d.secondaryColor || null,
          sidebarColor: d.sidebarColor || null,
        }
        setBrand(newBrand)
        applyBrandToDOM(newBrand.primaryColor, newBrand.secondaryColor, newBrand.sidebarColor)

        // Set page title
        document.title = `${newBrand.name} | Painel de Gestão`

        // Set dynamic favicon
        setFavicon(newBrand.logo)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status, isSuperAdmin, isSchoolUser])

  const updateBrand = useCallback(
    (partial: Partial<Omit<SchoolBrand, "loading" | "updateBrand">>) => {
      setBrand((prev) => {
        const next = { ...prev, ...partial }
        // Live preview — apply to DOM immediately
        applyBrandToDOM(next.primaryColor, next.secondaryColor, next.sidebarColor)
        if (partial.name) {
          document.title = `${next.name} | Painel de Gestão`
        }
        if (partial.logo !== undefined) {
          setFavicon(next.logo)
        }
        return next
      })
    },
    []
  )

  return (
    <SchoolBrandContext.Provider value={{ ...brand, loading, updateBrand }}>
      {children}
    </SchoolBrandContext.Provider>
  )
}

export const useSchoolBrand = () => useContext(SchoolBrandContext)
