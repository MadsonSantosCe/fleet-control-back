import { prisma } from "../utils/prisma";

// Cria um novo motorista
export const createDriverAsync = async (name: string, license: string) => {
  return await prisma.driver.create({
    data: { name, license },
  });
};

// Busca um motorista pelo license
export const getDriverBylicenseAsync = async (license: string) => {
  return await prisma.driver.findUnique({
    where: { license },
  });
};

// Busca um motorista pelo ID
export const getDriverByIdAsync = async (id: string) => {
  return await prisma.driver.findUnique({
    where: { id: Number(id) },
  });
};

// Atualiza o license de um motorista específico pelo ID
export const updateDriverAsync = async (id: string, name: string, license: string) => {
  return await prisma.driver.update({
    where: { id: Number(id) },
    data: { name, license },
  });
};

// Exclui um motorista pelo ID
export const deleteDriverAsync = async (id: string): Promise<void> => {
  await prisma.driver.delete({
    where: { id: Number(id) },
  });
};
