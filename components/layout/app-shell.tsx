import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"

interface AppShellProps {
  title: string
  children: React.ReactNode
}

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
