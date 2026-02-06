import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

// const createTutor = async (data: TutorProfile, userId: string) => {
//   // const { bio, hourlyRate, startTime, endTime, categoryIds } = payload;
//   const isTutorAlready = await prisma.tutorProfile.findUnique({
//     where: {
//       userId: userId,
//     },
//   });
//   if (isTutorAlready) {
//     throw new Error("one user can only have one tutor profile");
//   }

//   const userData = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });
//   if (userData?.role !== UserRole.tutor) {
//     throw new Error("You are not allowed to access this route!");
//   }
//   const result = await prisma.tutorProfile.create({
//     data: {
//       ...data,
//       userId,
//     },
//   });

//   return result;
// };

// import { prisma } from "../../lib/prisma";

const createTutor = async (
  userId: string,
  payload: {
    bio?: string;
    hourlyRate: number;
    startTime: string;
    endTime: string;
    categoryIds: string[];
  },
) => {
  const { bio, hourlyRate, startTime, endTime, categoryIds } = payload;

  // prevent duplicate tutor profile
  const existing = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (existing) {
    throw new Error("Tutor profile already exists");
  }

  const tutor = await prisma.tutorProfile.create({
    data: {
      userId,
      bio: bio as string,
      hourlyRate,
      startTime: new Date(startTime),
      endTime: new Date(endTime),

      // create TutorCategories entries
      expertise: {
        create: categoryIds.map((catId) => ({
          category: {
            connect: { id: catId },
          },
        })),
      },
    },
    include: {
      expertise: {
        include: { category: true },
      },
    },
  });

  return tutor;
};

// const getAllTutor = async () => {
//   const tutors = await prisma.user.findMany({
//     where: {
//       role: UserRole.tutor,
//     },
//     include: {
//       tutorProfile: true,
//     },
//   });

//   return tutors;
// };

const getAllTutor = async () => {
  const data = await prisma.tutorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return data;
};

const getTutorById = async (tutorId: string) => {
  const data = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return data;
};

export const tutorService = {
  createTutor,
  getAllTutor,
  getTutorById,
};
