"use client"

import { PhoneMissed, MessageSquare, Clock, Users } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AppShell } from "@/components/layout/app-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const stats = useQuery(api.calls.getStats)

  const missedToday = stats?.missedToday ?? 0
  const missedYesterday = stats?.missedYesterday ?? 0
  const responseRate = stats?.responseRate ?? 0
  const avgResponseTimeSeconds = stats?.avgResponseTimeSeconds ?? 0
  const totalContacts = stats?.totalContacts ?? 0
  const newContactsThisWeek = stats?.newContactsThisWeek ?? 0

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard
          title="Missed Today"
          value={String(missedToday)}
          description={`vs ${missedYesterday} yesterday`}
          icon={PhoneMissed}
          trend={{
            value: `${missedToday - missedYesterday >= 0 ? "+" : ""}${missedToday - missedYesterday}`,
            direction: missedToday - missedYesterday >= 0 ? "up" : "down",
            positive: false,
          }}
        />
        <StatCard
          title="Response Rate"
          value={`${Math.round(responseRate * 100)}%`}
          description="All time"
          icon={MessageSquare}
          trend={{
            value: "live",
            direction: "up",
            positive: true,
          }}
        />
        <StatCard
          title="Avg Response Time"
          value={`${Math.floor(avgResponseTimeSeconds / 60)}m ${avgResponseTimeSeconds % 60}s`}
          description="Time to first reply"
          icon={Clock}
          trend={{
            value: "live",
            direction: "down",
            positive: true,
          }}
        />
        <StatCard
          title="Total Contacts"
          value={totalContacts.toLocaleString()}
          description="All time callers"
          icon={Users}
          trend={{
            value: `+${newContactsThisWeek} this week`,
            direction: "up",
            positive: true,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentCallsTable />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Response Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                {
                  label: "Responded",
                  value: Math.round(responseRate * 100),
                  color: "bg-primary",
                },
                {
                  label: "No Response",
                  value: Math.max(0, 100 - Math.round(responseRate * 100)),
                  color: "bg-muted-foreground/30",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
