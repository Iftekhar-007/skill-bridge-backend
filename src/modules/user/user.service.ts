import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const getAllUser = async () => {
  const data = await prisma.tutorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return data;
};

export const userServices = {
  getAllUser,
};
