import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Revenue Brain",
  description: "Privacy Policy for Revenue Brain",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 20, 2026"

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-foreground/90">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">1. Information We Collect</h2>
          <p>
            Revenue Brain processes business communication data, including caller phone numbers,
            call timestamps, call status (missed/responded), contact names you provide, SMS message
            content sent through the platform, lead and booking details, account information, and
            basic log data (such as IP address and device information) related to your use of the
            service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">2. How We Use Information</h2>
          <p>
            We use this data to provide missed-call tracking, automate SMS follow-up workflows,
            recover lost revenue opportunities, generate analytics and ROI reporting, and improve
            service reliability and performance. We also use this information to maintain the
            security of the platform and comply with legal obligations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">3. Data Sharing</h2>
          <p>
            We do not sell personal information. We may share data with infrastructure and
            communications providers (such as telephony and messaging providers) only as needed to
            operate the service and comply with legal obligations. We do not sell, rent, or share
            your phone number or SMS message data with third parties for their marketing purposes.
            Mobile opt-in data will not be shared with third parties or affiliates for marketing or
            promotional purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">4. SMS Program and Consent</h2>
          <p>
            Revenue Brain provides SMS-based missed call recovery and customer-care messaging for
            participating businesses.
          </p>
          <p>
            If you call a participating business and your call is missed, you may receive one SMS
            message asking whether you would like help by text.
          </p>
          <p className="italic">
            Example: "Hi, this is [Business Name]. You just called us. Reply YES to receive help by
            text. Reply STOP to opt out."
          </p>
          <p>No further messages are sent unless you reply YES.</p>
          <p>
            If you reply YES, you may receive customer-care and conversational messages related to:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>appointment scheduling</li>
            <li>service coordination</li>
            <li>follow-up questions</li>
            <li>customer support</li>
          </ul>
          <p>Message frequency varies.</p>
          <p>Message and data rates may apply.</p>
          <p>Reply <strong>STOP</strong> to opt out.</p>
          <p>Reply <strong>HELP</strong> for help.</p>
          <p>
            Mobile opt-in data will not be shared with third parties or affiliates for marketing or
            promotional purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">5. Data Retention</h2>
          <p>
            We retain data for as long as needed to provide the service, satisfy legal obligations,
            resolve disputes, and enforce agreements. You may request deletion of your data,
            subject to applicable law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">6. Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational safeguards to protect
            your data. No method of transmission or storage is 100% secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">7. Your Choices</h2>
          <p>
            You can update business settings and message templates in your account. To request
            access, correction, or deletion of your data, contact us using the support details for
            your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">8. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Material changes will be reflected by updating
            the last updated date above.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Back to Revenue Brain
        </Link>
      </div>
    </main>
  )
}
