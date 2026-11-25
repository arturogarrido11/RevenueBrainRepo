"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useAction } from "convex/react"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChevronRight, ChevronLeft, Phone, Loader2, Plus, Trash2 } from "lucide-react"
import { CallForwardingInstructions } from "@/components/call-forwarding"

// ── Types ──────────────────────────────────────────────────────────────────

type Industry =
  | "dental" | "medical" | "legal" | "home_services" | "beauty_salon"
  | "fitness" | "veterinary" | "real_estate" | "consulting" | "other"

type DaySchedule = {
  open: boolean
  start: string
  end: string
}

type Service = {
  name: string
  price: string
  duration: string
}

type FAQ = {
  question: string
  answer: string
}

type WizardState = {
  // Step 1
  businessName: string
  industry: Industry | ""
  address: string
  website: string
  ownerPhone: string
  // Step 2
  timezone: string
  hours: Record<string, DaySchedule>
  // Step 3
  services: Service[]
  faqs: FAQ[]
  // Step 4
  schedulingMode: "capture_only" | "live_book"
  calendlyUrl: string
  // Step 5
  areaCode: string
  provisionedNumber: string
  // Step 6
  notificationEmail: string
  personaName: string
  greeting: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAY_INDICES = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "dental", label: "Dental" },
  { value: "medical", label: "Medical" },
  { value: "legal", label: "Legal" },
  { value: "home_services", label: "Home Services" },
  { value: "beauty_salon", label: "Beauty Salon" },
  { value: "fitness", label: "Fitness" },
  { value: "veterinary", label: "Veterinary" },
  { value: "real_estate", label: "Real Estate" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
]

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
]

const PRESET_FAQS = [
  { question: "Do you accept insurance?", answer: "" },
  { question: "What payment methods do you accept?", answer: "" },
  { question: "Is there parking available?", answer: "" },
  { question: "What is your cancellation policy?", answer: "" },
  { question: "Do you have an emergency line?", answer: "" },
]

const DEFAULT_HOURS: DaySchedule = { open: true, start: "09:00", end: "17:00" }
const DEFAULT_WEEKEND: DaySchedule = { open: false, start: "09:00", end: "17:00" }

function buildDefaultHours(): Record<string, DaySchedule> {
  return {
    Mon: { ...DEFAULT_HOURS },
    Tue: { ...DEFAULT_HOURS },
    Wed: { ...DEFAULT_HOURS },
    Thu: { ...DEFAULT_HOURS },
    Fri: { ...DEFAULT_HOURS },
    Sat: { ...DEFAULT_WEEKEND },
    Sun: { ...DEFAULT_WEEKEND },
  }
}

