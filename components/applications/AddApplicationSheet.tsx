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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import AddApplicationForm from "./AddApplicationForm"

export default function AddApplicationSheet() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const createApplicationMutation = useCreateApplication()
  const t = useTranslations("applications")
  const tCommon = useTranslations("common")
  const isMobile = useIsMobile()

  function handleSubmit(formData: ApplicationFormData) {
    createApplicationMutation.mutateAsync(formData)
    setSheetOpen(false)
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
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">{t("add.title")}</SheetTitle>
          <SheetDescription>{t("add.description")}</SheetDescription>
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
