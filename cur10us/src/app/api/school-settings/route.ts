import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, getSchoolId } from "@/lib/api-auth"

export async function GET() {
  try {
    const { error, session } = await requireRole(["school_admin", "teacher", "student", "parent"], { requireSchool: true })
    if (error) return error

    const schoolId = getSchoolId(session!)
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { name: true, logo: true, primaryColor: true },
    })

    return NextResponse.json(school)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { error, session } = await requireRole(["school_admin"], { requireSchool: true })
    if (error) return error

    const schoolId = getSchoolId(session!)
    const { logo, primaryColor } = await req.json()

    // Validate logo size (base64 ~200KB max)
    if (logo && typeof logo === "string" && logo.length > 300000) {
      return NextResponse.json({ error: "Logo muito grande (máx. 200KB)" }, { status: 400 })
    }

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(logo !== undefined && { logo }),
        ...(primaryColor !== undefined && { primaryColor: primaryColor || null }),
      },
      select: { name: true, logo: true, primaryColor: true },
    })

    return NextResponse.json(school)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
