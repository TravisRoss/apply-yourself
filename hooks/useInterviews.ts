import { Interview } from "@/generated/prisma/client"
import {
  createInterview,
  deleteInterview,
  getInterviewById,
  getInterviewsByUserId,
  getInterviewsThisWeek,
  updateInterview,
} from "@/lib/data/interviews"
import { queryKeys } from "@/lib/query-keys"
import { InterviewFormData } from "@/lib/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export function useInterview(interviewId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.interview(interviewId!),
    queryFn: () => getInterviewById(interviewId!),
    enabled: !!interviewId,
  })
}

export function useInterviews(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.interviews(userId!),
    queryFn: () => getInterviewsByUserId(userId!),
    enabled: !!userId,
  })
}

export function useInterviewsThisWeek(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.interviewsThisWeek(userId!),
    queryFn: () => getInterviewsThisWeek(userId!),
    enabled: !!userId,
  })
}

export function useDeleteInterview(userId: string | undefined) {
  const queryClient = useQueryClient()
  const t = useTranslations("interviews.toasts")

  return useMutation({
    mutationFn: (interviewId: string) => deleteInterview(interviewId),
    onSuccess: () => {
      toast(t("deleted"))
    },
    onError: (error) => {
      toast(t("deleteFailed"))
      console.error("Interview deletion failed with error: ", error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews(userId!) })
    },
  })
}

export function useCreateInterview(userId: string | undefined) {
  const queryClient = useQueryClient()
  const t = useTranslations("interviews.toasts")

  return useMutation({
    mutationFn: (formData: InterviewFormData) => createInterview(formData),
    onMutate: async (formData: InterviewFormData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.interviews(userId!),
      })
      const previous = queryClient.getQueryData<Interview[]>([
        "interviews",
        userId,
      ])
      queryClient.setQueryData(
        queryKeys.interviews(userId!),
        (existing: Interview[] = []) => [
          ...existing,
          {
            ...formData,
          },
        ]
      )
      return { previous }
    },
    onSuccess: () => {
      toast(t("created"))
    },
    onError: (error, _vars, context) => {
      toast(t("createFailed"))
      console.error("Interview addition failed with error: ", error)
      queryClient.setQueryData(queryKeys.interviews(userId!), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews(userId!) })
    },
  })
}

export function useUpdateInterview(userId: string | undefined) {
  const queryClient = useQueryClient()
  const t = useTranslations("interviews.toasts")

  return useMutation({
    mutationFn: async ({
      interviewId,
      formData,
    }: {
      interviewId: string
      formData: InterviewFormData
    }) => updateInterview(interviewId, formData),
    onMutate: async ({
      interviewId,
      formData,
    }: {
      interviewId: string
      formData: InterviewFormData
    }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.interviews(userId!),
      })
      const previous = queryClient.getQueryData<Interview[]>([
        "interviews",
        userId,
      ])
      queryClient.setQueryData(
        queryKeys.interviews(userId!),
        (existing: Interview[] = []) =>
          existing.map((interview) =>
            interview.id === interviewId
              ? { ...interview, ...formData }
              : interview
          )
      )
      return { previous }
    },
    onSuccess: () => {
      toast(t("updated"))
    },
    onError: (error, _vars, context) => {
      toast(t("updateFailed"))
      console.error("Interview update failed with error: ", error)
      queryClient.setQueryData(queryKeys.interviews(userId!), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews(userId!) })
    },
  })
}
