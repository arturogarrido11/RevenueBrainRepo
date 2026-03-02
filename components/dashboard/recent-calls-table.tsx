"use client"

import Link from "next/link"
import { MoreHorizontal, MessageSquare, Mail, User, CheckCircle } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type CallStatus = "missed" | "responded" | "pending"
type ResponseChannel = "sms" | "email" | "none"

interface Call {
  _id: string
  callerName?: string
  phoneNumber: string
  timestamp: number
  status: CallStatus
  responseChannel: ResponseChannel
}

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

export function RecentCallsTable() {
  const calls = useQuery(api.calls.listRecent)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Calls</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link href="/calls">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:px-6">Caller</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-muted-foreground md:table-cell">Response</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {calls === undefined ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 sm:px-6">
                    <Skeleton className="mb-1 h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Skeleton className="h-5 w-10 rounded-full" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                  </td>
                </tr>
              ))
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                  No calls yet — they'll appear here as soon as someone calls your Twilio number.
                </td>
              </tr>
            ) : (
              calls.map((call: Call) => (
                <tr key={call._id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 sm:px-6">
                    <div>
                      <p className="font-medium">{call.callerName ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {formatRelativeTime(call.timestamp)}
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatRelativeTime(call.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={call.status} />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <ChannelBadge channel={call.responseChannel} />
                  </td>
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
    </Card>
  )
}
