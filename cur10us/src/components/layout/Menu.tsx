"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Home,
  UserRound,
  Users,
  UserCheck,
  Presentation,
  BookOpen,
  FileText,
  ClipboardList,
  GraduationCap,
  CalendarCheck,
  MessageSquare,
  Megaphone,
  CircleUser,
  Settings,
  LogOut
} from "lucide-react";

const menuItems = [
    {
        title: "MENU",
        items: [
            {
                icon: Home,
                label: "Início",
                href: "/admin",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: UserRound,
                label: "Professores",
                href: "/list/teachers",
                visible: ["admin", "teacher"]
            },
            {
                icon: Users,
                label: "Alunos",
                href: "/list/students",
                visible: ["admin", "teacher"]
            },
            {
                icon: UserCheck,
                label: "Responsáveis",
                href: "/list/parents",
                visible: ["admin", "teacher"]
            },
            {
                icon: Presentation,
                label: "Turmas",
                href: "/list/classes",
                visible: ["admin", "teacher"]
            },
            {
                icon: BookOpen,
                label: "Aulas",
                href: "/list/lessons",
                visible: ["admin", "teacher"]
            },
            {
                icon: FileText,
                label: "Provas",
                href: "/list/exams",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: ClipboardList,
                label: "Tarefas",
                href: "/list/assignments",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: GraduationCap,
                label: "Resultados",
                href: "/list/results",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: CalendarCheck,
                label: "Frequência",
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: MessageSquare,
                label: "Mensagens",
                href: "/list/messages",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: Megaphone,
                label: "Avisos",
                href: "/list/announcements",
                visible: ["admin", "teacher", "student", "parent"]
            },
        ]
    },
    {
        title: "OUTROS",
        items:[
            {
                icon: CircleUser,
                label: "Perfil",
                href: "/profile",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: Settings,
                label: "Configurações",
                href: "/settings",
                visible: ["admin", "teacher", "student", "parent"]
            },
        ]
    }
]

const Menu = () => {
    const { data: session } = useSession()
    const role = session?.user?.role || "student"

    return (
        <div className="mt-4 text-sm">
            {menuItems.map(i => (
                <div className="flex flex-col gap-2" key={i.title}>
                    <span className="hidden lg:block text-zinc-400 dark:text-zinc-500 font-light my-4 text-xs tracking-wider">
                        {i.title}
                    </span>
                    {i.items.map((item) => {
                        if (item.visible.includes(role)) {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className="flex items-center justify-center lg:justify-start gap-4 text-zinc-500 dark:text-zinc-400 py-2 rounded-lg md:px-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <item.icon size={20} />
                                    <span className="hidden lg:block">{item.label}</span>
                                </Link>
                            )
                        }
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

export default Menu;
