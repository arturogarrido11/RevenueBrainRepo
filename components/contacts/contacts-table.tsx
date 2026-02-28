import { MoreHorizontal, MessageSquare, Mail, History, Ban } from "lucide-react"
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
  MOCK_CONTACTS,
  formatRelativeTime,
  type ContactStatus,
  type ResponseChannel,
} from "@/lib/mock-data"
import { ChevronLeft, ChevronRight } from "lucide-react"

function ContactAvatar({ name }: { name: string | null }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?"

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {initials}
    </div>
  )
}

function StatusBadge({ status }: { status: ContactStatus }) {
  if (status === "active") return <Badge variant="default">Active</Badge>
  if (status === "lapsed") return <Badge variant="destructive">Lapsed</Badge>
  return <Badge variant="outline">New</Badge>
}

function ChannelLabel({ channel }: { channel: ResponseChannel | null }) {
  if (channel === "sms") return <span className="text-xs">SMS</span>
  if (channel === "email") return <span className="text-xs">Email</span>
  return <span className="text-xs text-muted-foreground">None</span>
}

export function ContactsTable() {
  return (
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
            {MOCK_CONTACTS.map((contact) => (
              <tr
                key={contact.id}
                className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
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
                <td className="px-4 py-3 text-muted-foreground">
                  {formatRelativeTime(contact.lastCalledAt)}
                </td>
                <td className="px-4 py-3">
                  <ChannelLabel channel={contact.lastResponseChannel} />
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {contact.responseRate > 0
                    ? `${Math.round(contact.responseRate * 100)}%`
                    : <span className="text-muted-foreground">0%</span>}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={contact.status} />
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
                        <History className="size-4" />
                        View History
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="size-4" />
                        Send SMS
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="size-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Ban className="size-4" />
                        Block Number
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
        <p className="text-xs text-muted-foreground">Showing 15 of 15 contacts</p>
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
