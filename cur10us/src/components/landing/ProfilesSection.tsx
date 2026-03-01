import { LayoutDashboard, BookOpen, ClipboardList, ShieldCheck, CheckCircle2 } from "lucide-react"
import AnimateOnScroll from "./AnimateOnScroll"

const profiles = [
  {
    icon: LayoutDashboard,
    role: "Gestores Escolares",
    color: "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
    benefits: [
      "Visão geral da escola em tempo real",
      "Relatórios de desempenho e assiduidade",
      "Gestão de turmas, professores e admissões",
      "Controlo financeiro e estatísticas",
    ],
  },
  {
    icon: BookOpen,
    role: "Professores",
    color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
    benefits: [
      "Lançamento rápido de notas e presenças",
      "Calendário de aulas e exames",
      "Acompanhamento individual do aluno",
      "Gestão de trabalhos e submissões",
    ],
  },
  {
    icon: ClipboardList,
    role: "Alunos",
    color: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
    benefits: [
      "Consulta de notas e boletins",
      "Horário e calendário escolar",
      "Histórico de assiduidade",
      "Portfólio académico digital",
    ],
  },
  {
    icon: ShieldCheck,
    role: "Encarregados de Educação",
    color: "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
    benefits: [
      "Acompanhamento do educando em tempo real",
      "Notificações de faltas e desempenho",
      "Comunicação directa com a escola",
      "Acesso a boletins e relatórios",
    ],
  },
]

export default function ProfilesSection() {
  return (
    <section id="para-quem" className="py-24 px-6 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Uma experiência para{" "}
            <span className="text-indigo-600 dark:text-indigo-400">cada perfil</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Cada utilizador acede ao que é relevante para o seu papel na comunidade escolar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile, i) => {
            const Icon = profile.icon
            return (
              <AnimateOnScroll key={profile.role} delay={i * 100}>
                <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 h-full">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${profile.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{profile.role}</h3>
                  <ul className="space-y-2">
                    {profile.benefits.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
