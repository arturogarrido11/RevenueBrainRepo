"use client"

import Link from "next/link"
import { Phone, MessageSquare, CalendarCheck, BarChart2, Mic, Zap, Shield, Clock } from "lucide-react"
import { PublicShell } from "@/components/layout/public-shell"

const features = [
  {
    icon: Mic,
    title: "AI answers your missed calls",
    text: "A natural-sounding AI receptionist picks up every missed call, greets your caller by your business name, and holds a real conversation — 24/7.",
  },
  {
    icon: CalendarCheck,
    title: "Books appointments automatically",
    text: "The AI checks your calendar in real time and books the slot on the spot. Caller gets a confirmation. You get a notification. No human needed.",
  },
  {
    icon: MessageSquare,
    title: "SMS follow-up for every lead",
    text: "Every caller who doesn't book gets an instant text follow-up. Replies route straight to your dashboard so you can close the conversation.",
  },
  {
    icon: BarChart2,
    title: "See every recovered lead",
    text: "Dashboard shows every AI-handled call, transcript, appointment outcome, and lead captured — so you know exactly what revenue you would have lost.",
  },
  {
    icon: Zap,
    title: "Live in minutes",
    text: "Sign up, answer a few questions about your business, and you're live. No code, no IT team, no hardware. Works with your existing phone number.",
  },
  {
    icon: Shield,
    title: "Sounds like your receptionist",
    text: "Configure the AI's name, greeting, and personality. It knows your services, your prices, and your FAQs — and answers accordingly.",
  },
]

const useCases = [
  "Dental & orthodontic offices",
  "Med spas & aesthetics clinics",
  "Law firms & legal consultants",
  "Veterinary clinics",
  "Home services & contractors",
  "Physical therapy & chiropractic",
  "Real estate agents",
  "Beauty salons & barbershops",
  "Fitness studios & gyms",
  "Any appointment-based business",
]

const steps = [
  { n: "01", title: "Sign up free", text: "Create your account in 30 seconds. No credit card required for the 14-day trial." },
  { n: "02", title: "Set up your profile", text: "Tell us your business name, services, hours, and FAQs. Takes about 5 minutes." },
  { n: "03", title: "Get your AI number", text: "We provision a local phone number for you. Forward your existing number to it — or use it as your main line." },
  { n: "04", title: "Start recovering calls", text: "Every missed call gets answered by your AI receptionist. Leads and bookings appear in your dashboard." },
]

const testimonials = [
  {
    quote: "We were losing 30–40 calls a week to voicemail. Revenue Brain catches all of them now. It booked 11 new patients in the first two weeks.",
    by: "Office Manager, Multi-location dental group",
  },
  {
    quote: "My clients call after hours all the time. The AI handles it, books them in, and I wake up to a full schedule. Worth every penny.",
    by: "Owner, Boutique med spa",
  },
]

const faqs = [
  {
    q: "How does the AI know what to say?",
    a: "During setup you tell us your business name, services, pricing, hours, and common questions. We generate a custom AI briefing from your answers. The AI speaks as your receptionist — not as a generic bot.",
  },
  {
    q: "Does it work with my existing phone number?",
    a: "Yes. You keep your current number. You simply forward unanswered calls to your Revenue Brain number, which we provision for you during setup.",
  },
  {
    q: "What happens when the AI can't answer something?",
    a: "It tells the caller it'll have someone follow up, captures their info, and sends you an alert. You can also configure a transfer number so the AI can connect callers to a human on request.",
  },
  {
    q: "Can I see what the AI said on each call?",
    a: "Yes. Every call comes with a full transcript and AI-generated summary in your dashboard. You'll know exactly what was discussed and what the outcome was.",
  },
  {
    q: "Does it book directly into my calendar?",
    a: "On the Pro plan, yes. Connect your Google Calendar and the AI checks your availability in real time and books the slot. The caller gets a confirmation SMS. No double-booking.",
  },
  {
    q: "Is there a contract?",
    a: "No. Month-to-month. Cancel anytime. Start with the 14-day free trial — no credit card required.",
  },
]

export default function HomePage() {
  return (
    <PublicShell>

      {/* Hero */}
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
            <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
            AI Receptionist — Live 24/7
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Every missed call, answered by AI.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Revenue Brain picks up your missed calls with a natural AI voice, books appointments directly into your calendar, and captures every lead — automatically, around the clock.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Start Free Trial
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">14-day free trial · No credit card · Cancel anytime</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-500">AI Receptionist Active</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><Phone size={12} /> Missed call from +1 (786) 555-0192</div>
              <p className="text-sm font-medium">AI answered · 2 min 14 sec</p>
              <p className="text-xs text-slate-500 mt-1">"Booked for Tuesday at 10:00 AM. Confirmation sent."</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><Phone size={12} /> Missed call from +1 (305) 555-0847</div>
              <p className="text-sm font-medium">Lead captured · 1 min 32 sec</p>
              <p className="text-xs text-slate-500 mt-1">"Asked about pricing. Interested in initial consultation."</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
              <p className="text-xs text-slate-500">This month</p>
              <p className="mt-1 text-xl font-bold">48 calls</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">answered by AI</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/40">
              <p className="text-xs text-slate-500">Appointments</p>
              <p className="mt-1 text-xl font-bold">19 booked</p>
              <p className="text-xs text-green-600 dark:text-green-400">would have been lost</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Up and running in minutes</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-3xl font-black text-indigo-100 dark:text-indigo-900/60">{s.n}</span>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Everything your front desk does — automated</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Use cases */}
      <section className="mt-16 rounded-2xl border bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold tracking-tight">Built for any appointment-based business</h2>
        <div className="mt-6 grid grid-cols-2 gap-2 text-sm md:grid-cols-3 lg:grid-cols-5">
          {useCases.map((u) => (
            <div key={u} className="rounded-lg border bg-slate-50 px-3 py-2 text-center text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {u}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-16 grid gap-5 md:grid-cols-2">
        {testimonials.map((t) => (
          <blockquote key={t.by} className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-700 dark:text-slate-200">"{t.quote}"</p>
            <footer className="mt-3 text-sm text-slate-500">— {t.by}</footer>
          </blockquote>
        ))}
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-10 text-center text-white shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight">Stop losing high-intent callers.</h2>
        <p className="mt-3 text-slate-300">Start your 14-day free trial. No credit card. Up in minutes.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Start Free Trial
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </PublicShell>
  )
}
