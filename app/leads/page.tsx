"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

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

export default function LeadsPage() {
  const leads = useQuery(api.leads.listRecent)
  return (
    <AppShell title="SMS Replies">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">SMS Replies</h2>
          <p className="text-sm text-muted-foreground">Inbound replies from customers who received your follow-up texts</p>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {leads === undefined ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Loading…</p>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <MessageSquare className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">No replies yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Once customers reply to your automated follow-up texts, their messages will appear here.</p>
                </div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">From</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Business #</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-3 font-medium tabular-nums">{lead.fromPhoneNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-sm"><p className="truncate">{lead.messageBody}</p></td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">{lead.businessId ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{formatRelativeTime(lead.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
