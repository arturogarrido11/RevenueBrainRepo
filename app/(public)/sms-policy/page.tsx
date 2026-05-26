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

        <section className="space-y-3 rounded-xl border bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Missed Call Text Consent</h2>
          <p>
            If you call a participating business and your call is missed, you may receive one SMS message asking whether you would like help by text.
          </p>
          <p className="italic">
            Example: “Hi, this is [Business Name]. You just called us. Reply YES to receive help by text. Reply STOP to opt out.”
          </p>
          <p>No further messages are sent unless you reply YES.</p>
          <p>
            If you reply YES, you may receive customer-care and conversational messages related to:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>appointment scheduling</li>
            <li>service coordination</li>
            <li>follow-up questions</li>
            <li>customer support</li>
          </ul>
          <p>Message frequency varies.</p>
          <p>Message and data rates may apply.</p>
          <p>Reply STOP to opt out.</p>
          <p>Reply HELP for help.</p>
          <p>Mobile opt-in data will not be shared with third parties or affiliates for marketing or promotional purposes.</p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">How end users consent to receive SMS messages</h2>
          <p>
            Revenue Brain uses SMS messaging only when end users have provided their phone number in
            connection with a business inquiry, appointment, or service-related request, and
            <strong>
              {" "}
              where they have provided explicit consent to receive SMS messages or where they are sent
              a one-time consent request following a user-initiated action (such as a phone call).
            </strong>
          </p>
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <p className="font-medium">Missed call consent and follow-up</p>
              <p>
                When a user places a phone call to a participating business, this is considered a
                user-initiated interaction. If the call is missed, Revenue Brain sends a
                {" "}
                <strong>single SMS message</strong>
                {" "}
                to request consent to continue communication via text.
              </p>
              <p className="mt-2">Example:</p>
              <blockquote className="border-l-2 border-slate-200 pl-3 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                "Hi, this is [Business Name]. You just called us. Reply YES to receive help by text. Reply STOP to opt out."
              </blockquote>
              <p className="mt-2 font-medium">Key points:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>
                  <strong>
                    No further SMS messages are sent unless the end user explicitly opts in by replying YES.
                  </strong>
                </li>
                <li>
                  If the user replies YES, consent is recorded with timestamp and phone number, and the
                  system allows customer-care messaging related to the missed call, appointment scheduling,
                  or service coordination.
                </li>
                <li>
                  If the user does not reply, no additional messages are sent (other than responding to
                  STOP or HELP keywords, if used).
                </li>
              </ul>
              <p className="mt-2">
                Revenue Brain sends messages only to phone numbers that the business has collected directly
                from its own leads or customers (for example via booking forms, intake forms, website contact
                forms, or other customer-initiated service requests). Revenue Brain does not send messages to
                purchased, rented, or third-party lead lists.
              </p>
            </li>
          </ol>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Message types and frequency</h2>
          <p>
            Messages are limited to transactional, conversational, and customer-care communication
            associated with missed calls, customer inquiries, appointment scheduling, service
            coordination, and other service-related communication for participating businesses.
          </p>
          <p>
            Ongoing SMS conversations occur only after an end user has provided explicit consent (for
            example, by replying YES to the missed call consent message). Message frequency varies
            based on user engagement and the number of missed calls or appointments requiring
            attention.
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Opt-out and help</h2>
          <p>
            End users can opt out of SMS at any time by replying
            {" "}
            <span className="font-mono font-semibold">STOP</span>. They may request help or support by
            replying <span className="font-mono font-semibold">HELP</span>. Standard message and data
            rates may apply.
          </p>
          <p>
            Users who opt out may opt back in at any time by replying
            {" "}
            <span className="font-mono font-semibold">START</span>.
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Data use and sharing</h2>
          <p>
            Revenue Brain uses phone numbers and SMS content only to provide customer-care and
            service-related communication associated with missed calls and customer inquiries to the
            participating business that collected the number.
          </p>
          <p>
            <strong>
              SMS consent is not shared with third parties or affiliates for marketing or promotional purposes.
            </strong>{" "}
            We do not sell, rent, or share end users’ phone numbers or SMS message data with third
            parties for their own marketing purposes.
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Sample Website Consent Disclosure</h2>
          <blockquote className="border-l-2 border-slate-200 pl-3 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            By providing your phone number, you agree to receive customer-care and conversational SMS
            messages from Revenue Brain related to your inquiry or service request. Message frequency
            may vary. Message and data rates may apply. Reply STOP to opt out and HELP for help.
          </blockquote>
        </section>

        <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p>
            For questions about this SMS policy or to report issues, contact
            {" "}
            <a
              href="mailto:revenuebrain.server@gmail.com"
              className="text-indigo-600 underline hover:text-indigo-500"
            >
              revenuebrain.server@gmail.com
            </a>
            .
          </p>
        </section>
      </section>
    </PublicShell>
  );

}
