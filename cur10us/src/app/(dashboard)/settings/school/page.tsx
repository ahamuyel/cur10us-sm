"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Upload, X, Check, Download, UploadCloud, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useSchoolBrand } from "@/provider/school-brand"

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

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [custom, setCustom] = useState(value || "")

  useEffect(() => { setCustom(value || "") }, [value])

  return (
    <div>
      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">{label}</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESET_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => { onChange(c.value); setCustom(c.value) }}
            className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
              value === c.value ? "border-zinc-900 dark:border-zinc-100 scale-110" : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: c.value }}
            title={c.label}
          >
            {value === c.value && <Check size={16} className="text-white" />}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-500 dark:text-zinc-400">Custom:</label>
        <input
          type="color"
          value={custom || "#6366f1"}
          onChange={(e) => { setCustom(e.target.value); onChange(e.target.value) }}
          className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer"
        />
        <input
          type="text"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); onChange(e.target.value) }}
          placeholder="#6366f1"
          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 w-28 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {value && (
          <button onClick={() => { onChange(""); setCustom("") }} className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            Limpar
          </button>
        )}
      </div>
    </div>
  )
}

export default function SchoolSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [schoolName, setSchoolName] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [abbreviation, setAbbreviation] = useState("")
  const [primaryColor, setPrimaryColor] = useState("")
  const [secondaryColor, setSecondaryColor] = useState("")
  const [sidebarColor, setSidebarColor] = useState("")
  const [message, setMessage] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const { updateBrand } = useSchoolBrand()

  useEffect(() => {
    fetch("/api/school-settings")
      .then((r) => r.json())
      .then((d) => {
        setSchoolName(d.name || "")
        setLogo(d.logo || null)
        setAbbreviation(d.abbreviation || "")
        setPrimaryColor(d.primaryColor || "")
        setSecondaryColor(d.secondaryColor || "")
        setSidebarColor(d.sidebarColor || "")
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Live preview on color change
  const handlePrimaryChange = (v: string) => {
    setPrimaryColor(v)
    updateBrand({ primaryColor: v || null })
  }
  const handleSecondaryChange = (v: string) => {
    setSecondaryColor(v)
    updateBrand({ secondaryColor: v || null })
  }
  const handleSidebarChange = (v: string) => {
    setSidebarColor(v)
    updateBrand({ sidebarColor: v || null })
  }

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
        body: JSON.stringify({
          logo,
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          sidebarColor: sidebarColor || null,
          abbreviation: abbreviation || null,
        }),
      })
      if (res.ok) {
        const d = await res.json()
        setMessage("Configurações guardadas com sucesso!")
        updateBrand({
          logo: d.logo,
          primaryColor: d.primaryColor,
          secondaryColor: d.secondaryColor,
          sidebarColor: d.sidebarColor,
          abbreviation: d.abbreviation || abbreviation,
        })
      } else {
        const d = await res.json()
        setMessage(d.error || "Erro ao guardar")
      }
    } catch {
      setMessage("Erro ao guardar")
    }
    setSaving(false)
  }

  const handleReset = () => {
    setPrimaryColor("")
    setSecondaryColor("")
    setSidebarColor("")
    updateBrand({ primaryColor: null, secondaryColor: null, sidebarColor: null })
  }

  const handleExport = async () => {
    try {
      const res = await fetch("/api/school-settings/export")
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "tema-escola.json"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setMessage("Erro ao exportar tema")
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string)
        const res = await fetch("/api/school-settings/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const d = await res.json()
          setPrimaryColor(d.primaryColor || "")
          setSecondaryColor(d.secondaryColor || "")
          setSidebarColor(d.sidebarColor || "")
          updateBrand({
            primaryColor: d.primaryColor,
            secondaryColor: d.secondaryColor,
            sidebarColor: d.sidebarColor,
          })
          setMessage("Tema importado com sucesso!")
        } else {
          const d = await res.json()
          setMessage(d.error || "Erro ao importar")
        }
      } catch {
        setMessage("Ficheiro de tema inválido")
      }
    }
    reader.readAsText(file)
    // Reset input so the same file can be re-imported
    e.target.value = ""
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
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
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
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

      {/* Abbreviation */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">Abreviatura</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Sigla curta mostrada no sidebar compacto e no mobile (máx. 5 caracteres).</p>
        <input
          type="text"
          value={abbreviation}
          onChange={(e) => setAbbreviation(e.target.value.toUpperCase().slice(0, 5))}
          placeholder="Ex: CH"
          className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 w-32 focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
          maxLength={5}
        />
      </div>

      {/* Colors */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-6">
        <ColorPicker label="Cor Primária" value={primaryColor} onChange={handlePrimaryChange} />
        <ColorPicker label="Cor Secundária" value={secondaryColor} onChange={handleSecondaryChange} />
        <ColorPicker label="Cor de Fundo do Sidebar" value={sidebarColor} onChange={handleSidebarChange} />
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">Pré-visualização</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Mini sidebar mock */}
          <div
            className="w-full sm:w-48 h-40 rounded-xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden"
            style={{ backgroundColor: sidebarColor || undefined }}
          >
            <div className="p-3 border-b border-zinc-200/30 dark:border-zinc-700/30">
              <div className="flex items-center gap-2">
                {logo ? (
                  <Image src={logo} alt="Logo" width={20} height={20} className="w-5 h-5 rounded object-contain" />
                ) : (
                  <div className="w-5 h-5 rounded bg-zinc-300 dark:bg-zinc-600" />
                )}
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{schoolName || "Escola"}</span>
              </div>
            </div>
            <div className="flex-1 p-2 flex flex-col gap-1">
              <div className="px-2 py-1.5 rounded-lg text-[10px] font-medium" style={{ backgroundColor: primaryColor ? `${primaryColor}20` : "#6366f120", color: primaryColor || "#6366f1" }}>
                Item ativo
              </div>
              <div className="px-2 py-1.5 rounded-lg text-[10px] text-zinc-500">Item inativo</div>
            </div>
            <div className="p-2 border-t border-zinc-200/30 dark:border-zinc-700/30">
              <span className="text-[8px] text-zinc-400">Powered by Cur10usX</span>
            </div>
          </div>

          {/* Buttons preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button className="px-4 py-2 rounded-xl text-white text-xs font-semibold" style={{ backgroundColor: primaryColor || "#6366f1" }}>
                Botão Primário
              </button>
              <button className="px-4 py-2 rounded-xl text-white text-xs font-semibold" style={{ backgroundColor: secondaryColor || "#06B6D4" }}>
                Botão Secundário
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: primaryColor || "#6366f1" }}>Texto primário</span>
              <span className="text-xs font-semibold" style={{ color: secondaryColor || "#06B6D4" }}>Texto secundário</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Guardar
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1.5"
        >
          <RotateCcw size={14} />
          Repor Padrão
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1.5"
        >
          <Download size={14} />
          Exportar Tema
        </button>
        <div>
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            onClick={() => importRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1.5"
          >
            <UploadCloud size={14} />
            Importar Tema
          </button>
        </div>
        {message && (
          <span className={`text-xs ${message.includes("sucesso") ? "text-emerald-600" : "text-rose-600"}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  )
}
