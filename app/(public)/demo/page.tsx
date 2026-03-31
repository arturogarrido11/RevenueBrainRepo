"use client";

import { useState } from "react";
import { PublicShell } from "@/components/layout/public-shell";

export default function DemoPage() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    missedCallsPerMonth: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await fetch("/api/demo-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("Thanks — your demo request has been received.");
      setForm({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        industry: "",
        missedCallsPerMonth: "",
      });
    } else {
      const data = await res.json();
      setStatus(data.error ?? "Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <PublicShell>
      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Book your Revenue Brain demo</h1>
          <p className="mt-4 text-base text-slate-600 md:text-lg">In 20 minutes, we'll map your missed call workflow and estimate recoverable revenue.</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-700">
            <li>• Workflow audit for your front desk operations</li>
            <li>• ROI projection from missed call volume</li>
            <li>• Twilio setup + deployment timeline</li>
          </ul>
        </div>

        <form onSubmit={submitForm} className="rounded-xl border bg-white p-5 shadow-sm md:p-6">
          <p className="text-sm font-medium text-slate-500">Demo request</p>
          <div className="mt-4 grid gap-3">
            <input required className="rounded-md border p-3" placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            <input required className="rounded-md border p-3" placeholder="Your name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            <input required type="email" className="rounded-md border p-3" placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required className="rounded-md border p-3" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <select required className="rounded-md border p-3 text-slate-600" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
              <option value="">Industry</option>
              <option>Animal Hospital</option>
              <option>Dental Office</option>
              <option>Med Spa</option>
              <option>Other Service Business</option>
            </select>
            <input required className="rounded-md border p-3" placeholder="Estimated missed calls / month" value={form.missedCallsPerMonth} onChange={(e) => setForm({ ...form, missedCallsPerMonth: e.target.value })} />
            <button disabled={loading} className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-medium text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60">
              {loading ? "Submitting..." : "Request Demo"}
            </button>
            {status ? <p className="text-sm text-slate-700">{status}</p> : null}

            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              By submitting this form, you agree to receive SMS messages related to your inquiry from
              Revenue Brain and participating businesses. Message &amp; data rates may apply. Message
              frequency varies. Reply STOP to cancel, HELP for help. See our
              <a href="https://www.revenuebrain.ai/privacy" className="ml-1 underline">Privacy Policy</a>.
            </p>

            <div className="mt-2 rounded-md border bg-slate-50 p-3 text-xs leading-5 text-slate-600">
              <p><strong>SMS Program:</strong> Revenue Brain Missed Call Recovery Alerts</p>
              <p><strong>Description:</strong> Follow-up and scheduling messages after missed calls.</p>
              <p><strong>Message frequency:</strong> Varies. <strong>Msg & data rates may apply.</strong></p>
              <p><strong>Opt-out:</strong> Reply STOP. <strong>Help:</strong> Reply HELP.</p>
              <p><strong>Support:</strong> revenuebrain.server@gmail.com</p>
            </div>
          </div>
        </form>
      </section>
    </PublicShell>
  );
}
