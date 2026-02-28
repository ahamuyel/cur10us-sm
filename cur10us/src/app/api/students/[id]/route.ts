import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/api-auth"
import { updateStudentSchema } from "@/lib/validations/entities"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const student = await prisma.student.findUnique({
      where: { id },
      include: { parents: { select: { id: true, name: true } } },
    })
    if (!student) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 })
    }
    return NextResponse.json(student)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireRole(["admin"])
    if (authError) return authError

    const { id } = await params
    const body = await req.json()
    const parsed = updateStudentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const student = await prisma.student.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(student)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireRole(["admin"])
    if (authError) return authError

    const { id } = await params
    await prisma.student.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
