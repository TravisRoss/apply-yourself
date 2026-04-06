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
import { useTranslations } from "next-intl"

export default function AddInterviewSheet() {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id
  const [sheetOpen, setSheetOpen] = useState(false)
  const createInterviewMutation = useCreateInterview(userId)
  const { data: applications = [] } = useApplications(userId)
  const isMobile = useIsMobile()
  const hasApplications = applications.length > 0
  const t = useTranslations("interviews")
  const tCommon = useTranslations("common")

  async function handleSubmit(formData: InterviewFormData) {
    await createInterviewMutation.mutateAsync(formData)
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
        {hasApplications ? (
          <>
            <InterviewForm
              applications={applications}
              onHandleSubmit={handleSubmit}
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
            <Button asChild variant="outline" onClick={() => setSheetOpen(false)}>
              <Link href="/applications">{t("add.goToApplications")}</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
