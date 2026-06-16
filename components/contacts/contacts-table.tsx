"use client"

import { useState } from "react"
import { MoreHorizontal, MessageSquare, History, Ban, ChevronLeft, ChevronRight, X, Send } from "lucide-react"
import { useQuery, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

type ContactStatus = "new" | "active" | "lapsed"
type ResponseChannel = "sms" | "email" | "none" | undefined

function ContactAvatar({ name }: { name: string | undefined }) {
  const initials = name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "?"
  return <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{initials}</div>
}

function StatusBadge({ status }: { status: ContactStatus }) {
  if (status === "active") return <Badge variant="default">Active</Badge>
  if (status === "lapsed") return <Badge variant="destructive">Lapsed</Badge>
  return <Badge variant="outline">New</Badge>
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp; const diffMins = Math.floor(diffMs / 60000); const diffHours = Math.floor(diffMins / 60); const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return "just now"; if (diffMins < 60) return `${diffMins}m ago`; if (diffHours < 24) return `${diffHours}h ago`; if (diffDays === 1) return "yesterday"; return `${diffDays}d ago`
}

interface SmsModalProps { phoneNumber: string; name?: string; onClose: () => void }

function SmsModal({ phoneNumber, name, onClose }: SmsModalProps) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sendSms = useAction(api.twilio.sendManualSms)

  async function handleSend() {
    if (!message.trim()) return
    setSending(true); setError(null)
    try { await sendSms({ to: phoneNumber, body: message.trim() }); setSent(true); setTimeout(onClose, 1200) }
    catch (e: any) { setError(e.message ?? "Failed to send") }
    finally { setSending(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Send SMS</h2>
            <p className="text-xs text-muted-foreground">To: {name ? `${name} · ` : ""}{phoneNumber}</p>
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

export function ContactsTable() {
  const router = useRouter()
  const contacts = useQuery(api.contacts.list)
  const [smsTarget, setSmsTarget] = useState<{ phoneNumber: string; name?: string } | null>(null)

  return (
    <>
      {smsTarget && <SmsModal phoneNumber={smsTarget.phoneNumber} name={smsTarget.name} onClose={() => setSmsTarget(null)} />}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Total Calls</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Last Called</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Last Response</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Response Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {contacts === undefined ? <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading contacts…</td></tr>
              : contacts.length === 0 ? <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">No contacts yet.</td></tr>
              : contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                  onClick={() => router.push(`/contacts/${encodeURIComponent(contact.phoneNumber)}`)}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <ContactAvatar name={contact.name} />
                      <div>
                        <p className="font-medium">{contact.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{contact.phoneNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{contact.totalCalls}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(contact.lastCalledAt)}</td>
                  <td className="px-4 py-3">{contact.lastResponseChannel === "sms" ? <span className="text-xs">SMS</span> : contact.lastResponseChannel === "email" ? <span className="text-xs">Email</span> : <span className="text-xs text-muted-foreground">None</span>}</td>
                  <td className="px-4 py-3 tabular-nums">{Math.round(contact.responseRate * 100)}%</td>
                  <td className="px-4 py-3"><StatusBadge status={contact.status} /></td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/contacts/${encodeURIComponent(contact.phoneNumber)}`)}>
                          <History className="size-4" />View History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSmsTarget({ phoneNumber: contact.phoneNumber, name: contact.name })}>
                          <MessageSquare className="size-4" />Send SMS
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <Ban className="size-4" />Block Number
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">{contacts ? `Showing ${contacts.length} contact${contacts.length === 1 ? "" : "s"}` : "Loading..."}</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" disabled><ChevronLeft className="size-3.5" /></Button>
            <span className="px-2 text-xs text-muted-foreground">Page 1 of 1</span>
            <Button variant="outline" size="icon-sm" disabled><ChevronRight className="size-3.5" /></Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
