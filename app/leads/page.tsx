"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, X } from "lucide-react"

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

export default function LeadsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState("all")

  const leads = useQuery(api.leads.listFiltered, {
    dateRange: dateRange === "all" ? undefined : dateRange as "today" | "7d" | "30d" | "month",
  })

  const hasFilters = dateRange !== "all"

  return (
    <AppShell title="SMS Replies">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">SMS Replies</h2>
            <p className="text-sm text-muted-foreground">Inbound replies from customers who received your follow-up texts</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Date range" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => setDateRange("all")}>
                <X className="size-3.5" />Clear
              </Button>
            )}
          </div>
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
                    <tr
                      key={lead._id}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      onClick={() => router.push(`/contacts/${encodeURIComponent(lead.fromPhoneNumber)}`)}
                    >
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
