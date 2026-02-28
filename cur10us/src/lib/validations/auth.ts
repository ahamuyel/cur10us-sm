import { z } from "zod"

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória"),
})

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(100, "Senha muito longa"),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(100, "Senha muito longa"),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Palavra-passe actual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "Nova palavra-passe deve ter pelo menos 8 caracteres")
    .max(100, "Palavra-passe muito longa"),
})
