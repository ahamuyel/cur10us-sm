"use client"

import Image from "next/image"
import { useSession } from "next-auth/react"
import { Mail, Phone, MapPin, BookOpen, Users, Calendar } from "lucide-react"

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  teacher: "Professor",
  student: "Aluno",
  parent: "Encarregado",
}

const ProfilePage = () => {
  const { data: session } = useSession()

  const userName = session?.user?.name || "Usuário"
  const userEmail = session?.user?.email || ""
  const userRole = session?.user?.role || "student"

  return (
    <div className="m-2 sm:m-3 flex flex-col gap-4">
      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full object-cover border-4 border-zinc-200 dark:border-zinc-700"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {userName}
            </h1>
            <span className="inline-block mt-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
              {roleLabels[userRole] || userRole}
            </span>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-md">
              Responsável pela gestão académica e administrativa da plataforma Cur10usX.
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Contacto</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{userEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">923 456 789</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Luanda</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Resumo</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">10</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">Turmas ativas</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">286</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">Alunos matriculados</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">2026</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">Ano letivo atual</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
