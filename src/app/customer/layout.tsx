import { AppHeader } from "@/components/AppHeader";
import { OnboardingTour } from "@/components/OnboardingTour";

export const dynamic = "force-dynamic";

const CUSTOMER_TOUR = [
  {
    title: "Welcome to MyPlanzo",
    body: "Find and book verified vendors for birthdays, baby showers, and every celebration in between.",
  },
  {
    title: "Browse & shortlist",
    body: "Filter vendors by category, budget and date — or swipe through Discover. Shortlist your favourites to compare.",
  },
  {
    title: "Request & pay",
    body: "Send a booking request; the vendor replies with a quote. Accept it and pay securely via Razorpay.",
  },
  {
    title: "Events & messages",
    body: "Group bookings under My Events, chat with vendors, and track everything from your bookings.",
  },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <OnboardingTour tourId="mp_tour_customer" steps={CUSTOMER_TOUR} />
    </div>
  );
}
