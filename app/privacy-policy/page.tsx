import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Revenue Brain",
  description: "Privacy Policy for Revenue Brain",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 5, 2026"

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-foreground/90">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">1. Information We Collect</h2>
          <p>
            Revenue Brain processes business communication data, including caller phone numbers,
            call timestamps, call status (missed/responded), contact names you provide, and message
            templates configured in your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">2. How We Use Information</h2>
          <p>
            We use this data to provide missed-call tracking, automate follow-up workflows,
            generate analytics, and improve service reliability and performance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">3. SMS and Consent</h2>
          <p>
            Revenue Brain Missed Call Recovery Alerts ("the Program") provides SMS messages to help
            you recover missed calls, follow up with leads, and schedule appointments.
          </p>
          <p>
            By providing your mobile phone number on our website and submitting the corresponding
            form, you consent to receive SMS messages from Revenue Brain Missed Call Recovery Alerts
            related to follow-up and scheduling after missed calls.
          </p>
          <p>
            Message frequency varies based on your interactions and missed-call activity. Message
            and data rates may apply. You are responsible for any charges imposed by your mobile
            carrier.
          </p>
          <p>
            You may opt out of receiving SMS messages from us at any time by replying STOP to any
            message. To receive additional information or assistance, reply HELP to any message.
          </p>
          <p>
            We use your phone number and SMS message data solely to provide and improve the Program
            and related services. We do not sell, rent, or share your phone number or SMS message
            data with third parties for their marketing purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">4. Data Sharing</h2>
          <p>
            We do not sell personal information. We may share data with infrastructure and
            communications providers only as needed to operate the service and comply with legal
            obligations.
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
          <h2 className="text-lg font-medium">5. Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational safeguards to protect
            your data. No method of transmission or storage is 100% secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">6. Your Choices</h2>
          <p>
            You can update business settings and message templates in your account. To request
            access, correction, or deletion of your data, contact us using the support details for
            your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">7. Changes to This Policy</h2>
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
