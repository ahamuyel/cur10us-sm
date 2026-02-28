import { NextResponse } from "next/server"
import { compare, hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { changePasswordSchema } from "@/lib/validations/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = changePasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = parsed.data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: "Conta sem palavra-passe definida" },
        { status: 400 }
      )
    }

    const isValid = await compare(currentPassword, user.hashedPassword)
    if (!isValid) {
      return NextResponse.json(
        { error: "Palavra-passe actual incorrecta" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword, mustChangePassword: false },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
