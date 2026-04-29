"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { signIn as nextAuthSignIn, getSession } from "next-auth/react"
import { signInSchema } from "@/lib/validations/auth"
import { getDashboardPath } from "@/lib/routes"

export default function SignInClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const reason = searchParams.get("reason")

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const session = await getSession()

      if (session) {
        const getCookieValue = (name: string) => {
          const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
          return match ? decodeURIComponent(match[2]) : null
        }

        const callbackUrl = getCookieValue("next-auth-callback-url")

        if (callbackUrl && callbackUrl.startsWith("/")) {
          document.cookie = "next-auth-callback-url=; max-age=0; path=/"
          router.push(callbackUrl)
          return
        }

        const urlCallbackUrl = searchParams.get("callbackUrl")

        if (urlCallbackUrl && urlCallbackUrl.startsWith("/")) {
          router.push(urlCallbackUrl)
        } else {
          router.push("/minha-area")
        }
      }
    }

    checkSessionAndRedirect()
  }, [router, searchParams])

  function validateForm() {
    const newErrors: { email?: string; password?: string } = {}
    const parsed = signInSchema.safeParse({ email, password })

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field === "email") newErrors.email = issue.message
        if (field === "password") newErrors.password = issue.message
      })
    }

    setErrors(newErrors)
    return parsed.success
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) return

    setLoading(true)

    try {
      const res = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setErrors({ general: "E-mail ou senha incorretos" })
        return
      }

      const session = await getSession()

      if (!session?.user?.emailVerified) {
        router.push("/verify-email")
        return
      }

      const dashboard = getDashboardPath(session?.user?.id)
      const isSuperAdmin = session?.user?.role === "super_admin"

      const callbackUrl = searchParams.get("callbackUrl")

      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.push(callbackUrl)
      } else if (isSuperAdmin) {
        router.push("/admin")
      } else if (session?.user?.isActive && session?.user?.schoolId) {
        router.push(dashboard)
      } else {
        router.push("/minha-area")
      }

      router.refresh()
    } catch {
      setErrors({ general: "Erro de conexão. Tente novamente." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-6">

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          <div className="p-8">

            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Entre na sua conta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {reason === "session_expired" && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-600 dark:text-amber-400">
                  A sua sessão foi terminada porque iniciou sessão noutro dispositivo.
                </div>
              )}

              {errors.general && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {errors.general}
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 px-3 rounded-xl border"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full h-10 px-3 pr-10 rounded-xl border"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                disabled={loading}
                className="w-full h-10 rounded-xl bg-black text-white flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>

            </form>

            <div className="mt-6 text-center text-sm">
              Não tem conta?{" "}
              <Link href="/signup" className="text-indigo-500">
                Criar conta
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}