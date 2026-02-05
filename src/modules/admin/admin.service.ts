import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

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

const getStudents = async () => {
  const data = await prisma.studentProfile.findMany({
    include: { user: true },
  });

  return data;
};

const getStudentById = async (
  studentId: string,
  user: { id: string; role: UserRole },
) => {
  const data = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  if (!data) {
    throw new Error("Student profile not found");
  }

  if (user.role === UserRole.admin) {
    return data;
  }

  if (user.role === UserRole.student && user.id === data.userId) {
    return data;
  }

  if (user.role === UserRole.tutor) {
    const hasBooking = await prisma.bookings.findFirst({
      where: {
        tutorId: user.id,
        studentId: data.id,
      },
    });

    if (hasBooking) {
      return data;
    }
  }

  // return data;

  throw new Error("you are not allowed to view this route");
};

export const adminServices = {
  getAllUser,
  getUserById,
  getStudents,
  getStudentById,
};
