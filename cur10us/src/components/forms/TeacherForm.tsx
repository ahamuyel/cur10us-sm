"use client"
import { useState, KeyboardEvent } from "react"
import FormField from "@/components/ui/FormField"
import { createTeacherSchema } from "@/lib/validations/entities"
import { X } from "lucide-react"

type TeacherData = {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  foto?: string | null
  subjects: string[]
  classes: string[]
}

type Props = {
  mode: "create" | "edit"
  initialData?: TeacherData
  onSuccess: () => void
  onCancel: () => void
}

const inputClass = "w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500 transition"

const TeacherForm = ({ mode, initialData, onSuccess, onCancel }: Props) => {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    foto: initialData?.foto || "",
    subjects: initialData?.subjects || [],
    classes: initialData?.classes || [],
  })
  const [subjectInput, setSubjectInput] = useState("")
  const [classInput, setClassInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const addTag = (field: "subjects" | "classes", value: string) => {
    const trimmed = value.trim()
    if (trimmed && !form[field].includes(trimmed)) {
      setForm((f) => ({ ...f, [field]: [...f[field], trimmed] }))
    }
  }

  const removeTag = (field: "subjects" | "classes", index: number) => {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>, field: "subjects" | "classes", setter: (v: string) => void, value: string) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(field, value)
      setter("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setApiError("")

    const parsed = createTeacherSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const url = mode === "edit" ? `/api/teachers/${initialData?.id}` : "/api/teachers"
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error || "Erro ao salvar")
        return
      }
      onSuccess()
    } catch {
      setApiError("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {apiError && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-sm">{apiError}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nome" error={errors.name}>
          <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </FormField>
        <FormField label="E-mail" error={errors.email}>
          <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Telefone" error={errors.phone}>
          <input className={inputClass} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </FormField>
        <FormField label="Foto (URL)" error={errors.foto}>
          <input className={inputClass} value={form.foto} onChange={(e) => setForm((f) => ({ ...f, foto: e.target.value }))} />
        </FormField>
      </div>

      <FormField label="Endereço" error={errors.address}>
        <input className={inputClass} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
      </FormField>

      <FormField label="Disciplinas (Enter para adicionar)" error={errors.subjects}>
        <div className="flex flex-wrap gap-1.5 mb-1">
          {form.subjects.map((s, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium">
              {s}
              <button type="button" onClick={() => removeTag("subjects", i)}><X size={12} /></button>
            </span>
          ))}
        </div>
        <input
          className={inputClass}
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          onKeyDown={(e) => handleTagKey(e, "subjects", setSubjectInput, subjectInput)}
          placeholder="Digite e pressione Enter"
        />
      </FormField>

      <FormField label="Turmas (Enter para adicionar)" error={errors.classes}>
        <div className="flex flex-wrap gap-1.5 mb-1">
          {form.classes.map((c, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs font-medium">
              {c}
              <button type="button" onClick={() => removeTag("classes", i)}><X size={12} /></button>
            </span>
          ))}
        </div>
        <input
          className={inputClass}
          value={classInput}
          onChange={(e) => setClassInput(e.target.value)}
          onKeyDown={(e) => handleTagKey(e, "classes", setClassInput, classInput)}
          placeholder="Digite e pressione Enter"
        />
      </FormField>

      <div className="flex items-center gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-600/20">
          {loading ? "Salvando..." : mode === "edit" ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  )
}

export default TeacherForm
