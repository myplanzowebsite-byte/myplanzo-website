import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { CustomerShortlistPageClient } from "./ShortlistClient";

export default async function CustomerShortlistPage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login");

  const items = await prisma.shortlistEntry.findMany({
    where: { userId: session.sub },
    include: {
      listing: {
        include: {
          vendor: {
            include: {
              reviews: { select: { rating: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <CustomerShortlistPageClient items={items} />;
}
