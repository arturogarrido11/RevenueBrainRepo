import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "SMS Policy | Revenue Brain",
  description: "SMS Policy for Revenue Brain missed call text messages.",
}

export default function SmsPolicyPage() {
  const lastUpdated = "May 20, 2026"

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">SMS Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-foreground/90">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Program Description</h2>
          <p>
            Revenue Brain provides SMS-based missed call recovery and customer-care messaging for
            participating businesses. Messages are used to help recover missed calls, coordinate
            appointments, and answer questions related to a customer&apos;s inquiry.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Missed Call Text Consent</h2>
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
          <p>Reply STOP to opt out.</p>
          <p>Reply HELP for help.</p>
          <p>
            Mobile opt-in data will not be shared with third parties or affiliates for marketing or
            promotional purposes.
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