function buildDefaultState(email: string, businessName: string, ownerPhone?: string): WizardState {
  return {
    businessName,
    industry: "",
    address: "",
    website: "",
    ownerPhone: ownerPhone ?? "",
    timezone: "America/New_York",
    hours: buildDefaultHours(),
    services: [{ name: "", price: "", duration: "" }],
    faqs: [
      ...PRESET_FAQS.map((f) => ({ ...f })),
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
    schedulingMode: "capture_only",
    calendlyUrl: "",
    areaCode: ownerPhone?.replace(/\D/g, "").slice(1, 4) ?? "",
    provisionedNumber: "",
    notificationEmail: email,
    personaName: "Alex",
    greeting: "",
  }
}

function generateGreeting(state: WizardState): string {
  const name = state.personaName || "Alex"
  const biz = state.businessName || "our office"
  return `Hi, thanks for calling ${biz}! You've reached ${name}, the AI receptionist. How can I help you today?`
}

function generateSystemPrompt(state: WizardState): string {
  const openDays = DAYS.filter((d) => state.hours[d]?.open)
    .map((d) => `${d} ${state.hours[d].start}–${state.hours[d].end}`)
    .join(", ")

  const serviceLines = state.services
    .filter((s) => s.name.trim())
    .map((s) => {
      let line = `- ${s.name}`
      if (s.price) line += ` ($${s.price})`
      if (s.duration) line += ` — ${s.duration} min`
      return line
    })
    .join("\n")

  const faqLines = state.faqs
    .filter((f) => f.question && f.answer)
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n")

  const bookingInstr =
    state.schedulingMode === "live_book"
      ? `Offer to book an appointment via Calendly: ${state.calendlyUrl}`
      : "Capture the caller's name, phone number, and reason for calling so the team can follow up."

  return `You are ${state.personaName}, the AI receptionist for ${state.businessName}${state.industry ? ` (${state.industry})` : ""}.

Business hours: ${openDays || "Not set"}
Timezone: ${state.timezone}

Services offered:
${serviceLines || "Not specified"}

FAQs:
${faqLines || "None provided"}

Booking: ${bookingInstr}

Always be friendly, professional, and concise. If asked about something not covered here, politely say the team will follow up.`
}

// ── Step components ────────────────────────────────────────────────────────

function Step1({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Business Basics</h2>
        <p className="text-sm text-muted-foreground">Tell us about your business so we can configure your AI receptionist.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="businessName">Business name *</Label>
          <Input id="businessName" placeholder="Acme Dental" value={state.businessName}
            onChange={(e) => setState({ ...state, businessName: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="industry">Industry *</Label>
          <select
            id="industry"
            value={state.industry}
            onChange={(e) => setState({ ...state, industry: e.target.value as Industry })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select industry…</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ownerPhone">Your phone number *</Label>
          <Input id="ownerPhone" placeholder="+1 (305) 555-0100" value={state.ownerPhone}
            onChange={(e) => setState({ ...state, ownerPhone: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Business address <span className="text-muted-foreground">(optional)</span></Label>
          <Input id="address" placeholder="123 Main St, Miami, FL" value={state.address}
            onChange={(e) => setState({ ...state, address: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Website <span className="text-muted-foreground">(optional)</span></Label>
          <Input id="website" placeholder="https://yoursite.com" value={state.website}
            onChange={(e) => setState({ ...state, website: e.target.value })} />
        </div>
      </div>
    </div>
  )
}

function Step2({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Business Hours</h2>
        <p className="text-sm text-muted-foreground">Your AI receptionist will use these hours to know when you're available.</p>
      </div>
      <div className="space-y-1.5">
        <Label>Timezone</Label>
        <select
          value={state.timezone}
          onChange={(e) => setState({ ...state, timezone: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz.replace("America/", "").replace("Pacific/", "Pacific/").replace("_", " ")}</option>
          ))}
        </select>
      </div>
      <div className="space-y-3">
        {DAYS.map((day) => {
          const schedule = state.hours[day]
          return (
            <div key={day} className="flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm w-10">{day}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{schedule.open ? "Open" : "Closed"}</span>
                  <Switch
                    checked={schedule.open}
                    onCheckedChange={(open) =>
                      setState({ ...state, hours: { ...state.hours, [day]: { ...schedule, open } } })
                    }
                  />
                </div>
              </div>
              {schedule.open && (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="time"
                    value={schedule.start}
                    onChange={(e) =>
                      setState({ ...state, hours: { ...state.hours, [day]: { ...schedule, start: e.target.value } } })
                    }
                    className="flex-1 h-9 rounded-md border border-input bg-background px-2 text-sm"
                  />
                  <span className="text-muted-foreground text-sm">to</span>
                  <input
                    type="time"
                    value={schedule.end}
                    onChange={(e) =>
                      setState({ ...state, hours: { ...state.hours, [day]: { ...schedule, end: e.target.value } } })
                    }
                    className="flex-1 h-9 rounded-md border border-input bg-background px-2 text-sm"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Step3({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const services = state.services.length ? state.services : [{ name: "", price: "", duration: "" }]
  const faqs = state.faqs

  const updateService = (i: number, field: keyof Service, value: string) => {
    const updated = [...services]
    updated[i] = { ...updated[i], [field]: value }
    setState({ ...state, services: updated })
  }

  const addService = () => {
    if (services.length < 6) {
      setState({ ...state, services: [...services, { name: "", price: "", duration: "" }] })
    }
  }

  const removeService = (i: number) => {
    setState({ ...state, services: services.filter((_, idx) => idx !== i) })
  }

  const updateFaq = (i: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs]
    updated[i] = { ...updated[i], [field]: value }
    setState({ ...state, faqs: updated })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Services & FAQs</h2>
        <p className="text-sm text-muted-foreground">Your AI receptionist will use this info to answer callers' questions.</p>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Services <span className="text-muted-foreground font-normal text-sm">(up to 6)</span></Label>
          {services.length < 6 && (
            <Button type="button" variant="ghost" size="sm" onClick={addService}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          )}
        </div>
        {services.map((svc, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Service name (e.g. Teeth Cleaning)"
                value={svc.name}
                onChange={(e) => updateService(i, "name", e.target.value)}
                className="flex-1"
              />
              {services.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeService(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input placeholder="Price (e.g. 150)" value={svc.price}
                  onChange={(e) => updateService(i, "price", e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Price (optional)</p>
              </div>
              <div>
                <Input placeholder="60" value={svc.duration}
                  onChange={(e) => updateService(i, "duration", e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Duration in minutes (optional)</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="space-y-3">
        <Label className="text-base font-medium">FAQs</Label>
        <p className="text-xs text-muted-foreground">Fill in answers to common questions. Leave blank to skip.</p>
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            {i < 5 ? (
              <p className="text-sm font-medium text-muted-foreground">{faq.question}</p>
            ) : (
              <Input
                placeholder={`Custom question ${i - 4}`}
                value={faq.question}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
              />
            )}
            <Textarea
              placeholder="Your answer…"
              value={faq.answer}
              onChange={(e) => updateFaq(i, "answer", e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function Step4({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Booking Preference</h2>
        <p className="text-sm text-muted-foreground">How should your AI handle callers who want to book?</p>
      </div>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setState({ ...state, schedulingMode: "capture_only" })}
          className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
            state.schedulingMode === "capture_only"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/40"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              state.schedulingMode === "capture_only" ? "border-primary" : "border-muted-foreground"
            }`}>
              {state.schedulingMode === "capture_only" && <div className="h-2 w-2 rounded-full bg-primary" />}
            </div>
            <div>
              <p className="font-medium">Capture lead + notify me</p>
              <p className="text-sm text-muted-foreground mt-0.5">AI collects caller info and you follow up. Best for most businesses.</p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setState({ ...state, schedulingMode: "live_book" })}
          className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
            state.schedulingMode === "live_book"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/40"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              state.schedulingMode === "live_book" ? "border-primary" : "border-muted-foreground"
            }`}>
              {state.schedulingMode === "live_book" && <div className="h-2 w-2 rounded-full bg-primary" />}
            </div>
            <div>
              <p className="font-medium">Auto-book via Calendly</p>
              <p className="text-sm text-muted-foreground mt-0.5">AI sends callers your Calendly link to book instantly.</p>
            </div>
          </div>
        </button>
      </div>

      {state.schedulingMode === "live_book" && (
        <div className="space-y-1.5">
          <Label htmlFor="calendlyUrl">Calendly URL *</Label>
          <Input
            id="calendlyUrl"
            placeholder="https://calendly.com/yourname/30min"
            value={state.calendlyUrl}
            onChange={(e) => setState({ ...state, calendlyUrl: e.target.value })}
          />
        </div>
      )}
    </div>
  )
}

function Step5({
  state,
  setState,
  businessId,
}: {
  state: WizardState
  setState: (s: WizardState) => void
  businessId: string | undefined
}) {
  const [provisioning, setProvisioning] = useState(false)
  const [error, setError] = useState("")
  const provisionNumber = useAction(api.businesses.provisionPhoneNumber)

  const handleProvision = async () => {
    if (!businessId) { setError("Business ID not found. Please refresh."); return }
    setProvisioning(true)
    setError("")
    try {
      const result = await provisionNumber({
        businessId: businessId as Parameters<typeof provisionNumber>[0]["businessId"],
        areaCode: state.areaCode || undefined,
      })
      setState({ ...state, provisionedNumber: result.phoneNumber })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setProvisioning(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Get Your AI Phone Number</h2>
        <p className="text-sm text-muted-foreground">We'll provision a local number your callers will reach. Forward your existing number to it.</p>
      </div>

      {!state.provisionedNumber ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="areaCode">Preferred area code</Label>
            <Input
              id="areaCode"
              placeholder="305"
              maxLength={3}
              value={state.areaCode}
              onChange={(e) => setState({ ...state, areaCode: e.target.value.replace(/\D/g, "") })}
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">We'll find the closest available number. Leave blank for any area code.</p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={handleProvision} disabled={provisioning} size="lg" className="w-full">
            {provisioning ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Provisioning…</>
            ) : (
              <><Phone className="h-4 w-4 mr-2" />Get My Number</>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">Your AI Phone Number</p>
            <p className="text-3xl font-bold tracking-wide text-primary">{state.provisionedNumber}</p>
            <Badge className="mt-2" variant="secondary">Active</Badge>
          </div>
          <CallForwardingInstructions number={state.provisionedNumber} />
        </div>
      )}
    </div>
  )
}

function Step6({
  state,
  setState,
}: {
  state: WizardState
  setState: (s: WizardState) => void
}) {
  // Auto-generate greeting when personaName or businessName changes
  useEffect(() => {
    if (!state.greeting) {
      setState({ ...state, greeting: generateGreeting(state) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.personaName, state.businessName])

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Notifications & AI Persona</h2>
        <p className="text-sm text-muted-foreground">Personalize your AI and set where you receive call alerts.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="notificationEmail">Notification email *</Label>
          <Input
            id="notificationEmail"
            type="email"
            placeholder="you@yourcompany.com"
            value={state.notificationEmail}
            onChange={(e) => setState({ ...state, notificationEmail: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">You'll receive a summary email after every AI call.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="personaName">AI name</Label>
          <Input
            id="personaName"
            placeholder="Alex"
            value={state.personaName}
            onChange={(e) => {
              const updated = { ...state, personaName: e.target.value }
              setState({ ...updated, greeting: generateGreeting(updated) })
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="greeting">Greeting message</Label>
          <Textarea
            id="greeting"
            value={state.greeting}
            onChange={(e) => setState({ ...state, greeting: e.target.value })}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">This is the first thing callers will hear. Auto-generated — feel free to edit.</p>
        </div>
      </div>
    </div>
  )
}

// ── Step validation ────────────────────────────────────────────────────────

function canAdvance(step: number, state: WizardState): boolean {
  if (step === 1) return !!(state.businessName.trim() && state.industry && state.ownerPhone.trim())
  if (step === 2) return true
  if (step === 3) return true
  if (step === 4) return state.schedulingMode === "capture_only" || !!state.calendlyUrl.trim()
  if (step === 5) return !!state.provisionedNumber
  if (step === 6) return !!(state.notificationEmail.trim() && state.personaName.trim())
  return true
}

// ── Main wizard component ──────────────────────────────────────────────────

const STEP_LABELS = [
  "Business",
  "Hours",
  "Services",
  "Booking",
  "Phone",
  "Finish",
]

export default function OnboardingPage() {
  const router = useRouter()
  const business = useQuery(api.businesses.getMyBusiness)
  const updateBusiness = useMutation(api.businesses.update)
  const completeOnboarding = useMutation(api.businesses.completeOnboarding)
  const upsertConfig = useMutation(api.receptionist_config.upsertForBusiness)

  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState | null>(null)
  const [saving, setSaving] = useState(false)

  // Redirect if already onboarded
  useEffect(() => {
    if (business?.onboardingCompleted) {
      router.replace("/dashboard?onboarded=1")
    }
  }, [business?.onboardingCompleted, router])

  // Initialize wizard state from business data
  useEffect(() => {
    if (business && !state) {
      setStep(business.onboardingStep ?? 1)
      setState(buildDefaultState(business.ownerEmail, business.businessName, business.ownerPhone))
    }
  }, [business, state])

  if (business === undefined || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalSteps = 6
  const progress = ((step - 1) / (totalSteps - 1)) * 100

  const persistProgress = async (currentStep: number) => {
    try {
      await updateBusiness({ onboardingStep: currentStep })
    } catch {
      // non-critical
    }
  }

  const handleNext = async () => {
    if (!canAdvance(step, state)) return

    setSaving(true)
    try {
      // Persist step-specific data to Convex
      if (step === 1) {
        await updateBusiness({
          businessName: state.businessName,
          industry: state.industry || undefined,
          address: state.address || undefined,
          website: state.website || undefined,
          ownerPhone: state.ownerPhone || undefined,
        })
      } else if (step === 2) {
        const openDays = DAYS.filter((d) => state.hours[d]?.open)
        const businessDays = openDays.map((d) => DAY_INDICES[d as keyof typeof DAY_INDICES])
        const openHours = DAYS.filter((d) => state.hours[d]?.open)
        // Use the first open day's hours as the "global" window (legacy compat)
        const firstOpen = openHours[0]
        const perDay = DAYS.map((d) => ({
          day: DAY_INDICES[d as keyof typeof DAY_INDICES],
          open: state.hours[d]?.open ?? false,
          start: state.hours[d]?.start,
          end: state.hours[d]?.end,
        }))
        await upsertConfig({
          businessHoursTimezone: state.timezone,
          businessHoursStart: firstOpen ? state.hours[firstOpen].start : "09:00",
          businessHoursEnd: firstOpen ? state.hours[firstOpen].end : "17:00",
          businessDays,
          businessHoursPerDay: perDay,
        })
        await updateBusiness({ timezone: state.timezone })
      } else if (step === 3) {
        const services = state.services
          .filter((s) => s.name.trim())
          .map((s) => ({
            name: s.name,
            price: s.price || undefined,
            duration: s.duration ? Number(s.duration) : undefined,
          }))
        const faqs = state.faqs
          .filter((f) => f.question.trim() && f.answer.trim())
          .map((f) => ({ question: f.question, answer: f.answer }))
        await upsertConfig({ services, faqs })
      } else if (step === 4) {
        await upsertConfig({
          schedulingMode: state.schedulingMode,
          calendarProvider: state.schedulingMode === "live_book" ? "calendly" : undefined,
          calendarApiKey: state.schedulingMode === "live_book" ? state.calendlyUrl : undefined,
        })
      }

      await persistProgress(step + 1)
      setStep((s) => s + 1)
    } catch (err) {
      console.error("Failed to save step", err)
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => setStep((s) => Math.max(1, s - 1))

  const handleFinish = async () => {
    if (!canAdvance(6, state)) return
    setSaving(true)
    try {
      const greeting = state.greeting || generateGreeting(state)
      const personaInstructions = generateSystemPrompt(state)

      await upsertConfig({
        personaName: state.personaName,
        personaInstructions,
        greetingMessage: greeting,
        triggerMode: "missed_only",
        enabled: true,
      })
      await completeOnboarding({ notificationEmail: state.notificationEmail })
      router.push("/dashboard?onboarded=1")
    } catch (err) {
      console.error("Failed to complete onboarding", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-900 px-4 py-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-primary-foreground text-xs font-bold">RB</span>
        </div>
        <span className="font-semibold text-sm">Revenue Brain</span>
        <Badge variant="outline" className="ml-auto text-xs">14-day free trial</Badge>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-900 border-b px-4 py-3">
        <div className="max-w-lg mx-auto space-y-2">
          <div className="flex justify-between">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i + 1 < step
                    ? "bg-primary text-primary-foreground"
                    : i + 1 === step
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1 < step ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] hidden sm:block ${i + 1 === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-lg mx-auto">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              {step === 1 && <Step1 state={state} setState={setState} />}
              {step === 2 && <Step2 state={state} setState={setState} />}
              {step === 3 && <Step3 state={state} setState={setState} />}
              {step === 4 && <Step4 state={state} setState={setState} />}
              {step === 5 && <Step5 state={state} setState={setState} businessId={business?._id as string | undefined} />}
              {step === 6 && <Step6 state={state} setState={setState} />}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 1 || saving}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>

                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canAdvance(step, state) || saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {step === 5 && !state.provisionedNumber ? "Skip for now" : "Continue"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinish}
                    disabled={!canAdvance(6, state) || saving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Finish Setup
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
