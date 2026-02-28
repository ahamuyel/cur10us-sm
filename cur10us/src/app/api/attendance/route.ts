import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePermission, getSchoolId } from "@/lib/api-auth"
import { createAttendanceSchema } from "@/lib/validations/academic"

export async function GET(req: Request) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin", "teacher"], "canManageAttendance", { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const classId = searchParams.get("classId") || ""
    const date = searchParams.get("date") || ""

    const where = {
      schoolId,
      ...(classId ? { classId } : {}),
      ...(date ? { date: new Date(date) } : {}),
    }

    const [data, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          student: { select: { id: true, name: true } },
          class: { select: { id: true, name: true } },
        },
      }),
      prisma.attendance.count({ where }),
    ])

    return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin", "teacher"], "canManageAttendance", { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const body = await req.json()
    const parsed = createAttendanceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { date, classId, records } = parsed.data

    const created = await prisma.attendance.createMany({
      data: records.map((r) => ({
        date: new Date(date),
        classId,
        studentId: r.studentId,
        status: r.status,
        schoolId,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
