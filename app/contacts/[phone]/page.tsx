"use client"

import { use, useState, useRef, useEffect } from "react"
import { useQuery, useAction, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, Phone, CheckCircle, RotateCcw, Send } from "lucide-react"
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

export default function ContactDetailPage({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = use(params)
  const phoneNumber = decodeURIComponent(phone)
  const router = useRouter()
  const [tab, setTab] = useState<"conversation" | "timeline">("conversation")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const contact = useQuery(api.contacts.getByPhonePublic, { phoneNumber })
  const calls = useQuery(api.calls.getCallsByPhone, { phoneNumber })
  const leads = useQuery(api.leads.getLeadsByPhone, { phoneNumber })
  const messages = useQuery(api.messages.getByPhone, { phoneNumber })
  const toggleHandled = useMutation(api.calls.toggleHandled)
  const sendSms = useAction(api.twilio.sendManualSms)

  const name = contact?.name ?? "Unknown"
  const initials = name !== "Unknown"
    ? name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  // Scroll to bottom of conversation when messages load or new message arrives
  useEffect(() => {
    if (tab === "conversation") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, tab])

  async function handleSend() {
    if (!message.trim()) return
    setSending(true); setSendError(null)
    try {
      await sendSms({ to: phoneNumber, body: message.trim() })
      setMessage("")
    } catch (e: any) {
      setSendError(e.message ?? "Failed to send")
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend()
  }

  // Timeline: merge calls + leads sorted by time
  const timeline = [
    ...(calls ?? []).map((c) => ({ type: "call" as const, timestamp: c.timestamp, data: c })),
    ...(leads ?? []).map((l) => ({ type: "sms" as const, timestamp: l.timestamp, data: l })),
  ].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <AppShell title="Contact">
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
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
          <button
            onClick={() => setTab("conversation")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${tab === "conversation" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Conversation
          </button>
          <button
            onClick={() => setTab("timeline")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${tab === "timeline" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Activity
          </button>
        </div>

        {/* Conversation tab */}
        {tab === "conversation" && (
          <Card className="flex flex-col">
            <CardContent className="flex flex-col gap-0 p-0">
              {/* Messages area */}
              <div className="flex flex-col gap-2 p-4 min-h-[300px] max-h-[480px] overflow-y-auto">
                {messages === undefined ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Loading…</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">No messages yet. Send one below.</p>
                ) : (
                  messages.map((msg) => {
                    const isOutbound = msg.direction === "outbound"
                    return (
                      <div key={msg._id} className={`flex flex-col gap-1 ${isOutbound ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          isOutbound
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}>
                          {msg.body}
                        </div>
                        <p className="text-xs text-muted-foreground px-1">
                          {isOutbound ? (msg.sentBy === "auto" ? "Auto-sent" : "You") : name} · {formatRelativeTime(msg.timestamp)}
                        </p>
                      </div>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Compose area */}
              <div className="p-3 flex flex-col gap-2">
                {sendError && <p className="text-xs text-destructive">{sendError}</p>}
                <div className="flex gap-2 items-end">
                  <Textarea
                    placeholder="Type a message… (Cmd+Enter to send)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[72px] resize-none flex-1"
                    maxLength={160}
                    disabled={sending}
                  />
                  <Button size="sm" onClick={handleSend} disabled={sending || !message.trim()} className="mb-0.5">
                    <Send className="size-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{message.length}/160</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity tab */}
        {tab === "timeline" && (
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
                              {call.smsBody && <p className="mt-0.5 text-xs text-muted-foreground">Auto-SMS sent: "{call.smsBody}"</p>}
                              {call.summary && <p className="mt-0.5 text-xs text-muted-foreground">Summary: {call.summary}</p>}
                              <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(call.timestamp)}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="shrink-0 text-xs" onClick={() => toggleHandled({ callId: call._id as Id<"calls"> })}>
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
        )}
      </div>
    </AppShell>
  )
}
