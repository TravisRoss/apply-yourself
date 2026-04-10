"use client"

import { useScrollGuard } from "@/hooks/useScrollGuard"
import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import EditContactSheet from "./EditContactSheet"

type KebabMenuProps = {
  onDelete: () => void
  contactId: string
}

export default function KebabMenu({ onDelete, contactId }: KebabMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const t = useTranslations("contacts.kebab")
  const tCommon = useTranslations("common")
  const scrollGuard = useScrollGuard(() => setDropdownOpen(true))

  function handleDelete(event: Event) {
    // Prevents Radix from auto-closing the dropdown, letting the dialog's
    // focus trap take over instead of the dropdown's focus restoration.
    event.preventDefault()
    setDialogOpen(true)
  }

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
          <DropdownMenuItem onClick={() => setEditSheetOpen(true)}>
            {tCommon("edit")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>
            {tCommon("delete")}
          </DropdownMenuItem>
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
        title={t("deleteTitle")}
        description={t("deleteDescription")}
      />
    </>
  )
}
