import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, getSchoolId } from "@/lib/api-auth"

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export async function POST(req: Request) {
  try {
    const { error, session } = await requireRole(["school_admin"], { requireSchool: true })
    if (error) return error

    const schoolId = getSchoolId(session!)
    const body = await req.json()
    const { primaryColor, secondaryColor, sidebarColor } = body

    // Validate hex colors
    for (const [key, val] of Object.entries({ primaryColor, secondaryColor, sidebarColor })) {
      if (val && typeof val === "string" && !HEX_RE.test(val)) {
        return NextResponse.json({ error: `Cor inválida para ${key}` }, { status: 400 })
      }
    }

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: {
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        sidebarColor: sidebarColor || null,
      },
      select: { primaryColor: true, secondaryColor: true, sidebarColor: true },
    })

    return NextResponse.json(school)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
