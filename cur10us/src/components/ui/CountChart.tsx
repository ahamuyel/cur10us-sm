"use client"

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { Users } from "lucide-react"

const data = [
  { name: 'Total', count: 119, fill: '#4f46e5' },
  { name: 'Meninas', count: 54, fill: '#F59E0B' },
  { name: 'Meninos', count: 65, fill: '#06B6D4' },
]

const CountChart = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 sm:p-4 flex flex-col h-full shadow-sm border border-zinc-200 dark:border-zinc-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">Alunos</h2>
        <Users size={18} className="text-zinc-400" />
      </div>

      {/* Chart — responsive height */}
      <div className="flex-1 w-full min-h-[160px] sm:min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="35%"
            outerRadius="100%"
            data={data}
            cx="50%"
            cy="50%"
            barSize={16}
          >
            <RadialBar
              background
              dataKey="count"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-around mt-2 sm:mt-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex flex-col items-center gap-0.5">
          <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-cyan-500" />
          <span className="font-bold text-xs">65</span>
          <span className="text-[10px] sm:text-xs text-zinc-500">Meninos</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-500" />
          <span className="font-bold text-xs">54</span>
          <span className="text-[10px] sm:text-xs text-zinc-500">Meninas</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-600" />
          <span className="font-bold text-xs">119</span>
          <span className="text-[10px] sm:text-xs text-zinc-500">Total</span>
        </div>
      </div>
    </div>
  )
}

export default CountChart
