import { z } from 'zod';

export const driverSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nome é obrigatório" })
    .regex(/^[A-Za-z\s]+$/, { message: "Nome deve conter apenas letras e espaços" }),
  cpf: z
    .string()
    .length(11, { message: "CPF deve ter 11 dígitos" })
    .regex(/^\d+$/, { message: "CPF deve conter apenas números" }),
});
