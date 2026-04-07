"use client"

import {
  Calendar,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"

type NavLink = { title: string; href: string; icon: LucideIcon }

export default function SidebarNav() {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const { isMobile, setOpenMobile } = useSidebar()

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
          <SidebarMenuButton
            asChild
            isActive={link.href === pathname}
            size={isMobile ? "lg" : "default"}
            onClick={() => {
              if (isMobile) setOpenMobile(false)
            }}
          >
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
