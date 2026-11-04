"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function OnboardingPage() {
  const business = useQuery(api.businesses.getMyBusiness);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {business ? `Welcome, ${business.businessName}!` : "Account created!"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Your Revenue Brain account is ready.
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800 p-6 text-left space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Your account
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Account created</span>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <span className="opacity-40">○</span>
              <span>Connect your phone number</span>
              <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                Coming soon
              </span>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <span className="opacity-40">○</span>
              <span>Configure your AI receptionist</span>
            </li>
          </ul>
        </div>

        {business?.plan === "trial" && business.trialEndsAt && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            🎉 Your 14-day free trial is active until{" "}
            <strong>{new Date(business.trialEndsAt).toLocaleDateString()}</strong>.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Go to dashboard
          </Link>
          <Link
            href="/receptionist"
            className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Set up receptionist
          </Link>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Onboarding wizard coming soon — your account is ready to use.
        </p>
      </div>
    </div>
  );
}
