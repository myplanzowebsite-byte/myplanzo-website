import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "About",
  description: "About MyPlanzo — Mumbai's marketplace for personal celebrations.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 text-mp-charcoal">
        <h1 className="mb-4 text-3xl font-bold">About MyPlanzo</h1>
        <p className="mb-4 text-sm leading-relaxed text-mp-muted">
          MyPlanzo is Mumbai&apos;s marketplace for personal celebrations. We connect families and professionals with verified
          decorators, caterers, photographers, DJs, cake artists, and venues — all in one place, with real prices shown
          upfront. No endless calls, no middlemen, no guesswork.
        </p>
        <p className="text-sm leading-relaxed text-mp-muted">
          Have feedback or want to partner with us? Email{" "}
          <a href="mailto:hello@myplanzo.com" className="text-mp-accent underline">hello@myplanzo.com</a>.
        </p>
      </main>
    </div>
  );
}
