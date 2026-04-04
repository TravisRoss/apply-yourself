"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useApplications } from "@/hooks/useApplications"
import { useInterview, useUpdateInterview } from "@/hooks/useInterviews"
import { useSession } from "@/lib/auth-client"
import { InterviewFormData } from "@/lib/zod"
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
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id
  const { data: interview } = useInterview(interviewId)
  const { data: applications = [] } = useApplications(userId)
  const updateInterviewMutation = useUpdateInterview(userId)
  const isMobile = useIsMobile()
  const [isFormDirty, setIsFormDirty] = useState(false)

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
          <SheetTitle className="text-lg">Edit interview</SheetTitle>
          <SheetDescription>Make changes to the interview.</SheetDescription>
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
            Cancel
          </Button>
          <Button variant="default" type="submit" form="add-interview-form" disabled={!isFormDirty}>
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
