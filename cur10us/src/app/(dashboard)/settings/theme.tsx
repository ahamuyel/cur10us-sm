"use client"
import { useState, useEffect, ReactNode, createContext, useContext } from "react"
import { useSession } from "next-auth/react"

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
  const { status } = useSession()
  const [theme, setTheme] = useState<Theme | null>(null)

  // Aplica tema do localStorage imediatamente — sem esperar sessão
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) || "light"
    setTheme(stored)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(stored)
  }, [])

  // Sincroniza com DB apenas quando autenticado
  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/user-preferences")
      .then((r) => r.ok ? r.json() : null)
      .then((pref) => {
        if (pref?.theme) {
          setTheme(pref.theme)
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(pref.theme)
          localStorage.setItem("theme", pref.theme)
        }
      })
      .catch(() => {})
  }, [status])

  const toggleTheme = () => {
    if (!theme) return
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)
    localStorage.setItem("theme", newTheme)

    fetch("/api/user-preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    }).catch(() => {})
  }

  if (!theme) return null

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)