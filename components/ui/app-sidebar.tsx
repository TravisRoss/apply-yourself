import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { LogoIcon } from "../layout/LogoIcon"
import SidebarNav from "../layout/SidebarNav"
import SignOutDialog from "../shared/SignOutDialog"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 pl-2">
          <LogoIcon />
          <span className="text-base md:text-sm">Apply Yourself</span>
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
