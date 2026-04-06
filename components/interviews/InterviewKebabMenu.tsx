"use client"

import { useDeleteInterview } from "@/hooks/useInterviews"
import { useSession } from "@/lib/auth-client"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import EditInterviewSheet from "./EditInterviewSheet"
import { useTranslations } from "next-intl"

type InterviewKebabMenuProps = {
  interviewId: string
}

export default function InterviewKebabMenu({
  interviewId,
}: InterviewKebabMenuProps) {
  const { data: session } = useSession()
  const userId = session?.user.id
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const { mutate: deleteInterview } = useDeleteInterview(userId)
  const t = useTranslations("interviews.kebab")
  const tCommon = useTranslations("common")

  function handleEdit() {
    setEditSheetOpen(true)
  }

  function handleDelete() {
    setDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            aria-label={tCommon("openMenu")}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleEdit}>{tCommon("edit")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>{tCommon("delete")}</DropdownMenuItem>
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
