import { DeliveryInput } from "../interfaces/DeliveryInput";
import { DeliveryType, Destinations } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const createDeliveryAsync = async (input: DeliveryInput) => {
  await checkDeliveryLimits(input.truckId, input.driverId, input.destination);
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
  await checkDeliveryLimits(input.truckId, input.driverId, input.destination);

  const deliveryData = applyUpdateDeliveryRules(input);

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

export const countTruckDeliveriesThisMonth = async (truckId: number): Promise<number> => {
  const { startOfMonth, endOfMonth } = getMonthRange();

  return prisma.delivery.count({
    where: {
      truckId,
      deliveryTime: { gte: startOfMonth, lte: endOfMonth },
    },
  });
};


export const countDriverDeliveriesThisMonth = async (driverId: number): Promise<number> => {
  const { startOfMonth, endOfMonth } = getMonthRange();

  return prisma.delivery.count({
    where: {
      driverId,
      deliveryTime: { gte: startOfMonth, lte: endOfMonth },
    },
  });
};


export const checkDriverNortheastDeliveryThisMonth = async (driverId: number): Promise<boolean> => {
  const { startOfMonth, endOfMonth } = getMonthRange();

  const northeastDelivery = await prisma.delivery.findFirst({
    where: {
      driverId,
      destination: Destinations.Nordeste,
      deliveryTime: { gte: startOfMonth, lte: endOfMonth },
    },
  });

  return !!northeastDelivery;
};


const getMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return { startOfMonth, endOfMonth };
};

const checkDeliveryLimits = async (truckId: number, driverId: number, destination: Destinations) => {

  const deliveryCount = await countTruckDeliveriesThisMonth(truckId);
  if (deliveryCount >= 4) {
    throw new Error("O caminhão já possui quatro entregas no mês atual e não pode receber mais");
  }

  const driverDeliveries = await countDriverDeliveriesThisMonth(driverId);
  if (driverDeliveries >= 2) {
    throw new Error("Este motorista já atingiu o limite de duas entregas por mês");
  }

  if (destination === Destinations.Nordeste) {
    const hasNortheastDelivery = await checkDriverNortheastDeliveryThisMonth(driverId);
    if (hasNortheastDelivery) {
      throw new Error("Este motorista já fez uma entrega para o Nordeste no mês atual");
    }
  }
};

export const applyDeliveryRulesValues = (input: DeliveryInput) => {
  const delivery = {
    ...input,
    insurance: input.insurance ?? false,
    dangerous: input.dangerous ?? false,
    valuable: input.valuable ?? false,
  };

  applyValueRules(delivery);
  applyDangerousRules(delivery);
  applyDestinationFee(delivery);

  return delivery;
};

export const applyUpdateDeliveryRules = (input: DeliveryInput) => {
  const delivery = {
    ...input,
    insurance: input.insurance ?? false,
    dangerous: input.dangerous ?? false,
    valuable: input.valuable ?? false,
  };

  applyValueRules(delivery);
  applyDangerousRules(delivery);

  return delivery;
}

const applyValueRules = (delivery: DeliveryInput) => {
  if (delivery.value > 30000) {
    delivery.valuable = true;
  }
};

const applyDangerousRules = (delivery: DeliveryInput) => {
  if (delivery.type === DeliveryType.Combustivel) {
    delivery.dangerous = true;
  }
};

const applyDestinationFee = (delivery: DeliveryInput) => {
  switch (delivery.destination) {
    case Destinations.Nordeste:
      delivery.value *= 1.2;
      break;
    case Destinations.Argentina:
      delivery.value *= 1.4;
      break;
    case Destinations.Amazonia:
      delivery.value *= 1.3;
      break;
    default:
      break;
  }
};