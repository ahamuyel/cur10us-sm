"use client"

import { Megaphone } from "lucide-react"

const announcementsData = [
  {
    title: "Lorem ipsum dolor sit amet",
    date: "2025-11-23",
    description:
      "Ele é leve, rápido e isolado do sistema host, mas compartilha o kernel do host, o que o torna mais eficiente que uma máquina virtual.",
    color: "bg-cyan-100",
  },
  {
    title: "Cur10usX school update",
    date: "2025-11-22",
    description:
      "Nova funcionalidade de dashboards implementada para professores e gestores, com métricas em tempo real.",
    color: "bg-indigo-100",
  },
  {
    title: "Evento escolar próximo",
    date: "2025-11-21",
    description:
      "Não perca o encontro de pais e mestres, será uma ótima oportunidade para feedbacks sobre desempenho.",
    color: "bg-amber-100",
  },
  {
    title: "Aviso importante",
    date: "2025-11-20",
    description:
      "Atualização de horários de aula e exames publicada no sistema. Verifique seu dashboard para mais informações.",
    color: "bg-pink-100",
  },
]

const Announcements = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Megaphone size={18} /> Announcements
        </h1>
        <span className="text-xs text-indigo-600 cursor-pointer hover:underline">
          View All
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {announcementsData.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-white rounded px-2 py-0.5">
                {item.date}
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Announcements
