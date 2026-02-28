import { z } from "zod"

const baseFields = {
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  phone: z.string().min(8, "Telefone deve ter pelo menos 8 dígitos").max(20, "Telefone muito longo"),
  address: z.string().min(3, "Endereço é obrigatório").max(200, "Endereço muito longo"),
  foto: z.string().url("URL da foto inválida").optional().or(z.literal("")),
}

export const createTeacherSchema = z.object({
  ...baseFields,
  subjects: z.array(z.string().min(1)).min(1, "Informe pelo menos uma disciplina"),
  classes: z.array(z.string().min(1)).min(1, "Informe pelo menos uma turma"),
})

export const updateTeacherSchema = createTeacherSchema.partial()

export const createStudentSchema = z.object({
  ...baseFields,
  serie: z.number().int().min(1, "Série deve ser entre 1 e 9").max(9, "Série deve ser entre 1 e 9"),
  turma: z.string().min(1, "Turma é obrigatória").max(10, "Turma muito longa"),
})

export const updateStudentSchema = createStudentSchema.partial()

export const createParentSchema = z.object({
  ...baseFields,
  studentIds: z.array(z.string()).optional(),
})

export const updateParentSchema = createParentSchema.partial()
