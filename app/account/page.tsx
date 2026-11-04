"use client";

import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const business = useQuery(api.businesses.getMyBusiness);
  const phoneNumbers = useQuery(api.phone_numbers.listMyNumbers);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your Revenue Brain account
        </p>
      </div>

      {business && (
        <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800 divide-y dark:divide-slate-800">
          <div className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Business
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Business name</dt>
                <dd className="font-medium">{business.businessName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium">{business.ownerEmail}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Timezone</dt>
                <dd className="font-medium">{business.timezone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Plan</dt>
                <dd>
                  <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 capitalize">
                    {business.plan}
                  </span>
                </dd>
              </div>
              {business.plan === "trial" && business.trialEndsAt && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Trial ends</dt>
                  <dd className="font-medium">
                    {new Date(business.trialEndsAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {phoneNumbers && phoneNumbers.length > 0 && (
            <div className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
                Phone numbers
              </h2>
              <ul className="space-y-2">
                {phoneNumbers.map((pn) => (
                  <li key={pn._id} className="flex items-center justify-between text-sm">
                    <span className="font-mono font-medium">{pn.twilioPhoneNumber}</span>
                    <span className="text-xs text-green-600 dark:text-green-400 capitalize">
                      {pn.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(!phoneNumbers || phoneNumbers.length === 0) && (
            <div className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                Phone number
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No phone number provisioned yet. Phone number provisioning is available during onboarding.
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="rounded-md border px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
