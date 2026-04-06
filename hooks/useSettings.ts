import {
  deleteAccount,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/data/settings"
import { queryKeys } from "@/lib/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useDeleteAccount() {
  const router = useRouter()
  const t = useTranslations("settings.toasts")

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => deleteAccount(userId),
    onSuccess: () => {
      router.push("/sign-in")
    },
    onError: () => {
      toast.error(t("deleteAccountFailed"))
    },
  })
}

export function useNotificationPreferences(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.notificationPreferences(userId ?? ""),
    queryFn: () => getNotificationPreferences(userId!),
    enabled: userId !== undefined,
  })
}

export function useUpdateNotificationPreferences(userId: string | undefined) {
  const queryClient = useQueryClient()
  const t = useTranslations("settings.toasts")

  return useMutation({
    mutationFn: (data: {
      interviewReminders: boolean
      weeklySummary: boolean
    }) => {
      if (userId === undefined) throw new Error("User not authenticated")
      return updateNotificationPreferences(userId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationPreferences(userId ?? ""),
      })
      toast.success(t("notificationsSaved"))
    },
    onError: () => {
      toast.error(t("notificationsFailed"))
    },
  })
}
