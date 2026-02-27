"use client"
import { useState } from "react"
import Pagination from "@/components/ui/Pagination"
import Table from "@/components/ui/Table"
import TableSearch from "@/components/ui/TableSearch"
import Image from "next/image"
import Link from "next/link"
import { studentsData } from "@/lib/data"
import { Eye, SlidersHorizontal, ArrowUpDown, UserPlus } from "lucide-react"

type Student = {
  id: number
  studentId: string
  name: string
  email?: string
  foto: string
  phone: string
  serie: number
  turma: string
  address: string
}

const columns = [
  { header: "Aluno", accessor: "info" },
  { header: "ID", accessor: "student-id", className: "hidden md:table-cell" },
  { header: "Série", accessor: "serie" },
  { header: "Turma", accessor: "turma", className: "hidden lg:table-cell" },
  { header: "Telefone", accessor: "phone", className: "hidden xl:table-cell" },
  { header: "Ações", accessor: "actions" },
]

const renderRow = (item: Student) => (
  <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800/50 text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
    <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
          <Image
            src={item.foto}
            alt={item.name || "Aluno"}
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

    <td className="hidden md:table-cell text-zinc-600 dark:text-zinc-400 font-mono text-xs">
      #{item.studentId}
    </td>

    <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
      <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded text-[9px] sm:text-[10px] font-bold">
        {item.serie}° ano
      </span>
    </td>

    <td className="hidden lg:table-cell text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
      {item.turma}
    </td>
    <td className="hidden xl:table-cell text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
      {item.phone}
    </td>

    <td className="px-1.5 sm:px-2 text-right">
      <Link href={`/list/students/${item.id}`}>
        <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all active:scale-90">
          <Eye size={13} />
        </button>
      </Link>
    </td>
  </tr>
)

const StudentListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalItems = studentsData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = studentsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="m-2 sm:m-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-0 lg:flex-row lg:items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Alunos</h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Gerencie os alunos matriculados</p>
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

export default StudentListPage
