import Link from "next/link"
import Image from "next/image"

const nav = [
  ["How It Works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["Demo / Contact", "/demo"],
]

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#111111] dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-[#C9C8C3] bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-[#111111]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center">
            {/* Black logo for light mode, white logo for dark mode */}
            <Image
              src="/brand/logo-black.svg"
              alt="Revenue Brain"
              width={160}
              height={39}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/brand/logo-white.svg"
              alt="Revenue Brain"
              width={160}
              height={39}
              className="hidden dark:block"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-300 md:flex">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-[#F7F6F2] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-[#111111] dark:hover:bg-slate-100"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-16">{children}</main>

      <footer className="mt-16 border-t border-[#C9C8C3] bg-[#F7F6F2] dark:border-slate-800 dark:bg-[#111111]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex items-center">
            <Image
              src="/brand/logo-black.svg"
              alt="Revenue Brain"
              width={130}
              height={32}
              className="block dark:hidden"
            />
            <Image
              src="/brand/logo-white.svg"
              alt="Revenue Brain"
              width={130}
              height={32}
              className="hidden dark:block"
            />
          </div>
          <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            AI receptionist for businesses that can&apos;t afford to miss a call.
          </p>
          <div className="flex flex-wrap gap-5 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/privacy" className="hover:text-[#111111] dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#111111] dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sms-policy" className="hover:text-[#111111] dark:hover:text-white transition-colors">SMS Policy</Link>
            <Link href="/pricing" className="hover:text-[#111111] dark:hover:text-white transition-colors">Pricing</Link>
          </div>
          <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Revenue Brain. Operated by Arturo Garrido.
          </p>
        </div>
      </footer>
    </div>
  )
}
