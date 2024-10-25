import { z } from "zod";

export const truckSchema = z.object({
    licensePlate: z.string({ message: "A pleca é obrigratória" })
        .min(7, { message: "A placa deve ter 7 caracteres" })
        .max(7, { message: "A placa deve ter 7 caracteres" })
        .regex(/^[A-Za-z]{3}[0-9]{4}$/, { message: "A placa deve ter 3 letras seguidas de 4 números" })
});