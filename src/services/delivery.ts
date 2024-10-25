import { prisma } from "../utils/prisma";
import { DeliveryInput } from "../interfaces/delivery";
import { applyDeliveryRulesValues } from "../utils/deliveryRules";

export const createDeliveryAsync = async (input: DeliveryInput) => {
  const deliveryData = applyDeliveryRulesValues(input);

  const newDelivery = await prisma.delivery.create({
    data: {
      ...deliveryData,
    },
  });

  return newDelivery;
};


export const getDeliveryByIdAsync = async (id: number) => {
  return await prisma.delivery.findUnique({
    where: { id },
    include: { truck: true, driver: true },
  });
};

export const getAllDeliveriesAsync = async () => {
  return await prisma.delivery.findMany({
    include: { truck: true, driver: true },
  });
};

export const updateDeliveryAsync = async (id: number, input: DeliveryInput) => {
  const deliveryData = applyDeliveryRulesValues(input);

  const updatedDelivery = await prisma.delivery.update({
    where: { id },
    data: {
      ...deliveryData,
    },
  });

  return updatedDelivery;
};

export const deleteDeliveryAsync = async (id: number): Promise<void> => {
  await prisma.delivery.delete({
    where: { id },
  });
};