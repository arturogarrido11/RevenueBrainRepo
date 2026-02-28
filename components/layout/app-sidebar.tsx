"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PhoneMissed,
  Users,
  Settings,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Calls", href: "/calls", icon: PhoneMissed },
  { label: "Contacts", href: "/contacts", icon: Users },
]

const bottomNavItems = [
  { label: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary">
          <Phone className="size-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Revenue Brain</span>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col gap-0.5 border-t border-sidebar-border px-3 py-3">
        {bottomNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
