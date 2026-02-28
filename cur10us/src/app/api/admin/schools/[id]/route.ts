import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/api-auth"
import { updateSchoolSchema } from "@/lib/validations/school"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireRole(["super_admin"])
    if (authError) return authError

    const { id } = await params
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, teachers: true, students: true, parents: true, applications: true } },
      },
    })
    if (!school) {
      return NextResponse.json({ error: "Escola não encontrada" }, { status: 404 })
    }
    return NextResponse.json(school)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireRole(["super_admin"])
    if (authError) return authError

    const { id } = await params
    const body = await req.json()
    const parsed = updateSchoolSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const school = await prisma.school.update({ where: { id }, data: parsed.data })
    return NextResponse.json(school)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireRole(["super_admin"])
    if (authError) return authError

    const { id } = await params
    await prisma.school.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
