"use client"

import { PageShell } from "@/components/layout/PageShell"
import ProfileForm from "@/components/settings/ProfileForm"
import ToggleRow from "@/components/settings/ToggleRow"
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  useDeleteAccount,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/hooks/useSettings"
import { useSession } from "@/lib/auth-client"
import { NotificationPreferencesFormData } from "@/lib/zod"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

export default function SettingsPage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const deleteAccountMutation = useDeleteAccount()
  const { data: notificationPreferences } = useNotificationPreferences(userId)
  const updateNotificationPreferences = useUpdateNotificationPreferences(userId)

  const { control, handleSubmit, reset } =
    useForm<NotificationPreferencesFormData>({
      defaultValues: { interviewReminders: false, weeklySummary: false },
    })

  useEffect(() => {
    if (
      notificationPreferences !== undefined &&
      notificationPreferences !== null
    ) {
      reset({
        interviewReminders: notificationPreferences.interviewReminders,
        weeklySummary: notificationPreferences.weeklySummary,
      })
    }
  }, [notificationPreferences, reset])

  function handleDeleteAccount() {
    if (userId === undefined) return
    deleteAccountMutation.mutate({ userId })
  }

  function handleSaveNotifications(values: NotificationPreferencesFormData) {
    updateNotificationPreferences.mutate(values)
  }

  return (
    <PageShell title="Settings">
      <div className="max-w-lg space-y-4">
        <h2>Profile</h2>
        <ProfileForm />
        <Separator />
        <h2>Notifications</h2>
        <form onSubmit={handleSubmit(handleSaveNotifications)}>
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="interviewReminders"
              render={({ field }) => (
                <ToggleRow
                  title="Interview reminders"
                  description="Get reminded 24 hours before interviews"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="weeklySummary"
              render={({ field }) => (
                <ToggleRow
                  title="Weekly summary"
                  description="Receive a weekly summary of your job search"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <Button
            type="submit"
            className="mt-4"
            disabled={updateNotificationPreferences.isPending}
          >
            Save Notifications
          </Button>
        </form>
        <Separator />
        <h2>Appearance</h2>
        <ToggleRow
          title="Dark mode"
          description="Toggle between light and dark mode"
          checked={theme === "dark"}
          onCheckedChange={() => {
            setTheme(theme === "light" ? "dark" : "light")
          }}
        />
        <Separator />
        <h2 className="text-destructive">Danger Zone</h2>
        <div className="flex items-center justify-between rounded-md border border-red-300 bg-red-50 p-4 text-xs dark:border-red-800 dark:bg-red-950">
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
