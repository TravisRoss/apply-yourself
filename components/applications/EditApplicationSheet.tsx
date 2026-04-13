"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useApplication, useUpdateApplication } from "@/hooks/useApplications"
import { ApplicationFormData } from "@/lib/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import AddApplicationForm from "./AddApplicationForm"

type EditApplicationSheetProps = {
  applicationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditApplicationSheet({
  applicationId,
  open,
  onOpenChange,
}: EditApplicationSheetProps) {
  const editApplicationMutation = useUpdateApplication()
  const { data: application } = useApplication(applicationId)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const t = useTranslations("applications")
  const tCommon = useTranslations("common")

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
        <SheetHeader>
          <SheetTitle>{t("edit.title")}</SheetTitle>
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
            {tCommon("cancel")}
          </Button>
          <Button
            variant="default"
            type="submit"
            form="add-application-form"
            disabled={!isFormDirty}
          >
            {tCommon("save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
