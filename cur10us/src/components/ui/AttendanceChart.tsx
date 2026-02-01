"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { CalendarCheck } from "lucide-react"

const data = [
  { name: 'Mon', present: 62, absent: 23 },
  { name: 'Tue', present: 54, absent: 43 },
  { name: 'Wed', present: 54, absent: 43 },
  { name: 'Thu', present: 65, absent: 53 },
  { name: 'Fri', present: 76, absent: 45 },
]

const AttendanceChart = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 h-full shadow-sm flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Attendance
        </h1>
        <CalendarCheck className="text-zinc-500 dark:text-zinc-400" size={20} />
      </div>

      {/* Chart */}
      <div className="w-full flex-1 min-h-[220px]"> {/* altura mínima para o ResponsiveContainer */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={18}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} />
            <Bar dataKey="present" fill="#22d3ee" radius={[6,6,0,0]} />
            <Bar dataKey="absent" fill="#facc15" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fixed legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-cyan-400" />
          Present
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-amber-400" />
          Absent
        </div>
      </div>
    </div>
  )
}

export default AttendanceChart
