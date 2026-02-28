import { PhoneMissed, MessageSquare, Clock, Users } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DASHBOARD_STATS } from "@/lib/mock-data"

export default function DashboardPage() {
  const stats = DASHBOARD_STATS

  return (
    <AppShell title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard
          title="Missed Today"
          value={String(stats.missedToday)}
          description={`vs ${stats.missedYesterday} yesterday`}
          icon={PhoneMissed}
          trend={{
            value: `+${stats.missedToday - stats.missedYesterday}`,
            direction: "up",
            positive: false,
          }}
        />
        <StatCard
          title="Response Rate"
          value={`${Math.round(stats.responseRate * 100)}%`}
          description="Last 30 days"
          icon={MessageSquare}
          trend={{
            value: `+${Math.round((stats.responseRate - stats.responseRatePrev) * 100)}%`,
            direction: "up",
            positive: true,
          }}
        />
        <StatCard
          title="Avg Response Time"
          value={`${Math.floor(stats.avgResponseTimeSeconds / 60)}m ${stats.avgResponseTimeSeconds % 60}s`}
          description="Time to first reply"
          icon={Clock}
          trend={{
            value: `-${stats.avgResponseTimePrevSeconds - stats.avgResponseTimeSeconds}s`,
            direction: "down",
            positive: true,
          }}
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts.toLocaleString()}
          description="All time callers"
          icon={Users}
          trend={{
            value: `+${stats.newContactsThisWeek} this week`,
            direction: "up",
            positive: true,
          }}
        />
      </div>

      {/* Main content */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:mt-6 lg:grid-cols-3">
        {/* Recent calls — spans 2 cols */}
        <div className="lg:col-span-2">
          <RecentCallsTable />
        </div>

        {/* Activity summary */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Response Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                { label: "SMS Responses", value: 9, color: "bg-primary" },
                { label: "Email Responses", value: 4, color: "bg-chart-2" },
                { label: "No Response", value: 7, color: "bg-muted-foreground/30" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${(value / 20) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                { label: "Calls this week", value: "34" },
                { label: "Avg calls / day", value: "4.9" },
                { label: "Busiest hour", value: "2–3 PM" },
                { label: "Top area code", value: "(555)" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {[
                { text: "SMS sent to Sarah Johnson", time: "4m ago" },
                { text: "New contact: Marcus Williams", time: "18m ago" },
                { text: "Email sent to Elena Martinez", time: "1h ago" },
                { text: "3 calls missed while closed", time: "3h ago" },
              ].map(({ text, time }, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <p className="text-xs leading-snug">{text}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
