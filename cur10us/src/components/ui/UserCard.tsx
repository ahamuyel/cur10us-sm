import { TrendingUp, Users, UserRound, UserCheck, Briefcase } from "lucide-react"

const typeConfig: Record<
  string,
  { label: string; count: string; trend: string; icon: React.ElementType; cardBg: string; iconBg: string; trendColor: string }
> = {
  students: {
    label: "Alunos",
    count: "1.247",
    trend: "+12%",
    icon: Users,
    cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
    iconBg: "bg-white/20",
    trendColor: "text-indigo-100",
  },
  teachers: {
    label: "Professores",
    count: "84",
    trend: "+3%",
    icon: UserRound,
    cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700",
    iconBg: "bg-white/20",
    trendColor: "text-emerald-100",
  },
  parents: {
    label: "Encarregados",
    count: "932",
    trend: "+8%",
    icon: UserCheck,
    cardBg: "bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700",
    iconBg: "bg-white/20",
    trendColor: "text-amber-100",
  },
  staffs: {
    label: "Funcionários",
    count: "32",
    trend: "+2%",
    icon: Briefcase,
    cardBg: "bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700",
    iconBg: "bg-white/20",
    trendColor: "text-rose-100",
  },
}

const UserCard = ({ type }: { type: string }) => {
  const config = typeConfig[type] ?? typeConfig.students
  const Icon = config.icon

  return (
    <div className={`${config.cardBg} rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow`}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-2.5 rounded-xl ${config.iconBg}`}>
          <Icon size={18} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 ${config.trendColor}`}>
          <TrendingUp size={12} />
          <span className="text-[10px] sm:text-xs font-semibold">{config.trend}</span>
        </div>
      </div>

      {/* Count */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-none">
        {config.count}
      </h2>

      {/* Label */}
      <p className="text-[11px] sm:text-xs font-medium text-white/70 mt-1">
        {config.label}
      </p>
    </div>
  )
}

export default UserCard
