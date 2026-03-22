import {
  getInterviewsByUserId,
  getInterviewsThisWeek,
} from "@/lib/data-service"
import { queryKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

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
