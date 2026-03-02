import * as XLSX from "xlsx"
import crypto from "crypto"
import { importRowSchema, type ImportRow, type ValidatedRow } from "@/lib/validations/import"

// Header normalization map
const HEADER_MAP: Record<string, string> = {
  "nome": "nome",
  "nome completo": "nome",
  "name": "nome",
  "email": "email",
  "e-mail": "email",
  "telefone": "telefone",
  "phone": "telefone",
  "telemóvel": "telefone",
  "telemovel": "telefone",
  "endereço": "endereco",
  "endereco": "endereco",
  "morada": "endereco",
  "address": "endereco",
  "género": "genero",
  "genero": "genero",
  "sexo": "genero",
  "gender": "genero",
  "data de nascimento": "dataNascimento",
  "data nascimento": "dataNascimento",
  "datanascimento": "dataNascimento",
  "nascimento": "dataNascimento",
  "tipo documento": "tipoDocumento",
  "tipodocumento": "tipoDocumento",
  "tipo de documento": "tipoDocumento",
  "número documento": "numeroDocumento",
  "numerodocumento": "numeroDocumento",
  "numero documento": "numeroDocumento",
  "número de documento": "numeroDocumento",
  "bilhete": "numeroDocumento",
  "bi": "numeroDocumento",
  "turma": "turma",
  "class": "turma",
  "curso": "curso",
  "course": "curso",
  "classe": "classe",
  "grade": "classe",
  "ano": "classe",
}

export function normalizeHeaders(headers: string[]): Record<number, string> {
  const map: Record<number, string> = {}
  headers.forEach((h, i) => {
    const normalized = HEADER_MAP[h.toLowerCase().trim()]
    if (normalized) map[i] = normalized
  })
  return map
}

export function parseFile(buffer: Buffer, filename: string): { headers: string[]; rows: Record<string, string>[] } {
  const ext = filename.split(".").pop()?.toLowerCase()

  if (ext === "csv") {
    const workbook = XLSX.read(buffer, { type: "buffer", codepage: 65001 })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" })
    const headers = data.length > 0 ? Object.keys(data[0]) : []
    return { headers, rows: data }
  }

  const workbook = XLSX.read(buffer, { type: "buffer" })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" })
  const headers = data.length > 0 ? Object.keys(data[0]) : []
  return { headers, rows: data }
}

export function validateRows(rows: Record<string, string>[], headerMap: Record<number, string>, originalHeaders: string[]): ValidatedRow[] {
  return rows.map((row, index) => {
    const mappedData: Record<string, string> = {}
    originalHeaders.forEach((h, i) => {
      const normalizedKey = headerMap[i]
      if (normalizedKey) {
        mappedData[normalizedKey] = String(row[h] || "").trim()
      }
    })

    // Normalize gender values
    if (mappedData.genero) {
      const g = mappedData.genero.toLowerCase()
      if (g === "m" || g === "masc" || g === "masculino") mappedData.genero = "masculino"
      else if (g === "f" || g === "fem" || g === "feminino") mappedData.genero = "feminino"
    }

    const parsed = importRowSchema.safeParse(mappedData)

    if (parsed.success) {
      return {
        rowNumber: index + 2,
        data: parsed.data,
        valid: true,
        errors: [],
      }
    }

    return {
      rowNumber: index + 2,
      data: mappedData as ImportRow,
      valid: false,
      errors: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`),
    }
  })
}

export function generateTempPassword(): string {
  return crypto.randomBytes(6).toString("base64url")
}

export function generateTemplate(userType: string): Buffer {
  const headers: Record<string, string[]> = {
    student: ["Nome", "Email", "Telefone", "Endereço", "Género", "Data de Nascimento", "Tipo Documento", "Número Documento", "Turma", "Curso", "Classe"],
    teacher: ["Nome", "Email", "Telefone", "Endereço"],
    parent:  ["Nome", "Email", "Telefone", "Endereço"],
  }

  const cols = headers[userType] || headers.student
  const ws = XLSX.utils.aoa_to_sheet([cols])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Template")
  ws["!cols"] = cols.map(() => ({ wch: 20 }))

  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }))
}