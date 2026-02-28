import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 w-56 pl-8 text-sm"
          />
        </div>
        <Button variant="ghost" size="icon-sm">
          <Bell className="size-4" />
        </Button>
      </div>
    </header>
  )
}
