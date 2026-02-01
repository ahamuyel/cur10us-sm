import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 gap-6 max-w-4xl mx-auto">
        
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Sistema de Gestão Escolar Inteligente
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Gestão escolar com foco no que importa:
          <span className="block text-indigo-600 dark:text-indigo-400">
            aprendizagem e progresso
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          O Cur10usX ajuda escolas a acompanhar desempenho, frequência e evolução
          dos alunos em tempo real, com dashboards claros para gestores,
          professores, alunos e responsáveis.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Acessar plataforma
          </Link>

          <Link
            href="#features"
            className="px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Ver funcionalidades
          </Link>
        </div>

      </section>

      {/* VALUE PROPOSITION */}
      <section
        id="features"
        className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {[
          {
            title: "Decisões baseadas em dados",
            description:
              "Dashboards educacionais que mostram o que está funcionando — e o que precisa melhorar.",
          },
          {
            title: "Foco pedagógico",
            description:
              "Indicadores claros de desempenho, frequência e evolução do aluno.",
          },
          {
            title: "Multi-perfil",
            description:
              "Experiência personalizada para gestores, professores, alunos e responsáveis.",
          },
          {
            title: "Acessível e escalável",
            description:
              "Pensado para contextos com internet instável e uso mobile.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm"
          >
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Pronto para transformar a gestão da sua escola?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Comece agora e acompanhe o progresso educacional de forma clara e
          eficiente.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Entrar no Cur10usX
        </Link>
      </section>

    </main>
  )
}
