"use client"

import { useScrollGuard } from "@/hooks/useScrollGuard"
import { useDeleteInterview } from "@/hooks/useInterviews"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import EditInterviewSheet from "./EditInterviewSheet"

type InterviewKebabMenuProps = {
  interviewId: string
}

export default function InterviewKebabMenu({
  interviewId,
}: InterviewKebabMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const { mutate: deleteInterview } = useDeleteInterview()
  const t = useTranslations("interviews.kebab")
  const tCommon = useTranslations("common")
  const scrollGuard = useScrollGuard(() => setDropdownOpen(true))

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 touch-none text-muted-foreground"
            aria-label={tCommon("openMenu")}
            {...scrollGuard}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditSheetOpen(true)}>
            {tCommon("edit")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
            {tCommon("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditInterviewSheet
        interviewId={interviewId}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
      />
      <DeleteConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDelete={() => deleteInterview(interviewId)}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
      />
    </>
  )
}
