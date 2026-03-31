import Link from "next/link"
import { PhoneMissed, MessageSquare, CalendarCheck, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Revenue Brain
        </Link>
        <nav className="hidden gap-6 text-sm md:flex">
          <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
            How It Works
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/demo" className="text-muted-foreground hover:text-foreground">
            Demo / Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/demo"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Book Demo
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Built for service businesses
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Recover revenue from every missed call.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Revenue Brain helps animal hospitals, dental offices, med spas, and similar teams
            capture missed-call demand, follow up instantly, and convert more leads into
            appointments.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/demo"
              className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Book a Demo
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-md border px-6 py-3 font-medium hover:bg-muted"
            >
              See How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { label: "Recovered this month", value: "$18,430" },
              { label: "Missed calls", value: "214" },
              { label: "Leads engaged", value: "162" },
              { label: "Bookings", value: "49" },
              { label: "Response rate", value: "76%" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-muted p-4 text-center">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="border-y bg-muted/40 py-6">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Trusted by modern service teams
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
            {["Northside Dental", "Paws & Care Animal Hospital", "Luma Med Spa", "Oakridge Family Clinic"].map(
              (name) => (
                <span key={name}>{name}</span>
              )
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                icon: PhoneMissed,
                title: "Missed calls become leads",
                description:
                  "Automatically capture inbound missed calls and create lead records in seconds.",
              },
              {
                icon: MessageSquare,
                title: "Automated SMS follow-up",
                description:
                  "Send immediate, personalized text responses so prospects stay engaged.",
              },
              {
                icon: CalendarCheck,
                title: "Appointment recovery",
                description:
                  "Turn abandoned calls into booked appointments with real-time inbox workflows.",
              },
              {
                icon: TrendingUp,
                title: "ROI tracking",
                description:
                  "Track recovered bookings and estimated revenue by location and campaign.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t bg-muted/40 py-16">
          <div className="mx-auto grid max-w-4xl gap-6 px-6 md:grid-cols-2">
            {[
              {
                quote:
                  "Revenue Brain helped us recover patients we used to lose after-hours. We can tie real bookings directly to missed calls.",
                author: "Practice Manager, Multi-location dental group",
              },
              {
                quote:
                  "The SMS inbox is simple for our team, and the automated first reply keeps leads warm instantly.",
                author: "Owner, Boutique med spa",
              },
            ].map(({ quote, author }) => (
              <blockquote
                key={author}
                className="rounded-lg border bg-background p-6"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-4 text-xs font-medium">— {author}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl px-6 py-20">
          <h2 className="mb-8 text-center text-2xl font-bold">FAQ</h2>
          <div className="flex flex-col gap-6">
            {[
              {
                q: "How fast does follow-up SMS send after a missed call?",
                a: "Typically within seconds, based on your configured timing rules in settings.",
              },
              {
                q: "Can my staff take over conversations manually?",
                a: "Yes. Any authorized user can switch from AI-handled to human-handled at any time.",
              },
              {
                q: "Do you support multiple business locations?",
                a: "Yes. Revenue Brain is multi-tenant and designed for single- and multi-location operators.",
              },
              {
                q: "How is recovered revenue calculated?",
                a: "Recovered bookings are tracked and multiplied by estimated booking value to generate ROI visibility.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b pb-6">
                <p className="font-medium">{q}</p>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-primary py-16 text-center text-primary-foreground">
          <h2 className="mb-3 text-2xl font-bold">Stop losing high-intent callers.</h2>
          <p className="mb-6 text-primary-foreground/80">
            See how much revenue your team can recover in the next 30 days with Revenue Brain.
          </p>
          <Link
            href="/demo"
            className="rounded-md bg-background px-6 py-3 font-medium text-foreground hover:bg-background/90"
          >
            Schedule Your Demo
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t px-6 py-6 text-xs text-muted-foreground">
        <p>Revenue Brain is a customer communication software platform operated by Arturo Garrido.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  )
}
