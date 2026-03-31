import { useDeleteInterview } from "@/hooks/useInterviews"
import { useSession } from "@/lib/auth-client"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

type InterviewKebabMenuProps = {
  interviewId: string
}

export default function InterviewKebabMenu({
  interviewId,
}: InterviewKebabMenuProps) {
  const { data: session } = useSession()
  const userId = session?.user.id
  const [dialogOpen, setDialogOpen] = useState(false)
  const { mutate: deleteInterview } = useDeleteInterview(userId)

  function handleDelete(event: Event) {
    // Prevents Radix from auto-closing the dropdown
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
          <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
