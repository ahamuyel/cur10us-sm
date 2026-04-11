import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"

const verifyLimiter = rateLimit({ maxRequests: 3, windowMs: 60 * 60 * 1000 }) // 3 per hour
const resendLimiter = rateLimit({ maxRequests: 5, windowMs: 60 * 60 * 1000 }) // 5 per hour

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

/**
 * POST /api/auth/verify-email
 * Verifies the email using a token from the query params
 */
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 })
    }

    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      )
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ])

    return NextResponse.json({ success: true, email: verificationToken.user.email })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/resend-verification
 * Resends the verification email to the provided email address
 */
export async function PATCH(req: Request) {
  try {
    const ip = getIp(req)
    const limit = await resendLimiter(ip)

    if (!limit.success) {
      const resetSec = Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000)
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${resetSec} segundos.` },
        { status: 429, headers: { "Retry-After": String(resetSec) } }
      )
    }

    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to prevent email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing verification tokens
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    })

    const token = randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.emailVerificationToken.create({
      data: { token, expires, userId: user.id },
    })

    const verifyUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/verify-email?token=${token}`

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@cur10usx.com",
      to: email,
      subject: "Verifique o seu e-mail — Cur10usX",
      html: `
        <h2>Verifique o seu e-mail</h2>
        <p>Olá ${user.name},</p>
        <p>Para completar o seu registo, clique no link abaixo:</p>
        <p><a href="${verifyUrl}">Verificar o meu e-mail</a></p>
        <p>Este link expira em 24 horas.</p>
        <p>Se não fez esta solicitação, ignore este e-mail.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
