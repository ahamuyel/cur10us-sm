import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            Cur10us<span className="text-indigo-600 dark:text-indigo-400">X</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-400/20 dark:bg-violet-600/10 blur-3xl" />
          <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full bg-fuchsia-400/15 dark:bg-fuchsia-600/8 blur-3xl" />
        </div>

        {children}
      </main>
    </div>
  )
}
