import { Download } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { ContactsTable } from "@/components/contacts/contacts-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ContactsPage() {
  return (
    <AppShell title="Contacts">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Contacts</h2>
            <p className="text-sm text-muted-foreground">Everyone who has called your business</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8 w-56" />
            </div>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>

        <ContactsTable />
      </div>
    </AppShell>
  )
}
