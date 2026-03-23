import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { MoreHorizontal } from "lucide-react"

import { useState } from "react"

import EditApplicationSheet from "./EditApplicationSheet"
import DeleteApplicationDialog from "./DeleteApplicationDialog"
import ViewApplicationSheet from "./ViewApplicationSheet"

type KebabMenuProps = {
  onDelete: () => void
  applicationId: string
  userId: string
}

export default function KebabMenu({
  onDelete,
  applicationId,
  userId,
}: KebabMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [viewSheetOpen, setViewSheetOpen] = useState(false)

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
          <DropdownMenuItem onClick={() => setViewSheetOpen(true)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditSheetOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setDialogOpen(true)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewApplicationSheet
        userId={userId}
        applicationId={applicationId}
        open={viewSheetOpen}
        onOpenChange={setViewSheetOpen}
        onEditSheetOpen={setEditSheetOpen}
      />
      <EditApplicationSheet
        userId={userId}
        applicationId={applicationId}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
      />
      <DeleteApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDelete={onDelete}
      />
    </>
  )
}
