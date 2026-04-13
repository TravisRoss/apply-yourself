"use client"

import AddApplicationSheet from "@/components/applications/AddApplicationSheet"
import ApplicationsTable from "@/components/applications/ApplicationsTable"
import StatCards from "@/components/dashboard/StatCards"
import { PageShell } from "@/components/layout/PageShell"
import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function DashboardPage() {
  const { stats, isLoading } = useDashboardStats()
  const t = useTranslations("dashboard")

  return (
    <PageShell title={t("title")} action={<AddApplicationSheet />}>
      <StatCards stats={stats} isLoading={isLoading} />
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2>{t("recentApplications")}</h2>
        <Button variant="ghost" className="text-muted-foreground">
          <Link href="/applications">{t("viewAll")}</Link>
        </Button>
      </div>
      <ApplicationsTable isLoading={isLoading} />
    </PageShell>
  )
}
