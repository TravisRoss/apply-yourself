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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { useTranslations } from "next-intl"

type NavLink = { title: string; href: string; icon: LucideIcon }

export default function SidebarNav() {
  const pathname = usePathname()
  const t = useTranslations("nav")

  const navLinks: NavLink[] = [
    { title: t("dashboard"), href: "/", icon: LayoutDashboard },
    { title: t("applications"), href: "/applications", icon: FileText },
    { title: t("interviews"), href: "/interviews", icon: Calendar },
    { title: t("contacts"), href: "/contacts", icon: Users },
    { title: t("settings"), href: "/settings", icon: Settings },
  ]

  return (
    <SidebarMenu>
      {navLinks.map((link) => (
        <SidebarMenuItem key={link.href}>
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
