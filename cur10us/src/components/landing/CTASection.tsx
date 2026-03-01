import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-28 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-indigo-400/15 dark:bg-indigo-600/10 blur-3xl" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Pronto para transformar a gestão da sua escola?
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto">
        Registe a sua escola e comece a gerir alunos, professores e resultados de forma moderna e eficiente.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/registar-escola"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition"
        >
          Registar escola
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
  )
}
