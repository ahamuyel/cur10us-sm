import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { rateLimit } from "@/lib/rate-limit"

const resetLimiter = rateLimit({ maxRequests: 5, windowMs: 60 * 60 * 1000 }) // 5 per hour

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

export async function POST(req: Request) {
  try {
    const ip = getIp(req)
    const limit = await resetLimiter(ip)

    if (!limit.success) {
      const resetSec = Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000)
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${resetSec} segundos.` },
        { status: 429, headers: { "Retry-After": String(resetSec) } }
      )
    }

    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 12)

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { hashedPassword, mustChangePassword: false },
    })

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    })

    return NextResponse.json({ success: true, email: resetToken.user.email })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
