import { prisma } from "../utils/prisma";

export type DeliveryInput = {
  type: string;
  value: number;
  destination: string;
  deliveryTime: Date;
  truckId: number;
  driverId: number;
  insurance?: boolean;
  dangerous?: boolean;
  valuable?: boolean;
};

const applyDefaultBooleanValues = (input: DeliveryInput) => ({
  ...input,
  insurance: input.insurance ?? false,
  dangerous: input.dangerous ?? false,
  valuable: input.valuable ?? false,
});

export const createDeliveryAsync = async (input: DeliveryInput) => {
  const deliveryData = applyDefaultBooleanValues(input);

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
  const deliveryData = applyDefaultBooleanValues(input);

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
