"use client"

import { useQuery } from "convex/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { api } from "@/convex/_generated/api"
import { AppShell } from "@/components/layout/app-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PhoneMissed, Users, MessageSquare, Clock, CheckCircle, X } from "lucide-react"
import { CallForwardingInstructions } from "@/components/call-forwarding"

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

function SuccessBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-green-800 dark:text-green-200">🎉 You're all set!</p>
        <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
          Your AI receptionist is configured and ready. Forward your calls to get started — instructions below.
        </p>
      </div>
      <button onClick={onDismiss} className="text-green-600 dark:text-green-400 hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justOnboarded = searchParams.get("onboarded") === "1"

  const business = useQuery(api.businesses.getMyBusiness)
  const stats = useQuery(api.calls.getStats)
  const recentCalls = useQuery(api.calls.listRecent)
  const recentLeads = useQuery(api.leads.listRecent)
  const phoneNumbers = useQuery(api.phone_numbers.listMyNumbers)

  const [showBanner, setShowBanner] = useState(justOnboarded)

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (business !== undefined && business !== null && !business.onboardingCompleted) {
      router.replace("/onboarding")
    }
  }, [business, router])

  const missedToday = stats?.missedToday ?? 0
  const missedYesterday = stats?.missedYesterday ?? 0
  const responseRate = stats?.responseRate ?? 0
  const avgResponseTime = stats?.avgResponseTimeSeconds ?? 0
  const totalContacts = stats?.totalContacts ?? 0
  const trendDiff = missedToday - missedYesterday

  const aiNumber = phoneNumbers?.[0]?.twilioPhoneNumber

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col gap-6">
        {/* Success banner after onboarding */}
        {showBanner && <SuccessBanner onDismiss={() => setShowBanner(false)} />}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard title="Missed Today" value={String(missedToday)} description={`${trendDiff >= 0 ? "+" : ""}${trendDiff} vs yesterday`} icon={PhoneMissed} trend={{ value: `${trendDiff >= 0 ? "+" : ""}${trendDiff}`, direction: trendDiff >= 0 ? "up" : "down", positive: trendDiff <= 0 }} />
          <StatCard title="Response Rate" value={`${Math.round(responseRate * 100)}%`} description="Callers who replied by SMS" icon={MessageSquare} />
          <StatCard title="Avg Response Time" value={formatResponseTime(avgResponseTime)} description="From missed call to SMS reply" icon={Clock} />
          <StatCard title="Total Contacts" value={String(totalContacts)} description="Unique callers tracked" icon={Users} />
        </div>

        {/* Call forwarding card — shown if number provisioned */}
        {aiNumber && (
          <CallForwardingInstructions number={aiNumber} compact />
        )}

        {/* Recent activity */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Recent Missed Calls</CardTitle></CardHeader>
            <CardContent className="p-0">
              {recentCalls === undefined ? <p className="px-6 py-4 text-sm text-muted-foreground">Loading…</p>
              : recentCalls.length === 0 ? <p className="px-6 py-4 text-sm text-muted-foreground">No calls yet.</p>
              : <ul className="divide-y divide-border">
                {recentCalls.map((call) => (
                  <li
                    key={call._id}
                    className="flex cursor-pointer items-center justify-between px-6 py-3 text-sm hover:bg-muted/40 transition-colors"
                    onClick={() => router.push(`/contacts/${encodeURIComponent(call.phoneNumber)}`)}
                  >
                    <div>
                      <p className="font-medium">{call.callerName ?? call.phoneNumber}</p>
                      <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {call.status === "missed" && <Badge variant="destructive">Missed</Badge>}
                      {call.status === "responded" && <Badge variant="default">Handled</Badge>}
                      {call.status === "ai_recorded" && <Badge variant="outline">AI Recorded</Badge>}
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(call.timestamp)}</span>
                    </div>
                  </li>
                ))}
              </ul>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Recent SMS Replies</CardTitle></CardHeader>
            <CardContent className="p-0">
              {recentLeads === undefined ? <p className="px-6 py-4 text-sm text-muted-foreground">Loading…</p>
              : recentLeads.length === 0 ? <p className="px-6 py-4 text-sm text-muted-foreground">No SMS replies yet. Once customers reply to your follow-up texts, they will appear here.</p>
              : <ul className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <li
                    key={lead._id}
                    className="flex cursor-pointer items-center justify-between px-6 py-3 text-sm hover:bg-muted/40 transition-colors"
                    onClick={() => router.push(`/contacts/${encodeURIComponent(lead.fromPhoneNumber)}`)}
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{lead.fromPhoneNumber}</p>
                      <p className="truncate text-xs text-muted-foreground max-w-[220px]">{lead.messageBody}</p>
                    </div>
                    <span className="ml-4 shrink-0 text-xs text-muted-foreground">{formatRelativeTime(lead.timestamp)}</span>
                  </li>
                ))}
              </ul>}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  )
}
