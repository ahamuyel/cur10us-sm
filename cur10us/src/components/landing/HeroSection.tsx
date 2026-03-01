import Link from "next/link"
import { ArrowRight, GraduationCap } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-400/20 dark:bg-violet-600/10 blur-3xl" />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-400/10 dark:bg-cyan-600/5 blur-3xl" />
      </div>

      <div className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 gap-6 max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          <GraduationCap className="w-4 h-4" />
          Plataforma de Gestão Escolar para Angola
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          A sua escola, mais{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
            organizada e eficiente
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          O Cur10usX centraliza a gestão de alunos, professores, notas, assiduidade
          e comunicação numa única plataforma. Simples de configurar, acessível
          de qualquer dispositivo.
        </p>

        <div className="flex gap-3 flex-wrap justify-center pt-2">
          <Link
            href="/signin"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition"
          >
            Entrar na plataforma
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition font-medium"
          >
            Criar conta
          </Link>
          <Link
            href="/registar-escola"
            className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition font-medium"
          >
            Registar escola
          </Link>
        </div>
      </div>
    </section>
  )
}
