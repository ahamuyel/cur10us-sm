import Link from "next/link";
import { role } from "@/lib/data";
// Importação dos ícones do Lucide
{/* Nota: Se você ainda não instalou, execute: 
  npm install lucide-react 
*/}
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
        title: "Menu",
        items: [
            {
                icon: Home,
                label: "Home",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: UserRound,
                label: "Teacher",
                href: "/list/teachers",
                visible: ["admin", "teacher"]
            },
            {
                icon: Users,
                label: "Student",
                href: "/students",
                visible: ["admin", "teacher"]
            },
            {
                icon: UserCheck,
                label: "Parent",
                href: "/parents",
                visible: ["admin", "teacher"]
            },
            {
                icon: Presentation,
                label: "Classes",
                href: "/classes",
                visible: ["admin", "teacher"]
            },
            {
                icon: BookOpen,
                label: "Lessons",
                href: "/lessons",
                visible: ["admin", "teacher"]
            },
            {
                icon: FileText,
                label: "Exam",
                href: "/exams",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: ClipboardList,
                label: "Assignments",
                href: "/assignments",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: GraduationCap,
                label: "Result",
                href: "/results",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: CalendarCheck,
                label: "Attendance",
                href: "/attendance",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: MessageSquare,
                label: "Message",
                href: "/messages",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: Megaphone,
                label: "Announcement",
                href: "/announcements",
                visible: ["admin", "teacher", "student", "parent"]
            },
        ]
    },
    {
        title: "OTHER",
        items:[
            {
                icon: CircleUser,
                label: "Profile",
                href: "/profile",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: Settings,
                label: "Settings",
                href: "/settings",
                visible: ["admin", "teacher", "student", "parent"]
            },
            {
                icon: LogOut,
                label: "Logout",
                href: "/logout",
                visible: ["admin", "teacher", "student", "parent"]
            },
        ]
    }
]

const Menu = () => {
    return (
        <div className="mt-4 text-sm">
            {menuItems.map(i => (
                <div className="flex flex-col gap-2" key={i.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
                    {i.items.map((item) => {
                        if (item.visible.includes(role)) {
                            return (
                                <Link 
                                    href={item.href} 
                                    key={item.label} 
                                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 rounded-md md:px-2 hover:bg-[#c3ebfa] transition-colors"
                                >
                                    {/* Renderizando o componente de ícone dinamicamente */}
                                    <item.icon size={20} />
                                    <span className="hidden lg:block">{item.label}</span>
                                </Link>
                            )
                        }
                    })}
                </div>
            ))}
        </div>
    )
}

export default Menu;