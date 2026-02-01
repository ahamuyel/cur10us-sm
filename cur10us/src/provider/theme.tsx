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
  const [theme, setTheme] = useState<Theme | null>(null) // null = não renderizado ainda

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) || "light"
    setTheme(stored)

    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(stored)
  }, [])

  const toggleTheme = () => {
    if (!theme) return
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  if (!theme) return null // não renderiza nada até que o tema esteja definido

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
