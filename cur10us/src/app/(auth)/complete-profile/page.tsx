"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2, CheckCircle2 } from "lucide-react"

interface PublicSchool {
  id: string
  name: string
  slug: string
}

const ROLES = [
  { value: "student", label: "Aluno" },
  { value: "teacher", label: "Professor" },
  { value: "parent", label: "Encarregado" },
  { value: "school_admin", label: "Administrador de Escola" },
]

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"

export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()

  const [schools, setSchools] = useState<PublicSchool[]>([])
  const [schoolId, setSchoolId] = useState("")
  const [role, setRole] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
    }
    // If profile is already complete, redirect
    if (session?.user?.profileComplete) {
      router.replace("/dashboard")
    }
  }, [status, session, router])

  useEffect(() => {
    fetch("/api/schools/public")
      .then((r) => r.json())
      .then((data) => setSchools(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!schoolId) {
      setError("Selecione uma escola")
      return
    }
    if (!role) {
      setError("Selecione um cargo")
      return
    }

    setLoading(true)
    try {
      // Create an application for this Google user
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          phone: "",
          role,
          schoolId,
          message,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Erro ao enviar solicitação")
        setLoading(false)
        return
      }

      // Mark profile as complete
      await fetch("/api/auth/complete-profile", { method: "POST" })

      // Refresh the session to get updated profileComplete
      await update()

      setSuccess(true)
      setTimeout(() => {
        router.push("/aplicacao/status")
      }, 2000)
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Solicitação enviada!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            A sua solicitação foi enviada com sucesso. Será redirecionado em instantes...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Complete o seu perfil</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Selecione a escola e o cargo pretendido para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* School */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
              Escola
            </label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              disabled={loading}
              className={inputClass}
            >
              <option value="">Selecione uma escola</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
              Cargo
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className={inputClass}
            >
              <option value="">Selecione o cargo pretendido</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
              Mensagem (opcional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              placeholder="Informações adicionais..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {loading ? "Enviando..." : "Enviar solicitação"}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-sm text-indigo-700 dark:text-indigo-400">
          Conectado como <strong>{session?.user?.email}</strong>. A administração da escola irá avaliar a sua solicitação.
        </div>
      </div>
    </div>
  )
}
