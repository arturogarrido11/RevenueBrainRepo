import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Revenue Brain",
  description: "Terms of Service for Revenue Brain",
}

export default function TermsOfServicePage() {
  const lastUpdated = "March 5, 2026"

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-foreground/90">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Revenue Brain, you agree to these Terms of Service and all
            applicable laws and regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">2. Service Description</h2>
          <p>
            Revenue Brain helps businesses track missed calls and automate responses. Features may
            change over time, and we may add, modify, or remove functionality.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">3. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining account security and for all activity under your
            account, including configuration of messaging templates and integrations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">4. Acceptable Use</h2>
          <p>
            You agree not to use the service for unlawful, fraudulent, abusive, or deceptive
            activity, including unauthorized outreach or violations of telecom and privacy laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">5. Fees and Billing</h2>
          <p>
            Paid features, if offered, are billed under the pricing and payment terms presented at
            purchase. Unless stated otherwise, fees are non-refundable.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">6. Disclaimer of Warranties</h2>
          <p>
            The service is provided as-is and as-available without warranties of any kind,
            express or implied, to the extent permitted by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Revenue Brain is not liable for indirect,
            incidental, special, consequential, or punitive damages arising from your use of the
            service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">8. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after changes
            become effective constitutes acceptance of the revised terms.
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
