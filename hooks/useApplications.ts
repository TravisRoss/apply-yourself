import { getApplicationsByUserId } from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"

export function useApplications(userId: string) {
  return useQuery({
    queryKey: ["applications", userId],
    queryFn: () => getApplicationsByUserId(userId),
  })
}
