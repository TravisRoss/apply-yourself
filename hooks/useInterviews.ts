import { Interview } from "@/generated/prisma/client"
import {
  createInterview,
  getInterviewsByUserId,
  getInterviewsThisWeek,
} from "@/lib/data-service"
import { queryKeys } from "@/lib/query-keys"
import { InterviewFormData } from "@/lib/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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

export function useCreateInterview(userId: string | undefined) {
  const queryClient = useQueryClient()

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
      toast("Added interview successfully")
    },
    onError: (error, _vars, context) => {
      toast("Interview could not be added.")
      console.error("Interview addition failed with error: ", error)
      queryClient.setQueryData(queryKeys.interviews(userId!), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews(userId!) })
    },
  })
}
