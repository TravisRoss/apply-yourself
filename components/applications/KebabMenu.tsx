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
import EditApplicationSheet from "./EditApplicationSheet"
import ViewApplicationSheet from "./ViewApplicationSheet"

type KebabMenuProps = {
  onDelete: () => void
  applicationId: string
}

export default function KebabMenu({ onDelete, applicationId }: KebabMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [viewSheetOpen, setViewSheetOpen] = useState(false)
  const t = useTranslations("applications.kebab")
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
          <DropdownMenuItem onClick={() => setViewSheetOpen(true)}>
            {t("viewDetails")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditSheetOpen(true)}>
            {tCommon("edit")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>
            {tCommon("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewApplicationSheet
        applicationId={applicationId}
        open={viewSheetOpen}
        onOpenChange={setViewSheetOpen}
        onEditSheetOpen={setEditSheetOpen}
      />
      <EditApplicationSheet
        applicationId={applicationId}
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
