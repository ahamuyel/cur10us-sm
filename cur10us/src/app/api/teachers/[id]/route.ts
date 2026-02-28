import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, getSchoolId } from "@/lib/api-auth"
import { updateTeacherSchema } from "@/lib/validations/entities"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError, session } = await requireRole(["school_admin", "teacher", "student", "parent"], { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { id } = await params
    const teacher = await prisma.teacher.findUnique({ where: { id } })

    if (!teacher || teacher.schoolId !== schoolId) {
      return NextResponse.json({ error: "Professor não encontrado" }, { status: 404 })
    }
    return NextResponse.json(teacher)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError, session } = await requireRole(["school_admin"], { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { id } = await params

    const existing = await prisma.teacher.findUnique({ where: { id } })
    if (!existing || existing.schoolId !== schoolId) {
      return NextResponse.json({ error: "Professor não encontrado" }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateTeacherSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const teacher = await prisma.teacher.update({ where: { id }, data: parsed.data })
    return NextResponse.json(teacher)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError, session } = await requireRole(["school_admin"], { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { id } = await params

    const existing = await prisma.teacher.findUnique({ where: { id } })
    if (!existing || existing.schoolId !== schoolId) {
      return NextResponse.json({ error: "Professor não encontrado" }, { status: 404 })
    }

    await prisma.teacher.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
