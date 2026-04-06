"use client"

import AddApplicationSheet from "@/components/applications/AddApplicationSheet"
import ApplicationsTable from "@/components/applications/ApplicationsTable"
import { PageShell } from "@/components/layout/PageShell"
import StatCards from "@/components/dashboard/StatCards"
import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useSession } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const stats = useDashboardStats(userId)
  const t = useTranslations("dashboard")

  return (
    <PageShell
      title={t("title")}
      action={<AddApplicationSheet userId={userId!} />}
    >
      <StatCards stats={stats} />
      <div className="mb-4 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("recentApplications")}</h2>
        <Button variant="ghost" className="text-muted-foreground">
          <Link href="/applications">{t("viewAll")}</Link>
        </Button>
      </div>
      <ApplicationsTable userId={userId!} />
    </PageShell>
  )
}
