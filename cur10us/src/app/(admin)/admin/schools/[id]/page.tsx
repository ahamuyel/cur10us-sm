"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Zap, RotateCcw, Ban, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import ConfirmActionModal from "@/components/ui/ConfirmActionModal"

interface SchoolDetail {
  id: string
  name: string
  slug: string
  nif?: string
  email: string
  phone: string
  address: string
  city: string
  provincia: string
  status: string
  rejectReason?: string
  createdAt: string
  _count: { users: number; teachers: number; students: number; parents: number; applications: number }
}

const REVERT_TARGET: Record<string, string> = {
  ativa: "aprovada",
  aprovada: "pendente",
  rejeitada: "pendente",
  suspensa: "ativa",
}

export default function SchoolDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [school, setSchool] = useState<SchoolDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [showReject, setShowReject] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"revert" | "suspend" | "delete" | null>(null)

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
      const data = await res.json()
      if (action === "activate") {
        if (data.adminCreated) {
          alert(`Escola activada! Conta de administrador criada automaticamente.\n\nE-mail: ${data.adminEmail}\nUma palavra-passe temporária foi enviada para o e-mail da escola.`)
        } else if (data.existingAdmin) {
          alert(`Escola activada! O administrador existente (${data.adminEmail}) foi activado e notificado por e-mail.`)
        }
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

  async function handleRevert() {
    const res = await fetch(`/api/admin/schools/${id}/revert`, { method: "POST" })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || "Erro")
      return
    }
    setConfirmAction(null)
    fetchSchool()
  }

  async function handleSuspend() {
    const res = await fetch(`/api/admin/schools/${id}/suspend`, { method: "POST" })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || "Erro")
      return
    }
    setConfirmAction(null)
    fetchSchool()
  }

  async function handleDelete() {
    const res = await fetch(`/api/admin/schools/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || "Erro")
      return
    }
    router.replace("/admin/schools")
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
  const canRevert = !!REVERT_TARGET[school.status]
  const canSuspend = school.status === "ativa"
  const revertTarget = REVERT_TARGET[school.status]

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
          <div><span className="text-zinc-500">Cidade:</span> <span className="text-zinc-900 dark:text-zinc-100">{school.city}/{school.provincia}</span></div>
          {school.nif && <div><span className="text-zinc-500">NIF:</span> <span className="text-zinc-900 dark:text-zinc-100">{school.nif}</span></div>}
          <div><span className="text-zinc-500">Criada em:</span> <span className="text-zinc-900 dark:text-zinc-100">{new Date(school.createdAt).toLocaleDateString("pt")}</span></div>
        </div>

        {school.rejectReason && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-6 text-sm">
            <span className="font-medium text-red-600 dark:text-red-400">Motivo da rejeição:</span>
            <p className="text-red-600 dark:text-red-400 mt-1">{school.rejectReason}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Utilizadores", value: school._count.users },
            { label: "Professores", value: school._count.teachers },
            { label: "Alunos", value: school._count.students },
            { label: "Encarregados", value: school._count.parents },
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

          {/* Revert */}
          {canRevert && !showReject && (
            <button
              onClick={() => setConfirmAction("revert")}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reverter para {revertTarget}
            </button>
          )}

          {/* Suspend */}
          {canSuspend && !showReject && (
            <button
              onClick={() => setConfirmAction("suspend")}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              <Ban className="w-4 h-4" />
              Suspender
            </button>
          )}

          {/* Delete */}
          {!showReject && (
            <button
              onClick={() => setConfirmAction("delete")}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Confirm Modals */}
      <ConfirmActionModal
        open={confirmAction === "revert"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleRevert}
        title="Reverter Estado"
        message={`Tem certeza que deseja reverter o estado da escola "${school.name}" de "${school.status}" para "${revertTarget}"?`}
        confirmLabel={`Reverter para ${revertTarget}`}
        confirmColor="amber"
      />

      <ConfirmActionModal
        open={confirmAction === "suspend"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleSuspend}
        title="Suspender Escola"
        message={`Tem certeza que deseja suspender a escola "${school.name}"? Todos os ${school._count.users} utilizadores serão desativados.`}
        confirmLabel="Suspender"
        confirmColor="red"
      />

      <ConfirmActionModal
        open={confirmAction === "delete"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleDelete}
        title="Eliminar Escola"
        message={`Tem certeza que deseja eliminar permanentemente a escola "${school.name}"? Todos os dados serão perdidos. Esta ação não pode ser desfeita.`}
        confirmLabel="Eliminar permanentemente"
        confirmColor="red"
      />
    </div>
  )
}
