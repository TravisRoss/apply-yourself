import ApplicationsTable from "@/components/ApplicationsTable"
import StatCards from "@/components/StatCards"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="p-8 pt-4">
      <h1 className="mb-1 text-xl font-semibold text-foreground">Overview</h1>
      <p className="text-sm text-muted-foreground">
        Track every job you&apos;ve applied to.
      </p>
      <StatCards />
      <div className="mb-4 flex items-center justify-between pt-8">
        <h2 className="text-lg font-semibold">Recent Applications</h2>
        <Button variant="ghost" className="text-muted-foreground">
          View all
        </Button>
      </div>
      <ApplicationsTable />
    </div>
  )
}
