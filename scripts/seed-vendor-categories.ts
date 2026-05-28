import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STARTERS = [
  { emoji: "🎀", title: "Decorators", sortOrder: 10 },
  { emoji: "📸", title: "Photographers", sortOrder: 20 },
  { emoji: "🍽️", title: "Caterers", sortOrder: 30 },
  { emoji: "🏛️", title: "Venues", sortOrder: 40 },
  { emoji: "🎵", title: "DJ & Music", sortOrder: 50 },
  { emoji: "🎂", title: "Cake", sortOrder: 60 },
];

async function main() {
  const existing = await prisma.vendorCategory.findMany({ orderBy: { sortOrder: "asc" } });
  console.log("Before:", existing.map((c) => `${c.emoji} ${c.title}`));

  for (const s of STARTERS) {
    await prisma.vendorCategory.upsert({
      where: { title: s.title },
      update: { emoji: s.emoji, sortOrder: s.sortOrder, active: true },
      create: { ...s, active: true },
    });
  }

  const after = await prisma.vendorCategory.findMany({ orderBy: { sortOrder: "asc" } });
  console.log(
    "After:",
    after.map((c) => `${c.emoji} ${c.title} (sort=${c.sortOrder}, active=${c.active})`),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
