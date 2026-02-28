import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      // Delete any existing tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      })

      const token = randomUUID()
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.passwordResetToken.create({
        data: { token, expires, userId: user.id },
      })

      const resetUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@cur10usx.com",
        to: email,
        subject: "Redefinir senha — Cur10usX",
        html: `
          <h2>Redefinir senha</h2>
          <p>Olá ${user.name},</p>
          <p>Você solicitou a redefinição da sua senha. Clique no link abaixo:</p>
          <p><a href="${resetUrl}">Redefinir minha senha</a></p>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não fez essa solicitação, ignore este e-mail.</p>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
