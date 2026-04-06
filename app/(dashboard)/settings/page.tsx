"use client"

import { PageShell } from "@/components/layout/PageShell"
import LanguageSelect from "@/components/settings/LanguageSelect"
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
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

export default function SettingsPage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const t = useTranslations("settings")
  const { theme, setTheme } = useTheme()

  const deleteAccountMutation = useDeleteAccount()
  const { data: notificationPreferences } = useNotificationPreferences(userId)
  const updateNotificationPreferences = useUpdateNotificationPreferences(userId)

  const { control, handleSubmit, reset } = useForm<NotificationPreferencesFormData>({
    defaultValues: { interviewReminders: false, weeklySummary: false },
  })

  useEffect(() => {
    if (notificationPreferences !== undefined && notificationPreferences !== null) {
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
    <PageShell title={t("title")}>
      <div className="max-w-lg space-y-4">
        <h2>{t("profile.title")}</h2>
        <ProfileForm />
        <Separator />
        <h2>{t("notifications.title")}</h2>
        <form onSubmit={handleSubmit(handleSaveNotifications)}>
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="interviewReminders"
              render={({ field }) => (
                <ToggleRow
                  title={t("notifications.interviewReminders")}
                  description={t("notifications.interviewRemindersDescription")}
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
                  title={t("notifications.weeklySummary")}
                  description={t("notifications.weeklySummaryDescription")}
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
            {t("notifications.save")}
          </Button>
        </form>
        <Separator />
        <h2>Language</h2>
        <LanguageSelect />
        <Separator />
        <h2>{t("appearance.title")}</h2>
        <ToggleRow
          title={t("appearance.darkMode")}
          description={t("appearance.darkModeDescription")}
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
        />
        <Separator />
        <h2 className="text-destructive">{t("dangerZone.title")}</h2>
        <div className="flex items-center justify-between rounded-md border border-red-300 bg-red-50 p-4 text-xs dark:border-red-800 dark:bg-red-950">
          <div className="flex flex-col">
            <p className="text-foreground">{t("dangerZone.deleteAccount")}</p>
            <p className="text-muted-foreground">
              {t("dangerZone.deleteAccountDescription")}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            {t("dangerZone.delete")}
          </Button>
          <DeleteConfirmationDialog
            title={t("dangerZone.deleteTitle")}
            description={t("dangerZone.deleteDescription")}
            onDelete={handleDeleteAccount}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </div>
      </div>
    </PageShell>
  )
}
