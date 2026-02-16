import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  trustedOrigins: ["http://localhost:3000", "http://localhost:5000"],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true,
        input: true,
      },
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),

//   baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

//   trustedOrigins: [
//     "http://localhost:3000",
//     "http://localhost:5000",
//   ],

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: true,
//     requireEmailVerification: false,
//   },

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         required: true,
//         input: true,
//         defaultValue: "STUDENT",

//         validator: {
//           input: (value) => {
//             if (!["STUDENT", "TUTOR"].includes(value)) {
//               throw new Error("Invalid role");
//             }
//             return value;
//           },
//         },
//       },
//     },
//   },

//   databaseHooks: {
//   user: {
//     create: {
//       after: async (user, context) => {

//         if (user.role === "TUTOR") {
//           await prisma.tutorProfile.create({
//             data: {
//               user: {
//                 connect: {
//                   id: user.id,
//                 },
//               },
//             },
//           });
//         }

//         if (user.role === "STUDENT") {
//           await prisma.studentProfile.create({
//             data: {
//               user: {
//                 connect: {
//                   id: user.id,
//                 },
//               },
//             },
//           });
//         }

//       },
//     },
//   },
// },

//   socialProviders: {
//     google: {
//       prompt: "select_account consent",
//       accessType: "offline",
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     },
//   },
// });
