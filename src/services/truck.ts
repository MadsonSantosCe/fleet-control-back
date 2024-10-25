import { prisma } from "../utils/prisma";

export const createTruckAsync = async (licensePlate: string, model: string) => {
    return await prisma.truck.create({
        data: { licensePlate, model },
    });
};

export const getTruckByLicensePlateAsync = async (licensePlate: string) => {
    return await prisma.truck.findFirst({
        where: { licensePlate },
    });
};

export const getTruckByIdAsync = async (id: string) => {
    return await prisma.truck.findUnique({
        where: { id: Number(id) },
        include: { deliveries: true },
    });
};

export const updateTruckAsync = async (id: string, licensePlate: string, model: string) => {
    return await prisma.truck.update({
        where: { id: Number(id) },
        data: { licensePlate, model },
    });
};

export const deleteTruckAsync = async (id: string): Promise<void> => {    
    await prisma.truck.delete({
        where: { id: Number(id) },
    });
};
