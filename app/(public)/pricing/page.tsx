import Link from "next/link"
import { Check, X } from "lucide-react"
import { PublicShell } from "@/components/layout/public-shell"

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/mo",
    desc: "SMS text-back for missed calls",
    cta: "Start Free Trial",
    href: "/signup",
    featured: false,
    features: [
      { text: "Missed call detection", included: true },
      { text: "Instant SMS follow-up to caller", included: true },
      { text: "Lead capture & dashboard", included: true },
      { text: "SMS inbox (manual replies)", included: true },
      { text: "Contact & call history", included: true },
      { text: "AI voice receptionist", included: false },
      { text: "Auto appointment booking", included: false },
      { text: "Google Calendar integration", included: false },
      { text: "Post-call email + SMS alerts", included: false },
      { text: "Call transcript & summary", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$299",
    period: "/mo",
    desc: "Full AI receptionist — answers, books, notifies",
    cta: "Start Free Trial",
    href: "/signup",
    featured: true,
    badge: "Most Popular",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "AI voice receptionist (24/7)", included: true },
      { text: "Natural conversation — your brand, your FAQs", included: true },
      { text: "Auto appointment booking", included: true },
      { text: "Google Calendar integration", included: true },
      { text: "Post-call email + SMS alert to owner", included: true },
      { text: "Full call transcript & AI summary", included: true },
      { text: "Call transfer to human on request", included: true },
      { text: "Custom AI persona name & greeting", included: true },
      { text: "Priority support", included: true },
    ],
  },
]

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — 14 days free on any plan. No credit card required to start. You'll only be charged after the trial if you choose to continue.",
  },
  {
    q: "What are the Twilio usage costs?",
    a: "Your subscription covers the platform. Twilio voice and SMS usage costs are included for typical volumes (up to ~300 AI-handled calls/month on Pro). Heavy usage may incur small overages — we'll notify you before any extra charges.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. Upgrade from Starter to Pro at any time and the AI receptionist activates immediately. Downgrade takes effect at the next billing cycle.",
  },
  {
    q: "Do I need to change my phone number?",
    a: "No. We provision a local number for you. You simply forward unanswered calls from your existing number — setup takes about 2 minutes.",
  },
  {
    q: "Is there a contract?",
    a: "No. Month-to-month only. Cancel any time from your account settings with no cancellation fee.",
  },
  {
    q: "What happens when the trial ends?",
    a: "If you don't add a payment method, your account pauses — no charges, no data loss. You can reactivate anytime.",
  },
]

export default function PricingPage() {
  return (
    <PublicShell>

      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Simple pricing. Real ROI.</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          One missed appointment at a typical small business is worth $150–$500. Revenue Brain pays for itself the first week.
        </p>
      </section>

      {/* Plans */}
      <section className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border p-7 ${
              p.featured
                ? "border-indigo-500 bg-gradient-to-b from-indigo-700 to-violet-700 text-white shadow-xl"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            {p.badge && (
              <span className="absolute -top-3 left-6 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow">
                {p.badge}
              </span>
            )}
            <p className={`text-sm font-medium ${p.featured ? "text-indigo-200" : "text-slate-500"}`}>{p.name}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-black">{p.price}</span>
              <span className={`text-sm ${p.featured ? "text-indigo-200" : "text-slate-400"}`}>{p.period}</span>
            </div>
            <p className={`mt-2 text-sm ${p.featured ? "text-indigo-100" : "text-slate-500"}`}>{p.desc}</p>

            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-sm">
                  {f.included ? (
                    <Check size={15} className={p.featured ? "text-green-300 shrink-0" : "text-green-600 shrink-0"} />
                  ) : (
                    <X size={15} className={p.featured ? "text-indigo-400 shrink-0" : "text-slate-300 shrink-0"} />
                  )}
                  <span className={!f.included ? (p.featured ? "text-indigo-300" : "text-slate-400") : ""}>{f.text}</span>
                </li>
              ))}
            </ul>

            <Link
              href={p.href}
              className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 ${
                p.featured
                  ? "bg-white text-slate-900 hover:bg-slate-100"
                  : "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
              }`}
            >
              {p.cta}
            </Link>
            <p className={`mt-2 text-center text-xs ${p.featured ? "text-indigo-200" : "text-slate-400"}`}>
              14-day free trial · No credit card
            </p>
          </div>
        ))}
      </section>

      {/* ROI callout */}
      <section className="mt-12 max-w-4xl rounded-2xl border border-green-200 bg-green-50 p-7 dark:border-green-900/40 dark:bg-green-950/30">
        <h2 className="text-lg font-bold text-green-900 dark:text-green-200">The math is simple</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3 text-sm">
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">Average missed calls/week</p>
            <p className="text-3xl font-black text-green-700 dark:text-green-400 mt-1">12</p>
            <p className="text-green-600 dark:text-green-500">for a typical small business</p>
          </div>
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">Average booking value</p>
            <p className="text-3xl font-black text-green-700 dark:text-green-400 mt-1">$200</p>
            <p className="text-green-600 dark:text-green-500">dental, med spa, legal, etc.</p>
          </div>
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">Revenue Brain recovers</p>
            <p className="text-3xl font-black text-green-700 dark:text-green-400 mt-1">40%</p>
            <p className="text-green-600 dark:text-green-500">≈ $4,000+/mo recovered from missed calls</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-green-700 dark:text-green-400">
          At $299/mo, that's a <strong>13× return</strong> in the first month — and those are conservative numbers.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Pricing questions</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 max-w-4xl rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-10 text-center text-white">
        <h2 className="text-2xl font-bold">Try it free for 14 days</h2>
        <p className="mt-2 text-slate-300">Set up takes 5 minutes. First recovered call is usually within 24 hours.</p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
        >
          Start Free Trial — No Credit Card
        </Link>
      </section>
    </PublicShell>
  )
}
