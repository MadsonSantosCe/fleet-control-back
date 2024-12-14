import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { truckSchema } from "../schemas/truckSchema";
import {
  createTruckAsync,
  deleteTruckAsync,
  getTruckByIdAsync,
  updateTruckAsync,
} from "../services/truckService";

const prisma = new PrismaClient();

export const createTruck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res
        .status(400)
        .json({ message: safeData.error.flatten().fieldErrors });
    }

    const { licensePlate, model } = safeData.data;
    const newTruck = await createTruckAsync(licensePlate, model);

    return res.status(201).json(newTruck);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Placa já cadastrada" });
    }

    return res
      .status(500)
      .json({ message: "Ocorreu um erro desconhecido ao cadastrar o veículo" });
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
    return res.status(500).json({ message: "Erro ao buscar Veículos" });
  }
};

export const getTruckById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const truck = await getTruckByIdAsync(id);

    if (!truck) {
      return res.status(404).json({ message: "Veículo não encontrado" });
    }

    return res.status(200).json(truck);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar Veículo" });
  }
};

export const updateTruck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res
        .status(400)
        .json({ error: safeData.error.flatten().fieldErrors });
    }

    const { licensePlate, model } = safeData.data;
    const updatedTruck = await updateTruckAsync(id, licensePlate, model);

    return res.status(200).json(updatedTruck);
  } catch (error: any) {

    if (error.code === "P2002") {
      return res.status(400).json({ message: "Placa já cadastrada" });
    }

    if (error.code === "P2025") {
      return res.status(400).json({ message: "Veículo não encontrado" });
    }

    return res
      .status(500)
      .json({
        message: "Ocorreu um erro desconhecido ao atualizar o veículo.",
      });
  }
};

export const deleteTruck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteTruckAsync(id);
    return res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Veículo não encontrado" });
    }

    if (error.code === "P2003") {
      return res
        .status(404)
        .json({
          message:
            "Este veículo não pode ser excluído porque possui entregas pendentes",
        });
    }

    return res.status(500).json({ message: "Erro ao excluir Veículo" });
  }
};
