import { cn, STATUS_CLASSES } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { ApplicationStatus } from "@/generated/prisma/enums"

type StatusBadgeProps = {
  status: ApplicationStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_CLASSES[status], "h-6 text-xs capitalize")}
    >
      &bull; {status}
    </Badge>
  )
}
