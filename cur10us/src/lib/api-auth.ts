import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

/**
 * Enhanced authorization that checks role AND granular permissions for school_admin users.
 * - super_admin: always allowed (no permission check)
 * - school_admin + primary: always allowed (full access)
 * - school_admin + secondary: checks specific permission key
 * - other roles (teacher, student, parent): only role check, no permission check
 */
export async function requirePermission(
  allowedRoles: string[],
  permissionKey?: string,
  options?: RequireRoleOptions
) {
  const { error, session } = await requireRole(allowedRoles, options)
  if (error) return { error, session: null }

  // Non-school_admin roles don't need permission checks
  if (session!.user.role !== "school_admin") {
    return { error: null, session }
  }

  // If no specific permission is required, allow
  if (!permissionKey) {
    return { error: null, session }
  }

  // Fetch admin permission from DB for the current user
  const adminPerm = await prisma.adminPermission.findUnique({
    where: { userId: session!.user.id },
  })

  // Primary admins have full access
  if (adminPerm?.level === "primary") {
    return { error: null, session }
  }

  // Secondary admins must have the specific permission
  if (adminPerm?.level === "secondary") {
    const allowed = (adminPerm as unknown as Record<string, unknown>)[permissionKey] === true
    if (allowed) {
      return { error: null, session }
    }
  }

  // No admin permission record or permission not granted
  return {
    error: NextResponse.json({ error: "Sem permissão para esta ação" }, { status: 403 }),
    session: null,
  }
}
