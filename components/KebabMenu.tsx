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
  const [sheetOpen, setSheetOpen] = useState(false)

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
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSheetOpen(true)}>
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
      <EditApplicationSheet
        userId={userId}
        applicationId={applicationId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
      <DeleteApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDelete={onDelete}
      />
    </>
  )
}
