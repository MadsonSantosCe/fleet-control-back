import { z } from 'zod';

export const driverSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .regex(/^[\p{L}\s]+$/u, { message: 'O nome deve conter apenas letras e espaços' }),
  license: z
    .string()
    .length(11, { message: "CPF deve ter 11 dígitos" })
    .regex(/^\d+$/, { message: "CPF deve conter apenas números" }),
});
