import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { prisma } from "@/lib/prisma";
import { FaqSearch } from "./FaqSearch";
import { ContactForm } from "./ContactForm";
import { ReplayTourButton } from "@/components/ReplayTourButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Find answers to common questions or contact the MyPlanzo support team.",
};

export default async function HelpPage() {
  const faqs = await prisma.cmsFaq.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, question: true, answer: true },
  });

  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-mp-charcoal">Help &amp; Support</h1>
          <p className="mt-1 text-sm text-mp-muted">
            Search common questions, or send us a message.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-mp-charcoal">Frequently asked questions</h2>
          {faqs.length > 0 ? (
            <FaqSearch faqs={faqs} />
          ) : (
            <p className="text-sm text-mp-muted">No help articles published yet.</p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-mp-charcoal">Contact support</h2>
          <ContactForm />
        </section>

        <section className="space-y-2 border-t border-mp-border pt-6">
          <h2 className="text-lg font-semibold text-mp-charcoal">Product tour</h2>
          <p className="text-sm text-mp-muted">Replay the welcome walkthrough.</p>
          <ReplayTourButton />
        </section>
      </main>
    </div>
  );
}
