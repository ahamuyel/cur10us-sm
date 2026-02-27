"use client"
import { useState } from "react"
import Pagination from "@/components/ui/Pagination"
import Table from "@/components/ui/Table"
import TableSearch from "@/components/ui/TableSearch"
import { messagesData } from "@/lib/data"
import { SlidersHorizontal, ArrowUpDown, Plus } from "lucide-react"

type Message = {
  id: number
  from: string
  to: string
  subject: string
  message: string
  date: string
  read: boolean
}

const columns = [
  { header: "De", accessor: "from" },
  { header: "Para", accessor: "to", className: "hidden md:table-cell" },
  { header: "Assunto", accessor: "subject" },
  { header: "Data", accessor: "date", className: "hidden lg:table-cell" },
  { header: "Status", accessor: "status" },
]

const renderRow = (item: Message) => (
  <tr key={item.id} className={`border-b border-zinc-100 dark:border-zinc-800/50 text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${!item.read ? "bg-indigo-50/30 dark:bg-indigo-950/10" : ""}`}>
    <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
      <span className={`text-xs sm:text-sm ${!item.read ? "font-bold text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}>
        {item.from}
      </span>
    </td>
    <td className="hidden md:table-cell text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
      {item.to}
    </td>
    <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 max-w-[200px]">
      <span className={`text-xs sm:text-sm truncate block ${!item.read ? "font-bold text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}>
        {item.subject}
      </span>
    </td>
    <td className="hidden lg:table-cell text-zinc-500 dark:text-zinc-500 text-xs">
      {new Date(item.date).toLocaleDateString("pt-BR")}
    </td>
    <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
      <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
        item.read
          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
          : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
      }`}>
        {item.read ? "Lida" : "Nova"}
      </span>
    </td>
  </tr>
)

const MessageListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalItems = messagesData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = messagesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="m-2 sm:m-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-0 lg:flex-row lg:items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Mensagens</h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Comunicação entre a comunidade escolar</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex-1 sm:w-56 md:w-64">
            <TableSearch />
          </div>
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <button className="p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition active:scale-95">
              <SlidersHorizontal size={16} />
            </button>
            <button className="p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition active:scale-95">
              <ArrowUpDown size={16} />
            </button>
            <button className="flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm active:scale-95 shadow-lg shadow-indigo-600/20 transition">
              <Plus size={16} />
              <span className="hidden sm:inline">Nova</span>
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto -mx-2.5 px-2.5 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
        <Table columns={columns} renderRow={renderRow} data={paginatedData} />
      </div>
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  )
}

export default MessageListPage
