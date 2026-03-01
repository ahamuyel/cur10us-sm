"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { getDashboardPath } from "@/lib/routes"
import {
  Home,
  UserRound,
  Users,
  UserCheck,
  Presentation,
  BookMarked,
  Layers,
  FileText,
  ClipboardList,
  GraduationCap,
  CalendarCheck,
  Calendar,
  MessageSquare,
  Megaphone,
  CircleUser,
  Settings,
  LogOut,
  Inbox,
  ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface MenuItem {
  icon: LucideIcon
  label: string
  href: string
  visible: string[]
  permission?: string
}

const menuItems: { title: string; items: MenuItem[] }[] = [
  {
    title: "MENU",
    items: [
      { icon: Home, label: "Início", href: "/dashboard", visible: ["school_admin", "teacher", "student", "parent"] },
      { icon: Inbox, label: "Solicitações", href: "/list/applications", visible: ["school_admin"], permission: "canManageApplications" },
      { icon: ShieldCheck, label: "Administradores", href: "/list/admins", visible: ["school_admin"], permission: "canManageAdmins" },
      { icon: UserRound, label: "Professores", href: "/list/teachers", visible: ["school_admin", "teacher"], permission: "canManageTeachers" },
      { icon: Users, label: "Alunos", href: "/list/students", visible: ["school_admin", "teacher"], permission: "canManageStudents" },
      { icon: UserCheck, label: "Encarregados", href: "/list/parents", visible: ["school_admin", "teacher"], permission: "canManageParents" },
      { icon: BookMarked, label: "Disciplinas", href: "/list/subjects", visible: ["school_admin"], permission: "canManageSubjects" },
      { icon: Layers, label: "Cursos", href: "/list/courses", visible: ["school_admin"], permission: "canManageCourses" },
      { icon: Presentation, label: "Turmas", href: "/list/classes", visible: ["school_admin", "teacher"], permission: "canManageClasses" },
      { icon: Calendar, label: "Aulas", href: "/list/lessons", visible: ["school_admin", "teacher"], permission: "canManageLessons" },
      { icon: FileText, label: "Provas", href: "/list/exams", visible: ["school_admin", "teacher", "student", "parent"], permission: "canManageExams" },
      { icon: ClipboardList, label: "Tarefas", href: "/list/assignments", visible: ["school_admin", "teacher", "student", "parent"], permission: "canManageExams" },
      { icon: GraduationCap, label: "Resultados", href: "/list/results", visible: ["school_admin", "teacher", "student", "parent"], permission: "canManageResults" },
      { icon: CalendarCheck, label: "Assiduidade", href: "/list/attendance", visible: ["school_admin", "teacher", "student", "parent"], permission: "canManageAttendance" },
      { icon: MessageSquare, label: "Mensagens", href: "/list/messages", visible: ["school_admin", "teacher", "student", "parent"], permission: "canManageMessages" },
      { icon: Megaphone, label: "Avisos", href: "/list/announcements", visible: ["school_admin", "teacher", "student", "parent"], permission: "canManageAnnouncements" },
    ],
  },
  {
    title: "OUTROS",
    items: [
      { icon: CircleUser, label: "Perfil", href: "/profile", visible: ["school_admin", "teacher", "student", "parent"] },
      { icon: Settings, label: "Configurações", href: "/settings", visible: ["school_admin", "teacher", "student", "parent"] },
    ],
  },
]

const Menu = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const role = session?.user?.role || "student"
  const adminLevel = session?.user?.adminLevel
  const permissions = session?.user?.permissions || []
  const homePath = getDashboardPath(session?.user?.id)

  function isVisible(item: MenuItem): boolean {
    if (!item.visible.includes(role)) return false

    // Permission check only applies to school_admin secondary admins
    if (role === "school_admin" && item.permission && adminLevel === "secondary") {
      return permissions.includes(item.permission)
    }

    return true
  }

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-zinc-400 dark:text-zinc-500 font-light my-4 text-xs tracking-wider">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (!isVisible(item)) return null
            const href = item.label === "Início" ? homePath : item.href
            const isActive = href === "/dashboard"
              ? pathname === "/dashboard" || pathname === homePath
              : pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                href={href}
                key={item.label}
                className={`flex items-center justify-center lg:justify-start gap-4 py-2 rounded-lg md:px-2 transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                <item.icon size={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          })}
        </div>
      ))}

      {/* Logout button */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex items-center justify-center lg:justify-start gap-4 text-zinc-500 dark:text-zinc-400 py-2 rounded-lg md:px-2 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="hidden lg:block">Sair</span>
        </button>
      </div>
    </div>
  )
}

export default Menu
