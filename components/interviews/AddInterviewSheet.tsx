"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useApplications } from "@/hooks/useApplications"
import { useCreateInterview } from "@/hooks/useInterviews"
import { InterviewFormData } from "@/lib/zod"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
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
import InterviewForm from "./InterviewForm"

import { useTranslations } from "next-intl"

type Application = { id: string; company: string; position: string }

type AddInterviewSheetProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  lockedApplication?: Application
}

export default function AddInterviewSheet({
  open,
  onOpenChange,
  lockedApplication,
}: AddInterviewSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const sheetOpen = open ?? internalOpen
  const setSheetOpen = onOpenChange ?? setInternalOpen

  const createInterviewMutation = useCreateInterview()
  const { data: applications = [] } = useApplications()
  const isMobile = useIsMobile()
  const hasApplications = lockedApplication !== undefined || applications.length > 0
  const isControlled = open !== undefined
  const t = useTranslations("interviews")
  const tCommon = useTranslations("common")

  async function handleSubmit(formData: InterviewFormData) {
    await createInterviewMutation.mutateAsync(formData)
    setSheetOpen(false)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      {!isControlled && (
        <SheetTrigger asChild>
          <Button variant="default" onClick={() => setSheetOpen(true)}>
            <PlusIcon /> {t("add.trigger")}
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[85dvh]" : undefined}
      >
        <SheetHeader>
          <SheetTitle>{t("add.title")}</SheetTitle>
        </SheetHeader>
        {hasApplications ? (
          <>
            <InterviewForm
              applications={applications}
              onHandleSubmit={handleSubmit}
              lockedApplication={lockedApplication}
            />
            <SheetFooter>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button variant="default" type="submit" form="add-interview-form">
                {tCommon("save")}
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t("add.noApplications")}
            </p>
            <Button
              asChild
              variant="outline"
              onClick={() => setSheetOpen(false)}
            >
              <Link href="/applications">{t("add.goToApplications")}</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
