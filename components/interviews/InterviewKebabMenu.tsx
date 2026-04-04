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

  function handleEdit(event: Event) {
    event.preventDefault()
    setEditSheetOpen(true)
  }

  function handleDelete(event: Event) {
    event.preventDefault()
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
            aria-label="Open menu"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
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
        title="Delete this interview?"
        description="This action cannot be undone. This will permanently delete the interview."
      />
    </>
  )
}
