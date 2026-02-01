"use client"

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { Users, User } from "lucide-react"

const data = [
  { name: 'Total', count: 119, fill: '#4f46e5' }, // Indigo
  { name: 'Girls', count: 54, fill: '#facc15' },  // Amber
  { name: 'Boys', count: 65, fill: '#22d3ee' },   // Cyan
]

const CountCharts = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 flex flex-col h-full shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Students</h1>
        <Users size={20} className="text-zinc-500 dark:text-zinc-400" />
      </div>

      {/* Chart */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            innerRadius="40%"
            outerRadius="100%"
            data={data}
            cx="50%"
            cy="50%"
            barSize={20}
          >
            <RadialBar
              background
              dataKey="count"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda fixa */}
      <div className="flex justify-around mt-4 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex flex-col items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-cyan-400" />
          <span className="font-bold">65</span>
          <span className="text-xs">Boys (55%)</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-amber-400" />
          <span className="font-bold">54</span>
          <span className="text-xs">Girls (45%)</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-indigo-600" />
          <span className="font-bold">119</span>
          <span className="text-xs">Total</span>
        </div>
      </div>

    </div>
  )
}

export default CountCharts
