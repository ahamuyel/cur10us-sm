"use client"

import { useState } from "react"
import { Loader2, Lock } from "lucide-react"
import {
  ALL_FEATURES,
  ESSENTIAL_FEATURES,
  featureLabels,
  featureDescriptions,
  featureMenuItems,
  type FeatureKey,
} from "@/lib/features"

type Props = {
  schoolId: string
  initialFeatures: Record<string, boolean> | null
  onUpdate: () => void
}

export default function SchoolFeaturesManager({ schoolId, initialFeatures, onUpdate }: Props) {
  const [features, setFeatures] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {}
    ALL_FEATURES.forEach((f) => {
      defaults[f] = initialFeatures?.[f] ?? (ESSENTIAL_FEATURES as readonly string[]).includes(f)
    })
    return defaults
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")

  const isEssential = (feature: string) =>
    (ESSENTIAL_FEATURES as readonly string[]).includes(feature)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setSaveError("")
    try {
      const res = await fetch(`/api/admin/schools/${schoolId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      })
      if (res.ok) {
        setSaved(true)
        onUpdate()
        setTimeout(() => setSaved(false), 2000)
      } else {
        const data = await res.json()
        setSaveError(data.error || "Erro ao guardar")
      }
    } catch {
      setSaveError("Erro de conexão")
    } finally {
      setSaving(false)
    }
  }

  function toggleFeature(key: string) {
    if (isEssential(key)) return
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Funcionalidades</h3>
          <p className="text-xs text-zinc-500">Ative ou desative módulos para esta escola</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : null}
          {saved ? "Guardado!" : saving ? "Guardando..." : "Guardar alterações"}
        </button>
      </div>

      {saveError && (
        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-xs">{saveError}</div>
      )}

      <div className="grid gap-2">
        {ALL_FEATURES.map((feature) => {
          const essential = isEssential(feature)
          const enabled = features[feature]
          const menuItems = featureMenuItems[feature as FeatureKey]

          return (
            <div
              key={feature}
              role={essential ? undefined : "button"}
              tabIndex={essential ? undefined : 0}
              onClick={() => toggleFeature(feature)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFeature(feature) } }}
              className={`flex items-center justify-between p-3 rounded-xl border transition select-none ${
                essential
                  ? "bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 opacity-70"
                  : enabled
                    ? "bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-800 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {featureLabels[feature as FeatureKey]}
                  </span>
                  {essential && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-500">
                      <Lock size={10} /> Essencial
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {featureDescriptions[feature as FeatureKey]}
                </p>
                {menuItems && menuItems.length > 0 && (
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Menu: {menuItems.join(", ")}
                  </p>
                )}
              </div>

              {/* Toggle switch */}
              <div
                className={`ml-3 flex-shrink-0 relative w-11 h-6 rounded-full transition-colors ${
                  essential
                    ? "bg-zinc-300 dark:bg-zinc-700"
                    : enabled
                      ? "bg-indigo-600 dark:bg-indigo-500"
                      : "bg-zinc-300 dark:bg-zinc-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    enabled ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
