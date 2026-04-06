import {
  ApplicationStatus,
  InterviewRound,
  InterviewType,
} from "@/generated/prisma/enums"
import { formatDate } from "@/lib/utils"
import { Clock, Video } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Initials from "../shared/Initials"
import StatusBadge from "../shared/StatusBadge"
import { Badge } from "../ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item"
import InterviewKebabMenu from "./InterviewKebabMenu"

type UpcomingInterviewItemProps = {
  id: string
  company: string
  position: string
  date: Date
  type: InterviewType
  round: InterviewRound
  status?: never
}

type PastInterviewItemProps = {
  id: string
  company: string
  position: string
  date: Date
  status: ApplicationStatus
  type?: never
  round?: never
}

type InterviewItemProps = UpcomingInterviewItemProps | PastInterviewItemProps

export default function InterviewItem({
  id,
  company,
  position,
  date,
  type,
  round,
  status,
}: InterviewItemProps) {
  const t = useTranslations("interviews")
  const locale = useLocale()
  const isPast = status !== undefined

  return (
    <Item
      className={`flex-col items-stretch rounded-lg border border-border bg-card capitalize sm:flex-row sm:items-center ${isPast ? "opacity-50" : ""}`}
    >
      <ItemContent>
        <div className="flex items-center gap-4">
          <Initials title={company} className="h-12 w-12 shrink-0" />
          <div className="flex min-w-0 flex-col">
            <ItemTitle>{company}</ItemTitle>
            <ItemDescription>{position}</ItemDescription>
          </div>
        </div>
      </ItemContent>
      <ItemActions>
        {isPast ? (
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            <span className="text-foreground">{formatDate(date)}</span>
            <StatusBadge status={status} />
            <InterviewKebabMenu interviewId={id} />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            <div className="flex min-w-24 flex-1 flex-col">
              <span className="text-foreground">{formatDate(date)}</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {date.toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex min-w-24 flex-1 items-center gap-1 text-muted-foreground">
              <Video className="h-4 w-4" />
              <span>{t(`types.${type}`)}</span>
            </div>
            <div className="flex min-w-24 flex-1 justify-end">
              <Badge variant="outline" className="w-fit">
                {t(`rounds.${round}`)}
              </Badge>
            </div>
            <InterviewKebabMenu interviewId={id} />
          </div>
        )}
      </ItemActions>
    </Item>
  )
}
