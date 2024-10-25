import { Request, Response } from 'express';
import { deliverySchema } from '../schemas/delivery';
import {
    createDeliveryAsync,
    deleteDeliveryAsync,
    getDeliveryByIdAsync,
    getAllDeliveriesAsync,
    updateDeliveryAsync,
} from '../services/delivery';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDelivery = async (req: Request, res: Response): Promise<Response> => {
    try {

        const safeData = deliverySchema.safeParse(req.body);
        if (!safeData.success) {
            return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        }

        const newDelivery = await createDeliveryAsync(safeData.data);

        return res.status(201).json(newDelivery);

    } catch (error: any) {
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Caminhão ou motorista não encontrados' });
        }
        return res.status(500).json({ message: 'Erro ao criar entrega' });
    }
};

export const getDeliveries = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const deliveries = await getAllDeliveriesAsync();
        return res.status(200).json(deliveries);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar entregas' });
    }
};

export const getDeliveryById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const delivery = await getDeliveryByIdAsync(Number(id));

        if (!delivery) {
            return res.status(404).json({ message: 'Entrega não encontrada' });
        }

        return res.status(200).json(delivery);

    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar entrega' });
    }
};

export const updateDelivery = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const safeData = deliverySchema.safeParse(req.body);
        if (!safeData.success) {
            return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        }

        const updatedDelivery = await updateDeliveryAsync(
            Number(id),
            safeData.data
        );

        return res.status(200).json(updatedDelivery);

    } catch (error: any) {
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Caminhão ou motorista não encontrados' });
        }
        return res.status(500).json({ message: 'Erro ao atualizar entrega' });
    }
};

export const deleteDelivery = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        await deleteDeliveryAsync(Number(id));
        return res.status(204).send();

    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao excluir entrega' });
    }
};