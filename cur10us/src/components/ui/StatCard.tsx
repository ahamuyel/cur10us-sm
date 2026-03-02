import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  subtitle?: string
  href?: string
  size?: "compact" | "normal" | "expanded"
}

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  primary: { bg: "bg-primary-50 dark:bg-primary-950/30", text: "text-primary-600 dark:text-primary-400", iconBg: "bg-primary-100 dark:bg-primary-950/50" },
  indigo: { bg: "bg-primary-50 dark:bg-primary-950/30", text: "text-primary-600 dark:text-primary-400", iconBg: "bg-primary-100 dark:bg-primary-950/50" },
  cyan: { bg: "bg-cyan-50 dark:bg-cyan-950/30", text: "text-cyan-600 dark:text-cyan-400", iconBg: "bg-cyan-100 dark:bg-cyan-950/50" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", iconBg: "bg-amber-100 dark:bg-amber-950/50" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", iconBg: "bg-emerald-100 dark:bg-emerald-950/50" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-600 dark:text-rose-400", iconBg: "bg-rose-100 dark:bg-rose-950/50" },
}

const StatCard = ({ label, value, icon: Icon, color, subtitle, href, size = "normal" }: StatCardProps) => {
  const c = colorMap[color] || colorMap.primary

  if (size === "compact") {
    const content = (
      <div className={`rounded-2xl px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center gap-2 ${href ? "hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer" : ""}`}>
        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={16} className={c.text} />
        </div>
        <p className={`text-lg font-bold ${c.text}`}>{value}</p>
      </div>
    )
    return href ? <Link href={href}>{content}</Link> : content
  }

  if (size === "expanded") {
    const content = (
      <div className={`rounded-2xl p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm col-span-2 ${href ? "hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer" : ""}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
            <Icon size={24} className={c.text} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${c.text}`}>{value}</p>
            {subtitle && <p className="text-[10px] text-zinc-400 truncate">{subtitle}</p>}
          </div>
        </div>
      </div>
    )
    return href ? <Link href={href}>{content}</Link> : content
  }

  // Normal (default)
  const content = (
    <div className={`rounded-2xl p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${href ? "hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer" : ""}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={c.text} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
          <p className={`text-lg sm:text-xl font-bold ${c.text}`}>{value}</p>
          {subtitle && <p className="text-[10px] text-zinc-400 truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

export default StatCard
