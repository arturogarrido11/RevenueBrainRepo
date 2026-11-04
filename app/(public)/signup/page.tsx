"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PublicShell } from "@/components/layout/public-shell";

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const createBusiness = useMutation(api.businesses.createForCurrentUser);

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create the Convex Auth user
      await signIn("password", { email, password, flow: "signUp" });

      // 2. Create the business record for this user
      await createBusiness({
        businessName: businessName || email.split("@")[0],
        ownerEmail: email,
      });

      // 3. Send to onboarding
      router.push("/onboarding");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not create account. Please try again.";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-md rounded-xl border bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start your 14-day free trial — no credit card required
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <input
            className="w-full rounded-md border px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            placeholder="Business name"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            className="w-full rounded-md border px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-md border px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <button
            disabled={loading}
            className="mt-1 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline-offset-2 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </PublicShell>
  );
}
