import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/api-auth"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireRole(["super_admin"])
    if (authError) return authError

    const { id } = await params
    const school = await prisma.school.update({
      where: { id },
      data: { status: "ativa" },
    })

    // Grant primary admin permissions to the first school_admin of this school
    const firstAdmin = await prisma.user.findFirst({
      where: { schoolId: id, role: "school_admin", isActive: true },
      orderBy: { createdAt: "asc" },
    })

    if (firstAdmin) {
      await prisma.adminPermission.upsert({
        where: { userId: firstAdmin.id },
        update: {},
        create: {
          userId: firstAdmin.id,
          schoolId: id,
          level: "primary",
          canManageApplications: true,
          canManageTeachers: true,
          canManageStudents: true,
          canManageParents: true,
          canManageClasses: true,
          canManageCourses: true,
          canManageSubjects: true,
          canManageLessons: true,
          canManageExams: true,
          canManageResults: true,
          canManageAttendance: true,
          canManageMessages: true,
          canManageAnnouncements: true,
          canManageAdmins: true,
        },
      })
    }

    return NextResponse.json(school)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
