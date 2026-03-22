"use client"

import AddApplicationSheet from "@/components/AddApplicationSheet"
import ApplicationsTable from "@/components/ApplicationsTable"
import StatCards from "@/components/StatCards"
import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useSession } from "@/lib/auth-client"

export default function DashboardPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const stats = useDashboardStats(userId)

  return (
    <div className="p-8 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="mb-1 text-xl font-semibold text-foreground">
          Dashboard
        </h1>
        <AddApplicationSheet userId={userId!} />
      </div>
      <StatCards stats={stats} />
      <div className="mb-4 flex items-center justify-between pt-8">
        <h2 className="text-lg font-semibold">Recent Applications</h2>
        <Button variant="ghost" className="text-muted-foreground">
          View all
        </Button>
      </div>
      <ApplicationsTable userId={userId!} />
    </div>
  )
}
