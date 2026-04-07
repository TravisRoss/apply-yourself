"use client"

import { useApplication } from "@/hooks/useApplications"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import Initials from "../shared/Initials"
import { cn, formatDate } from "@/lib/utils"
import SheetRow from "../shared/SheetRow"
import {
  Calendar,
  CircleDollarSign,
  FileText,
  Laptop,
  MapPin,
  NotepadText,
  SquareArrowRightEnter,
} from "lucide-react"
import { Button } from "../ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import StatusBadge from "../shared/StatusBadge"
import { useTranslations } from "next-intl"

type ViewApplicationSheetProps = {
  applicationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditSheetOpen: (open: boolean) => void
}

export default function ViewApplicationSheet({
  applicationId,
  open,
  onOpenChange,
  onEditSheetOpen,
}: ViewApplicationSheetProps) {
  const { data: application } = useApplication(applicationId)
  const isMobile = useIsMobile()
  const t = useTranslations("applications")
  const tCommon = useTranslations("common")

  if (!application) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader className="border border-border">
          <SheetTitle>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Initials title={application.company} className="h-12 w-12" />
                <div className="flex flex-col">
                  <span className="text-xl">{application.company}</span>
                  <span className="text-muted-foreground">
                    {application.position}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("table.status")}</span>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ul className="flex flex-1 flex-col gap-2 p-6">
          <SheetRow icon={MapPin} label={application.location} />
          <SheetRow
            icon={Calendar}
            label={t("view.appliedOn", { date: formatDate(application.appliedDate) })}
          />
          <SheetRow icon={CircleDollarSign} label={application.salary} />
          <SheetRow icon={FileText} label={application.url} />
          <SheetRow icon={SquareArrowRightEnter} label={application.source} />
          <SheetRow icon={Laptop} label={application.jobType} />
          <SheetRow icon={MapPin} label={application.location} />
          <SheetRow icon={NotepadText} label={application.notes} muted />
        </ul>
        <SheetFooter className="border border-border">
          <Button
            className="w-full"
            onClick={() => {
              onEditSheetOpen(true)
            }}
          >
            {t("view.editButton")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
