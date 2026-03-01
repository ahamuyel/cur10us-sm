"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Clock, AlertTriangle, CheckCircle, XCircle,
  School, ArrowRight, UserPlus, KeyRound,
  ClipboardList, Sparkles, Send, ShieldCheck,
} from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import ConfirmActionModal from "@/components/ui/ConfirmActionModal"

const roleLabels: Record<string, string> = {
  school_admin: "Administrador",
  teacher: "Professor",
  student: "Aluno",
  parent: "Encarregado",
}

type Application = {
  id: string
  status: string
  role: string
  rejectReason: string | null
  createdAt: string
  school: { name: string; city: string }
}

type PublicSchool = {
  id: string
  name: string
  slug: string
}

export default function MinhaAreaPage() {
  const { data: session, status: sessionStatus } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [schools, setSchools] = useState<PublicSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)

  useEffect(() => {
    if (sessionStatus !== "authenticated") return
    Promise.all([
      fetch("/api/applications/mine").then((r) => r.json()),
      fetch("/api/schools/public").then((r) => r.json()),
    ]).then(([apps, schs]) => {
      setApplications(Array.isArray(apps) ? apps : [])
      setSchools(Array.isArray(schs) ? schs : [])
      setLoading(false)
    })
  }, [sessionStatus])

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const user = session?.user
  const hasPending = applications.some((a) => a.status === "pendente" || a.status === "em_analise")
  const hasEnrolled = applications.some((a) => a.status === "matriculada")
  const allRejected = applications.length > 0 && applications.every((a) => a.status === "rejeitada")

  const handleCancel = async () => {
    if (!cancelTarget) return
    const res = await fetch(`/api/applications/${cancelTarget}/cancel`, { method: "POST" })
    if (res.ok) {
      setApplications((prev) => prev.filter((a) => a.id !== cancelTarget))
    }
    setCancelTarget(null)
  }

  return (
    <div className="space-y-8">
      {/* 5.1 — Welcome + account state */}
      <section>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Olá, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Bem-vindo à sua área pessoal
        </p>

        {/* State card */}
        {hasEnrolled ? (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Matrícula confirmada!
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                A sua conta foi activada. Pode agora aceder à plataforma.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                Aceder ao painel <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : hasPending ? (
          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Solicitação em análise
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                A sua solicitação está a ser analisada pela escola. Receberá uma notificação quando houver uma resposta.
              </p>
            </div>
          </div>
        ) : allRejected ? (
          <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Solicitação rejeitada
              </p>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Infelizmente a sua solicitação foi rejeitada. Pode tentar noutra escola ou contactar a escola para mais informações.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Conta sem escola vinculada
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Para aceder à plataforma, solicite matrícula numa escola. Escolha uma escola abaixo e envie a sua candidatura.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 5.2 — My applications */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ClipboardList size={18} className="text-indigo-500" />
            Minhas solicitações
          </h2>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Ainda não tem nenhuma solicitação de matrícula.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        {app.school.name}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {roleLabels[app.role] || app.role} &middot; {app.school.city} &middot;{" "}
                      {new Date(app.createdAt).toLocaleDateString("pt")}
                    </p>
                    {app.rejectReason && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2 bg-red-50 dark:bg-red-950/30 rounded-lg px-2.5 py-1.5">
                        Motivo: {app.rejectReason}
                      </p>
                    )}
                  </div>
                  {app.status === "pendente" && (
                    <button
                      onClick={() => setCancelTarget(app.id)}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline shrink-0"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5.3 — New application */}
      <section className="flex items-center gap-3">
        {hasPending || hasEnrolled ? (
          <button
            disabled
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-200 dark:bg-indigo-950 text-indigo-400 text-sm font-medium cursor-not-allowed"
          >
            <UserPlus size={16} /> Nova solicitação
          </button>
        ) : (
          <Link
            href="/aplicacao"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition shadow-lg shadow-indigo-600/20"
          >
            <UserPlus size={16} /> Nova solicitação
          </Link>
        )}
        {(hasPending || hasEnrolled) && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {hasEnrolled ? "Já tem uma matrícula confirmada." : "Já tem uma solicitação em análise."}
          </p>
        )}
      </section>

      {/* 5.4 — Available schools */}
      {!hasEnrolled && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
            <School size={18} className="text-indigo-500" />
            Escolas disponíveis
          </h2>
          {schools.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Nenhuma escola disponível de momento.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {school.name}
                    </p>
                  </div>
                  <Link
                    href="/aplicacao"
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                  >
                    Solicitar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 5.5 — How it works */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-indigo-500" />
          Como funciona
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: UserPlus, label: "Criar conta", desc: "Registe-se na plataforma" },
            { icon: Send, label: "Escolher escola", desc: "Envie uma solicitação de matrícula" },
            { icon: Clock, label: "Aguardar aprovação", desc: "A escola analisa o seu pedido" },
            { icon: ShieldCheck, label: "Aceder", desc: "Conta activada, aceda ao painel" },
          ].map((step, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-3">
                <step.icon size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{step.label}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5.6 — My account */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
          <KeyRound size={18} className="text-indigo-500" />
          A minha conta
        </h2>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="space-y-2">
            <p className="text-sm text-zinc-900 dark:text-zinc-100">
              <span className="text-zinc-500 dark:text-zinc-400">Nome:</span> {user?.name}
            </p>
            <p className="text-sm text-zinc-900 dark:text-zinc-100">
              <span className="text-zinc-500 dark:text-zinc-400">E-mail:</span> {user?.email}
            </p>
          </div>
          <Link
            href="/change-password"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Alterar palavra-passe <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Cancel modal */}
      <ConfirmActionModal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancelar solicitação"
        message="Tem a certeza que deseja cancelar esta solicitação? Esta acção não pode ser desfeita."
        confirmLabel="Cancelar solicitação"
        confirmColor="red"
      />
    </div>
  )
}
