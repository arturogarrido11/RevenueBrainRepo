import { Download } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { CallsFilters } from "@/components/calls/calls-filters"
import { CallsTable } from "@/components/calls/calls-table"
import { Button } from "@/components/ui/button"

export default function CallsPage() {
  return (
    <AppShell title="Calls">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Call Log</h2>
            <p className="text-sm text-muted-foreground">All missed calls and their response status</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Export
          </Button>
        </div>

        <CallsFilters />
        <CallsTable />
      </div>
    </AppShell>
  )
}
