import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

/**
 * GET /api/user/schools
 * Returns all schools where the authenticated user has an active relationship
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            logo: true,
          },
        },
        adminPermission: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                logo: true,
              },
            },
          },
        },
        teacher: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                logo: true,
              },
            },
          },
        },
        student: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                logo: true,
              },
            },
          },
        },
        parent: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                logo: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 })
    }

    // Collect all unique schools with their roles
    type SchoolEntry = {
      id: string
      name: string
      slug: string
      city: string | null
      logo: string | null
      roles: string[]
      status: string
    }
    const schoolMap = new Map<string, SchoolEntry>()

    // Direct school association (from user.schoolId)
    if (user.school) {
      const key = user.school.id
      if (!schoolMap.has(key)) {
        schoolMap.set(key, {
          id: user.school.id,
          name: user.school.name,
          slug: user.school.slug,
          city: user.school.city,
          logo: user.school.logo,
          roles: [],
          status: user.isActive ? "activo" : "pendente",
        })
      }
      if (user.role) {
        schoolMap.get(key)!.roles.push(user.role)
      }
    }

    // Admin permission (single relation per user, but could exist)
    if (user.adminPermission) {
      const perm = user.adminPermission
      const key = perm.school.id
      if (!schoolMap.has(key)) {
        schoolMap.set(key, {
          id: perm.school.id,
          name: perm.school.name,
          slug: perm.school.slug,
          city: perm.school.city,
          logo: perm.school.logo,
          roles: [],
          status: "activo",
        })
      }
      schoolMap.get(key)!.roles.push("school_admin")
    }

    // Teacher association (single relation)
    if (user.teacher) {
      const key = user.teacher.school.id
      if (!schoolMap.has(key)) {
        schoolMap.set(key, {
          id: user.teacher.school.id,
          name: user.teacher.school.name,
          slug: user.teacher.school.slug,
          city: user.teacher.school.city,
          logo: user.teacher.school.logo,
          roles: [],
          status: "activo",
        })
      }
      schoolMap.get(key)!.roles.push("teacher")
    }

    // Student association (single relation)
    if (user.student) {
      const key = user.student.school.id
      if (!schoolMap.has(key)) {
        schoolMap.set(key, {
          id: user.student.school.id,
          name: user.student.school.name,
          slug: user.student.school.slug,
          city: user.student.school.city,
          logo: user.student.school.logo,
          roles: [],
          status: "activo",
        })
      }
      schoolMap.get(key)!.roles.push("student")
    }

    // Parent association (single relation)
    if (user.parent) {
      const key = user.parent.school.id
      if (!schoolMap.has(key)) {
        schoolMap.set(key, {
          id: user.parent.school.id,
          name: user.parent.school.name,
          slug: user.parent.school.slug,
          city: user.parent.school.city,
          logo: user.parent.school.logo,
          roles: [],
          status: "activo",
        })
      }
      schoolMap.get(key)!.roles.push("parent")
    }

    const schools = Array.from(schoolMap.values())

    return NextResponse.json(schools)
  } catch (error) {
    console.error("Error fetching user schools:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
