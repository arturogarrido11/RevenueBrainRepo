"use client"

import { use, useState } from "react"
import { useQuery, useAction, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, Phone, CheckCircle, RotateCcw, Send, X } from "lucide-react"
import { useRouter } from "next/navigation"

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "yesterday"
  return new Date(timestamp).toLocaleDateString()
}

function SmsModal({ phoneNumber, onClose }: { phoneNumber: string; onClose: () => void }) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sendSms = useAction(api.twilio.sendManualSms)

  async function handleSend() {
    if (!message.trim()) return
    setSending(true); setError(null)
    try {
      await sendSms({ to: phoneNumber, body: message.trim() })
      setSent(true)
      setTimeout(onClose, 1200)
    } catch (e: any) { setError(e.message ?? "Failed to send") }
    finally { setSending(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Send SMS</h2>
            <p className="text-xs text-muted-foreground">To: {phoneNumber}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}><X className="size-4" /></Button>
        </div>
        <Textarea placeholder="Type your message…" value={message} onChange={(e) => setMessage(e.target.value)} className="mb-1 min-h-[100px] resize-none" maxLength={160} disabled={sending || sent} autoFocus />
        <p className="mb-4 text-xs text-muted-foreground">{message.length}/160 characters</p>
        {error && <p className="mb-3 text-xs text-destructive">{error}</p>}
        {sent && <p className="mb-3 text-xs text-emerald-600">Message sent!</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={sending}>Cancel</Button>
          <Button size="sm" onClick={handleSend} disabled={sending || sent || !message.trim()}>
            <Send className="size-3.5" />{sending ? "Sending…" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ContactDetailPage({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = use(params)
  const phoneNumber = decodeURIComponent(phone)
  const router = useRouter()
  const [showSms, setShowSms] = useState(false)

  const contact = useQuery(api.contacts.getByPhonePublic, { phoneNumber })
  const calls = useQuery(api.calls.getCallsByPhone, { phoneNumber })
  const leads = useQuery(api.leads.getLeadsByPhone, { phoneNumber })
  const toggleHandled = useMutation(api.calls.toggleHandled)

  const name = contact?.name ?? "Unknown"
  const initials = name !== "Unknown" ? name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : "?"

  // Merge calls and leads into a unified timeline
  const timeline = [
    ...(calls ?? []).map((c) => ({ type: "call" as const, timestamp: c.timestamp, data: c })),
    ...(leads ?? []).map((l) => ({ type: "sms" as const, timestamp: l.timestamp, data: l })),
  ].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <AppShell title="Contact">
      {showSms && <SmsModal phoneNumber={phoneNumber} onClose={() => setShowSms(false)} />}
      <div className="flex flex-col gap-6 max-w-2xl">

        {/* Back */}
        <Button variant="ghost" size="sm" className="w-fit -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />Back
        </Button>

        {/* Contact header */}
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="text-sm text-muted-foreground tabular-nums">{phoneNumber}</p>
              {contact && (
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{contact.totalCalls} call{contact.totalCalls !== 1 ? "s" : ""}</span>
                  <span>·</span>
                  <span>{Math.round(contact.responseRate * 100)}% response rate</span>
                  {contact.optedOut && <><span>·</span><Badge variant="destructive" className="text-xs">Opted Out</Badge></>}
                </div>
              )}
            </div>
            <Button size="sm" onClick={() => setShowSms(true)}>
              <MessageSquare className="size-4" />Send SMS
            </Button>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {timeline.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {timeline.map((item) => {
                  if (item.type === "call") {
                    const call = item.data
                    const isHandled = call.status === "responded"
                    return (
                      <li key={call._id} className="flex items-start justify-between gap-4 px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Phone className="size-3.5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">Missed call</p>
                              {call.status === "missed" && <Badge variant="destructive" className="text-xs">Missed</Badge>}
                              {call.status === "responded" && <Badge variant="default" className="text-xs">Handled</Badge>}
                              {call.status === "ai_recorded" && <Badge variant="outline" className="text-xs">AI Recorded</Badge>}
                            </div>
                            {call.smsBody && <p className="mt-0.5 text-xs text-muted-foreground">Auto-SMS: {call.smsBody}</p>}
                            {call.summary && <p className="mt-0.5 text-xs text-muted-foreground">Summary: {call.summary}</p>}
                            <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(call.timestamp)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 text-xs"
                          onClick={() => toggleHandled({ callId: call._id as Id<"calls"> })}
                        >
                          {isHandled ? <><RotateCcw className="size-3.5" />Unmark</> : <><CheckCircle className="size-3.5" />Mark Handled</>}
                        </Button>
                      </li>
                    )
                  } else {
                    const lead = item.data
                    return (
                      <li key={lead._id} className="flex items-start gap-3 px-6 py-4">
                        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <MessageSquare className="size-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Customer replied</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">{lead.messageBody}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(lead.timestamp)}</p>
                        </div>
                      </li>
                    )
                  }
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
