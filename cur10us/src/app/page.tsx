import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  GraduationCap,
  Users,
  Wifi,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Decisões baseadas em dados",
    description:
      "Dashboards educacionais que mostram o que está funcionando — e o que precisa melhorar.",
  },
  {
    icon: GraduationCap,
    title: "Foco pedagógico",
    description:
      "Indicadores claros de desempenho, frequência e evolução do aluno.",
  },
  {
    icon: Users,
    title: "Multi-perfil",
    description:
      "Experiência personalizada para gestores, professores, alunos e responsáveis.",
  },
  {
    icon: Wifi,
    title: "Acessível e escalável",
    description:
      "Pensado para contextos com internet instável e uso mobile.",
  },
]

const roles = [
  {
    icon: LayoutDashboard,
    role: "Gestores",
    color: "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
    items: [
      "Visão geral da escola em tempo real",
      "Relatórios de desempenho e frequência",
      "Gestão de turmas e professores",
    ],
  },
  {
    icon: BookOpen,
    role: "Professores",
    color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
    items: [
      "Lançamento de notas e presenças",
      "Calendário de aulas e eventos",
      "Acompanhamento individual do aluno",
    ],
  },
  {
    icon: ClipboardList,
    role: "Alunos",
    color: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
    items: [
      "Notas e boletins atualizados",
      "Calendário escolar personalizado",
      "Histórico de frequência",
    ],
  },
  {
    icon: ShieldCheck,
    role: "Responsáveis",
    color: "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
    items: [
      "Acompanhamento do filho em tempo real",
      "Notificações de faltas e desempenho",
      "Comunicação direta com a escola",
    ],
  },
]

const stats = [
  { value: "98%", label: "Satisfação dos gestores" },
  { value: "4x", label: "Mais rápido que planilhas" },
  { value: "100%", label: "Acesso mobile" },
  { value: "24/7", label: "Disponibilidade" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-50/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="#features"
              className="hidden sm:inline-block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            >
              Funcionalidades
            </Link>
            <Link
              href="#roles"
              className="hidden sm:inline-block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            >
              Perfis
            </Link>
            <Link
              href="/signin"
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-400/20 dark:bg-violet-600/10 blur-3xl" />
        </div>

        <div className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 gap-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            <GraduationCap className="w-4 h-4" />
            Sistema de Gestão Escolar Inteligente
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Gestão escolar com foco no que importa:{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              aprendizagem e progresso
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            O Cur10usX ajuda escolas a acompanhar desempenho, frequência e evolução
            dos alunos em tempo real, com dashboards claros para gestores,
            professores, alunos e responsáveis.
          </p>

          <div className="flex gap-4 flex-wrap justify-center pt-2">
            <Link
              href="/signin"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition"
            >
              Acessar plataforma
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition font-medium"
            >
              Ver funcionalidades
            </Link>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-8 px-4">
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tudo que sua escola precisa,{" "}
            <span className="text-indigo-600 dark:text-indigo-400">num só lugar</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Ferramentas pensadas para facilitar o dia a dia de quem faz a educação acontecer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-24 px-6 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Uma experiência para{" "}
              <span className="text-indigo-600 dark:text-indigo-400">cada perfil</span>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Cada usuário acessa o que é relevante para o seu papel na comunidade escolar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <div
                  key={role.role}
                  className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${role.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{role.role}</h3>
                  <ul className="space-y-2">
                    {role.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA: Application */}
      <section className="py-20 px-6 bg-indigo-50 dark:bg-indigo-950/30 border-y border-indigo-200 dark:border-indigo-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Quer fazer parte de uma escola?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
            Envie sua solicitação de matrícula e acompanhe o status em tempo real.
          </p>
          <Link
            href="/aplicacao"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition"
          >
            Solicitar matrícula
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-indigo-400/15 dark:bg-indigo-600/10 blur-3xl" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Pronto para transformar a gestão da sua escola?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto">
          Comece agora e acompanhe o progresso educacional de forma clara e eficiente.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/signin"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition"
          >
            Entrar no Cur10usX
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/aplicacao"
            className="px-8 py-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition font-semibold"
          >
            Solicitar matrícula
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span>
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Cur10usX. Todos os direitos reservados.
          </p>
        </div>
      </footer>
  

    </main>
  )
}
