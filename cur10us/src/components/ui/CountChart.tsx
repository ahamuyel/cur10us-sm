"use client"

import { useEffect, useState } from "react"
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { Users, Loader2 } from "lucide-react"

const CountChart = () => {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/students?limit=1")
      .then(r => r.json())
      .then(d => setTotal(d.total || 0))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const data = [
    { name: 'Total', count: total, fill: '#4f46e5' },
  ]

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 sm:p-4 flex flex-col h-full shadow-sm border border-zinc-200 dark:border-zinc-800">

      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">Alunos</h2>
        <Users size={18} className="text-zinc-400" />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-indigo-500" />
        </div>
      ) : total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
          Sem alunos registados
        </div>
      ) : (
        <>
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

          <div className="flex justify-center mt-2 sm:mt-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex flex-col items-center gap-0.5">
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-600" />
              <span className="font-bold text-xs">{total}</span>
              <span className="text-[10px] sm:text-xs text-zinc-500">Total</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CountChart
