var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express7 from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// ? user schema\nmodel User {\n  id             String          @id\n  name           String\n  email          String\n  emailVerified  Boolean         @default(false)\n  image          String?\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  sessions       Session[]\n  accounts       Account[]\n  tutorProfile   TutorProfile?\n  role           UserRole        @default(USER)\n  status         UserStatus      @default(ACTIVE)\n  studentProfile StudentProfile?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRole {\n  USER\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n}\n\n// ? Bookings Schema \n\nmodel Bookings {\n  id         String         @id @default(uuid())\n  studentId  String\n  student    StudentProfile @relation(fields: [studentId], references: [id])\n  tutorId    String\n  tutor      TutorProfile   @relation(fields: [tutorId], references: [id])\n  date       DateTime\n  startTime  DateTime\n  endTime    DateTime\n  status     BookingsStatus @default(CONFIRMED)\n  price      Int            @default(0)\n  reviews    Reviews?\n  ctreatedAt DateTime       @default(now())\n\n  @@index([tutorId, date, startTime])\n}\n\nenum BookingsStatus {\n  COMPLETED\n  CONFIRMED\n  CANCELLED\n}\n\n// ? category Schema \n\nmodel Categories {\n  id     String            @id @default(uuid())\n  title  String\n  image  String?\n  tutors TutorCategories[]\n\n  @@unique([title])\n  @@map("category")\n}\n\n// ? category and tutor many to many relation junction table \n\nmodel TutorCategories {\n  tutorProfileId String\n  categoryId     String\n\n  tutor    TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  category Categories   @relation(fields: [categoryId], references: [id])\n\n  @@id([tutorProfileId, categoryId])\n  @@map("tutorJunction")\n}\n\n// ? comment schema \n\nmodel Reviews {\n  id        String         @id @default(uuid())\n  studentId String\n  student   StudentProfile @relation(fields: [studentId], references: [id])\n  tutorId   String\n  tutor     TutorProfile   @relation(fields: [tutorId], references: [id])\n  bookingId String         @unique\n  booking   Bookings       @relation(fields: [bookingId], references: [id])\n  rating    Float\n  comment   String\n  createdAt DateTime       @default(now())\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// // ? tutor profile schema\n// model TutorProfile {\n//   id           String       @id @default(uuid())\n//   userId       String       @unique\n//   user         User         @relation(fields: [userId], references: [id])\n//   availability Availability @default(AVAILABLE)\n//   bio          String?\n\n//   hourlyRate    Int               @default(0)\n//   averageRating Float             @default(0)\n//   totalStudents Int               @default(0)\n//   createdAt     DateTime          @default(now())\n//   updatedAt     DateTime          @updatedAt\n//   expertise     TutorCategories[]\n//   bookings      Bookings[]\n//   reviews       Reviews[]\n\n//   @@map("tutor")\n// }\n\n// enum Availability {\n//   AVAILABLE\n//   UNAVAILABLE\n// }\n\n// // ? student profile \n\n// model StudentProfile {\n//   id        String     @id @default(uuid())\n//   userId    String     @unique\n//   user      User       @relation(fields: [userId], references: [id])\n//   phone     String?\n//   level     Int\n//   createdAt DateTime   @default(now())\n//   updatedAt DateTime   @updatedAt\n//   bookings  Bookings[]\n//   reviews   Reviews[]\n// }\n\n// // ? category Schema \n\n// model Categories {\n//   id     String            @id @default(uuid())\n//   title  String\n//   image  String?\n//   tutors TutorCategories[]\n\n//   @@unique([title])\n//   @@map("category")\n// }\n\n// // ? category and tutor many to many relation junction table \n\n// model TutorCategories {\n//   tutorProfileId String\n//   categoryId     String\n\n//   tutor    TutorProfile @relation(fields: [tutorProfileId], references: [id])\n//   category Categories   @relation(fields: [categoryId], references: [id])\n\n//   @@id([tutorProfileId, categoryId])\n//   @@map("tutorJunction")\n// }\n\n// // ? Bookings Schema \n\n// model Bookings {\n//   id         String         @id @default(uuid())\n//   studentId  String\n//   student    StudentProfile @relation(fields: [studentId], references: [id])\n//   tutorId    String\n//   tutor      TutorProfile   @relation(fields: [tutorId], references: [id])\n//   date       DateTime\n//   startTime  DateTime\n//   endTime    DateTime\n//   status     BookingsStatus @default(CONFIRMED)\n//   price      Int            @default(0)\n//   reviews    Reviews?\n//   ctreatedAt DateTime       @default(now())\n\n//   @@index([tutorId, date, startTime])\n// }\n\n// enum BookingsStatus {\n//   COMPLETED\n//   CONFIRMED\n//   CANCELLED\n// }\n\n// // ? comment schema \n\n// model Reviews {\n//   id        String         @id @default(uuid())\n//   studentId String\n//   student   StudentProfile @relation(fields: [studentId], references: [id])\n//   tutorId   String\n//   tutor     TutorProfile   @relation(fields: [tutorId], references: [id])\n//   bookingId String         @unique\n//   booking   Bookings       @relation(fields: [bookingId], references: [id])\n//   rating    Float\n//   comment   String\n//   createdAt DateTime       @default(now())\n\n//   @@map("reviews")\n// }\n\n// // ? user schema\n// model User {\n//   id             String          @id\n//   name           String\n//   email          String\n//   emailVerified  Boolean         @default(false)\n//   image          String?\n//   createdAt      DateTime        @default(now())\n//   updatedAt      DateTime        @updatedAt\n//   sessions       Session[]\n//   accounts       Account[]\n//   tutorProfile   TutorProfile?\n//   role           UserRole        @default(PUBLIC)\n//   status         UserStatus      @default(ACTIVE)\n//   studentProfile StudentProfile?\n\n//   @@unique([email])\n//   @@map("user")\n// }\n\n// model Session {\n//   id        String   @id\n//   expiresAt DateTime\n//   token     String\n//   createdAt DateTime @default(now())\n//   updatedAt DateTime @updatedAt\n//   ipAddress String?\n//   userAgent String?\n//   userId    String\n//   user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n//   @@unique([token])\n//   @@index([userId])\n//   @@map("session")\n// }\n\n// model Account {\n//   id                    String    @id\n//   accountId             String\n//   providerId            String\n//   userId                String\n//   user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n//   accessToken           String?\n//   refreshToken          String?\n//   idToken               String?\n//   accessTokenExpiresAt  DateTime?\n//   refreshTokenExpiresAt DateTime?\n//   scope                 String?\n//   password              String?\n//   createdAt             DateTime  @default(now())\n//   updatedAt             DateTime  @updatedAt\n\n//   @@index([userId])\n//   @@map("account")\n// }\n\n// model Verification {\n//   id         String   @id\n//   identifier String\n//   value      String\n//   expiresAt  DateTime\n//   createdAt  DateTime @default(now())\n//   updatedAt  DateTime @updatedAt\n\n//   @@index([identifier])\n//   @@map("verification")\n// }\n\n// enum UserRole {\n//   PUBLIC\n//   STUDENT\n//   TUTOR\n//   ADMIN\n// }\n\n// enum UserStatus {\n//   ACTIVE\n//   BLOCKED\n// }\n\n// ? student profile \n\nmodel StudentProfile {\n  id        String     @id @default(uuid())\n  userId    String     @unique\n  user      User       @relation(fields: [userId], references: [id])\n  phone     String?\n  level     Int\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  bookings  Bookings[]\n  reviews   Reviews[]\n\n  @@map("student")\n}\n\n// ? tutor profile schema\nmodel TutorProfile {\n  id            String            @id @default(uuid())\n  userId        String            @unique\n  user          User              @relation(fields: [userId], references: [id])\n  availability  Availability      @default(AVAILABLE)\n  startTime     String\n  endTime       String\n  bio           String?\n  hourlyRate    Int               @default(0)\n  averageRating Float             @default(0)\n  totalStudents Int               @default(0)\n  createdAt     DateTime          @default(now())\n  updatedAt     DateTime          @updatedAt\n  expertise     TutorCategories[]\n  bookings      Bookings[]\n  reviews       Reviews[]\n\n  @@map("tutor")\n}\n\nenum Availability {\n  AVAILABLE\n  UNAVAILABLE\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Bookings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"StudentProfile","relationName":"BookingsToStudentProfile"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingsToTutorProfile"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingsStatus"},{"name":"price","kind":"scalar","type":"Int"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"BookingsToReviews"},{"name":"ctreatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorCategories","relationName":"CategoriesToTutorCategories"}],"dbName":"category"},"TutorCategories":{"fields":[{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoriesToTutorProfile"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToTutorCategories"}],"dbName":"tutorJunction"},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"StudentProfile","relationName":"ReviewsToStudentProfile"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewsToTutorProfile"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Bookings","relationName":"BookingsToReviews"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"level","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"BookingsToStudentProfile"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToStudentProfile"}],"dbName":"student"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"availability","kind":"enum","type":"Availability"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalStudents","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"expertise","kind":"object","type":"TutorCategories","relationName":"TutorCategoriesToTutorProfile"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"BookingsToTutorProfile"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToTutorProfile"}],"dbName":"tutor"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookingsScalarFieldEnum: () => BookingsScalarFieldEnum,
  CategoriesScalarFieldEnum: () => CategoriesScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewsScalarFieldEnum: () => ReviewsScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StudentProfileScalarFieldEnum: () => StudentProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoriesScalarFieldEnum: () => TutorCategoriesScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Bookings: "Bookings",
  Categories: "Categories",
  TutorCategories: "TutorCategories",
  Reviews: "Reviews",
  StudentProfile: "StudentProfile",
  TutorProfile: "TutorProfile"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingsScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  date: "date",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  price: "price",
  ctreatedAt: "ctreatedAt"
};
var CategoriesScalarFieldEnum = {
  id: "id",
  title: "title",
  image: "image"
};
var TutorCategoriesScalarFieldEnum = {
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId"
};
var ReviewsScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  bookingId: "bookingId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var StudentProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  phone: "phone",
  level: "level",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  availability: "availability",
  startTime: "startTime",
  endTime: "endTime",
  bio: "bio",
  hourlyRate: "hourlyRate",
  averageRating: "averageRating",
  totalStudents: "totalStudents",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var BookingsStatus = {
  COMPLETED: "COMPLETED",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  trustedOrigins: ["http://localhost:3000", "http://localhost:5000"],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true,
        input: true
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/modules/tutor/tutor.routes.ts
import express from "express";

// src/modules/tutor/tutor.service.ts
var createTutor = async (userId, payload) => {
  const { bio, hourlyRate, startTime, endTime, categoryIds } = payload;
  const existing = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (existing) {
    throw new Error("Tutor profile already exists");
  }
  const tutor = await prisma.tutorProfile.create({
    data: {
      userId,
      bio,
      hourlyRate,
      startTime,
      endTime,
      // create TutorCategories entries
      expertise: {
        create: categoryIds.map((catId) => ({
          category: {
            connect: { id: catId }
          }
        }))
      }
    },
    include: {
      expertise: {
        include: { category: true }
      }
    }
  });
  return tutor;
};
var getAllTutor = async (payload) => {
  const andOptions = [];
  if (payload.search) {
    andOptions.push({
      OR: [
        {
          user: {
            name: {
              contains: payload.search,
              mode: "insensitive"
            }
          }
        },
        {
          expertise: {
            some: {
              category: {
                title: {
                  contains: payload.search,
                  mode: "insensitive"
                }
              }
            }
          }
        }
      ]
    });
  }
  if (payload.expertise.length > 0) {
    andOptions.push({
      expertise: {
        some: {
          categoryId: {
            in: payload.expertise
          }
        }
      }
    });
  }
  if (payload.rating !== void 0) {
    andOptions.push({
      averageRating: {
        gte: payload.rating
      }
    });
  }
  const data = await prisma.tutorProfile.findMany({
    skip: payload.skip,
    take: payload.limitNumber,
    where: {
      AND: andOptions
    },
    orderBy: {
      [payload.sortBy]: payload.sortOrder
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      expertise: {
        include: {
          category: true
        }
      },
      bookings: true,
      reviews: true,
      _count: {
        select: {
          reviews: true,
          bookings: true
        }
      }
    }
  });
  const total = await prisma.tutorProfile.count({
    where: {
      AND: andOptions
    }
  });
  return {
    data,
    total
  };
};
var getTutorById = async (tutorId) => {
  const data = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      expertise: {
        include: {
          category: true
        }
      },
      reviews: {
        include: {
          student: {
            include: {
              user: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: {
          bookings: true
        }
      }
    }
  });
  return data;
};
var getMyTutorProfile = async (userid) => {
  const data = await prisma.user.findUnique({
    where: {
      id: userid
    },
    include: {
      tutorProfile: {
        include: {
          expertise: true,
          bookings: true
        }
      }
    }
  });
  return data;
};
var tutorService = {
  createTutor,
  getAllTutor,
  getTutorById,
  getMyTutorProfile
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const pageNumber = Number(options.pageNumber) || 1;
  const limitNumber = Number(options.limitNumber) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" || options.sortOrder === "desc" ? options.sortOrder : "desc";
  return {
    pageNumber,
    limitNumber,
    skip,
    sortBy,
    sortOrder
  };
};

// src/modules/tutor/tutor.controller.ts
var createTutor2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(403).json({ success: false, message: "forbidden!" });
    }
    const result = await tutorService.createTutor(user?.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
    next(err);
  }
};
var getAllTutor2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchStr = typeof search === "string" ? search : void 0;
    const expertise = req.query.expertise ? req.query.expertise.split(",") : [];
    const rating = req.query.averageRating ? Number(req.query.averageRating) : void 0;
    const { pageNumber, limitNumber, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
    const result = await tutorService.getAllTutor({
      search: searchStr,
      expertise,
      rating,
      pageNumber,
      limitNumber,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      success: true,
      meta: {
        pageNumber,
        limitNumber,
        total: result.total
      },
      data: result.data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var getTutorById2 = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await tutorService.getTutorById(tutorId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var getMyTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    const userId = user?.id;
    const result = await tutorService.getMyTutorProfile(userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var tutorController = {
  createTutor: createTutor2,
  getAllTutor: getAllTutor2,
  getTutorById: getTutorById2,
  getMyTutorProfile: getMyTutorProfile2
};

// src/middlewares/auth.ts
import { fromNodeHeaders } from "better-auth/node";
var authMiddle = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    if (!session) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized!"
      });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role
    };
    if (roles && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden Access!! You are not allowed to access this route"
      });
    }
    next();
  };
};
var auth_default = authMiddle;

