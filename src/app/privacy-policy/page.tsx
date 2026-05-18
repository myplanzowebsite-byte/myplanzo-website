import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MyPlanzo collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 text-mp-charcoal">
        <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-mp-muted">Last updated: 12 May 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-mp-muted">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">1. Who we are</h2>
            <p>
              This Privacy Policy explains how MyPlanzo Pvt. Ltd. (&ldquo;MyPlanzo&rdquo;, &ldquo;we&rdquo;) collects, uses, and shares personal data when
              you use myplanzo.com (the &ldquo;Platform&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">2. Information we collect</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><span className="text-mp-charcoal">Account data</span> — name, email, phone number, role (customer or vendor).</li>
              <li><span className="text-mp-charcoal">Booking data</span> — event details, dates, vendor selections, payment status.</li>
              <li><span className="text-mp-charcoal">Communications</span> — messages exchanged through the Platform.</li>
              <li><span className="text-mp-charcoal">Technical data</span> — IP address, device, browser, and usage analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">3. How we use your data</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide and improve the Platform.</li>
              <li>Process bookings and payments.</li>
              <li>Communicate with you about your account, bookings, and support.</li>
              <li>Detect and prevent fraud or misuse.</li>
              <li>Comply with applicable Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">4. Sharing</h2>
            <p>
              We share data with the vendor you book (so they can deliver the service), payment processors (Razorpay), SMS
              providers (for OTP), and analytics tools. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">5. Data retention</h2>
            <p>
              We retain account and booking data for as long as your account is active, and for a reasonable period afterwards to
              comply with tax, legal, and accounting obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">6. Your rights</h2>
            <p>
              You may request access, correction, or deletion of your personal data by emailing{" "}
              <a href="mailto:hello@myplanzo.com" className="text-mp-accent underline">hello@myplanzo.com</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">7. Cookies</h2>
            <p>We use essential cookies for authentication and minimal analytics cookies to understand usage.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">8. Security</h2>
            <p>
              We use industry-standard measures to protect personal data, but no system is 100% secure. Report any concerns to
              the email above.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-mp-charcoal">9. Changes</h2>
            <p>We may update this policy. Material changes will be highlighted on the Platform.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
