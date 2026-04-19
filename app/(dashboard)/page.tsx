"use client"

import AddApplicationSheet from "@/components/applications/AddApplicationSheet"
import ApplicationsTable from "@/components/applications/ApplicationsTable"
import StatCards from "@/components/dashboard/StatCards"
import AddInterviewSheet from "@/components/interviews/AddInterviewSheet"
import { PageShell } from "@/components/layout/PageShell"
import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {
  const { stats, isLoading } = useDashboardStats()
  const t = useTranslations("dashboard")
  const [interviewSheetOpen, setInterviewSheetOpen] = useState(false)
  const [pendingApplication, setPendingApplication] = useState<{ id: string; company: string; position: string } | undefined>(undefined)

  function handleApplicationCreated(application: { id: string; company: string; position: string }) {
    setPendingApplication(application)
    setInterviewSheetOpen(true)
  }

  return (
    <>
      <PageShell title={t("title")} action={<AddApplicationSheet onApplicationCreated={handleApplicationCreated} />}>
        <StatCards stats={stats} isLoading={isLoading} />
        <div className="mt-8 mb-4 flex items-center justify-between">
          <h2>{t("recentApplications")}</h2>
          <Button variant="ghost" className="text-muted-foreground">
            <Link href="/applications">{t("viewAll")}</Link>
          </Button>
        </div>
        <ApplicationsTable isLoading={isLoading} />
      </PageShell>
      <AddInterviewSheet
        open={interviewSheetOpen}
        onOpenChange={setInterviewSheetOpen}
        lockedApplication={pendingApplication}
      />
    </>
  )
}
