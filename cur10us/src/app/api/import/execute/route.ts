import { NextResponse } from "next/server"
import { requirePermission, getSchoolId } from "@/lib/api-auth"
import { parseFile, normalizeHeaders, validateRows } from "@/lib/import-utils"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    // 1. Autenticação e Permissões
    const { error: authError, session } = await requirePermission(["school_admin"], undefined, { requireSchool: true })
    if (authError) return authError

    const schoolId = getSchoolId(session!)
    const formData = await req.formData()
    const file = formData.get("file") as File
    const userType = formData.get("userType") as string

    // 2. Validação básica de input
    if (!file || !["student", "teacher", "parent"].includes(userType)) {
      return NextResponse.json({ error: "Dados ou tipo de utilizador inválidos" }, { status: 400 })
    }

    // 3. Parsing do arquivo (Excel ou CSV)
    const buffer = Buffer.from(await file.arrayBuffer())
    const { headers, rows } = parseFile(buffer, file.name)

    if (rows.length > 500) {
      return NextResponse.json({ error: "O limite máximo é de 500 linhas por importação" }, { status: 400 })
    }

    const headerMap = normalizeHeaders(headers)
    const validated = validateRows(rows, headerMap, headers)

    // --- CORREÇÃO DO TYPESCRIPT AQUI ---
    // Filtramos apenas linhas válidas que POSSUEM email para verificar duplicatas
    const emailsNoArquivo = validated
      .filter((r) => r.valid && r.data.email)
      .map((r) => r.data.email!.toLowerCase().trim())

    // 4. Verificar duplicados DENTRO do próprio arquivo
    const emailsDuplicadosNoArquivo = emailsNoArquivo.filter(
      (email, index) => emailsNoArquivo.indexOf(email) !== index
    )

    // 5. Verificar duplicados contra o BANCO DE DADOS
    const emailsNoBanco = await prisma.user.findMany({
      where: { 
        email: { in: emailsNoArquivo },
        schoolId // Opcional: dependendo se o email é único global ou por escola
      },
      select: { email: true }
    })
    const setEmailsBanco = new Set(emailsNoBanco.map(u => u.email.toLowerCase()))

    // 6. Marcar erros nas linhas
    for (const row of validated) {
      if (!row.data.email) continue

      const emailLower = row.data.email.toLowerCase().trim()

      // Erro: Duplicado no ficheiro
      if (emailsDuplicadosNoArquivo.includes(emailLower)) {
        row.valid = false
        if (!row.errors.includes("E-mail duplicado no arquivo")) {
          row.errors.push("E-mail duplicado no arquivo")
        }
      }

      // Erro: Já existe no sistema
      if (setEmailsBanco.has(emailLower)) {
        row.valid = false
        row.errors.push("Este e-mail já está registado no sistema")
      }
    }

    // 7. Resposta final para o Frontend
    return NextResponse.json({
      headers,
      rows: validated,
      stats: {
        total: rows.length,
        valid: validated.filter(r => r.valid).length,
        invalid: validated.filter(r => !r.valid).length
      }
    })

  } catch (error) {
    console.error("Erro na validação da importação:", error)
    return NextResponse.json({ error: "Erro interno ao validar o arquivo" }, { status: 500 })
  }
}