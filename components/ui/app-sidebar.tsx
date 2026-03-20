import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { LogoIcon } from "../LogoIcon"
import SidebarNav from "../SidebarNav"
import SignOutDialog from "../SignOutDialog"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 pl-2">
          <LogoIcon />
          <span>Apply Yourself</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarNav />
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SignOutDialog />
      </SidebarFooter>
    </Sidebar>
  )
}
