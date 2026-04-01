import Link from "next/link";

const nav = [
  ["How It Works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["Demo / Contact", "/demo"],
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight"><span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Revenue Brain</span></Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-300 md:flex">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-slate-900 dark:hover:text-white">{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Login</Link>
            <Link href="/demo" className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500 hover:shadow">Book Demo</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-16">{children}</main>

      <footer className="mt-12 border-t bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sms-policy">SMS Policy</Link>
          </div>
          <p className="mt-4">Revenue Brain is a customer communication software platform operated by Arturo Garrido.</p>
        </div>
      </footer>
    </div>
  );
}
