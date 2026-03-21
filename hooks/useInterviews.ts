import { getInterviewsByUserId } from "@/lib/data-service"
import { useQuery } from "@tanstack/react-query"

export function useInterviews(userId: string) {
  return useQuery({
    queryKey: ["interviews", userId],
    queryFn: () => getInterviewsByUserId(userId),
  })
}
