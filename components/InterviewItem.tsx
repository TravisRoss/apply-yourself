import { InterviewRound, InterviewType } from "@/generated/prisma/enums"
import { formatDate } from "@/lib/utils"
import { Clock, Video } from "lucide-react"
import Initials from "./Initials"
import InterviewKebabMenu from "./InterviewKebabMenu"
import { Badge } from "./ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "./ui/item"

type InterviewItemProps = {
  id: string
  company: string
  position: string
  date: Date
  type: InterviewType
  round: InterviewRound
}

export default function InterviewItem({
  id,
  company,
  position,
  date,
  type,
  round,
}: InterviewItemProps) {
  return (
    <Item className="flex-col items-stretch rounded-lg border border-border bg-card capitalize sm:flex-row sm:items-center">
      <ItemContent>
        <div className="flex items-center gap-4">
          <Initials title={company} className="h-12 w-12 shrink-0" />
          <div className="flex min-w-0 flex-col">
            <ItemTitle>{company}</ItemTitle>
            <ItemDescription>{position}</ItemDescription>
          </div>
        </div>
      </ItemContent>
      <ItemActions className="w-80">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-28 flex-col">
            <span className="text-foreground">{formatDate(date)}</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex w-24 items-center gap-2 text-muted-foreground">
            <Video className="h-4 w-4" />
            <span>{type}</span>
          </div>
          <div className="flex w-24 justify-end">
            <Badge variant="outline" className="w-full">
              {round}
            </Badge>
          </div>
          <InterviewKebabMenu interviewId={id} />
        </div>
      </ItemActions>
    </Item>
  )
}
