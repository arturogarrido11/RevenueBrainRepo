import Link from "next/link";
import { BellRing, MessageSquareReply, CalendarCheck2, LineChart } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";

const features = [
  {
    title: "Missed calls become leads",
    text: "Automatically capture inbound missed calls and create lead records in seconds.",
    icon: BellRing,
  },
  {
    title: "Automated SMS follow-up",
    text: "Send immediate, personalized text responses so prospects stay engaged.",
    icon: MessageSquareReply,
  },
  {
    title: "Appointment recovery",
    text: "Turn abandoned calls into booked appointments with real-time inbox workflows.",
    icon: CalendarCheck2,
  },
  {
    title: "ROI tracking",
    text: "Track recovered bookings and estimated revenue by location and campaign.",
    icon: LineChart,
  },
];

const logos = ["Northside Dental", "Paws & Care Animal Hospital", "Luma Med Spa", "Oakridge Family Clinic"];

const testimonials = [
  {
    quote:
      "Revenue Brain helped us recover patients we used to lose after-hours. We can tie real bookings directly to missed calls.",
    by: "Practice Manager, Multi-location dental group",
  },
  {
    quote:
      "The SMS inbox is simple for our team, and the automated first reply keeps leads warm instantly.",
    by: "Owner, Boutique med spa",
  },
];

const faqs = [
  {
    q: "How fast does follow-up SMS send after a missed call?",
    a: "Typically within seconds, based on your configured timing rules in settings.",
  },
  {
    q: "Can my staff take over conversations manually?",
    a: "Yes. Any authorized user can switch from AI-handled to human-handled at any time.",
  },
  {
    q: "Do you support multiple business locations?",
    a: "Yes. Revenue Brain is multi-tenant and designed for single- and multi-location operators.",
  },
  {
    q: "How is recovered revenue calculated?",
    a: "Recovered bookings are tracked and multiplied by estimated booking value to generate ROI visibility.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
            Built for service businesses
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Recover revenue from every missed call.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Revenue Brain helps animal hospitals, dental offices, med spas, and similar teams capture missed-call demand, follow up instantly, and convert more leads into appointments.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/demo" className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 hover:shadow">
              Book a Demo
            </Link>
            <Link href="/how-it-works" className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              See How It Works
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Recovered this month</p>
          <p className="mt-2 text-3xl font-bold">$18,430</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><p className="text-slate-500 dark:text-slate-400">Missed calls</p><p className="mt-1 text-xl font-semibold">214</p></div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><p className="text-slate-500 dark:text-slate-400">Leads engaged</p><p className="mt-1 text-xl font-semibold">162</p></div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><p className="text-slate-500 dark:text-slate-400">Bookings</p><p className="mt-1 text-xl font-semibold">49</p></div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><p className="text-slate-500 dark:text-slate-400">Response rate</p><p className="mt-1 text-xl font-semibold">76%</p></div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Trusted by modern service teams</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700 md:grid-cols-4 dark:text-slate-200">
          {logos.map((logo) => (
            <div key={logo} className="rounded-md border bg-slate-50 px-3 py-2 text-center transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800">{logo}</div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700">
              <div className="mb-3 inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Icon size={18} />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{f.text}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <blockquote key={t.by} className="rounded-xl border bg-white p-6 transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-700 dark:text-slate-200">“{t.quote}”</p>
            <footer className="mt-3 text-sm text-slate-500 dark:text-slate-400">— {t.by}</footer>
          </blockquote>
        ))}
      </section>

      <section className="mt-10 rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-lg border p-4 dark:border-slate-700">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight">Stop losing high-intent callers.</h2>
        <p className="mt-2 max-w-2xl text-slate-300">See how much revenue your team can recover in the next 30 days with Revenue Brain.</p>
        <div className="mt-6">
          <Link href="/demo" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100">Schedule Your Demo</Link>
        </div>
      </section>
    </PublicShell>
  );
}
