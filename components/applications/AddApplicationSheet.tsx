"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useCreateApplication } from "@/hooks/useApplications"
import { ApplicationFormData } from "@/lib/zod"
import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import AddApplicationForm from "./AddApplicationForm"

type Application = { id: string; company: string; position: string }

type AddApplicationSheetProps = {
  onApplicationCreated?: (application: Application) => void
}

export default function AddApplicationSheet({
  onApplicationCreated,
}: AddApplicationSheetProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const createApplicationMutation = useCreateApplication()
  const t = useTranslations("applications")
  const tCommon = useTranslations("common")
  const isMobile = useIsMobile()

  async function handleSubmit(formData: ApplicationFormData) {
    const application = await createApplicationMutation.mutateAsync(formData)
    setSheetOpen(false)
    if (application !== undefined && application.status === "interview") {
      const created = { id: application.id, company: application.company, position: application.position }
      setTimeout(() => onApplicationCreated?.(created), 200)
    }
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="default" onClick={() => setSheetOpen(true)}>
          <PlusIcon /> {t("add.trigger")}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[85dvh]" : undefined}
      >
        <SheetHeader>
          <SheetTitle>{t("add.title")}</SheetTitle>
        </SheetHeader>
        <AddApplicationForm onHandleSubmit={handleSubmit} />
        <SheetFooter>
          <Button variant="outline" onClick={() => setSheetOpen(false)}>
            {tCommon("cancel")}
          </Button>
          <Button variant="default" type="submit" form="add-application-form">
            {tCommon("save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
