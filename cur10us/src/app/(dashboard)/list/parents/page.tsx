"use client"
import { useState } from "react"
import Pagination from "@/components/ui/Pagination"
import Table from "@/components/ui/Table"
import TableSearch from "@/components/ui/TableSearch"
import Image from "next/image"
import { parentsData } from "@/lib/data"
import { SlidersHorizontal, ArrowUpDown, UserPlus } from "lucide-react"

type Parent = {
  id: number
  name: string
  email?: string
  foto: string
  phone: string
  students: string[]
  address: string
}

const columns = [
  { header: "Responsável", accessor: "info" },
  { header: "E-mail", accessor: "email", className: "hidden md:table-cell" },
  { header: "Alunos", accessor: "students" },
  { header: "Telefone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Endereço", accessor: "address", className: "hidden xl:table-cell" },
]

const renderRow = (item: Parent) => (
  <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800/50 text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
    <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
          <Image
            src={item.foto}
            alt={item.name || "Responsável"}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-xs sm:text-sm max-w-[80px] sm:max-w-none">
            {item.name}
          </span>
        </div>
      </div>
    </td>

    <td className="hidden md:table-cell text-zinc-600 dark:text-zinc-400 text-xs">
      {item.email}
    </td>

    <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
      <div className="flex flex-wrap gap-0.5 sm:gap-1">
        {item.students.slice(0, 2).map((s, i) => (
          <span key={i} className="px-1 sm:px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded text-[8px] sm:text-[10px] font-bold whitespace-nowrap">
            {s}
          </span>
        ))}
        {item.students.length > 2 && (
          <span className="text-[8px] sm:text-[9px] text-zinc-400">+{item.students.length - 2}</span>
        )}
      </div>
    </td>

    <td className="hidden lg:table-cell text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
      {item.phone}
    </td>
    <td className="hidden xl:table-cell text-zinc-600 dark:text-zinc-400 text-xs max-w-[200px] truncate">
      {item.address}
    </td>
  </tr>
)

const ParentListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalItems = parentsData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = parentsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="m-2 sm:m-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-0 lg:flex-row lg:items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Responsáveis</h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Gerencie os pais e responsáveis dos alunos</p>
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
              <UserPlus size={16} />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto -mx-2.5 px-2.5 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={paginatedData}
        />
      </div>

      {/* PAGINATION */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default ParentListPage
