"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card } from "@/components/ui/card"

export function LeadsTable() {
  const leads = useQuery(api.leads.listRecent) ?? []

  if (!leads.length) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        No recent SMS replies yet. Once customers reply to your follow-up texts,
        they will appear here.
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Recent SMS Leads</h3>
          <p className="text-xs text-muted-foreground">
            Last {leads.length} inbound SMS replies captured from missed-call follow-up.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-xs text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">From</th>
              <th className="py-2 pr-4">Message</th>
              <th className="py-2 pr-4">Business / To</th>
              <th className="py-2">When</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead._id} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-xs">{lead.fromPhoneNumber}</td>
                <td className="py-2 pr-4 max-w-xs truncate" title={lead.messageBody}>
                  {lead.messageBody}
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                  {lead.businessId || "—"}
                </td>
                <td className="py-2 text-xs text-muted-foreground">
                  {lead.timestamp
                    ? new Date(lead.timestamp).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

