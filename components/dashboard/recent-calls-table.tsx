import Link from "next/link"
import { MoreHorizontal, MessageSquare, Mail, User, CheckCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MOCK_CALLS, formatRelativeTime, type CallStatus, type ResponseChannel } from "@/lib/mock-data"

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

export function RecentCallsTable() {
  const recentCalls = MOCK_CALLS.slice(0, 8)

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
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Caller</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Response</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.map((call) => (
              <tr key={call.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                <td className="px-6 py-3">
                  <div>
                    <p className="font-medium">{call.callerName ?? "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatRelativeTime(call.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={call.status} />
                </td>
                <td className="px-4 py-3">
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
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
