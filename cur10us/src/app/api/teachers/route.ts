import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePermission, getSchoolId } from "@/lib/api-auth"
import { createTeacherSchema } from "@/lib/validations/entities"

export async function GET(req: Request) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin", "teacher", "student", "parent"], undefined, { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const where = {
      schoolId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    }

    const [data, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          teacherSubjects: { include: { subject: true } },
          teacherClasses: { include: { class: true } },
        },
      }),
      prisma.teacher.count({ where }),
    ])

    const mapped = data.map((t) => ({
      ...t,
      subjects: t.teacherSubjects.map((ts) => ts.subject.name),
      subjectIds: t.teacherSubjects.map((ts) => ts.subjectId),
      classes: t.teacherClasses.map((tc) => tc.class.name),
      classIds: t.teacherClasses.map((tc) => tc.classId),
    }))

    return NextResponse.json({ data: mapped, total, page, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin"], "canManageTeachers", { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const body = await req.json()
    const parsed = createTeacherSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const existing = await prisma.teacher.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 })
    }

    const { subjectIds, classIds, ...teacherData } = parsed.data

    const teacher = await prisma.teacher.create({
      data: {
        ...teacherData,
        schoolId,
        teacherSubjects: subjectIds?.length
          ? { create: subjectIds.map((subjectId) => ({ subjectId })) }
          : undefined,
        teacherClasses: classIds?.length
          ? { create: classIds.map((classId) => ({ classId })) }
          : undefined,
      },
    })
    return NextResponse.json(teacher, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
