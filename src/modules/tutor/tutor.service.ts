import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutor = async (data: TutorProfile, userId: string) => {
  const isTutorAlready = await prisma.tutorProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  if (isTutorAlready) {
    throw new Error("one user can only have one tutor profile");
  }
  const result = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId,
    },
  });

  return result;
};

export const tutorService = {
  createTutor,
};
