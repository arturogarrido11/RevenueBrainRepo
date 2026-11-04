import Link from "next/link"
import { Phone, Cpu, CalendarCheck, Bell, LayoutDashboard } from "lucide-react"
import { PublicShell } from "@/components/layout/public-shell"

const steps = [
  {
    icon: Phone,
    title: "A caller dials your number",
    text: "They call your business. If nobody picks up after a few rings, their call automatically forwards to your Revenue Brain number — seamlessly, with no interruption to the caller.",
  },
  {
    icon: Cpu,
    title: "Your AI receptionist answers",
    text: "An AI with a natural, warm voice picks up and greets the caller by your business name. It knows your services, pricing, hours, and FAQs — and holds a real conversation to understand what they need.",
  },
  {
    icon: CalendarCheck,
    title: "It books the appointment (or captures the lead)",
    text: "If the caller wants to schedule, the AI checks your Google Calendar in real time and books an open slot. The caller gets a confirmation SMS. If they just have questions, their info and intent are captured as a lead.",
  },
  {
    icon: Bell,
    title: "You get notified instantly",
    text: "The moment the call ends, you receive an email and/or SMS with the caller's name, phone number, what they said, and what the AI did. No logging in required to know what happened.",
  },
  {
    icon: LayoutDashboard,
    title: "Review everything in your dashboard",
    text: "Every call, transcript, appointment, and lead appears in your Revenue Brain dashboard. See who called, what was discussed, and what revenue you recovered — all in one place.",
  },
]

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <section className="max-w-3xl">
        <p className="inline-flex rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          How it works
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">From missed call to booked appointment — automatically.</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          No app to download. No hardware. No staff training. Revenue Brain runs in the background and catches every lead you would have lost.
        </p>
      </section>

      <section className="mt-10 space-y-4 max-w-3xl">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="flex gap-5 rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex-shrink-0">
                <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step {i + 1}</p>
                <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.text}</p>
              </div>
            </div>
          )
        })}
      </section>

      <section className="mt-10 max-w-3xl rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Setup takes 5 minutes</h2>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="font-semibold">1. Tell us about your business</p>
            <p className="mt-1 text-slate-500">Name, services, hours, pricing, FAQs. We generate your AI briefing automatically.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="font-semibold">2. Get your number</p>
            <p className="mt-1 text-slate-500">We provision a local number for you. Set up call forwarding from your existing line in 2 minutes.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="font-semibold">3. Go live</p>
            <p className="mt-1 text-slate-500">Your AI receptionist is active immediately. First call handled automatically.</p>
          </div>
        </div>
      </section>

      <section className="mt-10 max-w-3xl rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-8 text-white">
        <h3 className="text-2xl font-bold">Ready to stop losing leads?</h3>
        <p className="mt-2 text-slate-300">Start your 14-day free trial. No credit card required.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/signup" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100">
            Start Free Trial
          </Link>
          <Link href="/pricing" className="rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            See Pricing
          </Link>
        </div>
      </section>
    </PublicShell>
  )
}
