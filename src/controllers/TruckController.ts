import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { truckSchema } from "../schemas/truckSchema";
import {
  createTruckAsync,
  deleteTruckAsync,
  getTruckByIdAsync,
  updateTruckAsync,
} from "../services/truckService";

const prisma = new PrismaClient();

interface ErrorResponse {
  message: string;
}

export const handlePrismaError = (error: any): ErrorResponse => {
  switch (error.code) {
    case "P2002":
      return { message: "Placa já cadastrada" };
    case "P2025":
      return { message: "Veículo não encontrado" };
    case "P2003":
      return {
        message:
          "Este veículo não pode ser excluído porque possui entregas pendentes",
      };
    default:
      return { message: "Ocorreu um erro desconhecido" };
  }
};

export const createTruck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: safeData.error.flatten().fieldErrors,
      });
    }

    const newTruck = await createTruckAsync(
      safeData.data.licensePlate,
      safeData.data.model
    );
    return res.status(201).json(newTruck);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json(errorResponse);;
    }

    return res.status(500).json({ message: "Erro ao deletar o veículo" });
  }
};

export const getTrucks = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const trucks = await prisma.truck.findMany();
    return res.status(200).json(trucks);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar veículos" });
  }
};

export const getTruckById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const truck = await getTruckByIdAsync(req.params.id);
    if (!truck) {
      return res.status(404).json({ message: "Veículo não encontrado" });
    }
    return res.status(200).json(truck);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar veículo" });
  }
};

export const updateTruck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: safeData.error.flatten().fieldErrors,
      });
    }

    const updatedTruck = await updateTruckAsync(
      req.params.id,
      safeData.data.licensePlate,
      safeData.data.model
    );
    return res.status(200).json(updatedTruck);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json(errorResponse);;
    }

    return res.status(500).json({ message: "Erro ao deletar o veículo" });
  }
};

export const deleteTruck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await deleteTruckAsync(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json(errorResponse);
    }

    return res.status(500).json({ message: "Erro ao deletar o veículo" });
  }
};
