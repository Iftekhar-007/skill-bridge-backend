import { TutorProfile } from "../../../generated/prisma/client";
import { TutorProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

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
      startTime,
      endTime,

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

// const getAllTutor = async (payload: {
//   search: string | undefined;
//   expertise: string[] | [];
//   rating: number | undefined;
// }) => {
//   const andOptions: TutorProfileWhereInput[] = [];
//   if (payload.search) {
//     andOptions.push({
//       expertise: {
//         some: {
//           category: {
//             title: {
//               contains: payload.search,
//               mode: "insensitive",
//             },
//           },
//         },
//       },
//     });
//   }

//   if (payload.expertise.length > 0) {
//     andOptions.push({
//       expertise: {
//         some: {
//           categoryId: {
//             in: payload.expertise,
//           },
//         },
//       },
//     });
//   }

//   if (payload.rating) {
//     andOptions.push({
//       averageRating: payload.rating as number,
//     });
//   }
//   const data = await prisma.tutorProfile.findMany({
//     where: {
//       AND: andOptions,
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//         },
//       },
//       expertise: {
//         include: {
//           category: true,
//         },
//       },
//       bookings: true,
//       reviews: true,
//       _count: true,
//     },
//   });

//   const total = await prisma.tutorProfile.aggregate({
//     _count: {
//       id: true,
//     },
//   });

//   return { data, total };
// };

const getAllTutor = async (payload: {
  search: string | undefined;
  expertise: string[];
  rating: number | undefined;
  pageNumber: number;
  limitNumber: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) => {
  const andOptions: TutorProfileWhereInput[] = [];

  // search filter
  if (payload.search) {
    andOptions.push({
      OR: [
        {
          user: {
            name: {
              contains: payload.search,
              mode: "insensitive",
            },
          },
        },
        {
          expertise: {
            some: {
              category: {
                title: {
                  contains: payload.search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    });
  }

  // expertise filter
  if (payload.expertise.length > 0) {
    andOptions.push({
      expertise: {
        some: {
          categoryId: {
            in: payload.expertise,
          },
        },
      },
    });
  }

  // rating filter
  if (payload.rating !== undefined) {
    andOptions.push({
      averageRating: {
        gte: payload.rating,
      },
    });
  }

  // main query
  const data = await prisma.tutorProfile.findMany({
    skip: payload.skip,
    take: payload.limitNumber,

    where: {
      AND: andOptions,
    },

    orderBy: {
      [payload.sortBy]: payload.sortOrder,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      expertise: {
        include: {
          category: true,
        },
      },
      bookings: true,
      reviews: true,

      _count: {
        select: {
          reviews: true,
          bookings: true,
        },
      },
    },
  });

  // total count with filter
  const total = await prisma.tutorProfile.count({
    where: {
      AND: andOptions,
    },
  });

  return {
    data,
    total,
  };
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
      expertise: {
        include: {
          category: true,
        },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  return data;
};

const getMyTutorProfile = async (userid: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id: userid,
    },
    include: {
      tutorProfile: {
        include: {
          expertise: true,
          bookings: true,
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
  getMyTutorProfile,
};
