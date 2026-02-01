"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { CreditCard } from "lucide-react" // ícone substituto para finanças

const data = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 2780, expense: 3908 },
  { name: 'Jun', income: 1890, expense: 4800 },
  { name: 'Jul', income: 2390, expense: 3800 },
  { name: 'Aug', income: 3490, expense: 4300 },
  { name: 'Sep', income: 2780, expense: 3908 },
  { name: 'Oct', income: 1890, expense: 4800 },
  { name: 'Nov', income: 2390, expense: 3800 },
  { name: 'Dec', income: 3490, expense: 4300 },
]

const FinanceChart = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 h-full shadow-sm flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Finance</h1>
        <CreditCard className="text-zinc-500 dark:text-zinc-400" size={20} />
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} tickMargin={10} />
            {/* Lines */}
            <Line type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={3} />
            <Line type="monotone" dataKey="expense" stroke="#facc15" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fixed legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-indigo-600" />
          Income
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-amber-400" />
          Expense
        </div>
      </div>

    </div>
  )
}

export default FinanceChart
