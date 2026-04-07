"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useApplications } from "@/hooks/useApplications"
import { useInterview, useUpdateInterview } from "@/hooks/useInterviews"
import { InterviewFormData } from "@/lib/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import InterviewForm from "./InterviewForm"

type EditInterviewSheetProps = {
  interviewId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditInterviewSheet({
  interviewId,
  open,
  onOpenChange,
}: EditInterviewSheetProps) {
  const { data: interview } = useInterview(interviewId)
  const { data: applications = [] } = useApplications()
  const updateInterviewMutation = useUpdateInterview()
  const isMobile = useIsMobile()
  const [isFormDirty, setIsFormDirty] = useState(false)
  const t = useTranslations("interviews")
  const tCommon = useTranslations("common")

  async function handleSubmit(formData: InterviewFormData) {
    await updateInterviewMutation.mutateAsync({ interviewId, formData })
    onOpenChange(false)
  }

  const defaultValues = interview
    ? {
        applicationId: interview.applicationId,
        date: new Date(interview.date),
        type: interview.type,
        round: interview.round,
        notes: interview.notes ?? "",
        time: new Date(interview.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      }
    : undefined

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[85dvh]" : undefined}
      >
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">{t("edit.title")}</SheetTitle>
          <SheetDescription>{t("edit.description")}</SheetDescription>
        </SheetHeader>
        {defaultValues !== undefined && (
          <InterviewForm
            applications={applications}
            onHandleSubmit={handleSubmit}
            defaultValues={defaultValues}
            onDirtyChange={setIsFormDirty}
          />
        )}
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button variant="default" type="submit" form="add-interview-form" disabled={!isFormDirty}>
            {tCommon("save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
