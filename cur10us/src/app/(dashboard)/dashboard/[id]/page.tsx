"use client"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

import UserCard from "@/components/ui/UserCard"
import CountChart from "@/components/ui/CountChart"
import AttendanceChart from "@/components/ui/AttendanceChart"
import FinanceChart from "@/components/ui/FinanceChart"
import EventCalendar from "@/components/ui/EventCalendar"
import Announcements from "@/components/ui/Announcements"
import BigCalendar from "@/components/ui/BigCalendar"

const calendarConfig: Record<string, { title: string; subtitle: string }> = {
  teacher: {
    title: "Agenda",
    subtitle: "Visualize e gerencie suas aulas da semana",
  },
  student: {
    title: "Minha Agenda",
    subtitle: "Suas aulas e atividades da semana",
  },
  parent: {
    title: "Agenda do Aluno",
    subtitle: "Acompanhe as aulas e atividades do seu filho",
  },
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
      return
    }
    if (status === "authenticated" && session?.user?.id) {
      // Only admins can view other users' dashboards (future support access)
      if (id !== session.user.id && session.user.role !== "admin") {
        router.replace(`/dashboard/${session.user.id}`)
      }
    }
  }, [status, session, id, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  const role = session?.user?.role

  // Admin dashboard — KPIs, charts, calendar, announcements
  if (role === "admin") {
    return (
      <div className="p-3 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <UserCard type="students" />
          <UserCard type="teachers" />
          <UserCard type="parents" />
          <UserCard type="staffs" />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1">
                <CountChart />
              </div>
              <div className="lg:col-span-2">
                <AttendanceChart />
              </div>
            </div>
            <FinanceChart />
          </div>
          <aside className="xl:col-span-4 flex flex-col gap-4 sm:gap-6">
            <EventCalendar />
            <Announcements />
          </aside>
        </div>
      </div>
    )
  }

  // Teacher / Student / Parent — calendar + sidebar
  const config = calendarConfig[role || ""] || calendarConfig.student

  return (
    <div className="p-3 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <section className="xl:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 sm:p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-base sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
              {config.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-3 sm:mb-4">
              {config.subtitle}
            </p>
            <BigCalendar />
          </div>
        </section>
        <aside className="xl:col-span-4 flex flex-col gap-4 sm:gap-6">
          <EventCalendar />
          <Announcements />
        </aside>
      </div>
    </div>
  )
}
