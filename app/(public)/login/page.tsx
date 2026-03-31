"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@northside-dental.com");
  const [password, setPassword] = useState("owner123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }

    const data = await res.json();
    router.push(data.role === "super_admin" ? "/admin/businesses" : "/dashboard");
    router.refresh();
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-md rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Admin and Business Owner/Manager access</p>

        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          <input className="w-full rounded-md border p-3 dark:border-slate-700 dark:bg-slate-800" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-md border p-3 dark:border-slate-700 dark:bg-slate-800" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 py-2 text-white disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>

        <div className="mt-5 rounded-md bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="font-semibold">Demo credentials</p>
          <p>Admin: admin@revenuebrain.app / admin123</p>
          <p>Owner: owner@northside-dental.com / owner123</p>
        </div>
      </div>
    </PublicShell>
  );
}
