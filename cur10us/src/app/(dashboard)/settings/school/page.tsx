"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Upload, X, Check } from "lucide-react"
import Image from "next/image"

const PRESET_COLORS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#06B6D4", label: "Ciano" },
  { value: "#10B981", label: "Esmeralda" },
  { value: "#F59E0B", label: "Âmbar" },
  { value: "#f43f5e", label: "Rosa" },
  { value: "#8B5CF6", label: "Violeta" },
  { value: "#EC4899", label: "Pink" },
  { value: "#14B8A6", label: "Teal" },
]

export default function SchoolSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [schoolName, setSchoolName] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState("")
  const [customColor, setCustomColor] = useState("")
  const [message, setMessage] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/school-settings")
      .then((r) => r.json())
      .then((d) => {
        setSchoolName(d.name || "")
        setLogo(d.logo || null)
        setPrimaryColor(d.primaryColor || "")
        setCustomColor(d.primaryColor || "")
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 200 * 1024) {
      setMessage("Imagem muito grande (máx. 200KB)")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setLogo(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/school-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo, primaryColor: primaryColor || null }),
      })
      if (res.ok) {
        setMessage("Configurações guardadas com sucesso!")
        // Apply color
        if (primaryColor) {
          document.documentElement.style.setProperty("--school-primary", primaryColor)
        }
      } else {
        const d = await res.json()
        setMessage(d.error || "Erro ao guardar")
      }
    } catch {
      setMessage("Erro ao guardar")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="m-2 sm:m-3 flex flex-col gap-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Personalizar Escola</h1>
        <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">Identidade visual de {schoolName}</p>
      </div>

      {/* Logo */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">Logo da Escola</h2>
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 shrink-0">
            {logo ? (
              <Image src={logo} alt="Logo" width={96} height={96} className="w-full h-full object-contain" />
            ) : (
              <Upload size={24} className="text-zinc-400" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
            >
              Carregar logo
            </button>
            {logo && (
              <button
                onClick={() => setLogo(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1"
              >
                <X size={12} /> Remover
              </button>
            )}
            <p className="text-[10px] text-zinc-400">PNG, JPG ou SVG. Máx. 200KB.</p>
          </div>
        </div>
      </div>

      {/* Color */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">Cor Primária</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => { setPrimaryColor(c.value); setCustomColor(c.value) }}
              className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                primaryColor === c.value ? "border-zinc-900 dark:border-zinc-100 scale-110" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            >
              {primaryColor === c.value && <Check size={16} className="text-white" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">Custom:</label>
          <input
            type="color"
            value={customColor || "#6366f1"}
            onChange={(e) => { setCustomColor(e.target.value); setPrimaryColor(e.target.value) }}
            className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => { setCustomColor(e.target.value); setPrimaryColor(e.target.value) }}
            placeholder="#6366f1"
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {primaryColor && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-zinc-500">Pré-visualização:</span>
            <div className="px-4 py-2 rounded-xl text-white text-xs font-semibold" style={{ backgroundColor: primaryColor }}>
              Botão Exemplo
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Guardar
        </button>
        {message && (
          <span className={`text-xs ${message.includes("sucesso") ? "text-emerald-600" : "text-rose-600"}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  )
}
