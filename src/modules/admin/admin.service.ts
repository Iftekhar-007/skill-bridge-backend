import { prisma } from "../../lib/prisma";

const getAllUser = async () => {
  const data = await prisma.user.findMany();

  return data;
};

const getUserById = async (userId: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return data;
};

export const adminServices = {
  getAllUser,
  getUserById,
};
