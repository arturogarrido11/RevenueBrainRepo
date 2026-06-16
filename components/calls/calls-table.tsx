"use client"

import { useState } from "react"
import { MoreHorizontal, MessageSquare, User, CheckCircle, ChevronLeft, ChevronRight, X, Send } from "lucide-react"
import { useQuery, useAction, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

type CallStatus = "missed" | "responded" | "pending" | "ai_recorded"
interface CallsTableProps { search?: string; status?: string; dateRange?: string }
interface SmsModalProps { phoneNumber: string; callerName?: string; onClose: () => void }

function SmsModal({ phoneNumber, callerName, onClose }: SmsModalProps) {
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
            <p className="text-xs text-muted-foreground">To: {callerName ? `${callerName} · ` : ""}{phoneNumber}</p>
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

function StatusBadge({ status }: { status: CallStatus }) {
  if (status === "missed") return <Badge variant="destructive">Missed</Badge>
  if (status === "responded") return <Badge variant="default">Responded</Badge>
  if (status === "ai_recorded") return <Badge variant="outline">AI Recorded</Badge>
  return <Badge variant="secondary">Pending</Badge>
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp; const diffMins = Math.floor(diffMs / 60000); const diffHours = Math.floor(diffMins / 60); const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return "just now"; if (diffMins < 60) return `${diffMins}m ago`; if (diffHours < 24) return `${diffHours}h ago`; if (diffDays === 1) return "yesterday"; return `${diffDays}d ago`
}

function formatResponseTime(seconds?: number): string {
  if (seconds == null) return "—"; if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60); const secs = seconds % 60; return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`
}

export function CallsTable({ search = "", status = "all", dateRange = "all" }: CallsTableProps) {
  const router = useRouter()
  const [smsTarget, setSmsTarget] = useState<{ phoneNumber: string; callerName?: string } | null>(null)
  const toggleHandled = useMutation(api.calls.toggleHandled)
  const calls = useQuery(api.calls.listFiltered, {
    search: search || undefined,
    status: (status !== "all" ? status : undefined) as CallStatus | undefined,
    dateRange: (dateRange as any) === "all" ? undefined : dateRange as any,
  })

  return (
    <>
      {smsTarget && <SmsModal phoneNumber={smsTarget.phoneNumber} callerName={smsTarget.callerName} onClose={() => setSmsTarget(null)} />}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Caller</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Response Time</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {calls === undefined ? <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading calls…</td></tr>
              : calls.length === 0 ? <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">No calls match your filters.</td></tr>
              : calls.map((call) => (
                <tr key={call._id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-3 font-medium">{call.callerName ?? <span className="text-muted-foreground">Unknown</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{call.phoneNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(call.timestamp)}</td>
                  <td className="px-4 py-3"><StatusBadge status={call.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{call.responseChannel === "sms" ? <Badge variant="outline">SMS</Badge> : call.responseChannel === "email" ? <Badge variant="outline">Email</Badge> : <span className="text-xs">—</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{formatResponseTime(call.responseTime)}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSmsTarget({ phoneNumber: call.phoneNumber, callerName: call.callerName })}>
                          <MessageSquare className="size-4" />Send SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/contacts?phone=${encodeURIComponent(call.phoneNumber)}`)}>
                          <User className="size-4" />View Contact
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleHandled({ callId: call._id as Id<"calls"> })}>
                          <CheckCircle className="size-4" />{call.status === "responded" ? "Unmark Handled" : "Mark as Handled"}
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
          <p className="text-xs text-muted-foreground">{calls ? `Showing ${calls.length} result${calls.length === 1 ? "" : "s"}` : "Loading..."}</p>
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
