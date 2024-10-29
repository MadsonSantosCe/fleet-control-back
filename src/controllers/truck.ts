import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { truckSchema } from '../schemas/truck';
import {
  createTruckAsync,
  deleteTruckAsync,
  getTruckByIdAsync,
  updateTruckAsync,
} from '../services/truck';

const prisma = new PrismaClient();

export const createTruck = async (req: Request, res: Response): Promise<Response> => {
  try {
    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    const { licensePlate, model } = safeData.data;
    const newTruck = await createTruckAsync(licensePlate, model);

    return res.status(201).json(newTruck);

  } catch (error: any) {
    let errorResponse;

    if (error.code === 'P2002') {
      errorResponse = {
        error: { message: 'Erro de validação', details: { cpf: ['Placa já cadastrada'] } }
      };
      return res.status(400).json(errorResponse);
    }

    errorResponse = {
      error: {
        message: 'Erro ao criar o motorista', details: { general: ['Ocorreu um erro desconhecido ao cadastrar o veículo.'] }
      }
    };
    return res.status(500).json(errorResponse);
  }
};

export const getTrucks = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const trucks = await prisma.truck.findMany();
    return res.status(200).json(trucks);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar caminhões' });
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
    return res.status(500).json({ message: 'Erro ao buscar caminhão' });
  }
};

export const updateTruck = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const safeData = truckSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    const { licensePlate, model } = safeData.data;
    const updatedTruck = await updateTruckAsync(id, licensePlate, model);

    return res.status(200).json(updatedTruck);

  } catch (error: any) {
    let errorResponse;

    if (error.code === 'P2002') {
      errorResponse = {
        error: {
          message: 'Erro de validação', details: { cpf: ['Placa já cadastrado'] }
        }
      };
      return res.status(400).json(errorResponse);
    }

    if (error.code === 'P2025') {
      errorResponse = {
        error: {
          message: 'Erro de validação', details: { motorista: ['Veículo não encontrado'] }
        }
      };
      return res.status(400).json(errorResponse);
    }

    errorResponse = {
      error: {
        message: 'Erro ao atualizar o Veículo', details: { general: ['Ocorreu um erro desconhecido ao atualizar o motorista.'] }
      }
    };

    return res.status(500).json(errorResponse);
  }
};

export const deleteTruck = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteTruckAsync(id);
    return res.status(204).send();

  } catch (error: any) {

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Caminhão não encontrado' });
    }

    return res.status(500).json({ message: 'Erro ao excluir caminhão' });
  }
};
