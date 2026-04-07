import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <SidebarTrigger className="size-12 md:size-7 [&_svg]:size-6! md:[&_svg]:size-4!" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
