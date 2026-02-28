import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/api-auth"
import { createParentSchema } from "@/lib/validations/entities"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [data, total] = await Promise.all([
      prisma.parent.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
        include: { students: { select: { id: true, name: true } } },
      }),
      prisma.parent.count({ where }),
    ])

    return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error: authError } = await requireRole(["admin"])
    if (authError) return authError

    const body = await req.json()
    const parsed = createParentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { studentIds, ...data } = parsed.data

    const existing = await prisma.parent.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 })
    }

    const parent = await prisma.parent.create({
      data: {
        ...data,
        ...(studentIds?.length && {
          students: { connect: studentIds.map((id) => ({ id })) },
        }),
      },
      include: { students: { select: { id: true, name: true } } },
    })

    return NextResponse.json(parent, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
