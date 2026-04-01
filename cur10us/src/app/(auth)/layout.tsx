import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-6 md:p-10">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 dark:bg-indigo-600/5 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-400/10 dark:bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl font-bold tracking-tight">
              Cur10us
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                X
              </span>
            </span>
          </Link>
        </div>

        {children}

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} Cur10usX. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
