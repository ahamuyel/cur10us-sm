import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, getSchoolId } from "@/lib/api-auth"

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export async function GET() {
  try {
    const { error, session } = await requireRole(["school_admin", "teacher", "student", "parent"], { requireSchool: true })
    if (error) return error

    const schoolId = getSchoolId(session!)
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        name: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        sidebarColor: true,
        abbreviation: true,
      },
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
    const body = await req.json()
    const { logo, primaryColor, secondaryColor, sidebarColor, abbreviation } = body

    // Validate logo size (base64 ~200KB max)
    if (logo && typeof logo === "string" && logo.length > 300000) {
      return NextResponse.json({ error: "Logo muito grande (máx. 200KB)" }, { status: 400 })
    }

    // Validate hex colors
    for (const [key, val] of Object.entries({ primaryColor, secondaryColor, sidebarColor })) {
      if (val && typeof val === "string" && !HEX_RE.test(val)) {
        return NextResponse.json({ error: `Cor inválida para ${key}` }, { status: 400 })
      }
    }

    // Validate abbreviation
    if (abbreviation !== undefined && abbreviation !== null) {
      if (typeof abbreviation === "string" && abbreviation.length > 5) {
        return NextResponse.json({ error: "Abreviatura máx. 5 caracteres" }, { status: 400 })
      }
    }

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(logo !== undefined && { logo }),
        ...(primaryColor !== undefined && { primaryColor: primaryColor || null }),
        ...(secondaryColor !== undefined && { secondaryColor: secondaryColor || null }),
        ...(sidebarColor !== undefined && { sidebarColor: sidebarColor || null }),
        ...(abbreviation !== undefined && { abbreviation: abbreviation || null }),
      },
      select: {
        name: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        sidebarColor: true,
        abbreviation: true,
      },
    })

    return NextResponse.json(school)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
