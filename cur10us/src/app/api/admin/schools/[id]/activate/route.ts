import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/api-auth"
import { hash } from "bcryptjs"
import crypto from "crypto"
import { sendSchoolActivated, sendSchoolActivatedExistingAdmin } from "@/lib/email"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireRole(["super_admin"])
    if (authError) return authError

    const { id } = await params
    const school = await prisma.school.update({
      where: { id },
      data: { status: "ativa" },
    })

    // Find existing school_admin (active or inactive from self-registration)
    let admin = await prisma.user.findFirst({
      where: { schoolId: id, role: "school_admin" },
      orderBy: { createdAt: "asc" },
    })

    let tempPassword: string | null = null
    let existingAdmin = false

    if (admin && !admin.isActive) {
      // Self-registered admin — activate their account
      await prisma.user.update({
        where: { id: admin.id },
        data: { isActive: true },
      })
      existingAdmin = true
    } else if (!admin) {
      // No school_admin exists — create one using the school's email (fallback for schools created by super admin)
      tempPassword = crypto.randomBytes(6).toString("base64url") // e.g. "aB3dEf1g"
      const hashedPassword = await hash(tempPassword, 12)

      admin = await prisma.user.create({
        data: {
          name: `Admin ${school.name}`,
          email: school.email,
          hashedPassword,
          provider: "credentials",
          role: "school_admin",
          isActive: true,
          profileComplete: true,
          schoolId: id,
        },
      })
    }

    // Grant primary admin permissions
    await prisma.adminPermission.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
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

    // Send activation email
    try {
      if (tempPassword) {
        await sendSchoolActivated(school.email, school.name, tempPassword)
      } else if (existingAdmin) {
        await sendSchoolActivatedExistingAdmin(admin.email, school.name)
      }
    } catch {
      // Email delivery failure shouldn't block activation
    }

    return NextResponse.json({
      ...school,
      adminCreated: !!tempPassword,
      existingAdmin,
      adminEmail: admin.email,
    })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
