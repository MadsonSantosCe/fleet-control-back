import { Request, Response } from 'express';
import { driverSchema } from '../schemas/driver';
import {
  createDriverAsync,
  deleteDriverAsync,
  getDriverByIdAsync,
  updateDriverAsync,
} from '../services/driver';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const createDriver = async (req: Request, res: Response): Promise<Response> => {
  try {
    const safeData = driverSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    const { name, cpf } = safeData.data;

    
    const newDriver = await createDriverAsync(name, cpf);
    return res.status(201).json(newDriver);

  } catch (error: any) {
    if (error.code === 'P2002') { 
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }
    return res.status(500).json({ message: 'Erro ao criar o motorista' });
  }
};

export const getDrivers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const drivers = await prisma.driver.findMany();
    return res.status(200).json(drivers);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar motoristas' });
  }
};

export const getDriverById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const driver = await getDriverByIdAsync(id);

    if (!driver) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }

    return res.status(200).json(driver);

  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar motorista' });
  }
};

export const updateDriver = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const safeData = driverSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    const { name, cpf } = safeData.data;

    const updatedDriver = await updateDriverAsync(id, name, cpf);
    return res.status(200).json(updatedDriver);

  } catch (error: any) {
    if (error.code === 'P2002') {  
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    if (error.code === 'P2025') {  
      return res.status(400).json({ message: 'Motorista não encontrado' });
    }
    return res.status(500).json({ message: 'Erro ao atualizar motorista' });
  }
};

export const deleteDriver = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteDriverAsync(id);
    return res.status(204).send();

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    return res.status(500).json({ message: 'Erro ao excluir motorista' });
  }
};
