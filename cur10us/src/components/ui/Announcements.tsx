"use client"

import { Megaphone } from "lucide-react"

const announcementsData = [
  {
    title: "Reunião de pais e mestres",
    date: "2026-02-27",
    description:
      "Encontro marcado para discutir o desempenho dos alunos no primeiro bimestre.",
    color: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800",
  },
  {
    title: "Atualização do sistema",
    date: "2026-02-25",
    description:
      "Nova funcionalidade de dashboards para professores e gestores com métricas em tempo real.",
    color: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800",
  },
  {
    title: "Evento escolar próximo",
    date: "2026-02-22",
    description:
      "Não perca a feira de ciências, será uma ótima oportunidade para apresentação de projetos.",
    color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  },
  {
    title: "Aviso importante",
    date: "2026-02-20",
    description:
      "Atualização de horários de aula e provas publicada. Verifique seu dashboard.",
    color: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
  },
]

const Announcements = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 sm:p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Megaphone size={16} className="text-zinc-400" />
          Avisos
        </h2>
        <span className="text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline font-medium">
          Ver todos
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {announcementsData.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} rounded-xl p-3 sm:p-4 border transition-shadow hover:shadow-sm`}
          >
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm leading-snug">
                {item.title}
              </h3>
              <span className="text-[10px] sm:text-xs text-zinc-500 bg-white/80 dark:bg-zinc-800/80 rounded-md px-1.5 py-0.5 shrink-0">
                {item.date}
              </span>
            </div>
            <p className="text-[11px] sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Announcements
