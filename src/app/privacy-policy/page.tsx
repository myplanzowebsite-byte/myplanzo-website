import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How MyPlanzo Events Pvt. Ltd. collects, uses, stores, shares, and protects your personal data, in compliance with the DPDP Act 2023 and applicable Indian law.",
};

const HEADING = "mb-2 text-lg font-semibold text-mp-charcoal";
const SUBHEADING = "mb-2 mt-4 text-base font-semibold text-mp-charcoal";
const LIST = "list-disc space-y-1 pl-5";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 text-mp-charcoal">
        <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-1 text-sm text-mp-muted">MyPlanzo Events Pvt. Ltd.</p>
        <p className="mb-8 text-sm text-mp-muted">
          Last updated: 31 May 2026 · Effective date: 31 May 2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-mp-muted">
          <section>
            <h2 className={HEADING}>1. Introduction</h2>
            <p>
              Welcome to MyPlanzo (“we”, “us”, “our”). MyPlanzo Events Pvt. Ltd. operates the website
              myplanzo.com (the “Platform”), a marketplace that connects customers with event service
              vendors across India.
            </p>
            <p className="mt-2">
              This Privacy Policy explains how we collect, use, store, share, and protect your personal
              data when you access or use our Platform. It applies to all users including customers,
              vendors, and visitors.
            </p>
            <p className="mt-2">
              By using our Platform, you agree to the terms of this Privacy Policy. If you do not agree,
              please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>2. Consent and Account Registration</h2>
            <p>
              By creating an account on myplanzo.com, you explicitly consent to the collection, storage,
              and processing of your personal data in accordance with this Privacy Policy and the Digital
              Personal Data Protection Act, 2023.
            </p>
            <p className="mt-2">
              Where we rely on your consent to process personal data (such as for marketing
              communications), you may withdraw that consent at any time without affecting the lawfulness
              of processing carried out before withdrawal.
            </p>
            <p className="mt-2">
              For users registering via Google Sign-In, consent is obtained at the point of authorising
              Google to share your profile information with MyPlanzo.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>3. Applicable Law</h2>
            <p>This Privacy Policy is governed by and compliant with:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Information Technology Act, 2000 and IT (Amendment) Act, 2008</li>
              <li>
                Information Technology (Reasonable Security Practices and Procedures and Sensitive
                Personal Data or Information) Rules, 2011
              </li>
              <li>Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
              <li>Consumer Protection (E-Commerce) Rules, 2020</li>
            </ul>
            <p className="mt-2">
              MyPlanzo is an Indian company operating primarily within India. This Policy is designed for
              Indian users and Indian law compliance.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>4. Information We Collect</h2>

            <h3 className={SUBHEADING}>4.1 Information You Provide Directly</h3>
            <ul className={LIST}>
              <li>Full name, email address, and mobile number (during registration)</li>
              <li>Postal address and city</li>
              <li>Event preferences, dates, and booking details</li>
              <li>Vendor business name, service category, pricing, and description</li>
              <li>Portfolio photographs and event images uploaded by vendors</li>
              <li>PAN number, GST certificate, and bank account details (vendors only, for KYC and payouts)</li>
              <li>Communications and messages exchanged through the Platform</li>
              <li>Reviews and ratings submitted after bookings</li>
            </ul>

            <h3 className={SUBHEADING}>4.2 Information Collected via Google Sign-In</h3>
            <p>
              We offer Google Sign-In as a convenient registration and login option. When you choose to
              sign in with Google, we receive the following information from your Google account with your
              consent:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>Your full name as registered with Google</li>
              <li>Your Google account email address</li>
              <li>Your Google profile picture (if available)</li>
              <li>A unique Google account identifier (Google ID)</li>
            </ul>
            <p className="mt-2">
              We do not receive your Google password. We only access the information you authorise during
              the Google Sign-In process. Your use of Google Sign-In is also subject to Google’s Privacy
              Policy available at{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mp-accent underline"
              >
                policies.google.com/privacy
              </a>
              .
            </p>

            <h3 className={SUBHEADING}>4.3 Vendor Photographs and Visual Content</h3>
            <p>As part of vendor onboarding and profile creation, we request vendors to upload:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Portfolio photographs showcasing past events and work</li>
              <li>Profile or business photographs</li>
              <li>Event-specific images for service listings</li>
            </ul>
            <p className="mt-2">
              By uploading photographs to the Platform, vendors grant MyPlanzo a non-exclusive,
              royalty-free licence to display, resize, and use those images on the Platform for the
              purpose of showcasing vendor services to customers. Vendors confirm they hold the rights to
              all images they upload and that such images do not infringe any third-party intellectual
              property rights.
            </p>

            <h3 className={SUBHEADING}>4.4 Information Collected Automatically</h3>
            <ul className={LIST}>
              <li>IP address, browser type, operating system, and device information</li>
              <li>Pages visited, time spent, clicks, and navigation patterns</li>
              <li>Cookie and tracking data (see Section 8)</li>
              <li>Referral URLs and search terms used to find the Platform</li>
              <li>Transaction history and booking records</li>
            </ul>

            <h3 className={SUBHEADING}>4.5 Information from Third Parties</h3>
            <ul className={LIST}>
              <li>Payment information processed via Razorpay — we do not store card or bank details directly</li>
              <li>Vendor KYC verification data processed via Razorpay Route</li>
              <li>Authentication data from Google Sign-In (as described in Section 4.2)</li>
            </ul>
          </section>

          <section>
            <h2 className={HEADING}>5. How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className={`${LIST} mt-2`}>
              <li>To create and manage your account on the Platform</li>
              <li>To authenticate your identity via Google Sign-In or email/password</li>
              <li>To facilitate bookings and connections between customers and vendors</li>
              <li>To display vendor profiles, portfolios, and photographs to customers</li>
              <li>To process payments and vendor payouts via Razorpay</li>
              <li>To verify vendor identity and business credentials (KYC)</li>
              <li>To send booking confirmations, invoices, receipts, and service updates</li>
              <li>To send order status notifications and reminders</li>
              <li>To respond to your queries and provide customer support</li>
              <li>To collect and display customer reviews and ratings</li>
              <li>To improve the Platform and personalise your experience</li>
              <li>
                To send promotional communications — only with your consent, and you may opt out at any
                time (see Section 6)
              </li>
              <li>To detect and prevent fraud, abuse, or illegal activity</li>
              <li>To comply with applicable Indian laws and legal obligations</li>
              <li>To run targeted advertising via Facebook Pixel and Meta Ads (see Section 8)</li>
            </ul>
          </section>

          <section>
            <h2 className={HEADING}>6. Marketing Communications and Email Consent</h2>
            <p>
              With your consent, we may send you promotional emails, event recommendations, vendor
              highlights, and platform updates.
            </p>
            <p className="mt-2">You may unsubscribe from promotional communications at any time by:</p>
            <ul className={`${LIST} mt-2`}>
              <li>Clicking the “Unsubscribe” link in any marketing email</li>
              <li>
                Contacting us at{" "}
                <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                  support@myplanzo.com
                </a>{" "}
                with the subject line “Unsubscribe”
              </li>
            </ul>
            <p className="mt-2">
              Please note that opting out of marketing communications will not affect transactional emails
              related to your bookings, account security, or legal notices.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>7. E-Commerce Policies</h2>

            <h3 className={SUBHEADING}>7.1 Order and Booking Information</h3>
            <p>
              When you place a booking on MyPlanzo, we collect and process the details of your booking
              including service type, event date, vendor selected, and payment amount. This information is
              necessary to fulfil your order and is retained as part of your transaction history.
            </p>

            <h3 className={SUBHEADING}>7.2 Payment Data</h3>
            <p>
              All payments on the Platform are processed by Razorpay Payments Pvt. Ltd., a licensed
              Payment Aggregator regulated by the Reserve Bank of India (RBI). MyPlanzo does not store your
              credit card, debit card, UPI, or net banking credentials. Payment data is handled entirely
              by Razorpay in accordance with PCI-DSS standards.
            </p>
            <p className="mt-2">
              For vendor payouts, we use Razorpay Route. Vendor bank account details collected during
              onboarding are stored securely and used solely for the purpose of processing payouts.
            </p>

            <h3 className={SUBHEADING}>7.3 Cancellation and Refund Policy</h3>
            <p>
              Cancellations and refunds are governed by our Cancellation and Refund Policy published on
              the Platform. In the event of a cancellation, any refund due will be processed to the
              original payment method within 7–10 working days, subject to the applicable cancellation
              terms. MyPlanzo’s liability is limited to the platform fee collected; vendor service fees are
              subject to the vendor’s own cancellation terms disclosed at the time of booking.
            </p>

            <h3 className={SUBHEADING}>7.4 Dispute Resolution</h3>
            <p>
              In the event of a dispute between a customer and a vendor arising from a booking on the
              Platform, MyPlanzo will attempt in good faith to facilitate resolution between the parties.
              Disputes must be raised with our Grievance Officer within 30 days of the incident.
            </p>
            <p className="mt-2">
              MyPlanzo may assist in facilitating resolution of disputes. However, the final contractual
              relationship remains between the customer and the vendor. MyPlanzo’s role is that of an
              intermediary platform and it does not assume liability for the outcome of vendor services.
            </p>

            <h3 className={SUBHEADING}>7.5 Vendor Conduct Disclaimer</h3>
            <p>
              MyPlanzo acts solely as an intermediary platform connecting customers and independent
              vendors. While we undertake reasonable verification measures including KYC and document
              checks, we do not guarantee the quality, safety, legality, timeliness, or performance of
              services provided by independent vendors listed on the Platform.
            </p>
            <p className="mt-2">
              Customers are encouraged to review vendor profiles, ratings, and reviews before making a
              booking. MyPlanzo shall not be held liable for any loss, damage, or dissatisfaction arising
              from vendor services.
            </p>

            <h3 className={SUBHEADING}>7.6 Consumer Rights</h3>
            <p>
              As a consumer using our Platform, you are protected under the Consumer Protection Act, 2019
              and the Consumer Protection (E-Commerce) Rules, 2020. You have the right to:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>Receive accurate information about vendor services and pricing before booking</li>
              <li>Receive a receipt or invoice for every transaction</li>
              <li>Raise a complaint and receive a response within 30 days</li>
              <li>Seek redressal through the National Consumer Helpline (1800-11-4000) if unresolved</li>
            </ul>

            <h3 className={SUBHEADING}>7.7 Pricing and Transparency</h3>
            <p>
              All prices displayed on the Platform are inclusive of applicable taxes unless stated
              otherwise. MyPlanzo charges a platform commission on bookings, which is disclosed to vendors
              during onboarding. Customers will see the total payable amount before confirming any booking.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>8. Sharing of Your Information</h2>
            <p>
              We do not sell your personal data. We may share your information in the following
              circumstances:
            </p>

            <h3 className={SUBHEADING}>8.1 With Vendors</h3>
            <p>
              When you make a booking, your name, contact number, and event details are shared with the
              relevant vendor to fulfil the service.
            </p>

            <h3 className={SUBHEADING}>8.2 With Customers</h3>
            <p>
              Vendor profiles including business name, service category, portfolio photographs, and
              contact information are visible to customers on the Platform.
            </p>

            <h3 className={SUBHEADING}>8.3 With Service Providers</h3>
            <ul className={LIST}>
              <li>Razorpay Payments Pvt. Ltd. — for payment processing and vendor KYC via Razorpay Route</li>
              <li>Google LLC — for authentication via Google Sign-In</li>
              <li>Meta Platforms Inc. (Facebook) — for website tracking and advertising via Facebook Pixel</li>
              <li>Cloud storage providers — for secure storage of data and vendor photographs</li>
              <li>Analytics providers — for Platform performance monitoring</li>
            </ul>

            <h3 className={SUBHEADING}>8.4 Cross-Border Data Processing</h3>
            <p>
              Certain third-party service providers including Google, Meta Platforms Inc., and cloud
              infrastructure providers may process your data outside India. By using the Platform, you
              consent to such cross-border processing, subject to applicable safeguards and data
              protection standards maintained by those providers. We ensure that such third parties
              maintain adequate data protection measures consistent with applicable Indian law.
            </p>

            <h3 className={SUBHEADING}>8.5 Legal Disclosure</h3>
            <p>
              We may disclose your information if required by law, court order, or government authority, or
              to protect the rights and safety of MyPlanzo, its users, or the public.
            </p>

            <h3 className={SUBHEADING}>8.6 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your data may be transferred to
              the acquiring entity, subject to the same privacy protections.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>9. Data Retention and Account Deletion</h2>
            <p>
              We retain your personal data for as long as your account is active or as necessary to provide
              our services. Specifically:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>
                <span className="text-mp-charcoal">Customer account data</span> — retained for 3 years
                after last activity
              </li>
              <li>
                <span className="text-mp-charcoal">Vendor KYC documents</span> — retained for 7 years for
                tax and legal compliance
              </li>
              <li>
                <span className="text-mp-charcoal">Transaction and booking records</span> — retained for 7
                years as required under Indian tax laws
              </li>
              <li>
                <span className="text-mp-charcoal">Vendor photographs and portfolio images</span> —
                retained while vendor account is active; deleted within 30 days of account closure upon
                request
              </li>
              <li>
                <span className="text-mp-charcoal">Google Sign-In tokens</span> — retained only for the
                duration of active sessions
              </li>
              <li>
                <span className="text-mp-charcoal">Marketing preferences</span> — until you withdraw
                consent
              </li>
            </ul>
            <p className="mt-2">
              You may request deletion of your account and personal data by emailing{" "}
              <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                support@myplanzo.com
              </a>
              . Account deletion requests are generally processed within 30 days of receipt, subject to
              legal retention requirements. Certain data may be retained beyond this period where required
              by applicable law.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>10. Cookies and Tracking Technologies</h2>

            <h3 className={SUBHEADING}>10.1 Cookies</h3>
            <p>
              We use cookies to enhance your experience on the Platform. Cookies are small files stored on
              your device. You can disable cookies through your browser settings, but this may affect
              Platform functionality. We use the following types of cookies:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>Essential Cookies — required for the Platform to function (login sessions, security)</li>
              <li>Analytics Cookies — to understand how users navigate the Platform</li>
              <li>Marketing Cookies — to deliver relevant advertisements (including via Facebook Pixel)</li>
              <li>Preference Cookies — to remember your settings and preferences</li>
            </ul>

            <h3 className={SUBHEADING}>10.2 Facebook Pixel</h3>
            <p>
              We use the Facebook Pixel (Pixel ID: 2483636635419982) operated by Meta Platforms Inc. The
              Facebook Pixel tracks user activity on our website including page views, vendor profile
              views, booking initiations, and completed bookings. This data is used to:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>Measure the effectiveness of our Facebook and Instagram advertisements</li>
              <li>Show targeted advertisements to users who have visited our Platform</li>
              <li>Create lookalike audiences for advertising purposes</li>
            </ul>
            <p className="mt-2">
              Data collected via Facebook Pixel is processed by Meta Platforms Inc. in accordance with
              Meta’s Data Policy. You can opt out of Facebook’s targeted advertising at{" "}
              <a
                href="https://www.facebook.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mp-accent underline"
              >
                facebook.com/settings/ads
              </a>
              .
            </p>

            <h3 className={SUBHEADING}>10.3 Google Sign-In Tracking</h3>
            <p>
              Google may set cookies in connection with the Google Sign-In feature. These are governed by
              Google’s Privacy Policy. We do not use Google Sign-In data for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>11. Data Security</h2>
            <p>
              We implement reasonable technical and organisational measures to protect your personal data,
              including:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>SSL/TLS encryption for all data transmitted to and from the Platform</li>
              <li>Encrypted storage of sensitive documents, KYC data, and vendor photographs</li>
              <li>Role-based access controls limiting who can access personal data internally</li>
              <li>Secure cloud storage for all uploaded images and documents</li>
              <li>Regular security assessments of our systems</li>
            </ul>
            <p className="mt-2">
              While we take all reasonable steps to protect your data, no system is completely secure. We
              cannot guarantee absolute security of data transmitted over the internet.
            </p>
            <p className="mt-2">
              In the event of a data breach affecting your personal data, we will notify you and the
              relevant authorities as required under the DPDP Act, 2023.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>12. Your Rights Under DPDP Act 2023</h2>
            <p>
              Under the Digital Personal Data Protection Act, 2023, you have the following rights:
            </p>
            <ul className={`${LIST} mt-2`}>
              <li>
                <span className="text-mp-charcoal">Right to Access</span> — request a copy of the personal
                data we hold about you
              </li>
              <li>
                <span className="text-mp-charcoal">Right to Correction</span> — request correction of
                inaccurate or incomplete data
              </li>
              <li>
                <span className="text-mp-charcoal">Right to Erasure</span> — request deletion of your
                personal data (subject to legal obligations)
              </li>
              <li>
                <span className="text-mp-charcoal">Right to Grievance Redressal</span> — raise a complaint
                with our Grievance Officer
              </li>
              <li>
                <span className="text-mp-charcoal">Right to Withdraw Consent</span> — withdraw consent for
                processing at any time, including for marketing communications
              </li>
              <li>
                <span className="text-mp-charcoal">Right to Nominate</span> — nominate a person to exercise
                your rights in case of death or incapacity
              </li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact our Grievance Officer (details in Section
              14).
            </p>
          </section>

          <section>
            <h2 className={HEADING}>13. Children’s Privacy</h2>
            <p>
              Our Platform is not directed at individuals under the age of 18. We do not knowingly collect
              personal data from minors. If we become aware that we have collected data from a minor
              without verifiable parental consent, we will delete it promptly. If you believe a minor has
              provided us with personal data, please contact us immediately at{" "}
              <a href="mailto:support@myplanzo.com" className="text-mp-accent underline">
                support@myplanzo.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className={HEADING}>14. Grievance Officer</h2>
            <p>
              In accordance with the Information Technology Act, 2000, IT Rules 2011, and the DPDP Act,
              2023, we have appointed a Grievance Officer:
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
              <span className="text-mp-charcoal">Response Time:</span> We will acknowledge your grievance
              within 48 hours and resolve it within 30 days of receipt.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>15. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices,
              technology, or applicable law. We will notify you of material changes by posting the updated
              policy on the Platform with a revised “Last Updated” date and, where appropriate, by sending
              an email notification to registered users.
            </p>
            <p className="mt-2">
              Continued use of the Platform after changes are posted constitutes your acceptance of the
              revised Policy.
            </p>
          </section>

          <section>
            <h2 className={HEADING}>16. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data
              practices, please contact us:
            </p>
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
