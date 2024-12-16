import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { driverSchema } from "../schemas/driverSchema";
import {
  createDriverAsync,
  deleteDriverAsync,
  getDriverByIdAsync,
  updateDriverAsync,
} from "../services/driverService";

const prisma = new PrismaClient();

export const createDriver = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const safeData = driverSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: safeData.error.flatten().fieldErrors,
      });
    }

    const { name, license } = safeData.data;
    const newDriver = await createDriverAsync(name, license);
    return res.status(201).json(newDriver);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json({ message: `${errorResponse}`});
    }

    return res.status(500).json({ message: "Erro ao criar o motorista" });
  }
};

export const getDrivers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const drivers = await prisma.driver.findMany();
    return res.status(200).json(drivers);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar os motoristas" });
  }
};

export const getDriverById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const driver = await getDriverByIdAsync(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Motorista não encontrado" });
    }
    return res.status(200).json(driver);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar o motorista" });
  }
};

export const updateDriver = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const safeData = driverSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: safeData.error.flatten().fieldErrors,
      });
    }

    const { name, license } = safeData.data;

    const updatedDriver = await updateDriverAsync(id, name, license);
    return res.status(200).json(updatedDriver);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json({ message: `${errorResponse}`});
    }

    return res.status(500).json({ message: "Erro ao atualizar o motorista" });
  }
};

export const deleteDriver = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await deleteDriverAsync(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorResponse = handlePrismaError(error);
      return res.status(400).json({ message: `${errorResponse}`});
    }

    return res.status(500).json({ message: "Erro ao deletar o motorista" });
  }
};

export const handlePrismaError = (error: any): { message: string } => {
  switch (error.code) {
    case "P2002":
      return { message: "CPF já cadastrado" };
    case "P2025":
      return { message: "Motorista não encontrado" };
    case "P2003":
      return {
        message:
          "Este motorista não pode ser excluído porque possui entregas pendentes",
      };
    default:
      return { message: "Ocorreu um erro desconhecido" };
  }
};
