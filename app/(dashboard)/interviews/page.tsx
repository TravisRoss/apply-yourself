"use client"

import AddInterviewSheet from "@/components/interviews/AddInterviewSheet"
import InterviewItemSkeleton from "@/components/interviews/InterviewItemSkeleton"
import InterviewsList from "@/components/interviews/InterviewsList"
import { PageShell } from "@/components/layout/PageShell"
import { useApplications } from "@/hooks/useApplications"
import { useInterviews } from "@/hooks/useInterviews"
import { useSession } from "@/lib/auth-client"
import { useTranslations } from "next-intl"

export default function InterviewsPage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const { data: applications = [] } = useApplications(userId)
  const { data: interviews = [], isLoading } = useInterviews()
  const t = useTranslations("interviews")
  const currentTime = new Date().getTime()

  const pastInterviews = interviews.filter(
    (interview) => interview.date.getTime() < currentTime
  )

  const upcomingInterviews = interviews.filter(
    (interview) => interview.date.getTime() > currentTime
  )

  return (
    <PageShell title={t("title")} action={<AddInterviewSheet />}>
      <h2 className="mb-4">{t("upcoming")}</h2>
      {isLoading && <InterviewItemSkeleton />}

      {!isLoading && interviews.length === 0 && (
        <p className="text-center text-muted-foreground">{t("empty")}</p>
      )}

      <>
        <InterviewsList
          interviews={upcomingInterviews}
          applications={applications}
        />

        {pastInterviews.length > 0 && (
          <>
            <h2 className="mt-4 mb-4">{t("past")}</h2>
            <InterviewsList
              interviews={pastInterviews}
              applications={applications}
              currentTime={currentTime}
            />
          </>
        )}
      </>
    </PageShell>
  )
}
