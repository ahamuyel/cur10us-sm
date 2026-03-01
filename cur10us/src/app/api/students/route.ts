import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requirePermission, getSchoolId } from "@/lib/api-auth"
import { createStudentSchema } from "@/lib/validations/entities"
import { sendTempCredentials } from "@/lib/email"

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
      prisma.student.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          class: { select: { id: true, name: true, grade: true } },
          parents: { select: { id: true, name: true } },
          user: { select: { id: true, isActive: true } },
        },
      }),
      prisma.student.count({ where }),
    ])

    const mapped = data.map((s) => ({
      ...s,
      hasAccount: !!s.userId,
      userActive: s.user?.isActive ?? null,
    }))

    return NextResponse.json({ data: mapped, total, page, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin"], "canManageStudents", { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const body = await req.json()
    const parsed = createStudentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const existing = await prisma.student.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 })
    }

    const { createAccount, dateOfBirth: dobStr, ...studentData } = parsed.data

    const dateOfBirth = dobStr ? new Date(dobStr) : undefined

    let userId: string | undefined
    let tempPassword: string | undefined

    if (createAccount) {
      const existingUser = await prisma.user.findUnique({ where: { email: studentData.email } })
      if (existingUser) {
        return NextResponse.json({ error: "Este e-mail já tem uma conta de utilizador" }, { status: 409 })
      }
      tempPassword = randomBytes(6).toString("base64url")
      const hashedPassword = await hash(tempPassword, 12)
      const user = await prisma.user.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          hashedPassword,
          role: "student",
          isActive: true,
          mustChangePassword: true,
          schoolId,
        },
      })
      userId = user.id
    }

    const student = await prisma.student.create({
      data: {
        ...studentData,
        schoolId,
        ...(dateOfBirth && { dateOfBirth }),
        ...(userId && { userId }),
      },
    })

    if (createAccount && tempPassword) {
      const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { name: true } })
      sendTempCredentials(studentData.email, studentData.name, school?.name || "", tempPassword).catch(() => {})
    }

    return NextResponse.json({ ...student, tempPassword }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
