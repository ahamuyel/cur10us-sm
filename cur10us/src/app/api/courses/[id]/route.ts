import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePermission, getSchoolId } from "@/lib/api-auth"
import { updateCourseSchema } from "@/lib/validations/academic"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin", "teacher"], "canManageCourses", { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { id } = await params
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        courseSubjects: { include: { subject: true } },
      },
    })

    if (!course || course.schoolId !== schoolId) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      ...course,
      subjects: course.courseSubjects.map((cs) => cs.subject.name),
      subjectIds: course.courseSubjects.map((cs) => cs.subjectId),
    })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin"], "canManageCourses", { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { id } = await params

    const existing = await prisma.course.findUnique({ where: { id } })
    if (!existing || existing.schoolId !== schoolId) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateCourseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { subjectIds, ...courseData } = parsed.data

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...courseData,
        ...(subjectIds !== undefined
          ? {
              courseSubjects: {
                deleteMany: {},
                create: subjectIds.map((subjectId) => ({ subjectId })),
              },
            }
          : {}),
      },
    })
    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin"], "canManageCourses", { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { id } = await params

    const existing = await prisma.course.findUnique({ where: { id } })
    if (!existing || existing.schoolId !== schoolId) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 })
    }

    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
