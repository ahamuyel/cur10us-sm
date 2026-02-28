import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function requireRole(allowedRoles: string[]) {
  const session = await auth()

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }), session: null }
  }

  const role = session.user.role
  if (!role || !allowedRoles.includes(role)) {
    return { error: NextResponse.json({ error: "Sem permissão" }, { status: 403 }), session: null }
  }

  return { error: null, session }
}
