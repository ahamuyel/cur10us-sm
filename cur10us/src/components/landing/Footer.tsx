import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold tracking-tight">
              Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span>
            </span>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Plataforma de gestão escolar moderna, pensada para o contexto angolano.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Plataforma</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#funcionalidades" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Funcionalidades</a></li>
              <li><a href="#para-quem" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Para quem</a></li>
              <li><a href="#faq" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Perguntas frequentes</a></li>
            </ul>
          </div>

          {/* Acesso */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Acesso</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="/signin" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Entrar</Link></li>
              <li><Link href="/registar-escola" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Registar escola</Link></li>
              <li><Link href="/aplicacao" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Solicitar matrícula</Link></li>
              <li><Link href="/aplicacao/status" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Acompanhar candidatura</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>suporte@cur10usx.com</li>
              <li>Luanda, Angola</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Cur10usX. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/termos" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Termos de uso</Link>
            <Link href="/privacidade" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
