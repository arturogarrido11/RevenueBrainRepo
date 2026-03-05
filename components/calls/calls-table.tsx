"use client"

import { MoreHorizontal, MessageSquare, Mail, User, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type CallStatus = "missed" | "responded" | "pending"
type ResponseChannel = "sms" | "email" | "none"

function StatusBadge({ status }: { status: CallStatus }) {
  if (status === "missed") return <Badge variant="destructive">Missed</Badge>
  if (status === "responded") return <Badge variant="default">Responded</Badge>
  return <Badge variant="secondary">Pending</Badge>
}

function ChannelBadge({ channel }: { channel: ResponseChannel }) {
  if (channel === "sms") return <Badge variant="outline">SMS</Badge>
  if (channel === "email") return <Badge variant="outline">Email</Badge>
  return <span className="text-xs text-muted-foreground">—</span>
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "yesterday"
  return `${diffDays}d ago`
}

function formatResponseTime(seconds?: number): string {
  if (seconds == null) return "—"
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`
}

export function CallsTable() {
  const calls = useQuery(api.calls.list)

  return (
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
            {calls === undefined ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Loading calls…
                </td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No calls yet.
                </td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr
                  key={call._id}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-6 py-3 font-medium">{call.callerName ?? <span className="text-muted-foreground">Unknown</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{call.phoneNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(call.timestamp)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={call.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ChannelBadge channel={call.responseChannel} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{formatResponseTime(call.responseTime)}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <MessageSquare className="size-4" />
                          Send SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="size-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="size-4" />
                          View Contact
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle className="size-4" />
                          Mark as Handled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t px-6 py-3">
        <p className="text-xs text-muted-foreground">
          {calls ? `Showing ${calls.length} result${calls.length === 1 ? "" : "s"}` : "Loading..."}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" disabled>
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="px-2 text-xs text-muted-foreground">Page 1 of 1</span>
          <Button variant="outline" size="icon-sm" disabled>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
