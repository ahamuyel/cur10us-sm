"use client"

import { useEffect, useState } from "react"
import { School, Users, GraduationCap, FileText, Loader2 } from "lucide-react"

interface Stats {
  totalSchools: number
  activeSchools: number
  pendingSchools: number
  totalUsers: number
  totalTeachers: number
  totalStudents: number
  totalParents: number
  totalApplications: number
  pendingApplications: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  const cards = [
    { icon: School, label: "Escolas ativas", value: stats?.activeSchools ?? 0, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400" },
    { icon: School, label: "Escolas pendentes", value: stats?.pendingSchools ?? 0, color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400" },
    { icon: Users, label: "Usuários", value: stats?.totalUsers ?? 0, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950 dark:text-cyan-400" },
    { icon: GraduationCap, label: "Alunos", value: stats?.totalStudents ?? 0, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400" },
    { icon: Users, label: "Professores", value: stats?.totalTeachers ?? 0, color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400" },
    { icon: Users, label: "Encarregados", value: stats?.totalParents ?? 0, color: "text-rose-600 bg-rose-100 dark:bg-rose-950 dark:text-rose-400" },
    { icon: FileText, label: "Solicitações", value: stats?.totalApplications ?? 0, color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400" },
    { icon: FileText, label: "Solicitações pendentes", value: stats?.pendingApplications ?? 0, color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Painel Super Admin</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Visão geral da plataforma</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{card.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
