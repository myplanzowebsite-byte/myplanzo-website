import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "vikrantpatil@myplanzo.com";
  const password = "Admin123";
  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, role: "ADMIN", phoneVerified: true, isBlocked: false },
    create: {
      email,
      passwordHash: hash,
      role: "ADMIN",
      phoneVerified: true,
    },
  });
  console.log("Admin ready:", { id: user.id, email: user.email, role: user.role });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
