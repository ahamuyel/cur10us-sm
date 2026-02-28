import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchoolSchema } from "@/lib/validations/register-school"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchoolSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const {
      adminName, adminEmail, adminPassword,
      schoolName, slug, nif, schoolEmail, phone, address, city, provincia,
    } = parsed.data

    // Check for duplicates
    const [existingUser, existingSlug, existingSchoolEmail] = await Promise.all([
      prisma.user.findUnique({ where: { email: adminEmail } }),
      prisma.school.findUnique({ where: { slug } }),
      prisma.school.findFirst({ where: { email: schoolEmail } }),
    ])

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail de administrador já está registado" },
        { status: 409 }
      )
    }
    if (existingSlug) {
      return NextResponse.json(
        { error: "Este slug já está em uso. Escolha outro." },
        { status: 409 }
      )
    }
    if (existingSchoolEmail) {
      return NextResponse.json(
        { error: "Este e-mail de escola já está registado" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(adminPassword, 12)

    // Create school + admin user in a single transaction
    await prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: schoolName,
          slug,
          nif: nif || null,
          email: schoolEmail,
          phone,
          address,
          city,
          provincia,
          status: "pendente",
        },
      })

      await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          hashedPassword,
          provider: "credentials",
          role: "school_admin",
          isActive: false,
          profileComplete: true,
          schoolId: school.id,
        },
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
