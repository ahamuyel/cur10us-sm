import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

interface RequireRoleOptions {
  requireSchool?: boolean
}

export async function requireRole(allowedRoles: string[], options?: RequireRoleOptions) {
  const session = await auth()

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }), session: null }
  }

  const role = session.user.role
  if (!role || !allowedRoles.includes(role)) {
    return { error: NextResponse.json({ error: "Sem permissão" }, { status: 403 }), session: null }
  }

  if (options?.requireSchool && !session.user.schoolId) {
    return { error: NextResponse.json({ error: "Escola não associada" }, { status: 403 }), session: null }
  }

  return { error: null, session }
}

export function getSchoolId(session: { user: { schoolId?: string | null } }): string {
  const schoolId = session.user.schoolId
  if (!schoolId) {
    throw new Error("schoolId não encontrado na sessão")
  }
  return schoolId
}
