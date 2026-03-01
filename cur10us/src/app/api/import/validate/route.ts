import { NextResponse } from "next/server"
import { requirePermission, getSchoolId } from "@/lib/api-auth"
import { parseFile, normalizeHeaders, validateRows } from "@/lib/import-utils"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin"], undefined, { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const formData = await req.formData()
    const file = formData.get("file") as File
    const userType = formData.get("userType") as string

    if (!file) {
      return NextResponse.json({ error: "Ficheiro é obrigatório" }, { status: 400 })
    }

    if (!["student", "teacher", "parent"].includes(userType)) {
      return NextResponse.json({ error: "Tipo de utilizador inválido" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { headers, rows } = parseFile(buffer, file.name)

    if (rows.length === 0) {
      return NextResponse.json({ error: "O ficheiro está vazio" }, { status: 400 })
    }

    if (rows.length > 500) {
      return NextResponse.json({ error: "Máximo de 500 linhas por ficheiro" }, { status: 400 })
    }

    const headerMap = normalizeHeaders(headers)
    const validated = validateRows(rows, headerMap, headers)

    // Check for duplicate emails within the file
    const emails = validated.filter((r) => r.valid).map((r) => r.data.email.toLowerCase())
    const duplicateEmails = emails.filter((e, i) => emails.indexOf(e) !== i)

    if (duplicateEmails.length > 0) {
      validated.forEach((r) => {
        if (r.valid && duplicateEmails.includes(r.data.email.toLowerCase())) {
          r.valid = false
          r.errors.push("E-mail duplicado no ficheiro")
        }
      })
    }

    // Check for existing emails in DB
    const validEmails = validated.filter((r) => r.valid).map((r) => r.data.email.toLowerCase())
    if (validEmails.length > 0) {
      const existingUsers = await prisma.user.findMany({
        where: { email: { in: validEmails } },
        select: { email: true },
      })
      const existingSet = new Set(existingUsers.map((u) => u.email.toLowerCase()))

      validated.forEach((r) => {
        if (r.valid && existingSet.has(r.data.email.toLowerCase())) {
          r.valid = false
          r.errors.push("E-mail já registado no sistema")
        }
      })
    }

    // If userType is student, validate class names
    if (userType === "student") {
      const classNames = [...new Set(validated.filter((r) => r.valid && r.data.turma).map((r) => r.data.turma!))]
      if (classNames.length > 0) {
        const existingClasses = await prisma.class.findMany({
          where: { schoolId, name: { in: classNames } },
          select: { name: true },
        })
        const classSet = new Set(existingClasses.map((c) => c.name))

        validated.forEach((r) => {
          if (r.valid && r.data.turma && !classSet.has(r.data.turma)) {
            r.valid = false
            r.errors.push(`Turma "${r.data.turma}" não encontrada`)
          }
        })
      }
    }

    const validCount = validated.filter((r) => r.valid).length
    const invalidCount = validated.filter((r) => !r.valid).length

    return NextResponse.json({
      filename: file.name,
      totalRows: rows.length,
      validCount,
      invalidCount,
      rows: validated,
      headerMap,
    })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
