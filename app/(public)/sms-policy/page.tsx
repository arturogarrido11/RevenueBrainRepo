import { PublicShell } from "@/components/layout/public-shell";

export default function SmsPolicyPage() {
  return (
    <PublicShell>
      <section className="max-w-3xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">SMS Consent &amp; Messaging Policy</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            How Revenue Brain collects consent and uses text messaging on behalf of our customers.
          </p>
        </header>

        <section className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">How end users consent to receive SMS messages</h2>
          <p>Revenue Brain uses SMS messaging only when end users have provided their phone number in connection with a business inquiry, appointment, or service request, and where they are informed about receiving text messages and how to opt out.</p>
          <p>There are two primary ways end users consent to receive SMS messages:</p>
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <p className="font-medium">Demo / inquiry opt-in (hosted CTA)</p>
              <p>Prospective users can request a demo or contact us through the public form at <a href="https://www.revenuebrain.ai/demo" className="text-indigo-600 underline hover:text-indigo-500" target="_blank" rel="noreferrer">https://www.revenuebrain.ai/demo</a>. On this page, they provide their business details and mobile phone number and are shown explicit SMS consent language directly below the <span className="font-semibold">&ldquo;Request Demo&rdquo;</span> button. This language explains:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>What types of messages they will receive (demo follow-up and related product information);</li>
                <li>That message and data rates may apply;</li>
                <li>That message frequency may vary; and</li>
                <li>That they can reply <span className="font-mono font-semibold">STOP</span> to opt out and <span className="font-mono font-semibold">HELP</span> for help.</li>
              </ul>
              <p className="mt-2">Only users who submit this form with their phone number and see this disclosure receive SMS messages related to their inquiry.</p>
            </li>
            <li>
              <p className="font-medium">Missed call follow-up for leads and customers</p>
              <p>For participating businesses, Revenue Brain sends SMS messages only to phone numbers that the business has collected directly from leads or customers (for example via booking forms, intake forms, website contact forms, or prior phone calls) where providing a phone number is part of asking for a callback, appointment, or service.</p>
              <p className="mt-2">When a missed call event occurs, Revenue Brain uses that existing phone number to send one-to-one follow-up messages strictly about that missed call or related appointment (for example, rescheduling, confirming interest, or clarifying details).</p>
              <p className="mt-2">Every message includes clear opt-out instructions (<span className="font-mono font-semibold">reply STOP to opt out, HELP for help</span>). Revenue Brain does <span className="font-semibold">not</span> use purchased, rented, or third-party lead lists for messaging.</p>
            </li>
          </ol>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Message types and frequency</h2>
          <p>Messages are limited to transactional and conversational content related to missed calls, lead follow-up, appointment scheduling, and service coordination for participating businesses. Message frequency varies based on user engagement and the number of missed calls or appointments requiring attention.</p>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Opt-out and help</h2>
          <p>End users can opt out of SMS at any time by replying <span className="font-mono font-semibold">STOP</span>. They may request help or support by replying <span className="font-mono font-semibold">HELP</span>. Standard message and data rates may apply.</p>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p>For questions about this SMS policy or to report issues, contact <a href="mailto:revenuebrain.server@gmail.com" className="text-indigo-600 underline hover:text-indigo-500">revenuebrain.server@gmail.com</a>.</p>
        </section>
      </section>
    </PublicShell>
  );
}
