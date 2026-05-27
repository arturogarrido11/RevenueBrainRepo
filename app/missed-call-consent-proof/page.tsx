import Image from "next/image";

export default function MissedCallConsentProofPage() {
  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Missed Call Consent Proof
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This page displays the public proof screenshot of the{" "}
          <span className="font-medium">Missed Call Text Consent</span> section
          on the Revenue Brain homepage, for Twilio A2P 10DLC review.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <Image
            src="/missed-call-consent-proof.png"
            alt="Screenshot of the Missed Call Text Consent section on the Revenue Brain homepage."
            width={1600}
            height={900}
            className="h-auto w-full"
            priority
          />
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <Image
            src="/missed-call-consent-proof-alt.png"
            alt="Alternate screenshot of Missed Call Text Consent / demo flow for Twilio proof."
            width={1600}
            height={900}
            className="h-auto w-full"
          />
        </div>
      </div>
    </main>
  );
}

