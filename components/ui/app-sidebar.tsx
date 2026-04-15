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
      <SidebarHeader className="mt-2 pt-[env(safe-area-inset-top)]">
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
      <SidebarFooter className="pb-[env(safe-area-inset-bottom)]">
        <SignOutDialog />
      </SidebarFooter>
    </Sidebar>
  )
}
