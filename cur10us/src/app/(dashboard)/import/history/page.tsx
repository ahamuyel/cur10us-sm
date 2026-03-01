"use client"

import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Download, FileSpreadsheet } from "lucide-react"
import { useEntityList } from "@/hooks/useEntityList"
import Pagination from "@/components/ui/Pagination"
import StatusBadge from "@/components/ui/StatusBadge"

type ImportJob = {
  id: string
  filename: string
  userType: string
  status: string
  totalRows: number
  successCount: number
  failedCount: number
  createdAt: string
  importedBy: { id: string; name: string }
}

const typeLabels: Record<string, string> = {
  student: "Alunos",
  teacher: "Professores",
  parent: "Encarregados",
}

export default function ImportHistoryPage() {
  const router = useRouter()
  const { data, totalPages, page, setPage, loading } = useEntityList<ImportJob>({ endpoint: "/api/import", limit: 10 })

  return (
    <div className="m-2 sm:m-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/import")}
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">Histórico de Importações</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Todas as importações realizadas nesta escola</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-indigo-500" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <FileSpreadsheet size={40} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <p className="text-zinc-400 text-sm">Nenhuma importação realizada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{job.filename}</span>
                  <StatusBadge status={job.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
                  <span>{typeLabels[job.userType] || job.userType}</span>
                  <span>{job.successCount}/{job.totalRows} importados</span>
                  {job.failedCount > 0 && <span className="text-rose-500">{job.failedCount} falhados</span>}
                  <span>{new Date(job.createdAt).toLocaleDateString("pt")}</span>
                  <span>por {job.importedBy.name}</span>
                </div>
              </div>
              <a
                href={`/api/import/${job.id}/export`}
                className="shrink-0 ml-2 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white transition"
                title="Descarregar relatório"
              >
                <Download size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
