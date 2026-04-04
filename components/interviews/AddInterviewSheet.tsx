"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Button } from "../ui/button"
import { PlusIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import InterviewForm from "./InterviewForm"
import { useCreateInterview } from "@/hooks/useInterviews"
import { useApplications } from "@/hooks/useApplications"
import { InterviewFormData } from "@/lib/zod"
import { useSession } from "@/lib/auth-client"

export default function AddInterviewSheet() {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id
  const [sheetOpen, setSheetOpen] = useState(false)
  const createInterviewMutation = useCreateInterview(userId)
  const { data: applications = [] } = useApplications(userId)
  const isMobile = useIsMobile()

  async function handleSubmit(formData: InterviewFormData) {
    await createInterviewMutation.mutateAsync(formData)
    setSheetOpen(false)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="default" onClick={() => setSheetOpen(true)}>
          <PlusIcon /> Schedule interview
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[85dvh]" : undefined}
      >
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">Schedule interview</SheetTitle>
          <SheetDescription>Schedule a new interview.</SheetDescription>
        </SheetHeader>
        <InterviewForm
          applications={applications}
          onHandleSubmit={handleSubmit}
        />
        <SheetFooter>
          <Button variant="outline" onClick={() => setSheetOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" type="submit" form="add-interview-form">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
