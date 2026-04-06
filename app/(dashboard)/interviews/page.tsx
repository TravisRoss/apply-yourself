"use client"

import AddInterviewSheet from "@/components/interviews/AddInterviewSheet"
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
  const { data: interviews = [] } = useInterviews(userId)
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
      {interviews.length === 0 ? (
        <p className="text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <>
          <h2 className="mb-4">{t("upcoming")}</h2>
          {upcomingInterviews.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("upcomingEmpty")}</p>
          ) : (
            <InterviewsList
              interviews={upcomingInterviews}
              applications={applications}
            />
          )}
          <h2 className="mt-4 mb-4">{t("past")}</h2>
          {pastInterviews.length === 0 ? (
            <p className="text-muted-foreground">{t("pastEmpty")}</p>
          ) : (
            <InterviewsList
              interviews={pastInterviews}
              applications={applications}
              currentTime={currentTime}
            />
          )}
        </>
      )}
    </PageShell>
  )
}
