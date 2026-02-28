import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/api-auth"
import { sendEnrollmentComplete } from "@/lib/email"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError, session } = await requireRole(["school_admin"], { requireSchool: true })
    if (authError) return authError

    const { id } = await params
    const schoolId = session!.user.schoolId!

    const application = await prisma.application.findUnique({
      where: { id },
      include: { school: { select: { name: true } } },
    })
    if (!application || application.schoolId !== schoolId) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }
    if (application.status !== "aprovada") {
      return NextResponse.json({ error: "Solicitação precisa estar aprovada para matricular" }, { status: 400 })
    }

    // Link to existing user if one exists with that email
    const user = await prisma.user.findUnique({ where: { email: application.email } })

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isActive: true, schoolId, role: application.role },
      })

      await prisma.application.update({
        where: { id },
        data: { status: "matriculada", userId: user.id },
      })
    } else {
      await prisma.application.update({
        where: { id },
        data: { status: "matriculada" },
      })
    }

    try {
      await sendEnrollmentComplete(application.email, application.name, application.school.name)
    } catch (e) {
      console.error("Email error:", e)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
