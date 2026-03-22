"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Button } from "./ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import AddApplicationForm from "./AddApplicationForm"
import { useApplication, useUpdateApplication } from "@/hooks/useApplications"
import { ApplicationFormData } from "@/lib/zod"
import { useState } from "react"

type EditApplicationSheetProps = {
  userId: string
  applicationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditApplicationSheet({
  userId,
  applicationId,
  open,
  onOpenChange,
}: EditApplicationSheetProps) {
  const editApplicationMutation = useUpdateApplication(userId)
  const { data: application } = useApplication(applicationId)
  const [isFormDirty, setIsFormDirty] = useState(false)

  function handleSubmit(formData: ApplicationFormData) {
    editApplicationMutation.mutateAsync({ applicationId, formData })
    onOpenChange(false)
  }

  const formData: ApplicationFormData | undefined = application
    ? {
        company: application.company,
        position: application.position,
        status: application.status,
        appliedDate: new Date(application.appliedDate),
        source: application.source,
        jobType: application.jobType,
        location: application.location ?? "",
        salary: application.salary ?? "",
        url: application.url ?? "",
        notes: application.notes ?? "",
      }
    : undefined

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={useIsMobile() ? "bottom" : "right"}
        className={useIsMobile() ? "max-h-[85dvh]" : undefined}
      >
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">Edit application</SheetTitle>
          <SheetDescription>Make changes to the application.</SheetDescription>
        </SheetHeader>
        {formData && (
          <AddApplicationForm
            onHandleSubmit={handleSubmit}
            application={formData}
            onDirtyChange={setIsFormDirty}
          />
        )}
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            type="submit"
            form="add-application-form"
            disabled={!isFormDirty}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
