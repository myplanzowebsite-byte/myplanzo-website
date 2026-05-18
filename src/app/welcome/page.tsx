import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { readSession } from "@/lib/auth/session";
import { WelcomePreferences } from "./WelcomePreferences";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login");

  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-8 shadow-[var(--shadow-mp-card)]">
          <h1 className="text-2xl font-bold text-mp-charcoal">Welcome to MyPlanzo 🎉</h1>
          <p className="mt-2 text-sm text-mp-muted">
            Your account is ready. Tell us a little about what you&apos;re planning so we can
            point you to the right vendors — or skip and explore.
          </p>
          <div className="mt-6">
            <WelcomePreferences />
          </div>
        </div>
      </main>
    </div>
  );
}