// src/modules/tutor/tutor.routes.ts
var router = express.Router();
router.get("/tutors", tutorController.getAllTutor);
router.post(
  "/create-tutor",
  auth_default("TUTOR" /* tutor */),
  tutorController.createTutor
);
router.get("/:tutorId", tutorController.getTutorById);
router.get(
  "/my-tutor-profile",
  auth_default("TUTOR" /* tutor */),
  tutorController.getMyTutorProfile
);
var tutorRoutes = router;

// src/modules/admin/admin.routes.ts
import express2 from "express";

// src/modules/admin/admin.service.ts
var getAllUser = async () => {
  const data = await prisma.user.findMany();
  const total = await prisma.user.aggregate({
    _count: {
      id: true
    }
  });
  return { data, total };
};
var getUserById = async (userId) => {
  const data = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  return data;
};
var getStudents = async (user) => {
  if (user.role === "ADMIN" /* admin */) {
    return prisma.studentProfile.findMany({
      include: { user: true }
    });
  }
  if (user.role === "TUTOR" /* tutor */) {
    return prisma.studentProfile.findMany({
      where: {
        bookings: {
          some: {
            tutorId: user.id
          }
        }
      },
      include: { user: true }
    });
  }
  throw new Error("You are not allowed to view student list");
};
var getStudentById = async (studentId, user) => {
  const data = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      bookings: true,
      _count: {
        select: { bookings: true }
      }
    }
  });
  if (!data) {
    throw new Error("Student profile not found");
  }
  if (user.role === "ADMIN" /* admin */) {
    return data;
  }
  if (user.role === "STUDENT" /* student */ && user.id === data.userId) {
    return data;
  }
  throw new Error("you are not allowed to view this route");
};
var updateUserStatus = async (userId, status) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role === "ADMIN" /* admin */) {
    throw new Error("Cannot change another admin's status");
  }
  return prisma.user.update({
    where: { id: userId },
    data: { status }
  });
};
var adminServices = {
  getAllUser,
  getUserById,
  getStudents,
  getStudentById,
  updateUserStatus
};

