import { prisma } from "../utils/prisma";

export const createDriverAsync = async (name: string, license: string) => {
  return await prisma.driver.create({
    data: { name, license },
  });
};

export const getDriverBylicenseAsync = async (license: string) => {
  return await prisma.driver.findUnique({
    where: { license },
  });
};

export const getDriverByIdAsync = async (id: string) => {
  return await prisma.driver.findUnique({
    where: { id: Number(id) },
    include: { deliveries: true },
  });
};

export const updateDriverAsync = async (id: string, name: string, license: string) => {
  return await prisma.driver.update({
    where: { id: Number(id) },
    data: { name, license },
  });
};

export const deleteDriverAsync = async (id: string): Promise<void> => {
  await prisma.driver.delete({
    where: { id: Number(id) },
  });
};
