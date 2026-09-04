"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bot, Phone, Calendar, Clock, AlertCircle, Plus, Trash2 } from "lucide-react"

type TriggerMode = "always_on" | "missed_only" | "after_hours"
type SchedulingMode = "capture_only" | "live_book"
type CalendarProvider = "calendly" | "cal_com" | "google_calendar" | "none"

const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
]

export default function ReceptionistPage() {
  const config = useQuery(api.receptionist_config.get)
  const setEnabled = useMutation(api.receptionist_config.setEnabled)
  const upsert = useMutation(api.receptionist_config.upsert)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state (initialised from config or defaults)
  const [triggerMode, setTriggerMode] = useState<TriggerMode>("missed_only")
  const [personaName, setPersonaName] = useState("Alex")
  const [personaInstructions, setPersonaInstructions] = useState("")
  const [greetingMessage, setGreetingMessage] = useState("")
  const [schedulingMode, setSchedulingMode] = useState<SchedulingMode>("capture_only")
  const [calendarProvider, setCalendarProvider] = useState<CalendarProvider>("none")
  const [calendarApiKey, setCalendarApiKey] = useState("")
  const [calendarEventTypeId, setCalendarEventTypeId] = useState("")
  const [businessHoursTimezone, setBusinessHoursTimezone] = useState("America/New_York")
  const [businessHoursStart, setBusinessHoursStart] = useState("09:00")
  const [businessHoursEnd, setBusinessHoursEnd] = useState("17:00")
  const [businessDays, setBusinessDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [forwardToNumber, setForwardToNumber] = useState("")
  const [forwardRingTimeoutSec, setForwardRingTimeoutSec] = useState(25)
  const [escalationNumber, setEscalationNumber] = useState("")
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([])
  const [enabled, setEnabledState] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Initialize form from fetched config
  if (config && !initialized) {
    setTriggerMode((config.triggerMode as TriggerMode) ?? "missed_only")
    setPersonaName(config.personaName ?? "Alex")
    setPersonaInstructions(config.personaInstructions ?? "")
    setGreetingMessage(config.greetingMessage ?? "")
    setSchedulingMode((config.schedulingMode as SchedulingMode) ?? "capture_only")
    setCalendarProvider((config.calendarProvider as CalendarProvider) ?? "none")
    setCalendarApiKey(config.calendarApiKey ?? "")
    setCalendarEventTypeId(config.calendarEventTypeId ?? "")
    setBusinessHoursTimezone(config.businessHoursTimezone ?? "America/New_York")
    setBusinessHoursStart(config.businessHoursStart ?? "09:00")
    setBusinessHoursEnd(config.businessHoursEnd ?? "17:00")
    setBusinessDays(config.businessDays ?? [1, 2, 3, 4, 5])
    setForwardToNumber(config.forwardToNumber ?? "")
    setForwardRingTimeoutSec(config.forwardRingTimeoutSec ?? 25)
    setEscalationNumber(config.escalationNumber ?? "")
    setFaqs(config.faqs ?? [])
    setEnabledState(config.enabled ?? false)
    setInitialized(true)
  }

  const handleToggleEnabled = async () => {
    const next = !enabled
    setEnabledState(next)
    await setEnabled({ enabled: next })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await upsert({
        triggerMode,
        personaName,
        personaInstructions: personaInstructions || undefined,
        greetingMessage: greetingMessage || undefined,
        faqs: faqs.length > 0 ? faqs : undefined,
        schedulingMode,
        calendarProvider: calendarProvider === "none" ? "none" : calendarProvider,
        calendarApiKey: calendarApiKey || undefined,
        calendarEventTypeId: calendarEventTypeId || undefined,
        businessHoursTimezone: businessHoursTimezone || undefined,
        businessHoursStart: businessHoursStart || undefined,
        businessHoursEnd: businessHoursEnd || undefined,
        businessDays: businessDays.length > 0 ? businessDays : undefined,
        forwardToNumber: forwardToNumber || undefined,
        forwardRingTimeoutSec: forwardRingTimeoutSec || undefined,
        escalationNumber: escalationNumber || undefined,
        enabled,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }])
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i))
  const updateFaq = (i: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs]
    updated[i] = { ...updated[i], [field]: value }
    setFaqs(updated)
  }
  const toggleDay = (day: number) => {
    setBusinessDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Receptionist</h1>
        <p className="text-muted-foreground mt-1">
          Configure your AI voice assistant to answer inbound calls.
        </p>
      </div>

      {/* Status toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">AI Receptionist Status</CardTitle>
                <CardDescription>Enable to have AI answer your calls.</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={enabled ? "default" : "secondary"}>
                {enabled ? "Active" : "Inactive"}
              </Badge>
              <Switch checked={enabled} onCheckedChange={handleToggleEnabled} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Trigger mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="size-4" /> Trigger Mode
          </CardTitle>
          <CardDescription>When should the AI receptionist answer?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={triggerMode} onValueChange={(v) => setTriggerMode(v as TriggerMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="missed_only">Missed Only — ring me first, AI takes over if no answer</SelectItem>
              <SelectItem value="always_on">Always On — AI answers every call immediately</SelectItem>
              <SelectItem value="after_hours">After Hours — AI answers outside business hours only</SelectItem>
            </SelectContent>
          </Select>

          {(triggerMode === "missed_only" || triggerMode === "after_hours") && (
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label>Forward to number (E.164, e.g. +15551234567)</Label>
                <Input
                  placeholder="+15551234567"
                  value={forwardToNumber}
                  onChange={(e) => setForwardToNumber(e.target.value)}
                />
              </div>
              {triggerMode === "missed_only" && (
                <div className="space-y-1.5">
                  <Label>Ring timeout (seconds before AI picks up)</Label>
                  <Input
                    type="number"
                    min={10}
                    max={60}
                    value={forwardRingTimeoutSec}
                    onChange={(e) => setForwardRingTimeoutSec(parseInt(e.target.value, 10))}
                  />
                </div>
              )}
            </div>
          )}

          {triggerMode === "after_hours" && (
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="size-3.5" /> Business Hours
              </p>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select value={businessHoursTimezone} onValueChange={setBusinessHoursTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                    <SelectItem value="America/Phoenix">Arizona (MT, no DST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Open time</Label>
                  <Input type="time" value={businessHoursStart} onChange={(e) => setBusinessHoursStart(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Close time</Label>
                  <Input type="time" value={businessHoursEnd} onChange={(e) => setBusinessHoursEnd(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Business days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      className={`px-3 py-1 rounded-md text-sm border transition-colors ${businessDays.includes(d.value) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Persona */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="size-4" /> AI Persona
          </CardTitle>
          <CardDescription>Configure how your AI receptionist presents itself.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Receptionist name</Label>
            <Input placeholder="Alex" value={personaName} onChange={(e) => setPersonaName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Opening greeting (optional)</Label>
            <Input
              placeholder="Thank you for calling, this is Alex, how can I help you today?"
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Custom instructions (optional)</Label>
            <Textarea
              placeholder="Additional behavior instructions for the AI. E.g. 'Always ask for the caller's name first.'"
              rows={3}
              value={personaInstructions}
              onChange={(e) => setPersonaInstructions(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>FAQ answers</Label>
              <Button variant="outline" size="sm" onClick={addFaq}>
                <Plus className="size-3.5 mr-1" /> Add FAQ
              </Button>
            </div>
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-2 border rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" className="shrink-0" onClick={() => removeFaq(i)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Answer"
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4" /> Scheduling
          </CardTitle>
          <CardDescription>
            Should the AI book appointments in real time or just capture a preferred time?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={schedulingMode} onValueChange={(v) => setSchedulingMode(v as SchedulingMode)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="capture_only">Capture Only — log preferred time, team confirms later</SelectItem>
              <SelectItem value="live_book">Live Book — AI books directly in your calendar</SelectItem>
            </SelectContent>
          </Select>

          {schedulingMode === "live_book" && (
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-1.5">
                <Label>Calendar provider</Label>
                <Select value={calendarProvider} onValueChange={(v) => setCalendarProvider(v as CalendarProvider)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calendly">Calendly (requires paid plan)</SelectItem>
                    <SelectItem value="cal_com">Cal.com</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(calendarProvider === "calendly" || calendarProvider === "cal_com") && (
                <>
                  <div className="space-y-1.5">
                    <Label>
                      {calendarProvider === "calendly" ? "Calendly Personal Access Token" : "Cal.com API key"}
                    </Label>
                    <Input
                      type="password"
                      placeholder={calendarProvider === "calendly" ? "eyJhbGci..." : "cal_live_xxx"}
                      value={calendarApiKey}
                      onChange={(e) => setCalendarApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>
                      {calendarProvider === "calendly" ? "Calendly Event Type URI" : "Cal.com Event Type ID"}
                    </Label>
                    <Input
                      placeholder={calendarProvider === "calendly"
                        ? "https://api.calendly.com/event_types/AAAA..."
                        : "12345"}
                      value={calendarEventTypeId}
                      onChange={(e) => setCalendarEventTypeId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {calendarProvider === "cal_com"
                        ? "Found in your Cal.com event type URL."
                        : "The full event type URI from Calendly API."}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Escalation / Transfer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Escalation Number</CardTitle>
          <CardDescription>
            The phone number the AI will transfer callers to when they ask for a human.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="+15551234567"
            value={escalationNumber}
            onChange={(e) => setEscalationNumber(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Deployment note */}
      <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
        <AlertCircle className="size-4 mt-0.5 shrink-0 text-amber-600" />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <p className="font-medium mb-1">Twilio configuration required</p>
          <p>Set your Twilio number&apos;s Voice Webhook to your Convex URL: <code className="font-mono text-xs">/voice</code>. Make sure <code className="font-mono text-xs">BRIDGE_WSS_URL</code> is set in your Convex environment variables.</p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
        {saved && <span className="text-sm text-green-600">Settings saved!</span>}
      </div>
    </div>
  )
}
