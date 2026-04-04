"use client"

import AddInterviewSheet from "@/components/interviews/AddInterviewSheet"
import InterviewsList from "@/components/interviews/InterviewsList"
import { PageShell } from "@/components/layout/PageShell"
import { useApplications } from "@/hooks/useApplications"
import { useInterviews } from "@/hooks/useInterviews"
import { useSession } from "@/lib/auth-client"

export default function InterviewsPage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const { data: applications = [] } = useApplications(userId)
  const { data: interviews = [] } = useInterviews(userId)
  const currentTime = new Date().getTime()

  const pastInterviews = interviews.filter(
    (interview) => interview.date.getTime() < currentTime
  )

  const upcomingInterviews = interviews.filter(
    (interview) => interview.date.getTime() > currentTime
  )

  return (
    <PageShell title="Interviews" action={<AddInterviewSheet />}>
      {interviews.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No interviews yet. Add your first interview to get started!
        </p>
      ) : (
        <>
          <h2 className="mb-4">Upcoming Interviews</h2>
          {upcomingInterviews.length === 0 ? (
            <p className="text-muted-foreground">
              Currently no upcoming interviews.
            </p>
          ) : (
            <InterviewsList
              interviews={upcomingInterviews}
              applications={applications}
            />
          )}
          <h2 className="mb-4 mt-4">Past Interviews</h2>
          {pastInterviews.length === 0 ? (
            <p className="text-muted-foreground">
              You don&apos;t have any past interviews.
            </p>
          ) : (
            <InterviewsList
              interviews={pastInterviews}
              applications={applications}
            />
          )}
        </>
      )}
    </PageShell>
  )
}
