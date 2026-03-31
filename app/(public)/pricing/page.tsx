import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";

const plans = [
  {
    name: "Starter",
    price: "$299/mo",
    desc: "For single-location practices",
    points: ["1 Twilio number", "Missed call lead capture", "Automated SMS", "Inbox + CRM basics", "Core analytics"],
  },
  {
    name: "Growth",
    price: "$599/mo",
    desc: "For growing teams",
    featured: true,
    points: ["Up to 3 numbers", "Advanced follow-up logic", "Role-based access", "Conversation notes + takeover", "Priority support"],
  },
  {
    name: "Scale",
    price: "Custom",
    desc: "For multi-location operators",
    points: ["Multi-tenant management", "Custom integrations", "Dedicated onboarding", "Operational reporting", "SLA options"],
  },
];

export default function PricingPage() {
  return (
    <PublicShell>
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Pricing designed around recovered revenue.</h1>
        <p className="mt-4 text-lg text-slate-600">Choose a plan that fits your location count and call volume. Twilio usage billed separately.</p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-xl border p-6 ${p.featured ? "border-indigo-800 bg-gradient-to-b from-indigo-700 to-violet-700 text-white shadow-lg" : "bg-white"}`}>
            <p className="text-sm font-medium opacity-80">{p.name}</p>
            <p className="mt-2 text-3xl font-bold">{p.price}</p>
            <p className="mt-2 text-sm opacity-80">{p.desc}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.points.map((pt) => (
                <li key={pt}>• {pt}</li>
              ))}
            </ul>
            <Link href="/demo" className={`mt-6 inline-block rounded-md px-4 py-2 text-sm font-semibold ${p.featured ? "bg-white text-slate-900" : "bg-slate-900 text-white"}`}>
              Get Started
            </Link>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Frequently asked pricing questions</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p><strong>Is there a setup fee?</strong> Optional onboarding packages are available for larger teams.</p>
          <p><strong>Do you lock us into contracts?</strong> Month-to-month by default, annual discounts available.</p>
          <p><strong>Can we add locations later?</strong> Yes, upgrade at any time as you expand.</p>
        </div>
      </section>
    </PublicShell>
  );
}