// src/modules/admin/admin.controller.ts
var getAllUser2 = async (req, res) => {
  try {
    const result = await adminServices.getAllUser();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await adminServices.getUserById(userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var getStudents2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const data = await adminServices.getStudents({
      id: req.user?.id,
      role: req.user?.role
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var getStudentById2 = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = req.user;
    const data = await adminServices.getStudentById(studentId, {
      id: user?.id,
      role: user?.role
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const result = await adminServices.updateUserStatus(
      userId,
      status
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var adminController = {
  getAllUser: getAllUser2,
  getUserById: getUserById2,
  getStudents: getStudents2,
  getStudentById: getStudentById2,
  updateUserStatus: updateUserStatus2
};

// src/modules/admin/admin.routes.ts
var router2 = express2.Router();
router2.get("/users", auth_default("ADMIN" /* admin */), adminController.getAllUser);
router2.get(
  "/users/:userId",
  auth_default("ADMIN" /* admin */),
  adminController.getUserById
);
router2.get(
  "/students",
  auth_default("ADMIN" /* admin */, "TUTOR" /* tutor */),
  adminController.getStudents
);
router2.patch(
  "/users/status/:userId",
  auth_default("ADMIN" /* admin */),
  adminController.updateUserStatus
);
router2.get("/:studentId", adminController.getStudentById);
var adminRoutes = router2;

// src/modules/bookings/bookings.routes.ts
import express3 from "express";

// src/modules/bookings/bookings.service.ts
var createBooking = async (userId, payload) => {
  return await prisma.$transaction(async (tx) => {
    const studentProfile = await tx.studentProfile.findUnique({
      where: { userId }
    });
    if (!studentProfile) {
      throw new Error("Student profile not found");
    }
    const tutor = await tx.tutorProfile.findUnique({
      where: { id: payload.tutorId }
    });
    if (!tutor) {
      throw new Error("Tutor not found");
    }
    if (tutor.availability !== "AVAILABLE") {
      throw new Error("Tutor is currently unavailable for booking");
    }
    const booking = await tx.bookings.create({
      data: {
        studentId: studentProfile.id,
        tutorId: payload.tutorId,
        date: new Date(payload.date),
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
        price: payload.price
      }
    });
    await tx.tutorProfile.update({
      where: { id: payload.tutorId },
      data: {
        totalStudents: {
          increment: 1
        },
        availability: "UNAVAILABLE"
      }
    });
    return booking;
  });
};
var getAllBookings = async (user) => {
  if (user.role === "ADMIN" /* admin */) {
    const data = await prisma.bookings.findMany({
      include: {
        student: true,
        tutor: true,
        reviews: true
      }
    });
    return data;
  }
  if (user.role === "STUDENT" /* student */) {
    const data = await prisma.bookings.findMany({
      include: {
        student: true,
        tutor: true,
        reviews: true
      },
      where: {
        student: {
          userId: user.id
        }
      }
    });
    return data;
  }
  if (user.role === "TUTOR" /* tutor */) {
    const data = await prisma.bookings.findMany({
      include: {
        student: true,
        tutor: true,
        reviews: true
      },
      where: {
        tutor: {
          userId: user.id
        }
      }
    });
    return data;
  }
};
var updateBookingStatusService = async (bookingId, tutorId, status) => {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.tutorId !== tutorId) {
    throw new Error("Unauthorized: This booking does not belong to you");
  }
  if (booking.status === BookingsStatus.CANCELLED) {
    throw new Error("Cannot update a cancelled booking");
  }
  if (booking.status === BookingsStatus.COMPLETED) {
    throw new Error("Cannot update a completed booking");
  }
  const [updated] = await prisma.$transaction([
    prisma.bookings.update({
      where: { id: bookingId },
      data: { status }
    }),
    // ✅ If completed or cancelled → tutor becomes AVAILABLE again
    ...status === BookingsStatus.COMPLETED || status === BookingsStatus.CANCELLED ? [
      prisma.tutorProfile.update({
        where: { id: tutorId },
        data: { availability: "AVAILABLE" }
      })
    ] : []
  ]);
  return updated;
};
var bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingStatusService
};

// src/modules/bookings/bookings.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await bookingServices.createBooking(
      user?.id,
      req.body
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await bookingServices.getAllBookings({
      id: user?.id,
      role: user?.role
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var updateBookingStatusController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!tutorProfile) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }
    const validStatuses = Object.values(BookingsStatus);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }
    const booking = await updateBookingStatusService(
      bookingId,
      tutorProfile.id,
      // ✅ TutorProfile.id, not User.id
      status
    );
    return res.status(200).json({
      message: "Booking status updated successfully",
      data: booking
    });
  } catch (error) {
    const isClientError = error.message.startsWith("Unauthorized") || error.message.includes("not found") || error.message.startsWith("Cannot");
    return res.status(isClientError ? 400 : 500).json({
      message: error.message || "Internal server error"
    });
  }
};
var bookingController = {
  createBooking: createBooking2,
  getAllBookings: getAllBookings2,
  updateBookingStatusController
};

// src/modules/bookings/bookings.routes.ts
var router3 = express3.Router();
router3.post(
  "/create-booking",
  auth_default("STUDENT" /* student */),
  bookingController.createBooking
);
router3.get(
  "/all-bookings",
  auth_default("ADMIN" /* admin */, "STUDENT" /* student */, "TUTOR" /* tutor */),
  bookingController.getAllBookings
);
router3.patch(
  "/:bookingId/status",
  auth_default("TUTOR" /* tutor */),
  bookingController.updateBookingStatusController
);
var bookingRoutes = router3;

// src/modules/student/student.routes.ts
import express4 from "express";

// src/modules/student/student.service.ts
var createStudentProfile = async (payload, userId) => {
  const isUserAlreadyStudent = await prisma.studentProfile.findUnique({
    where: { userId }
  });
  if (isUserAlreadyStudent) {
    throw new Error("user already has a student profile");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== "STUDENT" /* student */) {
    throw new Error("only student can create profile!");
  }
  const result = await prisma.studentProfile.create({
    data: {
      userId,
      phone: payload.phone,
      level: payload.level
    }
  });
  return result;
};
var studentService = {
  createStudentProfile
};

// src/modules/student/student.controller.ts
var createStudentProfile2 = async (req, res) => {
  try {
    const user = req.user;
    const data = await studentService.createStudentProfile(
      req.body,
      user?.id
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var studentController = {
  createStudentProfile: createStudentProfile2
};

// src/modules/student/student.routes.ts
var router4 = express4.Router();
router4.post(
  "/create-student",
  auth_default("STUDENT" /* student */),
  studentController.createStudentProfile
);
var studentRoutes = router4;

// src/modules/category/category.routes.ts
import express5 from "express";

// src/modules/category/category.service.ts
var createCategory = async (payload, user) => {
  if (user.role !== "ADMIN" /* admin */) {
    throw new Error("Only admin can create category!");
  }
  const isCategory = await prisma.categories.findUnique({
    where: {
      title: payload.title
    }
  });
  if (isCategory) {
    throw new Error("This category already exists");
  }
  const data = await prisma.categories.create({
    data: {
      title: payload.title
    }
  });
  return data;
};
var getAllCategory = async () => {
  const allCategory = await prisma.categories.findMany({
    include: {
      tutors: true
    }
  });
  return allCategory;
};
var getSingleCategory = async (categoryid) => {
  const data = await prisma.categories.findUnique({
    where: {
      id: categoryid
    },
    include: {
      tutors: {
        include: {
          tutor: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });
  return data;
};
var categoryServices = {
  createCategory,
  getAllCategory,
  getSingleCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await categoryServices.createCategory(req.body, {
      role: user?.role
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const allCategory = await categoryServices.getAllCategory();
    res.status(201).json({ success: true, data: allCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var getSingleCategory2 = async (req, res) => {
  try {
    const { categoryid } = req.params;
    const data = await categoryServices.getSingleCategory(categoryid);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategory: getAllCategory2,
  getSingleCategory: getSingleCategory2
};

// src/modules/category/category.routes.ts
var router5 = express5.Router();
router5.post(
  "/create-category",
  auth_default("ADMIN" /* admin */),
  categoryController.createCategory
);
router5.get("/all-category", categoryController.getAllCategory);
router5.get("/:categoryid", categoryController.getSingleCategory);
var categoryRouter = router5;

// src/modules/reviews/reviews.routes.ts
import express6 from "express";

// src/modules/reviews/reviews.service.ts
var createReview = async (userId, payload) => {
  const { tutorId, bookingId, rating, comment } = payload;
  const student = await prisma.studentProfile.findUnique({
    where: { userId }
  });
  if (!student) {
    throw new Error("Student profile not found");
  }
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  const existing = await prisma.reviews.findUnique({
    where: { bookingId }
  });
  if (existing) {
    throw new Error("Review already submitted for this booking");
  }
  return prisma.reviews.create({
    data: {
      studentId: student.id,
      tutorId,
      bookingId,
      rating,
      comment
    },
    include: {
      student: true,
      tutor: true,
      booking: true
    }
  });
};
var getAllReviews = async () => {
  return prisma.reviews.findMany({
    include: {
      student: {
        include: {
          user: true
        }
      },
      tutor: {
        include: {
          user: true
        }
      },
      booking: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getTutorReviews = async (tutorId) => {
  return prisma.reviews.findMany({
    where: { tutorId },
    include: { student: true, booking: true },
    orderBy: { createdAt: "desc" }
  });
};
var getStudentReviews = async (studentId) => {
  return prisma.reviews.findMany({
    where: { studentId },
    include: { tutor: true, booking: true },
    orderBy: { createdAt: "desc" }
  });
};
var getBookingReview = async (bookingId) => {
  return prisma.reviews.findUnique({
    where: { bookingId },
    include: { student: true, tutor: true }
  });
};
var ReviewService = {
  createReview,
  getAllReviews,
  getTutorReviews,
  getStudentReviews,
  getBookingReview
};

// src/modules/reviews/reviews.controller.ts
var createReview2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await ReviewService.createReview(
      user?.id,
      req.body
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var getAllReviews2 = async (req, res) => {
  try {
    const result = await ReviewService.getAllReviews();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var getTutorReviews2 = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await ReviewService.getTutorReviews(tutorId);
    res.status(20).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var getStudentReviews2 = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await ReviewService.getStudentReviews(studentId);
    res.status(20).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var getBookingReview2 = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await ReviewService.getBookingReview(bookingId);
    res.status(20).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var reviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2,
  getTutorReviews: getTutorReviews2,
  getStudentReviews: getStudentReviews2,
  getBookingReview: getBookingReview2
};

// src/modules/reviews/reviews.routes.ts
var router6 = express6.Router();
router6.post(
  "/create-review",
  auth_default("STUDENT" /* student */),
  reviewController.createReview
);
router6.get("/all-reviews", reviewController.getAllReviews);
router6.get("/:tutorId", reviewController.getTutorReviews);
router6.get(
  "/:studentId",
  auth_default("STUDENT" /* student */),
  reviewController.getStudentReviews
);
router6.get("/:bookingId", reviewController.getTutorReviews);
var reviewRoutes = router6;

// src/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
};

// src/middlewares/globalError.ts
function errorHandler(err, req, res, next) {
  let errStatus = 500;
  let errorMessage = "Internal Server Error!";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    errStatus = 400;
    errorMessage = "You inputed wrong type data or wrong info";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code = "P2001") {
      errStatus = 400;
      errorMessage = `Unique constraint failed`;
    } else if (err.code = "P2003") {
      errStatus = 400;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code = "P2025") {
      errStatus = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    errStatus = 500;
    errorMessage = "unknown error";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode = "P1001") {
      errStatus = 401;
      errorMessage = "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    errStatus = 1001;
    errorMessage = "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}.";
  }
  res.status(errStatus);
  res.json({
    message: errorMessage,
    error: errorDetails
  });
}
var globalError_default = errorHandler;

// src/app.ts
var app = express7();
var port = process.env.PORT;
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.BETTER_AUTH_URL || "http://localhost:5000"
    ],
    credentials: true
  })
);
app.use(express7.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", adminRoutes);
app.use("/tutor", tutorRoutes);
app.use("/student", studentRoutes);
app.use("/booking", bookingRoutes);
app.use("/category", categoryRouter);
app.use("/review", reviewRoutes);
app.use(notFound);
app.use(globalError_default);
app.get("/", (req, res) => {
  res.send("Hello World");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
