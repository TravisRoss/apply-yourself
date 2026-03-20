import AddApplicationSheet from "@/components/AddApplicationSheet"
import ApplicationsTable from "@/components/ApplicationsTable"
import StatCards from "@/components/StatCards"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="p-8 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="mb-1 text-xl font-semibold text-foreground">
          Dashboard
        </h1>
        <AddApplicationSheet />
      </div>
      <StatCards />
      <div className="mb-4 flex items-center justify-between pt-8">
        <h2 className="text-lg font-semibold">Recent Applications</h2>
        <Button variant="ghost" className="text-muted-foreground">
          View all
        </Button>
      </div>
      <ApplicationsTable userId={session!.user.id} />
    </div>
  )
}
