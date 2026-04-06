"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import { Button } from "../ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import AddApplicationForm from "./AddApplicationForm"
import { useApplication, useUpdateApplication } from "@/hooks/useApplications"
import { ApplicationFormData } from "@/lib/zod"
import { useTranslations } from "next-intl"
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
  const { data: application } = useApplication(userId, applicationId)
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
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">{t("edit.title")}</SheetTitle>
          <SheetDescription>{t("edit.description")}</SheetDescription>
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
