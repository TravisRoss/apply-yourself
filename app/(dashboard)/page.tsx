"use client"

import AddApplicationSheet from "@/components/AddApplicationSheet"
import ApplicationsTable from "@/components/ApplicationsTable"
import StatCards from "@/components/StatCards"
import { Button } from "@/components/ui/button"
import {
  useApplications,
  useOffers,
  useStatusApplied,
} from "@/hooks/useApplications"
import { useInterviews } from "@/hooks/useInterviews"
import { useSession } from "@/lib/auth-client"
import { calculateResponseRate } from "@/lib/utils"
import { Calendar, FileText, Gift, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const { data: applications } = useApplications(userId!)
  const { data: interviews } = useInterviews(userId!)
  const { data: offers } = useOffers(userId!)
  const { data: statusApplied } = useStatusApplied(userId!)

  const responseRate = calculateResponseRate(
    statusApplied?.length ?? 0,
    applications?.length ?? 0
  )

  const stats = [
    {
      title: "Total Applied",
      icon: FileText,
      total: applications?.length ?? 0,
      count: 0, // TODO
      countLabel: "this week",
      percentageGain: 5, // TODO
    },
    {
      title: "Interviews",
      icon: Calendar,
      total: interviews?.length ?? 0,
      count: 1, // TODO
      countLabel: "this week",
      percentageGain: 3, // TODO
    },
    {
      title: "Offers",
      icon: Gift,
      total: offers?.length ?? 0,
      count: statusApplied?.length ?? 0,
      countLabel: "pending response",
      percentageGain: 50, // TODO
    },
    {
      title: "Response Rate",
      icon: TrendingUp,
      total: responseRate,
      count: 12, // TODO
      countLabel: "this week",
      percentageGain: -5, // TODO
    },
  ]

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
