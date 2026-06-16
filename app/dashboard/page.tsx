"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AppShell } from "@/components/layout/app-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PhoneMissed, Users, MessageSquare, Clock } from "lucide-react"

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
  return `${Math.floor(seconds / 60)}m`
}

export default function DashboardPage() {
  const stats = useQuery(api.calls.getStats)
  const recentCalls = useQuery(api.calls.listRecent)
  const recentLeads = useQuery(api.leads.listRecent)

  const missedToday = stats?.missedToday ?? 0
  const missedYesterday = stats?.missedYesterday ?? 0
  const responseRate = stats?.responseRate ?? 0
  const avgResponseTime = stats?.avgResponseTimeSeconds ?? 0
  const totalContacts = stats?.totalContacts ?? 0
  const trendDiff = missedToday - missedYesterday

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard
            title="Missed Today"
            value={String(missedToday)}
            description={`${trendDiff >= 0 ? "+" : ""}${trendDiff} vs yesterday`}
            icon={PhoneMissed}
            trend={{ value: `${trendDiff >= 0 ? "+" : ""}${trendDiff}`, direction: trendDiff >= 0 ? "up" : "down", positive: trendDiff <= 0 }}
          />
          <StatCard title="Response Rate" value={`${Math.round(responseRate * 100)}%`} description="Callers who replied by SMS" icon={MessageSquare} />
          <StatCard title="Avg Response Time" value={formatResponseTime(avgResponseTime)} description="From missed call to SMS reply" icon={Clock} />
          <StatCard title="Total Contacts" value={String(totalContacts)} description="Unique callers tracked" icon={Users} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Recent Missed Calls</CardTitle></CardHeader>
            <CardContent className="p-0">
              {recentCalls === undefined ? <p className="px-6 py-4 text-sm text-muted-foreground">Loading…</p>
              : recentCalls.length === 0 ? <p className="px-6 py-4 text-sm text-muted-foreground">No calls yet.</p>
              : <ul className="divide-y divide-border">{recentCalls.map((call) => (
                <li key={call._id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <div><p className="font-medium">{call.callerName ?? "Unknown"}</p><p className="text-xs text-muted-foreground">{call.phoneNumber}</p></div>
                  <div className="flex items-center gap-3">
                    {call.status === "missed" && <Badge variant="destructive">Missed</Badge>}
                    {call.status === "responded" && <Badge variant="default">Responded</Badge>}
                    {call.status === "ai_recorded" && <Badge variant="outline">AI Recorded</Badge>}
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(call.timestamp)}</span>
                  </div>
                </li>
              ))}</ul>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Recent SMS Replies</CardTitle></CardHeader>
            <CardContent className="p-0">
              {recentLeads === undefined ? <p className="px-6 py-4 text-sm text-muted-foreground">Loading…</p>
              : recentLeads.length === 0 ? <p className="px-6 py-4 text-sm text-muted-foreground">No SMS replies yet. Once customers reply to your follow-up texts, they will appear here.</p>
              : <ul className="divide-y divide-border">{recentLeads.map((lead) => (
                <li key={lead._id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <div className="min-w-0"><p className="font-medium">{lead.fromPhoneNumber}</p><p className="truncate text-xs text-muted-foreground max-w-[220px]">{lead.messageBody}</p></div>
                  <span className="ml-4 shrink-0 text-xs text-muted-foreground">{formatRelativeTime(lead.timestamp)}</span>
                </li>
              ))}</ul>}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
