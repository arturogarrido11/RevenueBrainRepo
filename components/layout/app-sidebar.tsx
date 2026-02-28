"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PhoneMissed, Users, Settings, Phone } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

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
    <Sidebar>
      {/* Logo */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-10 items-center gap-2.5 px-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
            <Phone className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Revenue Brain</span>
        </div>
      </SidebarHeader>

      {/* Primary nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={href}>
                        <Icon className="size-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom nav */}
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          {bottomNavItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={href}>
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
