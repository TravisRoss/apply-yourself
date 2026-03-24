"use client"

import AddApplicationSheet from "@/components/AddApplicationSheet"
import ApplicationsTable from "@/components/ApplicationsTable"
import { PageShell } from "@/components/PageShell"
import StatCards from "@/components/StatCards"
import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const stats = useDashboardStats(userId)

  return (
    <PageShell
      title="Dashboard"
      action={<AddApplicationSheet userId={userId!} />}
    >
      <StatCards stats={stats} />
      <div className="mb-4 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Applications</h2>
        <Button variant="ghost" className="text-muted-foreground">
          <Link href="/applications">View all</Link>
        </Button>
      </div>
      <ApplicationsTable userId={userId!} />
    </PageShell>
  )
}
