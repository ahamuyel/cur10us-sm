import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      where: { status: "ativa" },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(schools)
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
