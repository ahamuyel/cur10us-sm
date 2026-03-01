import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react"
import AnimateOnScroll from "./AnimateOnScroll"

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboards intuitivos",
    description: "Visão geral em tempo real com métricas claras para cada perfil de utilizador.",
    color: "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Users,
    title: "Gestão de alunos",
    description: "Matrículas, perfis, turmas e acompanhamento individual completo.",
    color: "bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: ClipboardCheck,
    title: "Controlo de assiduidade",
    description: "Registo de presenças por aula ou dia, com relatórios automáticos.",
    color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: GraduationCap,
    title: "Notas e avaliações",
    description: "Lançamento de notas por trimestre, exames e trabalhos com médias automáticas.",
    color: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  },
  {
    icon: MessageSquare,
    title: "Comunicação interna",
    description: "Avisos, mensagens e notificações para toda a comunidade escolar.",
    color: "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
  },
  {
    icon: FileText,
    title: "Candidaturas online",
    description: "Formulário público de matrícula com acompanhamento de estado.",
    color: "bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
  },
  {
    icon: Calendar,
    title: "Calendário e horários",
    description: "Horários de aulas, exames e eventos escolares num só lugar.",
    color: "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400",
  },
  {
    icon: BarChart3,
    title: "Relatórios detalhados",
    description: "Análises de desempenho, frequência e evolução dos alunos.",
    color: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  },
]

export default function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Tudo que a sua escola precisa,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">num só lugar</span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Ferramentas pensadas para facilitar o dia-a-dia de quem faz a educação acontecer.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, i) => {
          const Icon = item.icon
          return (
            <AnimateOnScroll key={item.title} delay={i * 75}>
              <div className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all h-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </AnimateOnScroll>
          )
        })}
      </div>
    </section>
  )
}
