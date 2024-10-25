import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { truckSchema } from '../schemas/truck';
import {
  createTruckAsync,
  deleteTruckAsync,
  getTruckByIdAsync,
  getTruckByLicensePlateAsync,
  updateTruckAsync,
} from '../services/truck';

const prisma = new PrismaClient();

export const createTruck = async (req: Request, res: Response): Promise<Response> => {
  try {
    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    const { licensePlate } = safeData.data;

    const hasTruck = await getTruckByLicensePlateAsync(licensePlate);
    if (hasTruck) {
      return res.status(400).json({ message: 'Caminhão já cadastrado' });
    }

    const newTruck = await createTruckAsync(licensePlate);
    return res.status(201).json(newTruck);

  } catch (error) {
    console.error('Erro ao criar o caminhão:', error);
    return res.status(500).json({ message: 'Erro ao criar o caminhão' });
  }
};

export const getTrucks = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const trucks = await prisma.truck.findMany();
    return res.status(200).json(trucks);
  } catch (error) {
    console.error('Erro ao buscar caminhões:', error);
    return res.status(404).json({ message: 'Erro ao buscar caminhões' });
  }
};

export const getTruckById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const truck = await getTruckByIdAsync(id);

    if (!truck) {
      return res.status(404).json({ message: 'Caminhão não encontrado' });
    }

    return res.status(200).json(truck);

  } catch (error) {
    console.error('Erro ao buscar caminhão por ID:', error);
    return res.status(404).json({ message: 'Erro ao buscar caminhão' });
  }
};

export const updateTruck = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    const { licensePlate } = safeData.data;

    const updatedTruck = await updateTruckAsync(id, licensePlate);
    return res.status(200).json(updatedTruck);

  } catch (error) {
    console.error('Erro ao atualizar caminhão:', error);
    return res.status(400).json({ message: 'Caminhão já cadastrado ou erro de atualização' });
  }
};

export const deleteTruck = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteTruckAsync(id);
    return res.status(204).send();

  } catch (error) {
    console.error('Erro ao excluir caminhão:', error);
    return res.status(404).json({ message: 'Caminhão não encontrado ou erro ao excluir' });
  }
};