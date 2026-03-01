"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import Pagination from "@/components/ui/Pagination"
import Table from "@/components/ui/Table"
import TableSearch from "@/components/ui/TableSearch"
import FormModal from "@/components/ui/FormModal"
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal"
import StudentForm from "@/components/forms/StudentForm"
import { useEntityList } from "@/hooks/useEntityList"
import Image from "next/image"
import Link from "next/link"
import FilterPanel from "@/components/ui/FilterPanel"
import SortButton from "@/components/ui/SortButton"
import { Pencil, Trash2, UserPlus, UserX, Loader2 } from "lucide-react"

type Student = {
  id: string
  name: string
  email: string
  foto: string | null
  phone: string
  classId?: string | null
  class?: { id: string; name: string; grade: number } | null
  address: string
  hasAccount?: boolean
  userActive?: boolean | null
}

const columns = [
  { header: "Aluno", accessor: "info" },
  { header: "E-mail", accessor: "email", className: "hidden md:table-cell" },
  { header: "Turma", accessor: "class" },
  { header: "Telefone", accessor: "phone", className: "hidden xl:table-cell" },
  { header: "Ações", accessor: "actions" },
]

const StudentListPage = () => {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "school_admin"
  const { data, totalPages, page, search, setSearch, setPage, filters, setFilters, sort, setSort, clearFilters, activeFilterCount, loading, refetch } = useEntityList<Student>({ endpoint: "/api/students", limit: 5 })

  const filterConfig = [
    { key: "classId", label: "Turma", type: "select" as const, optionsEndpoint: "/api/classes?limit=100" },
    { key: "gender", label: "Género", type: "select" as const, options: [{ value: "masculino", label: "Masculino" }, { value: "feminino", label: "Feminino" }] },
  ]
  const sortOptions = [
    { field: "name", label: "Nome" },
    { field: "createdAt", label: "Data de registo" },
  ]

  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<Student | null>(null)
  const [deleteItem, setDeleteItem] = useState<Student | null>(null)
  const [deactivateItem, setDeactivateItem] = useState<Student | null>(null)

  const handleDeactivate = async () => {
    if (!deactivateItem) return
    const res = await fetch(`/api/students/${deactivateItem.id}/deactivate`, { method: "POST" })
    if (res.ok) {
      setDeactivateItem(null)
      refetch()
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const res = await fetch(`/api/students/${deleteItem.id}`, { method: "DELETE" })
    if (res.ok) {
      setDeleteItem(null)
      refetch()
    }
  }

  const renderRow = (item: Student) => (
    <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800/50 text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
      <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
            {item.foto ? (
              <Image src={item.foto} alt={item.name} fill className="rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {item.name.charAt(0)}
              </div>
            )}
          </div>
          <Link href={`/list/students/${item.id}`} className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-xs sm:text-sm max-w-[80px] sm:max-w-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {item.name}
          </Link>
        </div>
      </td>
      <td className="hidden md:table-cell text-zinc-600 dark:text-zinc-400 text-xs">
        {item.email}
      </td>
      <td className="py-2.5 sm:py-3 px-1.5 sm:px-2">
        {item.class ? (
          <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded text-[9px] sm:text-[10px] font-bold">
            {item.class.name}
          </span>
        ) : (
          <span className="text-zinc-400 text-xs">—</span>
        )}
      </td>
      <td className="hidden xl:table-cell text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
        {item.phone}
      </td>
      <td className="px-1.5 sm:px-2">
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => setEditItem(item)}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
          >
            <Pencil size={13} />
          </button>
          {isAdmin && item.hasAccount && item.userActive !== false && (
            <button
              onClick={() => setDeactivateItem(item)}
              title="Desactivar conta"
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-amber-600 hover:text-white transition-all active:scale-90"
            >
              <UserX size={13} />
            </button>
          )}
          {isAdmin && item.hasAccount && item.userActive === false && (
            <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded text-[9px] font-medium">Inactivo</span>
          )}
          {isAdmin && (
            <button
              onClick={() => setDeleteItem(item)}
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-rose-600 hover:text-white transition-all active:scale-90"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="m-2 sm:m-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-0 lg:flex-row lg:items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Alunos</h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Gerencie os alunos matriculados</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex-1 sm:w-56 md:w-64">
            <TableSearch value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <FilterPanel config={filterConfig} filters={filters} onChange={setFilters} onClear={clearFilters} activeCount={activeFilterCount} />
            <SortButton options={sortOptions} sort={sort} onChange={setSort} />
            {isAdmin && (
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm active:scale-95 shadow-lg shadow-indigo-600/20 transition"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Adicionar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2.5 px-2.5 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-indigo-500" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-sm">Nenhum aluno encontrado</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={data} />
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <FormModal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo Aluno">
        <StudentForm mode="create" onSuccess={() => { setCreateOpen(false); refetch() }} onCancel={() => setCreateOpen(false)} />
      </FormModal>

      <FormModal open={!!editItem} onClose={() => setEditItem(null)} title="Editar Aluno">
        {editItem && (
          <StudentForm mode="edit" initialData={editItem} onSuccess={() => { setEditItem(null); refetch() }} onCancel={() => setEditItem(null)} />
        )}
      </FormModal>

      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name || ""} />

      <DeleteConfirmModal
        open={!!deactivateItem}
        onClose={() => setDeactivateItem(null)}
        onConfirm={handleDeactivate}
        itemName={deactivateItem?.name || ""}
        title="Desactivar conta"
        message={`Tem a certeza que deseja desactivar a conta de "${deactivateItem?.name}"? O utilizador não conseguirá aceder à plataforma.`}
        confirmLabel="Desactivar"
      />
    </div>
  )
}

export default StudentListPage
