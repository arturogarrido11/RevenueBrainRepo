import { MoreHorizontal, MessageSquare, Mail, User, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
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
import {
  MOCK_CALLS,
  formatRelativeTime,
  formatDateTime,
  formatResponseTime,
  type CallStatus,
  type ResponseChannel,
} from "@/lib/mock-data"

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

export function CallsTable() {
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
            {MOCK_CALLS.map((call) => (
              <tr
                key={call.id}
                className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
              >
                <td className="px-6 py-3 font-medium">
                  {call.callerName ?? <span className="text-muted-foreground">Unknown</span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {call.phoneNumber}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <span title={formatDateTime(call.timestamp)}>
                    {formatRelativeTime(call.timestamp)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={call.status} />
                </td>
                <td className="px-4 py-3">
                  <ChannelBadge channel={call.responseChannel} />
                </td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {call.responseTime !== null ? formatResponseTime(call.responseTime) : "—"}
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
      <CardFooter className="flex items-center justify-between border-t px-6 py-3">
        <p className="text-xs text-muted-foreground">Showing 20 of 20 results</p>
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
