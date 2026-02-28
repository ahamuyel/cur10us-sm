const roleDashboard: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/students",
  parent: "/parents",
}

export function getDashboardPath(role?: string | null): string {
  return roleDashboard[role || ""] || "/admin"
}
