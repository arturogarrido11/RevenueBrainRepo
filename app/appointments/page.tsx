"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, ExternalLink } from "lucide-react"
import { format } from "date-fns"

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  booked: "default",
  captured: "secondary",
  failed: "destructive",
  transferred: "outline",
}

const STATUS_LABELS: Record<string, string> = {
  booked: "Booked",
  captured: "Time Captured",
  failed: "Failed",
  transferred: "Transferred",
}

const PROVIDER_LABELS: Record<string, string> = {
  cal_com: "Cal.com",
  calendly: "Calendly",
  google_calendar: "Google Calendar",
}

function formatAppointmentTime(apt: {
  calendarStartTime?: string
  requestedDatetime?: string
  requestedDatetimeRaw?: string
}) {
  if (apt.calendarStartTime) {
    return format(new Date(apt.calendarStartTime), "MMM d, yyyy h:mm a")
  }
  if (apt.requestedDatetime) {
    return format(new Date(apt.requestedDatetime), "MMM d, yyyy h:mm a")
  }
  return apt.requestedDatetimeRaw ?? "—"
}

export default function AppointmentsPage() {
  const appointments = useQuery(api.appointments.list, { limit: 100 })

  const booked = appointments?.filter((a) => a.bookingStatus === "booked").length ?? 0
  const captured = appointments?.filter((a) => a.bookingStatus === "captured").length ?? 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Scheduling outcomes from AI voice receptionist calls.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length ?? "—"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Booked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{booked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time Captured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{captured}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date / Time</TableHead>
                <TableHead>Caller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Booking Ref</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!appointments && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {appointments?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    <Calendar className="size-8 mx-auto mb-2 opacity-30" />
                    No appointments yet. Appointments will appear here when callers schedule with your AI receptionist.
                  </TableCell>
                </TableRow>
              )}
              {appointments?.map((apt) => (
                <TableRow key={apt._id}>
                  <TableCell className="whitespace-nowrap font-mono text-sm">
                    {formatAppointmentTime(apt)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{apt.callerName ?? "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{apt.phoneNumber}</div>
                    {apt.callerEmail && (
                      <div className="text-xs text-muted-foreground">{apt.callerEmail}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[apt.bookingStatus] ?? "secondary"}>
                      {STATUS_LABELS[apt.bookingStatus] ?? apt.bookingStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {apt.calendarProvider ? PROVIDER_LABELS[apt.calendarProvider] ?? apt.calendarProvider : "—"}
                  </TableCell>
                  <TableCell>
                    {apt.calendarBookingUrl ? (
                      <a
                        href={apt.calendarBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        {apt.calendarBookingId?.slice(0, 12) ?? "View"}
                        <ExternalLink className="size-3" />
                      </a>
                    ) : apt.calendarBookingId ? (
                      <span className="text-sm font-mono">{apt.calendarBookingId.slice(0, 12)}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {apt.callerNotes ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
