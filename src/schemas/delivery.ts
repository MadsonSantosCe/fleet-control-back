import { Destinations } from '@prisma/client';
import { z } from 'zod';

export const deliverySchema = z.object({
  type: z.string().min(1, { message: "Tipo de entrega é obrigatório" }),
  value: z.number().positive({ message: "Valor deve ser positivo" }),
  destination: z.nativeEnum(Destinations),
  deliveryTime: z.string().transform((str) => new Date(str)),
  truckId: z.number().int().positive({ message: "ID do caminhão inválido" }),
  driverId: z.number().int().positive({ message: "ID do motorista inválido" }),
  insurance: z.boolean().optional(),
  dangerous: z.boolean().optional(),
  valuable: z.boolean().optional(),
});
