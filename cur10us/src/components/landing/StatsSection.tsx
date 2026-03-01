"use client"

import { useEffect, useState, useRef } from "react"
import { School, Users, GraduationCap, BookOpen } from "lucide-react"

type Props = {
  schools: number
  students: number
  teachers: number
  classes: number
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

const statItems = [
  { key: "schools" as const, icon: School, label: "Escolas registadas" },
  { key: "students" as const, icon: Users, label: "Alunos na plataforma" },
  { key: "teachers" as const, icon: GraduationCap, label: "Professores activos" },
  { key: "classes" as const, icon: BookOpen, label: "Turmas criadas" },
]

export default function StatsSection(props: Props) {
  return (
    <section className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800">
        {statItems.map((stat) => {
          const Icon = stat.icon
          const value = props[stat.key]
          return (
            <div key={stat.key} className="flex flex-col items-center py-10 px-4">
              <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                <AnimatedCounter target={value} />
                {value > 0 && "+"}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 text-center">
                {stat.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
