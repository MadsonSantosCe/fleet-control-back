import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { deliverySchema } from "../schemas/deliverySchema";
import {
  createDeliveryAsync,
  deleteDeliveryAsync,
  getAllDeliveriesAsync,
  getDeliveryByIdAsync,
  updateDeliveryAsync,
} from "../services/deliveryService";

const prisma = new PrismaClient();

interface ErrorResponse {
  message: string;
}

export const handlePrismaError = (error: any): ErrorResponse => {
  switch (error.code) {
    case "P2002":
      return { message: "Entrega já cadastrada!" };
    case "P2025":
      return { message: "Entrega não encontrada!" };
    case "P2003":
      return { message: "Erro de referência: verifique motorista e caminhão" };
    default:
      return { message: "Ocorreu um erro desconhecido" };
  }
};

export const createDelivery = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const safeData = deliverySchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: safeData.error.flatten().fieldErrors,
      });
    }

    const newDelivery = await createDeliveryAsync(safeData.data);
    return res.status(201).json(newDelivery);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json(errorResponse);
    }

    if (error instanceof Error) {
      return res.status(400).json({ message: `${error.message}` });
    }

    return res.status(500).json({ message: "Erro ao criar entrega" });
  }
};

export const getDeliveries = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const deliveries = await getAllDeliveriesAsync();
    return res.status(200).json(deliveries);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar entregas" });
  }
};

export const getDeliveryById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const delivery = await getDeliveryByIdAsync(Number(id));
    if (!delivery) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }
    return res.status(200).json(delivery);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar entrega" });
  }
};

export const updateDelivery = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const safeData = deliverySchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: safeData.error.flatten().fieldErrors,
      });
    }

    const updatedDelivery = await updateDeliveryAsync(
      Number(id),
      safeData.data
    );
    return res.status(200).json(updatedDelivery);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json(errorResponse);;
    }

    if (error instanceof Error) {
      return res.status(400).json({ message: `${error.message}` });
    }

    return res.status(500).json({ message: "Erro ao criar entrega" });
  }
};

export const deleteDelivery = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteDeliveryAsync(Number(id));
    return res.status(204).send();
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json(errorResponse);
    }

    return res.status(500).json({ message: "Erro ao deletar entrega" });
  }
};
