import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { resetPasswordSchema } from "@/lib/validations/auth"

export async function POST(req: Request) {
  try {
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
      data: { hashedPassword },
    })

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
