import { NextResponse } from "next/server"
import { hash, genSalt } from "bcryptjs"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/validations/auth"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"

const signupLimiter = rateLimit({ maxRequests: 5, windowMs: 10 * 60 * 1000 }) // 5 per 10 min

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
    const limit = await signupLimiter(ip)

    if (!limit.success) {
      const resetSec = Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000)
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${resetSec} segundos.` },
        { status: 429, headers: { "Retry-After": String(resetSec) } }
      )
    }

    const body = await req.json()
    const parsed = signUpSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, await genSalt(12))

    // Create user with emailVerified = false
    const user = await prisma.user.create({
      data: { name, email, hashedPassword, provider: "credentials", isActive: false, emailVerified: false },
    })

    // Create email verification token
    const token = randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.emailVerificationToken.create({
      data: { token, expires, userId: user.id },
    })

    // Send verification email
    const verifyUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/verify-email?token=${token}`

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@cur10usx.com",
      to: email,
      subject: "Verifique o seu e-mail — Cur10usX",
      html: `
        <h2>Verifique o seu e-mail</h2>
        <p>Olá ${name},</p>
        <p>Obrigado por se registar no Cur10usX! Para completar o seu registo, clique no link abaixo:</p>
        <p><a href="${verifyUrl}">Verificar o meu e-mail</a></p>
        <p>Este link expira em 24 horas.</p>
        <p>Se não fez esta solicitação, ignore este e-mail.</p>
      `,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
