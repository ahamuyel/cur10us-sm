import { TrendingUp, Users, UserRound, UserCheck, Briefcase } from "lucide-react"

const typeConfig: Record<
  string,
  { label: string; count: string; trend: string; icon: React.ElementType; color: string; bg: string }
> = {
  students: {
    label: "Alunos",
    count: "1.247",
    trend: "+12%",
    icon: Users,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/50",
  },
  teachers: {
    label: "Professores",
    count: "84",
    trend: "+3%",
    icon: UserRound,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  parents: {
    label: "Responsáveis",
    count: "932",
    trend: "+8%",
    icon: UserCheck,
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/50",
  },
  staffs: {
    label: "Funcionários",
    count: "32",
    trend: "+2%",
    icon: Briefcase,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/50",
  },
}

const UserCard = ({ type }: { type: string }) => {
  const config = typeConfig[type] ?? typeConfig.students
  const Icon = config.icon

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-2.5 rounded-xl ${config.bg}`}>
          <Icon size={18} className={config.color} />
        </div>
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={12} />
          <span className="text-[10px] sm:text-xs font-semibold">{config.trend}</span>
        </div>
      </div>

      {/* Count */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">
        {config.count}
      </h2>

      {/* Label */}
      <p className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
        {config.label}
      </p>
    </div>
  )
}

export default UserCard
