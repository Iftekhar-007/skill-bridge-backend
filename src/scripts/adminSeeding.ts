import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASS!;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("✅ Admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Shawon The Admin Boss",
      email,
      emailVerified: true,
      role: UserRole.ADMIN,

      accounts: {
        create: [
          {
            id: crypto.randomUUID(),
            accountId: email,
            providerId: "credential",
            password: password,
          },
        ],
      },
    },
  });
};

seedAdmin().catch(console.error);
