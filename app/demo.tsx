import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Request a Demo | Revenue Brain",
  description: "Request a demo of Revenue Brain and see how missed-call recovery works.",
}

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Request a Demo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        See how Revenue Brain recovers missed calls and turns them into booked revenue.
      </p>

      <form className="mt-8 space-y-4 border-t pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="businessName">
              Business name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Acme Dental"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="contactName">
              Contact name
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Jane Doe"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="workEmail">
              Work email
            </label>
            <input
              id="workEmail"
              name="workEmail"
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="phone">
              Mobile phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="industry">
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Home services, healthcare, legal, etc."
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="missedCalls">
            Estimated missed calls per month
          </label>
          <input
            id="missedCalls"
            name="missedCalls"
            type="number"
            min={0}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="e.g. 25"
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Request demo
        </button>

        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-semibold">SMS Consent:</span> By submitting this form, you agree
          to receive SMS messages related to your inquiry from Revenue Brain and participating
          businesses. Message &amp; data rates may apply. Message frequency varies. Reply STOP to
          cancel, HELP for help. See our Privacy Policy at
          <span className="ml-1 inline-flex items-center gap-1">
            <Link href="/privacy-policy" className="underline">
              https://www.revenuebrain.ai/privacy
            </Link>
            .
          </span>
        </p>
      </form>

      <section className="mt-10 rounded-lg border bg-muted/40 p-4 text-xs leading-5 text-muted-foreground">
        <h2 className="text-sm font-medium text-foreground">SMS Program Details</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium">Program Name:</span> Revenue Brain Missed Call Recovery
            Alerts.
          </li>
          <li>
            <span className="font-medium">Program Description:</span> Follow-up and scheduling
            messages after missed calls for participating businesses and demo requests submitted
            through this form.
          </li>
          <li>
            <span className="font-medium">Message Frequency:</span> Message frequency varies
            based on your interactions and missed-call volume.
          </li>
          <li>
            <span className="font-medium">Cost:</span> Message &amp; data rates may apply.
          </li>
          <li>
            <span className="font-medium">Opt-Out:</span> Reply STOP to cancel at any time.
          </li>
          <li>
            <span className="font-medium">Help:</span> Reply HELP for help or contact us at
            support@revenuebrain.ai.
          </li>
          <li>
            <span className="font-medium">Privacy:</span> We do not sell, rent, or share your
            phone number or SMS message data with third parties for their marketing purposes. See
            our full Privacy Policy above.
          </li>
        </ul>
      </section>
    </main>
  )
}
