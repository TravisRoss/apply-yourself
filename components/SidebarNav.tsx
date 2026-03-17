"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

const navLinks: { title: string; href: string; icon: LucideIcon }[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Applications", href: "/applications", icon: FileText },
  { title: "Interviews", href: "/interviews", icon: Calendar },
  { title: "Contacts", href: "/contacts", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navLinks.map((link) => (
        <SidebarMenuItem key={link.title}>
          <SidebarMenuButton asChild isActive={link.href === pathname}>
            <Link
              href={link.href}
              className={
                link.href === pathname
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              <link.icon />
              {link.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
