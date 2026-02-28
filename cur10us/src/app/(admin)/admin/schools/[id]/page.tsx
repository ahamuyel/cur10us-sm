"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Zap } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

interface SchoolDetail {
  id: string
  name: string
  slug: string
  cnpj?: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  status: string
  rejectReason?: string
  createdAt: string
  _count: { users: number; teachers: number; students: number; parents: number; applications: number }
}

export default function SchoolDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [school, setSchool] = useState<SchoolDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [showReject, setShowReject] = useState(false)

  async function fetchSchool() {
    try {
      const res = await fetch(`/api/admin/schools/${id}`)
      if (!res.ok) { router.replace("/admin/schools"); return }
      setSchool(await res.json())
    } catch {
      router.replace("/admin/schools")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSchool() }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAction(action: "approve" | "reject" | "activate") {
    setActionLoading(action)
    try {
      const body = action === "reject" ? { reason: rejectReason } : undefined
      const res = await fetch(`/api/admin/schools/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Erro")
        return
      }
      setShowReject(false)
      setRejectReason("")
      fetchSchool()
    } catch {
      alert("Erro de conexão")
    } finally {
      setActionLoading("")
    }
  }

  if (loading || !school) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  const canApprove = school.status === "pendente"
  const canActivate = school.status === "aprovada"
  const canReject = school.status === "pendente" || school.status === "aprovada"

  return (
    <div className="p-6 max-w-3xl">
      <button
        onClick={() => router.push("/admin/schools")}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 transition"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{school.name}</h1>
            <p className="text-sm text-zinc-500">{school.slug}</p>
          </div>
          <StatusBadge status={school.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-zinc-500">E-mail:</span> <span className="text-zinc-900 dark:text-zinc-100">{school.email}</span></div>
          <div><span className="text-zinc-500">Telefone:</span> <span className="text-zinc-900 dark:text-zinc-100">{school.phone}</span></div>
          <div><span className="text-zinc-500">Endereço:</span> <span className="text-zinc-900 dark:text-zinc-100">{school.address}</span></div>
          <div><span className="text-zinc-500">Cidade:</span> <span className="text-zinc-900 dark:text-zinc-100">{school.city}/{school.state}</span></div>
          {school.cnpj && <div><span className="text-zinc-500">CNPJ:</span> <span className="text-zinc-900 dark:text-zinc-100">{school.cnpj}</span></div>}
          <div><span className="text-zinc-500">Criada em:</span> <span className="text-zinc-900 dark:text-zinc-100">{new Date(school.createdAt).toLocaleDateString("pt-BR")}</span></div>
        </div>

        {school.rejectReason && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-6 text-sm">
            <span className="font-medium text-red-600 dark:text-red-400">Motivo da rejeição:</span>
            <p className="text-red-600 dark:text-red-400 mt-1">{school.rejectReason}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Professores", value: school._count.teachers },
            { label: "Alunos", value: school._count.students },
            { label: "Responsáveis", value: school._count.parents },
            { label: "Solicitações", value: school._count.applications },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-zinc-50 dark:bg-zinc-800 p-3 text-center">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reject form */}
        {showReject && (
          <div className="mb-4">
            <textarea
              placeholder="Motivo da rejeição (mín. 5 caracteres)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {canApprove && !showReject && (
            <button
              onClick={() => handleAction("approve")}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {actionLoading === "approve" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Aprovar
            </button>
          )}
          {canActivate && (
            <button
              onClick={() => handleAction("activate")}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {actionLoading === "activate" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Ativar
            </button>
          )}
          {canReject && !showReject && (
            <button
              onClick={() => setShowReject(true)}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Rejeitar
            </button>
          )}
          {showReject && (
            <>
              <button
                onClick={() => handleAction("reject")}
                disabled={!!actionLoading || rejectReason.length < 5}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading === "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Confirmar rejeição
              </button>
              <button
                onClick={() => setShowReject(false)}
                className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
