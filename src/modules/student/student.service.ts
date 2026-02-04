import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const createStudentProfile = async (userId: string, payload: any) => {
  const isStudentProfileAlready = await prisma.studentProfile.findUnique({
    where: {
      id: userId,
    },
  });

  if (isStudentProfileAlready) {
    throw new Error("this account have already a student profile!");
  }

  const studentData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (studentData?.role !== UserRole.student) {
    throw new Error("Only student can access this route!");
  }

  const studentProfile = await prisma.studentProfile.create({
    data: {
      ...payload,
      userId,
    },
  });

  return studentProfile;
};

const getAllStudent = async () => {
  const allStudent = await prisma.studentProfile.findMany({});

  return allStudent;
};

const getStudentProfileById = async (userId: string) => {
  const data = await prisma.studentProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  return data;
};

export const studentService = {
  getStudentProfileById,
  getAllStudent,
  createStudentProfile,
};
