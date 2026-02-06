import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

type categoryData = {
  title: string;
};

const createCategory = async (
  payload: categoryData,
  user: { role: UserRole },
) => {
  if (user.role !== UserRole.admin) {
    throw new Error("Only admin can create category!");
  }

  const isCategory = await prisma.categories.findUnique({
    where: {
      title: payload.title,
    },
  });

  if (isCategory) {
    throw new Error("This category already exists");
  }

  const data = await prisma.categories.create({
    data: {
      title: payload.title,
    },
  });

  return data;
};

const getAllCategory = async () => {
  const allCategory = await prisma.categories.findMany({
    include: {
      tutors: true,
    },
  });

  return allCategory;
};

export const categoryServices = {
  createCategory,
  getAllCategory,
};
