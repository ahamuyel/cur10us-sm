import { z } from "zod"

export const importRowSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  endereco: z.string().min(3, "Endereço é obrigatório"),
  genero: z.enum(["masculino", "feminino"]).optional(),
  dataNascimento: z.string().optional(),
  tipoDocumento: z.string().optional(),
  numeroDocumento: z.string().optional(),
  turma: z.string().optional(),
})

export type ImportRow = z.infer<typeof importRowSchema>

export type ValidatedRow = {
  rowNumber: number
  data: ImportRow
  valid: boolean
  errors: string[]
}
