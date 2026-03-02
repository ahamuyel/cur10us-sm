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

    // Só verificar emails reais (não vazios)
    const validRows = validated.filter((r) => r.valid)
    const emails = validRows
      .map((r) => r.data.email?.toLowerCase())
      .filter(Boolean) as string[]

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

      // Gerar email placeholder se não tiver email
      const emailFinal = row.data.email?.trim()
        ? row.data.email.toLowerCase()
        : `${row.data.nome.toLowerCase().replace(/\s+/g, ".")}.${Date.now()}@importado.local`

      // Só verificar duplicado se for email real
      if (row.data.email?.trim() && existingSet.has(emailFinal)) {
        failures.push({ rowNumber: row.rowNumber, email: emailFinal, errors: ["E-mail já registado"] })
        continue
      }

      try {
        const tempPass = generateTempPassword()
        const hashedPassword = await hash(tempPass, 10)

        const user = await prisma.user.create({
          data: {
            name: row.data.nome,
            email: emailFinal,
            hashedPassword,
            role: userType as Role,
            isActive: true,
            mustChangePassword: true,
            profileComplete: true,
            provider: "credentials",
            schoolId,
          },
        })

        if (userType === "student") {
          await prisma.student.create({
            data: {
              name: row.data.nome,
              email: emailFinal,
              phone: row.data.telefone || undefined,
              address: row.data.endereco || undefined,
              gender: row.data.genero as "masculino" | "feminino" | undefined,
              dateOfBirth: row.data.dataNascimento ? new Date(row.data.dataNascimento) : undefined,
              documentType: row.data.tipoDocumento || undefined,
              documentNumber: row.data.numeroDocumento || undefined,
              classId: row.data.turma ? classMap[row.data.turma] : undefined,
              grade: row.data.classe || undefined,
              userId: user.id,
              schoolId,
            },
          })
        } else if (userType === "teacher") {
          await prisma.teacher.create({
            data: {
              name: row.data.nome,
              email: emailFinal,
              phone: row.data.telefone || undefined,
              address: row.data.endereco || undefined,
              userId: user.id,
              schoolId,
            },
          })
        } else if (userType === "parent") {
          await prisma.parent.create({
            data: {
              name: row.data.nome,
              email: emailFinal,
              phone: row.data.telefone || undefined,
              address: row.data.endereco || undefined,
              userId: user.id,
              schoolId,
            },
          })
        }

        // Só adicionar ao set se for email real
        if (row.data.email?.trim()) {
          existingSet.add(emailFinal)
        }

        successes.push({ email: emailFinal, password: tempPass, name: row.data.nome })
      } catch (err) {
        failures.push({
          rowNumber: row.rowNumber,
          email: emailFinal,
          errors: [err instanceof Error ? err.message : "Erro ao criar utilizador"],
        })
      }
    }

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