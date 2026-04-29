"use client"
import { useState, useEffect, ReactNode, createContext, useContext } from "react"

type Theme = "light" | "dark"

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // ✅ lazy init (sem null, sem render extra)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light"
    }
    return "light"
  })

  // ✅ fonte única de verdade → DOM sync
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)

    localStorage.setItem("theme", theme)
  }, [theme])

  // ✅ sync com backend
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch("/api/user-preferences")
        if (!res.ok) return

        const pref = await res.json()

        if (pref?.theme && pref.theme !== theme) {
          setTheme(pref.theme)
        }
      } catch {}
    }

    fetchPreferences()
  }, []) // roda uma vez

  // ✅ toggle só muda state
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))

    // salvar no backend (sem bloquear UI)
    fetch("/api/user-preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme: theme === "light" ? "dark" : "light",
      }),
    }).catch(() => {})
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)