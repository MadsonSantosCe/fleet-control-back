import { Request, Response } from 'express';
import { deliverySchema } from '../schemas/DeliverySchema';
import {
    createDeliveryAsync,
    deleteDeliveryAsync,
    getDeliveryByIdAsync,
    getAllDeliveriesAsync,
    updateDeliveryAsync,
} from '../services/DeliveryService';
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
            const target = error.meta?.field_name?.includes("truckId") ? "Caminhão" : "Motorista";
            return res.status(400).json({ message: `${target} não encontrado` });
        }

        if (error instanceof Error) {
            const errorsList = error.message.split(" | ");
            return res.status(400).json({ errors: errorsList });
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
        let errorResponse;

        if (error.code === 'P2003') {
            const target = error.meta?.field_name?.includes("truckId") ? "caminhão" : "motorista";
            errorResponse = {
                error: {
                    message: 'Erro de validação',
                    details: { [target]: [`${target.charAt(0).toUpperCase() + target.slice(1)} não encontrado`] }
                }
            };
            return res.status(400).json(errorResponse);
        }

        if (error instanceof Error) {
            const errorsList = error.message.split(" | ");
            errorResponse = {
                error: {
                    message: 'Erro de validação',
                    details: { general: errorsList }
                }
            };
            return res.status(400).json(errorResponse);
        }

        errorResponse = {
            error: {
                message: 'Erro ao atualizar a entrega',
                details: { general: ['Ocorreu um erro desconhecido ao atualizar a entrega.'] }
            }
        };

        return res.status(500).json(errorResponse);
    }
};

export const deleteDelivery = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        await deleteDeliveryAsync(Number(id));
        return res.status(204).send();

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Entrega não encontrada' });
        }
        return res.status(500).json({ message: 'Erro ao excluir entrega' });
    }
};
