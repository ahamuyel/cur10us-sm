import { NextResponse } from "next/server"
import { requirePermission, getSchoolId } from "@/lib/api-auth"
import { parseFile, normalizeHeaders, validateRows, generateTempPassword } from "@/lib/import-utils"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import type { Role } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const { error: authError, session } = await requirePermission(["school_admin"], undefined, { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const userId = session!.user.id
    const formData = await req.formData()
    const file = formData.get("file") as File
    const userType = formData.get("userType") as string

    if (!file || !["student", "teacher", "parent"].includes(userType)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { headers, rows } = parseFile(buffer, file.name)

    if (rows.length > 500) {
      return NextResponse.json({ error: "Máximo de 500 linhas" }, { status: 400 })
    }

    const headerMap = normalizeHeaders(headers)
    const validated = validateRows(rows, headerMap, headers)

    // Check existing emails
    const validRows = validated.filter((r) => r.valid)
    const emails = validRows.map((r) => r.data.email.toLowerCase())
    const existing = await prisma.user.findMany({
      where: { email: { in: emails } },
      select: { email: true },
    })
    const existingSet = new Set(existing.map((u) => u.email.toLowerCase()))

    // Get class map if student
    let classMap: Record<string, string> = {}
    if (userType === "student") {
      const classes = await prisma.class.findMany({
        where: { schoolId },
        select: { id: true, name: true },
      })
      classMap = Object.fromEntries(classes.map((c) => [c.name, c.id]))
    }

    // Create import job
    const job = await prisma.importJob.create({
      data: {
        filename: file.name,
        userType: userType as Role,
        status: "processando",
        totalRows: rows.length,
        importedById: userId,
        schoolId,
      },
    })

    const successes: { email: string; password: string; name: string }[] = []
    const failures: { rowNumber: number; email: string; errors: string[] }[] = []

    for (const row of validated) {
      if (!row.valid) {
        failures.push({ rowNumber: row.rowNumber, email: row.data.email || "", errors: row.errors })
        continue
      }

      if (existingSet.has(row.data.email.toLowerCase())) {
        failures.push({ rowNumber: row.rowNumber, email: row.data.email, errors: ["E-mail já registado"] })
        continue
      }

      try {
        const tempPass = generateTempPassword()
        const hashedPassword = await hash(tempPass, 10) // cost 10 for bulk

        // Create user
        const user = await prisma.user.create({
          data: {
            name: row.data.nome,
            email: row.data.email.toLowerCase(),
            hashedPassword,
            role: userType as Role,
            isActive: true,
            mustChangePassword: true,
            profileComplete: true,
            provider: "credentials",
            schoolId,
          },
        })

        // Create role-specific record
        if (userType === "student") {
          await prisma.student.create({
            data: {
              name: row.data.nome,
              email: row.data.email.toLowerCase(),
              phone: row.data.telefone,
              address: row.data.endereco,
              gender: row.data.genero as "masculino" | "feminino" | undefined,
              dateOfBirth: row.data.dataNascimento ? new Date(row.data.dataNascimento) : undefined,
              documentType: row.data.tipoDocumento || undefined,
              documentNumber: row.data.numeroDocumento || undefined,
              classId: row.data.turma ? classMap[row.data.turma] : undefined,
              course: row.data.curso || undefined,   // ← novo
              grade: row.data.classe || undefined,   // ← novo
              userId: user.id,
              schoolId,
            },
          })
        } else if (userType === "teacher") {
          await prisma.teacher.create({
            data: {
              name: row.data.nome,
              email: row.data.email.toLowerCase(),
              phone: row.data.telefone,
              address: row.data.endereco,
              userId: user.id,
              schoolId,
            },
          })
        } else if (userType === "parent") {
          await prisma.parent.create({
            data: {
              name: row.data.nome,
              email: row.data.email.toLowerCase(),
              phone: row.data.telefone,
              address: row.data.endereco,
              userId: user.id,
              schoolId,
            },
          })
        }

        existingSet.add(row.data.email.toLowerCase())
        successes.push({ email: row.data.email, password: tempPass, name: row.data.nome })
      } catch (err) {
        failures.push({
          rowNumber: row.rowNumber,
          email: row.data.email,
          errors: [err instanceof Error ? err.message : "Erro ao criar utilizador"],
        })
      }
    }

    // Update job with results
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: failures.length === rows.length ? "falhada" : "concluida",
        successCount: successes.length,
        failedCount: failures.length,
        errors: failures.length > 0 ? failures : undefined,
        report: successes.length > 0 ? successes : undefined,
      },
    })

    return NextResponse.json({
      jobId: job.id,
      totalRows: rows.length,
      successCount: successes.length,
      failedCount: failures.length,
      successes,
      failures,
    })
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
