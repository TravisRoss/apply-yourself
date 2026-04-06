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
import Link from "next/link"

export default function AddInterviewSheet() {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id
  const [sheetOpen, setSheetOpen] = useState(false)
  const createInterviewMutation = useCreateInterview(userId)
  const { data: applications = [] } = useApplications(userId)
  const isMobile = useIsMobile()
  const hasApplications = applications.length > 0

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
        {hasApplications ? (
          <>
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
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-muted-foreground">
              You need at least one application before you can schedule an
              interview.
            </p>
            <Button asChild variant="outline" onClick={() => setSheetOpen(false)}>
              <Link href="/applications">Go to Applications</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
