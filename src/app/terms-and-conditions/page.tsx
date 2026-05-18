import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using MyPlanzo.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 text-mp-charcoal">
        <h1 className="mb-2 text-3xl font-bold">Terms & Conditions</h1>
        <p className="mb-8 text-sm text-mp-muted">Last updated: 12 May 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-mp-muted">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">1. Acceptance of terms</h2>
            <p>
              By accessing or using MyPlanzo (the &ldquo;Platform&rdquo;), you agree to be bound by these Terms &amp; Conditions and our
              Privacy Policy. If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">2. Who we are</h2>
            <p>
              MyPlanzo Pvt. Ltd. is a company incorporated in India operating an online marketplace that connects customers with
              independent event vendors (decorators, caterers, photographers, venues, etc.) in Mumbai and other cities.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">3. Eligibility</h2>
            <p>You must be at least 18 years old and capable of entering a binding contract to use MyPlanzo.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">4. Vendor services</h2>
            <p>
              MyPlanzo is a marketplace. We facilitate discovery and booking but are not a party to the contract between you and
              the vendor. Vendors are independent businesses and remain solely responsible for the services they provide.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">5. Payments &amp; commission</h2>
            <p>
              When a customer accepts a vendor quote and pays through the Platform, funds are held by MyPlanzo and released to the
              vendor after the event is confirmed completed. MyPlanzo charges a commission of 15% on completed bookings.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">6. Cancellations &amp; refunds</h2>
            <p>
              Cancellation policies vary by vendor and will be disclosed at the time of booking. Refund requests are reviewed in
              line with the policy shown at booking.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">7. User conduct</h2>
            <p>
              You agree not to misuse the Platform, post false or misleading content, harass other users, or attempt to circumvent
              the payment flow.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, MyPlanzo&apos;s liability for any claim arising from the Platform is limited to
              the commission paid to MyPlanzo for the relevant booking.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">9. Changes</h2>
            <p>We may update these terms from time to time. Continued use of the Platform constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">10. Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a href="mailto:hello@myplanzo.com" className="text-mp-accent underline">
                hello@myplanzo.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
