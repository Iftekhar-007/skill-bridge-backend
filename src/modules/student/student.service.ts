import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

type CreateStudentType = {
  userId: string;
  phone: string;
  level: number;
};

const createStudentProfile = async (
  payload: CreateStudentType,
  userId: string,
) => {
  const isUserAlreadyStudent = await prisma.studentProfile.findUnique({
    where: { userId: userId },
  });

  if (isUserAlreadyStudent) {
    throw new Error("user already has a student profile");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.role !== UserRole.student) {
    throw new Error("only student can create profile!");
  }

  const result = await prisma.studentProfile.create({
    data: {
      userId: userId,
      phone: payload.phone,
      level: payload.level,
    },
  });

  return result;
};

// const getAllStudent = async () => {
//   const data = await prisma.user.findMany({
//     where: {
//       role: UserRole.student,
//     },
//     // include: {
//     //   studentProfile: true,
//     // },
//   });

//   return data;
// };

export const studentService = {
  createStudentProfile,
};
