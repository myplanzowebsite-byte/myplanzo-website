import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import Link from "next/link";
import { CustomerShortlistPageClient } from "./ShortlistClient";

export default async function CustomerShortlistPage() {
  const session = await readSession();

  // Not logged in — show prompt instead of blocking entirely
  if (!session || session.role !== "CUSTOMER") {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-mp-charcoal font-medium">Sign in to see your shortlisted vendors.</p>
        <Link href="/login?next=/customer/shortlist" className="rounded-full bg-mp-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-mp-accent">
          Log in
        </Link>
      </div>
    );
  }

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
