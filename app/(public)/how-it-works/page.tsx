import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";

const steps = [
  {
    title: "Capture every missed call",
    text: "Revenue Brain receives webhook events from Twilio and logs each missed inbound call instantly.",
  },
  {
    title: "Create or update the lead",
    text: "Caller phone numbers are matched to existing records or added as new leads in your CRM.",
  },
  {
    title: "Send smart SMS follow-up",
    text: "A branded response is sent automatically using your configured timing, tone, and booking link.",
  },
  {
    title: "Manage inbox + recover bookings",
    text: "AI handles routine replies while your team can jump in anytime to close high-value appointments.",
  },
  {
    title: "Track ROI by location",
    text: "Monitor response rates, booking conversion, and estimated recovered revenue from one dashboard.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <section className="max-w-3xl">
        <p className="inline-flex rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-700">Process</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Built for fast response, built for revenue recovery.</h1>
        <p className="mt-4 text-lg text-slate-600">From missed call to booked appointment in one operational flow.</p>
      </section>

      <section className="mt-10 space-y-4">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-xl border bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step {i + 1}</p>
            <h2 className="mt-1 text-xl font-semibold">{step.title}</h2>
            <p className="mt-2 text-slate-600">{step.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-2xl bg-slate-900 p-8 text-white">
        <h3 className="text-2xl font-bold">See this flow with your own call volume.</h3>
        <p className="mt-2 text-slate-300">We'll model expected recovered bookings and revenue for your team.</p>
        <Link href="/demo" className="mt-5 inline-block rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900">Book Demo</Link>
      </section>
    </PublicShell>
  );
}
