import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions governing your access to and use of the MyPlanzo platform operated by MyPlanzo Events Pvt. Ltd., under applicable Indian law.",
};

const HEADING = "mb-2 text-lg font-semibold text-mp-charcoal";
const SUBHEADING = "mb-2 mt-4 text-base font-semibold text-mp-charcoal";
const LIST = "list-disc space-y-1 pl-5";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 text-mp-charcoal">
        <h1 className="mb-2 text-3xl font-bold">Terms &amp; Conditions</h1>
        <p className="mb-1 text-sm text-mp-muted">MyPlanzo Events Pvt. Ltd.</p>
        <p className="mb-8 text-sm text-mp-muted">Last updated: 7 June 2026 · Effective date: 7 June 2026</p>

        <p className="mb-8 rounded-md border border-mp-border bg-mp-card px-4 py-3 text-sm text-mp-muted">
          Use of the Platform is also governed by the{" "}
          <Link href="/privacy-policy" className="text-mp-accent underline">
            Privacy Policy
          </Link>
          , which forms an integral part of these Terms. By accepting these Terms, you also accept the
          Privacy Policy.
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-mp-muted">
          <section>
            <h2 className={HEADING}>1. Acceptance of Terms</h2>
            <p>
              Welcome to MyPlanzo (“we”, “us”, “our”). These Terms and Conditions (“Terms”) govern your
              access to and use of the MyPlanzo platform available at myplanzo.com (the “Platform”),
              operated by MyPlanzo Events Pvt. Ltd.
            </p>
            <p className="mt-2">
              By accessing the Platform, registering an account, or placing or accepting a booking, you
              agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not
              use the Platform.
            </p>
            <p className="mt-2">
              These Terms constitute a legally binding agreement between you and MyPlanzo Events Pvt. Ltd.
              under the laws of India, including the Information Technology Act, 2000 and the Consumer
              Protection Act, 2019.
            </p>
            <p className="mt-2">
              Use of the Platform is also governed by the Privacy Policy available at{" "}
              <Link href="/privacy-policy" className="text-mp-accent underline">
                myplanzo.com/privacy-policy
              </Link>
              , which forms an integral part of these Terms. By accepting these Terms, you also accept the
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>2. Definitions</h2>
            <ul className={`${LIST} mt-2`}>
              <li>
                <span className="text-mp-charcoal">“Platform”</span> means the website myplanzo.com and all
                related services operated by MyPlanzo Events Pvt. Ltd.
              </li>
              <li>
                <span className="text-mp-charcoal">“Customer”</span> means any individual who browses,
                registers, or places a booking on the Platform.
              </li>
              <li>
                <span className="text-mp-charcoal">“Vendor”</span> means any individual, sole proprietor, or
                business entity registered on the Platform to offer event services.
              </li>
              <li>
                <span className="text-mp-charcoal">“Booking”</span> means a confirmed reservation of a
                vendor’s services made through the Platform.
              </li>
              <li>
                <span className="text-mp-charcoal">“Platform Fee” or “Commission”</span> means the 15% fee
                charged by MyPlanzo on each completed booking.
              </li>
              <li>
                <span className="text-mp-charcoal">“Listing”</span> means a vendor’s profile and service
                offering published on the Platform.
              </li>
              <li>
                <span className="text-mp-charcoal">“Content”</span> means any text, images, photographs,
                reviews, or other material uploaded to the Platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={HEADING}>3. Eligibility</h2>
            <p>To use the Platform, you must:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Be at least 18 years of age</li>
              <li>Be legally capable of entering into a binding contract under Indian law</li>
              <li>Not be barred from using the Platform under any applicable law</li>
            </ul>
            <p className="mt-2">
              By registering on the Platform, you represent and warrant that you meet all of the above
              eligibility requirements. MyPlanzo reserves the right to suspend or terminate any account
              where eligibility requirements are not met.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>4. Account Registration and Security</h2>

            <h3 className={SUBHEADING}>4.1 Registration</h3>
            <p>
              You may register on the Platform using your email address and password, or via Google
              Sign-In. By registering, you consent to the collection and processing of your personal data
              as described in our Privacy Policy.
            </p>
            <p className="mt-2">
              You agree to provide accurate, current, and complete information during registration and to
              update such information as necessary.
            </p>

            <h3 className={SUBHEADING}>4.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You
              agree to notify us immediately at{" "}
              <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                support@myplanzo.com
              </a>{" "}
              if you suspect any unauthorised use of your account. MyPlanzo shall not be liable for any
              loss arising from your failure to maintain account security.
            </p>

            <h3 className={SUBHEADING}>4.3 One Account Per User</h3>
            <p>
              Each user may maintain only one active account. MyPlanzo reserves the right to merge or
              terminate duplicate accounts.
            </p>

            <h3 className={SUBHEADING}>4.4 Electronic Communications</h3>
            <p>
              By using the Platform, you consent to receive communications electronically including emails,
              SMS messages, WhatsApp notifications, in-app notifications, invoices, booking confirmations,
              marketing communications (where consented), and legal notices. You agree that electronic
              communications satisfy any legal requirement for written communication.
            </p>

            <h3 className={SUBHEADING}>4.5 Accuracy of Information</h3>
            <p>
              Users are responsible for ensuring that all information provided on the Platform is accurate,
              current, and up to date. MyPlanzo shall not be liable for any losses, disputes, or damages
              arising from inaccurate, incomplete, or outdated information provided by users.
            </p>

            <h3 className={SUBHEADING}>4.6 Electronic Records and E-Signatures</h3>
            <p>
              Users agree that electronic records, booking confirmations, invoices, communications, and
              electronic acceptance of these Terms shall have the same legal effect as physical documents
              and handwritten signatures, in accordance with the Information Technology Act, 2000.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>5. MyPlanzo’s Role as Intermediary</h2>
            <p>
              MyPlanzo acts solely as an intermediary technology platform that connects customers with
              independent event service vendors. MyPlanzo is not a party to the service contract between a
              customer and a vendor.
            </p>
            <p className="mt-2">
              While we undertake reasonable verification measures including KYC checks and document review,
              MyPlanzo does not guarantee the quality, safety, legality, timeliness, or performance of
              services provided by vendors listed on the Platform. Customers are encouraged to review
              vendor profiles, ratings, and portfolio photographs before making a booking.
            </p>
            <p className="mt-2">
              MyPlanzo shall not be held liable for any loss, damage, injury, or dissatisfaction arising
              from vendor services, vendor conduct, or failure to perform.
            </p>
            <p className="mt-2">
              MyPlanzo does not employ, supervise, direct, or control vendors and does not assume
              responsibility for the acts or omissions of vendors. Vendors operate as independent
              businesses and are solely responsible for their services, conduct, and legal compliance.
            </p>

            <h3 className={SUBHEADING}>5.1 Platform Availability</h3>
            <p>
              MyPlanzo does not guarantee uninterrupted, secure, error-free, or continuous access to the
              Platform. Access may be suspended or restricted temporarily due to maintenance, upgrades,
              security measures, technical failures, or circumstances beyond our control. MyPlanzo shall
              not be liable for any loss or inconvenience arising from unavailability of the Platform.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>6. Vendor Terms and Obligations</h2>

            <h3 className={SUBHEADING}>6.1 Vendor Onboarding</h3>
            <p>To be listed on the Platform, vendors must complete the following onboarding steps:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Register and create a profile with accurate business information</li>
              <li>Complete KYC verification via Razorpay Route (PAN and bank account verification)</li>
              <li>Upload a valid GST certificate (if GST registered) or PAN card (for individuals)</li>
              <li>Upload at least 2–3 portfolio photographs of past work</li>
              <li>Agree to these Terms and the Vendor Agreement</li>
            </ul>
            <p className="mt-2">
              Vendors will only be made visible to customers after MyPlanzo admin approval. MyPlanzo
              reserves the right to reject any vendor application without providing reasons. MyPlanzo
              further reserves the right to reject, suspend, or revoke vendor verification at any time where
              documents are found to be inaccurate, incomplete, expired, fraudulent, or cannot be
              independently verified.
            </p>

            <h3 className={SUBHEADING}>6.2 Vendor Representations</h3>
            <p>By listing on the Platform, vendors represent and warrant that:</p>
            <ul className={`${LIST} mt-2`}>
              <li>All information provided is accurate, complete, and not misleading</li>
              <li>They hold all necessary licences, permits, and registrations to offer their services</li>
              <li>
                They are responsible for their own tax obligations including GST, income tax, and TDS
                compliance
              </li>
              <li>All photographs uploaded are owned by them or they hold appropriate licences</li>
              <li>Their services do not violate any applicable law or third-party rights</li>
            </ul>

            <h3 className={SUBHEADING}>6.3 Vendor Pricing</h3>
            <p>
              Vendors set their own service prices on the Platform. MyPlanzo does not fix or regulate vendor
              pricing. Vendors are responsible for ensuring their prices are accurate, inclusive of
              applicable taxes, and clearly communicated to customers at the time of listing.
            </p>

            <h3 className={SUBHEADING}>6.4 Platform Commission</h3>
            <p>
              MyPlanzo shall charge platform fees and commissions as displayed on the Platform and
              communicated to vendors during onboarding. The current platform commission is 15% of the
              total booking value, automatically deducted from the vendor’s payout at settlement via
              Razorpay Route. Such fees may be updated from time to time with reasonable prior notice to
              vendors.
            </p>

            <h3 className={SUBHEADING}>6.5 Vendor Conduct</h3>
            <p>Vendors must not:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Communicate with customers outside the Platform to bypass commission</li>
              <li>Provide false or misleading information about their services</li>
              <li>Upload content that infringes third-party intellectual property rights</li>
              <li>Engage in any discriminatory, abusive, or illegal conduct towards customers</li>
              <li>List services they are not qualified or licensed to provide</li>
            </ul>
            <p className="mt-2">
              Violation of any of the above may result in immediate account suspension and removal from the
              Platform.
            </p>

            <h3 className={SUBHEADING}>6.6 Vendor Cancellation</h3>
            <p>
              If a vendor cancels a confirmed booking for any reason, the customer is entitled to a 100%
              full refund of the amount paid. Repeated vendor cancellations may result in account
              suspension or permanent removal from the Platform.
            </p>

            <h3 className={SUBHEADING}>6.7 Vendor Responsibility for Service Delivery</h3>
            <p>
              Vendors are solely responsible for the quality, safety, legality, and timely delivery of their
              services. Any claims arising from service defects, delays, negligence, misconduct, property
              damage, personal injury, or breach of contract shall remain the sole responsibility of the
              vendor. MyPlanzo acts only as an intermediary platform and assumes no responsibility for the
              performance of vendor services.
            </p>

            <h3 className={SUBHEADING}>6.8 Independent Contractor Relationship</h3>
            <p>
              Vendors are independent contractors and are not employees, agents, partners, representatives,
              or joint venture participants of MyPlanzo. Nothing in these Terms creates any employment,
              partnership, agency, or joint venture relationship between MyPlanzo and any vendor.
            </p>

            <h3 className={SUBHEADING}>6.9 Vendor Insurance</h3>
            <p>
              Vendors are responsible for obtaining and maintaining any insurance coverage required for
              their business operations, employees, equipment, vehicles, and services. MyPlanzo does not
              provide insurance coverage for vendors or their activities.
            </p>

            <h3 className={SUBHEADING}>6.10 Right to Remove Listings</h3>
            <p>
              MyPlanzo reserves the right to remove, suspend, edit, or reject any vendor listing, profile,
              review, photograph, or content at its sole discretion without prior notice and without
              liability to the vendor.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>7. Customer Terms and Obligations</h2>

            <h3 className={SUBHEADING}>7.1 Booking a Vendor</h3>
            <p>
              Customers may browse vendor listings, view portfolios, and place bookings through the
              Platform. A booking is confirmed upon successful payment of the applicable booking amount as
              specified on the Platform, followed by a confirmation notification from MyPlanzo.
            </p>

            <h3 className={SUBHEADING}>7.2 Customer Responsibilities</h3>
            <p>Customers agree to:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Provide accurate event details including date, venue, and requirements at the time of booking</li>
              <li>Communicate respectfully with vendors through the Platform</li>
              <li>Review vendor profiles, portfolios, and ratings before booking</li>
              <li>Raise any disputes or concerns within 30 days of the event date</li>
              <li>
                Ensure that any event conducted through services booked on the Platform complies with all
                applicable laws including age restrictions, permits, noise regulations, alcohol laws, and
                venue requirements
              </li>
            </ul>

            <h3 className={SUBHEADING}>7.3 Reviews and Ratings</h3>
            <p>
              Customers may submit a review and rating after a completed booking. Reviews must be honest,
              factual, and respectful. MyPlanzo reserves the right to remove reviews that are abusive,
              defamatory, or in violation of these Terms. MyPlanzo may additionally remove any review it
              reasonably believes to be fake, incentivised, misleading, or submitted by a person who has
              not genuinely used the relevant vendor’s services.
            </p>
          </section>

          <section id="refund" className="scroll-mt-24">
            <h2 className={HEADING}>8. Cancellation and Refund Policy</h2>
            <p>
              The following cancellation and refund terms apply to all bookings made on the Platform:
            </p>

            <h3 className={SUBHEADING}>Customer Cancellations</h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-mp-accent text-white">
                    <th className="border border-mp-border px-3 py-2 font-semibold">Cancellation Window</th>
                    <th className="border border-mp-border px-3 py-2 font-semibold">Refund Amount</th>
                    <th className="border border-mp-border px-3 py-2 font-semibold">Processing Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-mp-border px-3 py-2">More than 14 days before event</td>
                    <td className="border border-mp-border px-3 py-2 font-semibold text-green-700">100% Full Refund</td>
                    <td className="border border-mp-border px-3 py-2">7–10 working days</td>
                  </tr>
                  <tr>
                    <td className="border border-mp-border px-3 py-2">7 to 14 days before event</td>
                    <td className="border border-mp-border px-3 py-2 font-semibold text-orange-600">50% Refund</td>
                    <td className="border border-mp-border px-3 py-2">7–10 working days</td>
                  </tr>
                  <tr>
                    <td className="border border-mp-border px-3 py-2">Less than 7 days before event</td>
                    <td className="border border-mp-border px-3 py-2 font-semibold text-red-700">No Refund</td>
                    <td className="border border-mp-border px-3 py-2">N/A</td>
                  </tr>
                  <tr>
                    <td className="border border-mp-border px-3 py-2">Vendor cancels booking</td>
                    <td className="border border-mp-border px-3 py-2 font-semibold text-green-700">100% Full Refund</td>
                    <td className="border border-mp-border px-3 py-2">7–10 working days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              All refunds are credited to the original payment method used at the time of booking. Customers
              are entitled to a refund as per the cancellation policy above. Any non-recoverable payment
              gateway or processing charges may be deducted where applicable. Where the vendor cancels, the
              customer is entitled to a 100% full refund including all fees.
            </p>
            <p className="mt-2">
              Cancellation requests must be submitted through the Platform or by emailing{" "}
              <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                support@myplanzo.com
              </a>
              . The cancellation date is the date the request is received by MyPlanzo, not the date of
              communication to the vendor.
            </p>
            <p className="mt-2">
              Refund timelines stated herein are estimates only and may vary depending on payment providers,
              banks, card networks, and other third parties. MyPlanzo shall not be liable for refund delays
              beyond its reasonable control.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>9. Payments and Settlements</h2>

            <h3 className={SUBHEADING}>9.1 Customer Payments</h3>
            <p>
              All payments must be made through the Platform using supported payment methods including UPI,
              credit/debit cards, and net banking, processed via Razorpay. MyPlanzo does not accept cash
              payments or off-platform transactions.
            </p>

            <h3 className={SUBHEADING}>9.2 Platform Commission</h3>
            <p>
              MyPlanzo deducts a 15% platform commission from each confirmed booking. The remaining 85% is
              settled to the vendor’s registered bank account via Razorpay Route within the settlement
              timeline agreed during vendor onboarding.
            </p>

            <h3 className={SUBHEADING}>9.2a Vendor Payout Protection</h3>
            <p>
              Vendor payouts may be held until successful completion of the booked event and expiry of any
              applicable dispute resolution period. MyPlanzo reserves the right to withhold, delay, or
              adjust payouts where a dispute, chargeback, refund request, suspected fraud, or violation of
              these Terms is under investigation. MyPlanzo will notify the vendor of any such withholding
              and the reason therefor.
            </p>

            <h3 className={SUBHEADING}>9.3 Off-Platform Transactions Prohibited</h3>
            <p>
              Vendors and customers are strictly prohibited from transacting outside the Platform to
              circumvent the platform commission. Where a vendor or customer is found to have intentionally
              bypassed the Platform for a transaction that was initiated through MyPlanzo, MyPlanzo reserves
              the right to immediately suspend or permanently ban the relevant account and recover any
              unpaid commission and pursue any remedies available under applicable law. MyPlanzo accepts no
              liability for any transactions conducted outside the Platform.
            </p>
            <p className="mt-2">
              Vendors shall not solicit, accept, or facilitate off-platform bookings from customers who were
              introduced to the vendor through the MyPlanzo Platform, for a period of 12 months following
              the date of introduction. Any booking made in violation of this clause shall be subject to the
              full platform commission as if the booking had been made through the Platform.
            </p>

            <h3 className={SUBHEADING}>9.4 GST and Taxes</h3>
            <p>
              GST and other applicable taxes on vendor services are the responsibility of the vendor.
              MyPlanzo will issue a platform invoice for the commission charged. Vendors are responsible for
              their own GST filings and tax compliance. MyPlanzo will deduct TDS as applicable under Indian
              tax law on vendor payouts.
            </p>

            <h3 className={SUBHEADING}>9.5 Chargebacks and Fraud Prevention</h3>
            <p>
              Users shall not initiate fraudulent chargebacks, payment reversals, or payment disputes in bad
              faith. Where MyPlanzo identifies fraudulent or abusive payment disputes, it reserves the right
              to suspend the relevant account, recover any losses incurred, and pursue all legal remedies
              available under applicable law.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>10. Intellectual Property</h2>

            <h3 className={SUBHEADING}>10.1 MyPlanzo’s IP</h3>
            <p>
              The MyPlanzo name, logo, website design, software, and all content created by MyPlanzo are the
              exclusive intellectual property of MyPlanzo Events Pvt. Ltd. and are protected under Indian
              copyright and trademark law. You may not reproduce, distribute, or use any of our IP without
              prior written consent.
            </p>

            <h3 className={SUBHEADING}>10.2 Vendor Content</h3>
            <p>
              Vendors retain ownership of all photographs, descriptions, and content they upload to the
              Platform. By uploading content, vendors grant MyPlanzo a non-exclusive, royalty-free,
              worldwide licence to display, resize, and promote such content on the Platform and in
              marketing materials for the purpose of showcasing vendor services.
            </p>

            <h3 className={SUBHEADING}>10.3 User Generated Content</h3>
            <p>
              Customers and users retain ownership of content they upload to the Platform including reviews,
              profile pictures, comments, and messages. By submitting content to the Platform, users grant
              MyPlanzo a non-exclusive, worldwide, royalty-free licence to use, display, reproduce, modify,
              and distribute such content for the purposes of operating, improving, and promoting the
              Platform.
            </p>

            <h3 className={SUBHEADING}>10.4 Prohibited Content</h3>
            <p>Users must not upload or share content that:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Infringes any third-party copyright, trademark, or intellectual property rights</li>
              <li>Is defamatory, obscene, offensive, or in violation of applicable law</li>
              <li>Contains viruses, malware, or harmful code</li>
              <li>Impersonates any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className={HEADING}>11. Prohibited Activities</h2>
            <p>Users of the Platform must not:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Use the Platform for any unlawful purpose or in violation of these Terms</li>
              <li>Attempt to gain unauthorised access to any part of the Platform</li>
              <li>Scrape, crawl, or extract data from the Platform without written permission</li>
              <li>Post false, misleading, or fraudulent listings or reviews</li>
              <li>Harass, threaten, or abuse other users or MyPlanzo staff</li>
              <li>Create multiple accounts for deceptive purposes</li>
              <li>Attempt to manipulate ratings or reviews</li>
              <li>Conduct transactions outside the Platform to avoid commission</li>
            </ul>
            <p className="mt-2">
              MyPlanzo reserves the right to suspend or permanently ban any user found to be in violation of
              these prohibitions.
            </p>

            <h3 className={SUBHEADING}>11.1 Right to Investigate</h3>
            <p>
              MyPlanzo reserves the right to investigate suspected violations of these Terms, suspend
              accounts pending investigation, and cooperate with law enforcement authorities where required
              by applicable law.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>12. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law:</p>
            <ul className={`${LIST} mt-2`}>
              <li>
                MyPlanzo’s aggregate liability to any user shall not exceed the lesser of: (a) the platform
                fee collected in connection with the relevant booking; or (b) ₹5,000 — whichever is lower
              </li>
              <li>
                MyPlanzo shall not be liable for any indirect, incidental, special, or consequential damages
                including loss of profits, data, or goodwill
              </li>
              <li>MyPlanzo is not liable for any failure or delay in vendor service delivery</li>
              <li>MyPlanzo is not responsible for any third-party services including Razorpay, Google, or Meta</li>
            </ul>
            <p className="mt-2">
              Nothing in these Terms shall limit liability for death or personal injury caused by
              negligence, or for fraud or fraudulent misrepresentation.
            </p>

            <h3 className={SUBHEADING}>12a. Disclaimer of Warranties</h3>
            <p>
              The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. MyPlanzo
              makes no representations or warranties of any kind, express or implied, regarding the
              availability, reliability, accuracy, completeness, suitability, or fitness for a particular
              purpose of the Platform or any vendor services listed on it.
            </p>
            <p className="mt-2">
              MyPlanzo does not warrant that the Platform will be free from errors, bugs, viruses, or other
              harmful components, or that any defects will be corrected. Use of the Platform is at your sole
              risk.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>13. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless MyPlanzo Events Pvt. Ltd., its directors,
              officers, employees, and agents from and against any claims, liabilities, damages, losses, and
              expenses (including legal fees) arising out of or in connection with:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>Your use of the Platform in violation of these Terms</li>
              <li>Your violation of any applicable law or regulation</li>
              <li>Your infringement of any third-party rights including intellectual property rights</li>
              <li>Any dispute between you and another user of the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className={HEADING}>14. Termination and Suspension</h2>

            <h3 className={SUBHEADING}>14.1 By MyPlanzo</h3>
            <p>
              MyPlanzo reserves the right to suspend or terminate any account, listing, or access to the
              Platform at any time, with or without notice, for violation of these Terms, fraudulent
              activity, or any other reason at our sole discretion.
            </p>

            <h3 className={SUBHEADING}>14.2 By Users</h3>
            <p>
              You may close your account at any time by contacting{" "}
              <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                support@myplanzo.com
              </a>
              . Account deletion requests will be processed within 30 days, subject to legal retention
              requirements. Pending bookings must be resolved before account closure.
            </p>

            <h3 className={SUBHEADING}>14.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to access the Platform ceases immediately. The provisions
              relating to intellectual property, limitation of liability, indemnification, dispute
              resolution, payments, refunds, governing law, and any other provisions intended by their
              nature to survive termination shall remain in full force and effect after termination.
            </p>

            <h3 className={SUBHEADING}>14.4 Account Inactivity</h3>
            <p>
              MyPlanzo reserves the right to deactivate or remove accounts that remain inactive for an
              extended period of time, with reasonable prior notice where practicable. Inactive vendor
              listings may be temporarily hidden from the Platform.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>15. Dispute Resolution</h2>

            <h3 className={SUBHEADING}>15.1 Between Customer and Vendor</h3>
            <p>
              MyPlanzo may assist in facilitating the resolution of disputes between customers and vendors.
              However, the final contractual relationship and legal responsibility remains between the
              customer and the vendor. Disputes must be raised with our Grievance Officer within 30 days of
              the event date.
            </p>

            <h3 className={SUBHEADING}>15.2 Between User and MyPlanzo</h3>
            <p>
              Any dispute arising out of or in connection with these Terms shall first be attempted to be
              resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be
              referred to arbitration under the Arbitration and Conciliation Act, 1996. The seat of
              arbitration shall be Mumbai, Maharashtra.
            </p>

            <h3 className={SUBHEADING}>15.3 Governing Law and Jurisdiction</h3>
            <p>
              These Terms are governed by the laws of India. Subject to the arbitration clause above, the
              courts of Mumbai, Maharashtra shall have exclusive jurisdiction over any disputes arising from
              these Terms.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>16. Modifications to Terms</h2>
            <p>
              MyPlanzo reserves the right to modify these Terms at any time. Material changes will be
              notified via email or a prominent notice on the Platform, with at least 7 days’ notice before
              the changes take effect. Continued use of the Platform after the effective date constitutes
              acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>17. Force Majeure</h2>
            <p>
              MyPlanzo shall not be held liable for any delay, disruption, or failure to perform its
              obligations under these Terms arising from events beyond its reasonable control. Such events
              include but are not limited to natural disasters, floods, earthquakes, pandemics, epidemics,
              government-imposed restrictions or lockdowns, acts of war or terrorism, civil unrest, internet
              or power outages, strikes, or acts of God.
            </p>
            <p className="mt-2">
              In such circumstances, MyPlanzo will use reasonable efforts to notify affected users and
              resume normal operations as soon as reasonably practicable.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>18. Customer Responsibility for Event Damage</h2>
            <p>
              Customers are solely responsible for any damage caused to a venue, property, or third parties
              by themselves, their guests, contractors, event invitees, or any other persons attending an
              event booked through the Platform.
            </p>
            <p className="mt-2">
              Any claims relating to venue damage, property damage, personal injury, or third-party disputes
              arising from an event shall be resolved directly between the relevant parties. MyPlanzo shall
              not be joined as a party to, or held liable in connection with, any such claims.
            </p>
            <p className="mt-2">
              Customers are strongly advised to obtain appropriate event insurance before confirming a
              booking.
            </p>
            <p className="mt-2">
              MyPlanzo shall not be responsible for injuries, accidents, theft, property damage,
              food-related incidents, equipment failures, venue disputes, or any other incidents occurring
              during an event. Responsibility for such matters rests with the relevant vendor, venue owner,
              customer, or other responsible party as applicable.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>19. Grievance Officer</h2>
            <p>
              In accordance with the Information Technology Act, 2000 and IT Rules, 2011, the designated
              Grievance Officer for MyPlanzo is:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>
                <span className="text-mp-charcoal">Grievance Officer:</span> Vikrant Patil
              </li>
              <li>
                <span className="text-mp-charcoal">Organisation:</span> MyPlanzo Events Pvt. Ltd.
              </li>
              <li>
                <span className="text-mp-charcoal">Email:</span>{" "}
                <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                  support@myplanzo.com
                </a>
              </li>
              <li>
                <span className="text-mp-charcoal">Website:</span> myplanzo.com
              </li>
              <li>
                <span className="text-mp-charcoal">Location:</span> Mumbai, Maharashtra, India
              </li>
            </ul>
            <p className="mt-2">
              <span className="text-mp-charcoal">Response Time:</span> Grievances will be acknowledged within
              48 hours and resolved within 30 days.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>20a. Entire Agreement</h2>
            <p>
              These Terms, together with the Privacy Policy available at{" "}
              <Link href="/privacy-policy" className="text-mp-accent underline">
                myplanzo.com/privacy-policy
              </Link>{" "}
              and any applicable Vendor Agreement, constitute the entire agreement between the parties with
              respect to the use of the Platform and supersede all prior understandings, representations,
              communications, and agreements, whether oral or written.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>20b. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of
              competent jurisdiction, such provision shall be modified to the minimum extent necessary to
              make it enforceable, or severed if modification is not possible. The remaining provisions shall
              continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>20c. No Waiver</h2>
            <p>
              Failure by MyPlanzo to enforce any provision of these Terms on any occasion shall not
              constitute a waiver of MyPlanzo’s rights or remedies under these Terms. No waiver shall be
              effective unless made in writing and signed by an authorised representative of MyPlanzo.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>20. Contact Us</h2>
            <p>For any questions or concerns regarding these Terms, please contact:</p>
            <ul className={`${LIST} mt-2`}>
              <li>
                <span className="text-mp-charcoal">MyPlanzo Events Pvt. Ltd.</span>
              </li>
              <li>Website: myplanzo.com</li>
              <li>
                Email:{" "}
                <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                  support@myplanzo.com
                </a>
              </li>
              <li>Location: Mumbai, Maharashtra, India</li>
            </ul>
          </section>

          <p className="border-t border-mp-border pt-6 text-xs text-mp-muted">
            © 2026 MyPlanzo Events Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
