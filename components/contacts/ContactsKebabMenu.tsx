import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { useState } from "react"

import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog"
import EditContactSheet from "./EditContactSheet"

type KebabMenuProps = {
  onDelete: () => void
  contactId: string
}

export default function KebabMenu({ onDelete, contactId }: KebabMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  function handleDelete(event: Event) {
    // Prevents Radix from auto-closing the dropdown, letting the dialog's
    // focus trap take over instead of the dropdown's focus restoration.
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
          <DropdownMenuItem onClick={() => setEditSheetOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditContactSheet
        contactId={contactId}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
      />
      <DeleteConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDelete={onDelete}
        title="Delete selected contact?"
        description="This action cannot be undone. This will permanently delete the selected contact."
      />
    </>
  )
}
