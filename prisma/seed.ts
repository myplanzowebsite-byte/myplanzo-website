import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Shared test password for local/staging — change in production. */
const TEST_PASSWORD = "admin1";

async function main() {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: "kashik.sredhran@gmail.com" },
    create: {
      email: "kashik.sredhran@gmail.com",
      phone: "+919000000001",
      passwordHash,
      role: "ADMIN",
      phoneVerified: true,
    },
    update: {
      passwordHash,
      phoneVerified: true,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "kashik.sredhran+customer@gmail.com" },
    create: {
      email: "kashik.sredhran+customer@gmail.com",
      phone: "+919000000002",
      passwordHash,
      role: "CUSTOMER",
      phoneVerified: true,
      customerProfile: { create: { displayName: "Test Customer" } },
    },
    update: {
      passwordHash,
      phoneVerified: true,
      role: "CUSTOMER",
    },
  });

  await prisma.customerProfile.upsert({
    where: { userId: customer.id },
    create: { userId: customer.id, displayName: "Test Customer" },
    update: { displayName: "Test Customer" },
  });

  const vendorUser = await prisma.user.upsert({
    where: { email: "kashik.sredhran+vendor@gmail.com" },
    create: {
      email: "kashik.sredhran+vendor@gmail.com",
      phone: "+919000000003",
      passwordHash,
      role: "VENDOR",
      phoneVerified: true,
      vendorProfile: {
        create: {
          businessName: "Test Vendor Co.",
          description: "Seeded vendor for testing",
          verificationStatus: "ACTIVE",
        },
      },
    },
    update: {
      passwordHash,
      phoneVerified: true,
      role: "VENDOR",
    },
  });

  await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    create: {
      userId: vendorUser.id,
      businessName: "Test Vendor Co.",
      description: "Seeded vendor for testing",
      verificationStatus: "ACTIVE",
    },
    update: {
      businessName: "Test Vendor Co.",
      verificationStatus: "ACTIVE",
    },
  });

  console.log("Seeded test accounts (password for all: admin1):");
  console.log("  Admin:    admin@gmail.com");
  console.log("  Customer: admin+customer@gmail.com");
  console.log("  Vendor:   admin+vendor@gmail.com");
  console.log(
    "Note: Gmail delivers admin+customer@ and admin+vendor@ to the same inbox as admin@gmail.com.",
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
