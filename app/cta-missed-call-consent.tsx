export function MissedCallTextConsentSection() {
  return (
    <section className="mt-10 rounded-xl border bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <h2 className="text-lg font-semibold">Missed Call Text Consent</h2>
      <p>
        If you call a participating business and your call is missed, you may receive one SMS message asking whether you would like help by text.
      </p>
      <p className="italic">
        Example: 
        {" "}
        “Hi, this is [Business Name]. You just called us. Reply YES to receive help by text. Reply STOP to opt out.”
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
  );
}
