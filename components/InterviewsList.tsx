import { Application, Interview } from "@/generated/prisma/client"
import InterviewItem from "./InterviewItem"

type InterviewsListProps = {
  interviews: Interview[]
  applications: Application[]
}

export default function InterviewsList({
  interviews,
  applications,
}: InterviewsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {interviews.map((interview) => {
        const application = applications.find(
          (app) => app.id === interview.applicationId
        )
        if (application === undefined) return null

        return (
          <InterviewItem
            key={interview.id}
            id={interview.id}
            company={application.company}
            position={application.position}
            date={interview.date}
            type={interview.type}
            round={interview.round}
          />
        )
      })}
    </div>
  )
}
