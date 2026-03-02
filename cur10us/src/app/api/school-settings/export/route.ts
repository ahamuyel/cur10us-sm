import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, getSchoolId } from "@/lib/api-auth"

export async function GET() {
  try {
    const { error, session } = await requireRole(["school_admin"], { requireSchool: true })
    if (error) return error

    const schoolId = getSchoolId(session!)
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { primaryColor: true, secondaryColor: true, sidebarColor: true },
    })

    return NextResponse.json({
      primaryColor: school?.primaryColor || null,
      secondaryColor: school?.secondaryColor || null,
      sidebarColor: school?.sidebarColor || null,
    })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
