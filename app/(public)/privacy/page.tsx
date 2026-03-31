import { PublicShell } from "@/components/layout/public-shell";

export default function PrivacyPage() {
  return (
    <PublicShell>
      <article className="prose prose-slate max-w-4xl dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> March 16, 2026</p>
        <p>
          Revenue Brain is a customer communication software platform operated by Arturo Garrido.
          This Privacy Policy explains how Revenue Brain collects, uses, stores, and protects
          personal information when businesses use the platform.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>Caller and contact phone numbers</li>
          <li>Call metadata (date/time, duration, missed/answered status)</li>
          <li>SMS conversation content and delivery metadata</li>
          <li>Lead and booking status information entered by businesses</li>
          <li>Account and business profile information</li>
          <li>Basic usage and log data for security and product reliability</li>
        </ul>

        <h2>2. How We Use Information</h2>
        <ul>
          <li>Convert missed calls into leads and track follow-up workflows</li>
          <li>Send and receive SMS messages on behalf of customer businesses</li>
          <li>Provide dashboards, analytics, and ROI reporting</li>
          <li>Maintain security, prevent abuse, and troubleshoot issues</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>

        <h2>3. SMS and Consent</h2>
        <p>
          <strong>Program Name:</strong> Revenue Brain Missed Call Recovery Alerts
          <br />
          <strong>Program Description:</strong> Follow-up and scheduling messages sent after missed calls
          for participating businesses.
        </p>
        <p>
          Revenue Brain sends SMS communications only on behalf of customer businesses.
          Businesses are responsible for obtaining appropriate consent from end users in accordance
          with applicable laws (including TCPA and carrier requirements).
        </p>
        <p>
          <strong>Message Frequency:</strong> Message frequency may vary based on customer interaction.
          <br />
          <strong>Message and Data Rates:</strong> Message and data rates may apply.
          <br />
          <strong>Opt-Out:</strong> Reply <strong>STOP</strong> to unsubscribe.
          <br />
          <strong>Support:</strong> Reply <strong>HELP</strong> or email <strong>revenuebrain.server@gmail.com</strong>.
        </p>
        <p>
          By submitting a web form or otherwise providing your phone number on a Revenue Brain
          property, you agree to receive SMS messages related to your inquiry from Revenue Brain
          and participating businesses. Message &amp; data rates may apply. Message frequency varies.
          You can opt out at any time by replying STOP and may reply HELP for help. See this Privacy
          Policy at <a href="https://www.revenuebrain.ai/privacy">https://www.revenuebrain.ai/privacy</a> for more details.
        </p>

        <h2>4. Sharing of Information</h2>
        <p>
          We do not sell personal information. We share data only with service providers necessary
          to operate the platform (for example, Twilio for messaging/telephony infrastructure,
          cloud hosting providers, and analytics/error monitoring providers), and as required by law.
        </p>
        <p>
          We do not sell, rent, or share your phone number or SMS message data with third parties
          for their marketing purposes.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain business and communication records for as long as needed to provide services,
          meet contractual obligations, resolve disputes, and comply with legal requirements.
        </p>

        <h2>6. Data Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational safeguards to protect
          information against unauthorized access, disclosure, alteration, or destruction.
          No internet-based system can be guaranteed 100% secure.
        </p>

        <h2>7. Business Customer Responsibilities</h2>
        <p>
          Businesses using Revenue Brain are responsible for the content of communications they
          send, their legal basis for messaging, and their own privacy disclosures to end users.
        </p>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          Revenue Brain is not intended for direct use by children under 13. We do not knowingly
          collect personal information directly from children under 13.
        </p>

        <h2>9. Your Rights and Choices</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, or delete personal
          information. Requests may be submitted using the contact information below.
        </p>

        <h2>10. Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Updated versions will be posted on
          this page with a revised effective date.
        </p>

        <h2>11. Contact</h2>
        <p>
          For privacy questions, contact:<br />
          <strong>Revenue Brain / Arturo Garrido</strong><br />
          Email: <em>revenuebrain.server@gmail.com</em>
        </p>
      </article>
    </PublicShell>
  );
}
