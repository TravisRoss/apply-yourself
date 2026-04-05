"use client"

import { PageShell } from "@/components/layout/PageShell"
import ProfileForm from "@/components/settings/ProfileForm"
import ToggleRow from "@/components/settings/ToggleRow"
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function SettingsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  function handleDeleteAccount() {}

  return (
    <PageShell title="Settings">
      <div className="max-w-lg space-y-4">
        <h2>Profile</h2>
        <ProfileForm />
        <Separator />
        <h2>Notifications</h2>
        <div className="flex flex-col gap-2">
          <ToggleRow
            title="Interview reminders"
            description="Get reminded 24 hours before interviews"
          />
          <ToggleRow
            title="Weekly summary"
            description="Receive a weekly summary of your job search"
          />
        </div>
        <Button>Save Notifications</Button>
        <Separator />
        <h2>Appearance</h2>
        <ToggleRow
          title="Dark mode"
          description="Toggle between light and dark mode"
        />
        <Button>Save Appearance</Button>
        <Separator />
        <h2>Danger Zone</h2>
        <div className="flex items-center justify-between rounded-md border border-red-500 bg-red-950 p-4 text-xs">
          <div className="flex flex-col">
            <p className="text-foreground">Delete account</p>
            <p className="text-muted-foreground">
              Permanently delete your account and all data. You will be
              automatically signed out.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
          <DeleteConfirmationDialog
            title="Delete account?"
            description="This action cannot be undone. This will permanently delete your account and all data."
            onDelete={handleDeleteAccount}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </div>
      </div>
    </PageShell>
  )
}
