import { MoreHorizontal, Users, UserRound, UserCheck, Briefcase } from "lucide-react"

const typeConfig: Record<
  string,
  { label: string; icon: React.ElementType; bg: string; iconBg: string }
> = {
  students: {
    label: "Alunos",
    icon: Users,
    bg: "bg-indigo-100 dark:bg-indigo-900",
    iconBg: "bg-indigo-200 dark:bg-indigo-700",
  },
  teachers: {
    label: "Professores",
    icon: UserRound,
    bg: "bg-emerald-100 dark:bg-emerald-900",
    iconBg: "bg-emerald-200 dark:bg-emerald-700",
  },
  parents: {
    label: "Responsáveis",
    icon: UserCheck,
    bg: "bg-amber-100 dark:bg-amber-900",
    iconBg: "bg-amber-200 dark:bg-amber-700",
  },
  staffs: {
    label: "Funcionários",
    icon: Briefcase,
    bg: "bg-rose-100 dark:bg-rose-900",
    iconBg: "bg-rose-200 dark:bg-rose-700",
  },
}

const UserCard = ({ type }: { type: string }) => {
  const config = typeConfig[type] ?? typeConfig.students
  const Icon = config.icon

  return (
    <div
      className={`
        relative flex-1 min-w-[150px] rounded-xl p-4
        ${config.bg}
        border border-transparent
        shadow-sm
        flex flex-col justify-between
        transition-transform hover:scale-105
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
          Ano 2025/26
        </span>
        <button className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 transition">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className={`
            p-3 rounded-full flex items-center justify-center
            ${config.iconBg}
          `}
        >
          <Icon className="text-white dark:text-white" size={20} />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            0 
          </h1>
          <p className="hidden sm:block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {config.label}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
