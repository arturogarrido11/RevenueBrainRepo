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
      </form>
    </main>
  )
}
