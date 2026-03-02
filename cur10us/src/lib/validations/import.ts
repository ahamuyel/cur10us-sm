import { z } from "zod"

export const importRowSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.union([z.string().email("Formato de e-mail inválido"), z.literal(""), z.undefined()]).optional(),
  telefone: z.union([z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"), z.literal(""), z.undefined()]).optional(),
  endereco: z.union([z.string().min(3, "Endereço deve ter pelo menos 3 caracteres"), z.literal(""), z.undefined()]).optional(),
  genero: z.enum(["masculino", "feminino"]).optional(),
  dataNascimento: z.string().optional(),
  tipoDocumento: z.string().optional(),
  numeroDocumento: z.string().optional(),
  turma: z.string().optional(),
  curso: z.string().optional(),
  classe: z.string().optional(),
})

export type ImportRow = z.infer<typeof importRowSchema>

export type ValidatedRow = {
  rowNumber: number
  data: ImportRow
  valid: boolean
  errors: string[]
}