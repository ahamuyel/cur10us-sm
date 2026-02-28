"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { CalendarCheck } from "lucide-react"
import { useTheme } from "@/provider/theme"

const data = [
  { name: 'Seg', present: 62, absent: 23 },
  { name: 'Ter', present: 54, absent: 43 },
  { name: 'Qua', present: 54, absent: 43 },
  { name: 'Qui', present: 65, absent: 53 },
  { name: 'Sex', present: 76, absent: 45 },
]

const AttendanceChart = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 sm:p-4 h-full shadow-sm flex flex-col border border-zinc-200 dark:border-zinc-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Frequência
        </h2>
        <CalendarCheck className="text-zinc-400" size={18} />
      </div>

      {/* Chart */}
      <div className="w-full flex-1 min-h-[180px] sm:min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={14}
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#3f3f46" : "#e5e7eb"} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: isDark ? "#a1a1aa" : "#9ca3af", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: isDark ? "#a1a1aa" : "#9ca3af", fontSize: 11 }}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                background: isDark ? "#18181b" : "#fff",
                border: `1px solid ${isDark ? "#3f3f46" : "#e5e7eb"}`,
                borderRadius: "12px",
                fontSize: "12px",
                color: isDark ? "#fafafa" : "#18181b",
              }}
            />
            <Bar dataKey="present" fill="#06B6D4" radius={[6,6,0,0]} name="Presentes" />
            <Bar dataKey="absent" fill="#F59E0B" radius={[6,6,0,0]} name="Ausentes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 sm:gap-6 mt-2 sm:mt-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500" />
          <span>Presentes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Ausentes</span>
        </div>
      </div>
    </div>
  )
}

export default AttendanceChart
