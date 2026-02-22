"use client"
import { useState } from "react"
import Pagination from "@/components/ui/Pagination"
import Table from "@/components/ui/Table"
import TableSearch from "@/components/ui/TableSearch"
import Image from "next/image"
import Link from "next/link"
import { teachersData } from "@/lib/data"
import { Eye, SlidersHorizontal, ArrowUpDown, UserPlus } from "lucide-react"

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  foto: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
}

const columns = [
  { header: "Professor", accessor: "info" },
  { header: "ID", accessor: "teacher-id", className: "hidden md:table-cell" },
  { header: "Disciplinas", accessor: "subjects" }, // Visível em todos os tamanhos
  { header: "Turmas", accessor: "classes", className: "hidden lg:table-cell" },
  { header: "Telefone", accessor: "phone", className: "hidden xl:table-cell" },
  { header: "Ações", accessor: "actions" },
]

const renderRow = (item: Teacher) => (
  <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800/50 text-sm hover:bg-zinc-50/50 transition-colors">
    {/* IMAGEM E NOME */}
    <td className="py-3 px-2">
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 shrink-0">
          <Image
            src={item.foto}
            alt={item.name || "Professor"}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 max-w-[80px] sm:max-w-none">
          <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-xs sm:text-sm">
            {item.name}
          </span>
        </div>
      </div>
    </td>

    {/* ID (Oculto no mobile) */}
    <td className="hidden md:table-cell text-zinc-600 dark:text-zinc-400 font-mono text-xs">
      #{item.teacherId}
    </td>

    {/* DISCIPLINAS (Visível no Mobile) */}
    <td className="py-3 px-2">
      <div className="flex flex-wrap gap-1">
        {item.subjects?.slice(0, 2).map((s, i) => ( // Mostra apenas as 2 primeiras no mobile p/ não quebrar
          <span key={i} className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded md:rounded-md text-[9px] md:text-[10px] font-bold uppercase whitespace-nowrap">
            {s}
          </span>
        ))}
        {item.subjects?.length > 2 && (
          <span className="text-[9px] text-zinc-400">+{item.subjects.length - 2}</span>
        )}
      </div>
    </td>

    {/* TURMAS E TELEFONE (Ocultos no mobile conforme as classes acima) */}
    <td className="hidden lg:table-cell text-zinc-600 dark:text-zinc-400">
      {item.classes?.join(", ")}
    </td>
    <td className="hidden xl:table-cell text-zinc-600 dark:text-zinc-400">
      {item.phone}
    </td>

    {/* AÇÕES */}
    <td className="px-2 text-right">
      <Link href={`/list/teachers/${item.id}`}>
        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all">
          <Eye size={14} />
        </button>
      </Link>
    </td>
  </tr>
)
const TeacherListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalItems = teachersData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = teachersData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  return (

    // Reduzi o padding no mobile (p-3) e aumentei no desktop (p-6)
    <div className="m-3 bg-white dark:bg-zinc-900 dark:border-zinc-800 md:rounded-2xl p-3 md:p-6 flex-1 shadow-sm overflow-hidden">

      {/* HEADER SECTION */}
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Professores</h1>
          <p className="hidden sm:block text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Gerencie sua equipe acadêmica</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 sm:w-64">
            <TableSearch />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><SlidersHorizontal size={18} /></button>
            <button className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><ArrowUpDown size={18} /></button>
            <button className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm active:scale-95 shadow-lg shadow-indigo-600/20">
              <UserPlus size={18} />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION COM OVERFLOW HORIZONTAL */}
      <div className="overflow-x-auto -mx-3 px-3 md:mx<Table-0 md:px-0">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={paginatedData}
        /> </div>

      {/* PAGINATION */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )


}

export default TeacherListPage